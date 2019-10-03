import * as React from 'react';
import { Modal, Row, Col, Tabs, Collapse } from 'antd';
import withRematch from '../rematch/withRematch';
import initStore from '../rematch/store';
import LoginForm from '../components/landing-page/LoginForm';
import RegisterForm from '../components/landing-page/RegisterForm';
import LandingPageBlackHeader from '../components/LandingPageBlackHeader';
import ResetPasswordForm from '../components/landing-page/ResetPasswordForm';
import './faq.css';
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
class FAQ extends React.Component<any, any> {
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
        <div id='faq-content' style={{background: '#262626'}}>
        <h1>FREQUENTLY ASKED<br/>
          QUESTIONS</h1>
          <Tabs defaultActiveKey="1" style={{ padding: '50px', background: '#262626', color: '#fff' }}>
            <TabPane tab="GENERAL FAQ" key="1">
              <Collapse accordion>
                <Panel header="What is SkyAce™ ?" key="1">
                  <p>SkyAce™ is a simple and easy-to-use portal/online marketplace that aims to help students find their ideal tutor online.</p>
                </Panel>
                <Panel header="How does SkyAce™ work ?" key="2">
                  <p>SkyAce™ is a simple and easy-to-use portal/online marketplace that aims to help students find their ideal tutor online.
If you are a tutor, you will need to sign up for an account with your personal particulars, teaching credentials and hourly rates.</p>
                </Panel>
                <Panel header="How are lessons conducted ?" key="3">
                  <p>Instead of the traditional face-to-face tuition, SkyAce™ allows virtual classes to take place real-time over our portal so that both students and tutors can learn/teach in the comforts of their own homes.</p>
                </Panel>
                <Panel header="How is SkyAce™ different from other tuition centres ?" key="4">
                  <p>Unlike other private tuition centres, SkyAce™ operates more like a marketplace for students to search for various tutors of different subjects.
The tutors are not affiliated with SkyAce™ so you can be assured of being paired with tutors of the best compatibility and solely based on your choice.</p>
                </Panel>
                <Panel header="Is my information secure ?" key="5">
                  <p>Information collected on the portal is solely to help students find their ideal tutors, and will not be used, disclosed or processed to other third parties for other purposes.</p>
                </Panel>
                <Panel header="Can I change my password ?" key="6">
                  <p>To change your account password, simply go to Account > Change Password. You will be required to key in both your existing password and new password.</p>
                </Panel>
                <Panel header="I’ve forgotten my password !" key="7">
                  <p>At the login page, there is an option for “Forgot Password”. Enter your account email and an email to reset your password will be sent to that email address.</p>
                </Panel>
              </Collapse>
            </TabPane>

            <TabPane tab="STUDENT FAQ" key="2">
              <Tabs defaultActiveKey="student-1">
                <TabPane tab="GETTING STARTED" key="student-1">
                  <Collapse accordion>
                    <Panel header="Do I need to create an account ?" key="1">
                      <p>Yes, all students will be required to sign up for a SkyAce™ account.
    After activation, you may begin your search for the tutor.
Simply fill up your tuition request and the list of suitable tutors will pop up!.</p>
                    </Panel>
                    <Panel header="How many accounts do I need to create if I have more than one child ?" key="2">
                      <p>One per student.</p>
                    </Panel>
                    <Panel header="Do I need to pay a deposit in order to use the service ?" key="3">
                      <p>No, deposit is not required before service confirmation.</p>
                    </Panel>
                    <Panel header="How do I start ?" key="4">
                      <p>After setting up your account, fill in your tuition request and begin your search for your tutor.
You may make use of the filter options to review and select the tutor that best fits your requirements.</p>
                    </Panel>
                  </Collapse>
                </TabPane>
                <TabPane tab="USING SKYACE™" key="student-2">
                <Collapse accordion>
    <Panel header="
Can I run SkyAce™ in a different time zone ?" key="1">
      <p>Yes, you may use the service even if you are in a different time zone as the tutor. The tutor’s availability will be displayed as per your time zone.</p>
    </Panel>
    <Panel header="My tutor is absent. What do I do ?" key="2">
      <p>Your tutor may have missed the lessons due to unforeseen personal or technical circumstances. In such instances, please make a report through the ‘Report Issue’ option for the particular session or send us your feedback via the feedback form in the portal, so we can find out what happens.
Your tutor should reschedule a make up lesson when both parties are available.</p>
    </Panel>
  </Collapse>
                </TabPane>
                <TabPane tab="PAYMENTS & REFUNDS" key="student-3">
                <Collapse accordion>
    <Panel header="How do I pay for my lessons ?" key="1">
      <p>Payment can be done through our portal with a valid credit or debit card. This card will be saved as the default payment method unless you opt to change it.</p>
    </Panel>
    <Panel header="What if I want to drop out halfway through my classes ?" key="2">
      <p>You may choose to drop out, however it is not encouraged. In general, there is no refund if you choose to drop out before completing your package.
However, if this is an issue with the tutor, you may report the issue through the session feedback.</p>
    </Panel>
    <Panel header="Can I get a refund if I don’t like my tutor ?" key="3">
      <p>There is no refund if you choose to stop your class or change your tutor due to personal reasons.
However, you may report to us if your tutor had stepped out of line or had displayed unprofessionalism in any way through the session feedback.</p>
    </Panel>
  </Collapse>
                </TabPane>
              </Tabs>
            </TabPane>
            <TabPane tab="TUTOR FAQ" key="3">
            <Tabs defaultActiveKey="tutor-1">
    <TabPane tab="GETTING STARTED" key="tutor-1">
    <Collapse accordion>
    <Panel header="Do I need to create an account ?" key="1">
      <p>As with students, all tutors will be required to sign up for a SkyAce™ account.
You will also be asked to provide your personal particulars, teaching credentials and hourly rates for the subject(s) you will be teaching.</p>
    </Panel>
    <Panel header="How do I get students ?" key="2">
      <p>Once your account is set up, you are ready to go.
Students will use the portal to find tutors based on their subject preference and academic level.</p>
    </Panel>
  </Collapse>
    </TabPane>
    <TabPane tab="USING SKYACE™" key="tutor-2">
    <Collapse accordion>
    <Panel header="What if I want to drop out halfway through my classes ?" key="1">
      <p>Currently, tutors are not allowed to drop out or terminate their tutoring sessions. In exception cases, you may choose to drop out, but it is not encouraged.
Note that dropping out or terminating your sessions/courses prematurely means you will not receive your tutoring dues.</p>
    </Panel>
    <Panel header="Can I get a refund if I don’t like my student ?" key="2">
      <p>There is no refund if you choose to terminate or stop your class due to personal reasons. Note that you will only be paid after you have rendered your tutoring services completely, e.g. one cycle of the entire course – 8 lessons for Primary Level or 4 lessons for Secondary Level.
However, you may report to us if your student had stepped out of line or had displayed unprofessionalism in any way</p>
    </Panel>
    <Panel header="My student is absent. What do I do ?" key="3">
      <p>A lesson is marked as completed after the end time even if the student is absent. However, in the event the student has a valid reason and request for an additional lesson, the tutor has the discretion to allow an extension or reschedule of this lesson.
We do encourage tutors to extend or allow such additional lesson if the student has a valid reason.</p>
    </Panel>
    <Panel header="Can I run SkyAce™ in a different time zone ?" key="4">
      <p>Yes, you may use the service even if you are in a different time zone as the tutor. The tutor’s availability will be displayed as per his/own time zone. All you need is to convert the scheduled time to your local time!</p>
    </Panel>
  </Collapse>
    </TabPane>
  </Tabs>
            </TabPane>
          </Tabs>
        </div>
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
export default withRematch(initStore, mapState, mapDispatch)(FAQ);
