import { createModel, ModelConfig } from "@rematch/core";
import { message } from "antd";
import { getTuitionsService } from "../../../../service-proxies";
import { ITuitionsPageState, ISearchChangePayload, IFilterChangePayload, IFetchDataPayload, IErrorHappenPayload, IFetchDataSuccessPayload } from "./interface";

const tuitionsPageModel: ModelConfig<ITuitionsPageState> = createModel({
  state: {
    isBusy: false,

    data: [],
    total: 0,

    search: "",
    isCompleted: undefined,
    isCanceled: undefined,
    pageSize: 10,
    pageNumber: 1,
    sortBy: "name",
    asc: true,
    status: [],
    currentUser: {},
    errorMessage: ""
  },
  reducers: {
    searchChangeReducer: (
      state: ITuitionsPageState,
      payload: ISearchChangePayload
    ): ITuitionsPageState => {
      return {
        ...state,
        search: payload.searchValue
      };
    },
    filterChangeReducer: (
      state: ITuitionsPageState,
      payload: IFilterChangePayload
    ): ITuitionsPageState => {
      return {
        ...state,
        isCompleted: payload.filterValue === 'finished' ? true : payload.filterValue === 'current' ? false : undefined,
        isCanceled: payload.filterValue === 'canceled' ? true : undefined,
      };
    },
    fetchDataReducer: (
      state: ITuitionsPageState,
      payload: IFetchDataPayload
    ): ITuitionsPageState => {
      return {
        ...state,
        ...payload
      };
    },
    errorHappen: (
      state: ITuitionsPageState,
      payload: IErrorHappenPayload
    ): ITuitionsPageState => {
      return {
        ...state,
        isBusy: false,
        errorMessage: payload.errorMessage
      };
    },
    starting: (state: ITuitionsPageState): ITuitionsPageState => {
      return {
        ...state,
        isBusy: true
      };
    },
    fetchDataSuccess: (
      state: ITuitionsPageState,
      payload: IFetchDataSuccessPayload
    ): ITuitionsPageState => {
      return {
        ...state,
        isBusy: false,
        total: payload.result.total,
        data: payload.result.data
      };
    },
    updateToCancel: (
      state: ITuitionsPageState,
      payload: string
    ): ITuitionsPageState => {
      return {
        ...state,
        data: state.data.map((val) => {
          if (val._id === payload) {
            return {
              ...val,
              isCanceled: true
            }
          } else {
            return val;
          }
        })
      }
    }
  },
  effects: {
    async fetchDataEffect(
      payload: IFetchDataPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();

        const tuitionsService = getTuitionsService();
        const result = await tuitionsService.findTuitions(
          payload.search,
          payload.isCompleted,
          payload.isCanceled,
          payload.pageNumber,
          payload.pageSize,
          payload.sortBy,
          payload.asc,
          payload.status
        );

        this.fetchDataSuccess({ result });
      } catch (error) {
        this.errorHappen(error.message);
        message.error(error.message, 4);
      }
    },
    async searchChangeEffect(
      payload: ISearchChangePayload,
      rootState: any
    ): Promise<void> {
      try {
        this.starting();

        const tuitionsService = getTuitionsService();
        const result = await tuitionsService.findTuitions(
          payload.searchValue,
          rootState.tuitionsPageModel.isCompleted,
          rootState.tuitionsPageModel.isCanceled,
          rootState.rolesPageModel.pageNumber,
          rootState.rolesPageModel.pageSize,
          rootState.rolesPageModel.sortBy,
          rootState.rolesPageModel.asc,
          rootState.rolesPageModel.status
        );

        this.fetchDataSuccess({ result });
      } catch (error) {
        this.errorHappen(error.message);
        message.error(error.message, 4);
      }
    },
    async filterChangeEffect(
      payload: IFilterChangePayload,
      rootState: any
    ): Promise<void> {
      try {
        this.starting();

        const tuitionsService = getTuitionsService();
        const result = await tuitionsService.findTuitions(
          rootState.rolesPageModel.search,
          rootState.tuitionsPageModel.isCompleted,
          rootState.tuitionsPageModel.isCanceled,
          rootState.rolesPageModel.pageNumber,
          rootState.rolesPageModel.pageSize,
          rootState.rolesPageModel.sortBy,
          rootState.rolesPageModel.asc,
          rootState.rolesPageModel.status
        );

        this.fetchDataSuccess({ result });
      } catch (error) {
        this.errorHappen(error.message);
        message.error(error.message, 4);
      }
    },
  }
});

export default tuitionsPageModel;
