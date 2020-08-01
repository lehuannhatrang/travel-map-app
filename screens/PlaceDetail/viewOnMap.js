import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  AsyncStorage,
  Platform,
  Image,
  ActivityIndicator
} from "react-native";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

import { Block, Checkbox, Text, theme, Card } from "galio-framework";

import { Button, Icon, Input } from "../../components";
import { argonTheme } from "../../constants";
import MapViewDirections from 'react-native-maps-directions';
import i18n from 'i18n-js';
import Header from "../../components/Header";

import { HeaderHeight } from "../../constants/utils";

const { width, height } = Dimensions.get("screen");

const defaultInitalRegion = {
    latitude: 10.759954,
    longitude: 106.662334,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
}

class ViewOnMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialRegion: '',
            mapType: 'standard',
            placeDetail: '',
            placeCoords: '',
            currentLocation: ''
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        const placeDetail = this.props.navigation.state.params ? this.props.navigation.state.params.placeDetail : null;
        if(placeDetail) {
            const newInitRegion = {
                latitude: parseFloat(placeDetail.latitude),
                longitude: parseFloat (placeDetail.longitude),
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
            }
            const placeCoords = { 
                latitude: parseFloat(placeDetail.latitude),
                longitude: parseFloat (placeDetail.longitude),
            }
            this.setState({
                initialRegion: newInitRegion,
                placeCoords,
                placeDetail
            })
        } else {

        }

        AsyncStorage.getItem('currentLocation')
        .then(location => {
            if(!!location) {
                const currentLocation = JSON.parse(location)
                this.setState({currentLocation: {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                }})
            }
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
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }
                this.mapView.animateToRegion(newInitRegion);
            }
        })
        .catch(err => {
        })
    }

    render() {
        const { navigation } = this.props;
        const { initialRegion, mapType, placeDetail, placeCoords, animateToRegion, currentLocation } = this.state;
        if(!initialRegion) return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 100}} />
            </View>
        )
        else return (
            <View style={styles.container}>
                {/* <Header title="View on map" navigation={navigation} /> */}
                <MapView 
                ref = {(ref)=> this.mapView=ref}
                style={styles.mapStyle} initialRegion={initialRegion} 
                showsUserLocation={true} followUserLocation={true} mapType={mapType}
                >
                    <Marker coordinate={placeCoords} isPreselected={true} 
                    title={placeDetail.name} description={placeDetail.address}>
                        <Image source={require('../../assets/imgs/pin_icon.png')} style={{height: 35, width:35 }} />
                    </Marker>
                    <MapViewDirections
                        origin={currentLocation}
                        destination={placeCoords}
                        apikey={'AIzaSyCNlPrpNK1ZqynQJJcdDwiowCzS_AViU-Q'}
                        strokeWidth={5}
                        strokeColor={"#E998A1"}
                    />
                </MapView>
                <Button onlyIcon icon="my-location" iconFamily="MaterialIcons" iconSize={30} color="white" 
                iconColor="black" style={styles.currentLocationButton} onPress={() => this.movingCurrentLocation()}>
                    Location
                </Button>
            </View>
        );
    }
}

ViewOnMap.defaultProps = {

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    //   marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
      // marginBottom: -HeaderHeight * 2,
    },
    mapStyle: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    currentLocationButton: { 
        width: 60, 
        height: 60,
        position: 'absolute',
        bottom: 50,
        right: 50 
    }
});

export default ViewOnMap;
