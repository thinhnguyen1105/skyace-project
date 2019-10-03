import { Layout, Button, Row, Col, Checkbox, Spin } from 'antd';
import React from 'react';
import './configuration.css';
import AppLayout from '../../layout/AdminLayout';
import withRematch from '../../rematch/withRematch';
import initStore from '../../rematch/store';

const Content = Layout.Content;

class Notifications extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    if (!props.req) {
      const profileState = props.store.getState().profileModel;
      await props.store.dispatch.notificationSettingsPageModel.getSettingByTenantId({tenantId: profileState.tenant._id});
    } else {
      props.store.dispatch.notificationSettingsPageModel.getSettingByTenantIdSuccess({settingData: props.query.notificationSetting});
    }
  }

  render() {
    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <Spin spinning={this.props.isBusy} tip='Saving ...'>
          <Layout style={{padding: '0px 30px', background: 'white'}}>
            <Row>
              <Content style={{ fontWeight: "bold", fontSize: 20, margin: '30px 0px 20px 0px' }}>
                {this.props.languageState.WHITE_LABEL_NOTIFICATION_PAGE_SETTING.translated}
              </Content>
              <hr />
            </Row>
            
            <Row gutter={{md: 30, xs: 20}} className='notifications__table-content-container'>
              <Col md={24} className='notifications__table-row'>
                <Col md={16} className='full-height' />
                <Col md={4} className='notifications__table-column'>
                  <h4><b>Email</b></h4>
                </Col>
                <Col md={4} className='notifications__table-column'>
                  <h4><b>SMS</b></h4>
                </Col>
              </Col>

              <Col md={24} className='notifications__table-row'>
                <Col md={16} className='full-height'>
                  <h4>{this.props.languageState.WHITE_LABEL_NOTIFICATION_PAGE_ACCOUNT_CREATION.translated}</h4>
                </Col>
                <Col md={4} className='notifications__table-column'>
                  <div>
                    <Checkbox
                      checked={this.props.settingData.accountRegistration ? this.props.settingData.accountRegistration.email : false}
                      onChange={(e: any) => this.props.handleSettingDataChange({
                        accountRegistration: {
                          ...this.props.settingData.accountRegistration,
                          email: e.target.checked
                        }
                      })}
                    />
                  </div>
                </Col>
                <Col md={4} className='notifications__table-column'>
                  <div>
                    <Checkbox
                      checked={this.props.settingData.accountRegistration.sms}
                      onChange={(e: any) => this.props.handleSettingDataChange({
                        accountRegistration: {
                          ...this.props.settingData.accountRegistration,
                          sms: e.target.checked
                        }
                      })}
                    />
                  </div>
                </Col>
              </Col>

              <Col md={24} className='notifications__table-row'>
                <Col md={16} className='full-height'>
                  <h4>{this.props.languageState.WHITE_LABEL_NOTIFICATION_PAGE_NEW_BOOKING.translated}</h4>
                </Col>
                <Col md={4} className='notifications__table-column'>
                  <div>
                    <Checkbox
                      checked={this.props.settingData.newBooking.email}
                      onChange={(e: any) => this.props.handleSettingDataChange({
                        newBooking: {
                          ...this.props.settingData.newBooking,
                          email: e.target.checked
                        }
                      })}
                    />
                  </div>
                </Col>
                <Col md={4} className='notifications__table-column'>
                  <div>
                    <Checkbox
                      checked={this.props.settingData.newBooking.sms}
                      onChange={(e: any) => this.props.handleSettingDataChange({
                        newBooking: {
                          ...this.props.settingData.newBooking,
                          sms: e.target.checked
                        }
                      })}
                    />
                  </div>
                </Col>
              </Col>

              <Col md={24} className='notifications__table-row'>
                <Col md={16} className='full-height'>
                  <h4>{this.props.languageState.WHITE_LABEL_NOTIFICATION_PAGE_TUITION_CANCELED.translated}</h4>
                </Col>
                <Col md={4} className='notifications__table-column'>
                  <div>
                    <Checkbox
                      checked={this.props.settingData.cancelTuition.email}
                      onChange={(e: any) => this.props.handleSettingDataChange({
                        cancelTuition: {
                          ...this.props.settingData.cancelTuition,
                          email: e.target.checked
                        }
                      })}
                    />
                  </div>
                </Col>
                <Col md={4} className='notifications__table-column'>
                  <div>
                    <Checkbox
                      checked={this.props.settingData.cancelTuition.sms}
                      onChange={(e: any) => this.props.handleSettingDataChange({
                        cancelTuition: {
                          ...this.props.settingData.cancelTuition,
                          sms: e.target.checked
                        }
                      })}
                    />
                  </div>
                </Col>
              </Col>

              <Col md={24} className='notifications__table-row'>
                <Col md={16} className='full-height'>
                  <h4>{this.props.languageState.WHITE_LABEL_NOTIFICATION_PAGE_RESCHEDULE.translated}</h4>
                </Col>
                <Col md={4} className='notifications__table-column'>
                  <div>
                    <Checkbox
                      checked={this.props.settingData.reschedule.email}
                      onChange={(e: any) => this.props.handleSettingDataChange({
                        reschedule: {
                          ...this.props.settingData.reschedule,
                          email: e.target.checked
                        }
                      })}
                    />
                  </div>
                </Col>
                <Col md={4} className='notifications__table-column'>
                  <div>
                    <Checkbox
                      checked={this.props.settingData.reschedule.sms}
                      onChange={(e: any) => this.props.handleSettingDataChange({
                        reschedule: {
                          ...this.props.settingData.reschedule,
                          sms: e.target.checked
                        }
                      })}
                    />
                  </div>
                </Col>
              </Col>
              <Col span={24} className='notifications__table-row' style={{padding: '12px', justifyContent: 'flex-end'}}>
                <Button
                  type='primary'
                  style={{minWidth: '120px', textAlign: 'center'}}
                  onClick={(_event) => this.props.saveSettingData({settingData: this.props.settingData})}
                >
                  {this.props.languageState.WHITE_LABEL_NOTIFICATION_PAGE_SAVE.translated}
                </Button>
              </Col>
            </Row>
          </Layout>
        </Spin>
      </AppLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.notificationSettingsPageModel,
    profileState: rootState.profileModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.notificationSettingsPageModel,
    profileReducers: rootReducer.profileModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(Notifications);