import React from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback, View, AsyncStorage } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import * as Location from 'expo-location';
import { getDistance, getPreciseDistance } from 'geolib';

import { argonTheme } from '../constants';
import Icon from './Icon';


class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distance: '',
      cannotFound: false,
    }

    this.getDistance = this.getDistance.bind(this);
  }

  getDistance(item, currentLocation) {
    const promise = new Promise((resolve, reject) => {
        const distance = getPreciseDistance(
          { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
          { latitude: item.latitude, longitude: item.longitude }
        )
        this.setState({distance})
        resolve('done')
    })
    return promise;
  }

  componentDidMount() {
    const { item } = this.props;
    if(item && item.address) {
        AsyncStorage.getItem('currentLocation')
        .then(location => {
            const currentLocation = JSON.parse(location)
            // Location.geocodeAsync(item.address)
            // .then(placeLocation => {
            //   if(!placeLocation[0]) console.log(item.address, placeLocation)
            //   if(placeLocation.length > 0) {
            //     const distance = getPreciseDistance(
            //       { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
            //       { latitude: placeLocation[0].latitude, longitude: placeLocation[0].longitude }
            //     )
            //     this.setState({distance})
            //   }
            // })

            setTimeout(() => {
              if(!this.state.distance && !this.state.cannotFound) {
                this.getDistance(item, currentLocation)
                .then(result => {})
                .catch(err => {})
              }
            }, 200)
            // this.getDistance(item, currentLocation)
            // .then(status => {})
            // .catch(err => {
            //   if(err === "E_RATE_EXCEEDED") {
            //     setTimeout(() => {
            //       this.getDistance(item, currentLocation)
            //       .then(status => {})
            //       .catch(err => {

            //         console.log('den vl')
            //       })
            //     }, 200);
            //   }
            // })
        })
        .catch(err => console.log(err))
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const { navigation, item, horizontal, full, style, ctaColor, imageStyle } = this.props;
    const { distance } = this.state;
    const imageStyles = [
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle
    ];
    const cardContainer = [styles.card, styles.shadow, style];
    const imgContainer = [styles.imageContainer,
      horizontal ? styles.horizontalStyles : styles.verticalStyles,
      styles.shadow
    ];

    const linkTo = item.linkTo ? item.linkTo : 'Pro';
    return (
      <Block row={horizontal} card flex style={cardContainer}>
        {item.mainImgUri && <TouchableWithoutFeedback onPress={() => this.props.onPress()}>
          <Block flex style={imgContainer}>
            <Image source={{uri: item.mainImgUri}} style={imageStyles} />
          </Block>
        </TouchableWithoutFeedback>}
        <TouchableWithoutFeedback onPress={() => this.props.onPress()}>
          <Block flex space="between" style={styles.cardDescription}>

            <Text size={14} style={styles.cardTitle} color={argonTheme.COLORS.ACTIVE} bold numberOfLines={1}>{item.name}</Text>

            {item.avgRating && <View size={12}  style={{flexDirection:'row', flexWrap:'wrap', flex: 1}}> 
              <Icon
                size={14}
                style={{marginRight: 5}}
                color={'#e6e600'}
                name="star"
                family="AntDesign"
              />
              <Text>
                {item.avgRating}
              </Text>
            </View>}

            {item.address && <View size={12}  style={{flexDirection:'row', flexWrap:'wrap', flex: 1}}>
            <Text numberOfLines={1}>  
              <Icon
                size={14}
                style={{marginRight: 5}}
                color={'green'}
                name="map"
                family="Entypo"
              /> {item.address}
              </Text>
            </View>}

            {!!distance && <View size={12}  style={{flexDirection:'row', flexWrap:'wrap'}}>
              <Icon
                size={14}
                style={{marginRight: 5}}
                color={'red'}
                name="location"
                family="Entypo"
              /> 
              <Text muted={!ctaColor} color={ctaColor || argonTheme.COLORS.MUTED}>
                {(distance/1000).toPrecision(2)} KM
              </Text>
            </View>}

          </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

Card.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any,
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
    marginBottom: 16
  },
  cardTitle: {
    flex: 1,
    flexWrap: 'wrap',
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 2
  },
  imageContainer: {
    borderRadius: 3,
    elevation: 1,
    overflow: 'hidden',
  },
  image: {
    // borderRadius: 3,
  },
  horizontalImage: {
    height: 122,
    width: 'auto',
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  fullImage: {
    height: 215
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export default withNavigation(Card);