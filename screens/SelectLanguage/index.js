import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { Block, Checkbox, Text, theme, Card } from "galio-framework";

import { Button, Icon, Input } from "../../components";
import { Images, argonTheme } from "../../constants";
import i18n from 'i18n-js';

const { width, height } = Dimensions.get("screen");

class SelectLanguage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLanguage: i18n.locale,
            chosenLanguage: i18n.locale
        }
    }

    handleChangeLanguage() {
        const {chosenLanguage, currentLanguage} = this.state;
        if (currentLanguage !== chosenLanguage) {
            i18n.locale = chosenLanguage
            this.setState({
                currentLanguage: chosenLanguage
            })
            AsyncStorage.setItem('customLocale', chosenLanguage)
        }
    }

    render() {
        const { currentLanguage, chosenLanguage } = this.state;
        const disabledButton = currentLanguage === chosenLanguage;
        console.log(currentLanguage)
        return (
            <View flex>
                <Block style={styles.headerContainer}>
                    <Text color={theme.COLORS.MUTED} size={30}>{i18n.t('SelectLanguage.title')}</Text>
                </Block>
                <Block style={styles.cardContainer}>
                    <TouchableOpacity style={styles.touchableCard} onPress={() => this.setState({chosenLanguage: 'vi-VN'})}>
                        <Card 
                        flex
                        borderless
                        style={styles.card}
                        imageStyle={chosenLanguage === 'vi-VN' ? styles.chosenCardImage : styles.cardImageRadius}
                        imageBlockStyle={{ padding: theme.SIZES.BASE / 2 }}
                        image={'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1200px-Flag_of_Vietnam.svg.png'}
                        />
                        {chosenLanguage === 'vi-VN' && 
                            <Icon
                            name="check-circle"
                            family="FontAwesome"
                            style={styles.checkIcon}
                            size={28}
                            color={'yellow'}
                            />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchableCard} onPress={() => this.setState({chosenLanguage: 'en'})}>
                        <Card 
                        flex
                        borderless
                        style={styles.card}
                        imageStyle={chosenLanguage === 'en' ? styles.chosenCardImage : styles.cardImageRadius}
                        imageBlockStyle={{ padding: theme.SIZES.BASE / 2 }}
                        image="https://i.pinimg.com/originals/1e/b5/62/1eb562c8b2ec40048b1cb51db5e69bb9.png"
                        />
                        {chosenLanguage === 'en' && 
                        <Icon
                          name="check-circle"
                          family="FontAwesome"
                          style={styles.checkIcon}
                          size={28}
                          color={'yellow'}
                        />
                        }
                    </TouchableOpacity>
                </Block>
                <Block style={styles.submitButtonContainer}>
                    <Button disabled={disabledButton} color={disabledButton ? "info" : 'primary' } onPress={() => this.handleChangeLanguage()}>{i18n.t('SelectLanguage.button')}</Button>
                </Block>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    submitButtonContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    submitButton: {
        color: 'green'
    },
    disabledButton: {
        color: 'gray'
    },
    headerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardContainer: {
        flex: 7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardImageRadius: {
        height: theme.SIZES.CARD_WIDTH/2,
        paddingTop: 0,
        marginTop: 0
    },
    chosenCardImage: {
        height: theme.SIZES.CARD_WIDTH/2,
        paddingTop: 0,
        marginTop: 0,
        borderWidth: 5,
        borderColor: '#e6e600'
    },
    card: {
        borderWidth: 0,
        width: "100%",
        backgroundColor: theme.COLORS.WHITE,
        padding: 0,
        marginVertical: theme.SIZES.CARD_MARGIN_VERTICAL,
    },    
    touchableCard: {
        flex: 1,
        maxHeight: 200,
        width: "100%",
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkIcon: {
        position: 'absolute', 
        top: 25,
        right: 12,
    }

});

export default SelectLanguage;
