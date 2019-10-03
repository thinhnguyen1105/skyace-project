import { IFindTransactionDetail, IFindTransactionsResult } from "api/modules/payment/transactions/interface";

export interface ITransactionsPageState {
  isBusy: boolean;

  data: IFindTransactionDetail[];
  total: number;

  search: string;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  asc: boolean;

  currentTransaction: IFindTransactionDetail|{};
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
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  asc: boolean;
}

export interface IErrorHappenPayload {
  errorMessage: string;
}

export interface IFetchDataSuccessPayload {
  result: IFindTransactionsResult;
}