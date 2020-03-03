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
// drawer
import Menu from "./Menu";
import DrawerItem from "../components/DrawerItem";
import Categories from "../constants/categories";

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
        header: <Header tabs={Categories} search options title="Home" navigation={navigation} />
      })
    },
    PlaceDetail: {
      screen: PlaceDetail,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header white transparent title="Detail" iconColor={'#FFF'} navigation={navigation} />
        ),
        headerTransparent: true
      })
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
    SearchLocation: {
      screen: SearchLocation,
      navigationOptions: ({ navigation }) => ({
        header: <></>,
      }),
    }
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

// const PlaceDetailStack = createStackNavigator(
//   {
//     PlaceDetail: {
//       screen: PlaceDetail,
//       navigationOptions: ({ navigation }) => ({
//         header: (
//           <Header white transparent title="Detail" iconColor={'#FFF'} navigation={navigation} />
//         ),
//         headerTransparent: true
//       })
//     }
//   },
//   {
//     cardStyle: { backgroundColor: "#FFFFFF" },
//     transitionConfig
//   }
// );

// divideru se baga ca si cum ar fi un ecrna dar nu-i nimic duh
const AppStack = createDrawerNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} title="Home" />
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
    }
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
