import * as React from "react";
import { Col, Input, Layout, Row, Button } from "antd";
const { Content } = Layout;
const InputGroup = Input.Group;

class Paypal extends React.Component<any, any> {

  update = () => {
    if (this.props.tenantInfo.paypal) {
      this.props.updatePaypal({
        _id: this.props.tenantInfo._id,
        paypalID: this.props.tenantInfo.paypal.paypalID,
      })
    } else return;
  }
  render() {
    return (
      <Layout style={{ background: '#ffffff' }}>
        <Col style={{ padding: 10 }}>
          <Content style={{ fontSize: 18, fontWeight: 'bold' }}>PayPal</Content>
        </Col>
        
        <Content>
          <InputGroup style={{ marginBottom: 16 }}>
            <Row gutter={24} style={{padding: '10px'}}>
              <Col span={16}>
                <Content className='margin-bottom-small'>PayPal ID</Content>
                <Input
                  placeholder="E.g: yourname@email.com"
                  value={this.props.tenantInfo.paypal ? this.props.tenantInfo.paypal.paypalID : ""}
                  onChange={event =>
                    this.props.changeTenantInput({
                      paypal: {
                        paypalID: (event.target as any).value
                      }
                    })
                  }
                />
              </Col>
              {/* <Col span={8}>
                <Content className='margin-bottom-small'>Password</Content>
                <Input
                  placeholder="Password"
                  defaultValue="password"
                  type="password"
                  disabled
                  // value={this.props.tenantInfo.paypal ? this.props.tenantInfo.paypal.currencyCode : ""}
                />
              </Col> */}
              <Col span={24}>
                <Row style={{paddingTop: '10px'}}>
                  <Button
                    type="primary"
                    onClick={this.update}
                  >
                    Save
                  </Button>
                </Row>
              </Col>
            </Row>
          </InputGroup>
        </Content>
      </Layout>
    );
  }
}

export default Paypal;
