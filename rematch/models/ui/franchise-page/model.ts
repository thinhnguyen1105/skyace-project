import { createModel, ModelConfig } from "@rematch/core";
import { message } from "antd";
import { IFranchisesPageState, ISearchChangePayload, IFilterChangePayload, IFetchDataPayload, IErrorHappenPayload, IFetchDataSuccessPayload, IActivateUserSuccessPayload, IActivateUserPayload, ICreateFranchisePayload, IChangeCreateNewFranchiseInputPayload } from "./interface";
import { getUsersService } from "../../../../service-proxies";
import { IFindUserDetail } from "api/modules/auth/users/interface";

const franchisePageModel: ModelConfig<IFranchisesPageState> = createModel({
  state: {
    isBusy: false,
    showCreateAdminModal: false,
    data: [],
    total: 0,

    search: "",
    filter: '',
    pageSize: 10,
    pageNumber: 1,
    sortBy: "name",
    asc: true,

    currentUser: {},
    errorMessage: "",
    newFranchise : {
      firstName: "",
      lastName: "",
      password: "",
      email: "",
      confirm: "",
      phone: {},
      distributorInfo: {}
    },
    createDistributorSuccessModalVisible: false
  },
  reducers: {
    toggleCreateAdminModal: (
      state: IFranchisesPageState,
      payload: boolean
    ):  IFranchisesPageState => {
      return {
        ...state,
        showCreateAdminModal: payload
      }
    },
    searchChangeReducer: (
      state: IFranchisesPageState,
      payload: ISearchChangePayload
    ): IFranchisesPageState => {
      return {
        ...state,
        search: payload.searchValue
      };
    },
    filterChangeReducer: (
      state: IFranchisesPageState,
      payload: IFilterChangePayload
    ): IFranchisesPageState => {
      return {
        ...state,
        filter: payload.filterValue
      };
    },
    fetchDataReducer: (
      state: IFranchisesPageState,
      payload: IFetchDataPayload
    ): IFranchisesPageState => {
      return {
        ...state,
        ...payload
      };
    },
    errorHappen: (
      state: IFranchisesPageState,
      payload: IErrorHappenPayload
    ): IFranchisesPageState => {
      return {
        ...state,
        isBusy: false,
        errorMessage: payload.errorMessage
      };
    },
    starting: (state: IFranchisesPageState): IFranchisesPageState => {
      return {
        ...state,
        isBusy: true
      };
    },
    fetchDataSuccess: (
      state: IFranchisesPageState,
      payload: IFetchDataSuccessPayload
    ): IFranchisesPageState => {
      return {
        ...state,
        isBusy: false,
        total: payload.result.total,
        data: payload.result.data
      };
    },
    activateUserSuccess: (
      state: IFranchisesPageState,
      payload: IActivateUserSuccessPayload
    ): IFranchisesPageState => {
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
      state: IFranchisesPageState,
      payload: IActivateUserSuccessPayload
    ): IFranchisesPageState => {
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
      state: IFranchisesPageState,
    ): IFranchisesPageState => {
      return {
        ...state,
        isBusy: false
      }
    },
    onChangeCreateData: (
      state: IFranchisesPageState,
      payload: IChangeCreateNewFranchiseInputPayload
    ): IFranchisesPageState => {
      return {
        ...state,
        newFranchise : {
          ...state.newFranchise,
          ...payload,
          distributorInfo : {
            ...state.newFranchise.distributorInfo,
            ...payload.distributorInfo,
          },
          phone: {
            ...state.newFranchise.phone,
            ...payload.phone
          }
        }
      }
    },
    clearInput: (
      state: IFranchisesPageState
    ): IFranchisesPageState => {
      return {
        ...state,
        newFranchise : {
          firstName:  "",
          lastName: "",
          password : "",
          email: "",
          confirm: "",
          phone: {},
          distributorInfo: {}
        },
        showCreateAdminModal: false
      }
    },
    createFranchiseSuccess: (
      state: IFranchisesPageState,
      payload: IFindUserDetail
    ): IFranchisesPageState => {
      return {
        ...state,
        newFranchise: {
          firstName:  "",
          lastName: "",
          password : "",
          email: "",
          confirm: "",
          phone: {},
          distributorInfo: {}
        },
        createDistributorSuccessModalVisible: true,
        showCreateAdminModal: false,
        data: [payload, ...state.data ]
      }
    },
    closeCreateTenantSuccessModal: (state: IFranchisesPageState): IFranchisesPageState => {
      return {
        ...state,
        createDistributorSuccessModalVisible: false
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
        const result = await usersService.findFranchises(
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
        const result = await usersService.findFranchises(
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
        window.location.reload();
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async createNewFranchise(
      payload: ICreateFranchisePayload,
      _rootState: any
    ): Promise<void> {
      try {
        const usersService = getUsersService();
        const result = await usersService.createFranchise(payload as any);
        this.createFranchiseSuccess(result);
      } catch (error) {
        message.error(error.message, 4);
      }
    }
  }
});

export default franchisePageModel;
