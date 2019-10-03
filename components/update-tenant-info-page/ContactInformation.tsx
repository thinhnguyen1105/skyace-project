import React from 'react';
import { Layout, Input, Col, Select, Checkbox, Button, Row, AutoComplete } from 'antd';
import { dataCountry } from '../../data_common/country';
import { dataCities } from '../../data_common/Cities';
const { Content } = Layout;
const InputGroup = Input.Group;
const Option = Select.Option;
import { dataPhone } from '../../data_common/CountryCodes';

class ContactInformation extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  filterRegion = (countries) => {
    if (countries && this.props.tenantInfo.contactInformation && this.props.tenantInfo.contactInformation.country) {
      var regions = countries.filter(val => val.countryName === this.props.tenantInfo.contactInformation.country);
      if (regions && regions.length) {
        return regions[0].regions.map((item) => item.name);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  filterRegionBilling = (countries) => {
    if (countries && this.props.tenantInfo.contactInformation && this.props.tenantInfo.contactInformation.billing && this.props.tenantInfo.contactInformation.billing.country) {
      var regions = countries.filter(val => val.countryName === this.props.tenantInfo.contactInformation.billing.country);
      if (regions && regions.length) {
        return regions[0].regions.map((item) => item.name);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  filterCity = (cities) => {
    if (cities && this.props.tenantInfo.contactInformation && this.props.tenantInfo.contactInformation.country) {
      var filterCity = cities.filter(val => val.country === this.props.tenantInfo.contactInformation.country);
      if (filterCity && filterCity.length) {
        return [filterCity[0].city];
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  filterCityBilling = (cities) => {
    if (cities && this.props.tenantInfo.contactInformation && this.props.tenantInfo.contactInformation.billing && this.props.tenantInfo.contactInformation.billing.country) {
      var filterCity = cities.filter(val => val.country === this.props.tenantInfo.contactInformation.billing.country);
      if (filterCity && filterCity.length) {
        return [filterCity[0].city];
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  update = () => {
    if (this.props.tenantInfo.contactInformation) {
      this.props.updateContract({
        _id: this.props.tenantInfo._id,
        country: this.props.tenantInfo.contactInformation.country,
        state: this.props.tenantInfo.contactInformation.state,
        city: this.props.tenantInfo.contactInformation.city,
        zipCode: this.props.tenantInfo.contactInformation.zipCode,
        contactNumber: {
          number: this.props.tenantInfo.contactInformation.contactNumber,
          phoneID: this.props.tenantInfo.contactInformation.phoneID,
        },
        email: this.props.tenantInfo.contactInformation.email,
        website: this.props.tenantInfo.contactInformation.website,
        address: this.props.tenantInfo.contactInformation.address,
        billing: this.props.tenantInfo.contactInformation.billing ? (
          this.props.tenantInfo.contactInformation.billing.sameAsMain ?
            {
              sameAsMain: true,
              country: this.props.tenantInfo.contactInformation.country,
              state: this.props.tenantInfo.contactInformation.state,
              city: this.props.tenantInfo.contactInformation.city,
              zipCode: this.props.tenantInfo.contactInformation.zipCode,
              address: this.props.tenantInfo.contactInformation.address
            } : this.props.tenantInfo.contactInformation.billing)
          : {},
        name: this.props.tenantInfo.contactInformation.name,
        gender: this.props.tenantInfo.contactInformation.gender ? this.props.tenantInfo.contactInformation.gender : 'Mr'
      })
    }
    else return;
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
    const sortedDataPhone = dataPhone.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    const selectBefore = (
      <Select disabled={this.props.disableInput} onChange={(value) => this.props.changeTenantInput({
        contactInformation: { gender: value }
      })} defaultValue={this.props.tenantInfo.contactInformation && this.props.tenantInfo.contactInformation.gender ? this.props.tenantInfo.contactInformation.gender : 'Mr'} style={{ width: 90 }}>
        <Option value="Dr">Dr</Option>
        <Option value="Mr">Mr</Option>
        <Option value="Miss">Miss</Option>
      </Select>
    );
    const dataSourcePhoneID = sortedDataPhone.map((country) => {
      return {
        value: country.dial_code,
        text: country.name + ' ' + '(' + country.dial_code + ')'
      };
    });
    const phoneIdSelector = () => {
      return (
        <AutoComplete
          value={this.props.tenantInfo.contactInformation ? this.props.tenantInfo.contactInformation.phoneID : this.props.tenantInfo.adminPhoneID}
          dataSource={dataSourcePhoneID}
          placeholder="Country Code"
          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          onChange={value => this.props.changeTenantInput({ contactInformation: { phoneID: value } })}
          style={{ width: 200, height: 30 }}
        />
      );
    };

    const label = this.props.languageState.UPDATE_TENANT_CONTACT_INFO_SAME_ADDRESS_LABEL.translated;
    return (
      <Layout style={{ background: '#ffffff' }}>
        <Row className='margin-bottom-large' style={{ padding: '20px 10px 0px 10px' }}>
          <Content style={{ fontWeight: "bold", fontSize: 20 }}>
            {this.props.languageState.UPDATE_TENANT_CONTACT_INFO_CTI.translated}
          </Content>
        </Row>
        <Row>
          <Col span={12} style={{ padding: 10 }}>
            <Row className='margin-bottom-small'>
              <Content className='margin-bottom-small'>
              {this.props.languageState.UPDATE_TENANT_CONTACT_INFO_MAIN_CONTACT.translated}
              </Content>
              <Input
                placeholder='E.g.John Smith'
                disabled={this.props.disableInput}
                addonBefore={selectBefore}
                value={this.props.tenantInfo.contactInformation ? this.props.tenantInfo.contactInformation.name ? this.props.tenantInfo.contactInformation.name : ((this.props.tenantInfo.adminFirstName && this.props.tenantInfo.adminLastName) ? `${this.props.tenantInfo.adminFirstName} ${this.props.tenantInfo.adminLastName}` : '') : ''}
                onChange={
                  (e) => this.props.changeTenantInput({
                    contactInformation: {
                      name: e.target.value
                    }
                  })
                }
              />
            </Row>
            <Row style={{ marginBottom: 50 }}>
              <Content className='margin-bottom-small'>
                {this.props.languageState.UPDATE_TENANT_CONTACT_INFO_MAIN_WEBSITE.translated}<span style={{ color: 'red' }}>*</span>
              </Content>
              <Input
                disabled={this.props.disableInput}
                value={this.props.tenantInfo.contactInformation ? this.props.tenantInfo.contactInformation.website : ""}
                placeholder="E.g.example.com"
                onChange={
                  (event) => this.props.changeTenantInput(
                    {
                      contactInformation: {
                        website: (event.target as any).value
                      }
                    })
                }
              />
            </Row>
            <Row className='margin-bottom-small'>
              <Content className='margin-bottom-small'>
              {this.props.languageState.UPDATE_TENANT_CONTACT_INFO_MAIN_ADDRESS.translated}<span style={{ color: 'red' }}>*</span>
              </Content>
              <Input
                disabled={this.props.disableInput}
                value={this.props.tenantInfo.contactInformation ? this.props.tenantInfo.contactInformation.address : ""}
                placeholder={this.props.languageState.UPDATE_TENANT_CONTACT_INFO_MAIN_ADDRESS_PLACEHOLDER.translated}
                onChange={
                  (event) => this.props.changeTenantInput(
                    {
                      contactInformation: {
                        address: (event.target as any).value
                      }
                    })
                }
              />
            </Row>
            <Row>
              <InputGroup style={{ marginBottom: 10 }}>
                <InputGroup>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Content className='margin-bottom-small'>{this.props.languageState.UPDATE_TENANT_CONTACT_INFO_CITY.translated}<span style={{ color: 'red' }}>*</span></Content>
                      <div style={{ marginBottom: 10 }}>
                        <AutoComplete
                          disabled={this.props.disableInput}
                          placeholder="Please select"
                          style={{ width: '100%' }}
                          value={this.props.tenantInfo.contactInformation ? this.props.tenantInfo.contactInformation.city : ""}
                          dataSource={this.filterCity(dataCities)}
                          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                          onChange={(value) => this.props.changeTenantInput({ contactInformation: { city: value } })}
                        />
                      </div>
                    </Col>

                    <Col span={12}>
                      <Content className='margin-bottom-small'>{this.props.languageState.UPDATE_TENANT_CONTACT_INFO_STATE.translated}</Content>
                      <div style={{ marginBottom: 10 }}>
                        <AutoComplete
                          disabled={this.props.disableInput}
                          placeholder="Please select"
                          style={{ width: '100%' }}
                          value={this.props.tenantInfo.contactInformation ? this.props.tenantInfo.contactInformation.state : ""}
                          dataSource={this.filterRegion(sortedDataCountry)}
                          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                          onChange={(value) => this.props.changeTenantInput({ contactInformation: { state: value } })}
                        />
                      </div>
                    </Col>
                  </Row>
                </InputGroup>
                <InputGroup>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Content className='margin-bottom-small'>{this.props.languageState.UPDATE_TENANT_CONTACT_INFO_COUNTRY.translated}<span style={{ color: 'red' }}>*</span></Content>
                      <div style={{ marginBottom: 10 }}>
                        <AutoComplete
                          placeholder='Please select'
                          disabled={this.props.disableInput}
                          style={{ width: '100%' }}
                          value={this.props.tenantInfo.contactInformation ? this.props.tenantInfo.contactInformation.country : ""}
                          dataSource={sortedDataCountry ? sortedDataCountry.map((item) => item.countryName) : []}
                          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                          onChange={(value) => this.props.changeTenantInput({ contactInformation: { country: value } })}
                        />
                      </div>
                    </Col>
                    <Col span={12}>
                      <Content className='margin-bottom-small'>{this.props.languageState.UPDATE_TENANT_CONTACT_INFO_ZIP.translated}</Content>
                      <div style={{ marginBottom: 10 }}>
                        <Input
                          placeholder='E.g. 123456'
                          disabled={this.props.disableInput}
                          value={this.props.tenantInfo.contactInformation ? this.props.tenantInfo.contactInformation.zipCode : ""}
                          onChange={(event) => this.props.changeTenantInput(
                            {
                              contactInformation: {
                                zipCode: (event.target as any).value
                              }
                            })
                          }
                        />
                      </div>
                    </Col>
                  </Row>
                  {this.props.disableInput ? <div></div> :
                    <Button
                      type="primary"
                      onClick={this.update}
                    >
                      {this.props.languageState.UPDATE_TENANT_CONTACT_INFO_SAVE.translated}</Button>}
                </InputGroup>

              </InputGroup>
            </Row>
          </Col>
          <Col span={12} style={{ padding: 10 }}>
            <Row className='margin-bottom-small'>
              <Content className='margin-bottom-small'>
                {this.props.languageState.UPDATE_TENANT_CONTACT_INFO_MAIN_CONTACT_NUMBER.translated}
              </Content>
              <Input
                addonBefore={phoneIdSelector()}
                disabled={this.props.disableInput}
                value={this.props.tenantInfo.contactInformation ? this.props.tenantInfo.contactInformation.contactNumber : this.props.tenantInfo.adminPhoneNumber}
                placeholder="E.g. 8123 4567"
                onChange={(event) => this.props.changeTenantInput({ contactInformation: { contactNumber: (event.target as any).value } })}
              />
            </Row>
            <Row style={{ marginBottom: 50 }}>
              <Content className='margin-bottom-small'>
              {this.props.languageState.UPDATE_TENANT_CONTACT_INFO_MAIN_EMAIL.translated}
              </Content>
              <Input
                disabled={this.props.disableInput}
                value={this.props.tenantInfo.contactInformation ? this.props.tenantInfo.contactInformation.email ? this.props.tenantInfo.contactInformation.email : this.props.tenantInfo.adminEmail : this.props.tenantInfo.adminEmail}
                placeholder="E.g. yourname@email.com"
                onChange={
                  (event) => this.props.changeTenantInput(
                    {
                      contactInformation: {
                        email: (event.target as any).value
                      }
                    })
                }
              />
            </Row>
            <Row className='margin-bottom-small'>
              <Row className='margin-bottom-small'>
                <Col span={12}>
                  <Content>
                    {this.props.languageState.UPDATE_TENANT_CONTACT_INFO_BILLING_ADDR.translated}<span style={{ color: 'red' }}>*</span>
                  </Content>
                </Col>
                <Col span={12}>
                  <Checkbox
                    disabled={this.props.disableInput}
                    checked={this.props.tenantInfo.contactInformation && this.props.tenantInfo.contactInformation.billing ? this.props.tenantInfo.contactInformation.billing.sameAsMain : false}
                    onChange={() => this.props.changeTenantInput({
                      contactInformation: {
                        billing: {
                          sameAsMain: this.props.tenantInfo.contactInformation && this.props.tenantInfo.contactInformation.billing ? !this.props.tenantInfo.contactInformation.billing.sameAsMain : true
                        }
                      }
                    })}
                  >
                    {label}
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                {this.props.tenantInfo.contactInformation && this.props.tenantInfo.contactInformation.billing && this.props.tenantInfo.contactInformation.billing.sameAsMain ? null :
                  <Input
                    disabled={this.props.disableInput}
                    placeholder={this.props.languageState.UPDATE_TENANT_CONTACT_INFO_BILLING_ADDR_PL.translated}
                    value={this.props.tenantInfo.contactInformation && this.props.tenantInfo.contactInformation.billing ? this.props.tenantInfo.contactInformation.billing.address : ""}
                    onChange={(e) => this.props.changeTenantInput({
                      contactInformation: {
                        billing: {
                          address: e.target.value
                        }
                      }
                    })}
                  />
                }
              </Row>
            </Row>
            {/* <Row >
              <InputGroup style={{ marginBottom: 10 }}>
                <InputGroup>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Content className='margin-bottom-small'>City<span style={{ color: 'red' }}>*</span></Content>
                      <div style={{ marginBottom: 10 }}>
                        <AutoComplete
                          disabled={this.props.disableInput}
                          placeholder="Please select"
                          style={{ width: '100%' }}
                          value={this.props.tenantInfo.contactInformation ? this.props.tenantInfo.contactInformation.city : ""}
                          dataSource={this.filterCity(dataCities)}
                          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                          onChange={(value) => this.props.changeTenantInput({ contactInformation: { city: value } })}
                        />
                      </div>
                    </Col>

                    <Col span={12}>
                      <Content className='margin-bottom-small'>State/Province</Content>
                      <div style={{ marginBottom: 10 }}>
                        <AutoComplete
                          disabled={this.props.disableInput}
                          placeholder="Please select"
                          style={{ width: '100%' }}
                          value={this.props.tenantInfo.contactInformation ? this.props.tenantInfo.contactInformation.state : ""}
                          dataSource={this.filterRegion(sortedDataCountry)}
                          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                          onChange={(value) => this.props.changeTenantInput({ contactInformation: { state: value } })}
                        />
                      </div>
                    </Col>
                  </Row>
                </InputGroup>
                <InputGroup>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Content className='margin-bottom-small'>Country<span style={{ color: 'red' }}>*</span></Content>
                      <div style={{ marginBottom: 10 }}>
                        <AutoComplete
                          placeholder='Please select'
                          disabled={this.props.disableInput}
                          style={{ width: '100%' }}
                          value={this.props.tenantInfo.contactInformation ? this.props.tenantInfo.contactInformation.country : ""}
                          dataSource={sortedDataCountry ? sortedDataCountry.map((item) => item.countryName) : []}
                          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                          onChange={(value) => this.props.changeTenantInput({ contactInformation: { country: value } })}
                        />
                      </div>
                    </Col>
                    <Col span={12}>
                      <Content className='margin-bottom-small'>ZIP/ Postal Code</Content>
                      <div style={{ marginBottom: 10 }}>
                        <Input
                          placeholder='E.g. 123456'
                          disabled={this.props.disableInput}
                          value={this.props.tenantInfo.contactInformation ? this.props.tenantInfo.contactInformation.zipCode : ""}
                          onChange={(event) => this.props.changeTenantInput(
                            {
                              contactInformation: {
                                zipCode: (event.target as any).value
                              }
                            })
                          }
                        />
                      </div>
                    </Col>
                  </Row>
                </InputGroup>

              </InputGroup>
            </Row> */}
          </Col>
        </Row>
      </Layout>
    );
  }
}
export default ContactInformation;
