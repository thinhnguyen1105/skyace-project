import { createModel, ModelConfig } from '@rematch/core';
import { message } from 'antd';
import {
  ISignUpState,
  IUsersSubmitState,
  IPhoneIDPayload,
  ICheckDevicePayload,
  IUserCheckPayload,
  IGivenNamePayload,
  IClickSignUpButton,
  ICheckDeviceResult
} from './interface';
import { getAuthService } from '../../../../service-proxies';

const signUpPageModel: ModelConfig<ISignUpState> = createModel({
  state: {
    isBusy: false,
    finishSignUpModalVisible: false,
    firstName: '',
    lastName: '',
    email: '',
    phoneID: '',
    phoneNumber: '',
    phone: '',
    password: '',
    confirm: '',

    isChecked: false,
    device: 0,
    roles: [],
    webcamVisible: false,
    micVisible: false,
    record: false,
    checkMicResult: false,
    checkCamResult: false,
  },
  reducers: {
    clearState: (_state: ISignUpState): ISignUpState => {
      return {
        isBusy: false,
        finishSignUpModalVisible: false,
        firstName: '',
        lastName: '',
        email: '',
        phoneID: '',
        phoneNumber: '',
        phone: '',
        password: '',
        confirm: '',

        isChecked: false,
        device: 0,
        roles: [],
        webcamVisible: false,
        micVisible: false,
        record: false,
        checkMicResult: false,
        checkCamResult: false,
      };
    },
    checkMicResultChange: (state: ISignUpState, payload: ICheckDeviceResult): ISignUpState => {
      return {
        ...state,
        checkMicResult: payload.checkResult,
      };
    },
    checkCamResultChange: (state: ISignUpState, payload: ICheckDeviceResult): ISignUpState => {
      return {
        ...state,
        checkCamResult: payload.checkResult,
      };
    },
    onSubmitForm: (
      state: ISignUpState,
      payload: IUsersSubmitState
    ): ISignUpState => {
      return {
        ...state,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phoneID + payload.phoneNumber.toString(),
        isChecked: true,
        isBusy: true,
        roles: payload.users
      };
    },
    selectOption: (
      state: ISignUpState,
      payload: IPhoneIDPayload
    ): ISignUpState => {
      return {
        ...state,
        phoneID: payload.phoneID
      };
    },
    checkBoxSelected: (state: ISignUpState): ISignUpState => {
      return {
        ...state,
        isChecked: true
      };
    },
    checkDevice: (
      state: ISignUpState,
      payload: ICheckDevicePayload
    ): ISignUpState => {
      return {
        ...state,
        device: payload.device,
        isBusy: true
      };
    },
    checkUsers: (
      state: ISignUpState,
      payload: IUserCheckPayload
    ): ISignUpState => {
      return {
        ...state,
        roles: payload.users
      };
    },
    onInfoChange: (
      state: ISignUpState,
      payload: IGivenNamePayload
    ): ISignUpState => {
      return {
        ...state,
        ...payload
      };
    },
    onPhoneIDChange: (
      state: ISignUpState,
      payload: IPhoneIDPayload
    ): ISignUpState => {
      return {
        ...state,
        phoneID: payload.phoneID
      };
    },
    onStarting: (state: ISignUpState): ISignUpState => {
      return {
        ...state,
        isBusy: true
      };
    },
    signUpSuccess: (state: ISignUpState): ISignUpState => {
      return {
        ...state,
        firstName: '',
        lastName: '',
        email: '',
        phoneID: '',
        phoneNumber: '',
        phone: '',
        password: '',
        confirm: '',
        isChecked: false,
        device: 0,
        roles: [],
        isBusy: false,
      };
    },
    signUpError: (state: ISignUpState): ISignUpState => {
      return {
        ...state,
        isBusy: false,
      };
    },
    onWebCamModalVisible: (state: ISignUpState): ISignUpState => {
      return {
        ...state,
        webcamVisible: true,
      };
    },
    onWebcamModalUnVisible: (state: ISignUpState): ISignUpState => {
      return {
        ...state,
        webcamVisible: false
      };
    },
    onMicModalVisible: (state: ISignUpState): ISignUpState => {
      return {
        ...state,
        micVisible: true,
        record: true,
      };
    },
    onMicModalUnVisible: (state: ISignUpState): ISignUpState => {
      return {
        ...state,
        micVisible: false,
        record: false,
        checkMicResult: true,
      };
    },
  },
  effects: {
    async signUpEffect(
      payload: IClickSignUpButton,
      _rootState: any
    ): Promise<void> {
      try {
        this.onStarting();

        const authService = getAuthService();
        await authService.register(payload as any);
        
        this.signUpSuccess();
      } catch (error) {
        this.signUpError();
        message.error(error.message ? error.message : 'Email or password is incorrect. Please try again!', 4);
      }
    },
  }
});

export default signUpPageModel;
