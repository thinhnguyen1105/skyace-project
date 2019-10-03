import React from 'react';
import { Form, Input, Button } from 'antd';
import initStore from '../rematch/store';
import withRematch from '../rematch/withRematch';

class ResetPasswordPage extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    props.store.dispatch.resetPasswordPageModel.updateTokenData({
      accountId: props.query.accountId,
      email: props.query.email,
    });
  }

  onSubmitNewPassword = (e) => {
    e.preventDefault();

    this.props.form.validateFields((error, _values) => {
      if (!error) {
        this.props.updateNewPassword({
          _id: this.props.accountId,
          password: this.props.newPassword,
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='reset-password-page' style={{minHeight: '100vh', background: `url(/static/top-banner-background.png)`, paddingTop: '80px'}}>
        <Form
          onSubmit={this.onSubmitNewPassword}
          style={{
            borderRadius: "10px",
            display: "grid",
            gridGap: "15px",
            width: '450px',
            background: '#ffffff',
            margin: '0 auto',
            padding: '24px'
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "0px" }}>
            {this.props.languageState.RESET_PW_PAGE_TITLE.translated}
          </h2>
          <Form.Item label="Email" style={{ marginBottom: "4px" }}>
            <Input
              disabled={true}
              type="email"
              name='email'
              value={this.props.email}
            />
          </Form.Item>
          <Form.Item label={this.props.languageState.RESET_PW_PAGE_NEW_PASSWORD.translated} style={{ marginBottom: "4px" }}>
            {getFieldDecorator("newPassword", {
              rules: [
                {
                  required: true,
                  message: this.props.languageState.RESET_PW_PAGE_NEW_PW_VALIDATE.translated
                }
              ],
              validateTrigger: "onBlur",
              validateFirst: true,
            })(
              <Input
                onChange={event =>
                  this.props.newPasswordChange({
                    password: (event.target as any).value
                  })
                }
                type="password"
                name='password'
              />
            )}
          </Form.Item>
          <Form.Item label={this.props.languageState.RESET_PW_PAGE_CONFIRM_PW.translated} style={{ marginBottom: "4px" }}>
            {getFieldDecorator("confirmPassword", {
              rules: [
                {required: true, message: this.props.languageState.RESET_PW_PAGE_CONFIRM_PW_VALIDATE_1.translated},
                {
                  validator: (_rule, value, callback) => {
                    if (value !== this.props.newPassword) {
                      callback(this.props.languageState.RESET_PW_PAGE_CONFIRM_PW_VALIDATE_2.translated);
                    }
                    callback();
                  }
                }
              ],
              validateTrigger: "onBlur",
              validateFirst: true,
            })(
              <Input
                onChange={event =>
                  this.props.confirmPasswordChange({
                    password: (event.target as any).value
                  })
                }
                type="password"
                name='confirmPassword'
              />
            )}
          </Form.Item>
          <Form.Item style={{ marginBottom: "4px" }}>
            <Button
              loading={this.props.isBusy}
              type='primary'
              htmlType='submit'
              style={{ width: "100%", height: "40px" }}
            >
              {this.props.languageState.RESET_PW_PAGE_SUBMIT.translated}
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.resetPasswordPageModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.resetPasswordPageModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(Form.create()(ResetPasswordPage));