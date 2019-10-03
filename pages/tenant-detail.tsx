import { Row, Col, Layout, Button, Icon, Input, message } from 'antd';
import React from 'react';
import './white-label-admin/update-tenant-info.css';
import AppLayout from '../layout/AdminLayout';
import initStore from '../rematch/store';
import withRematch from '../rematch/withRematch';
// import Cookies from 'js-cookie';
import Profile from '../components/update-tenant-info-page/Profile';
import OtherConfig from '../components/update-tenant-info-page/OtherConfig';
import ContactInformation from '../components/update-tenant-info-page/ContactInformation';
// import BankTransfer from '../../components/update-tenant-info-page/BankTransfer';
// import Account from '../components/update-tenant-info-page/Account';
import { getTenantsService, getCurrencyService, getUsersService } from '../service-proxies';

class TenantDetail extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    const currencyService = getCurrencyService();
    const tenantService = getTenantsService();
    const currencies = await currencyService.getAllCurrencies();
    if (!props.req) {
      var tenantInfo = await tenantService.findTenantDetail(props.query.tenantId);
      props.store.dispatch.tenantsPageModel.fetchTenantInfoSuccess(tenantInfo);
    } else {
      props.store.dispatch.tenantsPageModel.fetchTenantInfoSuccess(props.query.tenantInfo);
    }

    return {
      currencies: currencies.results
    }
  }

  updateFields = async (input: any) => {
    await getTenantsService().updateFields(input as any)
  }

  deactiveAccount = async (userId: string) => {
    const usersService = getUsersService();
    await usersService.deactivate(userId);
  }

  updateCommission = async () => {
    try {
      await getTenantsService().updateFields({
        _id: this.props.tenantInfo._id,
        paymentInfo: this.props.tenantInfo.paymentInfo
      });
      message.success('Update successfully!', 4);
    } catch (err) {
      message.error(err.message || 'Internal server error', 4);
    }
  }

  render() {
    const { Content } = Layout;
    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <Content>
          <Row style={{ width: '100%', padding: '20px', background: '#ffffff' }}>
            <Col xs={24}>
              <a style={{ marginRight: '15px' }} href={`/api/users/export-users?_id=` + this.props.tenantInfo._id}>
                <Button type="primary">
                  <Icon type="export" />Export Users
                </Button>
              </a>

              <a style={{ margin: '0px 15px' }} href={`/api/tuitions/export-tuitions?_id=` + this.props.tenantInfo._id}>
                <Button type="primary">
                  <Icon type="export" />Export Tuitions
                </Button>
              </a>


              <a style={{ margin: '0px 15px' }} href={`/api/transaction/export-transactions?_id=` + this.props.tenantInfo._id}>
                <Button type="primary">
                  <Icon type="export" />Export Transactions
                </Button>
              </a>
            </Col>
            <Col xs={24} style={{ marginTop: '15px' }}>
              <Profile
                updateProfile={this.props.updateProfile}
                changeTenantInput={this.props.changeTenantInput}
                onSelectionChange={this.props.onSelectionChange}
                tenantInfo={this.props.tenantInfo}
                profileState={this.props.profileState}
                profileReducers={this.props.profileReducers}
                updateFields={this.updateFields}
                checkDomain={this.props.checkDomain}
                domainExist={this.props.domainExist}
                checkDomainSuccess={this.props.checkDomainSuccess}
                deactiveAccount={this.deactiveAccount}
                isSysAdmin={true}
                oldDomain={this.props.oldDomain}
                languageState={this.props.languageState}
              />
              <hr />
              <ContactInformation
                updateContract={this.props.updateContract}
                tenantInfo={this.props.tenantInfo}
                changeTenantInput={this.props.changeTenantInput}
                languageState={this.props.languageState}
              />
              <hr />
              <Row>
                <Col span={12}>
                  <OtherConfig
                    updateConfiguration={this.props.updateConfiguration}
                    onSelectionChange={this.props.onSelectionChange}
                    tenantInfo={this.props.tenantInfo}
                    currencies={this.props.currencies}
                    changeTenantInput={this.props.changeTenantInput}
                    languageState={this.props.languageState}
                  />
                </Col>
                <Col span={12}>
                  <Layout style={{ background: '#ffffff' }}>
                    <Row className='margin-bottom-large' style={{ padding: '20px 10px 0px 10px' }}>
                      <Content style={{ fontSize: 18, fontWeight: 'bold' }}>
                        Monthly Payment
                      </Content>
                    </Row>
                    <Row gutter={10}>
                      <Col span={12} style={{ padding: '10px' }}>
                        <Row>
                          <Content className='margin-bottom-small'>Day In Month</Content>
                          <div>
                            <Input
                              placeholder='Please enter day in month for payment ( Between 1 and 28 )'
                              type='number'
                              value={this.props.tenantInfo.paymentInfo ? this.props.tenantInfo.paymentInfo.dayInMonth: undefined}
                              style={{ width: '100%' }}
                              onChange={(e) => {
                                Number(e.target.value) > 0 && Number(e.target.value) < 29 ?
                                this.props.changeTenantInput({
                                  paymentInfo: {
                                    dayInMonth: e.target.value,
                                  }
                                }) : null }}>
                            </Input>
                          </div>
                        </Row>
                      </Col>
                      <Col span={12} style={{ padding: '10px' }}>
                        <Row>
                          <Content className='margin-bottom-small'>Fixed Amount</Content>
                            <div>
                            <Input
                              placeholder='Please enter fixed amount every month'
                              type='number'
                              value={this.props.tenantInfo.paymentInfo ? this.props.tenantInfo.paymentInfo.fixedAmount: undefined}
                              style={{ width: '100%' }}
                              onChange={(e) => {
                                Number(e.target.value) > 0 && Number(e.target.value) < 99999 ?
                                this.props.changeTenantInput({ paymentInfo: { fixedAmount: e.target.value }}) : null
                              }}
                              addonAfter='SGD'
                            >
                            </Input>
                          </div>
                        </Row>
                      </Col>
                      {this.props.disableInput ? <div></div> :
                        <Col span={24}>
                          <Row style={{ marginLeft: '5px' }}>
                            <Button
                              type="primary"
                              onClick={this.updateCommission}
                            >
                              Save</Button>
                          </Row>
                        </Col>
                      }
                    </Row>
                  </Layout>
                </Col>
              </Row>
              <hr />
            </Col>
          </Row>
        </Content>
      </AppLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.tenantsPageModel,
    profileState: rootState.profileModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.tenantsPageModel,
    profileReducers: rootReducer.profileModel
  };
};

export default withRematch(initStore, mapState, mapDispatch)(TenantDetail);
