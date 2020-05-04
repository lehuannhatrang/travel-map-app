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

import { Block, Checkbox, Text, theme, Card } from "galio-framework";

import { Button, Icon, Input } from "../../components";
import { argonTheme } from "../../constants";
import i18n from 'i18n-js';

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
            placeCoords: ''
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
    }
    
    movingCurrentLocation() {
        console.log('ok')
        AsyncStorage.getItem('currentLocation')
        .then(location => {
            if(!!location) {
                const currentLocation = JSON.parse(location)
                console.log(currentLocation)
                const newInitRegion = {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }
                this.setState({
                    initialRegion: newInitRegion,
                })
            }
        })
        .catch(err => {
            
        })
    }

    render() {
        const { initialRegion, mapType, placeDetail, placeCoords } = this.state;
        if(!initialRegion) return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 100}} />
            </View>
        )
        else return (
            <View style={styles.container}>
                <MapView style={styles.mapStyle} initialRegion={initialRegion} 
                showsUserLocation={true} followUserLocation={true} mapType={mapType}
                >
                    <Marker coordinate={placeCoords} isPreselected={true} 
                    title={placeDetail.name} description={placeDetail.address}>
                        <Image source={require('../../assets/imgs/pin_icon.png')} style={{height: 35, width:35 }} />
                    </Marker>
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
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
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
