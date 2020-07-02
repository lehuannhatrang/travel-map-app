import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import HttpUtil from "../utils/Http.util";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { TripCard } from "../components";
import { isLoading } from "expo-font";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: '',
      trips: [],
      isLoading: true
    }
    this.getPermissionAsync = this.getPermissionAsync.bind(this);
    this.handlePickImage = this.handlePickImage.bind(this);
  }

  componentDidMount() {
    HttpUtil.getJsonAuthorization('/user')
    .then(currentUser => {
      this.setState({currentUser})
    })
    HttpUtil.getJsonAuthorization('/user/my-trips')
    .then(data => {
      this.setState({
        trips: data,
        isLoading: false
      })
    })
  }

  async getPermissionAsync() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  async handlePickImage() {
    try {
      await this.getPermissionAsync()
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
        base64: true,
      });
      if (!result.cancelled) {
        currentUser = await HttpUtil.postJsonAuthorization('/user/avatar', {img: result.base64})
        this.setState({ currentUser });
      }

    } catch (E) {
      console.log(E);
    }
  }

  handleLogout() {
    const { navigation } = this.props;
    HttpUtil.getJson('/auth/logout')
    .then(response => {
      AsyncStorage.removeItem('accessToken')
    })
  }

  handleViewTrip(id) {
    const { navigation } = this.props;
    navigation.navigate('PlanningTrip', {
      id
    })
  }

  handleDeleteTrip(id) {
    this.setState({isLoading: true})
    HttpUtil.deleteJsonAuthorization('/user/trip', {id})
    .then(response => {
      HttpUtil.getJsonAuthorization('/user/my-trips')
      .then(data => {
        this.setState({
          trips: data,
          isLoading: false
        })
      })
    })
  }

  refresh() {
    HttpUtil.getJsonAuthorization('/user')
    .then(currentUser => {
      this.setState({currentUser})
    })
    HttpUtil.getJsonAuthorization('/user/my-trips')
    .then(data => {
      this.setState({
        trips: data,
        isLoading: false
      })
    })
  }

  render() {
    const { currentUser, trips, isLoading } = this.state;
    if (!currentUser) return <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 100}} />
    return (
      <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground
            source={Images.ProfileBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
              <Block flex style={styles.profileCard}>
                <Block middle style={styles.avatarContainer}>
                  <TouchableOpacity onPress={() => this.handlePickImage()}>
                    <Image
                      source={currentUser.avatar ? {uri: `data:image/gif;base64,${currentUser.avatar}`} : Images.ProfilePicture}
                      style={styles.avatar}
                    />
                  </TouchableOpacity>

                </Block>
                <Block style={styles.info}>
                  <Block
                    middle
                    row
                    space="evenly"
                    style={{ marginTop: 20, paddingBottom: 10 }}
                  >
                    <Button
                      small
                      style={{ backgroundColor: argonTheme.COLORS.INFO }}
                      onPress={() => this.refresh()}
                    >
                      Refresh
                    </Button>
                    <Button
                      small
                      style={{ backgroundColor: argonTheme.COLORS.ERROR }}
                      onPress={() => this.handleLogout()}
                    >
                      LOG OUT
                    </Button>
                  </Block>
                </Block>
                <Block flex>
                  <Block middle style={styles.nameInfo}>
                    <Text bold size={28} color="#32325D">
                      {currentUser.displayName}
                    </Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                      {currentUser.email}
                    </Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                      {currentUser.phone}
                    </Text>
                  </Block>
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                    <Block style={styles.divider} />
                  </Block>
                  <Block middle>
                    <Text
                      size={16}
                      color="#525F7F"
                      style={{ textAlign: "center", marginHorizontal: 20 }}
                    >
                      {`Hello ${currentUser.displayName}, you can find your trip down here.`}
                    </Text>
                  </Block>
                  <Block
                    row
                    space="between"
                    style={{ paddingVertical: 14, alignItems: "baseline" }}
                  >
                    <Text bold size={16} color="#525F7F">
                      My trips
                    </Text>
                  </Block>
                  {!!isLoading && <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 100}} />}
                  {trips.map(trip => 
                  <TripCard tripDate={trip.date} 
                  id={trip._id}
                  onPress={(id) => this.handleViewTrip(id) }
                  onDelete={id => this.handleDeleteTrip(id)}
                  />)}

                  {!isLoading && trips.length === 0 && <Text size={16} color={theme.COLORS.MUTED}>No trip found</Text>}
                  
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
    flex: 1
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
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
    marginTop: 15
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
  }
});

export default Profile;
