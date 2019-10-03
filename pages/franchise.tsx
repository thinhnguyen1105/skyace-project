import * as React from 'react';
import { Button, Input, Col, Row, Icon, Table, Tooltip, Tag, AutoComplete, Layout, Popconfirm, Upload, Modal, Form, message } from 'antd';
import moment from 'moment';
import config from '../api/config';
import { dataPhone } from '../data_common/CountryCodes';
import AppLayout from '../layout/AdminLayout';
import initStore from '../rematch/store';
import withRematch from '../rematch/withRematch';
import { dataCountry } from "../data_common/country";
import './white-label-admin/users.css';
import Link from 'next/link';
import axios, { AxiosResponse } from 'axios';
import { getUsersService, getAuthService } from '../service-proxies';
import * as uuid from 'uuid';
const Content = Layout.Content;
const FormItem = Form.Item;

class UsersPage extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    if (!props.req) {
      const usersPageState = props.store.getState().usersPageModel;
      const usersService = getUsersService(props.store.getState().profileModel.token);
      const result = await usersService.findFranchises(
        usersPageState.search,
        usersPageState.filter,
        usersPageState.pageNumber,
        usersPageState.pageSize,
        usersPageState.sortBy,
        usersPageState.asc
      );

      props.store.dispatch.franchisePageModel.fetchDataSuccess({ result });
    } else {
      props.store.dispatch.franchisePageModel.fetchDataSuccess({ result: props.query.users });
    }
  }

  state = {
    fileList: [],
    password: ''
  }

  checkEmailExist = async (_rule, value, callback) => {
    const authService = getAuthService();
    const emailExisted = await authService.checkEmail(value);
    if (emailExisted) {
      callback(this.props.languageState.FRANCHISE_PAGE_MESSAGE_EMAIL.translated);
    }
    callback();
  }

  resetForm = () => {
    this.props.clearInput();
    this.props.form.resetFields();
  }

  submitCreateForm = async () => {
    await this.props.form.validateFields(async (err, _values) => {
      if (!err) {
        const password = Math.random().toString(36).slice(-8);
        this.setState({
          password
        })

        // Upload file
        const fileList = this.state.fileList as any;
        if (fileList.length) {
          const fileExtensionRegex = /(\.txt|\.xlsx|\.pdf|\.doc|\.docx|\.png|\.jpg|\.jpeg|\.ppt|\.pptx)$/;
          let allowedUpload = true;
          for (let item of fileList) {
            if (!fileExtensionRegex.test(item.name)) {
              allowedUpload = false;
              break;
            }
            else if (item.size > 10 * 1024 * 1024) {
              allowedUpload = false;
              break;
            }
          }

          if (!allowedUpload) {
            message.error(this.props.languageState.FRANCHISE_PAGE_MESSAGE_NOT_ALLOWED_UPLOAD.translated, 5);
          } else {
            const formData = new FormData();
            fileList.forEach((file) => {
              formData.append('materials', file);
            });

            try {
              const result: AxiosResponse = await axios({
                method: 'post',
                url: `${config.nextjs.apiUrl}/users/upload-file`,
                data: formData
              });
              await this.props.createNewFranchise({
                ...this.props.newFranchise,
                password: password,
                distributorInfo: {
                  ...this.props.newFranchise.distributorInfo,
                  fileLists: result.data
                }
              });
              this.resetForm();
            } catch (error) {
              console.log(error);
              message.error(error.message || this.props.languageState.FRANCHISE_PAGE_MESSAGE_INTERNAL_SERVER_ERROR.translated, 4);
            }
          }
        }
        else {
          await this.props.createNewFranchise({
            ...this.props.newFranchise,
            password: password
          });
          this.resetForm();
        }
      }
    });
  }

  beforeUpload = (file) => {
    this.setState(({ fileList }) => ({
      fileList: [...fileList, file],
    }));
    return false;
  }

  onRemove = (file) => {
    this.setState(({ fileList }) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList,
      };
    });
  }

  render() {
    const sortedDataCountry = dataCountry.sort((a, b) => {
      if (a.countryName < b.countryName) {
        return -1;
      }
      if (a.countryName > b.countryName) {
        return 1;
      }
      return 0;
    });

    const actionButtons = (record: any) => {
      return (
        <div className="action-buttons">
          <Link href={`/distributor-detail/${record._id}`}>
            <Tooltip title='View Distributor Information'>
              <Button
                type="primary"
                icon='solution'
                className="button"
                style={{ marginRight: '12px' }}
              />
            </Tooltip>
          </Link>
          <Link href={`/distributor-payment/${record._id}`}>
            <Tooltip title='View Distributor Payment'>
              <Button
                type="primary"
                icon='dollar'
                className="button"
                style={{ marginRight: '12px' }}
              />
            </Tooltip>
          </Link>
          <Tooltip title={record.isActive ? this.props.languageState.FRANCHISE_PAGE_TOOLTIP_DEACTIVE.translated : this.props.languageState.FRANCHISE_PAGE_TOOLTIP_ACTIVE.translated}>
            <Button
              type="primary"
              icon={this.props.currentUser.isActive ? 'lock' : 'unlock'}
              className="button"
              onClick={() => record.isActive ? this.props.deactivateUser({ userId: record._id }) : this.props.activateUser({ userId: record._id })}
              style={{ marginRight: '12px' }}
            />
          </Tooltip>
        </div>
      );
    };

    const activeTag = (isActive: boolean) => (
      <Tag color={isActive ? 'green' : 'red'}>
        {isActive ? this.props.languageState.FRANCHISE_PAGE_ACTIVE.translated : this.props.languageState.FRANCHISE_PAGE_IN_ACTIVE.translated}
      </Tag>
    );

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

    const columns = [
      {
        title: this.props.languageState.FRANCHISE_PAGE_TITLE_COUNTRY.translated,
        dataIndex: 'distributorInfo.countryOfBusiness',
        key: 'email',
        width: '10%',
        sorter: true,
      },
      {
        title: this.props.languageState.FRANCHISE_PAGE_TITLE_COMPANY_NAME.translated,
        dataIndex: 'distributorInfo.companyName',
        key: 'fullName',
        width: '10%',
        sorter: true,
      },
      {
        title: this.props.languageState.FRANCHISE_PAGE_TITLE_COMPANY_REGISTRATION_NO.translated,
        dataIndex: 'distributorInfo.companyRegNo',
        key: 'createdAt',
        width: '10%',
        sorter: true,
      },
      {
        title: this.props.languageState.FRANCHISE_PAGE_TITLE_COMPANY_START_DATE.translated,
        dataIndex: 'distributorInfo.startDate',
        key: 'createdAt',
        width: '10%',
        sorter: true,
        render: (value, _record, _index) => value ? moment(value).format('DD MMM YYYY') : ""
      },
      {
        title: this.props.languageState.FRANCHISE_PAGE_TITLE_COMPANY_END_DATE.translated,
        dataIndex: 'distributorInfo.endDate',
        key: 'createdAt',
        width: '10%',
        sorter: true,
        render: (value, _record, _index) => value ? moment(value).format('DD MMM YYYY') : ""
      },
      {
        title: this.props.languageState.FRANCHISE_PAGE_TITLE_COMPANY_STATUS.translated,
        dataIndex: 'isActive',
        key: 'isActive',
        width: '10%',
        sorter: true,
        render: (_value, record, _index) => activeTag(record.isActive),
      },
      {
        title: this.props.languageState.FRANCHISE_PAGE_TITLE_COMPANY_ACTION.translated,
        dataIndex: 'actions',
        key: 'actions',
        width: '10%',
        render: (_value, record, _index) => actionButtons(record),
      },
    ];

    const { getFieldDecorator } = this.props.form;

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

    const phoneIdSelector = () => {
      return (
        <AutoComplete
          value={this.props.newFranchise.phone ? (this.props.newFranchise.phone.phoneID || "") : ""}
          dataSource={dataSourcePhoneID}
          placeholder={this.props.languageState.FRANCHISE_PAGE_COUNTRY_CODE.translated}
          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          onChange={value => this.props.onChangeCreateData({
            phone: { phoneID: value }
          })}
          style={{ width: 200, height: 30 }}
        />
      );
    };

    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <div className="users-page">
          <Row>
            <Content style={{ fontWeight: "bold", fontSize: 20 }}>
              Distributors
          </Content>
          </Row>
          <div className="users-filter">
            <Row type="flex" gutter={24}>
              <Col lg={12} md={24} xs={24} style={{ display: 'flex', alignItems: 'center' }}>
                <div className="search" style={{ flex: 1 }}>
                  <Input.Search
                    className="search-input"
                    style={{ width: '100%' }}
                    autoComplete={uuid.v4()}
                    placeholder={this.props.languageState.FRANCHISE_PAGE_SEARCH_BY.translated}
                    value={this.props.search}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      this.props.searchChangeReducer({ searchValue: (e.target as any).value.toLowerCase() });
                      this.props.searchChangeEffect({ searchValue: (e.target as any).value.toLowerCase() });
                    }}
                  />
                </div>
              </Col>

              <Col lg={12} md={24} xs={24} className='button-flex'>
                <div className="refresh">
                  <Button
                    type="primary"
                    onClick={() => {
                      this.props.fetchDataReducer({
                        search: this.props.search,
                        filter: this.props.filter,
                        pageNumber: this.props.pageNumber,
                        pageSize: this.props.pageSize,
                        sortBy: this.props.sortBy,
                        asc: this.props.asc
                      });
                      this.props.fetchDataEffect({
                        search: this.props.search,
                        filter: this.props.filter,
                        pageNumber: this.props.pageNumber,
                        pageSize: this.props.pageSize,
                        sortBy: this.props.sortBy,
                        asc: this.props.asc
                      });
                    }}
                  >
                    <Icon type="sync" /> {this.props.languageState.FRANCHISE_PAGE_REFRESH.translated}
                  </Button>
                </div>
                <div className="refresh">
                  <Button
                    type="primary"
                    onClick={() => this.props.toggleCreateAdminModal(true)}
                  >
                    <Icon type="user" /> {this.props.languageState.FRANCHISE_PAGE_DISTRIBUTORS_CREATE.translated}
                  </Button>
                </div>
                <div className="refresh">
                  <a href="/api/users/export-distributors">
                    <Button
                      type="primary"
                    >
                      <Icon type="export" /> {this.props.languageState.FRANCHISE_PAGE_DISTRIBUTORS_EXPORT.translated}
                    </Button>
                  </a>
                </div>
              </Col>
            </Row>

          </div>

          <div className="users-table">
            <Table
              size="middle"
              loading={this.props.isBusy}
              rowKey={record => (record as any)._id}
              columns={columns}
              dataSource={this.props.data}
              onChange={(pagination, _filters, sorter) => {
                this.props.fetchDataReducer({
                  search: this.props.search,
                  filter: this.props.filter,
                  pageNumber: pagination.current,
                  pageSize: pagination.pageSize,
                  sortBy: sorter.field ? sorter.field : this.props.sortBy,
                  asc: sorter.order ? sorter.order === 'ascend' ? true : false : this.props.asc,
                });
                this.props.fetchDataEffect({
                  search: this.props.search,
                  filter: this.props.filter,
                  pageNumber: pagination.current,
                  pageSize: pagination.pageSize,
                  sortBy: sorter.field ? sorter.field : this.props.sortBy,
                  asc: sorter.order ? sorter.order === 'ascend' ? true : false : this.props.asc,
                });
              }}
              pagination={{
                total: this.props.total,
                showSizeChanger: true,
                pageSize: this.props.pageSize,
                current: this.props.pageNumber,
                pageSizeOptions: [10, 20, 50].map((item) => String(item)),
              }}
            />
          </div>

          <Modal
            style={{ minWidth: '900px' }}
            title={this.props.languageState.FRANCHISE_PAGE_DISTRIBUTORS_NEW.translated}
            okText='Save'
            cancelText='Cancel'
            onOk={this.submitCreateForm}
            onCancel={this.resetForm}
            visible={this.props.showCreateAdminModal}
          >
            <Row gutter={24} type='flex' style={{display: 'flex', flexWrap: 'wrap'}}>

              <Col xs={24}>
                <h3>{this.props.languageState.FRANCHISE_PAGE_COMPANY_DETAIL.translated}</h3>
              </Col>
              {/* Company Detail */}
              <Col span={12}>
                <FormItem label={this.props.languageState.FRANCHISE_PAGE_PLACEHOLDER_COMPANY_NAME.translated} style={{ marginBottom: '0px' }}>
                  {getFieldDecorator("companyName", {
                    rules: [
                      { required: true, message: this.props.languageState.FRANCHISE_PAGE_MESSAGE_INPUT_COMPANY_NAME.translated },
                    ],
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                  })(
                    <Input
                      autoComplete={uuid.v4()}
                      onChange={event =>
                        this.props.onChangeCreateData({
                          distributorInfo: {
                            companyName: (event.target as any).value
                          }
                        })
                      }
                      type="text"
                      placeholder={this.props.languageState.FRANCHISE_PAGE_PLACEHOLDER_COMPANY_NAME.translated}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.props.languageState.FRANCHISE_PAGE_COUNTRY_OF_BUSINESS.translated} style={{ marginBottom: '0px' }}>
                  {getFieldDecorator("countryOfBusiness", {
                    rules: [
                      { required: true, message: this.props.languageState.FRANCHISE_PAGE_INPUT_COUNTRY_OF_BUSINESS.translated },
                    ],
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                  })(
                    <AutoComplete
                      placeholder={this.props.languageState.FRANCHISE_PAGE_COUNTRY_REGISTER_IN.translated}
                      style={{ width: '100%' }}
                      dataSource={sortedDataCountry ? sortedDataCountry.map((item) => item.countryName) : []}
                      filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                      onChange={(value) => this.props.onChangeCreateData({
                        distributorInfo: {
                          countryOfBusiness: value
                        }
                      })}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.props.languageState.FRANCHISE_PAGE_COMPANY_REGISTRATION_NUMBER.translated} style={{ marginBottom: '0px' }}>
                  {getFieldDecorator("companyRegNo", {
                    rules: [
                      { required: true, message: this.props.languageState.FRANCHISE_PAGE_INPUT_COMPANY_REGISTRATION_NUMBER.translated },
                    ],
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                  })(
                    <Input
                      autoComplete={uuid.v4()}
                      onChange={event =>
                        this.props.onChangeCreateData({
                          distributorInfo: {
                            companyRegNo: (event.target as any).value
                          }
                        })
                      }
                      type="text"
                      placeholder={this.props.languageState.FRANCHISE_PAGE_COMPANY_REGISTRATION_NO.translated}
                    />
                  )}
                </FormItem>
              </Col>
              <Col xs={12}>
                <Form.Item label={this.props.languageState.FRANCHISE_PAGE_PARTNERSHIP_START_DATE.translated}>
                  <Row gutter={8}>
                    <Col xs={12}>
                      <Form.Item {...formItemLayout} label="From">
                        {this.props.form.getFieldDecorator('partnerShipStartDate', {
                          rules: [
                            { required: true, message: this.props.languageState.FRANCHISE_PAGE_FILL_START_DATE.translated },
                          ],
                          validateTrigger: 'onBlur',
                          // initialValue: this.props.currentTenant.companyProfile ? moment(this.props.currentTenant.companyProfile.partnerShipStartDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                        })(
                          <Input
                            autoComplete={uuid.v4()}
                            type="date"
                            min="1900-01-01"
                            onChange={(e) => this.props.onChangeCreateData({
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
                            { required: true, message: this.props.languageState.FRANCHISE_PAGE_FILL_END_DATE.translated },
                          ],
                          validateTrigger: 'onBlur',
                          // initialValue: this.props.currentTenant.companyProfile && this.props.currentTenant.companyProfile.partnerShipEndDate ? moment(this.props.currentTenant.companyProfile.partnerShipEndDate).format('YYYY-MM-DD') : moment().add(1, 'year').format('YYYY-MM-DD'),
                        })(
                          <Input
                            autoComplete={uuid.v4()}
                            type="date"
                            min="1900-01-01"
                            onChange={(e) => this.props.onChangeCreateData({
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

              {/* Personal Detail */}
              <Col xs={24} style={{marginTop: '-10px'}}>
                <h3>{this.props.languageState.FRANCHISE_PAGE_CONTACT_PERSON_DETAIL.translated}</h3>
              </Col>
              <Col span={12}>
                <FormItem label="Given Name" style={{ marginBottom: '0px' }}>
                  {getFieldDecorator("firstName", {
                    rules: [
                      { required: true, message: this.props.languageState.FRANCHISE_PAGE_MESSAGE_INPUT_FIRSTNAME.translated },
                      { pattern: /^(.){2,20}$/, message: this.props.languageState.FRANCHISE_PAGE_MESSAGE_CHECK_FIRSTNAME.translated },
                    ],
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                  })(
                    <Input
                      autoComplete={uuid.v4()}
                      onChange={event =>
                        this.props.onChangeCreateData({
                          firstName: (event.target as any).value
                        })
                      }
                      type="text"
                      placeholder={this.props.languageState.FRANCHISE_PAGE_PLACEHOLDER_NAME_AS_PERSONAL_ID.translated}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.props.languageState.FRANCHISE_PAGE_FAMILY_NAME.translated} style={{ marginBottom: '0px' }}>
                  {getFieldDecorator("lastName", {
                    rules: [
                      { required: true, message: this.props.languageState.FRANCHISE_PAGE_INPUT_LASTNAME.translated },
                      { pattern: /^(.){2,20}$/, message: this.props.languageState.FRANCHISE_PAGE_CHECK_LASTNAME.translated }
                    ],
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                  })(
                    <Input
                      autoComplete={uuid.v4()}
                      onChange={event =>
                        this.props.onChangeCreateData({
                          lastName: (event.target as any).value
                        })
                      }
                      type="text"
                      placeholder={this.props.languageState.FRANCHISE_PAGE_INPUT_SURNAME.translated}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label={this.props.languageState.FRANCHISE_PAGE_EMAIL_ADDRESS.translated} style={{ marginBottom: '0px' }}>
                  {getFieldDecorator("email", {
                    rules: [
                      { required: true, message: this.props.languageState.FRANCHISE_PAGE_PLEASE_INPUT_EMAIL.translated },
                      { validator: this.checkEmailExist }
                    ],
                    validateTrigger: "onBlur",
                    validateFirst: true
                  })(
                    <Input
                      autoComplete={uuid.v4()}
                      onChange={event =>
                        this.props.onChangeCreateData({
                          email: (event.target as any).value
                        })
                      }
                      type="email"
                      placeholder={this.props.languageState.FRANCHISE_PAGE_EXAMPLE_EMAIL.translated}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label={this.props.languageState.FRANCHISE_PAGE_CONTACT_NUMBER.translated} style={{ marginBottom: '0' }}>
                  {getFieldDecorator('phone', {
                    rules: [
                      { required: true, message: this.props.languageState.FRANCHISE_PAGE_MESSAGE_INPUT_NUMBER.translated },
                      { pattern: /^\d{4,15}$/, message: this.props.languageState.FRANCHISE_PAGE_MESSAGE_CHECK_NUMBER.translated },
                      {
                        validator: (_rule, _value, callback) => {
                          if (!this.props.newFranchise.phone || !this.props.newFranchise.phone.phoneID) {
                            callback(this.props.languageState.FRANCHISE_PAGE_MESSAGE_SELECT_COUNTRY_CODE.translated);
                          }
                          callback();
                        }
                      }
                    ],
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                  })(
                    <Input
                      addonBefore={phoneIdSelector()}
                      style={{ width: '100%' }}
                      name='phoneNumber'
                      placeholder={this.props.languageState.FRANCHISE_PAGE_PLACEHOLDER_MOBILE_NUMBER.translated}
                      autoComplete={uuid.v4()}
                      onChange={(e) => this.props.onChangeCreateData({
                        phone:
                          { phoneNumber: e.target.value }
                      })} />
                  )}
                </FormItem>
              </Col>

              <Col xs={24} style={{marginTop: '35px'}}>
                <h3>Distributor Payment Info</h3>
              </Col>
              <Col span={12}>
                <FormItem label="Day in month" style={{ marginBottom: '0px' }}>
                  {getFieldDecorator("dayInMonth", {
                    rules: [
                      {
                        validator: (_rule, _value, callback) => {
                          if (_value < 1 || _value > 28) {
                            callback("Day must be a number between 1 and 28");
                          }
                          callback();
                        }
                      }
                    ],
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                  })(
                    <Input
                      autoComplete={uuid.v4()}
                      onChange={event =>
                        this.props.onChangeCreateData({
                          distributorInfo: {
                            dayInMonth: (event.target as any).value
                          }
                        })
                      }
                      type="number"
                      placeholder="When the payment happens"
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Fixed Amount" style={{ marginBottom: '0px' }}>
                  {getFieldDecorator("fixedAmount", {
                    rules: [
                      {
                        validator: (_rule, _value, callback) => {
                          if (_value < 1 || _value > 99999) {
                            callback("Amount must be a number between 1 and 99999");
                          }
                          callback();
                        }
                      }
                    ],
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                  })(
                    <Input
                      autoComplete={uuid.v4()}
                      onChange={event =>
                        this.props.onChangeCreateData({
                          distributorInfo: {
                            fixedAmount: (event.target as any).value
                          }
                        })
                      }
                      type="number"
                      placeholder="Fixed amount every month"
                      addonAfter="SGD"
                    />
                  )}
                </FormItem>
              </Col>
              {/* Document */}
              <Col xs={12} style={{ marginTop: '15px' }}>
                <Col span={24}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '14px' }}>Documents:</span>
                </Col>
                <Col span={24} style={{ marginTop: '5px' }}>
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
              </Col>
            </Row>
          </Modal>

          {this.props.createDistributorSuccessModalVisible && (
            <Modal
              width={480}
              title={this.props.languageState.FRANCHISE_PAGE_NEW_DISTRIBUTOR_CREATED.translated}
              footer={null}
              onOk={this.props.closeCreateTenantSuccessModal}
              onCancel={this.props.closeCreateTenantSuccessModal}
              visible={this.props.createDistributorSuccessModalVisible}
            >
              <h4>{this.props.languageState.FRANCHISE_PAGE_FOLLOWING_DISTRIBUTOR_CREATED.translated}</h4>
              <h3>{`${this.props.data[0].distributorInfo && this.props.data[0].distributorInfo.companyName ? this.props.data[0].distributorInfo.companyName : this.props.data[0].email}`} &nbsp; <Icon type="check-circle" style={{ color: '#52c41a' }} /></h3>
              <p style={{ fontWeight: 500 }}>
                {this.props.languageState.FRANCHISE_PAGE_PLEASE_LOG_IN.translated}{config.nextjs.hostUrl}{this.props.languageState.FRANCHISE_PAGE_USING_FOLLOWING_ACCOUNT.translated}
              </p>
              <h4>{this.props.languageState.FRANCHISE_PAGE_EMAIL.translated}</h4>
              <Input value={`${this.props.data[0].email}`}></Input>
              <h4 style={{ marginTop: '10px' }}>{this.props.languageState.FRANCHISE_PAGE_TEMPORARY_PASSWORD.translated}</h4>
              <Input value={`${this.state.password}`}></Input>
              {/* <p style={{marginLeft: '24px'}}>
                {`Email: ${this.props.data[0].name}admin@email.com`}
                <br /> */}
              {/* {`Password: ${this.props.data[0].name}123`} */}
              {/* </p> */}
              <p style={{ marginTop: '10px' }}>{this.props.languageState.FRANCHISE_PAGE_FOR_SECURITY_PURPOSE.translated}</p>
            </Modal>
          )}
        </div>
      </AppLayout >
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.franchisePageModel,
    profileState: rootState.profileModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.franchisePageModel,
    profileReducers: rootReducer.profileModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(Form.create()(UsersPage));