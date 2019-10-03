import * as React from 'react';
import { Layout, Button, Icon, Row, Col, Menu, Dropdown, Avatar, Modal, Form, Input, message } from 'antd';
import * as Cookies from 'js-cookie';
import './Header.css';
import Router from 'next/router';
import config from '../api/config';
import { getUsersService } from '../service-proxies'; 

const FormItem = Form.Item;
class AdminHeader extends React.Component<any, any> {
  state = {
    logOutModalVisible: false,
    showChangePasswordModal: false,
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  };

  onLogout = () => {
    const urlRegex = config.nextjs.checkUrlRegexFrontEnd;
    const matchResult = window.location.host.match(urlRegex);
    const tenantName = matchResult && matchResult[1] ? matchResult[1].replace('.', '') : 'admin';

    Cookies.remove(`token_${tenantName}`, {domain: config.nextjs.cookieDomain});

    this.props.profileReducers.logOut();
    Router.push('/');
  }

  openLogOutModal = () => {
    this.setState({
      logOutModalVisible: true
    });
  }

  closeLogOutModal = () => {
    this.setState({
      logOutModalVisible: false,
    });
  }

  toggleChangePasswordModal = (state: boolean) => {
    this.setState({
      showChangePasswordModal : state
    })
  }

  onSavePasswordSubmit = async (e) => {
    e.preventDefault();

    if (this.props.password === '') {
      message.error(this.props.languageState.ADMIN_HEADER_PAGE_PASSWORD_REQUIRE.translated, 4);
    } else {
      this.props.form.validateFields((err, _values) => {
        if (!err) {
          // TODO : Call change password API
          try {  
            getUsersService().changePassword({
              _id: this.props.profileState._id,
              oldPassword: this.state.oldPassword,
              newPassword: this.state.newPassword,
              confirmNewPassword: this.state.confirmNewPassword
            }).then(() => {
              message.success(this.props.languageState.ADMIN_HEADER_PAGE_PASSWORD_CHANGED_SUCCESS.translated, 4);
              this.toggleChangePasswordModal(false);
            }).catch((err) => {
              message.error(err.message || this.props.languageState.ADMIN_HEADER_PAGE_INTERNAL_SERVER.translated, 4);  
            })
          } catch (err) {
            message.error(err.message || this.props.languageState.ADMIN_HEADER_PAGE_INTERNAL_SERVER.translated, 4);
          }
        } else {
          message.error(this.props.languageState.ADMIN_HEADER_PAGE_CHANGE_PASSWORD_ERROR.translated, 4);
        }
      });
    }
  }

  render() {
    const name = this.props.profileState.fullName ?
      this.props.profileState.fullName : this.props.profileState.email ? this.props.profileState.email : 'New User';
    const displayName = this.props.profileState.roles[0] === 'franchise' ? (this.props.profileState.distributorInfo ? this.props.profileState.distributorInfo.companyName || name : name) : name;

    const { getFieldDecorator } = this.props.form;

    const menu = (
      <Menu className='user-menu' selectedKeys={[]}>
        <Menu.Item>
          <a onClick={() => this.toggleChangePasswordModal(true)}>
            <Icon type="key" theme="outlined" />
            &nbsp; {this.props.languageState.ADMIN_HEADER_PAGE_CHANGE_PASSWORD.translated}
            </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key='logout'>
          <div onClick={this.openLogOutModal}>
            <Icon type='logout' className='user-menu-item-icon' />
            &nbsp; {this.props.languageState.ADMIN_HEADER_PAGE_LOGOUT.translated}
          </div>
        </Menu.Item>
      </Menu>
    );

    return (
      <Layout.Header
        style={{
          background: '#ffffff',
          boxShadow: '7px 0px 11px 1px rgba(0, 0, 0, 0.2)',
          zIndex: 1,
          padding: 0
        }}
      >
        <Row>
          <Col span={12}>
            <Button
              style={{
                padding: 0,
                fontSize: 21,
                borderRadius: 0,
                height: 64,
                width: 73,
                borderColor: 'white'
              }}
              onClick={this.props.toggleCollapsed}
            >
              <Icon
                type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
              />
            </Button>
          </Col>

          <Col span={12}>
            <div style={{textAlign: 'right', paddingRight: '24px'}}>
              <Dropdown overlay={menu}>
                <span>
                  <Avatar style={{ backgroundColor: '#87d068' }} icon='user' /> &nbsp; &nbsp;
                  <span className="responsive-display-name" style={{cursor: 'pointer', fontWeight: 500}}>{displayName} &nbsp; <Icon type='down' /></span>
                </span>
              </Dropdown>
            </div>
          </Col>
        </Row>

        <Modal
          title={this.props.languageState.ADMIN_HEADER_PAGE_MODAL_LOGOUT_TITLE.translated}
          visible={this.state.logOutModalVisible}
          onOk={this.onLogout}
          onCancel={this.closeLogOutModal}
          okText={this.props.languageState.ADMIN_HEADER_PAGE_OK_TEXT_LOGOUT.translated}
          cancelText={this.props.languageState.ADMIN_HEADER_PAGE_CANCEL_TEXT_LOGOUT.translated}
        >
          <p style={{fontSize: '16px', fontWeight: 500, textAlign: 'center', color: '#f5222d'}}>
          {this.props.languageState.ADMIN_HEADER_PAGE_LOGOUT_CONFIRM_TEXT.translated}
          </p>
        </Modal>

        <Modal title={this.props.languageState.ADMIN_HEADER_PAGE_MODAL_CHANGE_PASSWORD_TITLE.translated}
          okText={this.props.languageState.ADMIN_HEADER_PAGE_MODAL_OK_TEXT_CHANGE_PASSWORD.translated}
          cancelText={this.props.languageState.ADMIN_HEADER_PAGE_MODAL_CANCEL_TEXT_CHANGE_PASSWORD.translated}
          onOk={this.onSavePasswordSubmit}
          onCancel={() => {
            this.setState({
              oldPassword : "",
              newPassword : "",
              confirmNewPassword: ""
            })
            this.toggleChangePasswordModal(false)
          }}
          visible={this.state.showChangePasswordModal}
        >
          <Form>
            <FormItem
                label={this.props.languageState.ADMIN_HEADER_PAGE_MODAL_OLD_PASSWORD_LABEL.translated}
              >
                {getFieldDecorator('oldPassword', {
                  rules: [
                    { pattern: config.usersModuleConfig.passwordRegex, message: this.props.languageState.ADMIN_HEADER_PAGE_MODAL_OLD_PASSWORD_MIN_LENGTH_TEXT.translated }
                  ],
                  validateTrigger: "onBlur",
                  validateFirst: true
                })(
                  <Input
                    type="password"
                    onChange={(e) => this.setState({ oldPassword: e.target.value })}
                  />
                )}
            </FormItem>
            <FormItem
              label={this.props.languageState.ADMIN_HEADER_PAGE_MODAL_NEW_PASSWORD_LABEL.translated}
            >
              {getFieldDecorator('newPassword', {
                rules: [
                  { pattern: config.usersModuleConfig.passwordRegex, message: this.props.languageState.ADMIN_HEADER_PAGE_MODAL_NEW_PASSWORD_MIN_LENGTH_TEXT.translated }
                ],
                validateTrigger: "onBlur",
                validateFirst: true
              })(
                <Input
                  type="password"
                  onChange={(e) => this.setState({ newPassword: e.target.value })}
                />
              )}
            </FormItem>
            <FormItem
              label={this.props.languageState.ADMIN_HEADER_PAGE_MODAL_NEW_PASSWORD_CONFIRM_LABEL.translated}
            >
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    validator: (_rule, value, callback) => {
                      if (value !== this.state.newPassword || value === '') {
                        callback(this.props.languageState.ADMIN_HEADER_PAGE_MODAL_NEW_PASSWORD_CONFIRM_ERROR.translated);
                      }
                      callback();
                    }
                  }
                ],
                validateTrigger: "onBlur",
                validateFirst: true
              })(
                <Input 
                  type="password" 
                  onChange={(e) => this.setState({ confirmNewPassword : e.target.value})}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </Layout.Header>
    );
  }
}

export default Form.create()(AdminHeader);