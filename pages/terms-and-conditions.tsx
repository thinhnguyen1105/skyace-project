import * as React from 'react';
import './terms-and-conditions.css';
import { Modal, Row, Col } from 'antd';
import withRematch from '../rematch/withRematch';
import initStore from '../rematch/store';
import LoginForm from '../components/landing-page/LoginForm';
import RegisterForm from '../components/landing-page/RegisterForm';
import LandingPageBlackHeader from '../components/LandingPageBlackHeader';
import ResetPasswordForm from '../components/landing-page/ResetPasswordForm';
class TermsAndConditions extends React.Component<any, any> {
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
      <div className="page-body" style={{paddingTop: '100px', background: '#262626', color: '#d8d8d8'}}>
      <section id="terms-and-conditions">
        <div className="section-inner">
          <div className="wrapper">
            <div className="section-title">
              <h1><strong>TERMS AND CONDITIONS</strong></h1>
              <div className="seperator size-small"><span></span></div>
            </div>
            <div className="column-section clearfix align-justify">
                <div className="column one-full clearfix sr-animation sr-animation-frombottom animated" data-delay="0">
                    <h3><strong> 1. Introduction </strong></h3>
                    <p> 1.1 We are E Learning Net Pte. Ltd. trading as <a href="https://www.skyace-learning.com/">www.skyace-learning.com</a> (“SkyAce” or the “Site”). Access to any part of the Site is governed by these terms and conditions (hereinafter referred to as the "Terms"). Please take some time to read these Terms before proceeding any further or registering with us or making payment for any Lesson. If you do not accept any of the Terms, please exit the Site immediately. Your access and/or use of the Site shall be deemed to be an acceptance of the Terms.</p>
                    <p> 1.2 In the Terms, "we", "us" and "our" refer to E Learning Net Pte. Ltd. (UEN 201720282W) and/or <a href="https://www.skyace-learning.com/">www.skyace-learning.com</a>. "You" and "your" refer to any person accessing and/or using the Site.</p>
                    <p> 1.3 We may revise and/or change the Terms at any time without notice to you. Your continued access and/or use of the Site shall be deemed to be an acceptance of the Terms as revised or amended from time to time.</p>
                    <div className="spacer spacer-small"></div>
                    <h3><strong> 2. Interpretation </strong></h3>
                    <p> 2.1 In the Terms:-</p>
                    <p> 2.1.1 "<strong>Charge</strong>" means the amount payable by the Tutee to us in respect of a Lesson;</p>
                    <p> 2.1.2 "<strong>Tutee</strong>" means a person using the Site for the purpose of participating in a Lesson with a Tutor;</p>
                    <p> 2.1.3 "<strong>Tutor</strong>" means a person using the Site for the purpose of offering tuition services;</p>
                    <p> 2.1.4 "<strong>Lesson</strong>" means a lesson between a Tutor and a Tutee or Tutees conducted via the online classNameroom facility available on the Site; and</p>
                    <p> 2.1.5 "<strong>User</strong>" means a Tutor, a Tutee or anyone accessing and/or using the Site.</p>
                    <p> 2.2 In the Terms, words importing the singular shall include the plural and vice versa, words importing the masculine gender shall include the feminine and neuter genders, and words importing persons shall include individuals, bodies corporate, unincorporated associations and partnerships.</p>include individuals, bodies corporate, unincorporated associations and partnerships.<p></p>
                    <div className="spacer spacer-small"></div>
                    <h3><strong> 3. Registration </strong></h3>
                    <p> 3.1 In order to participate in Lessons, Users shall be required to register with us. Any personal information supplied to us as part of this registration process and/or any other interaction with us shall be collected, stored and used in accordance with our personal data protection policy.</p>
                    <p> 3.2 Users must register with a valid personal email address and telephone number for the purposes of communications and notices to be made pursuant to the Terms.</p>
                    <div className="spacer spacer-small"></div>
                    <h3><strong> 4. Payment </strong></h3>
                    <p> 4.1 The Charges are determined by the Tutors and are specified as an hourly rate. Where applicable, prices are in Singapore Dollars and are inclusive of goods and services tax (GST) chargeable under the Singapore Goods and Services Tax Act (Cap. 117A). Prices are however exclusive of any additional or other value-added tax, levy or charge chargeable under any law in any other jurisdiction. The Tutor and/or Tutee shall be liable for the payment of any such additional or other value-added tax, levy or charge chargeable under any law in any other jurisdiction from which the Tutor and/or the Tutee is located.</p>
                    <p> 4.2 Tutees shall pay for the Charges for four (4) weeks of  Lessons (including but not limiting to either 4 or 8 Lessons depending on the academic level) in advance upon the booking of a Tutor. All Charges payable shall be paid by the Tutee to E Learning Net Pte. Ltd.</p>
                    <p> 4.3 Once the tuition assignment is confirmed, the Tutors and/or the Tutees are not allowed to cancel the said assignment until the four (4) weeks of Lessons are completed. In the event of cancellation of any of the said Lessons by the Tutee, E Learning Net Pte. Ltd. shall not refund any of the Charges or payments made by the Tutee. In the event of a dispute, the Tutors and/or the Tutees should attempt to resolve it before reporting to E Learning Net Pte. Ltd.</p>
                    <p> 4.4 There will be no refund in the event of cancellation of the entire Course. If the Tutor or Tutee terminates the tuition, E Learning Net Pte. Ltd. must be informed of the reason for cancellation from both parties to determine if there will be any refund given back to Tutee, and/or if Tutor will receive any payment. Where necessary, E Learning Net Pte. Ltd. will seek a replacement for the Tutee.</p>
                    <div className="spacer spacer-small"></div>
                    <h3><strong> 5. Attendance </strong></h3>
                    <p> 5.1 Tutors and Tutees are encouraged to be punctual for all Lessons. In the event you may be late, you are to inform your Tutor or Tutee by way of leaving a message before the start of the Lesson.</p>
                    <p> 5.2 In the event if the Tutor is late for more than 15 minutes and the Tutee exits the online className, the said Lesson will be considered as incomplete. The Tutor is expected to reschedule for a makeup Lesson with the Tutee at no extra Charge to the Tutee. If one party is late and the other party does not exit the online className, the Lesson will continue with the remaining duration and conclude at the scheduled end time. </p>
                    <div className="spacer spacer-small"></div>
                    <h3><strong> 6. Warranties </strong></h3>
                    <p> 6.1 Each of the Tutors hereby warrants to us and all Tutees that:-</p>
                    <p> 6.1.1 he is at least twenty-one (21) years of age and has the necessary qualification or experience to provide the tuition in the subject(s) he offers in his profile on the Site;</p>
                    <p> 6.1.2 he has provided to us accurate and up to date information about himself;</p>
                    <p> 6.1.3 he shall be personally responsible for the information posted by him on the Site and shall indemnify us and each of our officers, employees, directors, representatives and agents against all and any liability incurred as a result of any false, inaccurate, incomplete and/or misleading information provided about himself;</p>
                    <p> 6.1.4 he shall not provide to Users any identifying information about himself including, but not limited to, phone number, e-mail address, home address and/or details of any organisation, school or body of which he is a member;</p>
                    <p> 6.1.5 he shall not request from any User information that could allow the User to be personally identified including, but not limited to, phone number, e-mail address, home address and/or details of any organisation, school or body of which he is a member;</p>
                    <p> 6.1.6 he shall indemnify us against any and all losses, liabilities, costs, damages and/or expenses howsoever incurred by us in connection with his use of the Site and his breach of any of the Terms;</p>
                    <p> 6.1.7 he shall be wholly responsible for the appropriateness of the content of any video or other materials that he provides as part of a Lesson and shall ensure that the same are not illegal or offensive or otherwise infringe any laws in Singapore or in any other applicable jurisdiction;</p>
                    <p> 6.1.8 he is an independent contractor and shall not for any purpose be considered or deemed an employee and/or agent of ours; and</p>
                    <p> 6.1.9 he shall participate fully and professionally, and not engage in any disruptive, offensive or abusive behaviour and/or unlawful or objectionable conduct, in all Lessons.</p>
                    <div className="spacer spacer-small"></div>
                    <h3><strong> 7. Modifications to and Availability of the Site </strong></h3>
                    <p> 7.1 We reserve the absolute right to alter, suspend and/or discontinue any aspect of the Site or the services provided through the Site, including access to the Site, at our sole discretion and under any circumstances.</p>
                    <p> 7.2 We aim to make the Site available at all times but cannot guarantee that the Site will operate continuously or without interruptions or that it will be error free. Technical difficulties or connection errors due to User’s slow network is not the responsibility of us. Your connection must not attempt to interfere with the proper working of the Site and Users shall not attempt to tamper with, hack into, or otherwise disrupt any computer system, server, router or any other internet connected device in respect of the Site.</p>
                    <p> 7.3 We shall not guarantee the continued availability of any Tutor and accept no responsibility or liability for the withdrawal, removal or unavailability of the same.</p>
                    <div className="spacer spacer-small"></div>
                    <h3><strong> 8. Disclaimers and Limitation of Liability </strong></h3>
                    <p> 8.1 The views expressed by Users are solely theirs and, unless specifically stated, are not shared by us. We shall not be responsible for any information, views, opinions or comments provided, posted or published by Users on the Site.</p>
                    <p> 8.2 We shall not be responsible for the availability or content of any third party websites that are accessible through the Site. Any links to third party websites from the Site do not amount to any endorsement and/or acceptance of that website by us and any use of that website by a User is at his own risk.</p>
                    <p> 8.3 The Site and all materials and information thereon, including the information, names, images, pictures, logos and icons regarding or relating to us, our products and/or services (or to third party products and/or services), are provided "as is" and on an "as available" basis. To the fullest extent permitted by law, we exclude all representations, warranties and endorsements (whether express or implied by law), including the implied warranties of satisfactory quality, fitness for a particular purpose, non-infringement, compatibility, security and accuracy. We do not guarantee the timeliness, completeness or performance of the Site and/or any of the content. While we try to ensure that all content provided by us is correct at the time of publication, no responsibility is accepted by us for any errors, omissions or inaccurate content on the Site.</p>
                    <p> 8.4 We shall not be liable for any consequence, loss or damage of any nature whatsoever and howsoever arising out of or in connection with the viewing, use or performance of the Site and/or its content, whether due to inaccuracy, error, omission or any other cause and whether on the part of us, our servants or agents, or any other person. Such shall include, but not be limited to, loss of data, loss of revenue or anticipated profits, loss of business, loss of opportunity, loss of goodwill or injury to reputation, losses suffered by third parties or any indirect, consequential, special or exemplary damages arising from the use of the Site regardless of the form of action.</p>
                    <p> 8.5 We do not warrant that the Site or any aspect of the same will be uninterrupted or error free, that defects will be corrected, or that the Site or the server that makes it available are free of viruses. All Users acknowledge that it is their sole responsibility to implement sufficient procedures and virus checks (including anti-virus and other security checks) to satisfy their particular requirements for the accuracy of data input and output.</p>
                    <p> 8.6 Users are responsible for ensuring that their computer systems meet all relevant technical specifications necessary to use the Site and that they are compatible with the Site. Users also understand that we cannot and do not guarantee or warrant that any material available for downloading from the Site will be free from viruses. Users are responsible for implementing sufficient procedures and virus checks (including anti-virus and other security checks) to satisfy their particular requirements for the accuracy of data input and output.</p>
                    <p> 8.7 We accept no responsibility for any consequence relating directly or indirectly to any action or inaction Users take based on the information, services or other material available on or through the Site.</p>
                    <p> 8.8 We provide no warranty or representation, whether express or implied, in respect of any Tutor. We accept no liability for any losses, damages, costs, expenses or other claims for compensation arising from the failure of the Tutor to meet a User's requirements.</p>
                    <p> 8.9 We shall not be liable to Users for any breach, hindrance or delay in the performance of the Site or the provision of the services contemplated by the Site that is attributable to any cause beyond our reasonable control, including without limitation, strikes, lock-outs or other industrial action, civil commotion, riot, invasion, terrorist attack or threat of terrorist attack, war, threat or preparation for war, fire, explosion, storm, flood earthquake, subsidence, epidemic or other natural disaster, impossibility of the use of public or private telecommunication networks, acts, decrees, legislation or restrictions of any government, shipping, postal or other relevant transport strike, failure or accidents, cyber harassment or other unauthorised use and abuse of the Site by unauthorised users of the Site.  </p>
                    <div className="spacer spacer-small"></div>
                    <h3><strong> 9. General </strong></h3>
                    <p> 9.1 Users may link to the Site’s home page provided that it is done in a way that is legal and is not likely to damage our reputation or take advantage of it. However, Users shall not establish a link in such a way as to suggest any form of association, approval or endorsement on our part where none exists. Users shall not establish a link from any site that is not owned by the User. </p>
                    <p> 9.2 The Site must neither be framed on any other site nor may Users create a link to any part of this Site other than the home page. We reserve the right to withdraw linking permission without notice or reference to the User/s. </p>
                    <p> 9.3 All content included in or made available through the Site such as text, graphics, logos, button icons, images, audio clips, digital downloads, campaign titles and data compilations is the property of E Learning Net Pte. Ltd. and its licensors. Users may store, print and display the content supplied on the Site solely for personal use and Users are not permitted to publish, manipulate, distribute or otherwise reproduce in any format any of the content or copies of the content supplied through the Site or which appears on the Site.</p>
                    <p> 9.4 We may assign or subcontract any or all of our rights and obligations under the Terms.</p>
                    <p> 9.5 All communications and notices to be made pursuant to the Terms shall be in the English language.</p>
                    <p> 9.6 In the event that any provision of the Terms shall be held invalid or unenforceable for any reason, such invalidity or unenforceability shall not affect any other provision of the Terms, unless the invalidity or unenforceability Of any such provision does substantial violence to, or where the invalid or unenforceable provision comprises an integral part of, or is otherwise inseparable from, the remainder of the Terms.</p>
                    <p> 9.7 No failure or delay on our part in exercising any right, power or privilege in the Terms shall constitute or be deemed to be a waiver thereof, nor shall any single or partial exercise of any right, power or privilege preclude any other or further exercise thereof or the exercise of any other right, power or privilege.</p>
                    <p> 9.8 We reserve the right to amend these Terms at any time. All amendments to these Terms will be posted online. However, continued use of the Site will be deemed to constitute acceptance of the new Terms from time to time. </p>
                    <p> 9.9 Nothing in these Terms or any contract between us and each User shall create or be deemed to create a partnership, agency or a relationship of employer and employee between us and each User.</p>
                    <p> 9.10 The Terms shall be governed and construed in accordance with the laws of Singapore and Users submit unconditionally to the exclusive jurisdiction of the courts of Singapore.</p>
                </div>
            </div>
          </div>
          <div className="spacer spacer-big"></div>
      </div></section>
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

export default withRematch(initStore, mapState, mapDispatch)(TermsAndConditions);