import * as React from 'react';
import { Row, Col, Button, Icon } from 'antd';
import Link from 'next/link';
import '../pages/landingpage-style.css';
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';
import * as Scroll from 'react-scroll';
import LandingPageHeader from './LandingPageHeader';
import LandingPageBlackHeader from './LandingPageBlackHeader';

const Element = Scroll.Element;
class LandingPagePreview extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      headerBlack: false,
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  index = React.createRef();

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event) => {
    let scrollTop = event.target.documentElement.scrollTop;
    if (scrollTop > 1000 && !this.state.headerBlack) {
      this.setState({ headerBlack: true });
    } else if (scrollTop < 1000) {
      this.setState({ headerBlack: false });
    }
  }

  render() {
    const blogPostRender = (
      this.props.blogData.map((value, index) => (
        <div className="container" key={index}>
          {value.imageSrc !== 'none' ?
            <Col md={7} offset={1} >
              <div
                className='blog-item'
                style={{
                  height: '250px',
                  backgroundImage: `url(${value.imageSrc})`,
                  backgroundSize: 'cover'
                }}
              />
              <Link
                
                href={`/posts/${value.friendlyUrl}`}
              >
                <a>
                  <h3 className="break-word" style={{ fontFamily: 'Raleway', minHeight: '80px' }}>
                    {value.title}
                  </h3>
                </a>
              </Link>
              {value.subtitle.length > 200 ? <p style={{ fontFamily: 'Raleway', minHeight: '40px' }} className='break-word'>{value.subtitle.slice(0, 200)}...</p> : <p style={{ fontFamily: 'Raleway', minHeight: '40px' }} className='break-word'>{value.subtitle}</p>}
              <Link
                
                href={`/posts/${value.friendlyUrl}`}
              >
                <a>
                  <h3 className='read-more' style={{ fontFamily: 'Raleway', fontWeight: 800, marginTop: '0px' }}>READ MORE</h3>
                </a>
              </Link>
            </Col> : <Col md={7} offset={1} >
              <div
                className='blog-item'
                style={{
                  height: '250px',
                  backgroundImage: `url(/static/images/blog/image-default.jpg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <Link
                
                href={`/posts/${value.friendlyUrl}`}
              >
                <a>
                  <h3 className="break-word" style={{ fontFamily: 'Raleway', minHeight: '80px' }}>
                    {value.title}
                  </h3>
                </a>
              </Link>
              {value.subtitle.length > 200 ? <p style={{ fontFamily: 'Raleway', minHeight: '40px' }} className='break-word'>{value.subtitle.slice(0, 200)}...</p> : <p style={{ fontFamily: 'Raleway', minHeight: '40px' }} className='break-word'>{value.subtitle}</p>}
              <Link
                
                href={`/posts/${value.friendlyUrl}`}
              >
                <a>
                  <h3 className='read-more' style={{ fontFamily: 'Raleway', fontWeight: 800, marginTop: '0px' }}>READ MORE</h3>
                </a>
              </Link>
            </Col>}
        </div>
      ))
    );

    const renderPage3 = (
      this.props.landingPageState.data.pages[0].contents.map((value, index) => (
        <Col lg={7} md={7} sm={24} xs={24} key={index}>
          <Fade bottom>
            {this.props.landingPageState.imageTemporary3.length === 0 ?
              <img className='page-image' src={this.props.landingPageState.data.pages[0].icons[index]} /> :
              <img className='page-image' src={this.props.landingPageState.imageTemporary3[index]} />
            }
            <div style={{ marginTop: '20px', fontFamily: 'Raleway' }} dangerouslySetInnerHTML={createMarkup(value)} />
          </Fade>
        </Col>
      ))
    );

    const renderPage4 = (
      this.props.landingPageState.data.pages[1].contents.map((value, index) => (
        <Col lg={7} md={7} sm={24} xs={24} key={index}>
          <Fade bottom>
            {this.props.landingPageState.imageTemporary4.length === 0 ?
              <img className='page-image' src={this.props.landingPageState.data.pages[1].icons[index]} /> :
              <img className='page-image' src={this.props.landingPageState.imageTemporary4[index]} />
            }
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
    //           {index % 2 === 1
    //             ? <div style={{ fontFamily: 'Raleway' }} className='border-description' dangerouslySetInnerHTML={createMarkup(value.course)} />
    //             : <span></span>}
    //         </Col>
    //       </div>
    //     )
    //   })
    // )
    return (
      <div>
        {this.props.landingPageState.topBannerBackgroundTemporary ?
          <div className='home-page' style={{ backgroundImage: `url(${this.props.landingPageState.topBannerBackgroundTemporary})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }}>
            <Row style={{ zIndex: 10 }}>
              {!this.state.headerBlack ?
                <LandingPageHeader
                  menuBar={this.props.landingPageState.data.menuBar}
                  logo={this.props.landingPageState.logoTemporary ? this.props.landingPageState.logoTemporary : this.props.landingPageState.data.logo}
                  isLandingPage={true}
                />
                : <LandingPageBlackHeader
                  menuBar={this.props.landingPageState.data.menuBar}
                  logo={this.props.landingPageState.logoTemporary ? this.props.landingPageState.logoTemporary : this.props.landingPageState.data.logo}
                  isLandingPage={true}
                />
              }
            </Row>
            <Button style={{ float: 'left', zIndex: 1000, background: 'transparent', marginLeft: '40px' }} onClick={() => this.props.handleTabsChange()}>
           <Icon type='arrow-left' style={{ color: '#fff' }}>Go Back</Icon></Button>
            <Fade left>
              <Row>
                <Col xs={24}>
                  <div className='intro'>
                    <div className='main-title' dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.mainTitle)} />
                  </div>
                </Col>
              </Row>
            </Fade>
          </div> :
          <div className='home-page' style={{ backgroundImage: `url(${this.props.landingPageState.data.topBannerBackground})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }}>
            <Row style={{ zIndex: 10 }}>
              {!this.state.headerBlack ?
                <LandingPageHeader
                  menuBar={this.props.landingPageState.data.menuBar}
                  logo={this.props.landingPageState.logoTemporary}
                  isLandingPage={true}
                />
                : <LandingPageBlackHeader
                  menuBar={this.props.landingPageState.data.menuBar}
                  logo={this.props.landingPageState.logoTemporary}
                  isLandingPage={true}
                />
              }
            </Row>
            <Button style={{ float: 'left', zIndex: 1000, background: 'transparent', marginLeft: '40px' }} onClick={() => this.props.handleTabsChange()}>
           <Icon type='arrow-left' style={{ color: '#fff' }}>Go Back</Icon></Button>
           <Fade left>
            <Row>
              <Col xs={24}>
                <div className='intro'>
                  <div className='main-title' dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.mainTitle)} />
                </div>
              </Col>
            </Row>
          </Fade>
          </div>
        }

        <Element name="about" className="element" >
          <Row id='about'>
            <div className='container'>
              <Col md={24} style={{ marginBottom: '100px' }}>
                <div style={{ marginBottom: '100px', paddingTop: '100px', fontFamily: 'Raleway' }} dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.mainTitlePage2)} />
                <Zoom>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <div className='subtitle-2' dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.subTitlePage2)} />
                  </Col>
                </Zoom>
                <Zoom>
                <Col lg={12} md={12} sm={24} xs={24} className='popular-courses-2'>
                  <div style={{fontFamily: 'Raleway, sans-serif'}}>
                  <div dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.informationCourses)}/>
                  </div>
                  </Col>
                  {/* {renderPopularTutionCourses} */}
                </Zoom>
              </Col>
            </div>
          </Row>
        </Element>

        <Row>
          {
            this.props.landingPageState.promoPhoto1Temporary ?
              <div className='title' style={{ backgroundImage: `url(${this.props.landingPageState.promoPhoto1Temporary})` }}>
                <div dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.promoTitle1)} />
              </div> : <div className='title' style={{ backgroundImage: `url(${this.props.landingPageState.data.promoPhoto1})` }}>
                <div dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.promoTitle1)} />
              </div>
          }
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
        {
          this.props.landingPageState.promoPhoto2Temporary ?
            <Row className='promo-2' style={{ backgroundImage: `url(${this.props.landingPageState.promoPhoto2Temporary})` }}>

              <div className='container'>
                <Col className='promo-2-content' lg={14} md={16}>
                  <div style={{ fontFamily: 'Raleway' }} dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.promoTitle2)} />
                </Col>
              </div>
            </Row> :
            <Row className='promo-2' style={{ backgroundImage: `url(${this.props.landingPageState.data.promoPhoto2})` }}>
              <div className='container'>
                <Col className='promo-2-content' lg={14} md={16}>
                  <div style={{ fontFamily: 'Raleway' }} dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.promoTitle2)} />
                </Col>
              </div>
            </Row>
        }

        <Row className='promo-3'>
          <div className='promo-3-content'>
            <Fade bottom>
              <div style={{ fontFamily: 'Raleway' }} dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.studentTitle)} />
              <p className='text-center promo-3-button'>
                <a className='sign-up-button'>SIGN UP</a>
              </p>
            </Fade>
          </div>
          <div className="vid-overlay" />
          <video id="video0" preload="auto" autoPlay={true} loop={true} muted={true}>
            <source src={this.props.landingPageState.data.studentVideoUrl} type="video/mp4" />
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

        {
          this.props.landingPageState.promoPhoto3Temporary ?
            <Row className='promo-4' style={{ backgroundImage: `url(${this.props.landingPageState.promoPhoto3Temporary})` }}>
              <div className='container' style={{ width: '100%' }}>
                <Col md={10}></Col>
                <Col className='promo-4-content container' md={14}>
                  <div style={{ fontFamily: 'Raleway' }} dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.promoTitle3)} />
                </Col>
              </div>
            </Row> :
            <Row className='promo-4' style={{ backgroundImage: `url(${this.props.landingPageState.data.promoPhoto3})` }}>
              <div className='container' style={{ width: '100%' }}>
                <Col md={10}></Col>
                <Col className='promo-4-content container' md={14}>
                  <div style={{ fontFamily: 'Raleway' }} dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.promoTitle3)} />
                </Col>
              </div>
            </Row>
        }

        <Row className='promo-5' style={{ width: '100%' }}>
          <div className='promo-5-content container'>
            <Fade bottom>
              <div style={{ fontFamily: 'Raleway' }} dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.tutorTitle)} />
              <p className='text-center promo-3-button'>
                <a className='sign-up-button'>SIGN UP</a>
              </p>
            </Fade>
          </div>
          <div className="vid-overlay" />
          <video id="video0" preload="auto" autoPlay={true} loop={true} muted={true}>
            <source src={this.props.landingPageState.data.tutorVideoUrl} type="video/mp4" />
          </video>
        </Row>

        <Row id='blog'>
          <Element name="blog" className="element" >
            <div className='container'>
              <div style={{ fontFamily: 'Raleway', marginBottom: '70px' }} dangerouslySetInnerHTML={createMarkup(this.props.landingPageState.data.blogTitle)} />
            </div>

            {blogPostRender}

            <Col md={24}>
              <p className='text-center blog-see-more'>
                <Link href={'/blog/list'}>
                  <a className='see-more-button'>SEE MORE</a>
                </Link>
              </p>
            </Col>
          </Element>
        </Row>

        <Row className='footer'>
          <div className='container'>
            <div className='footer-all-content'>
              <Col md={6}>
                <div className='raleway-font' style={{ fontFamily: 'Raleway' }}>
                  <h4 style={{ textAlign: 'left' }}><span style={{ fontSize: '24px' }}><span style={{ color: '#999999' }}>Getting Started</span></span></h4><p></p>
                  <p style={{ textAlign: 'left', cursor: 'pointer' }} ><span style={{ color: '#ffffff' }}>Login</span></p>
                  <p><span style={{ color: '#ffffff', cursor: 'pointer' }}>Sign Up</span></p>
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
      </div>
    );
  }
}

function createMarkup(data: string) {
  return { __html: data };
}

export default LandingPagePreview;