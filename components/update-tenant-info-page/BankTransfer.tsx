import * as React from "react";
import { Col, Input, Layout, Button, Row, Select } from "antd";
const { Content } = Layout;
const Option = Select.Option;

class BankTransfer extends React.Component<any, any> {
  update = () => {
    if (this.props.tenantInfo.bankTransfer) {
      this.props.updateBankTransfer({
        _id: this.props.tenantInfo._id,
        bankName: this.props.tenantInfo.bankTransfer.bankName,
        bankAccount: this.props.tenantInfo.bankTransfer.bankAccount,
        transferDescription: this.props.tenantInfo.bankTransfer.transferDescription
      })
    } 
    if (this.props.tenantInfo.paypal) {
      this.props.updatePaypal({
        _id: this.props.tenantInfo._id,
        paypalEmail: this.props.tenantInfo.paypal.paypalEmail,
        currencyCode: this.props.tenantInfo.paypal.currencyCode,
        signature: this.props.tenantInfo.paypal.signature,
        brandName: this.props.tenantInfo.paypal.brandName
      })
    }
  }
  render() {
    return (
      <Layout style={{ background: '#ffffff' }}>
        <Row className='margin-bottom-large' style={{ padding: '20px 10px 0px 10px' }}>
          <Content style={{ fontWeight: "bold", fontSize: 18 }}>
            Billing & Payment
          </Content>
        </Row>
        {this.props.tenantInfo.paymentMethod === 'bankTransfer'
          ? <Row>
            <Col span={12} style={{ padding: 10 }}>
              <Row className='margin-bottom-small'>
                <Content className='margin-bottom-small'>Preferred Payment Mode 1</Content>
                <Select
                  value={this.props.tenantInfo.paymentMethod}
                  onChange={(value) => this.props.changeTenantInput({ paymentMethod : value})}
                  style={{ width: '100%' }}>
                  <Option value='bankTransfer'>Bank Transfer</Option>
                  <Option value='payPal'>PayPal</Option>
                </Select>
              </Row>
              <Row className='margin-bottom-small'>
                <Content className='margin-bottom-small'>Bank Account Number (omit dashes)</Content>
                <Input
                  value={this.props.tenantInfo.bankTransfer ? this.props.tenantInfo.bankTransfer.bankAccount : ""}
                  placeholder="0702 1111 1111"
                  onChange={event =>
                    this.props.changeTenantInput({
                      bankTransfer: {
                        bankAccount: (event.target as any).value
                      }
                    })
                  }
                />
              </Row>
              <Row className='margin-bottom-small'>
                <Content className='margin-bottom-small'>Bank Transfer Remarks</Content>
                <Input>
                </Input>
              </Row>
              <Row style={{ paddingTop: "10px" }}>
                <Button
                  type="primary"
                  onClick={this.update}
                >
                  Save
                </Button>
              </Row>
            </Col>
            <Col span={12} style={{ padding: 10 }}>
              <Row className='margin-bottom-small'>
                <Content className='margin-bottom-small'>Bank Name</Content>
                <Input
                  value={this.props.tenantInfo.bankTransfer ? this.props.tenantInfo.bankTransfer.bankName : ""}
                  placeholder="zLunar Community Bank"
                  onChange={event =>
                    this.props.changeTenantInput({
                      bankTransfer: {
                        bankName: (event.target as any).value
                      }
                    })
                  }
                />
              </Row>
              <Row className='margin-bottom-small'>
                <Content className='margin-bottom-small'>Bank Account Holder Name</Content>
                <Input>
                </Input>
              </Row>

            </Col>
          </Row>
          : this.props.tenantInfo.paymentMethod === 'payPal' ?
            <Row>
              <Col span={12} style={{ padding: 10 }}>
                <Row className='margin-bottom-small'>
                  <Content className='margin-bottom-small'>Preferred Payment Mode 2</Content>
                  <Select
                    value={this.props.tenantInfo.paymentMethod}
                    onChange={(value) => this.props.changeTenantInput({ paymentMethod : value})}
                    style={{ width: '100%' }}>
                    <Option value='bankTransfer'>Bank Transfer</Option>
                    <Option value='payPal'>PayPal</Option>
                  </Select>
                </Row>
                <Row className='margin-bottom-small'>
                  <Content className='margin-bottom-small'>PayPal ID</Content>
                  <Input placeholder='E.g: yourname@email.com'></Input>
                </Row>
                <Row className='margin-bottom-small'>
                  <Content className='margin-bottom-small'>Password</Content>
                  <Input></Input>
                </Row>
              </Col>
            </Row>
            : 
            <Row>
              <Col span={12} style={{ padding: 10 }}>
                <Row className='margin-bottom-small'>
                  <Content className='margin-bottom-small'>Preferred Payment Mode</Content>
                  <Select
                    value={this.props.tenantInfo.paymentMethod}
                    onChange={(value) => this.props.changeTenantInput({ paymentMethod : value})}
                    style={{ width: '100%' }}>
                    <Option value='bankTransfer'>Bank Transfer</Option>
                    <Option value='payPal'>PayPal</Option>
                  </Select>
                </Row>
                <Button
                  type="primary"
                  onClick={this.update}
                >
                  Save
                </Button>
              </Col>
            </Row>
        }
      </Layout>
    );
  }
}

export default BankTransfer;
