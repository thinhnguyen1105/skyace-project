import * as React from 'react';
import { Layout, Menu } from 'antd';
import Link from 'next/link';
import './Header.css';
import * as Scroll from 'react-scroll';
import config from '../api/config/default.config';

let ScrollLink = Scroll.Link;
class LandingPageBlackHeader extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false
    };
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  handleMenuClick() {
    this.setState({ toggle: !this.state.toggle });
  }

  render() {
    const renderBigMenu = (
      Object.keys(this.props.menuBar).map((value, _index) => {
        if (this.props.menuBar[value].hyperlink === '' && this.props.menuBar[value].name === '') {
          return 0
        } else if (this.props.menuBar[value].hyperlink.substring(0, 1) === "#" && this.props.isLandingPage) {
          return (
            <Menu.Item key={value}>
              <ScrollLink activeClass="active" className="" to={this.props.menuBar[value].hyperlink.substring(1, this.props.menuBar[value].hyperlink.length)} spy={true} smooth={true} duration={1000}>
                <span className='menu-item' style={{ color: '#fff' }}>
                  {this.props.menuBar[value].name}
                </span>
              </ScrollLink>
            </Menu.Item>
          );
        } else if (this.props.menuBar[value].hyperlink.substring(0, 1) === '#' && this.props.isLandingPage === false) {
          return (
            <Menu.Item key={value}>
              <Link href={`${config.nextjs.hostUrl}/${this.props.menuBar[value].hyperlink}`}>
                <a className='menu-item' style={{ color: '#ffffff' }}>{this.props.menuBar[value].name}</a>
              </Link>
            </Menu.Item>
          );
        } else {
          return (
            <Menu.Item key={value}>
              <Link href={this.props.menuBar[value].hyperlink}>
                <a className='menu-item' href={this.props.menuBar[value].hyperlink} style={{ color: '#ffffff' }}>{this.props.menuBar[value].name}</a>
              </Link>
            </Menu.Item>
          );
        }
      })
    );

    var renderSmallMenu = Object.values(this.props.menuBar).filter((value) => { return (value as any).name && (value as any).hyperlink}).map(
      (value, index) => {
        if (
          value.hyperlink.substring(0, 1) === "#" &&
          this.props.isLandingPage
        ) {
          return (
            <ScrollLink
              activeClass="active"
              className=""
              to={value.hyperlink.substring(
                1,
                value.hyperlink.length
              )}
              spy={true}
              smooth={true}
              duration={1000}
              onClick={this.handleMenuClick}
              key={index}
            >
              <li>{value.name}</li>
              <hr />
            </ScrollLink>
          );
        } else if (
          value.hyperlink.substring(0, 1) === "#" &&
          !this.props.isLandingPage
        ) {
          return (
            <div key={index}>
              <a
                href={`${config.nextjs.hostUrl}/${
                  value.hyperlink
                  }`}
                onClick={this.handleMenuClick}
              >
                <li>{value.name}</li>
              </a>
              <hr />
            </div>
          );
        } else if (
          value.hyperlink.substring(0, 1) !== "#" &&
          !this.props.isLandingPage
        ) {
          return (
            <div key={index}>
              <a
                href={`${config.nextjs.hostUrl}/${
                  value.hyperlink
                  }`}
                target="_blank"
              >
                <li>{value.name}</li>
              </a>
              <hr />
            </div>
          );
        } else {
          return (
            <div key={index}>
              <a href={value.hyperlink} target="_blank">
                <li>{value.name}</li>
              </a>
              <hr />
            </div>
          );
        }
      }
    );
    const { Header } = Layout;
    return (
      <Header
        className='header custom-animated-header black-header'
        id="custom-black-header"
        style={{
          backgroundColor: '#1a1a1a',
          position: 'fixed',
          width: '100%',
          zIndex: 10,
          transition: "all 0.5s ease-in-out",
          top: this.props.isLandingPage ? '-200px' : '0px'
        }}
      >
        <div>
          <div className='logo' style={{ float: 'left' }}>
            <Link href='/'>
              <a>
                <img
                  src={this.props.logo}
                  style={{
                    height: '42px',
                    width: 'auto',
                  }}
                />
              </a>
            </Link>
          </div>

          <div style={{
            float: 'right',
            textAlign: 'right',
            height: '64px',
          }}>
            <Menu
              id='full-menu'
              theme='light'
              mode='horizontal'
              className="header-menu__prevent-zoom-bug"
              style={{
                height: '64px',
                lineHeight: '52px',
                display: 'inline-block',
                backgroundColor: '#1a1a1a',
                borderBottom: 'none',
                fontSize: '16px',
                fontWeight: 1000,
              }}
            >
              {renderBigMenu}
              <Menu.Item key='/auth/login'>
                <a className="menu-item" style={{ color: "#ffffff", fontSize: '11px', fontWeight: 600 }} onClick={this.props.openLoginModal}>
                  LOG IN
                  </a>
              </Menu.Item>

              <Menu.Item key='/auth/signup'>
                <a className="menu-item" style={{ color: "#ffffff", fontSize: '11px', fontWeight: 600 }} onClick={this.props.openRegisterModal}>
                  SIGN UP
                  </a>
              </Menu.Item>
            </Menu>
          </div>
        </div>
        <nav role="navigation">
          <div id="menuToggle">
            <input onChange={this.handleMenuClick} type="checkbox" {...this.state.toggle ? { checked: true, } : {}} />
            <span></span>
            <span></span>
            <span></span>
            <ul id="menu">
              {renderSmallMenu}
              <div key='/auth/login'>
                <a onClick={this.props.openLoginModal}>
                  <li>LOG IN</li>
                </a>
                <hr />
              </div>
              <div key='/auth/signup'>
                <a onClick={this.props.openRegisterModal}>
                  <li>SIGN UP</li>
                </a>
                <hr />
              </div>
            </ul>
          </div>
        </nav>
      </Header>
    );
  }
}

export default LandingPageBlackHeader;
