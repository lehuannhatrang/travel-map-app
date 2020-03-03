import React from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

import { argonTheme } from '../constants';
import Icon from './Icon';


class Card extends React.Component {
  render() {
    const { navigation, item, horizontal, full, style, ctaColor, imageStyle } = this.props;
    
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
        {item.image && <TouchableWithoutFeedback onPress={() => this.props.onPress()}>
          <Block flex style={imgContainer}>
            <Image source={{uri: item.image}} style={imageStyles} />
          </Block>
        </TouchableWithoutFeedback>}
        <TouchableWithoutFeedback onPress={() => this.props.onPress()}>
          <Block flex space="between" style={styles.cardDescription}>

            <Text size={14} style={styles.cardTitle} color={argonTheme.COLORS.ACTIVE} bold numberOfLines={1}>{item.title}</Text>

            {item.ratingPoint && <Text size={12}  style={{flex: 1}}> 
              <Icon
                size={14}
                style={{marginRight: 10}}
                color={'#e6e600'}
                name="star"
                family="AntDesign"
              /> 
              {item.ratingPoint}
            </Text>}

            {item.address && <Text size={12}  style={{flex: 1}} numberOfLines={1}>{item.address}</Text>}

            {item.distance && <Text size={12} muted={!ctaColor} color={ctaColor || argonTheme.COLORS.MUTED}>{item.distance}</Text>}

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