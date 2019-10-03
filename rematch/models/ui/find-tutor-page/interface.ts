import { IFindUserDetail } from "../../../../api/modules/auth/users/interface";

export interface IFindATutorPageState {
  search: string;
  language: string;
  gender: string;
  nationality: string;
  education: string;
  race: string;
  courseInput: object;
  minPrice: number;
  maxPrice: number;
  minAge: number;
  maxAge: number;
  minRating: number;
  maxRating: number;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  asc: boolean;
  minYearsOfExp: number;
  maxYearsOfExp: number;
  subjects: any;
  levels: any;
  grades: any;

  isBusy: boolean;
  data: IFindUserDetail[];
  total: number;
  visible: boolean;
  errorMessage: string;

  loginModalVisible: boolean;
  registerModalVisible: boolean;
  registerSuccessModalVisible: boolean;
  resetPasswordModalVisible: boolean;
}

export interface IFetchDataPayload {
  search: string | null | undefined;
  language: string | null | undefined;
  gender: string | null | undefined;
  nationality: string | null | undefined;
  education: string | null | undefined;
  race: string | null | undefined;
  courseInput: object | null | undefined;
  minAge: number | null | undefined;
  maxAge: number | null | undefined;
  minPrice: number | null | undefined;
  maxPrice: number | null | undefined;
  minRating: number | null | undefined;
  maxRating: number | null | undefined;
  minYearsOfExp: number | null | undefined;
  maxYearsOfExp: number | null | undefined;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  asc: boolean;
}

export interface IErrorHappenPayload {
  errorMessage: string;
}

export interface IFetchDataSuccessPayload {
  result: any;
}

export interface IPriceChange {
  newPrice: number[];
}

export interface IAgeChange {
  newAge: number[];
}

export interface IRatingChange {
  newRating: number[];
}

export interface IYearsOfExpChange {
  newYearsOfExp: number[];
}