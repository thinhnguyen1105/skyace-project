import { Row, Col, Layout, Input } from 'antd';
import React from 'react';
import './update-tenant-info.css';
import AppLayout from '../../layout/AdminLayout';
import initStore from '../../rematch/store';
import withRematch from '../../rematch/withRematch';
// import Cookies from 'js-cookie';
import Profile from '../../components/update-tenant-info-page/Profile';
import OtherConfig from '../../components/update-tenant-info-page/OtherConfig';
import ContactInformation from '../../components/update-tenant-info-page/ContactInformation';
// import BankTransfer from '../../components/update-tenant-info-page/BankTransfer';
import Paypal from '../../components/update-tenant-info-page/Paypal';
// import Account from '../../components/update-tenant-info-page/Account';
import { getTenantsService, getUsersService, getCurrencyService } from '../../service-proxies';

class UpdateTenantInfo extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    const usersService = getUsersService();
    const currencyService = getCurrencyService();
    const tenantService = getTenantsService();
    const currencies = await currencyService.getAllCurrencies();
    var tenantInfo = await tenantService.findTenantDetail(props.store.getState().profileModel.tenant._id);
    // Auto populate country, timezone and primary currency.
    if (!tenantInfo.otherConfigs || tenantInfo.otherConfigs && !tenantInfo.otherConfigs.primaryCurrency || !tenantInfo.contactInformation || tenantInfo.contactInformation && !tenantInfo.contactInformation.country || tenantInfo.otherConfigs && !tenantInfo.otherConfigs.timeZone) {
      const ip: any = await usersService.getIP();
      const geolocation: any = await usersService.getUserGeolocation(ip.ip);
      let filterCurrency = currencies.results.filter((val) => val.code.toUpperCase() === geolocation.currency.code.toUpperCase());
      let updatedData = {
        _id: tenantInfo._id,
        otherConfigs: {

        },
        contactInformation: {

        }
      } as any;

      let updateCurrency = tenantInfo.otherConfigs && tenantInfo.otherConfigs.primaryCurrency ? tenantInfo.otherConfigs.primaryCurrency : (filterCurrency.length ? filterCurrency[0]._id : "");
      if (updateCurrency) {
        updatedData.otherConfigs.primaryCurrency = updateCurrency;
      }

      let country = tenantInfo.contactInformation ? tenantInfo.contactInformation.country ? tenantInfo.contactInformation.country : geolocation.country_name : geolocation.country_name;
      if (country) {
        updatedData.contactInformation.country = country;
      }

      let toGMTString = (d: number) => {
        d = Number(d);
        if (d === 0) return '';
        let h = d > 0 ? Math.floor(d) : Math.floor(d) + 1;
        let m = d - Math.floor(d);

        let hDisplay = (h >= 10 || h <= -10) ? h.toString() : ('0' + h);
        let mDisplay = m > 10 ? m.toString() : ('0' + m);
        return (d > 0 ? "+" : "-") + hDisplay + ':' + mDisplay;
      }

      let timeZone = tenantInfo.otherConfigs ? tenantInfo.otherConfigs.timeZone ? tenantInfo.otherConfigs.timeZone : (geolocation.time_zone ? {
        name: geolocation.time_zone.name,
        offset: geolocation.time_zone.offset,
        gmt: `(GMT${toGMTString(geolocation.time_zone.offset)})`
      } : null) : (geolocation.time_zone ? {
        name: geolocation.time_zone.name,
        offset: geolocation.time_zone.offset,
        gmt: `(GMT${toGMTString(geolocation.time_zone.offset)})`
      } : null);
      if (timeZone) {
        updatedData.otherConfigs.timeZone = timeZone;
      }

      await tenantService.updateFields(updatedData as any)
      tenantInfo = { ...tenantInfo, ...updatedData, "otherConfigs.primaryCurrency": filterCurrency.length ? filterCurrency[0] : {} };
    }

    props.store.dispatch.tenantsPageModel.fetchTenantInfoSuccess(tenantInfo);

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

  render() {
    const { Content } = Layout;
    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <Content>
          <Row style={{ width: '100%', padding: '20px', background: '#ffffff' }}>
            <Row className='margin-bottom-large' style={{ padding: '0px 10px 0px 10px' }}>
              <Content style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20, marginTop: 10 }}>
                {this.props.languageState.WHITE_LABEL_PARTNER_INFO_PAGE_TITLE.translated}
              </Content>
              <hr/>
            </Row>
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
              {/* <Col span={12}> */}
                {/* <Account
                  updateAdminInfo={this.props.updateAdminInfo}
                  changeTenantInput={this.props.changeTenantInput}
                  tenantInfo={this.props.tenantInfo}
                /> */}
              {/* </Col> */}
              <Col span={12} style={{paddingTop: '20px'}}>
                <Paypal
                  updatePaypal={this.props.updatePaypal}
                  tenantInfo={this.props.tenantInfo}
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
                              placeholder='No data'
                              type='number'
                              value={this.props.tenantInfo.paymentInfo ? this.props.tenantInfo.paymentInfo.dayInMonth: undefined}
                              style={{ width: '100%' }}
                              disabled
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
                              placeholder='No data'
                              type='number'
                              value={this.props.tenantInfo.paymentInfo ? this.props.tenantInfo.paymentInfo.fixedAmount: undefined}
                              style={{ width: '100%' }}
                              disabled
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
                    </Row>
                  </Layout>
                </Col>
            </Row>
            {/* <hr /> */}
            {/* <BankTransfer
              paymentMethod={this.props.paymentMethod}
              changePaymentMethod={this.props.changePaymentMethod}
              updateBankTransfer={this.props.updateBankTransfer}
              tenantInfo={this.props.tenantInfo}
              changeTenantInput={this.props.changeTenantInput}
            /> */}
            {/* <Row>
              
            </Row> */}
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

export default withRematch(initStore, mapState, mapDispatch)(UpdateTenantInfo);
