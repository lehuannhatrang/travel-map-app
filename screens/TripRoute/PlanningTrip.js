import React from "react";
import {
  ScrollView,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  View,
  Animated,
  TouchableOpacity,
  AsyncStorage,
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

const categories = [
  {
    title: "Music Album",
    description:
      "Rock music is a genre of popular music. It developed during and after the 1960s in the United Kingdom.",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?fit=crop&w=840&q=80",
    price: "$125"
  },
  {
    title: "Events",
    description:
      "Rock music is a genre of popular music. It developed during and after the 1960s in the United Kingdom.",
    image:
      "https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=840&q=80",
    price: "$35"
  }
];


class PlanningTip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          suggestionRoutes: []
        }
    }

    componentDidMount() {
        const defaultPlanning = [
            {
              "id": 0,
              "type": "RESTAURANT",
              "beginTime": "8:00",
              "endTime": "9:00",
              "title": "Ăn sáng"
            },
            {
              "id": 1,
              "type": "VISIT",
              "beginTime": "9:00",
              "endTime": "12:00",
              "title": "Tham quan"
            },
            {
              "id": 0,
              "type": "RESTAURANT",
              "beginTime": "12:00",
              "endTime": "13:00",
              "title": "Bữa trưa"
            },
            {
              "id": 1,
              "type": "VISIT",
              "beginTime": "13:00",
              "endTime": "17:00",
              "title": "Tham quan"
            },
            {
              "id": 0,
              "type": "RESTAURANT",
              "beginTime": "17:00",
              "endTime": "19:00",
              "title": "Bữa tôi"
            },
            {
              "id": 1,
              "type": "VISIT",
              "beginTime": "19:00",
              "endTime": "22:00",
              "title": "Vui chơi"
            }
        ]

        HttpUtil.postJsonAuthorization('/planning-trip/suggestion-trips', {planning: defaultPlanning})
        .then(data => {
          this.setState({suggestionRoutes: data.routes})
        })
    }

    renderScrollDot(index) {
      return (
        <Animated.View
          key={i} 
          style={{ height: 10, width: 10, backgroundColor: '#595959', margin: 8, borderRadius: 5 }}
        />
      )
    }

    convertTimelineData(route) {
      const timelineData = route.route.map(place => ({
       time: place.planning.beginTime,
       title: place.planning.title,
       icon: <Image
            style={{width: 30, height: 30, backgroundColor: 'white', paddingTop: 10}}
            source={Images.pinIcon}/>,
       description: <Block style={{marginBottom: 20, marginTop: 10}}>
           <Block row>
              <Image
               source={{ uri: place.place.mainImgUri}}
               resizeMode="cover"
               style={styles.placeAvatar}
               />
               <Text bold color="#525F7F" style={{marginLeft: 5, flex: 1, flexWrap: 'wrap'}}>{place.place.name}</Text>
           </Block>
           <Block row>
              <Text color="#525F7F">{place.place.streetAddress}</Text>
           </Block>
           <Block row>
              <Text color="#525F7F">{place.place.addressLocality}</Text>
            </Block>
       </Block>
      }))
      return timelineData
    }

    render() {
        return (
          <View style={styles.container}>
            <Block flex style={{ marginTop: theme.SIZES.BASE / 2 }}>
              <ScrollView
                horizontal={true}
                pagingEnabled={true}
                decelerationRate={0}
                scrollEventThrottle={16}
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                snapToInterval={cardWidth + theme.SIZES.BASE * 0.375}
                contentContainerStyle={{
                  
                  // paddingHorizontal: theme.SIZES.BASE / 2
                }}
              >
                {this.state.suggestionRoutes.map((route, index) => (
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
          </View>
        );
    }
}

PlanningTip.defaultProps = {
    places: []
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 10,
      backgroundColor:'white'
    },
    mapStyle: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    timeline: {
      flex: 1,
      width: Dimensions.get('window').width,
      padding: 0,
      // marginHorizontal: theme.SIZES.BASE,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 7 },
      shadowRadius: 10,
      shadowOpacity: 0.2
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

export default PlanningTip;
