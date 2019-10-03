import { Row, Col, Layout, Button, Icon, Form, Input, AutoComplete, Upload } from 'antd';
import React from 'react';
import './white-label-admin/update-tenant-info.css';
import AppLayout from '../layout/AdminLayout';
import initStore from '../rematch/store';
import withRematch from '../rematch/withRematch';
import { dataPhone } from '../data_common/CountryCodes';
import { dataCountry } from "../data_common/country";
import { getUsersService } from '../service-proxies';
import moment from 'moment';
import './white-label-admin/users.css';

const FormItem = Form.Item;

class DistributorDetail extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    const userService = getUsersService();
    if (!props.req) {
      var distributorInfo = await userService.findById(props.query.userId);
      props.store.dispatch.distributorDetailPageModel.fetchDataSuccess(distributorInfo);
    } else {
      props.store.dispatch.distributorDetailPageModel.fetchDataSuccess(props.query.distributorInfo);
    }
  }

  update = async () => {
    await this.props.form.validateFields(async (err, _values) => {
      if (!err) {
        await this.props.update(this.props.data);
      }
    })
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    const sortedDataPhone = dataPhone.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    const dataSourcePhoneID = sortedDataPhone.map((country) => {
      return {
        value: country.dial_code,
        text: country.name + ' ' + '(' + country.dial_code + ')'
      };
    });

    const sortedDataCountry = dataCountry.sort((a, b) => {
      if (a.countryName < b.countryName) {
        return -1;
      }
      if (a.countryName > b.countryName) {
        return 1;
      }
      return 0;
    });

    const phoneIdSelector = () => {
      return (
        <AutoComplete
          value={this.props.data.phone ? (this.props.data.phone.phoneID || "") : ""}
          dataSource={dataSourcePhoneID}
          placeholder="Country Code"
          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          onChange={value => this.props.onChangeData({
            phone: { phoneID: value }
          })}
          style={{ width: 200, height: 30 }}
        />
      );
    };

    const { getFieldDecorator } = this.props.form;
    const { Content } = Layout;
    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <div className="users-page">
          <Row>
            <Content style={{ fontWeight: "bold", fontSize: 20 }}>
              Distributors
          </Content>
          </Row>
          <Content>
            <Row style={{ width: '100%', padding: '20px', background: '#ffffff' }}>
              <Col xs={24} style={{ marginTop: '15px' }}>
                <Form>
                  <Row gutter={20} type="flex">
                    <Col xs={24}>
                      <h3>Company detail</h3>
                    </Col>
                    <Col span={12}>
                      <FormItem label="Company Name" style={{ marginBottom: '0px' }}>
                        {getFieldDecorator("companyName", {
                          rules: [
                            { required: true, message: "Please input company name" },
                          ],
                          validateTrigger: 'onBlur',
                          validateFirst: true,
                          initialValue: this.props.data.distributorInfo ? this.props.data.distributorInfo.companyName : ""
                        })(
                          <Input
                            onChange={event =>
                              this.props.onChangeData({
                                distributorInfo: {
                                  companyName: (event.target as any).value
                                }
                              })
                            }
                            type="text"
                            placeholder="Company name"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="Country Of Business" style={{ marginBottom: '0px' }}>
                        {getFieldDecorator("countryOfBusiness", {
                          rules: [
                            { required: true, message: "Please input country of business" },
                          ],
                          validateTrigger: 'onBlur',
                          validateFirst: true,
                          initialValue: this.props.data.distributorInfo ? this.props.data.distributorInfo.countryOfBusiness : ""
                        })(
                          <AutoComplete
                            placeholder="Country that business is registered in"
                            style={{ width: '100%' }}
                            dataSource={sortedDataCountry ? sortedDataCountry.map((item) => item.countryName) : []}
                            filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                            onChange={(value) => this.props.onChangeData({
                              distributorInfo: {
                                countryOfBusiness: value
                              }
                            })}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="Company Registration Number" style={{ marginBottom: '0px' }}>
                        {getFieldDecorator("companyRegNo", {
                          rules: [
                            { required: true, message: "Please input company registration number" },
                          ],
                          validateTrigger: 'onBlur',
                          validateFirst: true,
                          initialValue: this.props.data.distributorInfo ? this.props.data.distributorInfo.companyRegNo : ""
                        })(
                          <Input
                            onChange={event =>
                              this.props.onChangeData({
                                distributorInfo: {
                                  companyRegNo: (event.target as any).value
                                }
                              })
                            }
                            type="text"
                            placeholder="Company Registration No."
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col xs={12}>
                      <Form.Item label="Partnership Start Date">
                        <Row gutter={8}>
                          <Col xs={12}>
                            <Form.Item {...formItemLayout} label="From">
                              {this.props.form.getFieldDecorator('partnerShipStartDate', {
                                rules: [
                                  { required: true, message: 'Please fill in partnership start date' },
                                ],
                                validateTrigger: 'onBlur',
                                // initialValue: this.props.currentTenant.companyProfile ? moment(this.props.currentTenant.companyProfile.partnerShipStartDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                                initialValue: this.props.data.distributorInfo ? (this.props.data.distributorInfo.startDate ? moment(this.props.data.distributorInfo.startDate).format('YYYY-MM-DD') : "") : ""
                              })(
                                <Input
                                  type="date"
                                  min="1900-01-01"
                                  onChange={(e) => this.props.onChangeData({
                                    distributorInfo: {
                                      startDate: new Date(e.target.value)
                                    }
                                  })}
                                />
                              )}
                            </Form.Item>
                          </Col>
                          <Col xs={12}>
                            <Form.Item {...formItemLayout} label="To">
                              {this.props.form.getFieldDecorator('partnerShipEndDate', {
                                rules: [
                                  { required: true, message: 'Please fill in partnership end date' },
                                ],
                                validateTrigger: 'onBlur',
                                initialValue: this.props.data.distributorInfo ? (this.props.data.distributorInfo.endDate ? moment(this.props.data.distributorInfo.endDate).format('YYYY-MM-DD') : "") : ""
                                // initialValue: this.props.currentTenant.companyProfile && this.props.currentTenant.companyProfile.partnerShipEndDate ? moment(this.props.currentTenant.companyProfile.partnerShipEndDate).format('YYYY-MM-DD') : moment().add(1, 'year').format('YYYY-MM-DD'),
                              })(
                                <Input
                                  type="date"
                                  min="1900-01-01"
                                  onChange={(e) => this.props.onChangeData({
                                    distributorInfo: {
                                      endDate: new Date(e.target.value)
                                    }
                                  })}
                                />
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form.Item>
                    </Col>

                    {/* Contact person detail */}
                    <Col xs={24}>
                      <h3>Contact person detail</h3>
                    </Col>
                    <Col span={12}>
                      <FormItem label="Given Name" style={{ marginBottom: '0px' }}>
                        {getFieldDecorator("firstName", {
                          rules: [
                            { required: true, message: "Please input first name" },
                            { pattern: /^(.){2,20}$/, message: "Name must be between 2 and 20 characters" },
                          ],
                          validateTrigger: 'onBlur',
                          validateFirst: true,
                          initialValue: this.props.data.firstName
                        })(
                          <Input
                            onChange={event =>
                              this.props.onChangeData({
                                firstName: (event.target as any).value
                              })
                            }
                            type="text"
                            placeholder="Name as per national ID"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="Family Name" style={{ marginBottom: '0px' }}>
                        {getFieldDecorator("lastName", {
                          rules: [
                            { required: true, message: "Please input last name" },
                            { pattern: /^(.){2,20}$/, message: "Name must be between 2 and 20 characters" }
                          ],
                          validateTrigger: 'onBlur',
                          validateFirst: true,
                          initialValue: this.props.data.lastName
                        })(
                          <Input
                            onChange={event =>
                              this.props.onChangeData({
                                lastName: (event.target as any).value
                              })
                            }
                            type="text"
                            placeholder="Surname as per national ID"
                          />
                        )}
                      </FormItem>
                    </Col>

                    <Col span={12}>
                      <FormItem label="Email Address" style={{ marginBottom: '0px' }}>
                        {getFieldDecorator("email", {
                          initialValue: this.props.data.email
                        })(
                          <Input
                            disabled={true}
                            type="email"
                            placeholder="E.g distributor@email.com"
                          />
                        )}
                      </FormItem>
                    </Col>

                    <Col span={12}>
                      <FormItem label="Contact number" style={{ marginBottom: '0' }}>
                        {getFieldDecorator('phone', {
                          rules: [
                            { required: true, message: "Please input your phone number" },
                            { pattern: /^\d{4,15}$/, message: "Phone number must be from 4 - 15 digits" },
                            {
                              validator: (_rule, _value, callback) => {
                                console.log('props', this.props.data.phone);
                                if (!this.props.data.phone || !this.props.data.phone.phoneID) {
                                  callback("Please Select Your Country Code");
                                }
                                callback();
                              }
                            }
                          ],
                          validateTrigger: 'onBlur',
                          validateFirst: true,
                          initialValue: this.props.data.phone ? this.props.data.phone.phoneNumber : ""
                        })(
                          <Input
                            addonBefore={phoneIdSelector()}
                            style={{ width: '100%' }}
                            name='phoneNumber'
                            placeholder='Mobile Number'
                            onChange={(e) => this.props.onChangeData({
                              phone:
                                { phoneNumber: e.target.value }
                            })} />
                        )}
                      </FormItem>
                    </Col>

                    {/* Payment */}
                    <Col xs={24} style={{marginTop: '30px'}}>
                      <h3>Payment detail</h3>
                    </Col>
                    <Col span={12}>
                      <FormItem label="Day in month" style={{ marginBottom: '0px' }}>
                        {getFieldDecorator("dayInMonth", {
                          rules: [
                            {
                              validator: (_rule, _value, callback) => {
                                if (this.props.profileState && this.props.profileState.roles[0] === 'sysadmin') {
                                  if (_value < 1 || _value > 28) {
                                    callback("Day must be a number between 1 and 28");
                                  }
                                }
                                callback();
                              }
                            },
                          ],
                          validateTrigger: 'onBlur',
                          validateFirst: true,
                          initialValue: this.props.data.distributorInfo ? this.props.data.distributorInfo.dayInMonth : undefined
                        })(
                          <Input
                            onChange={event =>
                              this.props.onChangeData({
                                distributorInfo: {
                                  dayInMonth: (event.target as any).value
                                }
                              })
                            }
                            disabled={this.props.profileState ? this.props.profileState.roles[0] !== 'sysadmin' : true}
                            type="number"
                            placeholder="When the payment happens"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="Fixed Amount Per Month" style={{ marginBottom: '0px' }}>
                        {getFieldDecorator("fixedAmount", {
                          rules: [
                            {
                              validator: (_rule, _value, callback) => {
                                if (this.props.profileState && this.props.profileState.roles[0] === 'sysadmin') {
                                  if (_value < 1 || _value > 99999) {
                                    callback("Amount must be a number between 1 and 99999");
                                  }
                                }
                                callback();
                              }
                            },
                          ],
                          validateTrigger: 'onBlur',
                          validateFirst: true,
                          initialValue: this.props.data.distributorInfo ? this.props.data.distributorInfo.fixedAmount : undefined
                        })(
                          <Input
                            onChange={event =>
                              this.props.onChangeData({
                                distributorInfo: {
                                  fixedAmount: (event.target as any).value
                                }
                              })
                            }
                            type="number"
                            disabled={this.props.profileState ? this.props.profileState.roles[0] !== 'sysadmin' : true}
                            placeholder="Fixed amount every month"
                            addonAfter="SGD"
                          />
                        )}
                      </FormItem>
                    </Col>

                    <Col xs={24} style={{ textAlign: 'right', marginTop: '20px' }}>
                      <Button type="primary" onClick={this.update}>Save</Button>
                    </Col>
                    {/* <Col xs={12} style={{marginTop: '15px'}}>
                    <Col span={24}>
                      <span style={{color : 'rgba(0, 0, 0, 0.85)', fontSize: '14px'}}>Documents:</span>
                    </Col>
                    <Col span={24} style={{marginTop: '5px'}}>
                      <Upload.Dragger
                        beforeUpload={this.beforeUpload}
                        onRemove={this.onRemove}
                        fileList={this.state.fileList}
                      >
                        <p className="ant-upload-drag-icon">
                          <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                          Maximum 5 files; and should not exceed 10 MB each.
                        </p>
                      </Upload.Dragger>
                    </Col>
                  </Col> */}
                  </Row>
                </Form>
              </Col>
            </Row>
          </Content>
        </div>
      </AppLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.distributorDetailPageModel,
    profileState: rootState.profileModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.distributorDetailPageModel,
    profileReducers: rootReducer.profileModel
  };
};

export default withRematch(initStore, mapState, mapDispatch)(Form.create()(DistributorDetail));
