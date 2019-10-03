import { IFindUserDetail, IUpdateUserInput } from "../../../../api/modules/auth/users/interface";
import { IGetAllCourseForTutor } from "../../../../api/modules/elearning/course-for-tutor/interface";
export interface IEditProfileState {
  teacherExperience: ITeachingExperience[];
  imageTemporary: string;
  imageUrl: string | undefined;
  loading: boolean;
  id: string;
  firstName: string;
  lastName: string;
  phoneID: string | undefined;
  phoneIDSave: string | undefined;
  phoneNumber: string;
  dob: Date | null;
  biography: {
    language: string;
    nationality: string;
    aboutMe: string;
  };
  education: {
    highestEducation: string;
    major: string;
    university: string;
    fileListDocument: IFileDocument | {};
  };
  email: string;
  isBusy: boolean;

  search: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  asc: boolean;
  errorMessage: string;

  showChangePasswordModal: boolean;
  fileList: any[];
  avatarZoomValue: number;
  avatarRotateValue: number;
  tutorCourses: any;
  searchInput: any;
  createSubjectInputs: any;
  coursesLookup: any;
  hourlyRateInputs: any;
  createSubjectModal: boolean;
  timeZone: any;
  currency: any;
  hourlyPerSessionTrial: number | undefined;
  gender: string | undefined;
  nationality: string | undefined;
  currentAcademicLevel: string | undefined;
  nationalID: string | undefined;
  currentlyBasedIn: string | undefined;
  flagCheckTrialSubjectExisted: boolean;
  idTrialCourse: string;
  idTrialSubject: string;
  currencies: any;
  currencyInput: string;
  paypalEmail: string | undefined;
  paymentMethod: string | undefined;
  bankName: string | undefined;
  accountHolderName: string | undefined;
  accountNumber: string | undefined;
  externalLogin: object | undefined;
  modeMonthPicker: string[];
  idUserChangeByAdmin: string;
  roleUserForAdmin: string;

}
export interface IFileDocument {
  document1: any[];
  document2: any[];
  document3: any[];
  document4: any[];
}
export interface IFileListPayload {
  file: any;
}

export interface IFetchDataPayload {
  id: string;
  search: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  asc: boolean;
}

export interface IFetchResultDetail {
  firstName: string;
  email: string;
  lastName: string;
  phone: {
    phoneID: string;
    phoneNumber: string;
  };
  dob: Date;
  imageUrl?: string;
  timeZone?: any;
  currency?: any;
  hourlyPerSessionTrial?: number;
  biography?: {
    language: string;
    nationality: string;
    aboutMe: string;
  };
  education?: {
    highestEducation: string;
    major: string;
    university: string;
    fileListDocument: object;
  };
  teacherExperience: ITeachingExperienceFetch[];
  gender: string;
  nationality: string;
  currentAcademicLevel: string;
  nationalID: string;
  currentlyBasedIn: string;
  paypalEmail: string;
  paymentMethod: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  externalLogin: object;
}

export interface ITeachingExperienceFetch {
  start: any;
  end: any;
  experience: string;
  index: number;

}
export interface IScaleValue {
  scaleValue: number;
}
export interface IRotateValue {
  rotateValue: number;
}
export interface IUpdateUserSuccessPayload {
  userInfo: IFindUserDetail;
}

export interface IUpdateUserPayload {
  userInfo: IUpdateUserInput;
}

export interface IErrorHappenPayload {
  errorMessage: string;
}

export interface IFetchDataSuccessPayload {
  result: IFetchResultDetail;
}

export interface IFetchCoursesSuccessPayload {
  result: IGetAllCourseForTutor;
}

export interface IChangeHourlyRateInput {
  _id: string;
  value: number;
}

export interface ICreateCourseForTutorInput {
  course: string;
  tutor: string;
  hourlyRate: number;
}

export interface IUpdateCourseForTutorInput {
  _id: string;
  hourlyRate?: number;
  course?: string;
}
interface ITeachingExperience {
  year: any;
  experience: string;
  index: number;
}
export interface IEvent {
  event: any;
}
export interface IPhoneIDPayload {
  phoneID: string;
}

export interface IEventWithIndex {
  event: any
  value: any;
  mode: any;
  index: number;
}
export interface IValueWithIndex {
  value: any;
  index: number;
}

export interface IImage {
  imageUrlBased64: string;
  imageUrl: string;
}

export interface IDeleteTeacherSubjectPayload {
  courseForTutorId: string;
  courseId: string;
}

export interface ICreateSubjectInput {
  data: any;
}

export interface IFetchCurrenciesSuccess {
  results: any;
}