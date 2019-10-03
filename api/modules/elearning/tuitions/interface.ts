import { Document } from 'mongoose';
import { IsAuditable, HasActive, PageableQuery, SortableQuery, PageableResult, HasCreationAuditInfo, HasModificationAuditInfo } from '../../../core/interfaces';
import { IGetCourseForTutorDetail } from '../course-for-tutor/interface';
import { IFindUserDetail } from '../../auth/users/interface';
import { IGetCourseDetail } from '../courses/interface';
import { IFindSessionDetail } from '../sessions/interface';

export interface ITuition extends Document, IsAuditable, HasActive {
  courseForTutor: IGetCourseForTutorDetail;
  course: IGetCourseDetail;
  tutor: IFindUserDetail;
  student: IFindUserDetail;
  tenant_id: string;
  isCompleted: boolean;
  isCanceled: boolean;
  isPendingReview: boolean;
  sessions: IFindSessionDetail[];
  cancelReason: string;
  referenceId: string;
  option: string;
}

export interface IFindTuitionsQuery extends PageableQuery, SortableQuery {
  search?: string;
  isCompleted?: boolean;
  isCanceled?: boolean;
  isPendingReview?: boolean;
  status: any;
}

export interface IFindTuitionsByUserIdQuery extends PageableQuery, SortableQuery {
  isCompleted: boolean;
  isCanceled?: boolean;
  isPendingReview?: boolean;
  userId: string;
}

export interface IFindTuitionDetail {
  _id: string;
  courseForTutor: IGetCourseForTutorDetail;
  course: IGetCourseDetail;
  tutor: IFindUserDetail;
  student: IFindUserDetail;
  tenant_id: string;
  isCompleted: boolean;
  isCanceled: boolean;
  isPendingReview: boolean;
  sessions: IFindSessionDetail[];
  cancelReason: string;
  referenceId: string;
  option: string;
}

export interface IFindTuitionsResult extends PageableResult<IFindTuitionDetail> {}

export interface ICreateTuitionInput extends HasCreationAuditInfo, HasActive {
  courseForTutor: string;
  course: string;
  tutor: string;
  student: string;
  referenceId?: string;
}

export interface IUpdateTuitionInput extends HasModificationAuditInfo {
  _id: string;
  courseForTutor?: string;
  tutor?: string;
  student?: string;
}

export interface IFinishTuition extends HasModificationAuditInfo {
  tuitionId: string;
}

export interface IFindUncompletedTuitionsResult {
  tuitionList: IFindTuitionDetail[];
}

export interface IFindUpcomingTuitions {
  tuitions: IFindTuitionDetail[];
}

export interface ICancelTuition extends HasModificationAuditInfo {
  tuitionId: string;
  cancelReason: string;
  cancelBy: string;
  userId: string;
}

export interface IGetTuitions {}

export interface ISendBookingConfirmEmail {
  tuitionId: string;
  tutorId: string;
  studentId: string;
  transactionId: string;
}