import { createModel, ModelConfig } from '@rematch/core';
import { IResetPasswordState, IEmailChangePayload, ISendResetPasswordEmailPayload, IPasswordChange, IUpdateNewPasswordPayload, IUpdateTokenData } from './interface';
import { message } from 'antd';
import { getAuthService, getUsersService } from '../../../../service-proxies';
import Router from 'next/router';

const resetPasswordPageModel: ModelConfig<IResetPasswordState> = createModel({
  state: {
    isBusy: false,
    accountId: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
  },
  reducers: {
    errorHappen: (state: IResetPasswordState): IResetPasswordState => {
      return {
        ...state,
        isBusy: false,
      };
    },
    clearState: (_state: IResetPasswordState): IResetPasswordState => {
      return {
        isBusy: false,
        accountId: '',
        email: '',
        newPassword: '',
        confirmPassword: '',
      };
    },
    updateTokenData: (state: IResetPasswordState, payload: IUpdateTokenData): IResetPasswordState => {
      return {
        ...state,
        accountId: payload.accountId,
        email: payload.email,
      };
    },
    emailChange: (state: IResetPasswordState, payload: IEmailChangePayload): IResetPasswordState => {
      return {
        ...state,
        email: payload.email
      };
    },
    newPasswordChange: (state: IResetPasswordState, payload: IPasswordChange): IResetPasswordState => {
      return {
        ...state,
        newPassword: payload.password
      };
    },
    confirmPasswordChange: (state: IResetPasswordState, payload: IPasswordChange): IResetPasswordState => {
      return {
        ...state,
        confirmPassword: payload.password
      };
    },
    starting: (state: IResetPasswordState): IResetPasswordState => {
      return {
        ...state,
        isBusy: true,
      };
    },
    sendResetPasswordEmailSuccess: (state: IResetPasswordState): IResetPasswordState => {
      return {
        ...state,
        isBusy: false,
        email: '',
      };
    },
  },
  effects: {
    async sendResetPasswordEmail(payload: ISendResetPasswordEmailPayload, _rootState: any): Promise<void> {
      try {
        this.starting();

        const authService = getAuthService();
        await authService.sendResetPasswordEmail(payload.email);

        this.sendResetPasswordEmailSuccess();
        message.success('Reset password email has been sent to your email address', 4);
      } catch (error) {
        this.errorHappen();
        message.error(error.message, 4);
      }
    },
    async updateNewPassword(payload: IUpdateNewPasswordPayload, _rootState: any): Promise<void> {
      try {
        this.starting();

        const usersService = getUsersService();
        await usersService.update(payload as any);

        message.success('Update new password success', 2);
        Router.push('/');
      } catch (error) {
        this.errorHappen();
        message.error(error.message, 4);
      }
    }
  },
});

export default resetPasswordPageModel;