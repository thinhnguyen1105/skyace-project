import { IMaterialInfo, IFindSessionDetail } from "../../../../api/modules/elearning/sessions/interface";
import { IFindScheduleDetail } from "../../../../api/modules/elearning/schedules/interface";

export interface ISessionDetailPageState {
  isBusy: boolean;
  isUploading: boolean;
  uploadMaterialModalVisible: boolean;
  rescheduleModalVisible: boolean;
  tutorSchedules: IFindScheduleDetail[];
  reschedule: IFindScheduleDetail | {};

  sessionUrls: any;
  materialsInfo: IMaterialInfo[];
  errorMessage: string;
  sessionInfo: IFindSessionDetail | {};
  isOpenModalRepportIssue: boolean;
  reportTutor: boolean;
  reasonReport: string[];
  commentReport: string;
  isOpenModalRateSession: boolean;
  rateSession: Number | undefined;
  commentWithRate: string;
  reportStudent: boolean;
  recordings: any;
}

export interface IFetchMediaUrl {
  check: string;
  join: string;
  create: string;
}
export interface IUploadMaterialsSuccess {
  newMaterialsInfo: IMaterialInfo[];
}

export interface IErrorHappen {
  errorMessage: string;
}

export interface IDownloadMaterial {
  sessionId: string;
  fileId: string;
}

export interface ICreateReschedule {
  reschedule: IFindScheduleDetail;
}

export interface ISaveReschedule {
  newScheduleInfo: {
    start: Date;
    end: Date;
    oldStart: Date;
    oldEnd: Date;
    title: string;
    type: string;
    owner: string;
    parent?: string;
    status: string;
  };
  newSessionInfo: {
    _id: string;
    start: Date;
    end: Date;
  };
  tutor: string;
  role: string;
  student: string;
  timeZone: any;
}

export interface IFetchSessionInfoSuccess {
  sessionInfo: IFindSessionDetail;
}

export interface ISendConfirmEmail {
  studentId: string;
  tutorId: string;
}

export interface IFetchSessionInfo {
  sessionId: string;
}

export interface IDeleteMaterialPayload {
  sessionId: string;
  materialId: string;
  fileName: string;
}

export interface ILoadSchedulesPayload {
  tutorId: string;
  studentId: string;
  start: Date;
  end: Date;
}