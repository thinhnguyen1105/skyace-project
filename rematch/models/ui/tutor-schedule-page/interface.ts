import { IFindScheduleDetail, IFindSchedulesResult } from "../../../../api/modules/elearning/schedules/interface";

export interface ITutorPageState {
  data: IFindScheduleDetail[];
  selectedEvent: any;
  existedBookingInfo: {
    number: number;
    canDeleteSchedule: string[];
  };

  createScheduleOption: string;
  deleteScheduleOption: string;
  newSchedule: any;
  deleteSchedule: IFindScheduleDetail|{};

  isBusy: boolean;
  repeatModalVisible: boolean;
  deleteModalVisible: boolean;
  existedBookingModalVisible: boolean;

  errorMessage: string;
  statusView: string;
}

export interface ISelectEvent {
  selectedEvent: IFindScheduleDetail;
}

export interface IEventInfoChange {
  newEventInfo: any;
}

export interface ISaveNewSchedule{
  start: Date;
  end: Date;
  type: string;
  owner: string;
  status: string;
  baseOn: string;
}

export interface IUpdateScheduleInput {
  _id: number;
  start?: Date;
  end?: Date;
  type?: string;
  owner?: string;
}

export interface ISaveNewScheduleSuccess {
  newSchedule: IFindScheduleDetail;
}

export interface IUpdateScheduleSuccess {
  scheduleInfo: any;
}

export interface IDeleteScheduleInput {
  schedule: IFindScheduleDetail;
}

export interface ISaveDeleteScheduleSuccess {
  scheduleId: string;
}

export interface IFetchDataSuccess {
  result: IFindSchedulesResult;
}

export interface IErrorHappen {
  errorMessage: string;
}

export interface ICreateScheduleOptionChange {
  createScheduleOption: string;
}

export interface IOPenModal {
  start: Date;
  end: Date;
  type: string;
  owner: string;
  status: string;
}

export interface IFindSchedulesInput {
  start: Date;
  end: Date;
  tutorId: string;
}

export interface ISaveMultipleSchedulesInput {
  scheduleList: ISaveNewSchedule[]
}

export interface IDeleteScheduleOptionChange {
  deleteScheduleOption: string;
}

export interface IDeleteRepeatSchedulesInput {
  baseSchedule: IFindScheduleDetail;
}

export interface IDetectStudentBooking {
  existedBookingInfo: {
    canDeleteSchedules: string[];
    number: number;
  }
}