import { IFindScheduleDetail, IFindSchedulesResult } from "../../../../api/modules/elearning/schedules/interface";
import { IFindGroupTuitionDetail } from '../../../../api/modules/elearning/group-tuitions/interface';

export interface ITutoringPageState {
  isBusy: boolean;
  tutorInfo: any;
  createGroupTuitionInput: {
    country: string;
    subject: string;
    level: string;
    grade: string;
    hourlyRate: number;
    session: number;
    hourPerSession: number;
    minClassSize: number;
    maxClassSize: number;
    startReg: any;
    endReg: any;
    period: any;
  },
  selectedEvent: any;
  schedulesData: IFindScheduleDetail[];
  groupTuitions: IFindGroupTuitionDetail[];
  createGroupModal: boolean;
  editPeriodModal: boolean;
  editPeriodData: any;
  selectedGroupPeriod: any;
}

export interface ILoadTutorSchedulesSuccess {
  result: IFindSchedulesResult;
}

export interface IChangeCreateGroupTuitionInput {
  data: {
    country?: string;
    subject?: string;
    level?: string;
    grade?: string;
    hourlyRate?: number;
    session?: number;
    hourPerSession?: number;
    minClassSize?: number;
    maxClassSize?: number;
    startReg?: any;
    endReg?: any;
    period?: any;
  }
}

export interface IChangeUpdateGroupTuitionInput {
  data : {
    _id : string;
    course : {
      country?: string;
      subject?: string;
      level?: string;
      grade?: string;
      hourlyRate?: number;
      session?: number;
      hourPerSession?: number;
      minClassSize?: number;
      maxClassSize?: number;
      startReg?: any;
      endReg?: any;
    },
    period?: any;
  }
}

export interface ISelectEventPayload {
  selectedEvent: any;
}

export interface IDeleteUpdatePeriodInput {
  _id: string;
  period_id: string;
}

export interface IChangePeriodDataPayload {
  data: {
    _id: string;
    start: string;
    end: string;
  }
}

export interface IChangeSelectedGroupPeriod {
  data: {
    _id: string;
    start: string;
    end: string;
  }
}

export interface IChangePeriodsPayload {
  data: {
    _id: string;
    period: any;
  }
}