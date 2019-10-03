import { Document } from 'mongoose';
import { IsAuditable, HasActive, HasCreationAuditInfo, PageableQuery, SortableQuery, HasModificationAuditInfo } from '../../../core/interfaces';
import { IFindUserDetail } from '../../auth/users/interface';
import { IFindSessionDetail } from '../sessions/interface';
import { IFindScheduleDetail } from '../schedules/interface';

export interface IGroupTuition extends Document, IsAuditable, HasActive {
  course: {
    country: string;
    subject: string;
    level: string;
    grade: string;
    session: number;
    hourlyRate: number;
    hourPerSession: number;
    minClassSize: number;
    maxClassSize: number;
    startReg: Date;
    endReg: Date;
  };
  tutor: IFindUserDetail;
  students: IFindUserDetail[];
  slotsHolded: [{
    student: string;
    startTime: Date;
  }];
  period: IFindScheduleDetail[];
  courseForTutor: any;
  tenant_id: string;
  isCompleted: boolean;
  isCanceled: boolean;
  sessions: IFindSessionDetail[];
  cancelReason: string;
  startReg : Date;
  endReg: Date;
  referenceId: string;
}

export interface IFindGroupTuitionsByUserIdQuery extends PageableQuery, SortableQuery {
  isCompleted: boolean;
  userId: string;
}

export interface IFindGroupTuitionDetail {
  _id: string;
  course: {
    country: string;
    subject: string;
    level: string;
    grade: string;
    session: number;
    hourPerSession: number;
    minClassSize: number;
    maxClassSize: number;
    startReg: Date;
    endReg: Date;
  },
  tutor: IFindUserDetail;
  students: IFindUserDetail[];
  period: IFindScheduleDetail[];
  tenant_id: string;
  isCompleted: boolean;
  isCanceled: boolean;
  sessions: IFindSessionDetail[];
  cancelReason: string;
  isActive: boolean;
  referenceId: string;
}

export interface IFindGroupTuitionsResult {
  total: number;
  results: IFindGroupTuitionDetail[];
}

export interface ICreateGroupTuitionInput extends HasCreationAuditInfo, HasActive {
  tutor: string;
  course: {
    country: string;
    subject: string;
    level: string;
    grade: string;
    session: number;
    hourlyRate: number;
    hourPerSession: number;
    minClassSize: number;
    maxClassSize: number;
    startReg: Date;
    endReg: Date;
  },
  period: [
    {
      start: Date;
      end: Date;
    }
  ],
  referenceId?: string;
}

export interface IUpdateGroupTuitionInput {
  _id : string;
  course?: {
    country?: string;
    subject?: string;
    level?: string;
    grade?: string;
    session?: number;
    hourlyRate?: number;
    hourPerSession?: number;
    minClassSize?: number;
    maxClassSize?: number;
    startReg?: Date;
    endReg?: Date;
  },
  period?: [
    {
      start: Date;
      end: Date;
    }
  ]
}

export interface IDeleteGroupTuitionInput {
  _id: string;
}

export interface IBookingGroupTuitionInput {
  tuition_id: string;
  student_id: string;
}

export interface ICancelTuition extends HasModificationAuditInfo{
  tuitionId: string;
  cancelReason: string;
  cancelBy: string;
  userId: string;
}

export interface ICheckStudentSchedule {
  tuition_id: string;
  student_id: string;
  period: {
    _id: string;
    start: Date;
    end: Date;
  },
  tutor: string;
}