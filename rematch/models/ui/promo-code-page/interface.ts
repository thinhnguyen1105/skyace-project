export interface IPromoCodePageState {
  data: any;
  total: number;
  createModal: boolean;
  createData: any;
  isBusy: boolean;
  selected: any;
  updateData: any;
  updateModal: boolean;
  search: string,
  pageSize: number,
  pageNumber: number,
  sortBy: string,
  asc: boolean,
}

export interface IFetchDataSuccessPayload {
  result : {
    data: any;
    total: number;
  }
}

export interface ICreateNewCodePayload {
  name: string;
  value: number;
  quantity: number;
  type: string;
  isInfinite: boolean;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  description: string;
}

export interface IUpdateCodePayload {
  _id: string;
  name?: string;
  value?: number;
  quantity?: number;
  type?: string;
  isInfinite?: boolean;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  description?: string;
}

export interface IDeleteCodePayload {
  _id: string;
}

export interface IFetchDataPayload {
  search: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  asc: boolean;
}