import * as React from 'react';
import './privacy-policy.css';
import { Modal, Row, Col } from 'antd';
import withRematch from '../rematch/withRematch';
import initStore from '../rematch/store';
import LoginForm from '../components/landing-page/LoginForm';
import RegisterForm from '../components/landing-page/RegisterForm';
import LandingPageBlackHeader from '../components/LandingPageBlackHeader';
import ResetPasswordForm from '../components/landing-page/ResetPasswordForm';
class PrivacyPolicy extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    if (!props.req) {
      await props.store.dispatch.tenantsPageModel.fetchDataEffect({
        search: '',
        pageNumber: 1,
        pageSize: 9999,
        sortBy: 'name',
        asc: true
      });
      await props.store.dispatch.landingPageModel.getLandingPageDataEffect();
    }
    else {
      props.store.dispatch.landingPageModel.getLandingPageDataSuccess({ data: props.query.landingPage });
      await props.store.dispatch.tenantsPageModel.fetchDataEffect({
        search: '',
        pageNumber: 1,
        pageSize: 9999,
        sortBy: 'name',
        asc: true
      });
    }
  }
  render() {
    return (
      <div>
        <LandingPageBlackHeader
          openLoginModal={this.props.landingPageReducer.openLoginModal}
          openRegisterModal={this.props.landingPageReducer.openRegisterModal}
          menuBar={this.props.landingPageState.data.menuBar}
          logo={this.props.landingPageState.data.logo}
          isLandingPage={false}
        />
          <div className="page-body" style={{paddingTop: '100px', background: '#262626', color: '#d8d8d8', fontWeight: 300}}>
          <Row>
          <Col lg={24} xs={24}>
          <section id="privacy-policy">
                <div className="section-inner">
                    <div className="wrapper">
                        <div className="section-title">
                            <h1><strong>PRIVACY POLICY</strong></h1>
                            <div className="seperator size-small"><span></span></div>
                            <p>Last updated: <strong>16 April 2018</strong></p>
                        </div>
                        <div className="column-section clearfix align-justify">
                            <div className="column one-full clearfix sr-animation sr-animation-frombottom animated" data-delay="0">
                                <p>
                                    SkyAce™ Learning ("us", "we", or "our") operates the <a href="https://www.skyace-learning.com/">www.skyace-learning.com</a> website (“SkyAce”, the “Site” or the “Service”). This page informs you of our policies regarding the collection, use and disclosure of Personal Information we receive from users of the Service.
                                    <br/>This page informs you of our policies regarding the collection, use and disclosure of Personal Information we receive from users of the Service.
                                </p>
                                <br/>
                                <p>
                                    We use your Personal Information only for providing and improving the Service.
                                    <br/>By using the Service, you agree to the collection and use of information in accordance with this policy.
                                </p>
                                <div className="spacer spacer-small"></div>
                                <h3><strong> Information Collection and Use </strong></h3>
                                <p>We collect information from you when you register for our service. While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to your full name, passport/NRIC/FIN number, mobile number, email address and home address ("Personal Information").</p>
                                <div className="spacer spacer-small"></div>
                                <h3><strong> Log Data </strong></h3>
                                <p>Like many site operators, we collect information that your browser sends whenever you visit our Service ("Log Data").</p>
                                <br/>
                                <p>This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages and other statistics.</p>
                                <div className="spacer spacer-small"></div>
                                <h3><strong> Communications </strong></h3>
                                <p>We may use your Personal Information to contact you with newsletters, marketing or promotional materials and other information relevant to SkyAce™’s website.</p>
                                <div className="spacer spacer-small"></div>
                                <h3><strong> Cookies </strong></h3>
                                <p>Cookies are files with small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your computer's hard drive.</p>
                                <br/>
                                <p>Like many sites, we use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
                                <div className="spacer spacer-small"></div>
                                <h3><strong> Security </strong></h3>
                                <p>We have appropriate security measures in place to protect against unauthorised access, or unauthorised alteration, disclosure or destruction of data that you share and we collect and store. The security of your Personal Information is important to us, unfortunately however, no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee unauthorised entry or use, hardware or software failure, and other factors that may compromise the security of Personal Information. Please keep your password secure and do not share it with any third parties.</p>
                                <div className="spacer spacer-small"></div>
                                <h3><strong> Changes To This Privacy Policy </strong></h3>
                                <p>This Privacy Policy is effective as of <strong>27 November 2017</strong> and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.</p>
                                <br/>
                                <p>We reserve the right to update or change our Privacy Policy at any time and you should check this Privacy Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.</p>
                            </div>
                        </div>
                    </div>
                    <div className="spacer spacer-big"></div>
            </div></section>
          </Col>
        </Row>
        <Row className='footer'>
          <div className='container'>
            <div className='footer-all-content'>
              <Col md={6}>
                <div className='raleway-font' style={{ fontFamily: 'Raleway' }}>
                  <h4 style={{ textAlign: 'left' }}><span style={{ fontSize: '24px' }}><span style={{ color: '#999999' }}>Getting Started</span></span></h4><p></p>
                  <p style={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => this.props.landingPageReducer.openLoginModal()}><span style={{ color: '#ffffff' }}>Login</span></p>
                  <p onClick={() => this.props.landingPageReducer.openRegisterModal()}><span style={{ color: '#ffffff', cursor: 'pointer' }}>Sign Up</span></p>
                </div>
                <div className='footer-content' dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.footerContent1)} />
              </Col>
              <Col md={6}>
                <div className='raleway-font' style={{ fontFamily: 'Raleway' }}>
                  <h4 style={{ textAlign: 'left' }}><span style={{ fontSize: '24px' }}><span style={{ color: '#999999' }}>Support</span></span></h4><p></p>
                  <p style={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => this.props.landingPageReducer.openResetPasswordModal()}><span style={{ color: '#ffffff' }}>Forget Password</span></p>
                </div>
                <div className='footer-content' dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.footerContent2)} />
              </Col>
              <Col md={6}>
                <div className='raleway-font' style={{ fontFamily: 'Raleway' }}>
                  <h4 style={{ textAlign: 'left' }}><span style={{ fontSize: '24px' }}><span style={{ color: '#999999' }}>Social</span></span></h4><p></p>
                </div>
                <div className='footer-content' dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.footerContent3)} />
              </Col>
              <Col md={6}>
                <div className='footer-content' dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.footerContent4)} />
              </Col>
            </div>
          </div>
        </Row>
        <Modal
          title='Log In'
          visible={this.props.landingPageState.loginModalVisible}
          onOk={this.props.landingPageReducer.closeLoginModal}
          onCancel={() => {
            this.props.landingPageReducer.closeLoginModal();
            this.props.loginPageReducers.clearState();
          }}
          width={450}
          footer={null}
          destroyOnClose={true}
        >
          <LoginForm
            loginPageState={this.props.loginPageState}
            loginPageReducers={this.props.loginPageReducers}
            openRegisterModal={this.props.landingPageReducer.openRegisterModal}
            openResetPasswordModal={this.props.landingPageReducer.openResetPasswordModal}
          />
        </Modal>

        <Modal
          title='Sign Up'
          visible={this.props.landingPageState.registerModalVisible}
          onOk={this.props.landingPageReducer.closeRegisterModal}
          onCancel={() => {
            this.props.landingPageReducer.closeRegisterModal();
            this.props.signUpPageReducers.clearState();
          }}
          width={450}
          footer={null}
          destroyOnClose={true}
        >
          <RegisterForm
            signUpPageReducers={this.props.signUpPageReducers}
            signUpPageState={this.props.signUpPageState}
            openRegisterSuccessModal={this.props.landingPageReducer.openRegisterSuccessModal}
            closeRegisterModal={this.props.landingPageReducer.closeRegisterModal}
            openLoginModal={this.props.landingPageReducer.openLoginModal}
            loginPageReducers={this.props.loginPageReducers}
          />
        </Modal>

        <Modal
          title='Reset Password'
          visible={this.props.landingPageState.resetPasswordModalVisible}
          onCancel={() => {
            this.props.landingPageReducer.closeResetPasswordModal();
            this.props.resetPasswordPageReducers.clearState();
          }}
          width={450}
          footer={null}
          destroyOnClose={true}
        >
          <ResetPasswordForm resetPasswordPageReducers={this.props.resetPasswordPageReducers} resetPasswordPageState={this.props.resetPasswordPageState} />
        </Modal>

        <Modal
          style={{ textAlign: "center", marginTop: "150px" }}
          bodyStyle={{ fontSize: "18px" }}
          closable={false}
          title="Registration Success"
          visible={this.props.landingPageState.registerSuccessModalVisible}
          footer={null}
          onCancel={this.props.landingPageReducer.closeLoginSuccessModal}
        >
          <p>
            You have successfully registered for your SkyAce Account.
            A verification email has been sent to your registered email.
            Click on the link in email to verify your account.
          </p>
        </Modal>
      </div>
      </div>
    );
  }
}

function createMarkup(data: string) {
  return { __html: data };
}

const mapState = (rootState: any) => {
  return {
    profileState: rootState.profileModel,
    landingPageState: rootState.landingPageModel,
    loginPageState: rootState.loginPageModel,
    signUpPageState: rootState.signUpPageModel,
    resetPasswordPageState: rootState.resetPasswordPageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    profileReducers: rootReducer.profileModel,
    landingPageReducer: rootReducer.landingPageModel,
    loginPageReducers: rootReducer.loginPageModel,
    signUpPageReducers: rootReducer.signUpPageModel,
    resetPasswordPageReducers: rootReducer.resetPasswordPageModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(PrivacyPolicy);