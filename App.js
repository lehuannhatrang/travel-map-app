import React from 'react';
import { Image, Platform, AsyncStorage } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import { Block, GalioProvider } from 'galio-framework';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import HttpUtils from './utils/Http.util';
import Constants from 'expo-constants';
import {AppContainer, AuthorizeContainer} from './navigation/Screens';
import { Images, articles, argonTheme } from './constants';

// cache app images
const assetImages = [
  Images.Onboarding,
  Images.LogoOnboarding,
  Images.Logo,
  Images.Pro,
  Images.ArgonLogo,
  Images.iOSLogo,
  Images.androidLogo
];

// cache product images
articles.map(article => assetImages.push(article.image));

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      location: null,
      errorMessage: null,
      isAuthorized: false
    }
    this.checkLogin()
  }

  checkLogin() {
    if(!this.state.isAuthorized) {
      AsyncStorage.getItem('accessToken')
      .then(accessToken => {
        console.log(accessToken)
        if(!accessToken) return this.setState({isAuthorized: false});
        HttpUtils.getJsonAuthorization('/isLogin') 
        .then(response => {
          if(response.isLogin) this.setState({isAuthorized: true})
          else AsyncStorage.getItem('accessToken')
        })
        .catch(err => {})
      })
      .catch(err => console.log('err:', err))
    }
    setInterval(() => {
      if(!this.state.isAuthorized) {
        AsyncStorage.getItem('accessToken')
        .then(accessToken => {
          console.log(accessToken)
          if(!accessToken) return this.setState({isAuthorized: false});
          HttpUtils.getJsonAuthorization('/isLogin') 
          .then(response => {
            if(response.isLogin) this.setState({isAuthorized: true})
            else this.setState({isAuthorized: false})
          })
          .catch(err => {})
        })
        .catch(err => console.log('err:', err))
      }
    }, 2000);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    AsyncStorage.getItem('accessToken')
    .then(accessToken => {
      console.log(accessToken)
      if(!accessToken) return this.setState({isAuthorized: false});

      HttpUtils.getJsonAuthorization('/isLogin') 
      .then(response => {
        if(response.data && response.data.isLogin) this.setState({isAuthorized: true})
      })
      .catch(err => {})
    })
    .catch(err => console.log('err:', err))
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      const errorMessage = 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      console.log(errorMessage)
      this.setState({
        errorMessage
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    const address = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    })
    const locationParseString = await JSON.stringify(location);
    const addressParseString = await JSON.stringify(address);
    await AsyncStorage.setItem('currentLocation', locationParseString);
    await AsyncStorage.setItem('currentAddress', addressParseString);
  };
  
  render() {
    if(!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <GalioProvider theme={argonTheme}>
          <Block flex>
            {this.state.isAuthorized && <AppContainer />}
            {!this.state.isAuthorized && <AuthorizeContainer/>}
          </Block>
        </GalioProvider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      ...cacheImages(assetImages),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

}
