import React from 'react';
import { 
  StyleSheet, 
  View, 
  Dimensions, 
  KeyboardAvoidingView,
  ScrollView, 
  AsyncStorage 
} from 'react-native';
import { Block, theme, Button } from 'galio-framework';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import argonTheme from '../../constants/Theme';
import { Select, DefaultCard } from '../../components';
import articles from '../../constants/articles';
const { width } = Dimensions.get('screen');
const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

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
          region:'Quận 1',
          country: 'HCM'
        },
        {
          id: 3,
          region:'Quận 2',
          country: 'HCM'
        },
        {
          id: 4,
          region:'Quận 3',
          country: 'HCM'
        },
        {
          id: 5,
          region:'Quận 4',
          country: 'HCM'
        },
        {
          id: 6,
          region:'Quận 5',
          country: 'HCM'
        },
        {
          id: 7,
          region:'Quận 6',
          country: 'HCM'
        },
        {
          id: 8,
          region:'Quận 7',
          country: 'HCM'
        },
        {
          id: 9,
          region:'Quận 10',
          country: 'HCM'
        },
        {
          id: 10,
          region:'Quận 11',
          country: 'HCM'
        },
        {
          id: 11,
          region:'Quận 12',
          country: 'HCM'
        },
      ],
      locationInput: '',
      currentLocation: '',
      currentAddress: ''
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    AsyncStorage.getItem('currentLocation')
    .then(location => {
      this.setState({currentLocation : JSON.parse(location)})
    }) 
    AsyncStorage.getItem('currentAddress')
    .then(address => {
      this.setState({currentAddress : JSON.parse(address)})
    }) 
    const keyword = navigation.state.params ? navigation.state.params.keyword || '' : '';
    this.setState({locationInput: keyword})
  }

  handleGetCurrentLocation() {
    if(this.state.currentAddress){
      const region = this.state.currentAddress[0].region;
      const country = this.state.currentAddress[0].country;
      this.setState({
        locationInput: `${region}, ${country}`
      })
    }
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

  handleSubmit() {
    const { navigation } = this.props;
    const { locationInput } = this.state;
    navigation.navigate('Home', {
      refresh: true,
      keyword: locationInput
    })
  }

  handleClickOnSuggestion(keyword) {
    const { navigation } = this.props;
    navigation.navigate('Home', {
      refresh: true,
      keyword
    })
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{flex: 1}}>

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
              {this.state.sugestionPlaces.map((place, index) => 
                <DefaultCard 
                key={`option-${index}`}
                item={{
                  title: `${place.region}, ${place.country}`,
                }} 
                horizontal
                style={styles.suggestPlaces}
                onPress={() => this.handleClickOnSuggestion(place.region)} />
              )}
            </Block>        
          </ScrollView>
        </Block>
        <KeyboardAvoidingView style={{width: "100%"}} behavior='position'>
            <Button onPress={() => this.handleSubmit()} shadowless style={{width: '100%'}}>Apply</Button>
        </KeyboardAvoidingView>
      </View>
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
