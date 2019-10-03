export interface IExchangeRatePageState {
  data: any;
  isUpdating: boolean;
  isCreating: boolean;
  createModalVisible: boolean;
  createInputCode: string;
  createInputExchangeRate: number;
  createInputName: string;
}

export interface IFetchDataSuccessPayload {
  results: any;
}

export interface IChangeRateInputPayload {
  _id?: string;
  code?: string;
  exchangeRate: number;
}

export interface IUpdateDataPayload {
  data: any;
}

export interface ICreateCurrencyPayload {
  code: string;
  exchangeRate: number;
  name: string;
}

export interface ICreateCurrencySuccess {
  result: any;
}

export interface IDeleteCurrencyPayload {
  _id: string;
}