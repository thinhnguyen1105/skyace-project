export interface IProfileState {
  _id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  permissions: string[];
  roles: string[];
  tenant: any;
  language: string;
  isLoggedIn: boolean;
  token: string;
  phone: {
    phoneID: string;
    phoneNumber: string;
  };
  timeZone: {
    name: string;
    offset: string;
    gmt: string;
  };
  currency: any;
  updateInforModalVisible: boolean;
  isBusy: boolean;
  updateSocialInfo: {
    email: string;
    roles: string[];
    firstName: string;
    lastName: string;
    phone: {
      phoneID: string;
      phoneNumber: string;
    };
    phoneSave: {
      phoneID: string;
      phoneNumber: string;
    };
  };
  firstTimeLoggedIn: boolean;
  distributorInfo: any;
}

export interface IProfileReducer {
  updateProfile: (state: IProfileState, payload: IUpdateUserProfilePayload) => IProfileState;
  clearUserProfile: (_state: IProfileState) => IProfileState;
}

export interface IUpdateUserProfilePayload {
  token: string;
}

export interface ISaveSocialUserPayload {
  _id: string;
  roles: string[];
  firstName: string;
  lastName: string;
  email: string;
  phone: {
    phoneID: string;
    phoneNumber: string;
  };
  password: string;
}

export interface IUpdateSocialInfoSuccessPayload {
  roles: string[];
  firstName: string;
  lastName: string;
  phone: {
    phoneID: string;
    phoneNumber: string;
  };
}