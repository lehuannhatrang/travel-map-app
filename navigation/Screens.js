import React from "react";
import { Easing, Animated } from "react-native";
import {
  createStackNavigator,
  createDrawerNavigator,
  createAppContainer
} from "react-navigation";

import { Block } from "galio-framework";

// screens
import Home from "../screens/Home";
import Onboarding from "../screens/Onboarding";
import Pro from "../screens/Pro";
import Profile from "../screens/Profile";
import Register from "../screens/Login/Register";
import Elements from "../screens/Elements";
import Articles from "../screens/Articles";
import SearchLocation from "../screens/SearchLocation";
import LoginWithEmail from "../screens/Login/EmailLogin";
import PlaceDetail from "../screens/PlaceDetail";
import RatingForm from "../screens/PlaceDetail/ratingForm";
import SelectLanguage from "../screens/SelectLanguage";
import TripRoute from "../screens/TripRoute";
import ViewOnMap from "../screens/PlaceDetail/viewOnMap";
import PlanningTrip from "../screens/TripRoute/PlanningTrip";
// drawer
import Menu from "./Menu";
import DrawerItem from "../components/DrawerItem";
import Categories from "../constants/categories";
import i18n from "i18n-js";
// header for screens
import Header from "../components/Header";

const transitionConfig = (transitionProps, prevTransitionProps) => ({
  transitionSpec: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;
    const thisSceneIndex = scene.index;
    const width = layout.initWidth;

    const scale = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [4, 1, 1]
    });
    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [0, 1, 1]
    });
    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0]
    });

    const scaleWithOpacity = { opacity };
    const screenName = "Search";

    if (
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps &&
        screenName === prevTransitionProps.scene.route.routeName)
    ) {
      return scaleWithOpacity;
    }
    return { transform: [{ translateX }] };
  }
});

const ElementsStack = createStackNavigator({
  Elements: {
    screen: Elements,
    navigationOptions: ({ navigation }) => ({
      header: <Header title="Elements" navigation={navigation} />
    })
  }
},{
  cardStyle: {
    backgroundColor: "#F8F9FE"
  },
  transitionConfig
});

const ArticlesStack = createStackNavigator({
  Articles: {
    screen: Articles,
    navigationOptions: ({ navigation }) => ({
      header: <Header title="Articles" navigation={navigation} />
    })
  }
},{
  cardStyle: {
    backgroundColor: "#F8F9FE"
  },
  transitionConfig
});

const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header white transparent title="Profile" iconColor={'#FFF'} navigation={navigation} />
        ),
        headerTransparent: true
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig
  }
);

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({ navigation }) => ({
        header: <Header tabs={Categories} search options title={i18n.t('header.home.title')} navigation={navigation} />
      })
    },
    PlaceDetail: {
      screen: PlaceDetail,
      navigationOptions: ({ navigation }) => ({
        header: null
        // headerTransparent: true
      })
    },
    ViewOnMap: {
      screen: ViewOnMap,
      navigationOptions: ({ navigation }) => {console.log(navigation);return{
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Map" title={i18n.t('header.ratingForm')} />
        ),
        header: <Header back title={navigation.state.params.placeDetail.name} navigation={navigation} />,
        headerTransparent: true
      }},
    },
    RatingForm: {
      screen: RatingForm,
      navigationOptions: ({ navigation }) => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="RatingForm" title={i18n.t('header.ratingForm')} />
        ),
        header: <Header options title={i18n.t('header.ratingForm')} navigation={navigation} />
      })
    },
    SearchLocation: {
      screen: SearchLocation,
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
    Pro: {
      screen: Pro,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header left={<Block />} white transparent title="" navigation={navigation} />
        ),
        headerTransparent: true
      })
    },
  },
  {
    cardStyle: {
      backgroundColor: "#F8F9FE"
    },
    transitionConfig
  }
);
const AccountStack = createStackNavigator(
  {
    Register: {
      screen: Register,
      navigationOptions: {
        header: null
      }
    },
    LoginWithEmail: {
      screen: LoginWithEmail,
      navigationOptions: {
        header: null
      }
    }
  }
)


const SelectLanguageStack = createStackNavigator({
  SelectLanguage: {
    screen: SelectLanguage,
    navigationOptions: ({ navigation }) => ({
      header: <Header title={i18n.t('header.Language')} navigation={navigation} />
    })
  }
},{
  cardStyle: {
    backgroundColor: "#F8F9FE"
  },
  transitionConfig
});


const TripRouteStack = createStackNavigator({
  PlanningTrip: {
    screen: PlanningTrip,
    navigation: ({ navigation }) => ({
      header: <Header title={i18n.t('header.PlanningTrip')} navigation={navigation} />
    })
  },
  TripRoute: {
    screen: TripRoute,
    navigationOptions: ({ navigation }) => ({
      header: <Header title={i18n.t('header.TripRoute')} navigation={navigation} />
    })
  },
},{
  cardStyle: {
    backgroundColor: "#F8F9FE"
  },
  transitionConfig
});


const AppStack = createDrawerNavigator(
  {
    TripRoute: {
      screen: TripRouteStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="TripRoute" title={i18n.t('navigationBar.TripRoute')} />
        )
      })
    },  
    Home: {
      screen: HomeStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} title={i18n.t('navigationBar.Home')} />
        )
      })
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Profile" title="Profile" />
        )
      })
    },
    Elements: {
      screen: ElementsStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Elements" title="Elements" />
        )
      })
    },
    Articles: {
      screen: ArticlesStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Articles" title="Articles" />
        )
      })
    },
    Language: {
      screen: SelectLanguageStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Language" title={i18n.t('navigationBar.Language')} />
        )
      })
    },
  },
  Menu
);

const AuthorizeStack = createStackNavigator(
  {
    Onboarding: {
      screen: Onboarding,
      navigationOptions: {
        header: null,
      },
    },
    Account: {
      screen: AccountStack,
      navigationOptions: {
        header: null,
      },
    }
  },
  Menu
)

const AppContainer = createAppContainer(AppStack);
const AuthorizeContainer = createAppContainer(AuthorizeStack)
export {AppContainer, AuthorizeContainer};
