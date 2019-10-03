import { HasCreationAuditInfo } from '../../../core/interfaces';

export interface ILoginResult {
  token: string;
}

export interface IActiveInput {
  id: string;
  password: string;
  confirmPassword: string;
}

export interface IPasswordPayload {
  password: string;
  currentPassword: string;
}

export interface IRegisterInput extends HasCreationAuditInfo {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: {
    phoneID: string;
    phoneNumber: string;
  };
}

export interface ITokenData {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  roles?: string[];
  permissions?: string[];
  language?: string;
  timeZone?: {
    name: string;
    offset: string;
    gmt: string;
  };
  currency: any;
  tenant: {
    _id: string;
    name: string;
  };
  phone: {
    phoneNumber;
    phoneID;
  };
  exp?: number;
  iat?: number;
  firstTimeLoggedIn?: boolean;
  distributorInfo?: any;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ILoginWithSocialAccountInput {
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

export interface IUpdatePasswordInput {
  userId: string;
  email: string;
  newPassword: string;
}
