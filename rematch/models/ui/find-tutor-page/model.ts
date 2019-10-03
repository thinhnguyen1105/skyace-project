import { createModel, ModelConfig } from '@rematch/core';
import { IFindATutorPageState, IFetchDataPayload, IErrorHappenPayload, IFetchDataSuccessPayload, IPriceChange, IAgeChange, IRatingChange, IYearsOfExpChange } from './interface';
import { getUsersService } from '../../../../service-proxies';
import { message } from 'antd';

const findATutorPageModel: ModelConfig<IFindATutorPageState> = createModel({
  state: {
    search: '',
    language: '',
    gender: '',
    nationality: '',
    education: '',
    race: '',
    courseInput: {},
    minPrice: 0,
    maxPrice: 0,
    minAge: 18,
    maxAge: 60,
    minRating: 0,
    maxRating: 5,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'fullName',
    asc: true,
    minYearsOfExp: 0,
    maxYearsOfExp: 10,
    isBusy: false,
    data: [],
    total: 0,
    visible: false,
    errorMessage: '',
    subjects: [],
    levels: [],
    grades: [],

    loginModalVisible: false,
    registerModalVisible: false,
    registerSuccessModalVisible: false,
    resetPasswordModalVisible: false,
  },
  reducers: {
    'loginPageModel/onLoginSuccess': (state: IFindATutorPageState): IFindATutorPageState => {
      return {
        ...state,
        loginModalVisible: false,
      };
    },
    openResetPasswordModal: (state: IFindATutorPageState): IFindATutorPageState => {
      return {
        ...state,
        resetPasswordModalVisible: true,
        loginModalVisible: false,
      };
    },
    closeResetPasswordModal: (state: IFindATutorPageState): IFindATutorPageState => {
      return {
        ...state,
        resetPasswordModalVisible: false,
        loginModalVisible: false,
      };
    },
    openLoginModal: (state: IFindATutorPageState): IFindATutorPageState => {
      return {
        ...state,
        loginModalVisible: true,
        registerModalVisible: false,
        registerSuccessModalVisible: false,
      };
    },
    closeLoginModal: (state: IFindATutorPageState): IFindATutorPageState => {
      return {
        ...state,
        loginModalVisible: false,
      };
    },
    openRegisterModal: (state: IFindATutorPageState): IFindATutorPageState => {
      return {
        ...state,
        loginModalVisible: false,
        registerModalVisible: true,
        registerSuccessModalVisible: false,
      };
    },
    closeRegisterModal: (state: IFindATutorPageState): IFindATutorPageState => {
      return {
        ...state,
        registerModalVisible: false,
      };
    },
    openRegisterSuccessModal: (state: IFindATutorPageState): IFindATutorPageState => {
      return {
        ...state,
        loginModalVisible: false,
        registerModalVisible: false,
        registerSuccessModalVisible: true,
      };
    },
    closeLoginSuccessModal: (state: IFindATutorPageState): IFindATutorPageState => {
      return {
        ...state,
        registerSuccessModalVisible: false,
      };
    },
    clearFilter: (state: IFindATutorPageState): IFindATutorPageState => {
      return {
        ...state,
        courseInput: {},
        language: '',
        gender: '',
        nationality: '',
        minYearsOfExp: 0,
        maxYearsOfExp: 10,
        minPrice: 0,
        maxPrice: 0,
        minAge: 18,
        maxAge: 60,
        minRating: 0,
        maxRating: 5,
      };
    },
    starting: (state: IFindATutorPageState): IFindATutorPageState => {
      return {
        ...state,
        isBusy: true
      };
    },
    fetchDataSuccess: (
      state: IFindATutorPageState,
      payload: IFetchDataSuccessPayload
    ): IFindATutorPageState => {
      return {
        ...state,
        isBusy: false,
        total: payload.result.total,
        data: payload.result.result
      };
    },
    errorHappen: (
      state: IFindATutorPageState,
      payload: IErrorHappenPayload
    ): IFindATutorPageState => {
      return {
        ...state,
        errorMessage: payload.errorMessage
      };
    },
    handleMinPriceChange: (state: IFindATutorPageState, payload: any): IFindATutorPageState => {
      return {
        ...state,
        minPrice: payload.minPrice
      };
    },
    handleMaxPriceChange: (state: IFindATutorPageState, payload: any): IFindATutorPageState => {
      return {
        ...state,
        maxPrice: payload.maxPrice
      }
    },
    handleAgeChange: (state: IFindATutorPageState, payload: IAgeChange): IFindATutorPageState => {
      return {
        ...state,
        minAge: payload.newAge[0],
        maxAge: payload.newAge[1],
      };
    },
    handleFilterChange: (state: IFindATutorPageState, payload: any): IFindATutorPageState => {
      return {
        ...state,
        ...payload
      };
    },
    handleRatingChange: (state: IFindATutorPageState, payload: IRatingChange): IFindATutorPageState => {
      return {
        ...state,
        minRating: payload.newRating[0],
        maxRating: payload.newRating[1]
      };
    },
    handleYearsOfExpChange: (state: IFindATutorPageState, payload: IYearsOfExpChange): IFindATutorPageState => {
      return {
        ...state,
        minYearsOfExp: payload.newYearsOfExp[0],
        maxYearsOfExp: payload.newYearsOfExp[1],
      };
    },
    changeCourseInput: (state: IFindATutorPageState, payload: any): IFindATutorPageState => {
      return {
        ...state,
        courseInput: {
          ...state.courseInput,
          ...payload
        }
      };
    },
    onModalVisible: (state: IFindATutorPageState): IFindATutorPageState => {
      return {
        ...state,
        visible: true
      };
    },
    onModalUnVisible: (state: IFindATutorPageState): IFindATutorPageState => {
      return {
        ...state,
        visible: false
      };
    },
    resetState: (_state: IFindATutorPageState): IFindATutorPageState => {
      return {
        ..._state,
        search: '',
        language: '',
        gender: '',
        nationality: '',
        education: '',
        race: '',
        courseInput: {},
        minPrice: 0,
        maxPrice: 0,
        minAge: 18,
        maxAge: 60,
        minRating: 0,
        maxRating: 5,
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'fullName',
        asc: true,
        minYearsOfExp: 0,
        maxYearsOfExp: 10,
        isBusy: false,
        visible: false,
        errorMessage: '',

        loginModalVisible: false,
        registerModalVisible: false,
        registerSuccessModalVisible: false,
        resetPasswordModalVisible: false,
      } 
    },
    fetchMetadataSuccess: (state: IFindATutorPageState, payload: any): IFindATutorPageState => {
      return {
        ...state,
        levels: payload.levels,
        grades: payload.grades,
        subjects: payload.subjects
      }
    }
  },
  effects: {
    async fetchDataEffect(payload: IFetchDataPayload, _rootState: any): Promise<void> {
      try {
        this.starting();
        console.log('payload', payload);

        const usersService = getUsersService();
        const result = await usersService.findTutors(
          payload.search,
          payload.language,
          payload.gender,
          payload.nationality,
          payload.education,
          payload.race,
          payload.courseInput,
          payload.minAge,
          payload.maxAge,
          payload.minPrice,
          payload.maxPrice,
          payload.minYearsOfExp,
          payload.maxYearsOfExp,
          payload.minRating,
          payload.maxRating,
          payload.pageNumber,
          payload.pageSize,
          payload.sortBy,
          payload.asc
        );

        this.fetchDataSuccess({ result });
      } catch (error) {
        message.error(error.message, 4);
      }
    }
  },
});

export default findATutorPageModel;