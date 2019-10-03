export interface ILoginState {
  email: string;
  id: string;
  password: string;
  isRemember: boolean;
  isStarted: boolean;
  signUpModalVisible: boolean;
  resetPasswordModalVisible: boolean;
}

export interface ILoginInputPayLoad {
  email: string;
  password: string;
}

export interface IEmailPayload {
  email: string;
}

export interface IModalPayload {
  modalVisible: boolean;
}

export interface IPasswordPayload {
  currentPassword: string;
  password: string;
}

export interface IStartingPayload {
  isStarted: boolean;
}

export interface IsRememberPayload {
  isRemember: boolean;
}

export interface ILoginWithSocialAccountPayload {
  email: string;
  firstName: string;
  lastName: string;
  externalLogin: {
    google?: {
      id: string;
      email: string;
    };
    facebook?: {
      id: string;
      email: string;
    };
  };
}