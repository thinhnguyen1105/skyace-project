import { createModel, ModelConfig } from '@rematch/core';
import { message } from 'antd';
import { getTutorSchedulesService, getTuitionsService } from '../../../../service-proxies';
import { IFindSchedulesQuery } from '../../../../api/modules/elearning/schedules/interface';
import { ICreateGroupTuitionInput, IUpdateGroupTuitionInput } from '../../../../api/modules/elearning/group-tuitions/interface';
import {
  ITutoringPageState,
  ILoadTutorSchedulesSuccess,
  IChangeCreateGroupTuitionInput,
  ISelectEventPayload,
  IDeleteUpdatePeriodInput,
  IChangePeriodDataPayload,
  IChangeSelectedGroupPeriod,
  IChangePeriodsPayload,
  IChangeUpdateGroupTuitionInput
} from './interface';
import moment from 'moment';

const tutoringPageModel: ModelConfig<ITutoringPageState> = createModel({
  state: {
    isBusy: false,
    tutorInfo: [],
    createGroupTuitionInput: {
      country: "",
      subject: "",
      level: "",
      grade: "",
      hourlyRate: 0,
      session: 0,
      hourPerSession: 0,
      minClassSize: 2,
      maxClassSize: 2,
      startReg: moment(),
      endReg: moment().add(14, 'days'),
      period: [],
    },
    createGroupModal: false,
    selectedEvent: {},
    schedulesData: [],
    groupTuitions: [],
    editPeriodModal: false,
    editPeriodData: null,
    selectedGroupPeriod: []
  },
  reducers: {
    starting: (state: ITutoringPageState): ITutoringPageState => {
      return {
        ...state,
        isBusy: true,
      };
    },
    loadTutorSchedulesSuccess: (state: ITutoringPageState, payload: ILoadTutorSchedulesSuccess): ITutoringPageState => {
      return {
        ...state,
        schedulesData: payload.result.data,
        isBusy: false,
      };
    },
    toggleCreateGroupModal: (
      state: ITutoringPageState,
      payload: boolean
    ): ITutoringPageState => {
      return {
        ...state,
        createGroupModal: payload
      }
    },
    changeCreateGroupTuitionInput: (state: ITutoringPageState, payload: IChangeCreateGroupTuitionInput): ITutoringPageState => {
      if(!payload.data.period) {
        return {
          ...state,
          createGroupTuitionInput : {...state.createGroupTuitionInput, ...payload.data}
        }
      } else {
        return {
          ...state,
          createGroupTuitionInput : {...state.createGroupTuitionInput, period: [...state.createGroupTuitionInput.period, payload.data.period]}
        }
      }
    },
    changeUpdateGroupTuitionInput: (state: ITutoringPageState, payload: IChangeUpdateGroupTuitionInput) : ITutoringPageState => {
      if(!payload.data.period) {
        if (!payload.data.course){
          return {
            ...state,
            groupTuitions : state.groupTuitions.map(val => {
              return val._id === payload.data._id ? {...val, ...payload.data} : val;
            }) as any
          }
        } else {
          return {
            ...state,
            groupTuitions : state.groupTuitions.map(val => {
              return val._id === payload.data._id ? {...val, course: {...val.course, ...payload.data.course}} : val;
            })
          }
        }
      } else {
        if (!payload.data.course) {
          return {
            ...state,
            groupTuitions : state.groupTuitions.map(val => {
              return val._id === payload.data._id ? {
                ...val,
                ...payload.data,
                period: [...val.period, payload.data.period]
              } : val
            }) as any
          }
        } else {
          return {
            ...state,
            groupTuitions : state.groupTuitions.map(val => {
              return val._id === payload.data._id ? {...val, course: {...val.course, ...payload.data.course}} : val;
            })
          }
        }
      }
    },
    deleteUpdatePeriod: (state: ITutoringPageState, payload: IDeleteUpdatePeriodInput) : ITutoringPageState => {
      return {
        ...state,
        groupTuitions: state.groupTuitions.map(val => {
          return val._id === payload._id ? {...val, period: val.period.filter(value => value._id !== payload.period_id )} : val;
        })
      }
    },
    selectEvent: (state: ITutoringPageState, payload: ISelectEventPayload): ITutoringPageState => {
      return {
        ...state,
        selectedEvent: payload.selectedEvent,
      };
    },
    deletePeriod: (state: ITutoringPageState, payload: number): ITutoringPageState => {
      return {
        ...state,
        createGroupTuitionInput: {...state.createGroupTuitionInput, period: state.createGroupTuitionInput.period.filter((val) => val._id !== payload)}
      }
    },
    clearCreateGroupTuitionInput: (state: ITutoringPageState): ITutoringPageState => {
      return {
        ...state,
        createGroupTuitionInput: {
          country: "",
          subject: "",
          level: "",
          grade: "",
          hourlyRate: 0,
          session: 0,
          hourPerSession: 0,
          minClassSize: 2,
          maxClassSize: 2,
          startReg: moment(),
          endReg: moment().add(14, 'days'),
          period: [],
        }
      }
    },
    createGroupTuitionSuccess: (state: ITutoringPageState, payload : { result: any }): ITutoringPageState => {
      var newGroupTuitions = state.groupTuitions;
      newGroupTuitions.unshift(payload.result);
      return {
        ...state,
        isBusy: false,
        groupTuitions: newGroupTuitions
      }
    },
    fetchGroupTuitionsSuccess: (state: ITutoringPageState, payload: { results : any }): ITutoringPageState => {
      return {
        ...state,
        groupTuitions: payload.results
      }
    },
    deleteGroupTuitionSuccess: (state: ITutoringPageState, payload: string): ITutoringPageState => {
      return {
        ...state,
        groupTuitions: state.groupTuitions.filter(val => val._id !== payload)
      }
    },
    updateGroupTuitionSuccess: (state: ITutoringPageState, payload: {result : any}): ITutoringPageState => {
      return {
        ...state,
        isBusy: false,
        groupTuitions: state.groupTuitions.map(val => {
          return val._id === payload.result._id ? payload.result : val
        })
      }
    },
    openEditPeriodModal: (state: ITutoringPageState, payload: {_id: string, period: any}): ITutoringPageState => {
      return {
        ...state,
        editPeriodModal: true,
        editPeriodData: payload,
        selectedGroupPeriod: payload.period
      }
    },
    hideEditPeriodModal: (state: ITutoringPageState): ITutoringPageState => {
      return {
        ...state,
        editPeriodModal: false,
        editPeriodData: null,
        selectedGroupPeriod: []
      }
    },
    changeEditPeriodData: (state: ITutoringPageState, payload: IChangePeriodDataPayload): ITutoringPageState => {
      return {
        ...state,
        editPeriodData: {...state.editPeriodData, period : [...state.editPeriodData.period, payload.data]}
      }
    },
    deleteEditPeriodData: (state: ITutoringPageState, payload: string): ITutoringPageState => {
      return {
        ...state,
        editPeriodData: {...state.editPeriodData, period: state.editPeriodData.period.length ? state.editPeriodData.period.filter(val => val._id !== payload) : []}
      }
    },
    changeSelectedGroupPeriod: (state: ITutoringPageState, payload: IChangeSelectedGroupPeriod): ITutoringPageState => {
      return {
        ...state,
        selectedGroupPeriod: payload.data
      }
    },
    changePeriods: (state: ITutoringPageState, payload: IChangePeriodsPayload): ITutoringPageState => {
      return {
        ...state,
        groupTuitions : state.groupTuitions.map(val => {
          return val._id === payload.data._id ? {
            ...val,
            period: payload.data.period
          } : val
        })
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
        message.error(error.message, 3);
      }
    },
    async createGroupTuition(payload: ICreateGroupTuitionInput, _rootState: any): Promise<void> {
      try {
        this.starting();

        const result = await getTuitionsService().createGroupTuition(payload);
        this.createGroupTuitionSuccess({
          result
        })
      } catch (error) {
        message.error(error.message, 3);
      }
    },
    async deleteGroupTuition(payload: string, _rootState: any): Promise<void> {
      try {
        await getTuitionsService().deleteGroupTuition({_id: payload});
        this.deleteGroupTuitionSuccess(payload);
        message.success("Delete successfully!", 2);
      } catch (error) {
        message.error(error.message, 3);
      }
    },
    async updateGroupTuition(payload: IUpdateGroupTuitionInput, _rootState: any): Promise<void> {
      try {
        this.starting();
        const result = await getTuitionsService().updateGroupTuition(payload);
        this.updateGroupTuitionSuccess({
          result
        })
        message.success("Update successfully!", 2 );
      } catch(error) {
        message.error(error.message, 3);
      }
    }
  }
});

export default tutoringPageModel;
