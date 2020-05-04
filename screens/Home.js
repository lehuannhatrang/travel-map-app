import React from 'react';
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
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
      places: [],
      isRefreshing: false,
    }
    this.renderRefreshIndicator = this.renderRefreshIndicator.bind(this);
    this.getRecommenderPlaces = this.getRecommenderPlaces.bind(this);
  }

  componentDidMount() {
    this.getRecommenderPlaces()
  }

  getRecommenderPlaces() {
    const max = 10;
    const min = 7;
    HttpUtil.getJsonAuthorization('/places/criterial-base/list', {
      spacePoint: Math.floor(Math.random()*(max-min+1)+min), 
      locationPoint: Math.floor(Math.random()*(max-min+1)+min),
      qualityPoint: Math.floor(Math.random()*(max-min+1)+min), 
      servicePoint: Math.floor(Math.random()*(max-min+1)+min), 
      pricePoint: Math.floor(Math.random()*(max-min+1)+min) 
    })
    .then(result => {
      const suggestedPlaces = result.places;
      const ratingPoints = result.ratingPoints;
      const places = suggestedPlaces.map(place => ({
        ...place,
        ...ratingPoints.find(point => point.placeId === place.placeId)
      }))
      this.setState({ places: places})
    })
    .catch(err => {})
  }

  handleOnScroll(contentOffsetY) {
    const { isRefreshing } = this.state;
    if(contentOffsetY < -63 && !isRefreshing) {
      this.setState({isRefreshing: true})
    } 
    else if (contentOffsetY >= -63 && isRefreshing) {
      setTimeout(() => {
        this.setState({isRefreshing: false})
        
      }, 1000);
    }
  }

  onRefresh() {
    this.getRecommenderPlaces()
  }
  
  renderRefreshIndicator() {
    const { isRefreshing } = this.state;
    return (<ActivityIndicator size="large" color="#0000ff" style={{marginTop: 50}} />    )
  }

  renderArticles = () => {
    const { navigation } = this.props;
    const { places, isRefreshing } = this.state;
    return (
      <ScrollView
        scrollEventThrottle={10}
        onScroll={e => this.handleOnScroll(e.nativeEvent.contentOffset.y)}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => this.onRefresh()} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <Block flex>
          {places.length === 0 && <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 50}} />}
          {places.map(place => (
            <Card key={`place-${place.placeId}`} item={place} horizontal onPress={() => {
              navigation.navigate('PlaceDetail', {
                placeId: place.placeId,
              })
            }} />
          ))}
        </Block>
      </ScrollView>
    )
  }

  render() {
    const { isRefreshing } = this.state;
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
