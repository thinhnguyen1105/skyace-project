import { createModel, ModelConfig } from '@rematch/core';
import { message } from 'antd';
import { ITutorPageState, ISelectEvent, IEventInfoChange, IUpdateScheduleInput, IUpdateScheduleSuccess, IDeleteScheduleInput, ISaveDeleteScheduleSuccess, IFetchDataSuccess, IErrorHappen, ICreateScheduleOptionChange, IOPenModal, ISaveNewScheduleSuccess, IFindSchedulesInput, ISaveNewSchedule, ISaveMultipleSchedulesInput, IDeleteScheduleOptionChange, IDeleteRepeatSchedulesInput, IDetectStudentBooking } from './interface';
import { getTutorSchedulesService } from '../../../../service-proxies';

const tutorSchedulePageModel: ModelConfig<ITutorPageState> = createModel({
  state: {
    data: [],
    selectedEvent: {},
    existedBookingInfo: {
      number: 0,
      canDeleteSchedule: [],
    },

    createScheduleOption: '',
    deleteScheduleOption: '',
    newSchedule: {},
    deleteSchedule: {},

    isBusy: false,
    repeatModalVisible: false,
    deleteModalVisible: false,
    existedBookingModalVisible: false,

    errorMessage: '',
    statusView: 'week',
  },
  reducers: {
    openExistedBookingModal: (state: ITutorPageState, payload: any): ITutorPageState => {
      return {
        ...state,
        deleteModalVisible: false,
        existedBookingModalVisible: true,
        existedBookingInfo: payload,
      };
    },
    closeExistedBookingModal: (state: ITutorPageState): ITutorPageState => {
      return {
        ...state,
        deleteModalVisible: false,
        existedBookingModalVisible: false,
        existedBookingInfo: {
          number: 0,
          canDeleteSchedule: [],
        },
        isBusy: false,
        deleteSchedule: {},
        data: state.data.filter((item) => state.existedBookingInfo.canDeleteSchedule.indexOf(item._id) === -1).filter((item) => (state.deleteSchedule as any)._id !== item._id),
      };
    },
    createScheduleOptionChange: (state: ITutorPageState, payload: ICreateScheduleOptionChange): ITutorPageState => {
      return {
        ...state,
        createScheduleOption: payload.createScheduleOption
      };
    },
    deleteScheduleOptionChange: (state: ITutorPageState, payload: IDeleteScheduleOptionChange): ITutorPageState => {
      return {
        ...state,
        deleteScheduleOption: payload.deleteScheduleOption
      };
    },
    openRepeatModal: (state: ITutorPageState, payload: IOPenModal): ITutorPageState => {
      return {
        ...state,
        repeatModalVisible: true,
        newSchedule: payload,
      };
    },
    closeRepeatModal: (state: ITutorPageState): ITutorPageState => {
      return {
        ...state,
        repeatModalVisible: false,
        createScheduleOption: '',
        newSchedule: {},
      };
    },
    openDeleteModal: (state: ITutorPageState, payload: IOPenModal): ITutorPageState => {
      return {
        ...state,
        deleteModalVisible: true,
        deleteSchedule: payload,
      };
    },
    closeDeleteModal: (state: ITutorPageState): ITutorPageState => {
      return {
        ...state,
        deleteModalVisible: false,
        deleteScheduleOption: '',
        deleteSchedule: {},
      };
    },
    errorHappen: (state: ITutorPageState, payload: IErrorHappen): ITutorPageState => {
      return {
        ...state,
        isBusy: false,
        errorMessage: payload.errorMessage ? payload.errorMessage : '',
      };
    },
    starting: (state: ITutorPageState): ITutorPageState => {
      return {
        ...state,
        isBusy: true,
      };
    },
    selectEvent: (state: ITutorPageState, payload: ISelectEvent): ITutorPageState => {
      return {
        ...state,
        selectedEvent: payload.selectedEvent,
        errorMessage: '',
      };
    },
    eventInfoChange: (state: ITutorPageState, payload: IEventInfoChange): ITutorPageState => {
      return {
        ...state,
        selectedEvent: {
          ...state.selectedEvent,
          ...payload.newEventInfo,
        },
      };
    },
    fetchDataSuccess: (state: ITutorPageState, payload: IFetchDataSuccess): ITutorPageState => {
      return {
        ...state,
        data: payload.result.data,
        isBusy: false,
        errorMessage: '',
      };
    },

    changeViewCalendar: (state: ITutorPageState, payload: string): ITutorPageState => {
      return {
        ...state,
        statusView: payload,
      };
    },
    saveNewScheduleSuccess: (state: ITutorPageState, payload: ISaveNewScheduleSuccess): ITutorPageState => {
      return {
        ...state,
        data: [...state.data, payload.newSchedule],
        isBusy: false,
        repeatModalVisible: false,
        createScheduleOption: '',
        errorMessage: '',
        selectedEvent: {},
        newSchedule: {},
      };
    },
    saveMultipleScheduleSuccess: (state: ITutorPageState, _payload: ISaveNewScheduleSuccess): ITutorPageState => {
      return {
        ...state,
        data: [...state.data],
        isBusy: false,
        repeatModalVisible: false,
        createScheduleOption: '',
        errorMessage: '',
        selectedEvent: {},
        newSchedule: {},
      };
    },
    updateScheduleSuccess: (state: ITutorPageState, payload: IUpdateScheduleSuccess): ITutorPageState => {
      return {
        ...state,
        data: state.data.map((event) => {
          if (event._id === payload.scheduleInfo._id) {
            return {
              ...event,
              ...payload.scheduleInfo,
            };
          } else {
            return event;
          }
        }),
        selectedEvent: {},
        isBusy: false,
        errorMessage: '',
      };
    },
    saveDeleteScheduleSuccess: (state: ITutorPageState, payload: ISaveDeleteScheduleSuccess): ITutorPageState => {
      return {
        ...state,
        data: state.data.filter((item) => item._id !== payload.scheduleId),
        isBusy: false,
        errorMessage: '',
        selectedEvent: {},
        deleteScheduleOption: '',
        deleteSchedule: {},
        deleteModalVisible: false,
      };
    },
    detectStudentBooking: (state: ITutorPageState, payload: IDetectStudentBooking): ITutorPageState => {
      return {
        ...state,
        existedBookingModalVisible: true,
        existedBookingInfo: {
          number: payload.existedBookingInfo.number,
          canDeleteSchedule: payload.existedBookingInfo.canDeleteSchedules,
        },
      };
    },
  },
  effects: {
    async fetchData(payload: IFindSchedulesInput, _rootState: any): Promise<void> {
      try {
        this.starting();

        const tutorSchedulesService = getTutorSchedulesService();
        const result = await tutorSchedulesService.find(
          payload.start,
          payload.end,
          payload.tutorId
        );

        this.fetchDataSuccess({ result });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async saveNewSchedule(payload: ISaveNewSchedule, _rootState: any): Promise<void> {
      try {
        this.starting();

        const tutorSchedulesService = getTutorSchedulesService();
        const newSchedule = await tutorSchedulesService.create(payload as any);

        this.saveNewScheduleSuccess({ newSchedule });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async saveMultipleSchedules(payload: ISaveMultipleSchedulesInput, _rootState: any): Promise<void> {
      try {
        this.starting();

        const tutorSchedulesService = getTutorSchedulesService();
        await tutorSchedulesService.createMultipleSchedules(payload as any);

        this.saveMultipleScheduleSuccess();
        message.success(`Repeat schedules every week success`, 3);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async updateSchedule(payload: IUpdateScheduleInput, _rootstate: any): Promise<void> {
      try {
        this.starting();

        const tutorSchedulesService = getTutorSchedulesService();
        await tutorSchedulesService.update(payload as any);

        this.updateScheduleSuccess({ scheduleInfo: payload });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async saveDeleteSchedule(payload: IDeleteScheduleInput, _rootstate: any): Promise<void> {
      try {
        this.starting();

        const tutorSchedulesService = getTutorSchedulesService();
        await tutorSchedulesService.delete(payload.schedule);

        this.saveDeleteScheduleSuccess({ scheduleId: payload.schedule._id });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async saveDeleteRepeatSchedules(payload: IDeleteRepeatSchedulesInput, _rootState: any): Promise<void> {
      try {
        this.starting();

        const tutorSchedulesService = getTutorSchedulesService();
        const result = await tutorSchedulesService.deleteRepeatSchedules(payload.baseSchedule);

        if (result) {
          this.detectStudentBooking({existedBookingInfo: result});
        } else {
          this.closeExistedBookingModal();
        }
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async proceedDeleteSchedules(payload: any, _rootstate: any): Promise<void> {
      try {
        this.starting();

        const tutorSchedulesService = getTutorSchedulesService();
        await tutorSchedulesService.deleteMany(payload.scheduleId);

        this.closeExistedBookingModal();
      } catch (error) {
        message.error(error.message, 4);
      }
    }
  },
});

export default tutorSchedulePageModel;