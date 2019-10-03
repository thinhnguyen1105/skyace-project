import { createModel, ModelConfig } from '@rematch/core';
import { IExchangeRatePageState, IFetchDataSuccessPayload, IChangeRateInputPayload, IUpdateDataPayload, ICreateCurrencyPayload, ICreateCurrencySuccess, IDeleteCurrencyPayload } from "./interface";
import { getCurrencyService } from "../../../../service-proxies";
import { message } from 'antd';

const coursePageModel: ModelConfig<IExchangeRatePageState> = createModel({
  state: {
    data : [],
    isUpdating: false,
    isCreating: false,
    createModalVisible: false,
    createInputCode : "",
    createInputExchangeRate : 0,
    createInputName: ""
  },
  reducers: {
    updating: (
      state: IExchangeRatePageState
    ): IExchangeRatePageState => {
      return {
        ...state,
        isUpdating: true
      };
    },
    creating: (
      state: IExchangeRatePageState
    ): IExchangeRatePageState => {
      return {
        ...state,
        isCreating: true
      };
    },
    fetchDataSuccess: (
      state: IExchangeRatePageState,
      payload: IFetchDataSuccessPayload
    ): IExchangeRatePageState => {
      return {
        ...state,
        data: payload.results
      };
    },
    updateDataSuccess: (
      state: IExchangeRatePageState,
      payload: IFetchDataSuccessPayload
    ): IExchangeRatePageState => {
      return {
        ...state,
        data: payload.results,
        isUpdating: false
      };
    },
    updateDataError: (
      state: IExchangeRatePageState
    ): IExchangeRatePageState => {
      return {
        ...state,
        isUpdating : false
      };
    },
    changeRateInput: (
      state: IExchangeRatePageState,
      payload: IChangeRateInputPayload
    ): IExchangeRatePageState => {
      return {
        ...state,
        data: state.data.map((val) => {
          if (val._id === payload._id || val.code === payload.code) {
            val.exchangeRate = payload.exchangeRate;
          }
          return val;
        })
      };
    },
    toggleCreateModal: (
      state: IExchangeRatePageState,
      payload: boolean
    ): IExchangeRatePageState => {
      return {
        ...state,
        createModalVisible: payload
      };
    },
    changeCreateInputCode: (
      state: IExchangeRatePageState,
      payload: string
    ): IExchangeRatePageState => {
      return {
        ...state,
        createInputCode : payload
      };
    },
    changeCreateInputExchangeRate: (
      state: IExchangeRatePageState,
      payload: number
    ): IExchangeRatePageState => {
      return {
        ...state,
        createInputExchangeRate : payload
      };
    },
    changeCreateInputName: (
      state: IExchangeRatePageState,
      payload: string
    ): IExchangeRatePageState => {
      return {
        ...state,
        createInputName: payload
      }
    },
    createCurrencySuccess: (
      state: IExchangeRatePageState,
      payload: ICreateCurrencySuccess
    ): IExchangeRatePageState => {
      return {
        ...state,
        data: [payload.result, ...state.data],
        isCreating: false,
        createModalVisible: false,
        createInputCode : "",
        createInputExchangeRate : 0
      };
    },
    createCurrencyError: (
      state: IExchangeRatePageState
    ): IExchangeRatePageState => {
      return {
        ...state,
        isCreating: false
      };
    },
    deleteCurrencySuccess: (
      state: IExchangeRatePageState,
      payload: IDeleteCurrencyPayload
    ): IExchangeRatePageState => {
      return {
        ...state,
        data : state.data.filter(val => val._id !== payload._id)
      };
    }
  },
  effects: {
    async fetchDataEffect(): Promise<void> {
      try {
        const results = await getCurrencyService().getAllCurrencies();
        this.fetchDataSuccess({ results: results.results });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async updateDataEffect(
      payload: IUpdateDataPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.updating();
        const promises = payload.data.map((val) => {
          return getCurrencyService().updateCurrencies(val);
        });
        Promise.all(promises).then((result) => {
          this.updateDataSuccess({ results : result});
          message.success('Update successfully!', 3);
        });
      } catch (error) {
        this.updateDataError();
        message.error(error.message, 4);
      }
    },
    async createCurrencyEffect(
      payload: ICreateCurrencyPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.creating();
        const result = await getCurrencyService().createCurrency(payload);
        this.createCurrencySuccess({result});
        message.success('Create successfully!', 3);
      } catch (error) {
        this.createCurrencyError();
        message.error(error.message, 4);
      }
    },
    async deleteCurrencyEffect(
      payload: IDeleteCurrencyPayload,
      _rootState: any
    ): Promise<void> {
      try {
        await getCurrencyService().deleteCurrency(payload._id);
        this.deleteCurrencySuccess(payload);
        message.success('Delete successfully!', 3);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async getRealtimeCurrenciesExchange(
      payload: string[],
      _rootState: any
    ): Promise<void> {
      try {
        const results = await getCurrencyService().getRealtimeCurrencyRate(payload);
        const returnedData = results.map((val) => {
          return (Object as any).values(val.results).length ? {
            exchangeRate : Number((Object as any).values(val.results)[0].val),
            code : (Object as any).values(val.results)[0].fr ? (Object as any).values(val.results)[0].fr : ""
          } : null
        });
        await returnedData.forEach((val) => {
          this.changeRateInput(val);
        });
      } catch (error) {
        message.error(error.message || "Something went wrong. Please try again.", 4);
      }
    }
  }
});

export default coursePageModel;
