export interface IResetPasswordState {
  isBusy: boolean;
  accountId: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IEmailChangePayload {
  email: string;
}

export interface ISendResetPasswordEmailPayload {
  email: string;
}

export interface IPasswordChange {
  password: string;
}

export interface IUpdateNewPasswordPayload {
  _id: string;
  password: string;
}

export interface IUpdateTokenData {
  accountId: string;
  email: string;
}