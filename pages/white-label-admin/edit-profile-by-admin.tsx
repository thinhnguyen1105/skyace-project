
import React from 'react';
import AppLayout from '../../layout/AdminLayout';
import initStore from '../../rematch/store';
import withRematch from '../../rematch/withRematch';
import './edit-profile-by-admin.css';
import config from '../../api/config';
import { dataPhone } from '../../data_common/CountryCodes';
import { message, Button, Icon, Upload, Row, Form, Col, Input, AutoComplete } from 'antd';
import dynamic from "next/dynamic";
import { getUsersService } from '../../service-proxies';
const AvatarEditor: any = dynamic(import("react-avatar-editor"));
const FormItem = Form.Item;

class EditProfileByAdmin extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    const usersService = getUsersService(props.store.getState().profileModel.token);
    const result = await usersService.findById(props.query.userId);

    props.store.dispatch.editProfilePageModel.userInfoChange({ roleUserForAdmin: props.query.roles });
    props.store.dispatch.editProfilePageModel.userInfoChange({ idUserChangeByAdmin: props.query.userId });
    props.store.dispatch.editProfilePageModel.fetchDataSuccess({ result });
  }
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  splicePhoneId = (value) => {
    this.props.userInfoChange({ phoneID: value });
  }
  onSaveProfileSubmit = async (e) => {
    e.preventDefault();
    if (this.props.fileList[0] === undefined) {
      this.props.form.validateFieldsAndScroll((err) => {
        if (!err) {
          this.props.updateUser({
            userInfo: {
              _id: this.props.idUserChangeByAdmin,
              firstName: this.props.firstName,
              lastName: this.props.lastName,
              phone: {
                phoneNumber: this.props.phoneNumber,
                phoneID: this.props.phoneID
              },
            }
          });
        } else {
          message.error('Something went wrong. Please try again.', 4);
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
              phone: {
                phoneNumber: this.props.phoneNumber,
                phoneID: this.props.phoneID
              },
            }
          });
        } else {
          message.error('Something went wrong. Please try again.', 4);
        }
      });
    }
  }
  render() {
    // console.log(this.props.roleUserForAdmin);
    const allowRoles = ['admin', 'sysadmin', 'distributor'];
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
          onChange={value => this.splicePhoneId(value)}
          style={{ width: 150, height: 30 }}
        />
      );
    };
    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <div className="users-page">
          <div className='title-text'>Edit {this.props.roleUserForAdmin}</div>
          <div>
            <Row>
              <AvatarEditor
                image={this.props.fileList.length === 0 ? this.props.imageUrl : this.props.imageTemporary}
                width={200}
                height={200}
                border={20}
                scale={this.props.avatarZoomValue}
                rotate={this.props.avatarRotateValue}
                borderRadius={100}
              />
            </Row>
            <Row>
              <Upload
                beforeUpload={(file) => {
                  this.props.onChangeFileList({ file });
                  const isLt2M = file.size / 1024 / 1024 < 2;
                  if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(file.name)) {
                    message.error('You can only upload image file!', 4);
                  } else if (!isLt2M) {
                    message.error('Image must smaller than 2MB!', 4);
                  } else {
                    this.getBase64(file, imageUrl =>
                      this.props.handleBeforeUpload({ imageUrlBased64: imageUrl })
                    );
                  }
                  return false;
                }}
                showUploadList={false}
              >
                <Button style={{ marginTop: 30, marginBottom: 30 }}>
                  <Icon type='upload' /> Click to Upload
                 </Button>
              </Upload>
            </Row>
          </div>
          <Form>
            <Col span={11}>
              <FormItem {...formItemLayout} label='Given Name'>
                {getFieldDecorator('firstName', {
                  rules: [
                    { required: allowRoles.indexOf(this.props.roleUserForAdmin) === -1 , message: 'Please input your first name!', whitespace: true },
                    { pattern: /.{2,15}/, message: "Name must be between 2 and 15 characters" }
                  ],
                  initialValue: this.props.firstName,
                  validateTrigger: 'onBlur',
                  validateFirst: true,
                })(
                  <Input
                    name='firstName'
                    placeholder='First name'
                    onChange={(e) => this.props.userInfoChange({ firstName: e.target.value })}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label='Email Address'>
                {getFieldDecorator('emailAddress', {
                  rules: [
                    { required: true, message: 'Please input your email!', whitespace: true }
                  ],
                  initialValue: this.props.email,
                  validateTrigger: 'onBlur',
                  validateFirst: true,
                })(
                  <Input
                    name='emailAddress'
                    placeholder='Email Address'
                    disabled={true}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={2}></Col>
            <Col span={11}>
              <FormItem {...formItemLayout} label='Family Name'>
                {getFieldDecorator('lastname', {
                  rules: [
                    { required: allowRoles.indexOf(this.props.roleUserForAdmin) === -1, message: 'Please input your last name!', whitespace: true },
                    { pattern: /.{2,15}/, message: "Name must be between 2 and 15 characters" }
                  ],
                  initialValue: this.props.lastName,
                  validateTrigger: 'onBlur',
                  validateFirst: true,
                })(
                  <Input
                    name='lastName'
                    placeholder='Last Name'
                    onChange={(e) => this.props.userInfoChange({ lastName: e.target.value })}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="Mobile Number">
                {getFieldDecorator('phone', {
                  rules: [
                    { required: allowRoles.indexOf(this.props.roleUserForAdmin) === -1, message: "Please input your phone number" },
                    { pattern: /^\d{4,15}$/, message: "Phone number must be from 4 - 15 digits" },
                    {
                      validator: (_rule, _value, callback) => {
                        if (!this.props.phoneID && allowRoles.indexOf(this.props.roleUserForAdmin) === -1) {
                          callback("Please select your country code");
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
                    placeholder='Phone Number'
                    onChange={(e) => this.props.userInfoChange({ phoneNumber: e.target.value })} />
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
                  Save
                </Button>
              </FormItem>
            </Col>
          </Form>
        </div>
      </AppLayout>
    )
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.editProfilePageModel,
    profileState: rootState.profileModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.editProfilePageModel,
    profileReducers: rootReducer.profileModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(Form.create()(EditProfileByAdmin));