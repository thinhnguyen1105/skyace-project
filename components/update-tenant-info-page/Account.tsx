import * as React from 'react';
import { Layout, Input, Row, Button, Col } from 'antd';
const { Content } = Layout;

class Account extends React.Component<any, any> {
  update = () => {
    if (this.props.tenantInfo.administrationInfomation) {
      this.props.updateAdminInfo({
        _id: this.props.tenantInfo._id,
        adminName: this.props.tenantInfo.administrationInfomation.adminName,
        adminEmail: this.props.tenantInfo.administrationInfomation.adminEmail,
      })
    } else return;
  }

  render() {
    return (
      <Layout style={{ background: '#ffffff' }}>
        <Row className='margin-bottom-large' style={{ padding: '20px 10px 0px 10px' }}>
          <Content style={{ fontWeight: "bold", fontSize: 18 }}>
            {this.props.languageState.UPDATE_TENANT_ACCOUNT_ADMIN_INFO.translated}
          </Content>
        </Row>
        <Row>
          <Col style={{ padding: 10 }}>
            <Row className='margin-bottom-small'>
              <Col span={11}>
                <Content className='margin-bottom-small'>{this.props.languageState.UPDATE_TENANT_ACCOUNT_ADMIN_NAME.translated}</Content>
                <Input
                  disabled={this.props.disableInput}
                  value={this.props.tenantInfo.administrationInfomation ? this.props.tenantInfo.administrationInfomation.adminName : ""}
                  placeholder="Skyace admin"
                  onChange={
                    (event) => this.props.changeTenantInput({ administrationInfomation: { adminName: (event.target as any).value } })
                  } />
              </Col>
              <Col span={1}></Col>
              <Col span={11}>
                <Content className='margin-bottom-small'>{this.props.languageState.UPDATE_TENANT_ACCOUNT_ADMIN_EMAIL.translated}</Content>
                <Input
                  disabled={this.props.disableInput}
                  value={this.props.tenantInfo.administrationInfomation ? this.props.tenantInfo.administrationInfomation.adminEmail : ""}
                  placeholder="skyace@gmail.com"
                  onChange={
                    (event) => this.props.changeTenantInput({ administrationInfomation: { adminEmail: (event.target as any).value } })}
                />
              </Col>
            </Row>
            <Row>
              {this.props.disableInput ? <div></div> :
                <Button
                  type="primary"
                  onClick={this.update}
                >
                  {this.props.languageState.UPDATE_TENANT_ACCOUNT_SAVE.translated}</Button>
              }
            </Row>
          </Col>
        </Row>
      </Layout>
    );
  }
}

export default Account;
