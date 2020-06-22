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
import { Images, argonTheme } from "../../constants";
import i18n from 'i18n-js';

const { width, height } = Dimensions.get("screen");

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
            mapType: 'standard',
            route: ''
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
                this.setState({initialRegion: newInitRegion})
            } else {
                this.setState({initialRegion: defaultInitalRegion})
            }
        })
        .catch(err => {
            this.setState({initialRegion: defaultInitalRegion})
        })
    }

    render() {
        const { initialRegion, mapType, route } = this.state;
        const { places } = this.props;
        return (
            <View style={styles.container}>
                {!!initialRegion && 
                    <MapView style={styles.mapStyle} initialRegion={initialRegion} 
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
                        {route.route.map((place, index) => 
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
                                    strokeColor={index == 1 ? "#3399ff" : "#00ccff"}
                                />}
                            </>
                        )}
                    </MapView>
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
        fontSize:12,
        color:'red',
        // fontFamily:'Times New Roman',
        // paddingLeft:10,
        // paddingRight:100,
        // textShadowColor:'black',
        // textShadowOffset:{width: 0, height: 0},
        // textShadowRadius: 3,
        fontWeight: '800',
    }
});

export default TripRouteMapVIew;
