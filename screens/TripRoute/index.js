import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  AsyncStorage,
  ImageBackground,
  DatePickerIOS,
  ActivityIndicator
} from "react-native";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

import { Block, Checkbox, Text, theme, Card } from "galio-framework";

import { Button, Icon, Input } from "../../components";
import { Images, argonTheme } from "../../constants";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import i18n from 'i18n-js';

const { width, height } = Dimensions.get("screen");

const defaultInitalRegion = {
    latitude: 10.759954,
    longitude: 106.662334,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
}

class PickDate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialRegion: '',
            mapType: 'standard',
            chosenDate: new Date(),
            mode: 'date',
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
        const { initialRegion, mapType, mode, date } = this.state;
        const { places } = this.props;
        return (
            <View style={styles.container}>
                <ImageBackground
                source={Images.travelBgBot}
                style={styles.background}
                >
                    <Block center style={{marginTop: 10, flex: 1}}>
                        <Text size={28} color="#1285cb">Pick a date</Text>
                    </Block>
                    <Block center style={{flex: 1}}>
                        <Text size={18} muted>to travel with us</Text>
                    </Block>
                    <Block style={{flex: 10}}>
                        <DatePickerIOS style={styles.datePicker} date={this.state.chosenDate} mode="date" onDateChange={newDate => {}} />
                    </Block>
                    <Block row>
                        <Button style={{width: "100%"}}>
                            <Text size={20} color="white">
                                Let's go
                            </Text>
                        </Button>
                    </Block>
                </ImageBackground>
            </View>
        );
    }
}

PickDate.defaultProps = {
    places: []
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    background: {
      width: "100%",
      height: "auto",
      flex: 1
    },
    mapStyle: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    datePicker: {
        width: "100%",
        color: "white",
        backgroundColor: "rgba(255, 255, 255, 0.4)"
    }
});

export default PickDate;
