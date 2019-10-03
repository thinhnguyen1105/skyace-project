import { createModel, ModelConfig } from '@rematch/core';
import Router from 'next/router';
import jwt_decode from "jwt-decode";
import { message } from 'antd';
import config from '../../../../api/config';
import {
  ILoginState,
  IEmailPayload,
  ILoginInputPayLoad,
  ILoginWithSocialAccountPayload
} from './interface';
import { getAuthService } from '../../../../service-proxies';
import { IUpdateUserProfilePayload } from '../../profile/interface';
import { ITokenData } from '../../../../api/modules/auth/auth/interface';

const loginPageModel: ModelConfig<ILoginState> = createModel({
  state: {
    email: '',
    password: '',
    id: '',
    isRemember: false,
    isStarted: false,
    signUpModalVisible: false,
    resetPasswordModalVisible: false
  },
  reducers: {
    onInputChange: (state: ILoginState, payload: any): ILoginState => {
      return {
        ...state,
        ...payload,
      };
    },
    rememberMeChanage: (state: ILoginState, payload: {isRemember: boolean}): ILoginState => {
      return {
        ...state,
        isRemember: payload.isRemember,
      };
    },
    clearState: (_state: ILoginState): ILoginState => {
      return {
        email: '',
        password: '',
        id: '',
        isRemember: false,
        isStarted: false,
        signUpModalVisible: false,
        resetPasswordModalVisible: false
      };
    },
    onEmailChange: (
      state: ILoginState,
      payload: IEmailPayload
    ): ILoginState => {
      return {
        ...state,
        ...payload
      };
    },
    onPasswordChange: (
      state: ILoginState,
      payload: any
    ): ILoginState => {
      return {
        ...state,
        ...payload
      };
    },
    isStarting: (state: ILoginState): ILoginState => {
      return {
        ...state,
        isStarted: true
      };
    },
    isRemember: (state: ILoginState): ILoginState => {
      return {
        ...state,
        isRemember: true
      };
    },
    onLoginSuccess: (
      state: ILoginState,
      _payload: IUpdateUserProfilePayload
    ): ILoginState => {
      return {
        ...state,
        isStarted: false
      };
    },
    onLoginFailed: (state: ILoginState): ILoginState => {
      return {
        ...state,
        isStarted: false
      };
    },
    onsignUpModalVisible: (
      state: ILoginState,
    ): ILoginState => {
      return {
        ...state,
        signUpModalVisible: true
      };
    },
    onsignUpModalUnVisible: (
      state: ILoginState,
    ): ILoginState => {
      return {
        ...state,
        signUpModalVisible: false
      };
    },
    onresetPasswordModalVisible: (
      state: ILoginState,
    ): ILoginState => {
      return {
        ...state,
        resetPasswordModalVisible: true
      };
    },
    onresetPasswordModalUnVisible: (
      state: ILoginState
    ): ILoginState => {
      return {
        ...state,
        resetPasswordModalVisible: false
      };
    },
  },
  effects: {
    async loginLocal(
      payload: ILoginInputPayLoad,
      _rootState: any
    ): Promise<void> {
      try {
        this.isStarting();
        const authService = getAuthService();
        const result = await authService.loginLocal(payload);
        const data: ITokenData = jwt_decode(result.token);

        this.onLoginSuccess({token: result.token});

        const isStudent = (data.roles as any).indexOf('student') > -1;
        const isTutor = (data.roles as any).indexOf('tutor') > -1;
        const isAdmin = (data.roles as any).indexOf('admin') > -1;
        const isSysAdmin = (data.roles as any).indexOf('sysadmin') > -1;
        
        if (isTutor) {
          Router.push('/tutor-dashboard');
        } else if (isStudent && (window.location.pathname.indexOf('/login-student/findATutor') === 0 || window.location.pathname.indexOf('/login-student/informationTutor') === 0)) {
          // Do nothing
        } else if (isStudent && window.location.pathname !== '/login-student/findATutor') {
          Router.push('/my-tuition');
        } else if (isAdmin) {
          Router.push('/admin/dashboard');
        } else if (isSysAdmin) {
          Router.push('/white-label-partners');
        } else if ((data.roles as any).indexOf('franchise') > -1) {
          Router.push('/white-label-partners');
        } else if ((data as any).roles.length === 0) {
          window.location.href= `/my-tuition`;
        }

        message.success('Log in successfully!', 2);
      } catch (error) {
        this.onLoginFailed();
        message.error(
          error.message
        , 4);
      }
    },
    async loginWithGoogle(payload: ILoginWithSocialAccountPayload, _rootState: any): Promise<void> {
      try {
        const authService = getAuthService();
        const loginWithGoogleResult = await authService.loginWithGoogle(payload);

        this.onLoginSuccess({token: loginWithGoogleResult.token});

        const data: ITokenData = jwt_decode(loginWithGoogleResult.token);
        const isStudent = (data.roles as any).indexOf('student') > -1;
        const isTutor = (data.roles as any).indexOf('tutor') > -1;
        const isAdmin = (data.roles as any).indexOf('admin') > -1;
        const isSysAdmin = (data.roles as any).indexOf('sysadmin') > -1;

        if (isTutor) {
          Router.push('/tutor-dashboard');
        } else if (isStudent && (window.location.pathname.indexOf('/login-student/findATutor') === 0 || window.location.pathname.indexOf('/login-student/informationTutor') === 0)) {
          // Do nothing
        } else if (isStudent && window.location.pathname !== '/login-student/findATutor') {
          Router.push('/my-tuition');
        } else if (isSysAdmin) {
          Router.push('/white-label-partners');
        } else if (isAdmin) {
          Router.push('/admin/dashboard');
        } else if ((data.roles as any).indexOf('franchise') > -1) {
          Router.push('/white-label-partners');
        } else if ((data as any).roles.length === 0) {
          window.location.href= `/my-tuition`;
        }

        message.success('Log In Success', 2);
      } catch (error) {
        message.error(error.message, 4);
        this.errorHappen({errorMessage: ''});
      }
    },
    async loginWithFacebook(payload: ILoginWithSocialAccountPayload, _rootState: any): Promise<void> {
      try {
        const authService = getAuthService();
        const loginWithFacebookResult = await authService.loginWithFacebook(payload);

        this.onLoginSuccess({token: loginWithFacebookResult.token});

        const data: ITokenData = jwt_decode(loginWithFacebookResult.token);
        const isStudent = (data.roles as any).indexOf('student') > -1;
        const isTutor = (data.roles as any).indexOf('tutor') > -1;
        const isAdmin = (data.roles as any).indexOf('admin') > -1;
        const isSysAdmin = (data.roles as any).indexOf('sysadmin') > -1;

        if (isTutor) {
          window.location.reload();
        } else if (isStudent && (window.location.pathname.indexOf('/login-student/findATutor') === 0 || window.location.pathname.indexOf('/login-student/informationTutor') === 0)) {
          // Do nothing
        } else if (isStudent && window.location.pathname !== '/login-student/findATutor') {
          Router.push('/my-tuition');
        } else if (isSysAdmin) {
          Router.push('/white-label-partners');
        } else if (isAdmin) {
          Router.push('/admin/dashboard');
        } else if ((data.roles as any).indexOf('franchise') > -1) {
          Router.push('/white-label-partners');
        } else if ((data as any).roles.length === 0) {
          window.location.href= `/my-tuition`;
        }

        message.success('Log In Success', 2);
      } catch (error) {
        message.error(error.message, 4);
        this.errorHappen({errorMessage: ''});
      }
    },
  },
});

export default loginPageModel;
