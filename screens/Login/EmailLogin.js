import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  AsyncStorage
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "../../components";
import { Images, argonTheme } from "../../constants";
import HttpUtil from "../../utils/Http.util";

const { width, height } = Dimensions.get("screen");

class LoginWithEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loginErrorMessage: '',
            loading: false,
        }
    }

    handleSubmitLogin() {
        const { navigation } = this.props;
        const { email, password } = this.state;
        if(!email) {
            this.setState({loginErrorMessage: 'Missing email'})
        }
        else if(!password) {
            this.setState({loginErrorMessage: 'Missing password'})
        }
        else {
            this.setState({loading: true})
            const body = {
                username: email,
                password
            }
            HttpUtil.postJson('/auth/login', body)
            .then(result => {
                console.log('Login successfull')
                AsyncStorage.setItem('accessToken', result.token)
                .then(result => {
                    // this.setState({loading: false})
                })
                // navigation.navigate("Home");
            })
            .catch(error => {
                this.setState({
                    loginErrorMessage: 'Failed to login',
                    loading: false
                })
            })
        }
    }

    render() {
        return (
            <Block flex middle>
                <StatusBar hidden />
                <ImageBackground
                source={Images.RegisterBackground}
                 style={{ width, height, zIndex: 1 }}
                >
                <Block flex middle>
                    <Block style={styles.registerContainer}>
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{flex:1}}>
                        <Block flex>
                        <Block flex={0.17} middle>
                            <Text color="#8898AA" size={12}>
                            Login
                            </Text>
                        </Block>
                        <Block flex center>
                            <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior="padding"
                            enabled
                            >
                            <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                                <Input
                                type="email-address"
                                borderless
                                onChangeText={value => this.setState({email: value})}
                                placeholder="Email"
                                iconContent={
                                    <Icon
                                    size={16}
                                    color={argonTheme.COLORS.ICON}
                                    name="ic_mail_24px"
                                    family="ArgonExtra"
                                    style={styles.inputIcons}
                                    />
                                }
                                />
                            </Block>
                            <Block width={width * 0.8}>
                                <Input
                                password
                                borderless
                                onChangeText={value => this.setState({password: value})}
                                placeholder="Password"
                                iconContent={
                                    <Icon
                                    size={16}
                                    color={argonTheme.COLORS.ICON}
                                    name="padlock-unlocked"
                                    family="ArgonExtra"
                                    style={styles.inputIcons}
                                    />
                                }
                                />
                                <Block row style={styles.passwordCheck}>
                                    <Text size={12} color={argonTheme.COLORS.ERROR}>
                                        {this.state.loginErrorMessage}
                                    </Text>
                                </Block>
                            </Block>
                            <Block middle>
                                <Button disabled={this.state.loading} color="primary" style={styles.createButton} onPress={() => this.handleSubmitLogin()}>
                                    {!this.state.loading && <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                                        LOGIN
                                    </Text>}
                                    {!!this.state.loading && <ActivityIndicator size="small" color="#0000ff" />}
                                </Button>
                            </Block>
                            </KeyboardAvoidingView>
                        </Block>
                        </Block>
                    </ScrollView>
                    </Block>
                </Block>
                </ImageBackground>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.45,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 10
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25
  },
  rememberMeButton: {
    //   marginTop: 30
  }
});

export default LoginWithEmail;
