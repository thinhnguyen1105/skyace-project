import { IFindTuitionDetail, IFindTuitionsResult } from "api/modules/elearning/tuitions/interface";

export interface ITuitionsPageState {
  isBusy: boolean;

  data: IFindTuitionDetail[];
  total: number;

  search: string;
  isCompleted: boolean|undefined;
  isCanceled: boolean|undefined;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  asc: boolean;

  currentUser: IFindTuitionDetail|{};
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
  isCompleted: boolean|undefined;
  isCanceled: boolean|undefined;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  asc: boolean;
  status?: any;
}

export interface IErrorHappenPayload {
  errorMessage: string;
}

export interface IFetchDataSuccessPayload {
  result: IFindTuitionsResult;
}