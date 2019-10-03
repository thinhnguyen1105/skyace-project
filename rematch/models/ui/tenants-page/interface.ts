import { IFindTenantDetail, ICreateTenantInput, IUpdateTenantInput } from '../../../../api/modules/auth/tenants/interface';

export interface ITenantPageState {
  createTenantSuccessModalVisible: boolean;
  addTenantModalVisible: boolean;
  isBusy: boolean;

  data: {
    _id: string;
    name: string;
    isActive: boolean;
    country: string;
    startDate: string;
    currency: string;
    no: number;
  }[];

  total: number;
  name?: string;
  search: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  asc: boolean;
  currentTenant: IFindTenantDetail;
  errorMessage: string;
  _id: string;
  haveData: boolean;
  registeredCompanyName: string;
  companyRegistrationNumber: string;
  partnerCenterName: string;
  countryOfRegistration: string;
  aboutCompany: string;
  partnerShipStartDate: string;
  adminName: string;
  adminEmail: string;
  timeZone: string;
  primaryCurrency: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  contactNumber: string,
  phoneID: string,
  email: string;
  website: string;
  address: string;
  billing: {
    address: string,
    country: string,
    state: string,
    city: string,
    zipCode: string,
  };
  isChecked: boolean;
  bankName: string;
  bankAccount: string;
  transferDescription: string;
  paypalID: string;
  domainExist: string;
  tenantInfo: any;
  paymentMethod: string;
  franchiseList: any;
  oldDomain: string;
}

export interface ITenantPageReducer {
  openAddTenantModal: (payload: IOpenAddTenantModalPayload) => ITenantPageState;
  closeAddTenantModal: () => ITenantPageState;
  tenantInfoChange: (payload: any) => ITenantPageState;
  searchChangeReducer: (payload: ISearchChangePayload) => ITenantPageState;
  fetchDataReducer: (payload: IFetchDataPayload) => ITenantPageState;
  errorHappen: (payload: IErrorHappenPayload) => ITenantPageState;
  starting: () => ITenantPageState;
  fetchDataSuccess: (payload: IFetchDataSuccessPayload) => ITenantPageState;
  createNewTenantSuccess: (payload: ICreateNewTenantSuccessPayload) => ITenantPageState;
  updateTenantSuccess: (payload: IUpdateTenantSuccessPayload) => ITenantPageState;
  activateTenantSuccess: (payload: IActivateTenantSuccessPayload) => ITenantPageState;
  deactivateTenantSuccess: (payload: IActivateTenantSuccessPayload) => ITenantPageState;
}

export interface ITenantPageEffect {
  fetchDataEffect: (payload: IFetchDataPayload) => Promise<void>;
  searchChangeEffect: (payload: ISearchChangePayload) => Promise<void>;
  createNewTenant: (payload: ICreateNewTenantPayload) => Promise<void>;
  updateTenant: (payload: IUpdateTenantPayload) => Promise<void>;
  activateTenant: (payload: IActivateTenantPayload) => Promise<void>;
  deactivateTenant: (payload: IDeactivateTenantPayload) => Promise<void>;
}

export interface IFetchDataPayload {
  search: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  asc: boolean;
}

export interface IErrorHappenPayload {
  errorMessage: string;
}

export interface IFetchDataSuccessPayload {
  data: {
    _id: string;
    name: string;
    isActive: boolean;
    country: string;
    startDate: string;
    currency: string;
    no: number;
  }[];
  total: number;
}

export interface IPutTenantDataPayload {
  registeredCompanyName: string;
  companyRegistrationNumber: string;
  partnerCenterName: string;
  countryOfRegistration: string;
  aboutCompany: string;
  partnerShipStartDate: string;
  adminName: string;
  adminEmail: string;
  timeZone: string;
  primaryCurrency: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  contactNumber: string,
  phoneID: string,
  email: string;
  website: string;
  address: string;
  billing: {
    address: string,
    country: string,
    state: string,
    city: string,
    zipCode: string,
  };
  bankName: string;
  bankAccount: string;
  transferDescription: string;
  paypalID: string;
  tenantInfo: any;
}

export interface ICreateNewTenantSuccessPayload {
  tenantInfo: IFindTenantDetail;
}

export interface IUpdateTenantSuccessPayload {
  tenantInfo: IFindTenantDetail;
}

export interface IActivateTenantSuccessPayload {
  tenantId: string;
}

export interface ICreateNewTenantPayload {
  tenantInfo: ICreateTenantInput;
}

export interface IUpdateTenantPayload {
  tenantInfo: IUpdateTenantInput;
}

export interface IUpdateProfilePayload {
  _id: string;
  registeredCompanyName: string;
  companyRegistrationNumber: string;
  partnerCenterName: string;
  countryOfRegistration: string;
  aboutCompany: string;
  partnerShipStartDate: string;
  partnerShipEndDate: string;
  partnerCompanyRegistrationNumber: string;
  regNoSameAsCompany?: boolean;
}

export interface IUpdateAdminPayload {
  _id: string;
  adminName: string;
  adminEmail: string;
}

export interface IUpdateConfigurationPayload {
  _id: string;
  timeZone: string;
  primaryCurrency: string;
}

export interface IUpdateContractPayload {
  _id: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  contactNumber: {
    number: string,
    phoneID: string,
  };
  email: string;
  website: string;
  address: string;
  billing: IBillingAdressPayload;
  name: string;
  gender: string;
}

export interface IBillingAdressPayload {
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  sameAsMain: boolean;
}

export interface IUpdateBankTransferPayload {
  _id: string;
  bankName: string;
  bankAccount: string;
  transferDescription: string;
}

export interface IUpdatePaypalPayload {
  _id: string;
  paypalID: string;
}
export interface IActivateTenantPayload {
  tenantId: string;
}

export interface ICountryOfRegistrationPayload {
  countryOfRegistration: string;
}

export interface ITimeZonePayload {
  timeZone: string;
}

export interface IprimaryCurrencyPayload {
  primaryCurrency: string;
}
export interface IDeactivateTenantPayload {
  tenantId: string;
}

export interface ICountryPayload {
  country: string;
}

export interface IDatePayload {
  partnerShipStartDate: string;
}

export interface ICityPayload {
  city: string;
}

export interface IStatePayload {
  state: string;
}

export interface IOpenAddTenantModalPayload {
  currentTenant: IFindTenantDetail;
}

export interface ISearchChangePayload {
  searchValue: string;
}