import { IFindUserDetail, IFindUsersResult } from "api/modules/auth/users/interface";

export interface IFranchisesPageState {
  isBusy: boolean;

  data: IFindUserDetail[];
  total: number;
  showCreateAdminModal: boolean;

  search: string;
  filter: string;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  asc: boolean;

  currentUser: IFindUserDetail|{};
  errorMessage: string;
  newFranchise: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirm: string;
    distributorInfo: any;
    phone: any;
  };
  createDistributorSuccessModalVisible: boolean
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

export interface ICreateFranchisePayload {
  email: string;
  password: string;
  phone: any;
  firstName: string;
  lastName: string;
  distributorInfo: any;
}

export interface IChangeCreateNewFranchiseInputPayload {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  confirm?: string;
  phone?: any;
  distributorInfo?: any;
}