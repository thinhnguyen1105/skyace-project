import { IFindSessionDetail } from "api/modules/elearning/sessions/interface";

export interface ITuitionDetailPageState {
  isBusy: boolean;
  cancelTuitionModalVisible: boolean;
  errorMessage: string;

  sessionList: IFindSessionDetail[];
  cancelReason: string;
}

export interface IFetchSessionList {
  tuitionId: string;
}

export interface IFetchSessionListSuccess {
  sessionList: IFindSessionDetail[];
}

export interface ICancelReasonChange {
  cancelReason: string;
}

export interface IErrorHappen {
  errorMessage: string;
}

export interface ICancelTuition {
  tuitionId: string;
  cancelReason: string;
  cancelBy: string;
  userId: string;
}