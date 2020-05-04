import React from "react";
import { StyleSheet } from "react-native";
import { Block, Text, theme } from "galio-framework";

import Icon from "./Icon";
import argonTheme from "../constants/Theme";
import i18n from "i18n-js";

class DrawerItem extends React.Component {
  renderIcon = () => {
    const { title, focused } = this.props;

    switch (title) {
      case i18n.t('navigationBar.Home'):
        return (
          <Icon
            name="shop"
            family="ArgonExtra"
            size={13}
            color={focused ? "white" : argonTheme.COLORS.PRIMARY}
          />
        );
      case "Elements":
        return (
          <Icon
            name="map-big"
            family="ArgonExtra"
            size={13}
            color={focused ? "white" : argonTheme.COLORS.ERROR}
          />
        );
      case "Articles":
        return (
          <Icon
            name="spaceship"
            family="ArgonExtra"
            size={13}
            color={focused ? "white" : argonTheme.COLORS.PRIMARY}
          />
        );
      case "Profile":
        return (
          <Icon
            name="chart-pie-35"
            family="ArgonExtra"
            size={13}
            color={focused ? "white" : argonTheme.COLORS.WARNING}
          />
        );
      case "Account":
        return (
          <Icon
            name="calendar-date"
            family="ArgonExtra"
            size={13}
            color={focused ? "white" : argonTheme.COLORS.INFO}
          />
        );
      case "Getting Started":
        return <Icon />;
      case "Log out":
        return <Icon />;
      case i18n.t('navigationBar.Language'):
        return <Icon 
              name="language"
              family="MaterialIcons"
              size={13}
              color={focused ? "white" : argonTheme.COLORS.INFO}
              />;
      case i18n.t('navigationBar.TripRoute'):
        return <Icon 
              name="map"
              family="MaterialIcons"
              size={13}
              color={focused ? "white" : argonTheme.COLORS.INFO}
              />;
      default:
        return null;
    }
  };

  render() {
    const { focused, title } = this.props;

    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null
    ];

    return (
      <Block flex row style={containerStyles}>
        <Block middle flex={0.1} style={{ marginRight: 5 }}>
          {this.renderIcon()}
        </Block>
        <Block row center flex={0.9}>
          <Text
            size={15}
            bold={focused ? true : false}
            color={focused ? "white" : "rgba(0,0,0,0.5)"}
          >
            {title}
          </Text>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 15,
    paddingHorizontal: 14
  },
  activeStyle: {
    backgroundColor: argonTheme.COLORS.ACTIVE,
    borderRadius: 4
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});

export default DrawerItem;
