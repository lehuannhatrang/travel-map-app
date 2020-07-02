import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback, View } from 'react-native';
import { Block, Text, theme, Button } from 'galio-framework';
import { Icon } from "../components"

import { argonTheme } from '../constants';


class TripCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: ''
    }
  }

  convertToDate(travelDate) {
    const chosenDate = new Date(travelDate);
    return `${chosenDate.getDate()} / ${chosenDate.getMonth()+ 1} / ${chosenDate.getFullYear()}`
  }

  render() {
    const { navigation, style, tripDate, id } = this.props;
    
    const cardContainer = [styles.card, styles.shadow, style];

    return (
      <Block row={true} card style={cardContainer}>
        <Block style={styles.titleContainer}>
          <TouchableWithoutFeedback onPress={() => this.props.onPress(id)}>
            <View style={{flex: 1, flexDirection: 'row' ,justifyContent: 'center', alignItems: 'center'}}>
              <Text size={24} style={styles.cardTitle}>{this.convertToDate(tripDate)}</Text>
            </View>
          </TouchableWithoutFeedback>
        </Block>
        <Button style={styles.deleteButton} color="error" onPress={() => this.props.onDelete(id)}>
          <Icon name="trash" family="EvilIcons" size={30} color='white' />
        </Button>
      </Block>
    );
  }
}

TripCard.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any,
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: 10,
    borderWidth: 0,
    minHeight: 55,

  },
  cardTitle: {
    flex: 1,
    margin: 10
  },
  titleContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  cardDescription: {
    flex: 1,
    height: "100%",
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  deleteButton: {
    flex: 2,
    height: '100%'
  }
});

export default TripCard;