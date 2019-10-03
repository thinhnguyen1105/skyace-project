import React from 'react';
import { Form, Input, Button } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { FormComponentProps } from 'antd/lib/form';
import { IResetPasswordState } from '../../rematch/models/ui/reset-password-page/interface';

interface IResetPasswordFormProps extends FormComponentProps {
  resetPasswordPageReducers: any;
  resetPasswordPageState: IResetPasswordState;
  languageState: any;
}

const ResetPasswordForm = (props: IResetPasswordFormProps) => {
  const onResetPassworfFormSubmit = (e) => {
    e.preventDefault();

    props.form.validateFields((err, _values) => {
      if (!err) {
        props.resetPasswordPageReducers.sendResetPasswordEmail({
          email: props.resetPasswordPageState.email,
        });
      }

      props.form.resetFields();
    });
  };

  const { getFieldDecorator } = props.form;

  return (
    <Form
      onSubmit={onResetPassworfFormSubmit}
      style={{
        borderRadius: "10px",
        display: "grid",
        gridGap: "15px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "0px" }}>
        RESET PASSWORD
      </h2>
      <FormItem label="Email Address" style={{ marginBottom: "4px" }}>
        {getFieldDecorator("email", {
          rules: [
            {
              required: true,
              message: "Please input your email address!"
            }
          ],
          validateTrigger: "onBlur",
          validateFirst: true,
        })(
          <Input
            onChange={event =>
              props.resetPasswordPageReducers.emailChange({
                email: (event.target as any).value
              })
            }
            type="email"
            placeholder="E.g yourname@email.com"
            name='email'
          />
        )}
      </FormItem>
      <FormItem style={{ marginBottom: "4px" }}>
        <Button
          loading={props.resetPasswordPageState.isBusy}
          type='primary'
          htmlType='submit'
          style={{ width: "100%", height: "40px" }}
        >
          Submit
        </Button>
      </FormItem>
    </Form>
  );
};

export default Form.create()(ResetPasswordForm);