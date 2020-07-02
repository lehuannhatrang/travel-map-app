import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomModal from "../../components/Modal";
import { Button, Icon, Input } from "../../components";
import { Images, argonTheme } from "../../constants";
import HttpUtil from "../../utils/Http.util";
import * as Linking from 'expo-linking';


const { width, height } = Dimensions.get("screen");

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordStrength: {
        label: 'weak',
        color: argonTheme.COLORS.ERROR
      },
      name: 't',
      email: '',
      phone: '',
      password: '',
      nameErrorMessage: '',
      emailErrorMessage: '',
      phoneErrorMessage: '',
      isAgreeWithPolicy: false,
      isLoading: false,
      signupSuccess: false
    }
  }

  handleChangeEmailInput(email) {
    if(!email || !email.includes('@') || !email.includes('.')) {
      this.setState({emailErrorMessage: 'Wrong email format'})
    }
    else {
      this.setState({emailErrorMessage: ''})
    }
    this.setState({email})
  }

  handleChangePasswordInput(value) {
    if(value.length < 6) {
      this.setState({
        passwordStrength: {
          label: 'weak',
          color: argonTheme.COLORS.ERROR
        },
      })
    } 
    else if(value.length < 10) {
      this.setState({
        passwordStrength: {
          label: 'normal',
          color: argonTheme.COLORS.YELLOW
        },
      })
    } else {
      this.setState({
        passwordStrength: {
          label: 'strong',
          color: argonTheme.COLORS.SUCCESS
        },
      })
    }
    this.setState({password: value})
  }

  handleSignup() {
    const { navigation } = this.props;
    const {name, email, phone, password, isAgreeWithPolicy} = this.state;
    if(!name || !email || !phone || !password) {
      console.log('Failed to signup')
    } 
    else if (!isAgreeWithPolicy) {
      console.log('Please agree with policy')
    }
    else {
      this.setState({isLoading: true})
      const userInfo = {
        email,
        name,
        phone,
        password
      }
      HttpUtil.postJson('/auth/signup', userInfo)
      .then(response => {
        if(!!response.userId) {
          this.setState({
            signupSuccess: true
          })
          setTimeout(() => {
            navigation.navigate('LoginWithEmail')
          }, 2000);
        }
      })
      .catch(error => {
        this.setState({isLoading: false})
        console.log(error)
      })
    }
  }


  render() {
    const { navigation } = this.props;
    const { isLoading, passwordStrength, nameErrorMessage, emailErrorMessage, phoneErrorMessage, signupSuccess } = this.state;
    return (
      <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
          >
          {/* <CustomModal/> */}
          <Block flex middle>
            <Block style={styles.registerContainer}>
              <Block flex={0.25} middle style={styles.socialConnect}>
                <Text color="#8898AA" size={12}>
                  Login with
                </Text>
                <Block row style={{ marginTop: theme.SIZES.BASE }}>
                  {/* <Button style={{ ...styles.socialButtons, marginRight: 30 }}>
                    <Block row>
                      <Icon
                        name="foody-logo"
                        family="Ionicon"
                        size={14}
                        color={"black"}
                        style={{ marginTop: 2, marginRight: 5 }}
                      />
                      <Text style={styles.socialTextButtons}>Foody</Text>
                    </Block>
                  </Button> */}
                  <Button style={styles.socialButtons} onPress={() => navigation.navigate("LoginWithEmail")}>
                    <Block row>
                      <Icon
                        name="email"
                        family="MaterialIcons"
                        size={14}
                        color={"black"}
                        style={{ marginTop: 2, marginRight: 5 }}
                      />
                      <Text style={styles.socialTextButtons}>Email</Text>
                    </Block>
                  </Button>
                </Block>
              </Block>

                <Block flex>
                  <Block flex={0.1} middle>
                    <Text color="#8898AA" size={12}>
                      Or sign up the classical way
                    </Text>
                  </Block>
                  <Block flex center>
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{flex:1}}>
                      <KeyboardAwareScrollView>
                        <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                          <Input
                            borderless
                            placeholder="Name"
                            onChangeText={value => this.setState({name: value})}
                            iconContent={
                              <Icon
                                size={16}
                                color={argonTheme.COLORS.ICON}
                                name="hat-3"
                                family="ArgonExtra"
                                style={styles.inputIcons}
                              />
                            }
                          />
                          {!!nameErrorMessage &&
                          <Block row style={styles.emailCheck}>
                            <Text size={12} color={argonTheme.COLORS.ERROR}>
                              {nameErrorMessage}
                            </Text>
                          </Block>
                          }
                        </Block>
                        <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                          <Input
                            type="email-address"
                            borderless
                            placeholder="Email"
                            onChangeText={value => this.handleChangeEmailInput(value)}
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
                          {!!emailErrorMessage &&
                          <Block row style={styles.emailCheck}>
                            <Text size={12} color={argonTheme.COLORS.ERROR}>
                              {emailErrorMessage}
                            </Text>
                          </Block>
                          }
                        </Block>
                        <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                          <Input
                            type="phone-pad"
                            borderless
                            placeholder="Phone number"
                            onChangeText={value => this.setState({phone: value})}
                            iconContent={
                              <Icon
                                size={16}
                                color={argonTheme.COLORS.ICON}
                                name="phone"
                                family="Entypo"
                                style={styles.inputIcons}
                              />
                            }
                          />
                          {!!phoneErrorMessage &&
                          <Block row style={styles.emailCheck}>
                            <Text size={12} color={argonTheme.COLORS.ERROR}>
                              {phoneErrorMessage}
                            </Text>
                          </Block>
                          }
                        </Block>
                        <Block width={width * 0.8}>
                          <Input
                            password
                            borderless
                            placeholder="Password"
                            onChangeText={value => this.handleChangePasswordInput(value)}
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
                            <Text size={12} color={argonTheme.COLORS.MUTED}>
                              password strength:
                            </Text>
                            <Text bold size={12} color={passwordStrength.color}>
                              {` ${passwordStrength.label}`}
                            </Text>
                          </Block>
                        </Block>
                      </KeyboardAwareScrollView>
                    </ScrollView>
                    <Block row width={width * 0.75}>
                      <Checkbox
                        checkboxStyle={{
                          borderWidth: 3
                        }}
                        initialValue={true}
                        onChange={value => this.setState({isAgreeWithPolicy: value})}
                        color={argonTheme.COLORS.PRIMARY}
                        label="I agree with the"
                      />
                      <Button
                        style={{ width: 100, borderWidth: 0 }}
                        color="transparent"
                        textStyle={{
                          color: argonTheme.COLORS.PRIMARY,
                          fontSize: 14
                        }}
                        onPress={() => Linking.openURL("https://guidy.flycricket.io/privacy.html")}
                      >
                        Privacy Policy
                      </Button>
                    </Block>
                    <Block middle>
                      <Button disabled={isLoading} color={signupSuccess ? "success" : "primary"} style={styles.createButton} onPress={() => this.handleSignup()}>
                        {!isLoading && <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          CREATE ACCOUNT
                        </Text>}
                        {!!isLoading && !signupSuccess && <ActivityIndicator size="small" color="#0000ff" />}
                        { !!isLoading && signupSuccess && 
                        <Icon
                          name="checkcircle"
                          family="AntDesign"
                          size={35}
                          color={"white"}
                          style={{  }}
                        />}

                      </Button>
                    </Block>
                  </Block>
                </Block>
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
    height: height * 0.9,
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
  emailCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 10
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginBottom: 15,
    marginTop: 15
  }
});

export default Register;
