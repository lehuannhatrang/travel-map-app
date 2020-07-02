import React from 'react';
import { 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  ActivityIndicator, 
  RefreshControl,
  View
 } from 'react-native';
import { Block, theme, Text } from 'galio-framework';

import { Card } from '../../components';
import articles from '../../constants/articles';
const { width } = Dimensions.get('screen');
import Tabs from '../../components/Tabs';
import HttpUtil from '../../utils/Http.util';
import Categories from "../../constants/categories";
import { TabView, SceneMap } from 'react-native-tab-view';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      places: [],
      isRefreshing: false,
      chosenCategory: Categories[0].id,
      showCategory: true,
      isLoading: true,
    }
    this.offset = 0
    this.getRecommenderPlaces = this.getRecommenderPlaces.bind(this);
    this.getSearchPlace = this.getSearchPlace.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    if(navigation.state.params && navigation.state.params.keyword && navigation.state.params.keyword !== 'Hồ Chí Minh City') {
      this.getSearchPlace(navigation.state.params.keyword)
    }
    else {
      this.getRecommenderPlaces()
    }

    this.focusListener = navigation.addListener('didFocus', (navigationProps) => {
      if(navigationProps.state.params && navigationProps.state.params.refresh) {
        this.setState({isLoading: true})
        if(!navigationProps.state.params.keyword || (!!navigationProps.state.params.keyword && navigationProps.state.params.keyword === 'Hồ Chí Minh City')) {
          this.getRecommenderPlaces()
        }
        else {
          this.getSearchPlace(navigationProps.state.params.keyword)
        }
        navigation.setParams({refresh: false})
      }
    });
  }

  getSearchPlace(keyword) {
    HttpUtil.getJsonAuthorization('/places/search', {
      keyword
    })
    .then(result => {
      const suggestedPlaces = result.places;
      const ratingPoints = result.ratingPoints;
      const places = suggestedPlaces.map(place => ({
        ...place,
        ...ratingPoints.find(point => point.placeId === place.placeId)
      }))
      this.setState({ 
        isLoading: false,
        places: places.slice(0, 20)
      })
      this.setState({isLoading: false})
    })
  }

  getRecommenderPlaces() {
    const max = 10;
    const min = 7;
    HttpUtil.getJsonAuthorization('/places/recommender-places', {
      // spacePoint: Math.floor(Math.random()*(max-min+1)+min), 
      // locationPoint: Math.floor(Math.random()*(max-min+1)+min),
      // qualityPoint: Math.floor(Math.random()*(max-min+1)+min), 
      // servicePoint: Math.floor(Math.random()*(max-min+1)+min), 
      // pricePoint: Math.floor(Math.random()*(max-min+1)+min) 
    })
    .then(result => {
      const suggestedPlaces = result.places;
      const ratingPoints = result.ratingPoints;
      const places = suggestedPlaces.map(place => ({
        ...place,
        ...ratingPoints.find(point => point.placeId === place.placeId)
      }))
      this.setState({ 
        isLoading: false,
        places: places.slice(0, 20)
      })
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

    this.setState({ showCategory: this.offset > contentOffsetY })

    this.offset = contentOffsetY;
  }

  onRefresh() {
    const { navigation } = this.props;
    if(navigation.state.params && navigation.state.params.keyword && navigation.state.params.keyword !== 'Hồ Chí Minh City') {
      this.getSearchPlace(navigation.state.params.keyword)
    }
    else {
      this.getRecommenderPlaces()
    }
  }

  renderPlaceList = () => {
    const { navigation } = this.props;
    const { places, isRefreshing, isLoading } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView
          scrollEventThrottle={10}
          onScroll={e => this.handleOnScroll(e.nativeEvent.contentOffset.y)}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => this.onRefresh()} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.articles}>
          <Block flex>
            {!!isLoading && <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 50}} />}
            {!isLoading && places.map(place => (
              <Card key={`place-${place.placeId}`} item={place} horizontal onPress={() => {
                navigation.navigate('PlaceDetail', {
                  placeId: place.placeId,
                })
              }} />
              ))}
            {!isLoading && places.length === 0 && <Block middle>
              <Text bold size={24} color={theme.COLORS.MUTED}>Not found</Text>  
            </Block>}
          </Block>
        </ScrollView>
      </View>
    )
  }

  render() {
    const { isRefreshing } = this.state;
    return (
      <Block flex center style={styles.home}>
        {this.renderPlaceList()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  home: {
    width: width,    
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
});

export default Home;
