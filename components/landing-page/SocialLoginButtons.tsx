import * as React from 'react';
import { Row, Button, Col } from 'antd';

class SocialLoginButtons extends React.Component<any, any> {
  render() {
    return (
      <Row className="login-with" gutter={24}>
        <Col span={24}>
          <a
            className="icon"
            style={{
              display: "inline-block",
              fontSize: "28px",
              width: "100%"
            }}
          >
            <Button
              onClick={this.props.loginWithFacebook}
              type="primary"
              icon="facebook"
              style={{
                width: "100%",
                backgroundColor: "#3b5998",
                borderColor: "#3b5998",
                height: "40px"
              }}
            >
              {this.props.titleFacebook}
            </Button>
          </a>
        </Col>
        <Col span={24}>
          <a
            className="icon"
            style={{
              display: "inline-block",
              color: "red",
              fontSize: "28px",
              width: "100%"
            }}
          >
            <Button
              onClick={this.props.loginWithGoole}
              type="primary"
              icon="google"
              style={{
                width: "100%",
                backgroundColor: "#d62d20",
                borderColor: "#d62d20",
                padding: "4px",
                height: "40px"
              }}
            >
              {this.props.titleGoogle}
            </Button>
          </a>
        </Col>
      </Row>
    );
  }
}

export default SocialLoginButtons