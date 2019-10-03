import * as React from 'react';
import { Layout, Form, Row, Col, Radio, Divider, Button, Input, Modal, Icon, message, AutoComplete } from 'antd';
import config from '../../api/config';
import { dataPhone } from '../../data_common/CountryCodes';
import { getAuthService, getUsersService } from '../../service-proxies';
import Webcam from 'react-webcam';
import SocialLoginButtons from './SocialLoginButtons';
import initFirebaseApp from '../../nextjs/helpers/init-firebase';
import firebase from 'firebase';
import dynamic from "next/dynamic";
const ReactMic: any = (dynamic(import("react-mic").then((modules) => modules.ReactMic)));

const sortedDataPhone = dataPhone.sort((a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
});

class RegisterForm extends React.Component<any, any> {
  async componentDidMount() {
    // Detect country code by IP address
    try {
      const usersService = getUsersService();
      const ip: any = await usersService.getIP();
      const geolocation: any = await usersService.getUserGeolocation(ip.ip);
  
      const countries = sortedDataPhone.filter((item) => item.code === geolocation.country_code2);
      this.props.signUpPageReducers.onPhoneIDChange({phoneID: countries[0] ? countries[0].dial_code : ''});
    } catch (error) {
      console.log(error);
    }
  }

  checkEmailExist = async (_rule, value, callback) => {
    const authService = getAuthService();
    const emailExisted = await authService.checkEmail(value);
    if (emailExisted) {
      callback(this.props.languageState.REGISTER_FORM_EMAIL_USED.translated);
    }
    callback();
  }

  handleRegisterFormSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, _values) => {
      if (!err) {
        this.props.signUpPageReducers.signUpEffect({
          firstName: this.props.signUpPageState.firstName,
          lastName: this.props.signUpPageState.lastName,
          email: this.props.signUpPageState.email,
          password: this.props.signUpPageState.password,
          phone: {
            phoneID: this.props.signUpPageState.phoneID,
            phoneNumber: this.props.signUpPageState.phoneNumber
          },
          roles: this.props.signUpPageState.roles,
          redirectUrl: "/auth/login"
        });
        this.props.form.resetFields();
        this.props.openRegisterSuccessModal();
        this.props.closeRegisterModal();
      }
    });
  }

  loginWithFacebook = async () => {
    if (!firebase.apps.length) {
      initFirebaseApp();
    }

    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      if (result && result.additionalUserInfo && result.additionalUserInfo.profile) {
        this.props.loginPageReducers.loginWithFacebook({
          email: (result as any).additionalUserInfo.profile.email,
          firstName: (result as any).additionalUserInfo.profile.family_name,
          lastName: (result as any).additionalUserInfo.profile.given_name,
          externalLogin: {
            google: {
              id: (result as any).additionalUserInfo.profile.id,
              email: (result as any).additionalUserInfo.profile.email,
            },
          },
        });
      }
    } catch (error) {
      console.log('Error: ', error);
      message.error( error.message || this.props.languageState.REGISTER_FORM_INTERNAL_ERROR.translated, 4);
    }
  }

  loginWithGoole = async () => {
    if (!firebase.apps.length) {
      initFirebaseApp();
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      if (result && result.additionalUserInfo && result.additionalUserInfo.profile) {
        this.props.loginPageReducers.loginWithGoogle({
          email: (result as any).additionalUserInfo.profile.email,
          firstName: (result as any).additionalUserInfo.profile.family_name,
          lastName: (result as any).additionalUserInfo.profile.given_name,
          externalLogin: {
            google: {
              id: (result as any).additionalUserInfo.profile.id,
              email: (result as any).additionalUserInfo.profile.email,
            },
          },
        });
      }
    } catch (error) {
      console.log('Error: ', error);
      message.error( error.message || this.props.languageState.REGISTER_FORM_INTERNAL_ERROR.translated, 4);
    }
  }

  render() {
    const dataSourcePhoneID = sortedDataPhone.map((country) => {
      return {
        value: country.dial_code,
        text: country.name + ' ' + '(' + country.dial_code + ')'
      };
    });
    const phoneIdSelector = () => {
      return (
        <AutoComplete
          value={this.props.signUpPageState.phoneID ? this.props.signUpPageState.phoneID : undefined}
          dataSource={dataSourcePhoneID}
          placeholder="Country Code"
          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          onChange={value => {
            this.props.signUpPageReducers.onPhoneIDChange({phoneID: value});
            this.props.form.setFields({
              phoneNumber: {
                value: this.props.signUpPageState.phoneNumber,
                errors: null
              },
            });
          }}
          style={{ width: 200, height: 30 }}
        />
      );
    };

    const { getFieldDecorator } = this.props.form;
    const FormItem = Form.Item;

    return (
      <div>
        <Layout
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent"
          }}
        >
          <Form
            onSubmit={this.handleRegisterFormSubmit}
            style={{
              padding: "25px",
              borderRadius: "10px",
            }}
          >
            <Row style={{ textAlign: "center" }}>
              <Col span={24}>
                <h2 style={{ marginBottom: '0px' }}>{this.props.languageState.REGISTER_FORM_HEADLINE.translated}</h2>
              </Col>
            </Row>

            <SocialLoginButtons
              titleFacebook={this.props.languageState.REGISTER_FORM_FB.translated}
              titleGoogle={this.props.languageState.REGISTER_FORM_GG.translated}
              loginWithFacebook={this.loginWithFacebook}
              loginWithGoole={this.loginWithGoole}
            />

            {/* <Divider /> */}

            <Row type='flex' gutter={24}>
              <Col span={24}>
                <h1 style={{textAlign: 'center', marginTop: '24px'}}>{this.props.languageState.REGISTER_FORM_OR.translated}</h1>
              </Col>
            </Row>

            <Row gutter={24} type='flex'>
              <Col span={24}>
                <FormItem style={{marginBottom: '0px', textAlign: 'center'}}>
                  <h3>{this.props.languageState.REGISTER_FORM_CHOOSE_PROFILE.translated}</h3>
                  {getFieldDecorator("roles", {
                    rules: [
                      { required: true, message: this.props.languageState.REGISTER_FORM_SELECT_PROFILE_VAL.translated }
                    ]
                  })(
                    <Radio.Group
                      style={{ width: "100%" }}
                      buttonStyle="solid"
                      onChange={e => this.props.signUpPageReducers.onInfoChange({ roles: [e.target.value] })}
                    >
                      <Radio.Button
                        value="student"
                        style={{
                          display: "block",
                          textAlign: "center",
                          borderRadius: '4px',
                          marginBottom: '8px',
                          fontWeight: 600
                        }}
                      >
                        {this.props.languageState.REGISTER_FORM_STUDENT.translated}
                      </Radio.Button>
                      <Radio.Button
                        value="tutor"
                        style={{
                          display: "block",
                          textAlign: "center",
                          borderRadius: '4px',
                          fontWeight: 600
                        }}
                      >
                        {this.props.languageState.REGISTER_FORM_TUTOR.translated}
                      </Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={24} type='flex'>
              <Col span={24}>
                <FormItem label={this.props.languageState.REGISTER_FORM_GIVEN_NAME.translated} style={{marginBottom: '0px'}}>
                  {getFieldDecorator("firstName", {
                    rules: [
                      {required: true, message: this.props.languageState.REGISTER_FORM_GIVEN_NAME_VAL_1.translated},
                      {pattern: /^(.){2,20}$/, message: this.props.languageState.REGISTER_FORM_GIVEN_NAME_VAL_1.translated},
                    ],
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                  })(
                    <Input
                      onChange={event =>
                        this.props.signUpPageReducers.onInfoChange({
                          firstName: (event.target as any).value
                        })
                      }
                      type="text"
                      placeholder={this.props.languageState.REGISTER_FORM_GIVEN_NAME_PL.translated}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label={this.props.languageState.REGISTER_FORM_FAMILY_NAME.translated} style={{marginBottom: '0px'}}>
                  {getFieldDecorator("lastName", {
                    rules: [
                      {required: true, message: this.props.languageState.REGISTER_FORM_FAMILY_NAME_VAL_1.translated},
                      {pattern: /^(.){2,20}$/, message: this.props.languageState.REGISTER_FORM_FAMILY_NAME_VAL_2.translated}
                    ],
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                  })(
                    <Input
                      onChange={event =>
                        this.props.signUpPageReducers.onInfoChange({
                          lastName: (event.target as any).value
                        })
                      }
                      type="text"
                      placeholder={this.props.languageState.REGISTER_FORM_FAMILY_NAME_PL.translated}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={24}>
                <FormItem label={this.props.languageState.REGISTER_FORM_EMAIL.translated} style={{marginBottom: '0px'}}>
                  {getFieldDecorator("email", {
                    rules: [
                      { required: true, message: this.props.languageState.REGISTER_FORM_EMAIL_VAL.translated },
                      { validator: this.checkEmailExist }
                    ],
                    validateTrigger: "onBlur",
                    validateFirst: true
                  })(
                    <Input
                      onChange={event =>
                        this.props.signUpPageReducers.onInfoChange({
                          email: (event.target as any).value
                        })
                      }
                      type="email"
                      placeholder="E.g yourname@email.com"
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label={this.props.languageState.REGISTER_FORM_MOBILE.translated} style={{marginBottom: '0px'}}>
                  {getFieldDecorator("phoneNumber", {
                    rules: [
                      {required: true, message: this.props.languageState.REGISTER_FORM_MOBILE_VAL_1.translated},
                      {pattern: /^([0-9]){4,15}$/, message: this.props.languageState.REGISTER_FORM_MOBILE_VAL_2.translated},
                      {
                        validator: (_rule, _value, callback) => {
                          if (!this.props.signUpPageState.phoneID) {
                            callback(this.props.languageState.REGISTER_FORM_MOBILE_VAL_3.translated);
                          }
                          callback();
                        }
                      }
                    ],
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                  })(
                    <Input
                      style={{width: '100%', display: 'block'}}
                      addonBefore={phoneIdSelector()}
                      onChange={event =>
                        this.props.signUpPageReducers.onInfoChange({
                          phoneNumber: (event.target as any).value
                        })
                      }
                      type="text"
                      placeholder="E.g 8123 4567"
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={24}>
                <FormItem label={this.props.languageState.REGISTER_FORM_PASSWORD.translated} style={{marginBottom: '0'}}>
                  {getFieldDecorator("password", {
                    rules: [
                      {required: true, message: "Your password is required"},
                      {
                        pattern: config.usersModuleConfig.passwordRegex,
                        message: this.props.languageState.REGISTER_FORM_PASSWORD_VAL_1.translated
                      }
                    ],
                    validateTrigger: "onBlur",
                    validateFirst: true
                  })(
                    <Input
                      onChange={event =>
                        this.props.signUpPageReducers.onInfoChange({
                          password: (event.target as any).value
                        })
                      }
                      type="password"
                      placeholder={this.props.languageState.REGISTER_FORM_PASSWORD_PL.translated}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={24}>
                <FormItem label={this.props.languageState.REGISTER_FORM_RECONFIRM.translated} style={{marginBottom: '14px'}}>
                  {getFieldDecorator("confirm", {
                    rules: [
                      {required: true, message: this.props.languageState.REGISTER_FORM_RECONFIRM_VAL_1.translated},
                      {
                        validator: (_rule, value, callback) => {
                          if (value !== this.props.signUpPageState.password) {
                            callback(this.props.languageState.REGISTER_FORM_RECONFIRM_VAL_2.translated);
                          }
                          callback();
                        }
                      }
                    ],
                    validateTrigger: "onBlur",
                    validateFirst: true
                  })(
                    <Input
                      onChange={event =>
                        this.props.signUpPageReducers.onInfoChange({
                          confirm: (event.target as any).value
                        })
                      }
                      type="password"
                      placeholder={this.props.languageState.REGISTER_FORM_RECONFIRM_PL.translated}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={2} />
              <Col span={20}>
                <FormItem style={{marginBottom: '10px'}}>
                  <Button
                    type="primary"
                    icon='camera-o'
                    style={{ width: "100%", height: "35px" }}
                    onClick={this.props.signUpPageReducers.onWebCamModalVisible}
                  >
                  {this.props.languageState.REGISTER_FORM_CHECK_WEBCAM.translated}
                  </Button>
                </FormItem>
              </Col>
              <Col span={2} style={{marginTop: '6px', padding: '0'}}>
                {this.props.signUpPageState.checkCamResult ? <Icon type="check-circle" style={{ fontSize: '24px', color: '#52c41a' }} /> : null}
              </Col>
              
              <Col span={2} />
              <Col span={20}>
                <FormItem style={{marginBottom: '10px'}}>
                  <Button
                    type="primary"
                    icon='sound'
                    style={{ width: "100%", height: "35px" }}
                    onClick={this.props.signUpPageReducers.onMicModalVisible}
                  >
                  {this.props.languageState.REGISTER_FORM_CHECK_MICRO.translated}
                  </Button>
                </FormItem>
              </Col>
              <Col span={2} style={{marginTop: '6px', padding: '0'}}>
                {this.props.signUpPageState.checkMicResult ? <Icon type="check-circle" style={{ fontSize: '24px', color: '#52c41a' }} /> : null}
              </Col>

              <Col span={24}>
                <FormItem style={{marginBottom: '0px', textAlign: 'center'}}>
                  <p style={{lineHeight: 'normal'}}>
                    {this.props.languageState.REGISTER_FORM_TERM.translated}
                  </p>
                </FormItem>
                <div id="recaptcha-container" />
                <div style={{ marginTop: "5px", marginBottom: '0px' }}>
                  <Button
                    type="primary"
                    style={{ width: "100%", height: "40px" }}
                    loading={this.props.signUpPageState.isBusy}
                    htmlType="submit"
                  >
                    {this.props.languageState.REGISTER_FORM_SIGNUP.translated}
                  </Button>
                </div>
              </Col>

              <Divider />

              <Col span={24}>
                <p>
                  {this.props.languageState.REGISTER_FORM_HAVE_ACC.translated} <a onClick={this.props.openLoginModal}>{this.props.languageState.REGISTER_FORM_LOG_IN.translated}.</a>
                </p>
              </Col>
            </Row>
          </Form>
        </Layout>

        <Modal
          title={this.props.languageState.REGISTER_FORM_TEST_WEBCAM.translated}
          visible={this.props.signUpPageState.webcamVisible}
          onCancel={this.props.signUpPageReducers.onWebcamModalUnVisible}
          footer={null}
          style={{
            width: '280px',
            height: '250px'
          }}
        >
          {this.props.signUpPageState.webcamVisible && (
            <Webcam
              audio={true}
              height={400}
              width={450}
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "user"
              }}
              onUserMedia={() => this.props.signUpPageReducers.checkCamResultChange({checkResult: true})}
            />
          )}
        </Modal>

        <Modal
          title={this.props.languageState.REGISTER_FORM_TEST_MICRO.translated}
          visible={this.props.signUpPageState.micVisible}
          onCancel={this.props.signUpPageReducers.onMicModalUnVisible}
          footer={null}
          width={500}
        >
          {this.props.signUpPageState.micVisible && (
            <div>
              <ReactMic
                record={this.props.signUpPageState.record}
                className="sound-wave"
                width="450"
                strokeColor="#000000"
                backgroundColor="#40a9ff"
                onData={() => this.props.signUpPageReducers.checkMicResultChange({checkResult: true})}
              />
            </div>
          )}
        </Modal>
      </div>
    );
  }
};

export default Form.create()(RegisterForm);