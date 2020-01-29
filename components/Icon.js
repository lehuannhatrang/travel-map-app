import React from 'react';
import * as Font from 'expo-font';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { Icon } from 'galio-framework';
import {
  Image,
  StyleSheet
} from 'react-native';
import argonConfig from '../assets/font/argon.json';
import Images from "../constants/Images";

const ArgonExtra = require('../assets/font/argon.ttf');
const IconArgonExtra = createIconSetFromIcoMoon(argonConfig, 'ArgonExtra');

class IconExtra extends React.Component {
  state = {
    fontLoaded: false,
  }

  async componentDidMount() {
    await Font.loadAsync({ ArgonExtra: ArgonExtra });
    this.setState({ fontLoaded: true });
  }

  render() {
    const { name, family, ...rest } = this.props;
    
    if (name && family && this.state.fontLoaded) {
      if (family === 'ArgonExtra') {
        return <IconArgonExtra name={name} family={family} {...rest} />;
      }
      if (name === 'foody-logo') return <Image source={Images.FoodyLogo} style={{...styles.logo, ...this.props.style} }/>
      return <Icon name={name} family={family} {...rest} />;
    }

    return null;
  }
}

const styles = StyleSheet.create({
  logo: {
    height: 15,
    width: 15
  }
})
export default IconExtra;
