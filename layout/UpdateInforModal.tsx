import * as React from "react";
import { Modal, Form, Input, Button, Row, Col, Radio, AutoComplete, message } from "antd";
import { dataPhone } from "../data_common/CountryCodes";
import { getUsersService } from "../service-proxies";

const sortedDataPhone = dataPhone.sort((a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
});

class UpdateInforModal extends React.Component<any, any> {
  async componentDidMount() {
    // Detect country code by IP address
    try {
      const usersService = getUsersService();
      const ip: any = await usersService.getIP();
      const geolocation: any = await usersService.getUserGeolocation(ip.ip);
      const countries = sortedDataPhone.filter((item) => item.code === geolocation.country_code2);

      this.props.profileReducers.profileInfoChange({
        phone: {
          phoneNumber: this.props.profileState.updateSocialInfo.phone.phoneNumber,
          phoneID: countries[0] ? countries[0].dial_code : '',
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  changePhoneID = () => {
    const result = dataPhone.filter((country) => {
      // const valueDataPhone = country.name + ' ' + '(' + country.dial_code + ')';
      if (country.dial_code === this.props.profileState.updateSocialInfo.phone.phoneID) {
        if (country.dial_code) {
          return country.dial_code
        }
      }
    });
    if (result.length !== 0) {

    } else {
      message.error(this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_PHONE_ID_REQUIRE_MESSAGE.translated, 4);
    }
    this.props.profileReducers.profileInfoChange({
      phoneSave: {
        phoneID: result[0].dial_code,
        phoneNumber: this.props.profileState.updateSocialInfo.phone.phoneNumber,
      }
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    await this.changePhoneID();
    this.props.form.validateFields((err, _values) => {
      if (!err) {
        this.props.profileReducers.updateSocialInfoEffect({
          _id: this.props.profileState._id,
          roles: this.props.profileState.updateSocialInfo.roles,
          firstName: this.props.profileState.updateSocialInfo.firstName,
          lastName: this.props.profileState.updateSocialInfo.lastName,
          email: this.props.profileState.updateSocialInfo.email,
          phone: this.props.profileState.updateSocialInfo.phoneSave,
          timeZone: {
            offset: new Date().getTimezoneOffset() / -60,
          },
        });
      }
    });
  }

  render() {
    const FormItem = Form.Item;
    const { getFieldDecorator } = this.props.form;
    const dataSourcePhoneID = sortedDataPhone.map((country) => {
      return {
        value: country.dial_code,
        text: country.name + ' ' + '(' + country.dial_code + ')'
      };
    });

    const phoneIdSelector = () => {
      return (
        <AutoComplete
          value={this.props.profileState.updateSocialInfo.phone ? this.props.profileState.updateSocialInfo.phone.phoneID : undefined}
          dataSource={dataSourcePhoneID}
          placeholder={this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_PHONE_ID_INPUT_PLACEHOLDER.translated}
          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          onChange={value => {
            this.props.profileReducers.profileInfoChange({
              phone: {
                phoneID: value,
                phoneNumber: this.props.profileState.updateSocialInfo.phone.phoneNumber,
              }
            });
            this.props.form.setFields({
              phoneNumber: {
                value: this.props.profileState.updateSocialInfo.phone.phoneNumber,
                errors: null
              },
            });
          }}
          style={{ width: 200, height: 30 }}
        />
      );
    };

    return (
      <Modal
        title={this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_COMPLETE_INFO_MODAL_TITLE.translated}
        visible={this.props.profileState.updateInforModalVisible}
        width={900}
        footer={null}
        closable={false}
      >
        <Form onSubmit={this.handleSubmit} className="update-form">
          <Row type='flex' gutter={24}>
            <Col span={24}>
              <FormItem style={{ marginBottom: "5px" }}>
                {getFieldDecorator('roles', {
                  rules: [{ required: true, message: this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_SELECT_PROFILE_REQUIRE_MESSAGE.translated }]
                })(
                  <Radio.Group
                    buttonStyle="solid"
                    style={{ width: "100%" }}
                    onChange={event => this.props.profileReducers.profileInfoChange({ roles: [event.target.value] })}
                  >
                    <Radio.Button
                      value="student"
                      style={{
                        display: "inline-block",
                        width: "50%",
                        textAlign: "center"
                      }}
                    >
                      {this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_SELECT_PROFILE_OPTION_STUDENT.translated}
                    </Radio.Button>
                    <Radio.Button
                      value="tutor"
                      style={{
                        display: "inline-block",
                        width: "50%",
                        textAlign: "center"
                      }}
                    >
                      {this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_SELECT_PROFILE_OPTION_TUTOR.translated}
                    </Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label={this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_FIRST_NAME_INPUT_LABEL.translated}>
                {getFieldDecorator("firstName", {
                  rules: [
                    { required: true, message: this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_FIRST_NAME_REQUIRE_MESSAGE.translated },
                    { pattern: /^(.){2,20}$/, message: this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_FIRST_NAME_PATTERN_MESSAGE.translated }
                  ],
                  initialValue: this.props.profileState.updateSocialInfo.firstName,
                  validateTrigger: 'onBlur',
                  validateFirst: true,
                })(
                  <Input
                    onChange={event => this.props.profileReducers.profileInfoChange({ firstName: (event.target as any).value })}
                    type="text&quot;"
                    placeholder={this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_FIRST_NAME_INPUT_PLACEHOLDER.translated}
                  />
                )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label={this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_LAST_NAME_INPUT_LABEL.translated}>
                {getFieldDecorator("lastName", {
                  rules: [
                    { required: true, message: this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_LAST_NAME_REQUIRE_MESSAGE.translated },
                    { pattern: /^(.){2,20}$/, message: this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_LAST_NAME_PATTERN_MESSAGE.translated }
                  ],
                  initialValue: this.props.profileState.updateSocialInfo.lastName,
                  validateTrigger: 'onBlur',
                  validateFirst: true,
                })(
                  <Input
                    onChange={event =>
                      this.props.profileReducers.profileInfoChange({
                        lastName: (event.target as any).value
                      })
                    }
                    type="text"
                    placeholder={this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_LAST_NAME_INPUT_LABEL.translated}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_EMAIL_INPUT_LABEL.translated}>
                {getFieldDecorator("email", {
                  rules: [
                    { required: true, message: this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_EMAIL_REQUIRE_MESSAGE.translated },
                  ],
                  initialValue: this.props.profileState.updateSocialInfo.email,
                  validateTrigger: 'onBlur',
                  validateFirst: true,
                })(
                  <Input
                    onChange={event =>
                      this.props.profileReducers.profileInfoChange({
                        email: (event.target as any).value
                      })
                    }
                    disabled={this.props.profileState.updateSocialInfo.email ? true : false}
                    type="email"
                    placeholder={this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_EMAIL_INPUT_PLACEHOLDER.translated}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_MOBILE_NUMBER_INPUT_LABEL.translated}>
                {getFieldDecorator("phoneNumber", {
                  rules: [
                    { required: true, message: this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_MOBILE_NUMBER_REQUIRE_MESSAGE.translated },
                    { pattern: /^([0-9]){4,15}$/, message: this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_MOBILE_NUMBER_PATTERN_MESSAGE.translated },
                    {
                      validator: (_rule, _value, callback) => {
                        if (!this.props.profileState.updateSocialInfo.phone.phoneID) {
                          callback(this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_COUNTRY_CODE_REQUIRE_MESSAGE.translated);
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
                    onChange={event => this.props.profileReducers.profileInfoChange({
                      phone: {
                        phoneID: this.props.profileState.updateSocialInfo.phone.phoneID,
                        phoneNumber: event.target.value,
                      }
                    })}
                    type="text"
                    placeholder={this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_MOBILE_NUMBER_INPUT_PLACEHOLDER.translated}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem>
                <div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                    loading={this.props.profileState.isBusy}
                  >
                    {this.props.languageState.UPDATE_INFORMATION_MODAL_PAGE_BUTTON_SAVE_TEXT.translated}
                  </Button>
                </div>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(UpdateInforModal);
