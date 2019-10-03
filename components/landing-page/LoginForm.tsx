import * as React from 'react';
import { Layout, Form, Row, Col, Button, Input, Checkbox, message } from 'antd';
import SocialLoginButtons from './SocialLoginButtons';
import initFirebaseApp from '../../nextjs/helpers/init-firebase';
import firebase from 'firebase';

class LoginForm extends React.Component<any, any> {
  componentDidMount() {
    const email = window.localStorage.getItem('email');
    const password = window.localStorage.getItem('password');

    this.props.loginPageReducers.onInputChange({
      email,
      password,
    })
  }

  onLoginFormSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, _values) => {
      if (!err) {
        if (this.props.loginPageState.isRemember) {
          window.localStorage.setItem('email', this.props.loginPageState.email);
          window.localStorage.setItem('password', this.props.loginPageState.password);
        }

        this.props.loginPageReducers.loginLocal({
          email: this.props.loginPageState.email,
          password: this.props.loginPageState.password,
        });
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
      if ( result && result.additionalUserInfo && result.additionalUserInfo.profile) {
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
      message.error( error.message || this.props.languageState.LOGIN_FORM_INTERNAL_ERROR.translated, 4);
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
      if ( result && result.additionalUserInfo && result.additionalUserInfo.profile) {
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
      message.error(error.message || this.props.languageState.LOGIN_FORM_INTERNAL_ERROR.translated, 4);
    }
  }

  render() {
    const FormItem = Form.Item;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="login-page">
        <Layout
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent"
          }}
        >
          <Form
            onSubmit={this.onLoginFormSubmit}
            style={{
              padding: "25px",
              borderRadius: "10px",
              display: "grid",
              gridGap: "15px",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "0px" }}>
              {this.props.languageState.LOGIN_FORM_SKYACE_TITLE.translated}
            </h2>
            
            <SocialLoginButtons
              titleFacebook={this.props.languageState.LOGIN_FORM_FB.translated}
              titleGoogle={this.props.languageState.LOGIN_FORM_GG.translated}
              loginWithFacebook={this.loginWithFacebook}
              loginWithGoole={this.loginWithGoole}
            />

            <h1 style={{textAlign: 'center', marginBottom: '0px'}}>OR</h1>
            <div className="login-form">
              <Row>
                <FormItem label={this.props.languageState.LOGIN_FORM_EMAIL_ADDR.translated} style={{ marginBottom: "4px" }}>
                  {getFieldDecorator("loginEmail", {
                    rules: [
                      {
                        required: true,
                        message: this.props.languageState.LOGIN_FORM_EMAIL_VALIDATE.translated
                      }
                    ],
                    validateTrigger: "onBlur",
                    validateFirst: true,
                    initialValue: this.props.loginPageState.email,
                  })(
                    <Input
                      onChange={event =>
                        this.props.loginPageReducers.onEmailChange({
                          email: (event.target as any).value
                        })
                      }
                      type="email"
                      placeholder="E.g yourname@email.com"
                      name='email'
                    />
                  )}
                </FormItem>
                <FormItem label={this.props.languageState.LOGIN_FORM_PASSWORD.translated} style={{ marginBottom: "4px" }}>
                  {getFieldDecorator("loginPassword", {
                    rules: [
                      { required: true, message: this.props.languageState.LOGIN_FORM_PASSWORD_VALIDATE.translated }
                    ],
                    validateTrigger: "onBlur",
                    validateFirst: true,
                    initialValue: this.props.loginPageState.password,
                  })(
                    <Input
                      onChange={event =>
                        this.props.loginPageReducers.onPasswordChange({
                          password: (event.target as any).value
                        })
                      }
                      type="password"
                      placeholder="E.g yourpassword"
                      name='password'
                    />
                  )}
                </FormItem>
                <FormItem style={{ marginBottom: "4px" }}>
                  <Checkbox
                    onChange={(e) => this.props.loginPageReducers.rememberMeChanage({isRemember: e.target.checked})}
                    style={{ fontWeight: "bold" }}
                    checked={this.props.loginPageState.isRemember}
                  >
                    &nbsp; {this.props.languageState.LOGIN_FORM_REMEMBER_ME.translated}
                  </Checkbox>
                </FormItem>
                <FormItem style={{ marginBottom: "0px" }}>
                  <div>
                    <Button
                      loading={this.props.loginPageState.isStarted}
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%", height: "40px" }}
                    >
                      {this.props.languageState.LOGIN_FORM_LOG_IN.translated}
                    </Button>
                  </div>
                </FormItem>
              </Row>
            </div>
            <div className="login-footer">
              <Row
                gutter={24}
                style={{
                  height: "32px",
                  lineHeight: "32px",
                  marginBottom: "4px"
                }}
              >
                <Col span={12}>
                  <div>
                    <a className="forgot-password" onClick={this.props.openResetPasswordModal}>
                      {this.props.languageState.LOGIN_FORM_FORGOT.translated}
                    </a>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ textAlign: "right" }}>
                    <a className="register-now" onClick={this.props.openRegisterModal}>
                      {this.props.languageState.LOGIN_FORM_SIGNUP.translated}
                    </a>
                  </div>
                </Col>
              </Row>
            </div>
          </Form>
        </Layout>
      </div>
    );
  }
};

export default Form.create()(LoginForm);