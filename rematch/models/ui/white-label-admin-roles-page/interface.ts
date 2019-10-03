import { IFindRoleDetail, IFindRolesResult, ICreateRoleInput, IUpdateRoleInput } from "../../../../api/modules/auth/roles/interface";

export interface IRolePageState {
  addRoleModalVisible: boolean;
  isBusy: boolean;

  data: IFindRoleDetail[];
  total: number;

  search: string;
  filter: string[];
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  asc: boolean;

  currentRole: IFindRoleDetail|{};
  errorMessage: string;
}

export interface IOpenAddRoleModalPayload {
  currentRole: IFindRoleDetail;
}

export interface ISearchChangePayload {
  searchValue: string;
}

export interface IFilterChangePayload {
  filterValue: string[];
}

export interface IFetchDataPayload {
  search: string;
  filter: string[];
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  asc: boolean;
}

export interface IErrorHappenPayload {
  errorMessage: string;
}

export interface IFetchDataSuccessPayload {
  result: IFindRolesResult;
}

export interface ICreateNewRoleSuccessPayload {
  roleInfo: IFindRoleDetail;
}

export interface IUpdateRoleSuccessPayload {
  roleInfo: IFindRoleDetail;
}

export interface IActivateRoleSuccessPayload {
  roleId: string;
}

export interface ICreateNewRolePayload {
  roleInfo: ICreateRoleInput;
}

export interface IUpdateRolePayload {
  roleInfo: IUpdateRoleInput;
}

export interface IActivateRolePayload {
  roleId: string;
}