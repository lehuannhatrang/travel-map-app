import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  AsyncStorage,
  Image,
  ActivityIndicator
} from "react-native";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import { Block, Checkbox, Text, theme, Card } from "galio-framework";
import { Button, Icon, Input } from "../../components";

import i18n from 'i18n-js';

const { width, height } = Dimensions.get("screen");

const LINE_COLOR = ["blue", "#66ff33", "#99ccff", "#ffff80", "#00e6e6", "#ff9933"]

const defaultInitalRegion = {
    latitude: 10.759954,
    longitude: 106.662334,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
}

class TripRouteMapVIew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialRegion: '',
            currentLocation: '',
            mapType: 'standard',
            route: '',
            start: false,
            finish: false,
            currentDestinationIndex: 0
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        const route = navigation.state.params ? navigation.state.params.route : null;
        this.setState({route})
        AsyncStorage.getItem('currentLocation')
        .then(location => {
            if(!!location) {
                const currentLocation = JSON.parse(location)
                const newInitRegion = {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }
                this.setState({
                    initialRegion: newInitRegion,
                    currentLocation: {
                        latitude: currentLocation.coords.latitude,
                        longitude: currentLocation.coords.longitude,
                    }
                })
            } else {
                this.setState({
                    initialRegion: defaultInitalRegion
                })
            }
        })
        .catch(err => {
            this.setState({initialRegion: defaultInitalRegion})
        })
    }

    movingCurrentLocation() {
        AsyncStorage.getItem('currentLocation')
        .then(location => {
            if(!!location) {
                const currentLocation = JSON.parse(location)
                const newInitRegion = {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }
                this.mapView.animateToRegion(newInitRegion);
            }
        })
        .catch(err => {
        })
    }

    startRoute() {
        this.setState({start: true})
        this.movingCurrentLocation()
    }

    nextRoute() {
        const { route, currentDestinationIndex } = this.state
        let newDestination = currentDestinationIndex
        if(currentDestinationIndex === route.route.length - 1) {
            this.setState({finish: true})
        } else {
            newDestination += 1
            this.setState({currentDestinationIndex: newDestination})
        }
        const focusRegion = {
            latitude: route.route[currentDestinationIndex].place.latitude,
            longitude: route.route[currentDestinationIndex].place.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        }
        this.mapView.animateToRegion(focusRegion);
    }

    render() {
        const { initialRegion, mapType, route, start, currentDestinationIndex, currentLocation, finish } = this.state;
        if(!!route) {
            console.log(route.route[currentDestinationIndex])
        }
        const { places } = this.props;
        return (
            <View style={styles.container}>
                {!!initialRegion && 
                <>
                    <MapView 
                    ref = {(ref)=> this.mapView=ref}
                    style={styles.mapStyle} initialRegion={initialRegion} 
                    showsUserLocation={true} followUserLocation={true} mapType={mapType}
                    >
                        {route.route.map((place, index) => (
                            <Marker 
                            key={`place-${index}`}
                            coordinate={{
                                latitude: parseFloat(place.place.latitude),
                                longitude: parseFloat(place.place.longitude),
                            }} 
                            isPreselected={true} 
                            title={place.place.name} 
                            description={place.place.address}>
                                <View style={styles.placeTitleContent}>
                                    <Image source={require('../../assets/imgs/pin_icon.png')} style={{height: 35, width:35 }} />
                                    <Text style={styles.placeTitle}>{place.place.name}</Text>
                                </View>
                            </Marker>
                        ))}
                        {!start && route.route.map((place, index) => 
                            <>
                                {index > 0 && <MapViewDirections
                                    key={`direction-${index}`}
                                    origin={{
                                        latitude: parseFloat(route.route[index-1].place.latitude),
                                        longitude: parseFloat(route.route[index-1].place.longitude),
                                    }}
                                    destination={{
                                        latitude: parseFloat(place.place.latitude),
                                        longitude: parseFloat(place.place.longitude),
                                    }}
                                    apikey={'AIzaSyCNlPrpNK1ZqynQJJcdDwiowCzS_AViU-Q'}
                                    strokeWidth={6}
                                    strokeColor={LINE_COLOR[index]}
                                />}
                            </>
                        )}
                        {!!start && <MapViewDirections
                            key={`direction-route`}
                            origin={currentDestinationIndex === 0 ? currentLocation : {
                                latitude: parseFloat(route.route[currentDestinationIndex-1].place.latitude),
                                longitude: parseFloat(route.route[currentDestinationIndex-1].place.longitude),
                            }}
                            destination={{
                                latitude: parseFloat(route.route[currentDestinationIndex].place.latitude),
                                longitude: parseFloat(route.route[currentDestinationIndex].place.longitude),
                            }}
                            apikey={'AIzaSyCNlPrpNK1ZqynQJJcdDwiowCzS_AViU-Q'}
                            strokeWidth={6}
                            strokeColor={"#00e6e6"}
                        />}
                    </MapView>
                    <Button onlyIcon icon="my-location" iconFamily="MaterialIcons" iconSize={30} color="white" 
                    iconColor="black" style={styles.currentLocationButton} onPress={() => this.movingCurrentLocation()}>
                        Location
                    </Button>
                    {!start && <Button uppercase
                    style={styles.startTripButton} onPress={() => this.startRoute()}>
                        Start
                    </Button>}
                    {!!start && <>
                        <Button uppercase
                        style={styles.startTripButton} onPress={() => this.nextRoute()}>
                            Next
                        </Button>
                    </>}
                    {!!finish && 
                    <Button uppercase
                    style={styles.startTripButton} onPress={() => this.nextRoute()}>
                            Finish
                    </Button>
                    }
                </>
                }
                {!initialRegion && <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 100}} />}
            </View>
        );
    }
}

TripRouteMapVIew.defaultProps = {
    places: []
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapStyle: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    placeTitleContent: {
        alignItems: 'center', 
        justifyContent: 'center',
        display: "flex", 
        // flexDirection: "row"
    },
    placeTitle : {
        fontSize: 10,
        color:'red',
        fontWeight: '600',
    },
    currentLocationButton: { 
        width: 60, 
        height: 60,
        position: 'absolute',
        bottom: 60,
        right: 50 
    },
    startTripButton: { 
        width: "100%", 
        height: 45,
        position: 'absolute',
        bottom: 0,
        left: 0 
    },
});

export default TripRouteMapVIew;
