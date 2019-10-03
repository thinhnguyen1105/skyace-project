import { createModel, ModelConfig } from '@rematch/core';
import { message } from 'antd';
import {
  IPromoCodePageState,
  IFetchDataSuccessPayload,
  ICreateNewCodePayload,
  IUpdateCodePayload,
  IDeleteCodePayload,
  IFetchDataPayload
} from './interface';
import { getPromoCodeService } from '../../../../service-proxies';

const promoCodePageModel: ModelConfig<IPromoCodePageState> = createModel({
  state: {
    data: [],
    total: 0,
    createModal: false,
    createData: {
      name: "",
      value: 0,
      quantity: 0,
      type: '%',
      isInfinite: false,
      startDate: "",
      endDate: "",
      description: ""
    },

    search: "",
    pageSize: 10,
    pageNumber: 1,
    sortBy: "name",
    asc: true,

    isBusy: false,
    updateData: {},
    updateModal: false,
    selected: {}
  },
  reducers: {
    starting: (state: IPromoCodePageState): IPromoCodePageState => {
      return {
        ...state,
        isBusy: true
      }
    },
    fetchDataSuccess: (state: IPromoCodePageState, payload: IFetchDataSuccessPayload): IPromoCodePageState => {
      return {
        ...state,
        data: payload.result.data,
        total: payload.result.total,
        isBusy: false
      };
    },
    fetchDataError: (state: IPromoCodePageState): IPromoCodePageState => {
      return {
        ...state,
        isBusy: false
      };
    },
    toggleCreateCodeModal: (state: IPromoCodePageState, payload: boolean) : IPromoCodePageState => {
      return {
        ...state,
        createModal : payload
      }
    },
    changeCreateInput: (state: IPromoCodePageState, payload: any): IPromoCodePageState => {
      return {
        ...state,
        createData: {
          ...state.createData,
          ...payload
        }
      }
    },
    clearInput: (state: IPromoCodePageState): IPromoCodePageState => {
      return {
        ...state,
        createData : {
          name: "",
          value: 0,
          quantity: 0,
          type: '%',
          isInfinite: false,
          startDate: new Date(),
          endDate: new Date(),
          description: ""
        }
      }
    },
    createNewCodeSuccess: (state: IPromoCodePageState, payload: any): IPromoCodePageState => {
      return {
        ...state,
        isBusy: false,
        data: [payload, ...state.data]
      }
    },
    createNewCodeError: (state: IPromoCodePageState): IPromoCodePageState => {
      return {
        ...state,
        isBusy: false
      }
    },
    updateCodeSuccess: (state: IPromoCodePageState, payload: any): IPromoCodePageState => {
      return {
        ...state,
        isBusy: false,
        data: state.data.map((val) => val._id === payload._id ? payload : val)
      }
    },
    updateCodeError: (state: IPromoCodePageState): IPromoCodePageState => {
      return {
        ...state,
        isBusy: false
      }
    },
    deleteCodeSuccess: (state: IPromoCodePageState, payload: string): IPromoCodePageState => {
      return {
        ...state,
        isBusy: false,
        data: state.data.filter((val) => val._id !== payload)
      }
    },
    deleteCodeError: (state: IPromoCodePageState): IPromoCodePageState => {
      return {
        ...state,
        isBusy: false
      }
    },
    openUpdateModal: (state: IPromoCodePageState , payload: any): IPromoCodePageState => {
      return {
        ...state,
        updateModal: true,
        selected: payload,
        updateData: payload
      }
    },
    closeUpdateModal: (state: IPromoCodePageState) : IPromoCodePageState => {
      return {
        ...state,
        updateModal: false,
        selected: {},
        updateData: {}
      }
    },
    clearUpdateInput: (state: IPromoCodePageState): IPromoCodePageState => {
      return {
        ...state,
        updateData: {},
        selected: {}
      }
    },
    changeUpdateInput: (state: IPromoCodePageState, payload: any): IPromoCodePageState => {
      return {
        ...state,
        updateData: {
          ...state.updateData,
          ...payload
        }
      }
    },
    fetchDataReducer: (
      state: IPromoCodePageState,
      payload: IFetchDataPayload
    ): IPromoCodePageState => {
      return {
        ...state,
        ...payload
      };
    },
    changeSearch: (
      state: IPromoCodePageState,
      payload: string
    ): IPromoCodePageState => {
      return {
        ...state,
        search: payload
      }
    }
  },
  effects: {
    async createNewCode(
      payload: ICreateNewCodePayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();

        const promoCodeService = getPromoCodeService();
        const result = await promoCodeService.create(payload as any);
        this.createNewCodeSuccess(result);

      } catch (error) {
        this.createNewCodeError();
        message.error(error.message || 'Internal server error', 5);
      }
    },
    async updateCode(
      payload: IUpdateCodePayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();

        const promoCodeService = getPromoCodeService();
        const result = await promoCodeService.update(payload as any);
        this.updateCodeSuccess(result);

      } catch (error) {
        this.updateCodeError();
        message.error(error.message || 'Internal server error', 5);
      }
    },
    async deleteCode (
      payload: IDeleteCodePayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const promoCodeService = getPromoCodeService();
        await promoCodeService.delete(payload._id as any);
        this.deleteCodeSuccess(payload._id);
      } catch (error) {
        this.deleteCodeError();
        message.error(error.message || 'Internal server error', 5);
      }
    },
    async fetchDataEffect(
      payload: IFetchDataPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();

        const promoCodeService = getPromoCodeService();
        const result = await promoCodeService.find(
          payload.search,
          payload.pageNumber,
          payload.pageSize,
          payload.sortBy,
          payload.asc
        );

        this.fetchDataSuccess({ result });
      } catch (error) {
        this.fetchDataError();
        message.error(error.message, 5);
      }
    },
  }
});

export default promoCodePageModel;
