import React from "react";
import {
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  Animated,
  ActivityIndicator
} from "react-native";
import { Block, Checkbox, Text, theme, Card } from "galio-framework";

import { Button, Icon, Input } from "../../components";
import { Images, argonTheme } from "../../constants";
import i18n from 'i18n-js';
import Timeline from 'react-native-timeline-flatlist'
import HttpUtil from "../../utils/Http.util";


const thumbMeasure = (width - 48 - 32) / 3;
const { width, height } = Dimensions.get("screen");

const cardWidth = width - theme.SIZES.BASE * 2;

class PlanningTrip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          suggestionRoutes: [],
          routeIndex: 0,
          loading: true,
          travelDate: '',
          tripsId: '',
          preferIndex: []
        }
    }

    componentDidMount() {
      const { navigation } = this.props;

      const id = navigation.state.params ? navigation.state.params.id : null;

      if(!!id) {
        HttpUtil.getJsonAuthorization('/planning-trip', {id})
        .then(data => {
          this.setState({
            travelDate: new Date(data.date),
            suggestionRoutes: data.recommendRoutes,
            loading: false,
            tripsId: data._id,
            preferIndex: data.userPreferenceRouteIndex
          })
        })
      }
      else {
        const travelDate = navigation.state.params ? navigation.state.params.travelDate : null;
  
        this.setState({travelDate})
  
        const defaultPlanning = [
            {
              "id": 0,
              "type": "RESTAURANT",
              "beginTime": "8:00",
              "endTime": "9:00",
              "title": "Ăn sáng",
              "category": [2,3,4,5,10]
            },
            {
              "id": 1,
              "type": "VISIT",
              "beginTime": "9:00",
              "endTime": "12:00",
              "title": "Tham quan",
              "category": [12,13,14,21,22,23,24,32,37,42]
            },
            {
              "id": 0,
              "type": "RESTAURANT",
              "beginTime": "12:00",
              "endTime": "13:00",
              "title": "Bữa trưa",
              "category": [1,2,4,6,7,8,10,25]
            },
            {
              "id": 1,
              "type": "VISIT",
              "beginTime": "13:00",
              "endTime": "17:00",
              "title": "Tham quan",
              "category": [12,13,14,15,21,22,23,24,27,32,37,42]
            },
            {
              "id": 0,
              "type": "RESTAURANT",
              "beginTime": "17:00",
              "endTime": "19:00",
              "title": "Bữa tối",
              "category": [1,2,4,6,7,8,10,25]
            },
            {
              "id": 1,
              "type": "VISIT",
              "beginTime": "19:00",
              "endTime": "22:00",
              "title": "Vui chơi",
              "category": [9,13,15,14,21,27,28,29,37]
            }
        ]
  
        HttpUtil.postJsonAuthorization('/planning-trip/suggestion-trips', {planning: defaultPlanning, travelDate})
        .then(data => {
          this.setState({
            suggestionRoutes: data.routes,
            loading: false,
            tripsId: data.id
          })
        })
      }

    }

    renderScrollDot(index) {
      return (
        <Animated.View
          key={i} 
          style={{ height: 10, width: 10, backgroundColor: '#595959', margin: 8, borderRadius: 5 }}
        />
      )
    }

    handlePressingPlace(placeId) {
      const { navigation } = this.props;
      navigation.navigate('PlaceDetail', {
        placeId,
      })
    }

    convertTimelineData(route) {
      const timelineData = route.route.map(place => ({
       time: place.planning.beginTime,
       title: place.planning.title,
       icon: (
        <View style={{backgroundColor: 'white', paddingVertical: 8, marginTop: 15}}>
          <Image style={{width: 30, height: 30}} source={Images.pinIcon}/>
        </View>),

       description: <TouchableOpacity style={{marginBottom: 20, marginTop: 10}} onPress={() => this.handlePressingPlace(place.place.placeId)}>
           <Block row>
              <Image
               source={{ uri: place.place.mainImgUri}}
               resizeMode="cover"
               style={styles.placeAvatar}
               />
               <Text bold color="#525F7F" style={{marginLeft: 5, flex: 1, flexWrap: 'wrap', marginTop: 5}}>{place.place.name}</Text>
           </Block>
           <Block row style={{marginTop: 5}}>
              <Text color="#525F7F">{place.place.streetAddress}</Text>
           </Block>
           <Block row>
              <Text color="#525F7F">{place.place.addressLocality}</Text>
            </Block>
       </TouchableOpacity>
      }))
      return timelineData
    }

    getPageIndex(xValue, pageWidth) {
      const result = Math.floor(xValue/pageWidth)
      if(result < 0) {
        return 0
      }
      return result
    }

    handleLikeTrip(routeIndex) {
      const { tripsId, preferIndex } = this.state;
      if(preferIndex.includes(routeIndex)) {
        HttpUtil.postJsonAuthorization('/planning-trip/unlike', {
          id: tripsId,
          index: routeIndex,
        })
        .then(data => {
          const preferIndex = data.preferIndex;
          this.setState({preferIndex})
        })
      } 
      else {
        HttpUtil.postJsonAuthorization('/planning-trip/prefer', {
          id: tripsId,
          index: routeIndex,
        })
        .then(data => {
          const preferIndex = data.preferIndex;
          this.setState({preferIndex})
        })
      }
    }

    render() {
      const { suggestionRoutes, routeIndex, loading, travelDate, preferIndex } = this.state;
      const { navigation } = this.props; 
      return (
        <View style={{flex: 1}}>
          <Block flex center style={styles.container}>
            <Block flex={1} style={{marginTop: theme.SIZES.BASE / 2 }}>
              <Block middle style={{marginBottom: 10}}>
                {/* <Text size={18} color={theme.COLORS.PRIMARY} bold style={{marginBottom: 10}}>CONGRATULATION!!</Text> */}
                <Text size={18} color={theme.COLORS.MUTED} style={{marginBottom: 10}}>We have some plans for you</Text>
                {!!travelDate && <Text size={18} color={theme.COLORS.PRIMARY} bold>{`${travelDate.getDate()}/${travelDate.getMonth()+1}/${travelDate.getFullYear()}`}</Text>}

              </Block>
              {!!loading && <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 100, justifySelf: "center"}} />}
              <ScrollView
                style={{height: "80%"}}
                onViewableItemsChanged={(viewableItems, changed) => {}}
                horizontal={true}
                pagingEnabled={true}
                decelerationRate={0}
                overScrollMode="never"
                scrollEventThrottle={16}
                snapToAlignment="center"
                onScroll={e => this.setState({routeIndex: this.getPageIndex(e.nativeEvent.contentOffset.x, width) })}
                showsHorizontalScrollIndicator={false}
                // snapToInterval={cardWidth + theme.SIZES.BASE * 0.375}
                snapToInterval={width}
                contentContainerStyle={{
                  width: width*3,
                  // paddingHorizontal: theme.SIZES.BASE / 2
                  padding: 0
                }}
              > 
                {!loading && suggestionRoutes.map((route, index) => (
                    <Timeline 
                      key={`timeline-${index}`}
                      style={styles.timeline}
                      data={this.convertTimelineData(route)}
                      circleSize={20}
                      circleColor='rgba(0,0,0,0)'
                      // circleColor='rgb(45,156,219)'
                      // lineColor='rgb(45,156,219)'
                      timeContainerStyle={{minWidth:52}}
                      timeStyle={{textAlign: 'center', backgroundColor: theme.COLORS.PRIMARY, color:'white', padding:5, borderRadius:13}}
                      descriptionStyle={{color:'gray'}}
                      options={{
                        style:{}
                      }}
                      innerCircle={'icon'}
                    />
                ))}
              </ScrollView>

            </Block>
          </Block>
          {!loading && 
            <Block row space="around" style={{margin: 0, padding: 0}}>
              <Button size="small" style={{borderRadius: 0, color: theme.COLORS.PRIMARY, padding: 0, margin: 0}}
              onPress={() => navigation.navigate("TripRouteMapVIew", {route: suggestionRoutes[routeIndex]}) }>
                View on Map
              </Button>
              <Button size="small" onPress={() => this.handleLikeTrip(routeIndex)}
              style={{borderRadius: 0, padding: 0, margin: 0}} 
              disable={preferIndex.includes(routeIndex)}
              color='error'>{preferIndex.includes(routeIndex) ? "Unlike it" : "I love it"}</Button>
            </Block>}
        </View>
      );
    }
}

PlanningTrip.defaultProps = {
    places: []
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: 10,
      backgroundColor:'white'
    },
    mapStyle: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    timeline: {
      flex: 9,
      width: Dimensions.get('window').width,
      padding: 10,
      // marginHorizontal: theme.SIZES.BASE,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 7 },
      shadowRadius: 10,
      shadowOpacity: 0.2,
      backgroundColor: 'white'
    },
    productImage: {
      width: cardWidth - theme.SIZES.BASE,
      height: cardWidth - theme.SIZES.BASE,
      borderRadius: 3
    },
    placeAvatar: {
        height: 30,
        width: 30,
        borderRadius: 15,
    },
});

export default PlanningTrip;
