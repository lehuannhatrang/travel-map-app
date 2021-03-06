import React from "react";
import {
    TouchableHighlight,
    StyleSheet,
    View,
    Modal,
    Dimensions,
    ScrollView,
    ButtonGroup,
    TextInput
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";
import Slider from "react-native-slider";
import HttpUtil from "../../utils/Http.util";

const { height, width } = Dimensions.get("screen");

import argonTheme from "../../constants/Theme";
import Theme from "../../constants/Theme";

class RatingForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: {
                spaceRating: 0.7,
                locationRating: 0.7,
                qualityRating: 0.7,
                serviceRating: 0.7,
                priceRating: 0.7,
            },
            comment: "",
            step: 0.01,
            place: '',
            sliderType : {
                space: {
                    label: 'Space',
                    point: 'spaceRating'
                },
                location: {
                    label: 'Location',
                    point: 'locationRating'
                },
                quality: {
                    label: 'Quality',
                    point: 'qualityRating'
                },
                service: {
                    label: 'Service',
                    point: 'serviceRating'
                },
                price: {
                    label: 'Price',
                    point: 'priceRating'
                },
            },
            isLoading: false
        }
    }

    componentDidMount() {
        const place = this.props.navigation.state.params? this.props.navigation.state.params.place : null;
        this.setState({place})
    }

    converRatingToPoint(value) {
        const result = (value * 10).toPrecision(2);
        if(result === '0.50') {
            return '0.5'
        }
        return result
    }

    handleSlide(ratingType, value) {
        const { rating } = this.state;
        let newRating = rating;
        newRating[ratingType] = value;
        this.setState({rating: newRating})
    }

    renderSlider(type) {
        const { sliderType, rating, step } = this.state;
        const slider = sliderType[type];
        return (
            <View style={styles.placeNameContainer}>
                <Block style={{marginBottom: 5}} row>
                    <View style={styles.sliderLabelContainer}>
                        <Text size={14} bold style={styles.sliderLabel} color={theme.COLORS.MUTED}>{slider.label}</Text>
                    </View>
                    <View style={styles.sliderLabelContainer}>
                        <Text color="#32325D" bold size={14} style={styles.sliderPoint}>
                            {this.converRatingToPoint(rating[slider.point])}
                        </Text>
                    </View>
                </Block>
                <Block>
                    <Slider
                    value={rating[slider.point]}
                    onValueChange={value => this.handleSlide(slider.point, value)}
                    trackStyle={customStyles2.track}
                    thumbStyle={customStyles2.thumb}
                    minimumTrackTintColor='#00b3b3'
                    step={step}
                    />
                </Block>
            </View>
        )
    }

    handleSubmit() {
        this.setState({isLoading: true})
        const { navigation } = this.props;
        const { rating, comment, place } = this.state;
        const ratingData = {
            placeId: place.placeId,
            rating,
            comment
        }
        HttpUtil.postJsonAuthorization('/places/rating', ratingData)
        .then(response => {
            this.setState({isLoading: false})
            navigation.navigate('PlaceDetail')
        })
        .catch(err => {
            // this.setState({isLoading: false})
        })
    }

    render() {
        // const { open, place } = this.props;
        const { place, isLoading } = this.state;

        return (
            <View style={styles.container}>
                <View style={{flex: 9, width: "100%"}}>
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{flex: 1, width: "95%", alignSelf: "center"}}
                    >
                        <Block middle style={styles.placeNameContainer}>
                            <Text bold color="#32325D" size={25} style={styles.placeName}>{place.name}</Text>
                        </Block>

                        <View style={styles.placeNameContainer}>
                            <Block row style={{width: "90%"}}>
                                <Text size={12} bold style={styles.sliderLabel} color={theme.COLORS.MUTED}>Write a review</Text>
                            </Block>
                            <View style={styles.textAreaContainer} >
                                <TextInput
                                style={styles.textArea}
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={(text) => this.setState({comment: text})}
                                />
                            </View>

                        </View>



                        {this.renderSlider('space')}
                        {this.renderSlider('location')}
                        {this.renderSlider('quality')}
                        {this.renderSlider('service')}
                        {this.renderSlider('price')}
                    </ScrollView>
                </View>
                <View style={{flex: 1}}>
                    <Block middle>
                        <Button disabled={isLoading} onPress={() => this.handleSubmit()} shadowless >Submit</Button>
                    </Block>
                </View>
            </View>
        );
    }
}

RatingForm.defaultProps = {
    open: false,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    divider: {
        width: "90%",
        borderWidth: 1,
        borderColor: "#E9ECEF"
    },

    placeNameContainer: {
        width: "90%", 
        alignSelf: "center",
        marginBottom: 10
    },
    placeName: {
        paddingTop: 15, 
        paddingBottom: 20, 
        textAlign:'center'
    },
    sliderLabelContainer: {
        flex: 1, 
        justifyContent: 'center'
    },
    sliderLabel : {
        textAlign: 'left', marginRight: 8
    },
    sliderPoint: {
        textAlign: 'right', 
        marginLeft: 5
    },
    textAreaContainer: {
        borderColor: "#a6a6a6",
        borderWidth: 0.5,
        borderRadius: 4,
        padding: 5,
        marginTop: 5,
        marginBottom: 15
    },
    textArea: {
        height: 150,
        justifyContent: "flex-start"
    }
});

const customStyles2 = StyleSheet.create({
    track: {
      height: 2,
      borderRadius: 1,
    },
    thumb: {
      width: 20,
      height: 20,
      borderRadius: 20 / 2,
      backgroundColor: 'white',
      borderColor: '#009999',
      borderWidth: 1,
    }
  });

export default RatingForm;
