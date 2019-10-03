import { createModel, ModelConfig } from '@rematch/core';
import { message } from 'antd';
import {
  IInformationTutorPageState,
  ILoadTutorSchedulesSuccess,
  ISelectEventPayload,
  IUpdateStudentBooking,
  ICreateNewBooking,
  ISaveBookings,
  IDeleteBooking,
  IEventInfoChange,
  ISelectCourse,
  IErrorHappen,
  ICreateMultipleBookings,
  ICurrentTuition,
  ICurrentTuitionInfo,
  IPaymentOptionChange,
  IClosePaymentModal,
  IRepeatOptionChange,
  IRequireOptionChange,
  IRequireMoreLessonsChanage,
  IDetectUnqualifiedBookings,
  IBookingGroupTuitionInput
} from './interface';
import { getTutorSchedulesService, getTuitionsService, getUsersService, getSessionsService, getConversationService } from '../../../../service-proxies';
import { IFindSchedulesQuery } from '../../../../api/modules/elearning/schedules/interface';
import firebase from 'firebase';
import initFirebaseApp from '../../../../nextjs/helpers/init-firebase';

const informationTutorPageModel: ModelConfig<IInformationTutorPageState> = createModel({
  state: {
    isBusy: false,
    errorMessage: '',
    addSessionModalVisible: false,
    availbleTimeModalVisible: false,
    paymentModelVisible: false,
    repeatModalVisible: false,
    selectedEvent: {},
    schedulesData: [],
    newBookings: [],
    selectedCourse: {},
    detectUnqualifiedBooking: {
      unqualifiedBookingsModalVisible: false,
      unqualifiedBookings: [],
    },
    statusButtonWhite: false,
    statusButtonBlue: true,
    currentBookings: [],
    sessionsResult: [],
    newTuition: {},
    loginAlertModalVisible: false,
    loginModalVisible: false,
    resetPasswordModalVisible: false,
    registerModalVisible: false,
    registerSuccessModalVisible: false,
    requireModalVisible: false,
    sessionExpiredModalVisible: false,
    buttonSave: 'Save & Next',
    isBookedTrial: false,
    paymentOption: '',
    repeatOption: '',
    requireOption: '',
    requireMoreLessons: 0,
    ratings: {
      data: [],
      total: 0,
      stars: {
        five: 0,
        four: 0,
        three: 0,
        two: 0,
        one: 0
      },
    },
    resultNewSchedule: [],
    numberOfLessonsRequiredMore: 0,
    trialSchedulesOfStudent: [],
    promoCodeInput: "",
    promoCode: null,
    outsideAcademicYearBookings: []
  },
  reducers: {
    'loginPageModel/onLoginSuccess': (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        loginModalVisible: false,
      };
    },
    clearState: (_state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        isBusy: false,
        errorMessage: '',
        addSessionModalVisible: false,
        availbleTimeModalVisible: false,
        paymentModelVisible: false,
        repeatModalVisible: false,

        selectedEvent: {},

        schedulesData: [],
        newBookings: [],

        selectedCourse: {},
        detectUnqualifiedBooking: {
          unqualifiedBookingsModalVisible: false,
          unqualifiedBookings: [],
        },
        statusButtonWhite: false,
        statusButtonBlue: true,
        currentBookings: [],
        sessionsResult: [],
        newTuition: {},
        loginAlertModalVisible: false,
        loginModalVisible: false,
        resetPasswordModalVisible: false,
        registerModalVisible: false,
        registerSuccessModalVisible: false,
        requireModalVisible: false,
        sessionExpiredModalVisible: false,
        buttonSave: 'Save & Next',
        isBookedTrial: false,
        paymentOption: '',
        repeatOption: '',
        requireOption: '',
        requireMoreLessons: 0,
        ratings: {
          data: [],
          total: 0,
          stars: {
            five: 0,
            four: 0,
            three: 0,
            two: 0,
            one: 0
          }
        },
        resultNewSchedule: [],
        numberOfLessonsRequiredMore: 0,
        trialSchedulesOfStudent: [],
        promoCodeInput: "",
        promoCode: null,
        outsideAcademicYearBookings: []
      };
    },
    openSessionExpiredModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        sessionExpiredModalVisible: true,
      };
    },
    closeSessionExpiredModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        sessionExpiredModalVisible: false,
      };
    },
    openResetPasswordModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        resetPasswordModalVisible: true,
        loginModalVisible: false,
      };
    },
    closeResetPasswordModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        resetPasswordModalVisible: false,
        loginModalVisible: false,
      };
    },
    requireMoreLessonsChange: (state: IInformationTutorPageState, payload: IRequireMoreLessonsChanage): IInformationTutorPageState => {
      return {
        ...state,
        requireMoreLessons: payload.numberOfLessons,
      };
    },
    changeNumberOfLessonsRequiredMore: (state: IInformationTutorPageState, payload: number): IInformationTutorPageState => {
      return {
        ...state,
        numberOfLessonsRequiredMore: state.numberOfLessonsRequiredMore + payload
      }
    },
    openRequireModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        requireModalVisible: true,
      };
    },
    closeRequireModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        requireModalVisible: false,
        requireOption: 'moreLessons',
        requireMoreLessons: state.selectedCourse.course.session,
      };
    },
    requireOptionChange: (state: IInformationTutorPageState, payload: IRequireOptionChange): IInformationTutorPageState => {
      return {
        ...state,
        requireOption: payload.requireOption,
        requireMoreLessons: payload.requireOption === 'moreLessons' ? state.selectedCourse.course.session : 0,
      };
    },
    repeatOptionChange: (state: IInformationTutorPageState, payload: IRepeatOptionChange): IInformationTutorPageState => {
      return {
        ...state,
        repeatOption: payload.repeatOption,
      };
    },
    paymentOptionChange: (state: IInformationTutorPageState, payload: IPaymentOptionChange): IInformationTutorPageState => {
      return {
        ...state,
        paymentOption: payload.paymentOption,
      };
    },
    openLoginModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        loginModalVisible: true,
        registerModalVisible: false,
        registerSuccessModalVisible: false,
        loginAlertModalVisible: false,
      };
    },
    bookedTrialTuition: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        isBookedTrial: true,
      };
    },
    updateNameOfButtonSave: (state: IInformationTutorPageState, payload: any): IInformationTutorPageState => {
      return {
        ...state,
        buttonSave: payload,
      };
    },
    closeLoginModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        loginModalVisible: false,
      };
    },
    openRegisterModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        loginModalVisible: false,
        registerModalVisible: true,
        registerSuccessModalVisible: false,
        loginAlertModalVisible: false,
      };
    },
    closeRegisterModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        registerModalVisible: false,
      };
    },
    openRegisterSuccessModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        loginModalVisible: false,
        registerModalVisible: false,
        registerSuccessModalVisible: true,
      };
    },
    closeLoginSuccessModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        registerSuccessModalVisible: false,
      };
    },
    errorHappen: (state: IInformationTutorPageState, payload: IErrorHappen): IInformationTutorPageState => {
      return {
        ...state,
        errorMessage: payload.errorMessage,
      };
    },
    openPaymentModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        paymentModelVisible: true,
        requireModalVisible: false,
      };
    },
    closePaymentModal: (state: IInformationTutorPageState, payload: IClosePaymentModal): IInformationTutorPageState => {
      return {
        ...state,
        paymentModelVisible: false,
        isBusy: false,
        schedulesData: state.schedulesData.filter((item) => payload.discardSchedules.indexOf(item._id) === -1),
      };
    },
    closeGroupPaymentModal: (state: IInformationTutorPageState) : IInformationTutorPageState => {
      return {
        ...state,
        paymentModelVisible: false,
        isBusy: false
      }
    },
    starting: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        isBusy: true,
      };
    },
    loadTutorSchedulesSuccess: (state: IInformationTutorPageState, payload: ILoadTutorSchedulesSuccess): IInformationTutorPageState => {
      return {
        ...state,
        schedulesData: payload.result.data,
        isBusy: false,
      };
    },
    trialSchedulesStudent: (state: IInformationTutorPageState, payload: any): IInformationTutorPageState => {
      return {
        ...state,
        trialSchedulesOfStudent: payload,
      };
    },
    selectEvent: (state: IInformationTutorPageState, payload: ISelectEventPayload): IInformationTutorPageState => {
      return {
        ...state,
        selectedEvent: payload.selectedEvent,
      };
    },
    updateStudentBookings: (state: IInformationTutorPageState, payload: IUpdateStudentBooking): IInformationTutorPageState => {
      return {
        ...state,
        newBookings: state.newBookings.map((item) => {
          if (payload.bookingInfo.index === item.index) {
            return payload.bookingInfo;
          } else {
            return item;
          }
        }),
        selectedEvent: {},
      };
    },
    createNewBooking: (state: IInformationTutorPageState, payload: ICreateNewBooking): IInformationTutorPageState => {
      return {
        ...state,
        newBookings: [...state.newBookings, payload.bookingInfo],
        repeatModalVisible: state.selectedCourse.course.session - state.newBookings.length === 1 ? false : state.newBookings.length % 4 === 0 ? true : false,
        selectedEvent: {},
      };
    },
    saveCurrentTuition: (state: IInformationTutorPageState, payload: ICurrentTuition): IInformationTutorPageState => {
      return {
        ...state,
        currentBookings: payload.bookingResult,
      };
    },
    saveBookingsSuccess: (state: IInformationTutorPageState, payload: ILoadTutorSchedulesSuccess): IInformationTutorPageState => {
      return {
        ...state,
        resultNewSchedule: payload.result.data,
        schedulesData: [...state.schedulesData, ...payload.result.data],
        selectedEvent: {},
        isBusy: false,
        errorMessage: '',
        statusButtonWhite: true,
        statusButtonBlue: true,
      };
    },
    deleteBooking: (state: IInformationTutorPageState, payload: IDeleteBooking): IInformationTutorPageState => {
      return {
        ...state,
        newBookings: state.newBookings.filter((item) => item.index !== payload.bookingInfo.index),
        selectedEvent: {},
      };
    },
    eventInfoChange: (state: IInformationTutorPageState, payload: IEventInfoChange): IInformationTutorPageState => {
      return {
        ...state,
        selectedEvent: {
          ...state.selectedEvent,
          ...payload.newEventInfo,
        },
      };
    },
    selectCourse: (state: IInformationTutorPageState, payload: ISelectCourse): IInformationTutorPageState => {
      return {
        ...state,
        selectedCourse: payload.selectedCourse,
        detectUnqualifiedBooking: {
          unqualifiedBookingsModalVisible: false,
          unqualifiedBookings: [],
        },
        outsideAcademicYearBookings: [],
        numberOfLessonsRequiredMore: 0,
        errorMessage: '',
        newBookings: [],
        statusButtonBlue: false
      };
    },
    updateNewBooking: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        newBookings: state.newBookings.map((item, _index) => {
          if (item.index === (state.selectedEvent as any).index) {
            return {
              ...state.selectedEvent as any,
              start: new Date((state.selectedEvent as any).start),
              end: new Date((state.selectedEvent as any).end),
            };
          } else {
            return item;
          }
        }),
        selectedEvent: {},
      };
    },
    createMultilpleBookingsSuccess: (state: IInformationTutorPageState, payload: ICreateMultipleBookings): IInformationTutorPageState => {
      return {
        ...state,
        newBookings: [...state.newBookings, ...payload.newBookings],
        repeatModalVisible: false,
        requireModalVisible: false,
        requireOption: '',
        requireMoreLessons: state.selectedCourse.course.session,
        isBusy: false,
        detectUnqualifiedBooking: {
          ...state.detectUnqualifiedBooking,
          unqualifiedBookings: [],
        },
        outsideAcademicYearBookings: []
      };
    },
    createMultilpleBookingsSuccessForRepeat: (state: IInformationTutorPageState, payload: ICreateMultipleBookings): IInformationTutorPageState => {
      return {
        ...state,
        newBookings: [...state.newBookings, ...payload.newBookings],
        repeatModalVisible: false,
        requireModalVisible: false,
        isBusy: false,
        // detectUnqualifiedBooking: {
        //   unqualifiedBookingsModalVisible: false,
        //   unqualifiedBookings: [],
        // },
      };
    },
    detectUnqualifiedBookings: (state: IInformationTutorPageState, payload: IDetectUnqualifiedBookings): IInformationTutorPageState => {
      return {
        ...state,
        newBookings: [...state.newBookings, ...payload.qualifiedBookings].map((item, index) => ({ ...item, index })),
        repeatModalVisible: false,
        requireModalVisible: false,
        requireOption: 'moreLessons',
        requireMoreLessons: state.selectedCourse.course.session,
        isBusy: false,
        detectUnqualifiedBooking: {
          unqualifiedBookingsModalVisible: true,
          unqualifiedBookings: payload.unqualifiedBookings,
        },
      };
    },
    detectUnqualifiedBookingsForRepeat: (state: IInformationTutorPageState, payload: IDetectUnqualifiedBookings): IInformationTutorPageState => {
      return {
        ...state,
        newBookings: [...state.newBookings, ...payload.qualifiedBookings].map((item, index) => ({ ...item, index })),
        repeatModalVisible: false,
        requireModalVisible: false,
        isBusy: false,
        detectUnqualifiedBooking: {
          unqualifiedBookingsModalVisible: true,
          unqualifiedBookings: payload.unqualifiedBookings,
        },
      };
    },
    closeUnqualifiedBookingsModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        detectUnqualifiedBooking: {
          ...state.detectUnqualifiedBooking,
          unqualifiedBookingsModalVisible: false,
        },
      };
    },
    detectOutsideAcademicYearBookings: (state: IInformationTutorPageState, payload: any): IInformationTutorPageState => {
      return {
        ...state,
        outsideAcademicYearBookings: [...state.outsideAcademicYearBookings.filter((val) => new Date(val.start).getTime() !== new Date(payload.start).getTime() || new Date(val.end).getTime() !== new Date(payload.end).getTime()), payload],
      }
    },
    clearOutsideAcademicYearBookings: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        outsideAcademicYearBookings: []
      }
    },
    openDetectUnqualifiedModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        repeatModalVisible: false,
        requireModalVisible: false,
        detectUnqualifiedBooking: {
          ...state.detectUnqualifiedBooking,
          unqualifiedBookingsModalVisible: true,
        },
      }
    },
    openLoginAlertModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        loginAlertModalVisible: true
      };
    },
    closeLoginAlertModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        loginAlertModalVisible: false
      };
    },
    closeRepeatModal: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        repeatModalVisible: false,
      };
    },
    handleExtendTuition: (state: IInformationTutorPageState, payload: any): IInformationTutorPageState => {
      return {
        ...state,
        selectedCourse: payload,
      };
    },
    loadRatingSuccess: (state: IInformationTutorPageState, payload: any): IInformationTutorPageState => {
      return {
        ...state,
        ratings: {
          total: payload.total,
          data: [...state.ratings.data, ...payload.data],
          stars: payload.stars
        },
      }
    },
    changePromoCodeInput: (state: IInformationTutorPageState, payload: string): IInformationTutorPageState => {
      return {
        ...state,
        promoCodeInput: payload,
        promoCode: null
      }
    },
    changePromoCode: (state: IInformationTutorPageState, payload: any): IInformationTutorPageState => {
      return {
        ...state,
        promoCode: payload
      }
    },
    clearPromoCode: (state: IInformationTutorPageState): IInformationTutorPageState => {
      return {
        ...state,
        promoCode: null
      }
    }
  },
  effects: {
    async loadTutorSchedules(payload: IFindSchedulesQuery, _rootState: any): Promise<void> {
      try {
        this.starting();
        const tutorSchedulesService = getTutorSchedulesService();
        const result = await tutorSchedulesService.find(
          payload.start,
          payload.end,
          payload.tutorId
        );

        this.loadTutorSchedulesSuccess({
          result: {
            ...result,
            data: result.data,
          }
        });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async findSchedulesTrialOfStudent(payload: string, _rootState: any): Promise<void> {
      try {
        this.starting();
        const tutorSchedulesService = getTutorSchedulesService();
        const result = await tutorSchedulesService.trialScheduleByUserId(
          payload
        );
        this.trialSchedulesStudent(result.data);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async saveTrialBookings(payload: ISaveBookings, _rootstate: any): Promise<void> {
      try {
        this.starting();

        const tutorSchedulesService = getTutorSchedulesService();
        const bookings = await tutorSchedulesService.createStudentBookings({
          newBookings: payload.newBookings,
        });

        try {
          const tuitionsService = getTuitionsService();
          const sessionsService = getSessionsService();
          const conversationsService = getConversationService();

          const newTuition = await tuitionsService.createTuition(payload.newTuitionInfo as any);
          const newConversation = await conversationsService.createConversation({
            participants: [payload.newTuitionInfo.student, payload.newTuitionInfo.tutor],
            tuition: newTuition._id,
          } as any);

          const sessionsPromise = sessionsService.createSessions({
            sessionList: payload.newBookings.map((item) => ({
              course: payload.newTuitionInfo.course,
              courseForTutor: payload.newTuitionInfo.courseForTutor,
              tuition: newTuition._id,
              tutor: payload.newTuitionInfo.tutor,
              student: payload.newTuitionInfo.student,
              start: item.start,
              end: item.end,
              materials: [],
            } as any))
          });

          // Create new conversation
          if (!firebase.apps.length) {
            initFirebaseApp();
          }
          const notificationContent = `New course ${newTuition.referenceId} has been created`;
          const messagePromise = firebase.database().ref(`skyace-message/${newConversation._id}/messages`).push({
            sender: {
              id: 'system',
              fullName: 'system'
            },
            createdAt: new Date().getTime(),
            content: notificationContent,
            type: 'notification'
          });
          const notification1Promise = firebase.database().ref(`skyace-notification/${payload.newTuitionInfo.student}/${newConversation._id}`).update({
            seen: false,
            lastMessage: 'System Notification',
          });
          const notification2Promise = firebase.database().ref(`skyace-notification/${payload.newTuitionInfo.tutor}/${newConversation._id}`).update({
            seen: false,
            lastMessage: 'System Notification',
          });

          await Promise.all([sessionsPromise, messagePromise, notification1Promise, notification2Promise]);
        } catch (error) {
          console.log(error);
        }

        this.saveCurrentTuition({ bookingResult: bookings });
        this.saveBookingsSuccess({
          result: {
            ...bookings,
            data: bookings.data,
          }
        });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async saveBookings(payload: ISaveBookings, _rootstate: any): Promise<void> {
      try {
        this.starting();

        const tutorSchedulesService = getTutorSchedulesService();
        const bookings = await tutorSchedulesService.createStudentBookings({
          newBookings: payload.newBookings,
        });

        this.saveCurrentTuition({ bookingResult: bookings });
        this.saveBookingsSuccess({
          result: {
            ...bookings,
            data: bookings.data,
          }
        });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async deleteTuitionInfo(payload: ICurrentTuitionInfo, _rootstate: any): Promise<void> {
      try {
        this.starting();
        const tutorSchedulesService = getTutorSchedulesService();

        await Promise.all([
          tutorSchedulesService.deleteMany(payload.idCurrentBookings),
        ]);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async checkMultilpleBookings(payload: ICreateMultipleBookings, _rootState: any): Promise<void> {
      try {
        this.starting();

        const tutorSchedulesService = getTutorSchedulesService();
        const checkMultipleBookingsResult = await tutorSchedulesService.checkMultilpleBookings({
          newSchedules: payload.newBookings.map((item) => ({
            ...item,
            start: item.start.toUTCString(),
            end: item.end.toUTCString(),
          }))
        } as any);

        if (checkMultipleBookingsResult.unqualifiedBookings.length > 0) {
          this.detectUnqualifiedBookings(checkMultipleBookingsResult);
        } else {
          this.createMultilpleBookingsSuccess({ newBookings: checkMultipleBookingsResult.qualifiedBookings });
        }
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async checkMultipleBookingsForRepeat(payload: ICreateMultipleBookings, _rootState: any): Promise<void> {
      try {
        this.starting();

        const tutorSchedulesService = getTutorSchedulesService();
        const checkMultipleBookingsResult = await tutorSchedulesService.checkMultilpleBookings({
          newSchedules: payload.newBookings.map((item) => ({
            ...item,
            start: item.start.toUTCString(),
            end: item.end.toUTCString(),
          }))
        } as any);

        if (checkMultipleBookingsResult.unqualifiedBookings.length > 0) {
          this.detectUnqualifiedBookingsForRepeat(checkMultipleBookingsResult);
        } else {
          this.createMultilpleBookingsSuccessForRepeat({ newBookings: checkMultipleBookingsResult.qualifiedBookings });
        }
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async holdSlot(payload: IBookingGroupTuitionInput): Promise<void> {
      try {
        const tuitionsService = getTuitionsService();
        await tuitionsService.holdSlot(payload);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async cancelSlot(payload: IBookingGroupTuitionInput): Promise<void> {
      try {
        const tuitionsService = getTuitionsService();
        await tuitionsService.cancelSlot(payload);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async loadMoreRatings(payload: any): Promise<void> {
      try {
        const usersService = getUsersService();
        const ratings = await usersService.getRatings({
          userId: payload.userId,
          pageSize: payload.pageSize,
          pageNumber: payload.pageNumber
        });
        this.loadRatingSuccess(ratings);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
  },
});

export default informationTutorPageModel;
