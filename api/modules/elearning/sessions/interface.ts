import { Document } from 'mongoose';
import { IsAuditable, HasActive, HasTenant, PageableResult, HasCreationAuditInfo, HasModificationAuditInfo } from '../../../core/interfaces';
import { IGetCourseDetail } from '../courses/interface';
import { IGetCourseForTutorDetail } from '../course-for-tutor/interface';
import { IFindTuitionDetail } from '../tuitions/interface';
import { IFindGroupTuitionDetail } from '../group-tuitions/interface';

export interface ISession extends Document, IsAuditable, HasActive, HasTenant {
  course: IGetCourseDetail;
  courseForTutor: IGetCourseForTutorDetail;
  tuition: IFindTuitionDetail;
  groupTuition: IFindGroupTuitionDetail;
  tutor: string;
  student: string;

  start: Date;
  end: Date;
  isCompleted: boolean;
  materials: {
    uploadBy: string;
    fileName: string;
    downloadUrl: string;
    uploadTime: Date;
  }[];
  isRescheduled: boolean;
  isPaid: boolean;
  isPaymentNotified: boolean;
}

export interface IFindSessionsQuery {
  tuitionId: string;
}

export interface IFindSessionDetail {
  _id: string;
  course: IGetCourseDetail;
  courseForTutor: IGetCourseForTutorDetail;
  tuition: IFindTuitionDetail;
  tutor: any;
  student: string;
  groupTuition: any;

  start: Date;
  end: Date;
  isCompleted: boolean;
  materials: {
    uploadBy: string;
    fileName: string;
    downloadUrl: string;
    uploadTime: Date;
  }[];
  reportSession?: {
    reportTutor: boolean;
    reasonReport: string[];
    commentReport: string;
  }[];
  isRescheduled?: boolean;
  isPaid: boolean;
  isPaymentNotified: boolean;
}

export interface IFindSessionsResult extends PageableResult<IFindSessionDetail> { }

export interface IFindSessions { }

export interface ISessionInput extends HasCreationAuditInfo {
  course: string;
  courseForTutor: string;
  tuition: string;
  tutor: string;
  student: string;

  start: Date;
  end: Date;
  materials: {
    uploadBy: string;
    fileName: string;
    downloadUrl: string;
    uploadTime: Date;
  }[];
}

export interface ICreateSessionsInput {
  sessionList: ISessionInput[];
}
export interface IUploadReportIssueInput {
  reportInfo: INewReportIssue;
}

export interface IUploadRateSessionInput {
  rateSession: INewRateSession;
}

export interface INewRateSession {
  rateSession: number,
  commentSession: string,
  uploadBy: string;
  uploadDate?: Date;
}
export interface INewReportIssue {
  reportStudent: boolean;
  reportTutor: boolean;
  reasonReport: string[];
  commentReport: string;
  uploadBy: string;
  uploadDate?: Date;
}
export interface IUpdateSessionInput extends HasModificationAuditInfo {
  _id: string;
  course?: string;
  courseForTutor?: string;
  tuition?: string;
  tutor?: string;
  student?: string;

  start?: Date;
  end?: Date;
  materials?: {
    uploadBy: string;
    fileName: string;
    downloadUrl: string;
    uploadTime: Date;
  }[];
  reportSession?: {
    reportTutor: boolean;
    reasonReport: string[];
    commentReport: string;
  }[];
  isRescheduled?: boolean;
  isPaid: boolean;
  isPaymentNotified: boolean;
}
export interface IGetSessionRoomURL {
  check: string;
  create: string;
  join: string;
}

export interface IMaterialInfo {
  _id: string;
  fileName: string;
  downloadUrl: string;
  uploadBy: string;
  uploadDate?: Date;
}

export interface IUploadMaterialInput {
  materialsInfo: IMaterialInfo[];
}

export interface IUploadMaterialResult {
  newMaterialsInfo: IMaterialInfo[];
}

export interface IFindStudentSessionQuery {
  studentId: string;
  period: {
    _id: string;
    start: Date;
    end: Date;
  }
}

export interface ICreateMultipleGroupSession {
  period: any,
  tutor: string;
  groupTuition: string;
}

export interface IDeleteMaterialInput {
  sessionId: string;
  materialId: string;
  fileName: string;
}