import { createModel, ModelConfig } from '@rematch/core';
import moment from 'moment';
import {
  IEditProfileState,
  IEventWithIndex,
  IImage,
  IFetchDataPayload,
  IFetchDataSuccessPayload,
  IUpdateUserPayload,
  IFileListPayload,
  IFileDocument,
  IScaleValue,
  IRotateValue,
  IChangeHourlyRateInput,
  IFetchCoursesSuccessPayload,
  IDeleteTeacherSubjectPayload,
  ICreateSubjectInput,
  IFetchCurrenciesSuccess
} from './interface';
import { message } from 'antd';
import { getUsersService } from '../../../../service-proxies';
import { IGetCourseForTutorDetail } from 'api/modules/elearning/course-for-tutor/interface';


const editProfilePageModel: ModelConfig<IEditProfileState> = createModel({
  state: {
    teacherExperience: [{ year: [], experience: '', index: 0 }],
    imageTemporary: '',
    imageUrl: '',
    loading: false,
    id: '',
    isBusy: false,
    search: '',
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'name',
    asc: true,
    firstName: '',
    lastName: '',
    phoneID: '',
    phoneIDSave: '',
    phoneNumber: '',
    hourlyPerSessionTrial: undefined,
    timeZone: {},
    currency: {},
    email: '',
    errorMessage: '',
    dob: null as any,
    showChangePasswordModal: false,
    biography: {
      language: '',
      nationality: '',
      aboutMe: '',
      secondaryLanguage: ''
    },
    education: {
      highestEducation: '',
      major: '',
      university: '',
      fileListDocument: {}
    },
    fileList: [],
    avatarZoomValue: 1,
    avatarRotateValue: 0,
    tutorCourses: [],
    searchInput: {
      country: "",
      subject: "",
      level: "",
      grade: "",
      hourlyRate: 0
    },
    createSubjectInputs: [],
    coursesLookup: [],
    hourlyRateInputs: [],
    createSubjectModal: false,
    gender: undefined,
    nationality: undefined,
    currentAcademicLevel: undefined,
    nationalID: undefined,
    currentlyBasedIn: undefined,
    flagCheckTrialSubjectExisted: false,
    idTrialCourse: '',
    idTrialSubject: '',
    currencies: [],
    currencyInput: "",
    paypalEmail: '',
    paymentMethod: '',
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    externalLogin: {},
    modeMonthPicker: ['month', 'month'],
    idUserChangeByAdmin: '',
    roleUserForAdmin: '',
  },
  reducers: {
    updateIdCourseForDelete: (
      state: IEditProfileState,
      payload: any
    ): IEditProfileState => {
      return {
        ...state,
        idTrialSubject: payload

      };
    },
    updateIdTrialCourse: (
      state: IEditProfileState,
      payload: any
    ): IEditProfileState => {
      return {
        ...state,
        idTrialCourse: payload

      };
    },
    changeFlagCheckTrialSubjectExisted: (
      state: IEditProfileState,
      payload: any
    ): IEditProfileState => {
      return {
        ...state,
        flagCheckTrialSubjectExisted: true,
        idTrialCourse: payload

      };
    },
    changeRotateImage: (
      state: IEditProfileState,
      payload: IRotateValue
    ): IEditProfileState => {
      return {
        ...state,
        avatarRotateValue: payload.rotateValue
      };
    },
    changeScaleImage: (
      state: IEditProfileState,
      payload: IScaleValue
    ): IEditProfileState => {
      return {
        ...state,
        avatarZoomValue: payload.scaleValue
      };
    },
    onChangeFileList: (
      state: IEditProfileState,
      payload: IFileListPayload
    ): IEditProfileState => {
      return {
        ...state,
        fileList: [payload.file]
      };
    },
    onSaveImageUrl: (
      state: IEditProfileState,
      payload: IImage
    ): IEditProfileState => {
      return {
        ...state,
        imageUrl: payload.imageUrl
      };
    },
    onGetFileDocument: (
      state: IEditProfileState,
      payload: IFileDocument
    ): IEditProfileState => {
      return {
        ...state,
        education: {
          ...state.education,
          fileListDocument: {
            ...state.education.fileListDocument,
            ...payload
          }
        }
      };
    },
    openChangePasswordModal: (
      state: IEditProfileState,
    ): IEditProfileState => {
      return {
        ...state,
        showChangePasswordModal: true
      };
    },
    closeChangePasswordModal: (
      state: IEditProfileState,
    ): IEditProfileState => {
      return {
        ...state,
        showChangePasswordModal: false
      };
    },
    updateUserSuccess: (
      state: IEditProfileState,
    ): IEditProfileState => {
      return {
        ...state,
        isBusy: false
      };
    },
    updateUserError: (
      state: IEditProfileState
    ): IEditProfileState => {
      return {
        ...state,
        isBusy: false
      };
    },
    starting: (state: IEditProfileState): IEditProfileState => {
      return {
        ...state,
        isBusy: true
      };
    },
    userInfoChange: (
      state: IEditProfileState,
      payload: any
    ): IEditProfileState => {
      return {
        ...state,
        ...payload
      };
    },
    fetchDataSuccess: (
      state: IEditProfileState,
      payload: IFetchDataSuccessPayload
    ): IEditProfileState => {
      return {
        ...state,
        isBusy: false,
        firstName: payload.result.firstName,
        lastName: payload.result.lastName,
        email: payload.result.email,
        timeZone: payload.result.timeZone ? payload.result.timeZone : {},
        currency: payload.result.currency ? payload.result.currency : {},
        phoneNumber: payload.result.phone ? payload.result.phone.phoneNumber : '',
        phoneID: payload.result.phone ? payload.result.phone.phoneID : '',
        hourlyPerSessionTrial: payload.result.hourlyPerSessionTrial ? payload.result.hourlyPerSessionTrial : undefined,
        imageUrl: payload.result.imageUrl,
        dob: payload.result.dob ? payload.result.dob : null,
        biography: {
          ...state.biography,
          ...payload.result.biography
        },
        education: {
          ...state.education,
          ...payload.result.education
        },
        teacherExperience: payload.result.teacherExperience === undefined ? [] : payload.result.teacherExperience.map((item) => {

          return {
            year: [moment(item.start), moment(item.end)],
            experience: item.experience,
            index: item.index,
          }
        }),
        gender: payload.result.gender ? payload.result.gender : undefined,
        nationality: payload.result.nationality ? payload.result.nationality : undefined,
        currentAcademicLevel: payload.result.currentAcademicLevel ? payload.result.currentAcademicLevel : undefined,
        nationalID: payload.result.nationalID ? payload.result.nationalID : undefined,
        currentlyBasedIn: payload.result.currentlyBasedIn ? payload.result.currentlyBasedIn : undefined,
        paypalEmail: payload.result.paypalEmail ? payload.result.paypalEmail : undefined,
        paymentMethod: payload.result.paymentMethod ? payload.result.paymentMethod : undefined,
        bankName: payload.result.bankName ? payload.result.bankName : undefined,
        accountHolderName: payload.result.accountHolderName ? payload.result.accountHolderName : undefined,
        accountNumber: payload.result.accountNumber ? payload.result.accountNumber : undefined,
        externalLogin: payload.result.externalLogin ? payload.result.externalLogin : undefined,

      };
    },
    fetchCoursesSuccess: (
      state: IEditProfileState,
      payload: IFetchCoursesSuccessPayload
    ): IEditProfileState => {
      return {
        ...state,
        tutorCourses: payload.result
      };
    },
    handleBeforeUpload: (
      state: IEditProfileState,
      payload: IImage
    ): IEditProfileState => {
      return {
        ...state,
        imageTemporary: payload.imageUrlBased64,
        loading: false
      };
    },
    handleYearChange: (
      state: IEditProfileState,
      payload: IEventWithIndex
    ): IEditProfileState => {
      return {
        ...state,
        teacherExperience: state.teacherExperience.map((value, i) => {
          if (i === payload.index) {
            return {
              ...value,
              year: payload.value,
              index: i
            };
          } else {
            return value;
          }
        }),
      };
    },

    handleExperienceChange: (
      state: IEditProfileState,
      payload: IEventWithIndex
    ): IEditProfileState => {
      return {
        ...state,
        teacherExperience: state.teacherExperience.map((value, i) => {
          if (i === payload.index) {
            return {
              ...value,
              experience: payload.event.target.value,
              index: i
            };
          } else {
            return value;
          }
        }),
      };
    },
    updateCourseForTutorSuccess: (
      state: IEditProfileState,
      payload: IGetCourseForTutorDetail
    ): IEditProfileState => {
      return {
        ...state,
        tutorCourses: state.tutorCourses.map((val) => val._id === payload._id ? {
          ...val,
          hourlyRate: payload.hourlyRate,
          course: payload.course
        } : val)
      };
    },
    clearCreateInputs: (
      state: IEditProfileState
    ): IEditProfileState => {
      return {
        ...state,
        createSubjectInputs: []
      };
    },
    handleCreateInputs: (
      state: IEditProfileState,
      payload: any
    ): IEditProfileState => {
      const subjectExisted = state.createSubjectInputs.filter((val) => val._id === payload._id);
      return {
        ...state,
        createSubjectInputs: !subjectExisted.length ? [payload, ...state.createSubjectInputs] : state.createSubjectInputs.filter((val) => val._id !== payload._id)
      };
    },
    addFieldTeacherExperience: (state: IEditProfileState): IEditProfileState => {
      return {
        ...state,
        teacherExperience: [
          ...state.teacherExperience,
          { year: [moment(), moment()], experience: '', index: state.teacherExperience.length }
        ]
      };
    },
    handleDeleteTeacherExperience: (
      state: IEditProfileState,
      payload: IEventWithIndex
    ): IEditProfileState => {
      return {
        ...state,
        teacherExperience: state.teacherExperience.filter((_value, i) => i !== payload.index)
      };
    },
    handleDeleteTeacherSubjectSuccess: (
      state: IEditProfileState,
      payload: any
    ): IEditProfileState => {
      return {
        ...state,
        isBusy: false,
        tutorCourses: state.tutorCourses.filter((_value) => _value._id !== payload.courseForTutorId)
      };
    },
    fetchCoursesLookupSuccess: (
      state: IEditProfileState,
      payload: IFetchCoursesSuccessPayload
    ): IEditProfileState => {
      return {
        ...state,
        isBusy: false,
        coursesLookup: payload.result
      };
    },
    handleSearchCourseInput: (
      state: IEditProfileState,
      payload: ICreateSubjectInput
    ): IEditProfileState => {
      return {
        ...state,
        searchInput: {
          ...state.searchInput,
          ...payload.data
        }
      };
    },
    handleSearchPhoneID: (
      state: IEditProfileState,
      payload: ICreateSubjectInput
    ): IEditProfileState => {
      return {
        ...state,
        searchInput: {
          ...state.searchInput,
          ...payload.data
        }
      };
    },
    handleChangeHourlyRateInput: (
      state: IEditProfileState,
      payload: IChangeHourlyRateInput
    ): IEditProfileState => {
      var newRateInputs = state.hourlyRateInputs.filter((value) => value._id !== payload._id);
      newRateInputs.push(payload);
      return {
        ...state,
        hourlyRateInputs: newRateInputs
      };
    },
    createCourseForTutorSuccess: (
      state: IEditProfileState,
      payload: IGetCourseForTutorDetail
    ): IEditProfileState => {
      return {
        ...state,
        tutorCourses: [payload, ...state.tutorCourses]
      };
    },
    toggleCreateCourseModal: (
      state: IEditProfileState,
      payload: boolean
    ): IEditProfileState => {
      return {
        ...state,
        createSubjectModal: payload
      };
    },
    clearhourlyRateInputs: (
      state: IEditProfileState
    ): IEditProfileState => {
      return {
        ...state,
        hourlyRateInputs: []
      };
    },
    fetchCurrenciesSuccess: (
      state: IEditProfileState,
      payload: IFetchCurrenciesSuccess
    ): IEditProfileState => {
      return {
        ...state,
        currencies: payload.results
      }
    },
    onChangeCurrency: (
      state: IEditProfileState,
      payload: string
    ): IEditProfileState => {
      return {
        ...state,
        currencyInput: payload
      }
    },
    deleteTutoringTeacherSubjectSuccess: (
      state: IEditProfileState,
      payload: string
    ): IEditProfileState => {
      return {
        ...state,
        tutorCourses: state.tutorCourses.filter(value => value._id !== payload)
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
        const result = await usersService.findById(
          payload.id,
        );
        this.fetchDataSuccess({ result });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async updateUser(
      payload: IUpdateUserPayload,
      rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const usersService = getUsersService(rootState.profileModel.token);
        await usersService.update({
          ...payload.userInfo,
        });
        this.updateUserSuccess({ userInfo: payload.userInfo });
        message.success("Update user's information successfully!", 3);
      } catch (error) {
        this.updateUserError();
        message.error(error.message, 4);
      }
    },
    async deleteTeacherSubject(
      payload: IDeleteTeacherSubjectPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        await getUsersService().trutlyDeleteTeacherSubject(payload.courseForTutorId);
        this.handleDeleteTeacherSubjectSuccess(payload);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async deleteTutoringTeacherSubject(
      payload: string,
    ): Promise<void> {
      try {
        await getUsersService().trutlyDeleteTeacherSubject(payload);
        this.deleteTutoringTeacherSubjectSuccess(payload);
      } catch (error) {
        message.error(error.message, 4);
      }
    }
  }
});

export default editProfilePageModel;
