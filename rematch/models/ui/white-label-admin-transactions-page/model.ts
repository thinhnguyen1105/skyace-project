import { createModel, ModelConfig } from "@rematch/core";
import { message } from "antd";
import { ITransactionsPageState, ISearchChangePayload, IFetchDataPayload, IErrorHappenPayload, IFetchDataSuccessPayload } from "./interface";
import { getTransactionService } from "../../../../service-proxies";

const transactionsPageModel: ModelConfig<ITransactionsPageState> = createModel({
  state: {
    isBusy: false,

    data: [],
    total: 0,

    search: "",
    pageSize: 10,
    pageNumber: 1,
    sortBy: "name",
    asc: true,

    currentTransaction: {},
    errorMessage: ""
  },
  reducers: {
    searchChangeReducer: (
      state: ITransactionsPageState,
      payload: ISearchChangePayload
    ): ITransactionsPageState => {
      return {
        ...state,
        search: payload.searchValue
      };
    },
    fetchDataReducer: (
      state: ITransactionsPageState,
      payload: IFetchDataPayload
    ): ITransactionsPageState => {
      return {
        ...state,
        ...payload
      };
    },
    errorHappen: (
      state: ITransactionsPageState,
      payload: IErrorHappenPayload
    ): ITransactionsPageState => {
      return {
        ...state,
        isBusy: false,
        errorMessage: payload.errorMessage
      };
    },
    starting: (state: ITransactionsPageState): ITransactionsPageState => {
      return {
        ...state,
        isBusy: true
      };
    },
    fetchDataSuccess: (
      state: ITransactionsPageState,
      payload: IFetchDataSuccessPayload
    ): ITransactionsPageState => {
      return {
        ...state,
        isBusy: false,
        total: payload.result.total,
        data: payload.result.data
      };
    },
    editData: (
      state: ITransactionsPageState,
      payload: any
    ): ITransactionsPageState => {
      return {
        ...state,
        data: state.data.map((val) => {
          if (val._id === payload._id) {
            return {
              ...val,
              ...payload
            }
          } else return val;
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

        const transactionsService = getTransactionService();
        const result = await transactionsService.findTransactions(
          payload.search,
          payload.pageNumber,
          payload.pageSize,
          payload.sortBy,
          payload.asc
        );

        this.fetchDataSuccess({ result });
      } catch (error) {
        this.errorHappen(error.message);
        message.error(error.message, 4);
      }
    },
    async searchChangeEffect(payload: ISearchChangePayload, rootState: any): Promise<void> {
      try {
        this.starting();

        const transactionsService = getTransactionService();
        const result = await transactionsService.findTransactions(
          payload.searchValue,
          rootState.rolesPageModel.pageNumber,
          rootState.rolesPageModel.pageSize,
          rootState.rolesPageModel.sortBy,
          rootState.rolesPageModel.asc
        );

        this.fetchDataSuccess({ result });
      } catch (error) {
        this.errorHappen(error.message);
        message.error(error.message, 4);
      }
    },
  }
});

export default transactionsPageModel;
