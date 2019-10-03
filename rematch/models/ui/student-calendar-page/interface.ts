import { IFindTuitionDetail } from "../../../../api/modules/elearning/tuitions/interface";

export interface IStudentCalendarPageState {
  isBusy: boolean;
  tuitionList: IFindTuitionDetail[];
}

export interface IGetStudentTuitionsPayload {
  studentId: string;
  isCompleted?: boolean;
  isCanceled?: boolean;
}

export interface IGetStudentTuitionsSuccessPayload {
  tuitionList: IFindTuitionDetail[];
}