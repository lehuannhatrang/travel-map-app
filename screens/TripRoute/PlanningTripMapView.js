import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator
} from "react-native";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

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

class TripRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialRegion: '',
            mapType: 'standard'
        }
    }

    componentDidMount() {
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
        const { initialRegion, mapType } = this.state;
        const { places } = this.props;
        return (
            <View style={styles.container}>
                {!!initialRegion && 
                    <MapView style={styles.mapStyle} initialRegion={initialRegion} 
                    showsUserLocation={true} followUserLocation={true} mapType={mapType}
                    >
                        {/* <Marker coordinate={initialRegion} title={'Leehun'} description={'ok'} draggable/> */}
                    </MapView>
                }
                {!initialRegion && <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 100}} />}
            </View>
        );
    }
}

TripRoute.defaultProps = {
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
});

export default TripRoute;
