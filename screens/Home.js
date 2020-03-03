import React from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Block, theme } from 'galio-framework';

import { Card } from '../components';
import articles from '../constants/articles';
const { width } = Dimensions.get('screen');
import categories from "../constants/categories";
import Tabs from '../components/Tabs';
import HttpUtil from '../utils/Http.util';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  componentDidMount() {
    HttpUtil.getJsonAuthorization('/places/criterial-base/list', {
      spacePoint: 8, 
      locationPoint: 9,
      qualityPoint: 10, 
      servicePoint: 7.5, 
      pricePoint: 6.8
    })
  }

  renderArticles = () => {
    const { navigation } = this.props;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <Block flex>
          <Card item={articles[0]} horizontal onPress={() => {
            navigation.navigate('PlaceDetail', {
              placeId: articles[0].placeId,
            })
          }} />
          <Card item={articles[1]} horizontal onPress={() => {
            navigation.navigate('PlaceDetail', {
              placeId: articles[1].placeId,
            })
          }} />
          <Card item={articles[2]} horizontal onPress={() => {
            navigation.navigate('PlaceDetail', {
              placeId: articles[2].placeId,
            })
          }} />
          <Card item={articles[3]} horizontal onPress={() => {
            navigation.navigate('PlaceDetail', {
              placeId: articles[3].placeId,
            })
          }} />
        </Block>
      </ScrollView>
    )
  }

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderArticles()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
});

export default Home;
