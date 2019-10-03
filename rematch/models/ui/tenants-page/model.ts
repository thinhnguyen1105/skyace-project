import { createModel, ModelConfig } from '@rematch/core';
import Router from 'next/router';
import jwt_decode from "jwt-decode";
import { message } from 'antd';
import {
  ITenantPageState,
  IOpenAddTenantModalPayload,
  ISearchChangePayload,
  IFetchDataPayload,
  IErrorHappenPayload,
  IFetchDataSuccessPayload,
  IActivateTenantSuccessPayload,
  ICreateNewTenantPayload,
  IUpdateTenantPayload,
  IActivateTenantPayload,
  IDeactivateTenantPayload,
  IUpdateProfilePayload,
  IUpdateAdminPayload,
  IUpdateConfigurationPayload,
  IUpdateBankTransferPayload,
  IUpdatePaypalPayload,
  IUpdateContractPayload,
  IPutTenantDataPayload,
  ICreateNewTenantSuccessPayload,
  IUpdateTenantSuccessPayload,
} from './interface';
import { getTenantsService, getUsersService } from '../../../../service-proxies';
import { IFindTenantDetail } from '../../../../api/modules/auth/tenants/interface';
import { ITokenData } from '../../../../api/modules/auth/auth/interface';

const tenantsPageModel: ModelConfig<ITenantPageState> = createModel({
  state: {
    createTenantSuccessModalVisible: false,
    addTenantModalVisible: false,
    isBusy: false,

    data: [],
    total: 0,

    search: '',
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'name',
    asc: true,

    currentTenant: {} as any,
    errorMessage: '',
    haveData: false,
    _id: '',
    registeredCompanyName: '',
    companyRegistrationNumber: '',
    partnerCenterName: '',
    countryOfRegistration: 'Indonesia',
    aboutCompany: '',
    partnerShipStartDate: '',
    adminName: '',
    adminEmail: '',
    adminFirstName: '',
    adminLastName: '',
    adminPhoneID: '',
    adminPhoneNumber: '',
    timeZone: 'US/Samoa',
    primaryCurrency: 'US Dollar',
    country: 'Indonesia',
    state: '',
    city: '',
    zipCode: '',
    contactNumber: '',
    phoneID: '',
    email: '',
    website: '',
    address: '',
    billing: {
      address: '',
      country: '',
      state: '',
      city: '',
      zipCode: '',
    },
    isChecked: false,
    bankName: '',
    bankAccount: '',
    transferDescription: '',
    paypalID: '',
    domainExist: "",
    tenantInfo: {},
    paymentMethod: '',
    franchiseList: [],
    oldDomain: ""
  },
  reducers: {
    changePaymentMethod: (state: ITenantPageState, payload: string): ITenantPageState => {
      return {
        ...state,
        paymentMethod: payload,
      };
    },
    openCreateTenantSuccessModal: (state: ITenantPageState): ITenantPageState => {
      return {
        ...state,
        createTenantSuccessModalVisible: true,
        addTenantModalVisible: false,
      };
    },
    closeCreateTenantSuccessModal: (state: ITenantPageState): ITenantPageState => {
      return {
        ...state,
        createTenantSuccessModalVisible: false,
        addTenantModalVisible: false,
      };
    },
    openAddTenantModal: (
      state: ITenantPageState,
      payload: IOpenAddTenantModalPayload
    ): ITenantPageState => {
      return {
        ...state,
        addTenantModalVisible: true,
        currentTenant: payload.currentTenant
      };
    },
    closeAddTenantModal: (state: ITenantPageState): ITenantPageState => {
      return {
        ...state,
        addTenantModalVisible: false
      };
    },
    onTakeId: (
      state: ITenantPageState,
      token: string
    ): ITenantPageState => {
      const data: ITokenData = jwt_decode(token) as any;
      return {
        ...state,
        _id: data.tenant._id
      };
    },
    tenantInfoChange: (
      state: ITenantPageState,
      payload: any
    ): ITenantPageState => {
      return {
        ...state,
        currentTenant: {
          ...state.currentTenant,
          ...payload,
          companyProfile: {
            ...state.currentTenant.companyProfile,
            ...payload.companyProfile
          },
          paymentInfo: {
            ...state.currentTenant.paymentInfo,
            ...payload.paymentInfo
          },
          fileLists: payload.fileLists ? (state.currentTenant && state.currentTenant.fileLists && state.currentTenant.fileLists.length ? [...state.currentTenant.fileLists, payload.fileLists] : [payload.fileLists]) : []
        }
      };
    },
    searchChangeReducer: (
      state: ITenantPageState,
      payload: ISearchChangePayload
    ): ITenantPageState => {
      return {
        ...state,
        search: payload.searchValue
      };
    },
    fetchDataReducer: (
      state: ITenantPageState,
      payload: IFetchDataPayload
    ): ITenantPageState => {
      return {
        ...state,
        ...payload
      };
    },
    errorHappen: (
      state: ITenantPageState,
      payload: IErrorHappenPayload
    ): ITenantPageState => {
      return {
        ...state,
        isBusy: false,
        errorMessage: payload.errorMessage
      };
    },
    starting: (state: ITenantPageState): ITenantPageState => {
      return {
        ...state,
        isBusy: true
      };
    },
    fetchDataSuccess: (
      state: ITenantPageState,
      payload: IFetchDataSuccessPayload
    ): ITenantPageState => {
      return {
        ...state,
        isBusy: false,
        data: payload.data,
        total: payload.total,
      };
    },
    onPutTenantData: (
      state: ITenantPageState,
      payload: IPutTenantDataPayload
    ): ITenantPageState => {
      return {
        ...state,
        ...payload
      };
    },
    createNewTenantSuccess: (
      state: ITenantPageState,
      payload: ICreateNewTenantSuccessPayload
    ): ITenantPageState => {
      return {
        ...state,
        isBusy: false,
        createTenantSuccessModalVisible: true,
        addTenantModalVisible: false,
        total: state.total + 1,
        data: [payload.tenantInfo as any, ...state.data],
        currentTenant: {} as any,
        errorMessage: ''
      };
    },
    createNewTenantError: (
      state: ITenantPageState
    ): ITenantPageState => {
      return {
        ...state,
        isBusy: false
      }
    },
    updateTenantSuccess: (
      state: ITenantPageState,
      payload: IUpdateTenantSuccessPayload
    ): ITenantPageState => {
      return {
        ...state,
        isBusy: false,
        addTenantModalVisible: false,
        data: state.data.map(item => {
          if (item._id === (state.currentTenant as any)._id) {
            return {
              ...state.currentTenant,
              name: payload.tenantInfo.name
            } as any;
          } else {
            return item;
          }
        })
      };
    },
    activateTenantSuccess: (
      state: ITenantPageState,
      payload: IActivateTenantSuccessPayload
    ): ITenantPageState => {
      const activatedTenant = state.data.filter(
        item => item._id === payload.tenantId
      )[0];
      activatedTenant.isActive = true;

      return {
        ...state,
        isBusy: false,
        data: state.data.map(item => {
          if (item._id === payload.tenantId) {
            return activatedTenant;
          } else {
            return item;
          }
        })
      };
    },
    deactivateTenantSuccess: (
      state: ITenantPageState,
      payload: IActivateTenantSuccessPayload
    ): ITenantPageState => {
      const deactivatedTenant = state.data.filter(
        item => item._id === payload.tenantId
      )[0];
      deactivatedTenant.isActive = false;

      return {
        ...state,
        isBusy: false,
        data: state.data.map(item => {
          if (item._id === payload.tenantId) {
            return deactivatedTenant;
          } else {
            return item;
          }
        })
      };
    },
    onChangeInput: (state: ITenantPageState, payload: any): ITenantPageState => {
      return {
        ...state,
        ...payload
      };
    },
    onSelectionChange: (
      state: ITenantPageState, payload: any
    ): ITenantPageState => {
      return {
        ...state,
        ...payload
      };
    },
    onCheckBox: (
      state: ITenantPageState
    ): ITenantPageState => {
      return {
        ...state,
        isChecked: true
      };
    },
    // updateTenantDetail: (
    //   state: ITenantPageState,
    //   payload: IFindTenantDetail
    // ): ITenantPageState => {
    //   if (typeof payload.administrationInfomation !== 'undefined' &&
    //     typeof payload.bankTransfer !== 'undefined' &&
    //     typeof payload.companyProfile !== 'undefined' &&
    //     typeof payload.contactInformation !== 'undefined' &&
    //     typeof payload.paypal !== 'undefined') {
    //     return {
    //       ...state,
    //       haveData: true,
    //       registeredCompanyName: payload.companyProfile.registeredCompanyName,
    //       companyRegistrationNumber: payload.companyProfile.companyRegistrationNumber,
    //       partnerCenterName: payload.companyProfile.partnerCenterName,
    //       countryOfRegistration: payload.companyProfile.countryOfRegistration,
    //       aboutCompany: payload.companyProfile.aboutCompany,
    //       partnerShipStartDate: payload.companyProfile.partnerShipStartDate,
    //       adminName: payload.administrationInfomation.adminName,
    //       adminEmail: payload.administrationInfomation.adminEmail,
    //       timeZone: (payload.otherConfigs as any).timeZone,
    //       primaryCurrency: (payload.otherConfigs as any).primaryCurrency,
    //       country: payload.contactInformation.country,
    //       state: payload.contactInformation.state,
    //       city: payload.contactInformation.city,
    //       zipCode: payload.contactInformation.zipCode,
    //       contactNumber: {
    //         number: payload.contactInformation.number,
    //         phoneID: payload.contactInformation.phoneID,
    //       },
    //       email: payload.contactInformation.email,
    //       website: payload.contactInformation.website,
    //       address: payload.contactInformation.address,
    //       billing: {
    //         address: '',
    //         country: payload.contactInformation.billing.country,
    //         state: payload.contactInformation.billing.state,
    //         city: payload.contactInformation.billing.city,
    //         zipCode: payload.contactInformation.billing.zipCode,
    //       },
    //       bankName: payload.bankTransfer.bankName,
    //       bankAccount: payload.bankTransfer.bankAccount,
    //       transferDescription: payload.bankTransfer.transferDescription,
    //       paypalID: payload.paypal.paypalID,
    //     };
    //   } else {
    //     return {
    //       ...state,
    //       adminName: payload.name ? payload.name : '',
    //       haveData: false
    //     };
    //   }
    // },
    fetchTenantInfoSuccess: (
      state: ITenantPageState,
      payload: IFindTenantDetail
    ): ITenantPageState => {
      const tempObj = JSON.parse(JSON.stringify(payload));
      tempObj.contactInformation = {
        ...tempObj.contactInformation,
        contactNumber: payload.contactInformation ? payload.contactInformation.contactNumber ? payload.contactInformation.contactNumber.number : '' : '',
        phoneID: payload.contactInformation ? payload.contactInformation.contactNumber ? payload.contactInformation.contactNumber.phoneID : '' : ''
      }
      return {
        ...state,
        tenantInfo: tempObj,
        oldDomain: tempObj.domain
      }
    },
    changeTenantInput: (
      state: ITenantPageState,
      payload: any
    ): ITenantPageState => {
      return {
        ...state,
        tenantInfo: {
          ...state.tenantInfo,
          ...payload,
          otherConfigs: {
            ...state.tenantInfo.otherConfigs,
            ...payload.otherConfigs
          },
          companyProfile: {
            ...state.tenantInfo.companyProfile,
            ...payload.companyProfile
          },
          administrationInfomation: {
            ...state.tenantInfo.administrationInfomation,
            ...payload.administrationInfomation
          },
          contactInformation: {
            ...state.tenantInfo.contactInformation,
            ...payload.contactInformation,
            billing: {
              ...(state.tenantInfo.contactInformation ? state.tenantInfo.contactInformation.billing : {}),
              ...(payload.contactInformation ? payload.contactInformation.billing : {})
            }
          },
          bankTransfer: {
            ...state.tenantInfo.bankTransfer,
            ...payload.bankTransfer
          },
          paypal: {
            ...state.tenantInfo.paypal,
            ...payload.paypal
          },
          paymentInfo: {
            ...state.tenantInfo.paymentInfo,
            ...payload.paymentInfo
          }
        }
      }
    },
    checkDomainSuccess: (
      state: ITenantPageState,
      payload: boolean
    ): ITenantPageState => {
      return {
        ...state,
        domainExist: payload ? "EXIST" : "FREE"
      }
    },
    fetchFranchisesSuccess: (
      state: ITenantPageState,
      payload: any
    ): ITenantPageState => {
      return {
        ...state,
        franchiseList: payload
      }
    },
    updateNewPartnerWithFranchise: (
      state: ITenantPageState,
      payload: any
    ): ITenantPageState => {
      return {
        ...state,
        data: state.data.map((val) => {
          if (val._id !== payload._id) return val;
          else return payload;
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
        const tenantsService = getTenantsService();
        const result = await tenantsService.find(
          payload.search,
          payload.pageNumber,
          payload.pageSize,
          payload.sortBy,
          payload.asc
        );

        this.fetchDataSuccess({ ...result });
      } catch (error) {
        this.errorHappen(error.message);
        message.error(error.message, 3);
      }
    },

    async fetchDataFranchiseEffect(
      payload: any,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const tenantsService = getTenantsService();
        const result = await tenantsService.findByAdmin(
          payload.search,
          payload.pageNumber,
          payload.pageSize,
          payload.sortBy,
          payload.asc,
          payload._id
        );

        this.fetchDataSuccess({ ...result });
      } catch (error) {
        this.errorHappen(error.message);
        message.error(error.message, 3);
      }
    },
    async searchChangeEffect(
      payload: ISearchChangePayload,
      rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const tenantsService = getTenantsService();
        const result = await tenantsService.find(
          payload.searchValue,
          rootState.tenantsPageModel.pageNumber,
          rootState.tenantsPageModel.pageSize,
          rootState.tenantsPageModel.sortBy,
          rootState.tenantsPageModel.asc
        );

        this.fetchDataSuccess({ ...result });
      } catch (error) {
        this.errorHappen(error.message);
        message.error(error.message, 3);
      }
    },
    async searchChangeFranchiseEffect(
      payload: any,
      rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const tenantsService = getTenantsService();
        const result = await tenantsService.findByAdmin(
          payload.searchValue,
          rootState.tenantsPageModel.pageNumber,
          rootState.tenantsPageModel.pageSize,
          rootState.tenantsPageModel.sortBy,
          rootState.tenantsPageModel.asc,
          payload._id
        );

        this.fetchDataSuccess({ ...result });
      } catch (error) {
        this.errorHappen(error.message);
        message.error(error.message, 3);
      }
    },
    async createNewTenant(
      payload: ICreateNewTenantPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const tenantsService = getTenantsService();
        const newTenant = await tenantsService.create({
          ...payload.tenantInfo,
          isActive: true
        });

        this.createNewTenantSuccess({ tenantInfo: newTenant });
      } catch (error) {
        this.createNewTenantError();
        message.error(error.message, 3);
      }
    },
    async findTenantDetails(
      _id: string,
      _rootState: any
    ): Promise<void> {
      try {
        const tenantsService = getTenantsService();
        const tenantDetail = await tenantsService.findTenantDetail(_id);
        this.updateTenantDetail(tenantDetail);
      } catch (error) {
        message.error(error.message, 3);
      }
    },
    async updateTenant(
      payload: IUpdateTenantPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();

        const tenantsService = getTenantsService();
        await tenantsService.update({
          ...payload.tenantInfo
        });

        this.updateTenantSuccess({ tenantInfo: payload.tenantInfo });
      } catch (error) {
        message.error(error.message, 3);
      }
    },
    async activateTenant(
      payload: IActivateTenantPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();

        const tenantsService = getTenantsService();
        await tenantsService.activate(payload.tenantId);

        this.activateTenantSuccess(payload);
      } catch (error) {
        message.error(error.message, 3);
      }
    },
    async deactivateTenant(
      payload: IDeactivateTenantPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const tenantsService = getTenantsService();
        await tenantsService.deactivate(payload.tenantId);
        this.deactivateTenantSuccess(payload);
      } catch (error) {
        message.error(error.message, 3);
      }
    },
    async updateProfile(
      payload: IUpdateProfilePayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const tenantsService = getTenantsService();
        await tenantsService.updateProfile(payload);
        message.success('Update successfully!', 1);
      } catch (error) {
        message.error(error.message, 3);
      }
    },
    async updateAdminInfo(
      payload: IUpdateAdminPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const tenantsService = getTenantsService();
        await tenantsService.updateAdminInfo(payload);
        message.success('Update successfully!', 1);
      } catch (error) {
        message.error(error.message, 3);
      }
    },
    async updateConfiguration(
      payload: IUpdateConfigurationPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const tenantsService = getTenantsService();
        await tenantsService.updateConfiguration(payload);
        message.success('Update successfully!', 1);
      } catch (error) {
        message.error(error.message, 3);
      }
    },
    async updateContract(
      payload: IUpdateContractPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const tenantsService = getTenantsService();
        await tenantsService.updateContract(payload as any);
        message.success('Update successfully!', 1);
      } catch (error) {
        message.error(error.message, 3);
      }
    },
    async updateBankTransfer(
      payload: IUpdateBankTransferPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const tenantsService = getTenantsService();
        await tenantsService.updateBankTransfer(payload);
        message.success('Update successfully!', 1);
      } catch (error) {
        message.error(error.message, 3);
      }
    },
    async updatePaypal(
      payload: IUpdatePaypalPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const tenantsService = getTenantsService();
        await tenantsService.updatePayal(payload);
        message.success('Update successfully!', 1);
      } catch (error) {
        message.error(error.message, 3);
      }
    },
    async checkDomain(
      payload: any,
      _rootState: any
    ): Promise<void> {
      try {
        const tenantsService = getTenantsService();
        const result = await tenantsService.checkDomainExist(payload);
        this.checkDomainSuccess(result.code);

      } catch (error) {
        message.error(error.message, 3);
      }
    }
  }
});

export default tenantsPageModel;
