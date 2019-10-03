import { Document } from 'mongoose';
import { HasCreationAuditInfo, HasActive, IsAuditable, PageableQuery, SortableQuery, PageableResult, HasModificationAuditInfo, HasTenant } from '../../../core/interfaces';
import { Moment } from 'moment';

export interface IUser extends Document, IsAuditable, HasActive, HasTenant {
  email: string;
  password: string;

  firstName: string;
  lastName: string;
  fullName: string;
  normalizedFullName: string;
  emailConfirmed: boolean;
  imageUrl: string;
  externalLogin: {
    google: {
      id: string;
      email: string;
    };
    facebook: {
      id: string;
      email: string;
    };
  };
  biography: {
    language: string;
    nationality: string;
    aboutMe: string;
    secondaryLanguage: string;
  };
  education: {
    highestEducation: string;
    major: string;
    university: string;
    fileListDocument: object;
  };
  teacherExperience?: [
    {
      year: string;
      experience: string;
      index: number;
    }
  ];
  teacherSubject?: {
    basedIn: string;
    listSubject: [
      {
        subject: string;
        academicLevel: string;
        grade: string;
        hourlyRate: number;
        index: number;
      }
    ]
  };
  permissions: string[];
  roles: string[];

  isLocked: boolean;
  failLoginTryCount: number;
  lastLoginTime: Date;
  phone: {
    phoneID: string;
    phoneNumber: string;
  };
  passwordResetToken: string;
  passwordResetExpires: Date;
  forGroupTuitionElastic: boolean;
  groupTuitionFakeUsers: any;
  distributorInfo: any;
  firstTimeLoggedIn: boolean;
  isImported: boolean;
  distributorPaycheck: any;
  lang: any;
}

export interface ICreateUserInput extends HasCreationAuditInfo, HasActive {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: {
    phoneID: string;
    phoneNumber: string;
  };
  roles: string[];
  forGroupTuitionElastic?: boolean;
}

export interface ICreateAdminUserForNewTenant extends HasCreationAuditInfo, HasActive {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
  tenant: string;
}

export interface ICreateFranchise extends HasCreationAuditInfo, HasActive {
  email: string;
  password: string;
  phone: any;
  firstName: string;
  lastName: string;
  distributorInfo: any;
}

export interface IFindUserDetail {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  timeZone?: any;
  currency?: string;
  hourlyPerSessionTrial?: number;
  normalizedFullName?: string;
  permissions?: string[];
  roles?: string[];
  language?: string;
  isActive?: boolean;
  phone?: {
    phoneID: string;
    phoneNumber: string;
  };
  tenant?: {
    _id: string;
    name: string;
  };
  gender?: string;
  nationality?: string;
  currentAcademicLevel?: string;
  nationalID?: string;
  currentlyBasedIn?: string;
  forGroupTuitionElastic?: boolean;
  courseForTutor?: any;
  biography?: any;
  education?: any;
  age?: number;
  imageUrl?: string;
  paypalEmail?: string;
  paymentMethod?: string;
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  externalLogin?: object;
  distributorInfo?: any;
  firstTimeLoggedIn?: boolean;
  isImported?: boolean;
  distributorPaycheck?: any;
  lang?: string;
}

export interface IFindUsersQuery extends PageableQuery, SortableQuery {
  search?: string;
  role?: string;
}

export interface IFindUsersResult extends PageableResult<IFindUserDetail> { }

export interface IUpdateUserInput extends HasModificationAuditInfo {
  _id: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: {
    phoneID: string;
    phoneNumber: string;
  };
  imageUrl?: string;
  roles?: string[];
  timeZone?: any;
  currency?: string;
  hourlyPerSessionTrial: number;
  permissions?: string[];
  biography?: {
    language: string;
    nationality: string;
    aboutMe: string;
    secondaryLanguage: string;
  };
  education?: {
    highestEducation: string;
    major: string;
    university: string;
    fileListDocument: object;
  };
  teacherExperience?: [
    {
      start: Moment;
      end: Moment;
      experience: string;
      index: number;
    }
  ];
  teacherSubject?: {
    basedIn: string;
    listSubject: [
      {
        subject: string;
        academicLevel: string;
        grade: string;
        hourlyRate: number;
        index: number;
      }
    ]
  };
  dob?: Date;
  gender?: string;
  nationality?: string;
  currentAcademicLevel?: string;
  nationalID?: string;
  currentlyBasedIn?: string;
  forGroupTuitionElastic?: boolean;
  paypalEmail?: string;
  paymentMethod?: string;
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  externalLogin?: object;
  distributorInfo?: any;
  firstTimeLoggedIn?: boolean;
  isImported?: boolean;
  distributorPaycheck?: any;
}

export interface IActivateUser extends HasModificationAuditInfo {
  userId: string;
}

export interface IFindTutorsQuery extends PageableQuery, SortableQuery {
  search: string;
  language: string;
  gender: string;
  nationality: string;
  education: string;
  race: string;
  minAge: number;
  maxAge: number;
  minPrice: number;
  maxPrice: number;
}

export interface IFindUsersESResult {
  result: any;
  total: number;
}

export interface ICreateUserBySocialCredentialInput {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  normalizedFullName: string;
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

export interface IChangePasswordInput {
  _id: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}