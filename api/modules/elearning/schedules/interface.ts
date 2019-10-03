import { Document } from 'mongoose';
import { IsAuditable, HasTenant, SchedulePageableQuery, PageableResult, HasCreationAuditInfo, HasModificationAuditInfo } from '../../../core/interfaces';

export interface ISchedule extends Document, IsAuditable, HasTenant {
  start: Date;
  end: Date;
  type: string;
  owner: string;
  parent: string;
  isCompleted: boolean;
  baseOn: string;
  isGroup: boolean;
  isPayment: boolean;
}

export interface IFindSchedulesQuery extends SchedulePageableQuery {
  tutorId: string;
  isCompleted?: boolean;
}

export interface IFindScheduleByUserIdQuery extends SchedulePageableQuery {
  userId: string;
}

export interface IFindTrialScheduleByUserIdQuery {
  userId: string;
}

export interface IFindScheduleDetail {
  _id: string;
  start: Date;
  end: Date;
  type: string;
  owner: string;
  parent: string;
  isCompleted: boolean;
  baseOn?: string;
  isGroup?: boolean;
  student?: string;
  isPayment?: boolean;
}

export interface ICreateScheduleInput extends HasCreationAuditInfo {
  start: Date;
  end: Date;
  type: string;
  owner: string;
  parent?: string;
  baseOn?: string;
  isGroup?: boolean;
  student?: string;
  isPayment?: boolean;
}

export interface IFindSchedulesResult extends PageableResult<IFindScheduleDetail> { }

export interface IUpdateScheduleInput extends HasModificationAuditInfo {
  _id: string;
  start: Date;
  end: Date;
}

export interface ISaveStudentBookingsInput {
  newBookings: ICreateScheduleInput[];
}

export interface ICreateMultipleSchedulesInput {
  schedulesList: ICreateScheduleInput[];
}

export interface IRescheduleInput extends HasModificationAuditInfo {
  sessionId: string;
  tutorId: string;
  studentId: string;

  start: Date;
  end: Date;

  oldStart: Date;
  oldEnd: Date;
}

export interface ISendRescheduleConfirmEmailInput {
  tutorId: string;
  studentId: string;
  tuitionId: string;
  rescheduleInfo: {
    rescheduleBy: string;
    oldStart: Date;
    oldEnd: Date;
    newStart: Date;
    newEnd: Date;
  };
}

export interface ICheckMultipleBookingsResult {
  qualifiedBookings: ICreateScheduleInput[];
  unqualifiedBookings: ICreateScheduleInput[];
}

export interface IFindGroupSchedule {
  tutor: string;
  period: {
    _id: string;
    start: Date;
    end: Date;
  }
}