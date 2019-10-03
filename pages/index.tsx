import * as React from 'react';
import withRematch from '../rematch/withRematch';
import initStore from '../rematch/store';
import { Row, Col, Modal, Icon } from 'antd';
import Link from 'next/link';
import './landingpage-style.css';
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';
import * as Scroll from 'react-scroll';
import LoginForm from '../components/landing-page/LoginForm';
import RegisterForm from '../components/landing-page/RegisterForm';
import LandingPageHeader from '../components/LandingPageHeader';
import LandingPageBlackHeader from '../components/LandingPageBlackHeader';
import ResetPasswordForm from '../components/landing-page/ResetPasswordForm';
import { Parallax } from 'react-parallax';
import * as moment from 'moment';

const Element = Scroll.Element;
let ScrollLink = Scroll.Link;
class Homepage extends React.Component<any, any> {
  index = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      headerBlack: false,
      isSafari: false
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  static async getInitialProps(props: any) {
    if (!props.req) {
      const blogPageState = props.store.getState().blogPageModel;
      await props.store.dispatch.blogPageModel.getActivePostEffect({
        search: blogPageState.search,
        pageNumber: blogPageState.pageNumber,
        pageSize: 3,
        sortBy: 'createdAt',
        asc: false
      });
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
      props.store.dispatch.blogPageModel.fetchDataSuccess({ result: props.query.blogs });
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

  componentDidMount() {
    var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf('CriOS') == -1 &&
      navigator.userAgent.indexOf('FxiOS') == -1;
    if (isSafari) {
      this.setState({
        isSafari: true
      })
    }
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event) => {
    let scrollTop = event.target.documentElement.scrollTop;
    if (scrollTop > 800 && !this.state.headerBlack) {
      (document as any).getElementById("custom-black-header").style.top = "0";
      // this.setState({ headerBlack: true });
    } else if (scrollTop < 800) {
      // this.setState({ headerBlack: false });
      (document as any).getElementById("custom-black-header").style.top = "-200px";
    }
  }

  render() {
    const lastModifiedAt = this.props.landingPageState.data.lastModifiedAt ? `?v=${moment(this.props.landingPageState.data.lastModifiedAt).format()}` : ''
    const blogPostRender = (
      this.props.blogState.data.map((value, index) => (
        <Col md={7} offset={1} key={index} style={{ marginBottom: '25px' }}>
          {value.imageSrc !== 'none' ?
            <div style={{ height: '100%', position: 'relative', paddingBottom: '25px' }}>
              <Link

                href={`/posts/${value.friendlyUrl}`}
              >
                <div
                  className='blog-item'
                  style={{
                    marginBottom: '15px',
                    // backgroundImage: `url(${value.imageSrc})`,
                    // backgroundSize: 'contain',
                    // backgroundPosition: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <img src={value.imageSrc} ></img>
                </div>
              </Link>
              <Link

                href={`/posts/${value.friendlyUrl}`}
              >
                <a>
                  <h3 className="break-word" style={{ fontFamily: 'Raleway', minHeight: '75px', margin: '0px' }}>
                    {value.title.length > 120 ? `${value.title.slice(0, 120)} ...` : value.title}
                  </h3>
                </a>
              </Link>
              {value.subtitle.length > 200 ? <p style={{ fontFamily: 'Raleway', minHeight: '30px' }} className='break-word'>{value.subtitle.slice(0, 200)}...</p> : <p style={{ fontFamily: 'Raleway', minHeight: '30px' }} className='break-word'>{value.subtitle}</p>}
              <Link

                href={`/posts/${value.friendlyUrl}`}
              >
                <a style={{ position: 'absolute', bottom: '0px', left: '0px' }}>
                  <h3 className='read-more' style={{ fontFamily: 'Raleway', fontWeight: 800, marginTop: '0px' }}>READ MORE</h3>
                </a>
              </Link>
            </div> :
            <div style={{ height: '100%', position: 'relative', paddingBottom: '25px' }}>
              <Link

                href={`/posts/${value.friendlyUrl}`}
              >
                <div
                  className='blog-item'
                  style={{
                    marginBottom: '15px',                    
                    // backgroundImage: `url(/static/images/blog/image-default.jpg)`,
                    // backgroundSize: 'contain',
                    // backgroundPosition: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <img src='/static/images/blog/image-default.jpg'></img>
                </div>
              </Link>
              <Link

                href={`/posts/${value.friendlyUrl}`}
              >
                <a>
                  <h3 className="break-word" style={{ fontFamily: 'Raleway', minHeight: '75px', margin: '0px' }}>
                    {value.title}
                  </h3>
                </a>
              </Link>
              {value.subtitle.length > 200 ? <p style={{ fontFamily: 'Raleway', minHeight: '30px' }} className='break-word'>{value.subtitle.slice(0, 200)}...</p> : <p style={{ fontFamily: 'Raleway', minHeight: '30px' }} className='break-word'>{value.subtitle}</p>}
              <Link

                href={`/posts/${value.friendlyUrl}`}
              >
                <a style={{ position: 'absolute', bottom: '0px', left: '0px' }}>
                  <h3 className='read-more' style={{ fontFamily: 'Raleway', fontWeight: 800, marginTop: '0px' }}>READ MORE</h3>
                </a>
              </Link>
            </div>
          }
        </Col>
      ))
    );

    const renderPage3 = (
      this.props.landingPageState.data.pages[0].contents.map((value, index) => (
        <Col lg={7} md={7} sm={24} xs={24} key={index}>
          <Fade bottom>
            <img className='page-image' src={`${this.props.landingPageState.data.pages[0].icons[index]}${lastModifiedAt}`} />
            <div style={{ marginTop: '20px', fontFamily: 'Raleway' }} dangerouslySetInnerHTML={createMarkup(value)} />
          </Fade>
        </Col>
      ))
    );

    const renderPage4 = (
      this.props.landingPageState.data.pages[1].contents.map((value, index) => (
        <Col lg={7} md={7} sm={24} xs={24} key={index}>
          <Fade bottom>
            <img className='page-image' src={`${this.props.landingPageState.data.pages[1].icons[index]}${lastModifiedAt}`} />
            <div style={{ marginTop: '20px', fontFamily: 'Raleway' }} dangerouslySetInnerHTML={createMarkup(value)} />
          </Fade>
        </Col>
      ))
    );

    // const renderPopularTutionCourses = (
    //   this.props.landingPageState.data.popularTutionCourses.map((value, index) => {
    //     return (
    //       <div key={String(index)}>
    //         <Col lg={6} md={12} sm={24} xs={24}>
    //           {index % 2 === 0
    //             ? <div style={{ fontFamily: 'Raleway' }} className='border-description' dangerouslySetInnerHTML={createMarkup(value.course)} />
    //             : <span></span>}
    //         </Col>
    //         <Col lg={6} md={12} sm={24} xs={24}>
    //         {index % 2 === 1
    //             ? <div style={{ fontFamily: 'Raleway' }} className='border-description' dangerouslySetInnerHTML={createMarkup(value.course)} />
    //             : <span></span>}
    //         </Col>
    //       </div>
    //     )
    //   })
    // )
    return (
      <div>
        <div className='home-page' style={{ backgroundImage: `url(${this.props.landingPageState.data.topBannerBackground}${lastModifiedAt})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }}>
          <Row style={{ zIndex: 10 }}>
            <LandingPageHeader
              openLoginModal={this.props.landingPageReducer.openLoginModal}
              openRegisterModal={this.props.landingPageReducer.openRegisterModal}
              menuBar={this.props.landingPageState.data.menuBar}
              logo={this.props.landingPageState.data.logo}
              isLandingPage={true}
            />
            <LandingPageBlackHeader
              openLoginModal={this.props.landingPageReducer.openLoginModal}
              openRegisterModal={this.props.landingPageReducer.openRegisterModal}
              menuBar={this.props.landingPageState.data.menuBar}
              logo={this.props.landingPageState.data.logo}
              isLandingPage={true}
            />
          </Row>
          <Fade left>
            <Row>
              <Col xs={24}>
                <div className='intro'>
                  <div className='main-title' dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.mainTitle)} />
                </div>
              </Col>
            </Row>
          </Fade>
          <Fade top>
            <p style={{ color: '#fff', fontSize: '18px', fontFamily: 'Raleway, san-serif', textAlign: 'center' }}>Check it out</p>
            <ScrollLink activeClass="active" className="" to="about" spy={true} smooth={true} duration={300}>
              <Icon type="down" className='check-it-out-button' />
            </ScrollLink>
          </Fade>
        </div>

        <Element name="about" className="element" >
          <Row id='about'>
            <div className='container'>
              <Col md={24} style={{ marginBottom: '-50px' }}>
                <div style={{ marginBottom: '100px', paddingTop: '100px', fontFamily: 'Raleway' }} dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.mainTitlePage2)} />
                <Zoom>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <div className='subtitle-2' dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.subTitlePage2)} />
                  </Col>
                </Zoom>
                <Zoom>
                  <Col lg={12} md={12} sm={24} xs={24} className='popular-courses-2'>
                    <div style={{ fontFamily: 'Raleway, sans-serif' }}>
                      <div dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.informationCourses)} />
                    </div>
                  </Col>
                  {/* {renderPopularTutionCourses} */}
                </Zoom>
              </Col>
            </div>
          </Row>
        </Element>

        <Row>
          {/* <div className='title' style={{ backgroundImage: `url(${this.props.landingPageState.data.promoPhoto1}${lastModifiedAt})` }}>
            <div dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.promoTitle1)} />
          </div> */}

          <Parallax
            blur={0}
            bgImage={`${this.props.landingPageState.data.promoPhoto1}${lastModifiedAt})`}
            bgImageAlt="Skyace"
            strength={200}
          >
            <div style={{ height: '320px' }}>
              <div className="custom-parallax-text" dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.promoTitle1)} />
            </div>
          </Parallax>

        </Row>

        <Row id='student'>
          <Element name="student" className="element" >
            <div className='container page-3-content'>
              <Col md={24}>
                <div className='page-4-title' dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.pages[0].mainTitle)} />
              </Col>
              {renderPage3}
            </div>
          </Element>
        </Row>

        <Row className='promo-2' style={{ backgroundImage: `url(${this.props.landingPageState.data.promoPhoto2}${lastModifiedAt})` }}>

          <div className='container'>
            <Col className='promo-2-content' lg={14} md={16} sm={24} xs={24}>
              <div style={{ fontFamily: 'Raleway' }} dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.promoTitle2)} />
            </Col>
          </div>
        </Row>

        <Row className='promo-3'>
          <div className='promo-3-content'>
            <Fade bottom>
              <div style={{ fontFamily: 'Raleway' }} dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.studentTitle)} />
              <p className='text-center promo-3-button'>
                <a onClick={this.props.landingPageReducer.openRegisterModal} className='sign-up-button'>SIGN UP</a>
              </p>
            </Fade>
          </div>
          <div className="vid-overlay" />
          <video id="video0" preload="auto" autoPlay={true} loop={true} muted={true} playsInline={true} playsinline={true}>
            <source src={`${this.props.landingPageState.data.studentVideoUrl}${lastModifiedAt}`} type="video/mp4" />
            <source src={`${this.props.landingPageState.data.studentVideoOggUrl}${lastModifiedAt}`} type="video/ogg" />
            <source src={`${this.props.landingPageState.data.studentVideoWebmUrl}${lastModifiedAt}`} type="video/webm" />
          </video>
        </Row>

        <Row style={{ background: '#262626' }} id='tutor'>
          <Element name="tutor" className="element" >
            <div className='container page-4-content'>
              <Col md={24}>
                <div className='page-4-title' dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.pages[1].mainTitle)} />
              </Col>
              {renderPage4}
            </div>
          </Element>
        </Row>

        <Row className='promo-4' style={{ backgroundImage: `url(${this.props.landingPageState.data.promoPhoto3}${lastModifiedAt})` }}>
          <div className='container' style={{ width: '100%' }}>
            <Col md={10}></Col>
            <Col className='promo-4-content container' md={14}>
              <div style={{ fontFamily: 'Raleway' }} dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.promoTitle3)} />
            </Col>
          </div>
        </Row>

        <Row className='promo-5' style={{ width: '100%' }}>
          <div className='promo-5-content container'>
            <Fade bottom>
              <div style={{ fontFamily: 'Raleway' }} dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.tutorTitle)} />
              <p className='text-center promo-3-button'>
                <a onClick={this.props.landingPageReducer.openRegisterModal} className='sign-up-button'>SIGN UP</a>
              </p>
            </Fade>
          </div>
          <div className="vid-overlay" />
          <video id="video1" preload="auto" autoPlay={true} loop={true} muted={true} playsInline={true}>
            <source src={`${this.props.landingPageState.data.tutorVideoUrl}${lastModifiedAt}`} type="video/mp4" />
            <source src={`${this.props.landingPageState.data.tutorVideoOggUrl}${lastModifiedAt}`} type="video/ogg" />
            <source src={`${this.props.landingPageState.data.tutorVideoWebmUrl}${lastModifiedAt}`} type="video/webm" />bgvideo
          </video>
        </Row>
        <Element name="blog" className="element" >
        </Element>
        <Row id='blog'>
          <div className='container'>
              <div style={{ fontFamily: 'Raleway', marginBottom: '70px' }} dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.blogTitle)} />
          </div>

          <div className='container' style={{ display: 'flex', flexWrap: 'wrap' }}>
            {blogPostRender}
          </div>

          <Col md={24}>
            <p className='text-center blog-see-more'>
              <Link href={'/blog/list'}>
                <a className='see-more-button'>SEE MORE</a>
              </Link>
            </p>
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
            languageState={this.props.languageState}
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
            languageState={this.props.languageState}
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
          <ResetPasswordForm resetPasswordPageReducers={this.props.resetPasswordPageReducers} resetPasswordPageState={this.props.resetPasswordPageState} languageState={this.props.languageState}/>
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

        <Modal
          closable={false}
          footer=""
          visible={this.state.isSafari}
          title=""
        >
          <div style={{ textAlign: 'center' }}>
            <p>This website is currently not supported on this browser.</p>
            <p>For better experience, please use <a href="https://www.google.com/chrome/">Google Chrome</a> or <a href="https://www.mozilla.org/en-US/firefox/">Firefox</a></p>
          </div>
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
    blogState: rootState.blogPageModel,
    landingPageState: rootState.landingPageModel,
    loginPageState: rootState.loginPageModel,
    signUpPageState: rootState.signUpPageModel,
    resetPasswordPageState: rootState.resetPasswordPageModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    profileReducers: rootReducer.profileModel,
    blogReducers: rootReducer.blogPageModel,
    landingPageReducer: rootReducer.landingPageModel,
    loginPageReducers: rootReducer.loginPageModel,
    signUpPageReducers: rootReducer.signUpPageModel,
    resetPasswordPageReducers: rootReducer.resetPasswordPageModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(Homepage);