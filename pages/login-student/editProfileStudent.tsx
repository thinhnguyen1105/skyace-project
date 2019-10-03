import React from 'react';
import { Layout, Upload, message, Button, Icon, Row, Col, Form, Input, Modal, Select, AutoComplete } from 'antd';
import './editProfileStudent.css';
import withRematch from '../../rematch/withRematch';
import initStore from '../../rematch/store';
import { timeZone } from '../../data_common/timezone';
import config from '../../api/config';
import moment from 'moment';
import { dataPhone } from '../../data_common/CountryCodes';
import { dataCountry } from '../../data_common/country';
import { getUsersService, getCurrencyService } from '../../service-proxies';
import bcrypt from 'bcryptjs';
import UserLayout from '../../layout/UserLayout';
import dynamic from "next/dynamic";
const AvatarEditor: any = dynamic(import("react-avatar-editor"));

const FormItem = Form.Item;
const Option = Select.Option;

// const CONFIG = {
//   STUDENT_MIN_AGE: 5
// }

interface Indexstate {
  imageUrl: string;
  loading: boolean;
}

class EditProfile extends React.Component<any, Indexstate> {
  static async getInitialProps(props: any) {
    const profileState = props.store.getState().profileModel;
    const usersService = getUsersService();
    let result: any = await usersService.findStudentById(
      profileState._id
    );
    const currencyService = getCurrencyService();
    const currencies = await currencyService.getAllCurrencies();
    props.store.dispatch.editProfilePageModel.fetchCurrenciesSuccess(currencies);

    if (!result.currency || !result.currentlyBasedIn || !result.timeZone) {
      const ip: any = await usersService.getIP();
      const geolocation: any = await usersService.getUserGeolocation(ip.ip);
      let filterCurrency = currencies.results.filter((val) => val.code.toUpperCase() === geolocation.currency.code.toUpperCase());
      let updatedData = {
        _id: result._id,
      } as any;

      let updateCurrency = result.currency ? result.currency._id : (filterCurrency.length ? filterCurrency[0]._id : "");
      if (updateCurrency) {
        updatedData.currency = updateCurrency;
      }

      let currentlyBasedIn = result.currentlyBasedIn || geolocation.country_name;
      if (currentlyBasedIn) {
        updatedData.currentlyBasedIn = currentlyBasedIn;
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

      let timeZone = result.timeZone || (geolocation.time_zone ? {
        name: geolocation.time_zone.name,
        offset: geolocation.time_zone.offset,
        gmt: `(GMT${toGMTString(geolocation.time_zone.offset)})`
      } : null);
      if (timeZone) {
        updatedData.timeZone = timeZone;
      }

      await usersService.update(updatedData as any)
      result = { ...result, ...updatedData, currency: filterCurrency.length ? filterCurrency[0] : {} };
    }

    //change phoneID 
    const findDataPhone = dataPhone.filter((item) => {
      if (item.dial_code === result.phone.phoneID) {
        return item;
      }
    })
    if (findDataPhone.length) {
      // result.phone.phoneID = findDataPhone[0].name + ' ' + '(' + findDataPhone[0].dial_code + ')';
      result.phone.phoneID = findDataPhone[0].dial_code;
      props.store.dispatch.editProfilePageModel.fetchDataSuccess({ result });
    } else {
      // result.phone.phoneID = 'Afghanistan' + ' ' + '(' + '+93' + ')';
      result.phone.phoneID = '+93';
      props.store.dispatch.editProfilePageModel.fetchDataSuccess({ result });
    }
  }
  checkPhoneID = () => {
    const result = dataPhone.filter((country) => {
      if (country.dial_code === this.props.phoneID) {
        return country.dial_code
      }
    });
    if (result.length !== 0) {

    } else {
      message.error(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_ERROR_PHONE_ID.translated, 4);
    }
    this.props.userInfoChange({ phoneIDSave: result[0].dial_code });
  }

  onSaveProfileSubmit = async (e) => {
    e.preventDefault();
    await this.checkPhoneID();
    if (this.props.fileList[0] === undefined) {
      this.props.form.validateFieldsAndScroll((err) => {
        if (!err) {
          this.props.updateUser({
            userInfo: {
              _id: this.props.profileState._id,
              firstName: this.props.firstName,
              lastName: this.props.lastName,
              timeZone: this.props.timeZone,
              currency: this.props.currencyInput ? this.props.currencyInput : this.props.currency._id,
              phone: {
                phoneNumber: this.props.phoneNumber,
                phoneID: this.props.phoneIDSave
              },
              dob: this.props.dob,
              imageUrl: this.props.imageUrl,
              gender: this.props.gender,
              nationality: this.props.nationality,
              currentAcademicLevel: this.props.currentAcademicLevel,
              nationalID: this.props.nationalID,
              currentlyBasedIn: this.props.currentlyBasedIn,
            }
          });
        } else {
          message.error(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_SOMETHING_WENT_WRONG.translated, 4);
        }
      });
    } else {
      await this.props.onSaveImageUrl({
        imageUrl: `/static/images/users/image-${this.props.profileState._id}.${this.props.fileList[0].type.slice(6, 10)}`
      });
      let formData = new FormData();
      this.props.fileList.forEach((file) => {
        formData.set('image', file);
      });
      await fetch(
        `${config.nextjs.apiUrl}/images/upload/users/${this.props.profileState._id}`, {
          method: 'POST',
          headers: {
            'authorization': this.props.profileState.token,
          },
          body: formData,
        }
      );
      this.props.form.validateFieldsAndScroll((err) => {
        if (!err) {
          this.props.updateUser({
            userInfo: {
              _id: this.props.profileState._id,
              firstName: this.props.firstName,
              lastName: this.props.lastName,
              timeZone: this.props.timeZone,
              currency: this.props.currencyInput ? this.props.currencyInput : this.props.currency._id,
              phone: {
                phoneNumber: this.props.phoneNumber,
                phoneID: this.props.phoneID
              },
              dob: this.props.dob,
              imageUrl: this.props.imageUrl,
              gender: this.props.gender,
              nationality: this.props.nationality,
              currentAcademicLevel: this.props.currentAcademicLevel,
              nationalID: this.props.nationalID,
              currentlyBasedIn: this.props.currentlyBasedIn
            }
          });
        } else {
          message.error(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_SOMETHING_WENT_WRONG.translated, 4);
        }
      });
    }
  }
  onSavePasswordSubmit = async (e) => {
    e.preventDefault();
    const hashPassword = await bcrypt.hash(this.props.password, this.props.password.length);
    this.props.form.validateFields((err, _values) => {
      if (!err) {
        this.props.updateUser({
          userInfo: {
            _id: this.props.profileState._id,
            password: hashPassword
          }
        });
        this.props.closeChangePasswordModal();
      } else {
        message.error(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_SOMETHING_WENT_WRONG.translated, 4);
      }
    });
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  onChangeTimeZone = (input: string) => {
    const timeZoneArray = timeZone.filter((val) => val.name === input);
    const timeZoneFiltered = timeZoneArray.length ? timeZoneArray[0] : null;
    if (timeZoneFiltered) {
      this.props.userInfoChange({
        timeZone: {
          name: timeZoneFiltered.name,
          gmt: timeZoneFiltered.gmt,
          offset: timeZoneFiltered.offset
        }
      })
    }
  }

  validateTutorDoB = (_rule, value, callback) => {
    if (value) {
      var dateObj = new Date(value);
      if (dateObj instanceof Date && !isNaN(dateObj as any)) {
        if (moment(dateObj).year() < 1900) {
          callback(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_VALIDATE_DOB_1.translated);
        }
        callback();
        // else {
        //   var age = this.calculateAge(new Date(value));
        //   if (age < CONFIG.STUDENT_MIN_AGE) {
        //     callback('Student has to be at least ' + CONFIG.STUDENT_MIN_AGE + ' years old');
        //   } else {
        //     callback();
        //   }
        // }
      } else {
        callback(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_VALIDATE_DOB_4.translated);
      }
    } else {
      callback(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_VALIDATE_DOB_5.translated);
    }
  }

  calculateAge = (birthday) => {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return ageDate.getUTCFullYear() - 1970;
  }

  validateDate = (str) => {
    if (str) {
      var date = new Date(str);
      if (date instanceof Date && !isNaN(date as any)) {
        return str;
      } else {
        return false;
      }
    } else return false;
  }
  splicePhoneId = (value) => {
    this.props.userInfoChange({ phoneID: value });
  }

  changeBirthday = (input) => {
    if (input) {
      this.props.form.setFieldsValue({ 'dayofbirth': moment(input).format('DD MMM YYYY') })
      this.props.form.validateFields(['dayofbirth'], (err, _val) => {
        if (err) {
          console.log(err);
        }
      });
      this.props.userInfoChange({ dob: new Date(input as any) })
    }
  }

  fullPhoneId = () => {
    const currentPhoneID = this.props.phoneID;
    let findDataPhone = dataPhone.filter((item) => {
      if (item.dial_code === currentPhoneID) {
        return item
      }
    })
    const result = findDataPhone[0].name + ' ' + '(' + findDataPhone[0].dial_code + ')';
    return result;
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 24,
          offset: 8,
        },
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
    const sortedDataCountry = dataCountry.sort((a, b) => {
      if (a.countryName < b.countryName) {
        return -1;
      }
      if (a.countryName > b.countryName) {
        return 1;
      }
      return 0;
    });
    const sortDataNationality = this.props.dataLookupState.findaTutor.nationality.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    const sortedDataTimeZone = timeZone.concat({
      gmt: this.props.timeZone.gmt,
      name: this.props.timeZone.name,
      offset: this.props.timeZone.offset
    } as any).sort((a, b) => {
      if (a.gmt < b.gmt) {
        return -1;
      }
      if (a.gmt > b.gmt) {
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
          value={this.props.phoneID}
          dataSource={dataSourcePhoneID}
          placeholder="Country Code"
          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          onChange={value => this.props.userInfoChange({ phoneID: value })}
          style={{ width: 200, height: 30 }}
        />
      );
    };
    return (
      <UserLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} editProfilePageState={this.props} languageState={this.props.languageState}>
        <Layout style={{ background: 'white', padding: '0px 30px 20px 30px' }}>
          <Row className='edit-base-profile'>
            <Row>
              <Layout className='white-theme'>
                <h1 className='text-responsive-bold' >{this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_PROFILE.translated}</h1>

                <AvatarEditor
                  image={this.props.fileList.length === 0 ? this.props.imageUrl : this.props.imageTemporary}
                  width={200}
                  height={200}
                  border={20}
                  scale={this.props.avatarZoomValue}
                  rotate={this.props.avatarRotateValue}
                  borderRadius={100}
                />
                <Upload

                  beforeUpload={(file) => {
                    this.props.onChangeFileList({ file });
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(file.name)) {
                      message.error(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_UPLOAD_VALIDATE_1.translated, 4);
                    } else if (!isLt2M) {
                      message.error(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_UPLOAD_VALIDATE_2.translated, 4);
                    } else {
                      this.getBase64(file, imageUrl =>
                        this.props.handleBeforeUpload({ imageUrlBased64: imageUrl })
                      );
                    }
                    return false;
                  }}
                  showUploadList={false}
                >
                  <Button style={{ marginTop: 30 }}>
                    <Icon type='upload' /> {this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_CLICK_TO_UPLOAD.translated}
                    </Button>
                </Upload>
              </Layout>
            </Row>
            <Row>
              <Layout className='white-theme margin-responsive' style={{ marginTop: 50 }}>
                <Form>
                  <Col span={11}>
                    <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_GIVEN_NAME.translated}>
                      {getFieldDecorator('firstName', {
                        rules: [
                          { required: true, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_GIVEN_NAME_VALIDATE_1.translated, whitespace: true },
                          { pattern: /.{2,15}/, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_GIVEN_NAME_VALIDATE_2.translated }
                        ],
                        initialValue: this.props.firstName,
                        validateTrigger: 'onBlur',
                        validateFirst: true,
                      })(
                        <Input
                          name='firstName'
                          placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_GIVEN_NAME.translated}
                          onChange={(e) => this.props.userInfoChange({ firstName: e.target.value })}
                        />
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_EMAIL_ADDRESS.translated}>
                      {getFieldDecorator('emailAddress', {
                        rules: [
                          { required: true, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_EMAIL_ADDRESS_VALIDATE.translated, whitespace: true }
                        ],
                        initialValue: this.props.email,
                        validateTrigger: 'onBlur',
                        validateFirst: true,
                      })(
                        <Input
                          name='emailAddress'
                          placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_EMAIL_ADDRESS.translated}
                          disabled={true}
                        />
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_GENDER.translated}>
                      {getFieldDecorator('gender', {
                        initialValue: this.props.gender,
                      })(
                        <Select
                          placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_GENDER_PLACEHOLDER.translated}
                          onChange={(value) => this.props.userInfoChange({ gender: value })}
                        >
                          <Option key='male' value='male'>{this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_GENDER_MALE.translated}</Option>
                          <Option key='female' value='female'>{this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_GENDER_FEMALE.translated}</Option>
                        </Select>
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_NATIONALITY.translated}>
                      {getFieldDecorator('nationality', {
                        initialValue: this.props.nationality,
                      })(
                        <Select
                          placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_NATIONALITY_PLACEHOLDER.translated}
                          onChange={(value) => this.props.userInfoChange({ nationality: value })}
                        >
                          {
                            sortDataNationality ? sortDataNationality.map((item) => (<Option value={item.name} key={item.code}>{item.name}</Option>)) : ''
                          }
                        </Select>
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_PASSPORT_NO.translated}>
                      {getFieldDecorator('nationalID', {
                        initialValue: this.props.nationalID,
                      })(
                        <Input
                          placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_PASSPORT_NO_PLACEHOLDER.translated}
                          onChange={(e) => this.props.userInfoChange({ nationalID: e.target.value })}
                        />
                      )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_CURRENCY.translated}
                    >
                      {getFieldDecorator('curency', {
                        initialValue: this.props.currency._id,
                        rules: [
                          { required: true, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_CURRENCY_VALIDATE.translated, whitespace: true }
                        ],
                      })(
                        <Select
                          placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_CURRENCY_PLACEHOLDER.translated}
                          onChange={(value) => this.props.onChangeCurrency(value.toString())}
                        >
                          {
                            this.props.currencies ? this.props.currencies.map((item) => (<Option value={item._id} key={item._id}>{`${item.name} (${item.code})`}</Option>)) : ''
                          }
                        </Select>
                      )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                      <Button
                        loading={this.props.isBusy}
                        onClick={this.onSaveProfileSubmit}
                        type="primary"
                        htmlType="submit"
                        style={{ marginRight: 10, minWidth: '120px', textAlign: 'center' }}
                      >
                        {this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_SAVE.translated}
                      </Button>
                      {/* <Button type="primary"
                        onClick={() => {
                          this.props.openPasswordModal();
                          this.props.form.resetFields();
                        }}
                      >
                        Change Password
                      </Button> */}
                    </FormItem>

                    <Modal title={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_CHANGE_PASSWORD_MODAL.translated}
                      okText='Save'
                      cancelText='Cancel'
                      onOk={this.onSavePasswordSubmit}
                      onCancel={() => {
                        this.props.closeChangePasswordModal();
                        this.props.form.resetFields();
                      }}
                      visible={this.props.showChangePasswordModal}
                    >
                      <Form>
                        <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_NEW_PASSWORD.translated}>
                          {getFieldDecorator('password', {
                            rules: [
                              { pattern: config.usersModuleConfig.passwordRegex, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_NEW_PASSWORD_VALIDATE.translated },
                            ],
                            validateTrigger: "onBlur",
                            validateFirst: true
                          })(
                            <Input
                              type="password"
                              onChange={(e) => this.props.userInfoChange({ password: e.target.value })}
                            />
                          )}
                        </FormItem>
                        <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_CONFIRM_PASSWORD.translated}>
                          {getFieldDecorator('confirm', {
                            rules: [
                              {
                                validator: (_rule, value, callback) => {
                                  if (value !== this.props.password) {
                                    callback(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_CONFIRM_PASSWORD_VALIDATE.translated);
                                  }
                                  callback();
                                }
                              }
                            ],
                            validateTrigger: "onBlur",
                            validateFirst: true
                          })(
                            <Input type="password" />
                          )}
                        </FormItem>
                      </Form>
                    </Modal>
                  </Col>
                  <Col span={11} offset={2} className="date-input-container">
                    <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_LAST_NAME.translated}>
                      {getFieldDecorator('lastname', {
                        rules: [
                          { required: true, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_LAST_NAME_VALIDATE_1.translated, whitespace: true },
                          { pattern: /.{2,15}/, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_LAST_NAME_VALIDATE_2.translated }
                        ],
                        initialValue: this.props.lastName,
                        validateTrigger: 'onBlur',
                        validateFirst: true,
                      })(
                        <Input
                          name='lastName'
                          placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_LAST_NAME.translated}
                          onChange={(e) => this.props.userInfoChange({ lastName: e.target.value })}
                        />
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_MOBILE_NUMBER.translated}>
                      {getFieldDecorator('phone', {
                        rules: [
                          { required: true, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_MOBILE_NUMBER_VALIDATE_1.translated },
                          { pattern: /^\d{4,15}$/, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_MOBILE_NUMBER_VALIDATE_2.translated },
                          {
                            validator: (_rule, _value, callback) => {
                              if (!this.props.phoneID) {
                                callback(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_MOBILE_NUMBER_VALIDATE_3.translated);
                              }
                              callback();
                            }
                          }
                        ],
                        validateTrigger: 'onBlur',
                        validateFirst: true,
                        initialValue: this.props.phoneNumber,
                      })(
                        <Input
                          addonBefore={phoneIdSelector()}
                          style={{ width: '100%' }}
                          name='phoneNumber'
                          placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_MOBILE_NUMBER.translated}
                          onChange={(e) => this.props.userInfoChange({ phoneNumber: e.target.value })} />
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_DOB.translated}>
                      {getFieldDecorator('dayofbirth', {
                        rules: [
                          { validator: this.validateTutorDoB }
                        ],
                        validateTrigger: ['onBlur', 'onChange'],
                        initialValue: this.props.dob ? moment(this.props.dob).format('YYYY-MM-DD') : null,
                      })(
                        <Input
                          style={{ width: '100%' }}
                          type="date"
                          min="1900-01-01"
                          max={moment().format('YYYY-MM-DD')}
                          onChange={(e) => this.props.userInfoChange({ dob: new Date(e.target.value as any) })}
                        />
                      )}
                      {/* <div className="custom-antd-date-picker">
                        <DatePicker
                          value={this.props.dob ? moment(this.validateDate(this.props.dob)) : moment()}
                          style={{ position: 'absolute', right: '0px', bottom: '14px' }}
                          format="DD MMM YYYY"
                          allowClear={false}
                          showToday={false}
                          placeholder='Date Of Birth'
                          onChange={(value) => this.changeBirthday(value)}
                        />
                      </div> */}
                    </FormItem>
                    {/* <FormItem {...formItemLayout} label='Current Academic Level'>
                      {getFieldDecorator('currentAcademicLevel', {
                        rules: [
                        ],
                        validateTrigger: 'onBlur',
                        initialValue: this.props.currentAcademicLevel,
                      })(
                        <Select
                          placeholder='Please input your academic level '
                          onChange={(value) => this.props.userInfoChange({ currentAcademicLevel: value })}
                        >
                          {
                            this.props.dataLookupState.course.level ? this.props.dataLookupState.course.level.map((item) => (<Option value={item.value} key={item._id}>{item.content}</Option>)) : ''
                          }
                        </Select>
                      )}
                    </FormItem> */}
                    <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_BASED_IN.translated}>
                      {getFieldDecorator('basedIn', {
                        initialValue: this.props.currentlyBasedIn,
                      })(
                        <Select
                          placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_BASED_IN_PLACEHOLDER.translated}
                          onChange={(value) => this.props.userInfoChange({ currentlyBasedIn: value })}
                        >
                          {
                            sortedDataCountry ? sortedDataCountry.map((item) => (<Option value={item.countryName} key={item.countryShortCode}>{item.countryName}</Option>)) : ''
                          }
                        </Select>
                      )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_TIME_ZONE.translated}
                    >
                      {getFieldDecorator('timeZone', {
                        initialValue: this.props.timeZone.name,
                        rules: [
                          { required: true, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_TIME_ZONE_VALIDATE.translated, whitespace: true },
                        ],
                      })(
                        <Select
                          placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_TIME_ZONE.translated}
                          onChange={(value) => this.onChangeTimeZone(value.toString())}
                        >
                          {
                            sortedDataTimeZone ? sortedDataTimeZone.map((item) => (<Option value={item.name} key={item.name}>{item.gmt} {item.name}</Option>)) : ''
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Form>
              </Layout>
            </Row>
          </Row>
        </Layout>
      </UserLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.editProfilePageModel,
    profileState: rootState.profileModel,
    dataLookupState: rootState.dataLookupModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.editProfilePageModel,
    profileReducers: rootReducer.profileModel,
    dataLookup: rootReducer.dataLookupModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(Form.create()(EditProfile));
