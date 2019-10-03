import { Document } from 'mongoose';
import { IsAuditable, HasActive, HasCreationAuditInfo, PageableQuery, SortableQuery, PageableResult, HasModificationAuditInfo } from '../../../core/interfaces';

export interface ITenant extends Document, IsAuditable, HasActive {
  name: string;
  domain: string;
  country?: string;
  startDate?: string;
  currency?: string;
  no?: number;
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
  adminPhoneNumber: string;
  adminPhoneID: string;
  paymentMethod: string;
  otherConfigs?: {
    timeZone: any,
    primaryCurrency: any,
  };
  administrationInfomation?: {
    adminName: string,
    adminEmail: string
  };
  companyProfile?: {
    registeredCompanyName: string,
    companyRegistrationNumber: string,
    partnerCompanyRegistrationNumber: string,
    regNoSameAsCompany?: boolean,
    partnerCenterNameSameAsCompany?: boolean,
    partnerCenterName: string,
    countryOfRegistration: string,
    aboutCompany: string,
    partnerShipStartDate: string,
    partnerShipEndDate: string
  };
  paypal?: {
    paypalID: string;
  };
  contactInformation?: {
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
    billing: {
      zipCode: string,
      country: string;
      state: string;
      city: string;
    },
    name: string,
    firstName: string,
    lastName: string,
    gender: string
  };
  bankTransfer?: {
    bankName: string;
    bankAccount: string;
    transferDescription: string
  };
  commissionFee?: {
    firstPayment: number;
    nextPayment: number;
  };
  paymentInfo: {
    fixedAmount: number;
    dayInMonth: number;
  };
  fileLists?: any;
  adminCreated: any;
  assignDistributorTime: Date;
  partnerPaycheck: any;
}

export interface ICreateTenantInput extends HasCreationAuditInfo, HasActive {
  companyProfile: {
    registeredCompanyName: string,
    companyRegistrationNumber: string,
    partnerCompanyRegistrationNumber: string,
    regNoSameAsCompany?: boolean,
    partnerCenterNameSameAsCompany?: boolean,
    partnerCenterName: string,
    countryOfRegistration: string,
    partnerShipStartDate: string,
    partnerShipEndDate: string,
  };
  domain: string;
  password: string;
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
  adminPhoneNumber: string;
  adminPhoneID: string;
  fileLists?: any;
  adminCreated: any;
  paymentInfo: any;
}

export interface IFindTenantDetail {
  _id: string;
  name?: string;
  domain: string;
  companyName?: string;
  isActive?: boolean;
  country?: string;
  startDate?: string;
  currency?: string;
  no?: number;
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
  adminPhoneNumber: string;
  adminPhoneID: string;
  paymentMethod?: string;
  otherConfigs?: {
    timeZone: any,
    primaryCurrency: any,
  };
  administrationInfomation?: {
    adminName: string,
    adminEmail: string
  };
  companyProfile?: {
    registeredCompanyName: string,
    companyRegistrationNumber: string,
    partnerCompanyRegistrationNumber: string,
    regNoSameAsCompany?: boolean,
    partnerCenterNameSameAsCompany?: boolean,
    partnerCenterName: string,
    countryOfRegistration: string,
    aboutCompany: string,
    partnerShipStartDate: string,
    partnerShipEndDate: string,
  };
  paypal?: {
    paypalID: string;
  };
  contactInformation?: {
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
    billing: {
      zipCode: string,
      country: string;
      state: string;
      city: string;
    },
    name: string,
    firstName: string,
    lastName: string,
    gender: string
  };
  bankTransfer?: {
    bankName: string;
    bankAccount: string;
    transferDescription: string
  };
  commissionFee?: {
    firstPayment: number;
    nextPayment: number;
  };
  paymentInfo: {
    fixedAmount: number;
    dayInMonth: number;
  };
  fileLists?: any;
  adminCreated: string;
  assignDistributorTime: Date;
  partnerPaycheck: any;
}

export interface IFindTenantsQuery extends PageableQuery, SortableQuery {
  search: string;
  isActive?: boolean;
}

export interface IFindTenantsByAdminQuery extends IFindTenantsQuery {
  adminCreated: string;
}

export interface IFindTenantsResult extends PageableResult<IFindTenantDetail> { }

export interface IUpdateTenantInput extends HasModificationAuditInfo {
  _id: string;
  tenantName?: string;
  domainName?: string;
}

export interface IActivateTenant extends HasModificationAuditInfo {
  tenantId: string;
}

export interface ICompanyProfile {
  _id: string;
  registeredCompanyName: string;
  companyRegistrationNumber: string;
  partnerCompanyRegistrationNumber: string;
  regNoSameAsCompany?: boolean;
  partnerCenterNameSameAsCompany?: boolean;
  partnerCenterName: string;
  countryOfRegistration: string;
  aboutCompany: string;
  partnerShipStartDate: string;
  partnerShipEndDate: String
}

export interface IAdminInfor {
  _id: string;
  adminName: string;
  adminEmail: string;
}

export interface IConfiguration {
  _id: string;
  timeZone: any;
  primaryCurrency: any;
}

export interface IContractInfo {
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
  billing: {
    address: string;
    country: string;
    state: string;
    city: string;
    zipCode: string;
    sameAsMain: boolean;
  };
  name: String;
  gender: String;
}

export interface IBankTransfer {
  _id: string;
  bankName: string;
  bankAccount: string;
  transferDescription: string;
}

export interface IPaypal {
  _id: string;
  paypalID: string;
}

export interface ICommissionFee {
  _id: string;
  firstPayment: number;
  nextPayment: number;
}