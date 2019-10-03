import * as React from 'react';
import { Layout, Row, Col, Button } from 'antd';
import './Header.css';
import Link from 'next/link';

class UserNotLoggedInHeader extends React.Component<any, any> {
  render() {
    return (
      <Layout.Header
        style={{
          background: '#ffff',
          boxShadow: '7px 0px 11px 1px rgba(0, 0, 0, 0.2)',
          zIndex: 1,
          padding: 0
        }}
      >
        <Row style={{height: '100%'}}>
          <Col xs={12}>
            <Link href="/">
              <div style={{ height: '60px', padding: '11px 0' }}>
                <img
                  src='/static/images/skyace-no-cloud.png'
                  style={{
                    width: 'auto',
                    height: '42px',
                    display: 'block',
                    marginLeft: '25px',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </Link>
          </Col>
          <Col xs={12} style={{float: 'right', height: '100%'}}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%', paddingRight: '30px' }}>
              <Button
                style={{
                  width: '80px',
                  height: '35px',
                  marginRight: '10px',
                }}
                onClick={this.props.openLoginModal}
              >
                {this.props.languageState.USER_NOT_LOGGED_HEADER_BUTTON_LOGIN_TEXT.translated}
              </Button>
              <Button
                style={{
                  width: '80px',
                  height: '35px',
                  marginLeft: '10px',
                }}
                onClick={this.props.openRegisterModal}
              >
                {this.props.languageState.USER_NOT_LOGGED_HEADER_BUTTON_SIGN_UP_TEXT.translated}
              </Button>
            </div>
          </Col>
        </Row>
      </Layout.Header>
    );
  }
}

export default UserNotLoggedInHeader;