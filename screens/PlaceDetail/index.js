import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import ImageViewer from 'react-native-image-view';
import { Button, Icon } from "../..//components";
import { Images, argonTheme, articles } from "../../constants";
import { HeaderHeight } from "../../constants/utils";
import HttpUtil from "../../utils/Http.util";
import Comment from "../../components/Comment";

const { width, height } = Dimensions.get("screen");
const cardWidth = width - theme.SIZES.BASE * 2;

const thumbMeasure = (width - 48 - 32) / 3;


class PlaceDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images : Images.Viewed.map(uri => ({
                source: {
                    uri,
                },
                title: 'Paris',
                width: 806,
                height: 720,
            })),
            showPicture: false,
            chosenPicture: '',
            placeDetail: '',
            comments: [
                {
                    id: 1,
                    author: {
                        avatar: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?fit=crop&w=1650&q=80',
                        name: 'Lee Hun'
                    },
                    rating: [],
                    comment: 'KTX nhu cac vay ak :))',
                    createdAt: '08/02/2020'
                },
                {   
                    id: 2,
                    author: {
                        avatar: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?fit=crop&w=1650&q=80',
                        name: 'Xi Xui Xeo'
                    },
                    rating: [],
                    comment: 'Hiphop neva \ndie <3 HIHIHIHIHIIIHIksd lanska ndkandahsd khs k',
                    createdAt: '23/06/2019'
                }
            ]
        }
        this.renderFooter = this.renderFooter.bind(this);
    }

    componentDidMount() {
        const { navigation } = this.props;
        const placeId = this.props.navigation.state.params ? this.props.navigation.state.params.placeId : null;
        if(placeId) {
            HttpUtil.getJsonAuthorization('/places/detail', {id: placeId})
            .then(result => {
                console.log(result.place)
                this.setState({
                    placeDetail: result.place,
                    images: result.place.pictures.map(pictureUri => ({
                        source: {
                            uri: pictureUri,
                        },
                        title: result.place.name,
                        width: 806,
                        height: 720,
                    }))
                })
            })
            .catch(err => {
                navigation.navigate('Home', {})
            })
        }
    }

    renderFooter({title}) {
        return (
            <View style={styles.footer}>
                <Text style={styles.footerText}>{title}</Text>
                <TouchableOpacity
                    style={styles.footerButton}
                >
                </TouchableOpacity>
            </View>
        );
    }


    render() {
        const { showPicture, images, chosenPicture, comments, placeDetail } = this.state;
        if (!placeDetail) return <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 100}} />
        return (
        <Block flex style={styles.profile}>
            <ImageViewer images={images}
            imageIndex={images.findIndex(element => element.source.uri === chosenPicture) || 0}
            isVisible={showPicture}
            onClose={() => this.setState({showPicture: false})}
            renderFooter={this.renderFooter}
            />
            <Block flex>
            <ImageBackground
                source={{uri: placeDetail.mainImgUri}}
                style={styles.profileContainer}
                imageStyle={styles.profileBackground}
            >
                <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ width, marginTop: '15%' }}
                >
                <Block flex style={styles.profileCard}>
                    <Block style={styles.titleInfo}>
                        <Block middle style={styles.nameInfo}>
                            <Text bold size={28} color="#32325D" >
                            {placeDetail.name}
                            </Text>
                            <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                            {placeDetail.address}
                            </Text>
                        </Block>
                        <Block middle row space="evenly" style={{ marginTop: 20, paddingBottom: 24 }} >
                            <Button small style={{ backgroundColor: argonTheme.COLORS.INFO }}>
                                FAVORITE
                            </Button>
                            <Button small style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}>
                                RATE
                            </Button>
                        </Block>
                        <Block row space="between">
                            <Block middle>
                                <Text bold size={12} color="#525F7F" style={{ marginBottom: 4 }}>
                                    {placeDetail.spaceRating}
                                </Text>
                                <Text size={12}>Space</Text>

                            </Block>
                            <Block middle>
                                <Text bold size={12} color="#525F7F" style={{ marginBottom: 4 }}>
                                    {placeDetail.locationRating}
                                </Text>
                                <Text size={12}>Location</Text>
                            </Block>

                            <Block middle>
                                <Text bold size={12} color="#525F7F" style={{ marginBottom: 4 }}>
                                    {placeDetail.qualityRating}
                                </Text>
                                <Text size={12}>Quality</Text>
                            </Block>

                            <Block middle>
                            <   Text bold size={12} color="#525F7F" style={{ marginBottom: 4 }}>   
                                    {placeDetail.serviceRating}
                                </Text>
                                <Text size={12}>Service</Text>
                            </Block>
                            <Block middle>
                                <Text bold size={12} color="#525F7F" style={{ marginBottom: 4 }}>
                                    {placeDetail.priceRating}
                                </Text>
                                <Text size={12}>Price</Text>
                            </Block>
                        </Block>
                    </Block>
                    <Block flex>
                        <Block middle style={{ marginTop: 40, marginBottom: 30 }}>
                            <Block style={styles.divider} />
                            <Icon
                            style={styles.overallPoint}
                            family="AntDesign"
                            size={60}
                            name="staro"
                            color="#e6e600"
                            />
                            <Text bold style={{position: 'absolute', color: '#525F7F'}}>{placeDetail.avgRating}</Text>
                        </Block>

                        <Block
                        row
                        style={{ paddingVertical: 14, alignItems: "baseline" }}
                        >
                            <Text bold size={16} color="#525F7F">
                            Comments
                            </Text>
                        </Block>
                        {comments.map(comment => <Comment key={`cmt-${comment.id}`} comment={comment}/>)}
                        <Block row>
                            <Button
                            small
                            color="transparent"
                            textStyle={{ color: "#5E72E4", fontSize: 16}}
                            >
                                View all
                            </Button>
                        </Block>
                        <Block
                        row
                        style={{ paddingVertical: 14, alignItems: "baseline" }}
                        >
                            <Text bold size={16} color="#525F7F">
                            Pictures
                            </Text>
                        </Block>
                        <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
                            <Block row space="between" style={{ flexWrap: "wrap" }}>
                            {images.map((img, imgIndex) => (
                                <TouchableOpacity key={`viewed-${imgIndex}`} onPress={()=> this.setState({showPicture: true, chosenPicture: img.source.uri})}>
                                <Image
                                source={{ uri: img.source.uri }}
                                resizeMode="cover"
                                style={styles.thumb}
                                />
                                </TouchableOpacity>
                            ))}
                            </Block>
                        </Block>
                    </Block>
                </Block>
                </ScrollView>
            </ImageBackground>
            </Block>
        </Block>
        );
    }
}

const styles = StyleSheet.create({
    profile: {
        marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
        // marginBottom: -HeaderHeight * 2,
        flex: 1,
    },
    profileContainer: {
        width: width,
        height: height,
        padding: 0,
        zIndex: 1
    },
    profileBackground: {
        width: width,
        height: height / 2
    },
    profileCard: {
        // position: "relative",
        padding: theme.SIZES.BASE,
        marginHorizontal: theme.SIZES.BASE,
        marginTop: 175,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        backgroundColor: theme.COLORS.WHITE,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 8,
        shadowOpacity: 0.2,
        zIndex: 2
    },
    info: {
        paddingHorizontal: 40
    },
    titleInfo: {
        paddingHorizontal: 20
    },
    avatarContainer: {
        position: "relative",
        marginTop: -80
    },
    avatar: {
        width: 124,
        height: 124,
        borderRadius: 62,
        borderWidth: 0
    },
    nameInfo: {
        marginTop: 35
    },
    divider: {
        width: "90%",
        borderWidth: 1,
        borderColor: "#E9ECEF"
    },
    thumb: {
        borderRadius: 4,
        marginVertical: 4,
        alignSelf: "center",
        width: thumbMeasure,
        height: thumbMeasure
    },
    overallPoint: {
        position: 'absolute',
        backgroundColor: 'white'
    },
    footer: {
        width,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    footerButton: {
        flexDirection: 'row',
        marginLeft: 15,
    },
    footerText: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
    },
});

export default PlaceDetail;
