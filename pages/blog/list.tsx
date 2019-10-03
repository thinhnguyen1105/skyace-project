import * as React from 'react';
import { Row, Col, Layout, Modal, Pagination } from 'antd';
import '../blog-detail.css';
import '../landingpage-style.css';
import Link from 'next/link';
import initStore from "../../rematch/store";
import withRematch from "../../rematch/withRematch";
import LandingPageBlackHeader from "../../components/LandingPageBlackHeader";
import LoginForm from "../../components/landing-page/LoginForm";
import RegisterForm from "../../components/landing-page/RegisterForm";
import ResetPasswordForm from "../../components/landing-page/ResetPasswordForm";
class BlogList extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    const blogPageState = props.store.getState().blogPageModel;
    await props.store.dispatch.blogPageModel.getActivePostEffect({
      search: blogPageState.search,
      pageNumber: blogPageState.pageNumber,
      pageSize: blogPageState.pageSize,
      sortBy: 'createdAt',
      asc: false
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
  }

  componentDidMount() {
    this.props.blogReducer.getRecentPostsEffect();
  }

  handlePageSize = (page, pageSize) => {
    this.props.blogReducer.getActivePostEffect({
      search: this.props.blogState.search,
      pageNumber: page,
      pageSize: pageSize,
      sortBy: this.props.blogState.sortBy,
      asc: this.props.blogState.asc
    });
    this.props.blogReducer.handlePaginationChange({ current: page, pageSize: pageSize });
  }

  createMarkup = (data: string) => {
    return { __html: data };
  }
  render() {
    const renderRecentPost = this.props.blogState.recentPosts.map((value, index) => (
      <Link
        key={index}
        prefetch
        href={`/posts/${value.friendlyUrl}`}
      >
        <a>
          <p className="break-word">{value.title}</p>
          <hr style={{ border: "0.5px solid #262626" }} />
        </a>
      </Link>
    ));
    const monthNames = [this.props.languageState.BLOG_LIST_PAGE_JAN.translated, 
      this.props.languageState.BLOG_LIST_PAGE_FEB.translated, 
      this.props.languageState.BLOG_LIST_PAGE_MAR.translated, 
      this.props.languageState.BLOG_LIST_PAGE_APR.translated, 
      this.props.languageState.BLOG_LIST_PAGE_MAY.translated, 
      this.props.languageState.BLOG_LIST_PAGE_JUN.translated, 
      this.props.languageState.BLOG_LIST_PAGE_JUL.translated, 
      this.props.languageState.BLOG_LIST_PAGE_AUG.translated, 
      this.props.languageState.BLOG_LIST_PAGE_SEP.translated, 
      this.props.languageState.BLOG_LIST_PAGE_OCT.translated, 
      this.props.languageState.BLOG_LIST_PAGE_NOV.translated, 
      this.props.languageState.BLOG_LIST_PAGE_DEC.translated];

    const renderBlogPost = (this.props.blogState.data.map((value, index) => {
      if (index === 0) {
        return (
          <Row className="all-content" key={index}>
            <div className="container">
              {(
                <Col
                  lg={3}
                  md={4}
                  xs={6}
                  sm={6}
                  className="blog-date"
                  style={{ textAlign: "center" }}
                >
                  <span className="date-day">
                    {new Date(value.postCreatedAt).getDate() < 10
                      ? "0" +
                      new Date(value.postCreatedAt).getDate()
                      : new Date(value.postCreatedAt).getDate()}
                  </span>
                  <span className="date-month">
                    {
                      monthNames[
                      new Date(value.postCreatedAt).getMonth()
                      ]
                    }{" "}
                    {new Date(value.postCreatedAt).getFullYear()}
                  </span>
                </Col>
              )}

              {(
                <Col lg={12} md={20} xs={18} sm={18}>
                  <Link href={`/posts/${value.friendlyUrl}`}>

                    {value.imageSrc !== 'none' ?
                      <img style={{ cursor: 'pointer' }} src={value.imageSrc} width="100%" /> :
                      <img style={{ cursor: 'pointer' }} src='/static/images/blog/image-default.jpg' width="100%" />
                    }
                  </Link>
                  <Link href={`/posts/${value.friendlyUrl}`}>
                    <h1 style={{ cursor: 'pointer' }} className="blog-title break-word">
                      {value.title}
                    </h1>
                  </Link>

                  <h2 className="blog-subtitle break-word">
                    {value.subtitle}
                  </h2>
                  <hr style={{ border: '0.5px solid #262626' }} />

                </Col>
              )}

              <Col lg={9} md={24} xs={24} sm={24} className="recent-post">
                <h3>{this.props.languageState.BLOG_LIST_PAGE_RECENT_POSTS.translated}</h3>
                {renderRecentPost}
              </Col>
            </div>
          </Row>
        )
      } else {
        return (
          <div key={index}>
            <Row className="all-content">
              <div className="container">
                {(
                  <Col
                    lg={3}
                    md={4}
                    xs={6}
                    sm={6}
                    className="blog-date"
                    style={{ textAlign: "center" }}
                  >
                    <span className="date-day">
                      {new Date(value.postCreatedAt).getDate() < 10
                        ? "0" +
                        new Date(value.postCreatedAt).getDate()
                        : new Date(value.postCreatedAt).getDate()}
                    </span>
                    <span className="date-month">
                      {
                        monthNames[
                        new Date(value.postCreatedAt).getMonth()
                        ]
                      }{" "}
                      {new Date(value.postCreatedAt).getFullYear()}
                    </span>
                  </Col>
                )}

                {(
                  <Col lg={12} md={20} xs={18} sm={18}>
                    <Link href={`/posts/${value.friendlyUrl}`}>
                      {value.imageSrc !== 'none' ?
                        <img style={{ cursor: 'pointer' }} src={value.imageSrc} width="100%" /> :
                        <img style={{ cursor: 'pointer' }} src='/static/images/blog/image-default.jpg' width="100%" />
                      }
                    </Link>
                    <Link href={`/posts/${value.friendlyUrl}`}>
                      <h1 style={{ cursor: 'pointer' }} className="blog-title break-word">
                        {value.title}
                      </h1>
                    </Link>
                    <h2 className="blog-subtitle break-word">
                      {value.subtitle}
                    </h2>
                    <hr style={{ border: '0.5px solid #262626' }} />
                  </Col>
                )}

                <Col lg={9} md={24} xs={24} sm={24} className="recent-post">
                </Col>
              </div>
            </Row>
          </div>
        )
      }
    }))
    return (
      <div>
        <Layout className='layout'>
          <LandingPageBlackHeader
            menuBar={this.props.landingPageState.data.menuBar}
            logo={this.props.landingPageState.data.logo}
            isLandingPage={false}
            openLoginModal={this.props.blogReducer.openLoginModal}
            openRegisterModal={this.props.blogReducer.openRegisterModal}
          />
          <Row>
            <div className='container'>
              <h1 className='text-center' style={{ paddingTop: '100px', fontSize: '40px', fontWeight: 800, fontFamily: 'Raleway', textTransform: 'uppercase' }}>{this.props.languageState.BLOG_LIST_PAGE_BLOG.translated}</h1>
              <hr style={{ width: '60px', opacity: 0.6 }} />
              <p className='break-word text-center' style={{ fontSize: '20px', fontFamily: 'Raleway', marginBottom: '100px' }}>
                {this.props.languageState.BLOG_LIST_PAGE_BLOG_HEADER.translated}
            </p>
            </div>
          </Row>
          {renderBlogPost}
          <div style={{ position: 'relative', left: '50%', margin: '30px 0px' }}>
            <Pagination total={this.props.blogState.total}
              onChange={(page, pageSize) => { this.handlePageSize(page, pageSize) }} />
          </div>
          <Row className='footer'>
            <div className='container'>
              <div className='footer-all-content'>
                <Col md={6}>
                <div className='raleway-font' style={{fontFamily: 'Raleway'}}>
                  <h4 style={{ textAlign: 'left' }}><span style={{ fontSize: '24px' }}><span style={{ color: '#999999' }}>{this.props.languageState.BLOG_LIST_PAGE_BLOG_GETTING_STARTED.translated}</span></span></h4><p></p>
                  <p style={{ textAlign: 'left',  cursor: 'pointer' }} onClick={() => this.props.blogReducer.openLoginModal()}><span style={{ color: '#ffffff' }}>{this.props.languageState.BLOG_LIST_PAGE_BLOG_LOGIN.translated}</span></p>
                  <p onClick={() => this.props.blogReducer.openRegisterModal()}><span style={{ color: '#ffffff', cursor: 'pointer' }}>{this.props.languageState.BLOG_LIST_PAGE_BLOG_SIGN_UP.translated}</span></p>
                  </div>
                  <div className='footer-content' dangerouslySetInnerHTML={this.createMarkup(this.props.landingPageState.data.footerContent1)} />
                </Col>
                <Col md={6}>
                <div className='raleway-font' style={{fontFamily: 'Raleway'}}>
                  <h4 style={{ textAlign: 'left' }}><span style={{ fontSize: '24px' }}><span style={{ color: '#999999' }}>{this.props.languageState.BLOG_LIST_PAGE_BLOG_SUPPORT.translated}</span></span></h4><p></p>
                  <p style={{ textAlign: 'left',  cursor: 'pointer' }} onClick={() => this.props.blogReducer.openResetPasswordModal()}><span style={{ color: '#ffffff' }}>{this.props.languageState.BLOG_LIST_PAGE_BLOG_FORGET_PASSWORD.translated}</span></p>
                  </div>
                  <div className='footer-content' dangerouslySetInnerHTML={this.createMarkup(this.props.landingPageState.data.footerContent2)} />
                </Col>
                <Col md={6}>
                <div className='raleway-font' style={{fontFamily: 'Raleway'}}>
                  <h4 style={{ textAlign: 'left' }}><span style={{ fontSize: '24px' }}><span style={{ color: '#999999' }}>{this.props.languageState.BLOG_LIST_PAGE_BLOG_SOCIAL.translated}</span></span></h4><p></p>
                  </div>
                  <div className='footer-content' dangerouslySetInnerHTML={this.createMarkup(this.props.landingPageState.data.footerContent3)} />
                </Col>
                <Col md={6}>
                  <div className='footer-content' dangerouslySetInnerHTML={this.createMarkup(this.props.landingPageState.data.footerContent4)} />
                </Col>
              </div>
            </div>
          </Row>
        </Layout>
        <Modal
          title={this.props.languageState.BLOG_LIST_PAGE_BLOG_LOGIN.translated}
          visible={this.props.blogState.loginModalVisible}
          onOk={this.props.blogReducer.closeLoginModal}
          onCancel={() => {
            this.props.blogReducer.closeLoginModal();
          }}
          width={450}
          footer={null}
          destroyOnClose={true}
        >
          <LoginForm
            loginPageState={this.props.loginPageState}
            loginPageReducers={this.props.loginPageReducers}
            openRegisterModal={this.props.blogReducer.openRegisterModal}
            openResetPasswordModal={this.props.blogState.openResetPasswordModal}
          />
        </Modal>

        <Modal
          title={this.props.languageState.BLOG_LIST_PAGE_BLOG_SIGN_UP.translated}
          visible={this.props.blogState.registerModalVisible}
          onOk={this.props.blogReducer.closeRegisterModal}
          onCancel={() => {
            this.props.blogReducer.closeRegisterModal();
          }}
          width={450}
          footer={null}
          destroyOnClose={true}
        >
          <RegisterForm
            signUpPageReducers={this.props.signUpPageReducers}
            signUpPageState={this.props.signUpPageState}
            openRegisterSuccessModal={this.props.blogReducer.openRegisterSuccessModal}
            closeRegisterModal={this.props.blogReducer.closeRegisterModal}
            openLoginModal={this.props.blogReducer.openLoginModal}
            loginPageReducers={this.props.loginPageReducers}
          />
        </Modal>

        <Modal
          title={this.props.languageState.BLOG_LIST_PAGE_RESET_PASSWORD.translated}
          visible={this.props.blogState.resetPasswordModalVisible}
          onCancel={() => {
            this.props.blogReducer.closeResetPasswordModal();
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
          title={this.props.languageState.BLOG_LIST_PAGE_REGISTRATION_SUCCESS.translated}
          visible={this.props.blogState.registerSuccessModalVisible}
          footer={null}
          onCancel={this.props.blogReducer.closeLoginSuccessModal}
        >
          <p>
          {this.props.languageState.BLOG_LIST_PAGE_REGISTER_SUCCESS_PAGE.translated}
          </p>
        </Modal>
      </div>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    blogState: rootState.blogPageModel,
    loginPageState: rootState.loginPageModel,
    signUpPageState: rootState.signUpPageModel,
    profileState: rootState.profileModel,
    landingPageState: rootState.landingPageModel,
    resetPasswordPageState: rootState.resetPasswordPageModel,
    tenantState: rootState.tenantsState,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    blogReducer: rootReducer.blogPageModel,
    profileReducers: rootReducer.profileModel,
    landingPageReducers: rootReducer.landingPageModel,
    resetPasswordPageReducers: rootReducer.resetPasswordPageModel,
    loginPageReducers: rootReducer.loginPageModel,
    signUpPageReducers: rootReducer.signUpPageModel,
    tenantReducer: rootReducer.tenantsReducer
  };
};

export default withRematch(initStore, mapState, mapDispatch)((BlogList));