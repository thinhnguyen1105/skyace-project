import { createModel, ModelConfig } from "@rematch/core";
import { message } from "antd";
import { IUsersPageState, ISearchChangePayload, IFilterChangePayload, IFetchDataPayload, IErrorHappenPayload, IFetchDataSuccessPayload, IActivateUserSuccessPayload, IActivateUserPayload } from "./interface";
import { getUsersService } from "../../../../service-proxies";
import config from '../../../../api/config/';

const usersPageModel: ModelConfig<IUsersPageState> = createModel({
  state: {
    isBusy: false,

    data: [],
    total: 0,

    search: "",
    filter: '',
    pageSize: 10,
    pageNumber: 1,
    sortBy: "name",
    asc: true,

    currentUser: {},
    errorMessage: ""
  },
  reducers: {
    searchChangeReducer: (
      state: IUsersPageState,
      payload: ISearchChangePayload
    ): IUsersPageState => {
      return {
        ...state,
        search: payload.searchValue
      };
    },
    filterChangeReducer: (
      state: IUsersPageState,
      payload: IFilterChangePayload
    ): IUsersPageState => {
      return {
        ...state,
        filter: payload.filterValue
      };
    },
    fetchDataReducer: (
      state: IUsersPageState,
      payload: IFetchDataPayload
    ): IUsersPageState => {
      return {
        ...state,
        ...payload
      };
    },
    errorHappen: (
      state: IUsersPageState,
      payload: IErrorHappenPayload
    ): IUsersPageState => {
      return {
        ...state,
        isBusy: false,
        errorMessage: payload.errorMessage
      };
    },
    starting: (state: IUsersPageState): IUsersPageState => {
      return {
        ...state,
        isBusy: true
      };
    },
    fetchDataSuccess: (
      state: IUsersPageState,
      payload: IFetchDataSuccessPayload
    ): IUsersPageState => {
      return {
        ...state,
        isBusy: false,
        total: payload.result.total,
        data: payload.result.data
      };
    },
    activateUserSuccess: (
      state: IUsersPageState,
      payload: IActivateUserSuccessPayload
    ): IUsersPageState => {
      const activatedRole = state.data.filter(
        item => item._id === payload.userId
      )[0];
      activatedRole.isActive = true;

      return {
        ...state,
        isBusy: false,
        data: state.data.map(item => {
          if (item._id === payload.userId) {
            return activatedRole;
          } else {
            return item;
          }
        })
      };
    },
    deactivateUserSuccess: (
      state: IUsersPageState,
      payload: IActivateUserSuccessPayload
    ): IUsersPageState => {
      const deactivatedRole = state.data.filter(
        item => item._id === payload.userId
      )[0];
      deactivatedRole.isActive = false;

      return {
        ...state,
        isBusy: false,
        data: state.data.map(item => {
          if (item._id === payload.userId) {
            return deactivatedRole;
          } else {
            return item;
          }
        })
      };
    },
    impersonateSuccess: (
      state: IUsersPageState,
    ): IUsersPageState => {
      return {
        ...state,
        isBusy: false
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

        const usersService = getUsersService();
        const result = await usersService.find(
          payload.search,
          payload.filter,
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
    async searchChangeEffect(
      payload: ISearchChangePayload,
      rootState: any
    ): Promise<void> {
      try {
        this.starting();

        const usersService = getUsersService();
        const result = await usersService.find(
          payload.searchValue,
          rootState.rolesPageModel.filter,
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
    async filterChangeEffect(
      payload: IFilterChangePayload,
      rootState: any
    ): Promise<void> {
      try {
        this.starting();

        const usersService = getUsersService();
        const result = await usersService.find(
          rootState.rolesPageModel.search,
          payload.filterValue,
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
    async activateUser(
      payload: IActivateUserPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();

        const usersService = getUsersService();
        await usersService.activate(payload.userId);

        this.activateUserSuccess(payload);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async deactivateUser(
      payload: IActivateUserPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();

        const usersService = getUsersService();
        await usersService.deactivate(payload.userId);

        this.deactivateUserSuccess(payload);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async impersonate(
      payload: any,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();

        const usersService = getUsersService();
        await usersService.impersonate(payload);
        this.impersonateSuccess();
        message.success('Login successfully!');
        window.location.href = config.nextjs.hostUrl;
      } catch (error) {
        message.error(error.message, 4);
      }
    }
  }
});

export default usersPageModel;
