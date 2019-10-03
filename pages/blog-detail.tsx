import * as React from "react";
import initStore from "../rematch/store";
import withRematch from "../rematch/withRematch";
import { Row, Col, Layout, Modal } from "antd";
import Link from "next/link";
import "./blog-detail.css";
import LandingPageBlackHeader from "../components/LandingPageBlackHeader";
import LoginForm from "../components/landing-page/LoginForm";
import RegisterForm from "../components/landing-page/RegisterForm";
import ResetPasswordForm from "../components/landing-page/ResetPasswordForm";

class BlogDetail extends React.Component<any, any> {
  state = {
    recentPostsData: []
  };

  static async getInitialProps(props: any) {
    if (!props.req) {
      await props.store.dispatch.blogPageModel.getPostByFriendlyUrlEffect({
        friendlyUrl: props.query.title
      });

      const profileState = props.store.getState().profileModel;
      if (!profileState.tenant || !profileState.tenant._id) {
        await props.store.dispatch.landingPageModel.getLandingPageDataEffect({
          tenantId: "default"
        });
      } else {
        await props.store.dispatch.landingPageModel.getLandingPageDataEffect({
          tenantId: `${profileState.tenant._id}`
        });
      }
    } else {
      props.store.dispatch.blogPageModel.getPostByFriendlyUrlSuccess({data: props.query.postDetail});
      props.store.dispatch.landingPageModel.getLandingPageDataSuccess({data: props.query.landingPage});
    }
  }

  componentDidMount() {
    this.props.getRecentPostsEffect();
  }

  createMarkup = () => {
    return { __html: this.props.data[0].content };
  };

  createMarkupFooter = (data: string) => {
    return { __html: data };
  }

  render() {
    const renderRecentPost = this.props.recentPosts.map((value, index) => (
      <Link
        key={index}
        prefetch
        href={`/posts/${value.friendlyUrl}`}
      >
        <a>
          <p className="break-word">{value.title}</p>
          <hr style={{border: "0.5px solid #262626"}} />
        </a>
      </Link>
    ));

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
      <div>
        <Layout className="layout">
          <LandingPageBlackHeader
            menuBar={this.props.landingPageState.data.menuBar}
            logo={this.props.landingPageState.data.logo}
            isLandingPage={false}
            openLoginModal={this.props.openLoginModal}
            openRegisterModal={this.props.openRegisterModal}
          />

          <Row className="all-content">
            <div className="container">
              {this.props.data[0] && (
                <Col
                  lg={3}
                  md={4}
                  xs={6}
                  sm={6}
                  className="blog-date"
                  style={{ textAlign: "center" }}
                >
                  <span className="date-day">
                    {new Date(this.props.data[0].createdAt).getDate() < 10
                      ? "0" +
                        new Date(this.props.data[0].createdAt).getDate()
                      : new Date(this.props.data[0].createdAt).getDate()}
                  </span>
                  <span className="date-month">
                    {
                      monthNames[
                        new Date(this.props.data[0].createdAt).getMonth()
                      ]
                    }{" "}
                    {new Date(this.props.data[0].createdAt).getFullYear()}
                  </span>
                </Col>
              )}

              {this.props.data[0] && (
                <Col lg={12} md={20} xs={18} sm={18}>
                {this.props.data[0].imageSrc !== 'none' ? 
                  <img src={this.props.data[0].imageSrc} width="100%" /> :
                  <img src='/static/images/blog/image-default.jpg' width="100%" />
                }
                  <h1 className="blog-title break-word">
                    {this.props.data[0].title}
                  </h1>
                  <h2 className="blog-subtitle break-word">
                    {this.props.data[0].subtitle}
                  </h2>
                  <div
                    className="break-word blog-content"
                    style={{ width: "100%" }}
                    dangerouslySetInnerHTML={this.createMarkup()}
                  />
                </Col>
              )}

              <Col lg={9} md={24} xs={24} sm={24} className="recent-post">
                <h3>{this.props.languageState.BLOG_DETAIL_PAGE_RECENT_POST.translated}</h3>
                {renderRecentPost}
              </Col>
            </div>
          </Row>
          <Row className='footer'>
            <div className='container'>
              <div className='footer-all-content'>
                <Col md={6}>
                <div className='raleway-font' style={{fontFamily: 'Raleway'}}>
                  <h4 style={{ textAlign: 'left' }}><span style={{ fontSize: '24px' }}><span style={{ color: '#999999' }}>{this.props.languageState.BLOG_DETAIL_PAGE_GETTING_STARTED.translated}</span></span></h4><p></p>
                  <p style={{ textAlign: 'left',  cursor: 'pointer' }} onClick={() => this.props.openLoginModal()}><span style={{ color: '#ffffff' }}>{this.props.languageState.BLOG_DETAIL_PAGE_LOGIN.translated}</span></p>
                  <p onClick={() => this.props.openRegisterModal()}><span style={{ color: '#ffffff', cursor: 'pointer' }}>{this.props.languageState.BLOG_DETAIL_PAGE_SIGNUP.translated}</span></p>
                  </div>
                  <div className='footer-content' dangerouslySetInnerHTML={this.createMarkupFooter(this.props.landingPageState.data.footerContent1)} />
                </Col>
                <Col md={6}>
                <div className='raleway-font' style={{fontFamily: 'Raleway'}}>
                  <h4 style={{ textAlign: 'left' }}><span style={{ fontSize: '24px' }}><span style={{ color: '#999999' }}>{this.props.languageState.BLOG_DETAIL_PAGE_SUPPORT.translated}</span></span></h4><p></p>
                  <p style={{ textAlign: 'left',  cursor: 'pointer' }} onClick={() => this.props.openResetPasswordModal()}><span style={{ color: '#ffffff' }}>{this.props.languageState.BLOG_DETAIL_PAGE_FORGET_PASSWORD.translated}</span></p>
                  </div>
                  <div className='footer-content' dangerouslySetInnerHTML={this.createMarkupFooter(this.props.landingPageState.data.footerContent2)} />
                </Col>
                <Col md={6}>
                <div className='raleway-font' style={{fontFamily: 'Raleway'}}>
                  <h4 style={{ textAlign: 'left' }}><span style={{ fontSize: '24px' }}><span style={{ color: '#999999' }}>{this.props.languageState.BLOG_DETAIL_PAGE_SOCIAL.translated}</span></span></h4><p></p>
                  </div>
                  <div className='footer-content' dangerouslySetInnerHTML={this.createMarkupFooter(this.props.landingPageState.data.footerContent3)} />
                </Col>
                <Col md={6}>
                  <div className='footer-content' dangerouslySetInnerHTML={this.createMarkupFooter(this.props.landingPageState.data.footerContent4)} />
                </Col>
              </div>
            </div>
          </Row>
        </Layout>

        <Modal
          title={this.props.languageState.BLOG_DETAIL_PAGE_LOGIN.translated}
          visible={this.props.loginModalVisible}
          onOk={this.props.closeLoginModal}
          onCancel={() => {
            this.props.closeLoginModal();
          }}
          width={450}
          footer={null}
          destroyOnClose={true}
        >
          <LoginForm
            loginPageState={this.props.loginPageState}
            loginPageReducers={this.props.loginPageReducers}
            openRegisterModal={this.props.openRegisterModal}
            openResetPasswordModal={this.props.openResetPasswordModal}
          />
        </Modal>

        <Modal
          title={this.props.languageState.BLOG_DETAIL_PAGE_SIGNUP.translated}
          visible={this.props.registerModalVisible}
          onOk={this.props.closeRegisterModal}
          onCancel={() => {
            this.props.closeRegisterModal();
          }}
          width={450}
          footer={null}
          destroyOnClose={true}
        >
          <RegisterForm
            signUpPageReducers={this.props.signUpPageReducers}
            signUpPageState={this.props.signUpPageState}
            openRegisterSuccessModal={this.props.openRegisterSuccessModal}
            closeRegisterModal={this.props.closeRegisterModal}
            openLoginModal={this.props.openLoginModal}
            loginPageReducers={this.props.loginPageReducers}
          />
        </Modal>

        <Modal
          title={this.props.languageState.BLOG_DETAIL_PAGE_RESET_PASSWORD.translated}
          visible={this.props.resetPasswordModalVisible}
          onCancel={() => {
            this.props.closeResetPasswordModal();
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
          title={this.props.languageState.BLOG_DETAIL_PAGE_REGISTRATION_SUCCESS.translated}
          visible={this.props.registerSuccessModalVisible}
          footer={null}
          onCancel={this.props.closeLoginSuccessModal}
        >
          <p>
            {this.props.languageState.BLOG_DETAIL_PAGE_REGISTRATION_SUCCESS_TEXT.translated}
          </p>
        </Modal>
      </div>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.blogPageModel,
    loginPageState: rootState.loginPageModel,
    signUpPageState: rootState.signUpPageModel,
    profileState: rootState.profileModel,
    landingPageState: rootState.landingPageModel,
    resetPasswordPageState: rootState.resetPasswordPageModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.blogPageModel,
    profileReducers: rootReducer.profileModel,
    landingPageReducers: rootReducer.landingPageModel,
    resetPasswordPageReducers: rootReducer.resetPasswordPageModel,
    loginPageReducers: rootReducer.loginPageModel,
    signUpPageReducers: rootReducer.signUpPageModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(BlogDetail);
