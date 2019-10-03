import { IFindUserDetail, IFindUsersResult } from "api/modules/auth/users/interface";

export interface IUsersPageState {
  isBusy: boolean;

  data: IFindUserDetail[];
  total: number;

  search: string;
  filter: string;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  asc: boolean;

  currentUser: IFindUserDetail|{};
  errorMessage: string;
}

export interface ISearchChangePayload {
  searchValue: string;
}

export interface IFilterChangePayload {
  filterValue: string;
}

export interface IFetchDataPayload {
  search: string;
  filter: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  asc: boolean;
}

export interface IErrorHappenPayload {
  errorMessage: string;
}

export interface IFetchDataSuccessPayload {
  result: IFindUsersResult;
}

export interface IActivateUserSuccessPayload {
  userId: string;
}

export interface IActivateUserPayload {
  userId: string;
}