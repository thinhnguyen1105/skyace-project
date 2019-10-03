import {
  Row,
  Col,
  Input,
  Layout,
  Button,
  AutoComplete,
  Icon,
  message,
  Checkbox,
  Popconfirm,
  Form
} from "antd";
import { dataCountry } from "../../data_common/country";
import React from "react";
import Avatar from "./Avatar";
import moment from 'moment';
import Cookies from 'js-cookie';
import config from '../../api/config';
import Router from 'next/router';
import { getTenantsService, getUsersService } from '../../service-proxies';

const { Content } = Layout;
const { TextArea } = Input;
const InputGroup = Input.Group;

class Profile extends React.Component<any, any> {

  state = {
    file: this.props.companyLogoSrc ? [{
      uid: -1,
      name: 'logo.png',
      status: 'done',
      url: this.props.companyLogoSrc,
      type: 'image/png'
    }] : null
  }

  update = async () => {
    this.props.form.validateFields(async (err, _values) => {
      if (!err) {
        try {
          const tenantService = getTenantsService();
          var companyLogoSrc = "";
          if (this.state.file && this.state.file.length) {
            if (this.state.file[0].status === 'done' && this.state.file[0].uid !== -1) {
              companyLogoSrc = `/static/images/company-logo/image-${this.props.tenantInfo._id}.${this.state.file[0].type.slice(6, 10)}`
            } else {
              message.error(this.props.languageState.PROFILE_UPLOADING_COMPANY_LOGO_ERROR.translated, 4);
            }
          }
    
          const domain = this.props.tenantInfo.domain ?
            this.props.tenantInfo.domain : this.props.tenantInfo.companyProfile ? (this.props.tenantInfo.companyProfile.partnerCenterNameSameAsCompany
              ? this.toUrl(this.props.tenantInfo.companyProfile.registeredCompanyName) :
              (this.props.tenantInfo.companyProfile.partnerCenterName ?
                this.toUrl(this.props.tenantInfo.companyProfile.partnerCenterName) : "")
            ) : "";
          if (domain) {
            const domainExists = await tenantService.checkDomainExist({ domain: domain, _id: this.props.tenantInfo._id });
            if (domainExists.code) {
              this.props.checkDomainSuccess(domainExists.code);
              return;
            }
            else {
              const updateData = {
                _id: this.props.tenantInfo._id,
                domain: domain,
                companyLogoSrc
              };
              await this.props.updateFields(updateData);
            }
          } else {
            const updateData = {
              _id: this.props.tenantInfo._id,
              companyLogoSrc
            };
            await this.props.updateFields(updateData);
          }
          if (this.props.tenantInfo.companyProfile) {
            await this.props.updateProfile({
              _id: this.props.tenantInfo._id,
              registeredCompanyName: this.props.tenantInfo.companyProfile.registeredCompanyName,
              companyRegistrationNumber: this.props.tenantInfo.companyProfile.companyRegistrationNumber,
              partnerCenterName: this.props.tenantInfo.companyProfile && this.props.tenantInfo.companyProfile.partnerCenterNameSameAsCompany ? this.props.tenantInfo.companyProfile.registeredCompanyName : this.props.tenantInfo.companyProfile.partnerCenterName,
              countryOfRegistration: this.props.tenantInfo.companyProfile.countryOfRegistration,
              aboutCompany: this.props.tenantInfo.companyProfile.aboutCompany,
              partnerShipStartDate: this.props.tenantInfo.companyProfile.partnerShipStartDate || new Date(),
              partnerShipEndDate: this.props.tenantInfo.companyProfile.partnerShipEndDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
              partnerCompanyRegistrationNumber: this.props.tenantInfo.companyProfile && this.props.tenantInfo.companyProfile.regNoSameAsCompany ? this.props.tenantInfo.companyProfile.companyRegistrationNumber : this.props.tenantInfo.companyProfile.partnerCompanyRegistrationNumber,
              regNoSameAsCompany: this.props.tenantInfo.companyProfile.regNoSameAsCompany || false,
              partnerCenterNameSameAsCompany: this.props.tenantInfo.companyProfile.partnerCenterNameSameAsCompany || false,
            })
          } else return;
        } catch (error) {
          message.error(error.message || this.props.languageState.PROFILE_SOMETHING_WENT_WRONG.translated, 4);
        }
      }
    });
  }

  checkDomainNameExist = async (_rule, _value, callback) => {
    const domain = this.props.tenantInfo.domain ?
      this.props.tenantInfo.domain : this.props.tenantInfo.companyProfile ? (this.props.tenantInfo.companyProfile.partnerCenterNameSameAsCompany
        ? this.toUrl(this.props.tenantInfo.companyProfile.registeredCompanyName) :
        (this.props.tenantInfo.companyProfile.partnerCenterName ?
          this.toUrl(this.props.tenantInfo.companyProfile.partnerCenterName) : "")
      ) : ""
    if (domain) {
      if (domain === this.props.oldDomain) callback();
      else {
        const tenantsService = getTenantsService();
        const tenantExisted = await tenantsService.findTenantByDomain(domain);

        if (!config.tenantsModuleConfig.domainNameRegex.test(domain)) {
          callback(this.props.languageState.PROFILE_DOMAIN_CHARACTER_ERROR.translated);
        } else if (tenantExisted) {
          callback(this.props.languageState.PROFILE_DOMAIN_DUPPLICATE_ERROR.translated);
        }
        callback();
      }
    } else {
      callback(this.props.languageState.PROFILE_FILL_IN_SUBDOMAIN_CTA.translated);
    }
  }

  toggleWebsite = async (state: boolean) => {
    await this.props.updateFields({
      _id: this.props.tenantInfo._id,
      isActive: state
    });
    this.props.changeTenantInput({
      _id: this.props.tenantInfo._id,
      isActive: state
    })
  }

  deactiveAccount = async () => {
    try {
      const admins = await getUsersService().findTenantAdmin(this.props.tenantInfo._id);
      this.toggleWebsite(false);
      const promises = admins.map(val => {
        return this.props.deactiveAccount(val._id);
      })
      await Promise.all(promises);
      message.success(this.props.languageState.PROFILE_ACCOUNT_TERMINATED_MESSAGE.translated);
      if (admins.map(val => val._id.toString()).indexOf(this.props.profileState._id) >= 0) {
        // Logout
        const urlRegex = config.nextjs.checkUrlRegexFrontEnd;
        const matchResult = window.location.host.match(urlRegex);
        const tenantName = matchResult && matchResult[1] ? matchResult[1].replace('.', '') : 'admin';

        Cookies.remove(`token_${tenantName}`, { domain: config.nextjs.cookieDomain });

        this.props.profileReducers.logOut();
        Router.push('/');
      }
    } catch (err) {
      message.error(err.message, 4);
    }
  }

  toUrl = (name: string) => {
    return name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/\s+/g, '').toLowerCase();;
  }

  changeFile = (file) => {
    this.setState({ file });
  }

  render() {
    console.log('prosp', this.props.oldDomain);
    const sortedDataCountry = dataCountry.sort((a, b) => {
      if (a.countryName < b.countryName) {
        return -1;
      }
      if (a.countryName > b.countryName) {
        return 1;
      }
      return 0;
    });

    const { getFieldDecorator } = this.props.form;

    return (
      <Layout style={{ background: "#ffffff" }}>
        <Row className='margin-bottom-large' style={{ padding: '0px 10px 0px 10px' }}>
          <Content style={{ fontWeight: "bold", fontSize: 20 }}>
            {this.props.languageState.PROFILE_COMPANY_PROFILE_SECTION_TITLE.translated}
          </Content>
        </Row>
        <Row>
          <Col span={12} style={{ padding: 10 }}>
            <Row className='margin-bottom-small'>
              <Form.Item label={this.props.languageState.PROFILE_REGISTED_COMPANY_NAME_LABEL.translated}>
              {
                getFieldDecorator('registeredCompanyName', {
                  rules: [
                    { required: true, message: this.props.languageState.PROFILE_REGISTED_COMPANY_NAME_REQUIRE_MESSAGE.translated },
                  ],
                  validateTrigger: 'onBlur',
                  initialValue: this.props.tenantInfo.companyProfile ? this.props.tenantInfo.companyProfile.registeredCompanyName : ""
                })(
                  <Input placeholder={this.props.languageState.PROFILE_REGISTED_COMPANY_NAME_PLACEHOLDER.translated}
                    disabled={this.props.disableInput}
                    onChange={(event) => this.props.tenantInfo.companyProfile && this.props.tenantInfo.companyProfile.partnerCenterNameSameAsCompany ?
                      this.props.changeTenantInput({
                        companyProfile: {
                          registeredCompanyName: (event.target as any).value,
                        }, domain: this.toUrl(event.target.value)
                      }) : this.props.changeTenantInput({ companyProfile: { registeredCompanyName: (event.target as any).value } })
                    }
                  />
                )
              }
              </Form.Item>
            </Row>
            <Row className='margin-bottom-small'>
              <Form.Item label={this.props.languageState.PROFILE_COMPANY_REGISTRATION_NUMBER_LABEL.translated}>
              {
                getFieldDecorator('companyRegistrationNumber', {
                  rules: [
                    { required: true, message: this.props.languageState.PROFILE_COMPANY_REGISTRATION_NUMBER_REQUIRE_MESSAGE.translated },
                  ],
                  validateTrigger: 'onBlur',
                  initialValue: this.props.tenantInfo.companyProfile ? this.props.tenantInfo.companyProfile.companyRegistrationNumber : ""
                })(
                  <Input placeholder={this.props.languageState.PROFILE_COMPANY_REGISTRATION_NUMBER_PLACEHOLDER.translated}
                    disabled={this.props.disableInput}
                    onChange={(event) => this.props.changeTenantInput({ companyProfile: { companyRegistrationNumber: (event.target as any).value } })}
                  />
              )}
              </Form.Item>
            </Row>
            <Row className='margin-bottom-small'>
              <Col span={12}>
                <Content className='margin-bottom-small'>
                  {this.props.languageState.PROFILE_PARTNER_CENTER_NAME_SECTION_TITLE.translated}
                  <span style={{ color: 'red' }}>*</span>
                </Content>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Checkbox
                  disabled={this.props.disableInput}
                  checked={this.props.tenantInfo.companyProfile ? this.props.tenantInfo.companyProfile.partnerCenterNameSameAsCompany : false}
                  onChange={() => this.props.changeTenantInput({
                    companyProfile: {
                      partnerCenterNameSameAsCompany: this.props.tenantInfo.companyProfile ? !this.props.tenantInfo.companyProfile.partnerCenterNameSameAsCompany : true,
                    },
                    domain: this.props.tenantInfo.companyProfile ? (!this.props.tenantInfo.companyProfile.partnerCenterNameSameAsCompany ? this.toUrl(this.props.tenantInfo.companyProfile.registeredCompanyName) : this.toUrl(this.props.tenantInfo.companyProfile.partnerCenterName)) : ""
                  })}
                >
                  {this.props.languageState.PROFILE_PARTNER_CENTER_NAME_CHECKBOX_LABEL.translated}
                </Checkbox>
              </Col>

              <Input placeholder={this.props.languageState.PROFILE_PARTNER_CENTER_NAME_INPUT_PLACEHOLDER.translated}
                disabled={(this.props.tenantInfo.companyProfile && this.props.tenantInfo.companyProfile.partnerCenterNameSameAsCompany) || this.props.disableInput}
                value={this.props.tenantInfo.companyProfile ? this.props.tenantInfo.companyProfile.partnerCenterNameSameAsCompany ? this.props.tenantInfo.companyProfile.registeredCompanyName : this.props.tenantInfo.companyProfile.partnerCenterName : ""}
                onChange={(event) => this.props.changeTenantInput({
                  companyProfile: { partnerCenterName: (event.target as any).value },
                  domain: this.toUrl(event.target.value)
                })}
              />
            </Row>
            <Row className='margin-bottom-large'>
              <Col span={12}>
                <Content className='margin-bottom-small'>
                {this.props.languageState.PROFILE_PARTNER_COMPANY_REGISTRATION_SECTION_TITLE.translated}<span style={{ color: "red" }}>*</span>
                </Content>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Checkbox
                  disabled={this.props.disableInput}
                  checked={this.props.tenantInfo.companyProfile ? this.props.tenantInfo.companyProfile.regNoSameAsCompany : false}
                  onChange={() => this.props.changeTenantInput({
                    companyProfile: {
                      regNoSameAsCompany: this.props.tenantInfo.companyProfile ? !this.props.tenantInfo.companyProfile.regNoSameAsCompany : true
                    }
                  })}
                >
                  {this.props.languageState.PROFILE_PARTNER_COMPANY_REGISTRATION_CHECKBOX_LABEL.translated}
                </Checkbox>
              </Col>
              <Input placeholder={this.props.languageState.PROFILE_PARTNER_COMPANY_REGISTRATION_INPUT_PLACEHOLDER.translated}
                disabled={this.props.disableInput || (this.props.tenantInfo.companyProfile && this.props.tenantInfo.companyProfile.regNoSameAsCompany)}
                value={this.props.tenantInfo.companyProfile ? this.props.tenantInfo.companyProfile.regNoSameAsCompany ? this.props.tenantInfo.companyProfile.companyRegistrationNumber : this.props.tenantInfo.companyProfile.partnerCompanyRegistrationNumber : ""}
                onChange={(event) => this.props.changeTenantInput({ companyProfile: { partnerCompanyRegistrationNumber: (event.target as any).value } })}
              />
            </Row>
            <Row>
              <InputGroup style={{ marginBottom: 16 }}>
                <Content className='margin-bottom-small'>
                  {this.props.languageState.PROFILE_ABOUT_THE_CENTER_SECTION_TITLE.translated}
                  </Content>
                <TextArea
                  disabled={this.props.disableInput}
                  rows={5}
                  value={this.props.tenantInfo.companyProfile ? this.props.tenantInfo.companyProfile.aboutCompany : ""}
                  placeholder={this.props.languageState.PROFILE_ABOUT_THE_CENTER_INPUT_PLACEHOLDER.translated}
                  // autosize={{ minRows: 2, maxRows: 6 }}
                  onChange={(event) => this.props.changeTenantInput({ companyProfile: { aboutCompany: (event.target as any).value } })}
                />
              </InputGroup>
              {!this.props.disableInput ?
                <Button
                  type="primary"
                  onClick={this.update}
                >
                  {this.props.languageState.PROFILE_ABOUT_THE_CENTER_BUTTON_SAVE_TEXT.translated}</Button> : <div></div>}
            </Row>

          </Col>
          <Col span={12} style={{ padding: 10 }}>
            <Row>
              <Col span={8}>
                <Content className='margin-bottom-small'>{this.props.languageState.PROFILE_COMPANY_LOGO_SECTION_TITLE.translated}</Content>
                <Avatar
                  disableInput={this.props.disableInput}
                  _id={this.props.tenantInfo._id}
                  profileState={this.props.profileState}
                  changeFile={this.changeFile}
                  companyLogoSrc={this.props.tenantInfo.companyLogoSrc}
                  languageState={this.props.languageState}
                />
              </Col>
              {this.props.isSysAdmin ?
                <Col span={16}>
                  <Content className='margin-bottom-small'>{this.props.languageState.PROFILE_PARTNER_DOCUMENTS_SECTION_TITLE.translated}</Content>
                  {
                    this.props.tenantInfo.fileLists && this.props.tenantInfo.fileLists.length ?
                      <div>
                        {
                          this.props.tenantInfo.fileLists.map(val => {
                            return <a href={`${config.nextjs.apiUrl}/tenants/download-file?tenant=${this.props.tenantInfo._id}&fileId=${val._id}`}>{val.fileName}</a>
                          })
                        }
                      </div>
                      : <p>{this.props.languageState.PROFILE_NO_PARTNER_DOCUMENTS_MESSAGE.translated}</p>
                  }
                </Col>
                : <div></div>
              }
            </Row>
            <Row className='margin-bottom-small'>
              <Form.Item label={this.props.languageState.PROFILE_COUNTRY_OF_REGISTRATION_FORM_LABEL.translated}>
              {
                getFieldDecorator('countryOfRegistration', {
                  rules: [
                    { required: true, message: this.props.languageState.PROFILE_COUNTRY_OF_REGISTRATION_REQUIRE_MESSAGE.translated },
                  ],
                  validateTrigger: 'onBlur',
                  initialValue: this.props.tenantInfo.companyProfile ? this.props.tenantInfo.companyProfile.countryOfRegistration : ""
                })(
                <AutoComplete
                  disabled={this.props.disableInput}
                  style={{ width: '100%' }}
                  dataSource={sortedDataCountry ? sortedDataCountry.map((item) => item.countryName) : []}
                  filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                  onChange={(value) => this.props.changeTenantInput({ companyProfile: { countryOfRegistration: value } })}
                />
              )}
              </Form.Item>
            </Row>

            {this.props.profileState.roles[0] === 'sysadmin'
              ? <Row>
                <Row className='margin-bottom-large'>
                  <InputGroup>
                    <Content className='margin-bottom-small'>{this.props.languageState.PROFILE_PARTNERSHIP_START_DATE_SECTION_TITLE.translated}</Content>
                    <Row>
                      <Col span={11}>
                        <Row>
                          <Col span={5}>
                            <Content className='align-horizontal-text'>From:</Content>
                          </Col>
                          <Col span={19}>
                            <Input
                              disabled={this.props.disableInput}
                              value={this.props.tenantInfo.companyProfile ? moment(this.props.tenantInfo.companyProfile.partnerShipStartDate).format('YYYY-MM-DD') : ""}
                              style={{ width: '100%' }}
                              type="date"
                              min="1900-01-01"
                              onChange={(e) => this.props.changeTenantInput({ companyProfile: { partnerShipStartDate: new Date(e.target.value as any) } })}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={1}></Col>
                      <Col span={12}>
                        <Row>
                          <Col span={3}>
                            <Content className='align-horizontal-text'>To:</Content>
                          </Col>
                          <Col span={21}>
                            <Input
                              disabled={this.props.disableInput}
                              value={this.props.tenantInfo.companyProfile && this.props.tenantInfo.companyProfile.partnerShipEndDate ? moment(this.props.tenantInfo.companyProfile.partnerShipEndDate).format('YYYY-MM-DD') : moment().add(1, 'year').format('YYYY-MM-DD')}
                              style={{ width: '100%' }}
                              type="date"
                              min="1900-01-01"
                              onChange={(e) => this.props.changeTenantInput({ companyProfile: { partnerShipEndDate: new Date(e.target.value as any) } })}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </InputGroup>
                </Row>
                <Row>
                  <InputGroup style={{ marginBottom: 10 }}>
                    <Content className='margin-bottom-small'>{this.props.languageState.PROFILE_SUBDOMAIN_ON_SKYACE_SECTION_TITLE.translated}</Content>
                    <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                    <Form.Item label={this.props.languageState.PROFILE_SUBDOMAIN_ON_SKYACE_FORM_LABEL.translated}>
                  {this.props.form.getFieldDecorator('domain', {
                    rules: [
                      { validator: this.checkDomainNameExist }
                    ],
                    validateTrigger: 'onBlur',
                    initialValue: this.props.tenantInfo.domain !== undefined ?
                    this.props.tenantInfo.domain : this.props.tenantInfo.companyProfile ? (this.props.tenantInfo.companyProfile.partnerCenterNameSameAsCompany
                      ? this.toUrl(this.props.tenantInfo.companyProfile.registeredCompanyName) :
                      (this.props.tenantInfo.companyProfile.partnerCenterName ?
                        this.toUrl(this.props.tenantInfo.companyProfile.partnerCenterName) : "")
                    ) : "",
                  })(
                    <Input
                      disabled={this.props.disableInput}
                      style={{ width: 'auto', display: 'inline-block', flex: 1 }}
                      addonBefore="https://"
                      addonAfter=".skyace-learning.com"
                      onChange={(e) => this.props.changeTenantInput({ domain: e.target.value })}
                    />
                  )}
                  {
                    this.props.domainExist ? this.props.domainExist === 'EXIST' ?
                      <Icon type="close" style={{ color: 'red', fontSize: '20px', marginLeft: '10px' }}></Icon>
                      : <Icon type="check" style={{ color: 'green', fontSize: '20px', marginLeft: '10px' }}></Icon>
                      : null
                  }
                  </Form.Item>
                    </div>
                    {
                      this.props.domainExist ? this.props.domainExist === 'EXIST' ?
                        <h4 style={{ color: 'red', marginLeft: '5px' }}>{this.props.languageState.PROFILE_SUBDOMAIN_ON_SKYACE_DUPLICATE_MESSAGE.translated}</h4>
                        : <h4 style={{ color: 'green', marginLeft: '5px' }}>{this.props.languageState.PROFILE_SUBDOMAIN_ON_SKYACE_AVAILABLE_MESSAGE.translated}</h4>
                        : null
                    }
                  </InputGroup>
                  {this.props.disableInput ? <div></div> :
                    <Row className='margin-bottom-small'>
                      <Col xs={24} lg={8} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button style={{ width: '80%', whiteSpace: 'normal', height: '100%' , minHeight: '42px' }} onClick={() => this.props.checkDomain({ domain: this.props.tenantInfo.domain, _id: this.props.tenantInfo._id })}>{this.props.languageState.PROFILE_SUBDOMAIN_ON_SKYACE_BUTTON_CHECK_AVAILABILITY.translated}</Button>
                      </Col>
                      <Col xs={24} lg={8} style={{ display: 'flex', justifyContent: 'center' }}>
                        {this.props.tenantInfo.isActive ?
                          <Popconfirm
                            title={this.props.languageState.PROFILE_HIDE_WEBSITE_COMFIRM_MESSAGE.translated}
                            okText={this.props.languageState.PROFILE_HIDE_WEBSITE_OK_TEXT.translated}
                            onConfirm={() => this.toggleWebsite(false)}
                          >
                            <Button style={{ width: '80%', color: 'red', whiteSpace: 'normal', height: '100%', minHeight: '42px' }}>{this.props.languageState.PROFILE_HIDE_WEBSITE_BUTTON_TEXT.translated}</Button>
                          </Popconfirm> :
                          <Button style={{ width: '80%', color: 'green', whiteSpace: 'normal', height: '100%', minHeight: '42px' }} onClick={() => this.toggleWebsite(true)}>{this.props.languageState.PROFILE_BUTTON_SHOW_WEBSITE_TEXT.translated}</Button>
                        }
                      </Col>
                      <Col xs={24} lg={8} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Popconfirm
                          title={this.props.languageState.PROFILE_TERMINATE_ACCOUNT_COMFIRM_MESSAGE.translated}
                          okText={this.props.languageState.PROFILE_TERMINATE_ACCOUNT_OK_TEXT.translated}
                          onConfirm={this.deactiveAccount}
                        >
                          <Button style={{ width: '80%', color: 'red', whiteSpace: 'normal', height: '100%', minHeight: '42px' }}>{this.props.languageState.PROFILE_TERMINATE_ACCOUNT_BUTTON_TEXT.translated}</Button>
                        </Popconfirm>
                      </Col>
                    </Row>
                  }
                </Row>
              </Row>
              : <div></div>}

          </Col>
        </Row>
      </Layout>
    );
  }
}

export default Form.create()(Profile);
