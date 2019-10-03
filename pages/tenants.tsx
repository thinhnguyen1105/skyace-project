import * as React from 'react';
import { Row, Col, Input, Button, Icon, Table, Modal, Form, Tag, Tooltip, Spin, AutoComplete, Checkbox, Layout, Popconfirm, Upload, message, Select } from 'antd';
import { dataCountry } from "../data_common/country";
import Link from 'next/link';
import initStore from '../rematch/store';
import withRematch from '../rematch/withRematch';
import './tenants.css';
import moment from 'moment';
import AppLayout from '../layout/AdminLayout';
import axios, { AxiosResponse } from 'axios';
import { getTenantsService, getUsersService, getAuthService } from '../service-proxies';
import config from '../api/config';
import { dataPhone } from '../data_common/CountryCodes';
import * as uuid from 'uuid';

const { Content } = Layout;
const Option = Select.Option;
class TenantsPage extends React.Component<any, any> {
  state = {
    editingKey: '',
    fileList: [],
    deactivateTenantId: null,
    deactivateTenantModal: false,
    reAssignTenant: null,
    newFranchise: null,
    reAssignTenantModal: false,
    password: ""
  };

  static async getInitialProps(props: any) {
    const role = props.store.getState().profileModel.roles[0];
    if (!props.req) {
      const tenantsPageState = props.store.getState().tenantsPageModel;
      const tenantsService = getTenantsService(props.store.getState().profileModel.token);
      if (role === 'sysadmin') {
        const result = await tenantsService.find(
          tenantsPageState.search,
          tenantsPageState.pageNumber,
          tenantsPageState.pageSize,
          tenantsPageState.sortBy,
          tenantsPageState.asc,
        );
        props.store.dispatch.tenantsPageModel.fetchDataSuccess({
          data: result.data,
          total: result.total,
        });
      } else if (role === 'franchise') {
        const result = await tenantsService.findByAdmin(
          tenantsPageState.search,
          tenantsPageState.pageNumber,
          tenantsPageState.pageSize,
          tenantsPageState.sortBy,
          tenantsPageState.asc,
          props.store.getState().profileModel._id
        );
        props.store.dispatch.tenantsPageModel.fetchDataSuccess({
          data: result.data,
          total: result.total,
        });
      }
    } else {
      props.store.dispatch.tenantsPageModel.fetchDataSuccess({
        data: props.query.tenants.data,
        total: props.query.tenants.total,
      });
    }
    const franchiseList = await getUsersService(props.store.getState().profileModel.token).getFranchisesList();
    props.store.dispatch.tenantsPageModel.fetchFranchisesSuccess(franchiseList);
  }

  onCreateTenantFormSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields(async (err, _values) => {
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
            message.error(this.props.languageState.TENANT_PAGE_UPLOAD_VALIDATE.translated, 4);
          } else {
            const formData = new FormData();
            fileList.forEach((file) => {
              formData.append('materials', file);
            });

            try {
              const result: AxiosResponse = await axios({
                method: 'post',
                url: `${config.nextjs.apiUrl}/tenants/upload-file`,
                data: formData
              });
              // Create new tenant
              this.props.createNewTenant({
                tenantInfo: {
                  ...this.props.currentTenant,
                  domain: this.props.currentTenant.domain ?
                    this.props.currentTenant.domain : this.props.currentTenant.companyProfile ? (this.props.currentTenant.companyProfile.partnerCenterNameSameAsCompany
                      ? this.toUrl(this.props.currentTenant.companyProfile.registeredCompanyName) :
                      (this.props.currentTenant.companyProfile.partnerCenterName ?
                        this.toUrl(this.props.currentTenant.companyProfile.partnerCenterName) : "")
                    ) : "",
                  companyProfile: {
                    ...this.props.currentTenant.companyProfile,
                    partnerCenterName: this.props.currentTenant.companyProfile && this.props.currentTenant.companyProfile.partnerCenterNameSameAsCompany ? this.props.currentTenant.companyProfile.registeredCompanyName : this.props.currentTenant.companyProfile.partnerCenterName,
                    partnerShipStartDate: this.props.currentTenant.companyProfile ? this.props.currentTenant.companyProfile.partnerShipStartDate ? this.props.currentTenant.companyProfile.partnerShipStartDate : new Date() : new Date(),
                    partnerShipEndDate: this.props.currentTenant.companyProfile ? this.props.currentTenant.companyProfile.partnerShipEndDate ? this.props.currentTenant.companyProfile.partnerShipEndDate : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                    partnerCompanyRegistrationNumber: this.props.currentTenant.companyProfile && this.props.currentTenant.companyProfile.regNoSameAsCompany ? this.props.currentTenant.companyProfile.companyRegistrationNumber : this.props.currentTenant.companyProfile.partnerCompanyRegistrationNumber
                  },
                  fileLists: this.props.currentTenant.fileLists && this.props.currentTenant.fileLists.length ? [...this.props.currentTenant.fileLists, ...result.data] : result.data,
                  adminCreated: this.props.profileState._id,
                  password: password,
                  adminEmail: this.props.currentTenant.adminEmail,
                  adminFirstName: this.props.currentTenant.adminFirstName,
                  adminLastName: this.props.currentTenant.adminLastName,
                  adminPhoneID: this.props.currentTenant.adminPhoneID,
                  adminPhoneNumber: this.props.currentTenant.adminPhoneNumber,
                  paymentInfo: this.props.currentTenant.paymentInfo
                }
              } as any);
              this.props.form.resetFields();
            } catch (error) {
              console.log(error);
              message.error(error.message || this.props.languageState.TENANT_PAGE_ERROR.translated, 4);
            }
          }
        }
        else {
          // Create new tenant
          this.props.createNewTenant({
            tenantInfo: {
              ...this.props.currentTenant,
              domain: this.props.currentTenant.domain ?
                this.props.currentTenant.domain : this.props.currentTenant.companyProfile ? (this.props.currentTenant.companyProfile.partnerCenterNameSameAsCompany
                  ? this.toUrl(this.props.currentTenant.companyProfile.registeredCompanyName) :
                  (this.props.currentTenant.companyProfile.partnerCenterName ?
                    this.toUrl(this.props.currentTenant.companyProfile.partnerCenterName) : "")
                ) : "",
              companyProfile: {
                ...this.props.currentTenant.companyProfile,
                partnerCenterName: this.props.currentTenant.companyProfile && this.props.currentTenant.companyProfile.partnerCenterNameSameAsCompany ? this.props.currentTenant.companyProfile.registeredCompanyName : this.props.currentTenant.companyProfile.partnerCenterName,
                partnerShipStartDate: this.props.currentTenant.companyProfile ? this.props.currentTenant.companyProfile.partnerShipStartDate ? this.props.currentTenant.companyProfile.partnerShipStartDate : new Date() : new Date(),
                partnerShipEndDate: this.props.currentTenant.companyProfile ? this.props.currentTenant.companyProfile.partnerShipEndDate ? this.props.currentTenant.companyProfile.partnerShipEndDate : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                partnerCompanyRegistrationNumber: this.props.currentTenant.companyProfile && this.props.currentTenant.companyProfile.regNoSameAsCompany ? this.props.currentTenant.companyProfile.companyRegistrationNumber : this.props.currentTenant.companyProfile.partnerCompanyRegistrationNumber
              },
              adminCreated: this.props.profileState._id,
              adminEmail: this.props.currentTenant.adminEmail,
              adminFirstName: this.props.currentTenant.adminFirstName,
              adminLastName: this.props.currentTenant.adminLastName,
              adminPhoneID: this.props.currentTenant.adminPhoneID,
              adminPhoneNumber: this.props.currentTenant.adminPhoneNumber,
              password,
              paymentInfo: this.props.currentTenant.paymentInfo
              // fileLists: this.props.currentTenant.fileLists
            }
          } as any);
          this.props.form.resetFields();
        }
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  isEditing = (record) => {
    return record.key === this.state.editingKey;
  }

  checkDomainNameExist = async (_rule, _value, callback) => {
    const domain = this.props.currentTenant.domain ?
      this.props.currentTenant.domain : this.props.currentTenant.companyProfile ? (this.props.currentTenant.companyProfile.partnerCenterNameSameAsCompany
        ? this.toUrl(this.props.currentTenant.companyProfile.registeredCompanyName) :
        (this.props.currentTenant.companyProfile.partnerCenterName ?
          this.toUrl(this.props.currentTenant.companyProfile.partnerCenterName) : "")
      ) : ""
    if (domain) {
      const tenantsService = getTenantsService();
      const tenantExisted = await tenantsService.findTenantByDomain(domain);

      if (!config.tenantsModuleConfig.domainNameRegex.test(domain)) {
        callback(this.props.languageState.TENANT_PAGE_DOMAIN_VALIDATE_1.translated);
      } else if (tenantExisted) {
        callback(this.props.languageState.TENANT_PAGE_DOMAIN_VALIDATE_2.translated);
      }
      callback();
    } else {
      callback(this.props.languageState.TENANT_PAGE_DOMAIN_VALIDATE_3.translated);
    }
  }

  toUrl = (name: string) => {
    return name ? name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/\s+/g, '').toLowerCase() : "";
  }

  changeCentreName = (name: string) => {
    this.props.tenantInfoChange({
      companyProfile: {
        partnerCenterName: name
      },
      domain: this.toUrl(name)
    })
    this.props.form.setFieldsValue({ 'domain': this.toUrl(name) });
  }

  checkSamePartnerCentre = () => {
    this.props.form.setFieldsValue({ 'partnerCenterName': this.props.currentTenant.companyProfile ? (this.props.currentTenant.companyProfile.partnerCenterNameSameAsCompany ? this.props.currentTenant.companyProfile.partnerCenterName : this.props.currentTenant.companyProfile.registeredCompanyName) : "" });
    this.props.tenantInfoChange({
      companyProfile: {
        partnerCenterNameSameAsCompany: this.props.currentTenant.companyProfile ? !this.props.currentTenant.companyProfile.partnerCenterNameSameAsCompany : true
      },
      domain: this.props.currentTenant.companyProfile ?
        (this.props.currentTenant.companyProfile.partnerCenterNameSameAsCompany ?
          this.toUrl(this.props.currentTenant.companyProfile ? this.props.currentTenant.companyProfile.partnerCenterName : "") :
          this.toUrl(this.props.currentTenant.companyProfile ? this.props.currentTenant.companyProfile.registeredCompanyName : "")) :
        this.toUrl(this.props.currentTenant.companyProfile ? this.props.currentTenant.companyProfile.registeredCompanyName : "")
    })
  }

  checkSamePartnerRegNo = () => {
    this.props.form.setFieldsValue({ 'partnerCompanyRegistrationNumber': this.props.currentTenant.companyProfile ? (this.props.currentTenant.companyProfile.regNoSameAsCompany ? this.props.currentTenant.companyProfile.partnerCompanyRegistrationNumber : this.props.currentTenant.companyProfile.companyRegistrationNumber) : "" });
    this.props.tenantInfoChange({
      companyProfile: {
        regNoSameAsCompany: this.props.currentTenant.companyProfile ? !this.props.currentTenant.companyProfile.regNoSameAsCompany : true
      }
    })
  }

  changeRegisteredCompanyName = (e) => {
    if (this.props.currentTenant.companyProfile && this.props.currentTenant.companyProfile.partnerCenterNameSameAsCompany) {
      this.props.tenantInfoChange({
        companyProfile: {
          registeredCompanyName: e.target.value
        },
        domain: this.toUrl(e.target.value)
      })
      this.props.form.setFieldsValue({ 'domain': this.toUrl(e.target.value) });
      this.props.form.setFieldsValue({ 'partnerCenterName': (e.target.value) });
    } else {
      this.props.tenantInfoChange({
        companyProfile: {
          registeredCompanyName: e.target.value
        }
      })
    }
  }

  changeCompanyRegistrationNo = (e) => {
    this.props.tenantInfoChange({
      companyProfile: {
        companyRegistrationNumber: e.target.value
      }
    })
    if (this.props.currentTenant.companyProfile && this.props.currentTenant.companyProfile.regNoSameAsCompany) {
      this.props.form.setFieldsValue({ 'partnerCompanyRegistrationNumber': (e.target.value) });
    }
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

  beforeUpload = (file) => {
    this.setState(({ fileList }) => ({
      fileList: [...fileList, file],
    }));
    return false;
  }

  showDeactivateTenantModal = (_id: string) => {
    this.setState({
      deactivateTenantId: _id,
      deactivateTenantModal: true
    })
    // this.props.deactivateTenant(obj);
  }

  closeDeactivateTenantModal = () => {
    this.setState({
      deactivateTenantModal: false,
      deactivateTenantId: null
    })
  }

  deactivateTenant = () => {
    this.props.deactivateTenant({
      tenantId: this.state.deactivateTenantId
    });
    this.closeDeactivateTenantModal();
  }

  showReAssignModal = (partner: any) => {
    this.setState({
      reAssignTenant: partner,
      reAssignTenantModal: true
    })
  }

  closeReAssignTenantModal = () => {
    this.setState({
      reAssignTenant: null,
      reAssignTenantModal: false,
      newFranchise: false
    })
  }

  handleChangeFranchise = (franchise: any) => {
    if (this.state.reAssignTenant) {
      this.setState({
        newFranchise: franchise
      })
    }
  }

  updateFranchise = async () => {
    if (this.state.reAssignTenant && this.state.newFranchise) {
      const result = await getTenantsService().updateFields({
        ...(this.state.reAssignTenant as any),
        adminCreated: this.state.newFranchise,
        assignDistributorTime: Date.now()
      } as any);

      this.props.updateNewPartnerWithFranchise(result);
    }
    this.closeReAssignTenantModal();
  }

  checkEmailExist = async (_rule, value, callback) => {
    if (value) {
      const authService = getAuthService();
      const emailExisted = await authService.checkEmail(value);
      if (emailExisted) {
        callback("Email Has Been Used.");
      }
      callback();
    }
    callback();
  }

  render() {
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
          value={this.props.currentTenant.adminPhoneID || ""}
          dataSource={dataSourcePhoneID}
          placeholder="Country Code"
          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          onChange={value => this.props.tenantInfoChange({
            adminPhoneID: value
          })}
          style={{ width: 200, height: 30 }}
        />
      );
    };

    const activeTag = (isActive: boolean) => (
      <Tag color={isActive ? 'green' : 'red'}>
        {isActive ? 'Active' : 'In-Active'}
      </Tag>
    );

    const actionButtons = (record: any) => (
      <div className='action-buttons'>
        <Link href={`/tenant-detail/${record._id}`}>
          <Tooltip title={this.props.languageState.TENANT_PAGE_VIEW_PARTNER_INFO.translated}>
            <Button
              type="primary"
              icon='solution'
              className="button"
              style={{ marginRight: '12px' }}
            />
          </Tooltip>
        </Link>
        <Tooltip title={record.isActive ? this.props.languageState.TENANT_PAGE_DEACTIVATE.translated : this.props.languageState.TENANT_PAGE_ACTIVATE.translated}>
          <Button
            type="primary"
            icon={record.isActive ? 'lock' : 'unlock'}
            className="button"
            onClick={() => record.isActive ? this.showDeactivateTenantModal(record._id) : this.props.activateTenant({ tenantId: record._id })}
            style={{ marginRight: '12px' }}
          />
        </Tooltip>
        {this.props.profileState.roles && this.props.profileState.roles[0] === 'sysadmin' ? 
        <Tooltip title={this.props.languageState.TENANT_PAGE_REASSIGN.translated}>
          <Button
            type="primary"
            icon="user"
            className="button"
            onClick={() => this.showReAssignModal(record)}
            style={{ marginRight: '12px' }}
          />
        </Tooltip> : <div></div>}
      </div>
    );

    var columns = [
      {
        title: this.props.languageState.TENANT_PAGE_COUNTRY.translated,
        dataIndex: 'companyProfile.countryOfRegistration',
        key: 'country',
        width: '10%',
        sorter: true
      },
      {
        title: this.props.languageState.TENANT_PAGE_PARTNER_NAME.translated,
        dataIndex: 'companyProfile.partnerCenterName',
        key: 'companyProfile.partnerCenterName',
        width: '10%',
        sorter: true
      },
      {
        title: this.props.languageState.TENANT_PAGE_COMPANY_REG_NUMBER.translated,
        dataIndex: 'companyProfile.companyRegistrationNumber',
        key: 'companyRegistrationNumber',
        width: '10%',
        sorter: true
      },
      {
        title: this.props.languageState.TENANT_PAGE_START_DATE.translated,
        dataIndex: 'companyProfile.partnerShipStartDate',
        key: 'partnerShipStartDate',
        width: '10%',
        render: date => (
          <span>
            {date ? new Date(date).toLocaleDateString() : ""}
          </span>
        ),
        sorter: true
      },
      {
        title: this.props.languageState.TENANT_PAGE_END_DATE.translated,
        dataIndex: 'companyProfile.partnerShipEndDate',
        key: 'partnerShipEndDate',
        width: '10%',
        render: date => (
          <span>
            {date ? new Date(date).toLocaleDateString() : ""}
          </span>
        ),
        sorter: true
      },
      {
        title: this.props.languageState.TENANT_PAGE_FRANCHISE.translated,
        dataIndex: 'adminCreated',
        key: 'adminCreated',
        width: '10%',
        sorter: true,
        render: (_value, record, _index) => (
          <span>{record.adminCreated
            ? (record.adminCreated.roles && record.adminCreated.roles[0] === 'sysadmin' ? 'Skyace' : record.adminCreated.distributorInfo ? record.adminCreated.distributorInfo.companyName : record.adminCreated.fullName)
            : 'Skyace'}</span>
        )
      },
      {
        title: this.props.languageState.TENANT_PAGE_STATUS.translated,
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        editable: true,
        render: (_value, record, _index) => activeTag(record.isActive),
      },
      {
        title: this.props.languageState.TENANT_PAGE_ACTIONS.translated,
        dataIndex: 'actionIcons',
        key: 'actionIcons',
        width: '15%',
        render: (_value, record) => actionButtons(record),
      }
    ];

    if (this.props.profileState.roles && this.props.profileState.roles[0] !== 'sysadmin') {
      columns = columns.filter(val => val.title !== 'Distributor');
    }

    const sortedDataCountry = dataCountry.sort((a, b) => {
      if (a.countryName < b.countryName) {
        return -1;
      }
      if (a.countryName > b.countryName) {
        return 1;
      }
      return 0;
    });

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

    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <div className='tenants-page'>
          <Row className='margin-bottom-large'>
            <Content style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>
              {this.props.languageState.TENANT_PAGE_TITLE.translated}
              </Content>
          </Row>
          <div className='tenants-filter'>
            <Row type='flex' gutter={24} style={{ display: 'flex', alignItems: 'center' }}>
              <Col xs={12}>
                <div className='search'>
                  <Input.Search
                    className='search-input'
                    placeholder={`Search Partner ...`}
                    defaultValue={this.props.search}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      this.props.searchChangeReducer({ searchValue: (e.target as any).value.toLowerCase() });
                      const role =this.props.profileState.roles[0];
                      if (role === 'sysadmin') {
                        this.props.searchChangeEffect({ searchValue: (e.target as any).value.toLowerCase() });
                      } else if (role === 'franchise'){
                        this.props.searchChangeFranchiseEffect({ searchValue: (e.target as any).value.toLowerCase() , _id: this.props.profileState._id});
                      }
                    }}
                  />
                </div>
              </Col>
              <Col span={12} className='button-flex'>
                <div className='add'>
                  <Button type='primary' onClick={() => this.props.openAddTenantModal({ currentTenant: {} } as any)}>
                    <Icon type='plus' /> {this.props.languageState.TENANT_PAGE_ADD_NEW.translated}
                  </Button>
                </div>
                <div className='refresh'>
                  <Button type='primary' onClick={async () => {
                    this.props.fetchDataReducer({
                      search: this.props.search,
                      pageNumber: this.props.pageNumber,
                      pageSize: this.props.pageSize,
                      sortBy: this.props.sortBy,
                      asc: this.props.asc
                    });
                    const role = this.props.profileState.roles[0];
                    if (role === 'sysadmin') {
                      this.props.fetchDataEffect({
                        search: this.props.search,
                        pageNumber: this.props.pageNumber,
                        pageSize: this.props.pageSize,
                        sortBy: this.props.sortBy,
                        asc: this.props.asc
                      });
                    } else if (role === 'franchise' ) {
                      this.props.fetchDataFranchiseEffect({
                        search: this.props.search,
                        pageNumber: this.props.pageNumber,
                        pageSize: this.props.pageSize,
                        sortBy: this.props.sortBy,
                        asc: this.props.asc,
                        _id: this.props.profileState._id
                      })
                    }
                  }}>
                    <Icon type='sync' /> Refresh
                  </Button>
                </div>
                <div className="refresh">
                {this.props.profileState.roles[0] === 'sysadmin' ? 
                  <a href="/api/tenants/export-partners">
                    <Button type='primary' disabled={!this.props.data.length}>
                      <Icon type='export' />Export Partners
                    </Button>
                  </a> : <a href={`/api/tenants/export-partners?distributor=${this.props.profileState._id}`}>
                    <Button type='primary' disabled={!this.props.data.length}>
                      <Icon type='export' />Export Partners
                    </Button>
                  </a>
                }
                </div>
              </Col>
            </Row>
          </div>

          <div className='tenants-table'>
            <Table
              size='middle'
              loading={this.props.isBusy}
              columns={columns}
              bordered
              dataSource={this.props.data}
              rowKey={record => (record as any)._id}
              onChange={(pagination: any, _filters: any, sorter: any) => {
                this.props.fetchDataReducer({
                  search: this.props.search,
                  pageNumber: pagination.current,
                  pageSize: pagination.pageSize,
                  sortBy: sorter.field ? sorter.field : this.props.sortBy,
                  asc: sorter.order ? sorter.order === 'ascend' ? true : false : this.props.asc,
                });
                const role = this.props.profileState.roles[0];
                if (role === 'sysadmin') {
                  this.props.fetchDataEffect({
                    search: this.props.search,
                    pageNumber: pagination.current,
                    pageSize: pagination.pageSize,
                    sortBy: sorter.field ? sorter.field : this.props.sortBy,
                    asc: sorter.order ? sorter.order === 'ascend' ? true : false : this.props.asc,
                  })
                } else if(role === 'franchise') {
                  this.props.fetchDataFranchiseEffect({
                    search: this.props.search,
                    pageNumber: pagination.current,
                    pageSize: pagination.pageSize,
                    sortBy: sorter.field ? sorter.field : this.props.sortBy,
                    asc: sorter.order ? sorter.order === 'ascend' ? true : false : this.props.asc,
                    _id: this.props.profileState._id
                  })
                }
              }}
              pagination={{
                total: this.props.total,
                current: this.props.pageNumber,
                showSizeChanger: true,
                pageSize: this.props.pageSize,
                pageSizeOptions: [10, 20, 50].map(item =>
                  String(item),
                )
              }}
            />
          </div>

          <Modal
            width={1000}
            title={this.props.languageState.TENANT_PAGE_NEW_PARTNER.translated}
            okText='Save'
            cancelText='Cancel'
            onOk={this.onCreateTenantFormSubmit}
            onCancel={() => {
              this.props.closeAddTenantModal();
              this.props.form.resetFields();
            }}
            visible={this.props.addTenantModalVisible}
          >
            <div className='add-new-teacher-form'>
              <Spin spinning={this.props.isBusy} tip='Processing ...'>
                <Form>
                  <Row gutter={12} style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Col xs={24}>
                      <h3>Company detail</h3>
                    </Col>
                    <Col xs={12}>
                      <Form.Item label={this.props.languageState.TENANT_PAGE_REG_COMPANY_NAME.translated}>
                        {this.props.form.getFieldDecorator('registeredCompanyName', {
                          rules: [
                            { required: true, message: this.props.languageState.TENANT_PAGE_REG_COMPANY_NAME_VALIDATE.translated },
                          ],
                          validateTrigger: 'onBlur',
                          initialValue: this.props.currentTenant.companyProfile ? this.props.currentTenant.companyProfile.registeredCompanyName : "",
                        })(
                          <Input
                            placeholder={this.props.languageState.TENANT_PAGE_REG_COMPANY_NAME_PLACEHOLDER.translated}
                            autoComplete={uuid.v4()}
                            onChange={this.changeRegisteredCompanyName}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col xs={12}>
                      <Form.Item label={this.props.languageState.TENANT_PAGE_COUNTRY_OF_BUSINESS.translated}>
                        {this.props.form.getFieldDecorator('countryOfRegistration', {
                          rules: [
                            { required: true, message: this.props.languageState.TENANT_PAGE_COUNTRY_OF_BUSINESS_VALIDATE.translated },
                          ],
                          validateTrigger: 'onBlur',
                          validateFirst: true,
                          initialValue: this.props.currentTenant.companyProfile ? this.props.currentTenant.companyProfile.countryOfRegistration : "",
                        })(
                          <AutoComplete
                            placeholder={this.props.languageState.TENANT_PAGE_COUNTRY_OF_BUSINESS_PLACEHOLDER.translated}
                            style={{ width: '100%' }}
                            dataSource={sortedDataCountry ? sortedDataCountry.map((item) => item.countryName) : []}
                            filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                            onChange={(value) => this.props.tenantInfoChange({
                              companyProfile: {
                                countryOfRegistration: value
                              }
                            })}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col xs={12}>
                      <Form.Item label={this.props.languageState.TENANT_PAGE_COMPANY_REG_NUMBER.translated}>
                        {this.props.form.getFieldDecorator('companyRegistrationNumber', {
                          rules: [
                            { required: true, message: this.props.languageState.TENANT_PAGE_COMPANY_REG_NUMBER_VALIDATE.translated },
                          ],
                          validateTrigger: 'onBlur',
                          initialValue: this.props.currentTenant.companyProfile ? this.props.currentTenant.companyProfile.companyRegistrationNumber : "",
                        })(
                          <Input
                            placeholder={this.props.languageState.TENANT_PAGE_COMPANY_REG_NUMBER_PLACEHOLDER.translated}
                            autoComplete={uuid.v4()}
                            onChange={this.changeCompanyRegistrationNo}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col xs={12}>
                      <Form.Item label={this.props.languageState.TENANT_PAGE_PARTNER_START.translated}>
                        <Row gutter={8}>
                          <Col xs={12}>
                            <Form.Item {...formItemLayout} label="From">
                              {this.props.form.getFieldDecorator('partnerShipStartDate', {
                                rules: [
                                  { required: true, message: this.props.languageState.TENANT_PAGE_PARTNER_START_VALIDATE.translated },
                                ],
                                validateTrigger: 'onBlur',
                                initialValue: this.props.currentTenant.companyProfile ? moment(this.props.currentTenant.companyProfile.partnerShipStartDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                              })(
                                <Input
                                  autoComplete={uuid.v4()}
                                  type="date"
                                  min="1900-01-01"
                                  onChange={(e) => this.props.tenantInfoChange({
                                    companyProfile: {
                                      partnerShipStartDate: new Date(e.target.value)
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
                                  { required: true, message: this.props.languageState.TENANT_PAGE_PARTNER_END_VALIDATE.translated },
                                ],
                                validateTrigger: 'onBlur',
                                initialValue: this.props.currentTenant.companyProfile && this.props.currentTenant.companyProfile.partnerShipEndDate ? moment(this.props.currentTenant.companyProfile.partnerShipEndDate).format('YYYY-MM-DD') : moment().add(1, 'year').format('YYYY-MM-DD'),
                              })(
                                <Input
                                  autoComplete={uuid.v4()}
                                  type="date"
                                  min="1900-01-01"
                                  onChange={(e) => this.props.tenantInfoChange({
                                    companyProfile: {
                                      partnerShipEndDate: new Date(e.target.value)
                                    }
                                  })}
                                />
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form.Item>
                    </Col>
                    <Col xs={12}>
                      <Row className='margin-bottom-small'>
                        <Col span={12}>
                          <Content>
                            <span style={{ color: 'red', marginRight: '5px' }}>*</span>
                            <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '14px' }}>{this.props.languageState.TENANT_PAGE_PARTNER_CENTRE_NAME.translated}</span>
                          </Content>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                          <Checkbox
                            checked={this.props.currentTenant.companyProfile ? this.props.currentTenant.companyProfile.partnerCenterNameSameAsCompany : false}
                            onChange={this.checkSamePartnerCentre}
                          >
                            {this.props.languageState.TENANT_PAGE_SAME_AS_COMPANY.translated}
                          </Checkbox>
                        </Col>
                      </Row>

                      <Form.Item>
                        {this.props.form.getFieldDecorator('partnerCenterName', {
                          rules: [
                            { required: true, message: this.props.languageState.TENANT_PAGE_PARTNER_CENTRE_NAME_VALIDATE.translated },
                          ],
                          validateTrigger: 'onBlur',
                          initialValue: this.props.currentTenant.companyProfile ? this.props.currentTenant.companyProfile.partnerCenterName : "",
                        })(
                          <Input
                            autoComplete={uuid.v4()}
                            disabled={this.props.currentTenant.companyProfile && this.props.currentTenant.companyProfile.partnerCenterNameSameAsCompany}
                            placeholder={this.props.languageState.TENANT_PAGE_PARTNER_END_VALIDATE.translated}
                            onChange={(e) => this.changeCentreName(e.target.value.toString())}
                          />
                        )}
                      </Form.Item>
                      <Row>
                        <Row className='margin-bottom-small'>
                          <Col span={12}>
                            <Content>
                              <span style={{ color: 'red', marginRight: '5px' }}>*</span>
                              <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '14px' }}>{this.props.languageState.TENANT_PAGE_PARTNER_COMPANY_REG_NO.translated} </span>
                            </Content>
                          </Col>
                          <Col span={12} style={{ textAlign: 'right' }}>
                            <Checkbox
                              checked={this.props.currentTenant.companyProfile ? this.props.currentTenant.companyProfile.regNoSameAsCompany : false}
                              onChange={this.checkSamePartnerRegNo}
                            >
                              {this.props.languageState.TENANT_PAGE_SAME_AS_COMPANY.translated}
                          </Checkbox>
                          </Col>
                        </Row>
                        <Form.Item>
                          {this.props.form.getFieldDecorator('partnerCompanyRegistrationNumber', {
                            rules: [
                              { required: true, message: this.props.languageState.TENANT_PAGE_PARTNER_COMPANY_REG_NO_VALIDATE.translated },
                            ],
                            validateTrigger: 'onBlur',
                            initialValue: this.props.currentTenant.companyProfile ? this.props.currentTenant.companyProfile.partnerCompanyRegistrationNumber : "",
                          })(
                            <Input
                              autoComplete={uuid.v4()}
                              disabled={this.props.currentTenant.companyProfile && this.props.currentTenant.companyProfile.regNoSameAsCompany}
                              placeholder={this.props.languageState.TENANT_PAGE_PARTNER_COMPANY_REG_NO_PLACEHOLDER.translated}
                              onChange={(e) => this.props.tenantInfoChange({
                                companyProfile: {
                                  partnerCompanyRegistrationNumber: e.target.value
                                }
                              })}
                            />
                          )}
                        </Form.Item>
                      </Row>
                    </Col>
                    <Col xs={12}>
                      <Form.Item label={this.props.languageState.TENANT_PAGE_SUB_DOMAIN.translated}>
                        {this.props.form.getFieldDecorator('domain', {
                          rules: [
                            { validator: this.checkDomainNameExist }
                          ],
                          validateTrigger: 'onBlur',
                          initialValue: this.props.currentTenant.domain ?
                            this.props.currentTenant.domain : this.props.currentTenant.companyProfile ? (this.props.currentTenant.companyProfile.partnerCenterNameSameAsCompany
                              ? this.toUrl(this.props.currentTenant.companyProfile.registeredCompanyName) :
                              (this.props.currentTenant.companyProfile.partnerCenterName ?
                                this.toUrl(this.props.currentTenant.companyProfile.partnerCenterName) : "")
                            ) : "",
                        })(
                          <Input
                            placeholder={this.props.languageState.TENANT_PAGE_SUB_DOMAIN_VALIDATE.translated}
                            autoComplete={uuid.v4()}
                            addonBefore="https://"
                            addonAfter=".skyace-learning.com"
                            onChange={(e) => this.props.tenantInfoChange({
                              domain: e.target.value
                            })}
                          />
                        )}
                      </Form.Item>
                      <p style={{ fontSize: '12px', color: '#666' }}>{this.props.languageState.TENANT_PAGE_NOTE.translated}</p>
                    </Col>

                  </Row>
                  <Row>
                    <Row className='margin-bottom-small' style={{marginTop: '35px'}}>
                      <Col xs={24}>
                        <h3>{this.props.languageState.TENANT_PAGE_CONTACT_PERSON_DETAIL.translated}</h3>
                      </Col>
                    </Row>
                    <Row gutter={12}>
                      <Col span={12}>
                        <Form.Item label="Given Name">
                          {this.props.form.getFieldDecorator('adminFirstName', {
                            rules: [
                              { required: true, message: "Please fill in admin's first name." },
                            ],
                            validateTrigger: 'onBlur',
                            initialValue: this.props.currentTenant.adminFirstName
                          })(
                            <Input
                              autoComplete={uuid.v4()}
                              type="text"
                              placeholder="Name as per national ID"
                              onChange={(e) => this.props.tenantInfoChange({
                                adminFirstName: e.target.value
                              })}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Family Name">
                          {this.props.form.getFieldDecorator('adminLastName', {
                            rules: [
                              { required: true, message: "Please fill in admin's last name." },
                            ],
                            validateTrigger: 'onBlur',
                            initialValue: this.props.currentTenant.adminLastName
                          })(
                            <Input
                              autoComplete={uuid.v4()}
                              type="text"
                              placeholder="Surname as per national ID"
                              onChange={(e) => this.props.tenantInfoChange({
                                adminLastName: e.target.value
                              })}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Email Address">
                          {this.props.form.getFieldDecorator('adminEmail', {
                            rules: [
                              { required: true, message: "Please fill in admin's email." },
                              { type: 'email', message: "Please input an email" },
                              { validator: this.checkEmailExist }
                            ],
                            validateTrigger: 'onBlur',
                            validateFirst: true,
                            initialValue: this.props.currentTenant.adminEmail
                          })(
                            <Input
                              autoComplete={uuid.v4()}
                              type="email"
                              placeholder="E.g: skyacepartner@gmail.com"
                              onChange={(e) => this.props.tenantInfoChange({
                                adminEmail: e.target.value
                              })}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Phone">
                          {this.props.form.getFieldDecorator('adminPhoneNumber', {
                            rules: [
                              { required: true, message: "Please fill in admin's phone number." },
                              { pattern: /^\d{4,15}$/, message: "Phone number must be from 4 - 15 digits" },
                              {
                                validator: (_rule, _value, callback) => {
                                  if (!this.props.currentTenant.adminPhoneNumber || !this.props.currentTenant.adminPhoneID) {
                                    callback("Please select your country code");
                                  }
                                  callback();
                                }
                              }
                            ],
                            validateTrigger: 'onBlur',
                            validateFirst: true,
                            initialValue: this.props.currentTenant.adminPhoneNumber
                          })(
                            <Input
                              autoComplete={uuid.v4()}
                              addonBefore={phoneIdSelector()}
                              placeholder="Mobile number"
                              onChange={(e) => this.props.tenantInfoChange({
                                adminPhoneNumber: e.target.value
                              })}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Row>
                  <Row>
                    <Row className='margin-bottom-small' style={{marginTop: '35px'}}>
                      <Col xs={24}>
                        <h3>Partner Payment Info</h3>
                      </Col>
                    </Row>
                    <Row gutter={12} style={{display: 'flex', flexWrap: 'wrap'}}>
                      <Col span={12}>
                        <Form.Item label="Day In Month">
                          {this.props.form.getFieldDecorator('dayInMonth', {
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
                            initialValue: this.props.currentTenant.paymentInfo ? this.props.currentTenant.paymentInfo.dayInMonth : undefined
                          })(
                            <Input
                              autoComplete={uuid.v4()}
                              type="number"
                              placeholder="Monthly payment day"
                              onChange={(e) => this.props.tenantInfoChange({
                                paymentInfo: {
                                  dayInMonth : e.target.value
                                }
                              })}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Fixed Amount">
                          {this.props.form.getFieldDecorator('fixedAmount', {
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
                            initialValue: this.props.currentTenant.paymentInfo ? this.props.currentTenant.paymentInfo.fixedAmount : undefined
                          })(
                            <Input
                              autoComplete={uuid.v4()}
                              type="number"
                              addonAfter="SGD"
                              placeholder="Monthly fixed amount"
                              onChange={(e) => this.props.tenantInfoChange({
                                paymentInfo: {
                                  fixedAmount : e.target.value
                                }
                              })}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={12}>
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
                  </Row>
                </Form>
              </Spin>
            </div>
          </Modal>

          {this.props.createTenantSuccessModalVisible && (
            <Modal
              width={480}
              title={this.props.languageState.TENANT_PAGE_NEW_PARTNER_CREATED.translated}
              footer={null}
              onOk={this.props.closeCreateTenantSuccessModal}
              onCancel={this.props.closeCreateTenantSuccessModal}
              visible={this.props.createTenantSuccessModalVisible}
            >
              <h4>The following partner account has been created:</h4>
              <h3>{`${this.props.data[0].companyProfile.registeredCompanyName}`} &nbsp; <Icon type="check-circle" style={{ color: '#52c41a' }} /></h3>
              <p style={{ fontWeight: 500 }}>
                Please log in to "https://<span style={{ color: '#f5222d' }}>{this.props.data[0].domain}</span>{config.nextjs.tailUrl}" using the following account:
              </p>
              <h4>{this.props.languageState.TENANT_PAGE_EMAIL.translated}</h4>
              <Input value={`${this.props.data[0].adminEmail}`}></Input>
              <h4 style={{ marginTop: '10px' }}>{this.props.languageState.TENANT_PAGE_TEMPORARY_PASSWORD.translated}</h4>
              <Input value={`${this.state.password}`}></Input>
              {/* <p style={{marginLeft: '24px'}}>
                {`Email: ${this.props.data[0].name}admin@email.com`}
                <br /> */}
              {/* {`Password: ${this.props.data[0].name}123`} */}
              {/* </p> */}
              <p style={{ marginTop: '10px' }}>{this.props.languageState.TENANT_PAGE_NEW_PARTNER_CREATED_WARNING.translated}</p>
            </Modal>
          )}
          <Modal
            width={480}
            title={this.props.languageState.TENANT_PAGE_DEACTIVATE.translated}
            onOk={this.deactivateTenant}
            onCancel={this.closeDeactivateTenantModal}
            visible={this.state.deactivateTenantModal}
          >
            <div>
              <h4 style={{color: 'red'}}>{this.props.languageState.TENANT_PAGE_DEACTIVATE_TEXT.translated}</h4>
            </div>
          </Modal>

          <Modal
            width={480}
            title={this.props.languageState.TENANT_PAGE_REASSIGN.translated}
            okText="Save"
            onOk={this.updateFranchise}
            onCancel={this.closeReAssignTenantModal}
            visible={this.state.reAssignTenantModal}
          >
            <div>
              <h4>{this.props.languageState.TENANT_PAGE_CHOOSE.translated}</h4>
              <Select 
                style={{minWidth: '200px'}} 
                value={this.state.newFranchise ? this.state.newFranchise : (this.state.reAssignTenant ? (this.state.reAssignTenant as any).adminCreated ? (this.state.reAssignTenant as any).adminCreated._id : ""  : "")} 
                onChange={(val) => this.handleChangeFranchise(val)} placeholder={this.props.languageState.TENANT_PAGE_CHOOSE.translated}>
                {
                  (this.props.franchiseList || []).map((item) => {
                    if (item) {
                      return <Option value={item._id} key={item._id.toString()}>{`${item.distributorInfo ? item.distributorInfo.companyName : item.fullName} (${item.roles[0] === 'franchise' ? 'distributor' : item.roles[0]})`}</Option>
                    } else {
                      return false
                    }
                  })
                }
              </Select>
            </div>
          </Modal>
        </div>
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
    profileReducers: rootReducer.profileModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(Form.create()(TenantsPage));