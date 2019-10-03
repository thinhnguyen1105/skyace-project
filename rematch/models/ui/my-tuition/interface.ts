import { IFindTuitionDetail, IFindTuitionsResult } from "api/modules/elearning/tuitions/interface";

export interface IMyTuiionPageState {
  isBusy: boolean;
  viewType: string;

  data: IFindTuitionDetail[];
  dataCancel: IFindTuitionDetail[] | undefined;
  upcomingTuitions: any;
  newestBookings: any;
  total: number;

  pageNumber: number;
  pageSize: number;
  sortBy: string;
  asc: boolean;
  isCompletedSpin: string;
  dob: string;
  courseForTutor: any;
  schedulesForTuTor: any;
}



export interface IViewTypeChange {
  newViewType: string;
}

export interface IFetchDataSuccess {
  result: IFindTuitionsResult;
}

export interface IFetchUpcomingTuitionsSuccess {
  result: any;
}

export interface IFetchNewestBookingsSuccess {
  result: any;
}

export interface IFetchData {
  isStudent: boolean;

  userId: string;
  isFinished: boolean;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  asc: boolean;
  isCanceled: boolean;
}

export interface IFilterChange {
  [key: string]: string | number;
}