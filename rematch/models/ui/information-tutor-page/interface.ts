import { IFindScheduleDetail, IFindSchedulesResult, ICreateScheduleInput } from "../../../../api/modules/elearning/schedules/interface";

export interface IInformationTutorPageState {
  isBusy: boolean;
  errorMessage: string;
  addSessionModalVisible: boolean;
  availbleTimeModalVisible: boolean;
  paymentModelVisible: boolean;
  selectedEvent: IStudentBooking | {};

  schedulesData: IFindScheduleDetail[];
  newBookings: IStudentBooking[];

  selectedCourse: any;
  detectUnqualifiedBooking: {
    unqualifiedBookingsModalVisible: boolean;
    unqualifiedBookings: IStudentBooking[];
  };
  statusButtonWhite: boolean;
  statusButtonBlue: boolean;
  currentBookings: ICurrentBookingDetail[];
  sessionsResult: ICurrentSessionDetail[];
  newTuition: object;
  loginAlertModalVisible: boolean;
  buttonSave: string;
  isBookedTrial: boolean;
  loginModalVisible: boolean;
  resetPasswordModalVisible: boolean;
  registerModalVisible: boolean;
  registerSuccessModalVisible: boolean;
  repeatModalVisible: boolean;
  requireModalVisible: boolean;
  sessionExpiredModalVisible: boolean;
  paymentOption: string;
  repeatOption: string;
  requireOption: string;
  requireMoreLessons: number;
  ratings: {
    data: any;
    total: number;
    stars: any;
  };
  resultNewSchedule: any;
  numberOfLessonsRequiredMore: number;
  trialSchedulesOfStudent: any [];
  promoCodeInput: string;
  promoCode: any;
  outsideAcademicYearBookings: any;
}

export interface ICurrentTuition {
  bookingResult: ICurrentBookingDetail[];
}

export interface ICurrentNewTuition {
  course: string;
  courseForTutor: string;
  createdAt: string;
  isActive: boolean;
  isCanceled: boolean;
  isFinished: boolean;
  student: string;
  tenant: string;
  tutor: string;
  _v: number;
  _id: string;
}
export interface ICurrentSessionDetail {
  course: string;
  courseForTutor: string;
  createdAt: string;
  end: string;
  materials: Array<object>;
  start: string;
  student: string;
  tenant: string;
  tuition: string;
  tutor: string;
  _v: number;
  _id: string;
}
export interface ICurrentTuitionInfo {
  idCurrentBookings: string[];
}
export interface ICurrentBookingDetail {
  createdAt: string;
  end: Date;
  owner: string;
  parent: string;
  start: Date;
  status: string;
  tenant: string;
  type: string;
  _v: number;
  _id: string;
}
export interface IStudentBooking {
  index: number;
  start: Date;
  end: Date;
  type: string;
  owner: string;
  parent: string;
  status: string;
}

export interface ILoadTutorSchedulesSuccess {
  result: IFindSchedulesResult;
}

export interface ISelectEventPayload {
  selectedEvent: IStudentBooking;
}

export interface IUpdateStudentBooking {
  bookingInfo: IStudentBooking;
}

export interface ICreateNewBooking {
  bookingInfo: IStudentBooking;
}

export interface ISaveBookings {
  newBookings: ICreateScheduleInput[];
  newTuitionInfo: {
    courseForTutor: string;
    course: string;
    tutor: string;
    student: string;
  };
}

export interface IDeleteBooking {
  bookingInfo: IStudentBooking;
}

export interface IBookTuitionActiveKeyChange {
  newActiveKey: string;
}

export interface ILoadTutorCourses {
  tutorId: string;
}

export interface IEventInfoChange {
  newEventInfo: any;
}

export interface ISelectCourse {
  selectedCourse: any;
}

export interface IErrorHappen {
  errorMessage: string;
}

export interface ICreateMultipleBookings {
  newBookings: IStudentBooking[];
}

export interface IRepeatBookingInfo {
  avaibleBookings: number;
  allowedBookings: IStudentBooking[];
}

export interface IPaymentOptionChange {
  paymentOption: string;
}

export interface IClosePaymentModal {
  discardSchedules: string[];
}

export interface IRepeatOptionChange {
  repeatOption: string;
}

export interface IRequireOptionChange {
  requireOption: string;
}

export interface IRequireMoreLessonsChanage {
  numberOfLessons: number;
}

export interface IDetectUnqualifiedBookings {
  qualifiedBookings: IStudentBooking[],
  unqualifiedBookings: IStudentBooking[],
}

export interface IBookingGroupTuitionInput {
  tuition_id: string;
  student_id: string;
}