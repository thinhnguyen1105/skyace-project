import { createModel, ModelConfig } from '@rematch/core';
import jwtDecode from 'jwt-decode';
import { IProfileState, IUpdateUserProfilePayload, ISaveSocialUserPayload, IUpdateSocialInfoSuccessPayload } from './interface';
import { message } from 'antd';
import { getAuthService } from '../../../service-proxies';
import { ITokenData } from '../../../api/modules/auth/auth/interface';

const profileModel: ModelConfig<IProfileState> = createModel({
  state: {
    _id: '',
    email: '',
    firstName: '',
    lastName: '',
    fullName: '',
    permissions: [],
    roles: [],
    tenant: {},
    language: '',
    isLoggedIn: false,
    token: '',
    phone: {
      phoneID: '',
      phoneNumber: '',
    },
    timeZone: {
      name: '',
      offset: '',
      gmt: '',
    },
    currency: '',

    updateInforModalVisible: false,
    isBusy: false,

    updateSocialInfo: {} as any,
    firstTimeLoggedIn: false,
    distributorInfo: {}
  },
  reducers: {
    'loginPageModel/onLoginSuccess': (state: IProfileState, payload: IUpdateUserProfilePayload): IProfileState => {
      const data: ITokenData = jwtDecode(payload.token);

      return {
        ...state,
        _id: data._id,
        isLoggedIn: true,
        token: payload.token,
        email: data.email as any,
        fullName: data.fullName as any,
        firstName: data.firstName as any,
        lastName: data.lastName as any,
        permissions: data.permissions as any,
        tenant: data.tenant,
        roles: data.roles as any,
        language: data.language ? data.language : 'en',
        timeZone: data.timeZone as any,
        currency: data.currency,
        phone: data.phone,
        updateInforModalVisible: (data.roles as any).length > 0 ? false : true,
        firstTimeLoggedIn: data.firstTimeLoggedIn || false,
        distributorInfo: data.distributorInfo || {}
      };
    },
    loginSocialSuccess: (state: IProfileState, payload: IUpdateUserProfilePayload): IProfileState => {
      const data: ITokenData = jwtDecode(payload.token);

      return {
        ...state,
        _id: data._id,
        isLoggedIn: true,
        token: payload.token,
        email: data.email as any,
        fullName: data.fullName as any,
        firstName: data.firstName as any,
        lastName: data.lastName as any,
        permissions: data.permissions as any,
        tenant: data.tenant,
        roles: data.roles as any,
        phone: {
          phoneID: data.phone && data.phone.phoneID ? data.phone.phoneID : '',
          phoneNumber: data.phone && data.phone.phoneNumber ? data.phone.phoneNumber : '',
        },
        language: data.language ? data.language : 'en',
        updateInforModalVisible: (data.roles as any).length > 0 ? false : true,
      };
    },
    profileInfoChange: (state: IProfileState, payload: any): IProfileState => {
      return {
        ...state,
        updateSocialInfo: {
          ...state.updateSocialInfo,
          ...payload,
        },
      };
    },
    logOut: (_state: IProfileState): IProfileState => {
      return {
        _id: '',
        email: '',
        fullName: '',
        firstName: '',
        lastName:  '',
        permissions: [],
        roles: [],
        tenant: {},
        language: '',
        isLoggedIn: false,
        token: '',
        phone: {
          phoneID: '',
          phoneNumber: '',
        },
        timeZone: {
          name: '',
          offset: '',
          gmt: '',
        },
        currency: '',
        updateInforModalVisible: false,
        isBusy: false,
        updateSocialInfo: {} as any,
        firstTimeLoggedIn: false,
        distributorInfo: {}
      };
    },
    updateSocialInfoSuccess: (state: IProfileState, payload: IUpdateSocialInfoSuccessPayload): IProfileState => {
      return {
        ...state,
        ...payload,
        fullName: [payload.firstName, payload.lastName].join(' '),
        updateInforModalVisible: false,
        isBusy: false,
        updateSocialInfo: {} as any,
      };
    },
    starting: (state: IProfileState): IProfileState => {
      return {
        ...state,
        isBusy: true,
      };
    },
  },
  effects: {
    async updateSocialInfoEffect(payload: ISaveSocialUserPayload, _rootState: any): Promise<void> {
      try {
        this.starting();

        const authService = getAuthService();
        await authService.updateSocialUser(payload);

        this.updateSocialInfoSuccess(payload);
        message.success("Update information success", 3);
      } catch (error) {
        message.error(error.message ? error.message : "Internal server error. Please try again !", 4);
      }
    },
  },
});

export default profileModel;
