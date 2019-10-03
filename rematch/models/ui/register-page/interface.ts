export interface ISignUpState {
  isBusy: boolean;
  finishSignUpModalVisible: boolean;

  firstName: string;
  lastName: string;
  email: string;
  phoneID: string;
  phoneNumber: string;
  phone: string;
  password: string;
  confirm: string;

  isChecked: boolean;
  device: number;
  roles: string[];
  webcamVisible: boolean;
  micVisible: boolean;
  record: boolean;
  checkMicResult: boolean;
  checkCamResult: boolean;
}

export interface ICheckDeviceResult {
  checkResult: boolean;
}

export interface IUsersSubmitState {
  firstName: string;
  lastName: string;
  email: string;
  phoneID: string;
  phoneNumber: number;
  isBusy: boolean;
  users: string[];
}

export interface IClickSignUpButton {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: {
    phoneNumber: string;
    phoneID: string;
  };
  roles: string[];
  redirectUrl: string;
}

export interface IPhoneIDPayload {
  phoneID: string;
}

export interface ICheckBoxPayload {
  isChecked: boolean;
}

export interface IUserCheckPayload {
  users: string[];
}

export interface ICheckDevicePayload {
  device: number;
  isBusy: boolean;
}

export interface IGivenNamePayload {
  firstName: string;
}

export interface IFamilyNamePayload {
  lastName: string;
}

export interface IEmail {
  email: string;
}

export interface IEmailPayload {
  email: string;
  redirectUrl: string;
}

export interface IPhoneNumberPayload {
  phoneNumber: number;
}

export interface ISignUpSuccessPayload {
  isBusy: boolean;
}