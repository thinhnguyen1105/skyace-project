import { createModel, ModelConfig } from '@rematch/core';
import { IMyTuiionPageState, IViewTypeChange, IFetchDataSuccess, IFetchData, IFilterChange, IFetchUpcomingTuitionsSuccess, IFetchNewestBookingsSuccess } from './interface';
import { IFindTuitionsResult } from 'api/modules/elearning/tuitions/interface';
import { message } from 'antd';
import { getTuitionsService } from '../../../../service-proxies';

const tutorDashboardPageModel: ModelConfig<IMyTuiionPageState> = createModel({
  state: {
    isBusy: false,
    viewType: 'current',

    data: [],
    upcomingTuitions: [],
    newestBookings: [],
    total: 0,

    pageNumber: 1,
    pageSize: 5,
    sortBy: 'createdAt',
    asc: true,
    isCompletedSpin: '',
    dataCancel: [],
    dob: '',
    courseForTutor: undefined,
    schedulesForTuTor: undefined,
  },
  reducers: {
    cleanState: (state: IMyTuiionPageState): IMyTuiionPageState => {
      return {
        ...state,
        isBusy: false,
        viewType: 'current',
        data: [],
        upcomingTuitions: [],
        newestBookings: [],
        total: 0,

        pageNumber: 1,
        pageSize: 5,
        sortBy: 'createdAt',
        asc: true,
        isCompletedSpin: '',
        dataCancel: [],
        dob: '',
        courseForTutor: undefined,
        schedulesForTuTor: undefined,
      }
    },
    starting: (state: IMyTuiionPageState): IMyTuiionPageState => {
      return {
        ...state,
        isBusy: true
      };
    },
    viewTypeChange: (state: IMyTuiionPageState, payload: IViewTypeChange): IMyTuiionPageState => {
      return {
        ...state,
        viewType: payload.newViewType,
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdBy',
        asc: true,
      };
    },
    fetchDataUserSuccess: (state: IMyTuiionPageState, payload: any): IMyTuiionPageState => {
      return {
        ...state,
        dob: payload.infoUser.dob,
        courseForTutor: payload.courses,
        schedulesForTuTor: payload.schedules,
      };
    },
    fetchDataSuccess: (state: IMyTuiionPageState, payload: IFetchDataSuccess): IMyTuiionPageState => {
      return {
        ...state,
        data: payload.result.data,
        total: payload.result.total,
        isBusy: false,
      };
    },
    fetchDataSuccessCancel: (state: IMyTuiionPageState, payload: IFetchDataSuccess): IMyTuiionPageState => {
      return {
        ...state,
        dataCancel: payload.result.data,
      };
    },
    handleFilterChange: (state: IMyTuiionPageState, payload: IFilterChange): IMyTuiionPageState => {
      return {
        ...state,
        ...payload,
      };
    },
    fetchUpcomingTuitionsSuccess: (state: IMyTuiionPageState, payload: IFetchUpcomingTuitionsSuccess): IMyTuiionPageState => {
      return {
        ...state,
        upcomingTuitions: payload.result
      };
    },
    fetchNewestBookingsSuccess: (state: IMyTuiionPageState, payload: IFetchNewestBookingsSuccess): IMyTuiionPageState => {
      return {
        ...state,
        newestBookings: payload.result
      };
    },
    completedSpin: (state: IMyTuiionPageState, payload: string): IMyTuiionPageState => {
      return {
        ...state,
        isCompletedSpin: payload
      };
    },
  },
  effects: {
    async fetchData(payload: IFetchData, _rootState: any): Promise<void> {
      try {
        this.starting();

        const tuitionsService = getTuitionsService();
        let result: IFindTuitionsResult;
        if (payload.isStudent) {
          result = await tuitionsService.findByStudentId(
            payload.userId,
            payload.isFinished,
            payload.pageNumber,
            payload.pageSize,
            payload.sortBy,
            payload.asc,
            payload.isCanceled
          );
        } else {
          result = await tuitionsService.findByTutorId(
            payload.userId,
            payload.isFinished,
            payload.pageNumber,
            payload.pageSize,
            payload.sortBy,
            payload.asc,
            payload.isCanceled
          );
        }

        this.fetchDataSuccess({ result });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async fetchDataCancelStudent(payload: IFetchData, _rootState: any): Promise<void> {
      try {
        this.starting();

        const tuitionsService = getTuitionsService();
        let result: IFindTuitionsResult;
        result = await tuitionsService.findCancelTuitionStudent(
          payload.userId,
          payload.isFinished,
          payload.pageNumber,
          payload.pageSize,
          payload.sortBy,
          payload.asc
        );
        this.fetchDataSuccessCancel({ result });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async fetchDataCancelTutor(payload: IFetchData, _rootState: any): Promise<void> {
      try {
        this.starting();

        const tuitionsService = getTuitionsService();
        let result: IFindTuitionsResult;
        result = await tuitionsService.findCancelTuitionTutor(
          payload.userId,
          payload.isFinished,
          payload.pageNumber,
          payload.pageSize,
          payload.sortBy,
          payload.asc
        );
        this.fetchDataSuccessCancel({ result });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
  },
});

export default tutorDashboardPageModel;