import React from 'react';
import { StyleSheet, Dimensions, ScrollView, AsyncStorage } from 'react-native';
import { Block, theme,  } from 'galio-framework';
import Icon from '../components/Icon';
import Input from '../components/Input';
import argonTheme from '../constants/Theme';
import { Select, Card } from '../components';
import articles from '../constants/articles';
const { width } = Dimensions.get('screen');

class SearchLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      sugestionPlaces: [
        {
          id: 1,
          region:'Hồ Chí Minh City',
          country: 'Việt Nam'
        },
        {
          id: 2,
          region:'Hà Nội',
          country: 'Việt Nam'
        }
      ],
      locationInput: '',
      currentLocation: '',
      currentAddress: ''
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('currentLocation')
    .then(location => {
      this.setState({currentLocation : JSON.parse(location)})
    }) 
    AsyncStorage.getItem('currentAddress')
    .then(address => {
      this.setState({currentAddress : JSON.parse(address)})
    }) 
  }

  handleGetCurrentLocation() {
    const region = this.state.currentAddress[0].region;
    const country = this.state.currentAddress[0].country;
    this.setState({
      locationInput: `${region}, ${country}`
    })
  }

  handleInputChange(value) {
    this.setState({
      locationInput: value
    })
  }

  handleClearInput() {
    this.setState({
      locationInput: ''
    })
  }

  render() {
    const { navigation } = this.props;
    return (
      <Block flex center style={styles.container}>
        <Input
            autoFocus={true}
            right
            type="default"
            color="black"
            style={styles.search}
            placeholder="Where do you want to go?"
            placeholderTextColor={'#8898AA'}
            value={this.state.locationInput}
            onChangeText={(value) => this.handleInputChange(value)}
            iconContent={
            <>
            {this.state.locationInput.length > 0 && <Icon onPress={() => this.handleClearInput()} size={20} color={theme.COLORS.ERROR} 
            style={{marginRight: 10}}
            name="cancel" family="MaterialIcons" />}
            <Icon onPress={() => this.handleGetCurrentLocation()} size={20} color={theme.COLORS.ORANGE} 
            name="my-location" family="MaterialIcons" />
            </>}
        />
        
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.findingResults}>
          <Block flex>
            {this.state.sugestionPlaces.map(place => 
              <Card 
              item={{
                title: `${place.region}, ${place.country}`,
              }} 
              horizontal
              style={styles.suggestPlaces}
              onPress={() => navigation.navigate("Home")} />
            )}
          </Block>        
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        width: width,    
    },
    search: {
      height: 48,
      width: width - 32,
      marginHorizontal: 16,
      marginTop: 30,
      borderWidth: 1,
      borderRadius: 3,
      borderColor: argonTheme.COLORS.BORDER
    },
    articles: {
        width: width - theme.SIZES.BASE * 2,
        paddingVertical: theme.SIZES.BASE,
    },
    cardImageRadius: {

    },
    card: {
      height: 80
    },
    findingResults: {
      width: width - theme.SIZES.BASE * 2,
      paddingVertical: theme.SIZES.BASE/2,
    },
    suggestPlaces: {
      minHeight: 50, 
      paddingTop: 10, 
      paddingLeft: 10, 
      marginTop: 2, 
      marginBottom: 2
    }
});

export default SearchLocation;
