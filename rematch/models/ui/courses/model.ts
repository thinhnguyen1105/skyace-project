import { createModel, ModelConfig } from '@rematch/core';
import {
  ICoursePageState,
  IChangeNewCourseInputPayload,
  ICreateNewCoursePayload,
  IFetchCoursesSuccessPayload,
  IFetchCoursesErrorPayload,
  ICreateNewCourseSuccessPayload,
  ICreateNewCourseErrorPayload,
  IChangeUpdateCourseInputPayload,
  IToggleUpdateModalPayload,
  IUpdateCoursePayload,
  IUpdateCourseSuccessPayload,
  IUpdateCourseErrorPayload,
  IDeleteCourseSuccessPayload,
  IDeleteCourseErrorPayload,
  IDeleteCoursePayload,
  ISearchPayload,
  ISearchSuccessPayload,
  ISearchErrorPayload,
  ISearchInputChangePayload,
  ICreateMultipleCoursePayload,
  IFetchCountriesSuccessPayload,
  IFilterPayload
} from "./interface";
import { getCourseService, getMetadataService } from "../../../../service-proxies";
import { message } from 'antd';

const coursePageModel: ModelConfig<ICoursePageState> = createModel({
  state: {
    courses: [],
    createInput: {

    },
    updateInput: {

    },
    searchInput: '',
    error: "",
    createModalVisible: false,
    updateModalVisible: "",
    lookupInput: {},
    countries: [],
    levels: [],
    subjects: [],
    grades: []
  },
  reducers: {
    showCreateModal: (
      state: ICoursePageState
    ) => {
      return {
        ...state,
        createModalVisible: true,
        error: ''
      };
    },
    hideCreateModal: (
      state: ICoursePageState
    ) => {
      return {
        ...state,
        createModalVisible: false
      };
    },
    showUpdateModal: (
      state: ICoursePageState,
      payload: IToggleUpdateModalPayload
    ) => {
      return {
        ...state,
        updateModalVisible: payload._id,
        error: ''
      };
    },
    hideUpdateModal: (
      state: ICoursePageState
    ) => {
      return {
        ...state,
        updateModalVisible: ''
      };
    },
    changeCreateCourseInput: (
      state: ICoursePageState,
      payload: IChangeNewCourseInputPayload
    ): ICoursePageState => {
      return {
        ...state,
        createInput: { ...state.createInput, ...payload.data },
        error: ''
      };
    },
    createCourseSuccess: (
      state: ICoursePageState,
      payload: ICreateNewCourseSuccessPayload
    ): ICoursePageState => {
      return {
        ...state,
        courses: [payload.course, ...state.courses],
        error: '',
        createModalVisible: false,
        createInput: {}
      };
    },
    createCourseError: (
      state: ICoursePageState,
      payload: ICreateNewCourseErrorPayload
    ): ICoursePageState => {
      return {
        ...state,
        error: payload.error,
        createModalVisible: false
      };
    },
    createMultipleCourseSuccess: (
      state: ICoursePageState,
      payload: any
    ): ICoursePageState => {
      return {
        ...state,
        courses: [...payload.courses, ...state.courses],
        error: '',
        createModalVisible: false,
        createInput: {}
      };
    },
    fetchCoursesSuccess: (
      state: ICoursePageState,
      payload: IFetchCoursesSuccessPayload
    ): ICoursePageState => {
      return {
        ...state,
        courses: payload.courses
      };
    },
    fetchCoursesError: (
      state: ICoursePageState,
      payload: IFetchCoursesErrorPayload
    ): ICoursePageState => {
      return {
        ...state,
        error: payload.error
      };
    },
    initUpdateCourseInput: (
      state: ICoursePageState,
      payload: IChangeUpdateCourseInputPayload
    ): ICoursePageState => {
      return {
        ...state,
        updateInput: {
          ...state.updateInput,
          ...payload.data,
          level: payload.data.level ? payload.data.level._id : undefined,
          grade: payload.data.grade ? payload.data.grade._id : undefined,
          subject: payload.data.subject ? payload.data.subject._id : undefined,
        },
        error: ''
      };
    },
    changeUpdateCourseInput: (
      state: ICoursePageState,
      payload: IChangeUpdateCourseInputPayload
    ): ICoursePageState => {
      return {
        ...state,
        updateInput: {
          ...state.updateInput,
          ...payload.data,
        },
        error: ''
      };
    },
    updateCourseSuccess: (
      state: ICoursePageState,
      payload: IUpdateCourseSuccessPayload
    ): ICoursePageState => {
      const newCourses = state.courses.map((item) => {
        return item._id === payload.course._id ? payload.course : item;
      });
      return {
        ...state,
        courses: newCourses,
        error: '',
        updateModalVisible: ''
      };
    },
    updateCourseError: (
      state: ICoursePageState,
      payload: IUpdateCourseErrorPayload
    ): ICoursePageState => {
      return {
        ...state,
        error: payload.error,
        updateModalVisible: ''
      };
    },
    deleteCourseSuccess: (
      state: ICoursePageState,
      payload: IDeleteCourseSuccessPayload
    ): ICoursePageState => {
      const newCourses = state.courses.filter((item) => {
        return item._id !== payload._id;
      });
      return {
        ...state,
        courses: newCourses,
        error: ''
      };
    },
    deleteCourseError: (
      state: ICoursePageState,
      payload: IDeleteCourseErrorPayload
    ): ICoursePageState => {
      return {
        ...state,
        error: payload.error
      };
    },
    searchInputChange: (
      state: ICoursePageState,
      payload: ISearchInputChangePayload
    ): ICoursePageState => {
      return {
        ...state,
        searchInput: payload.keyword
      };
    },
    searchSuccess: (
      state: ICoursePageState,
      payload: ISearchSuccessPayload
    ): ICoursePageState => {
      return {
        ...state,
        courses: payload.courses
      };
    },
    searchError: (
      state: ICoursePageState,
      payload: ISearchErrorPayload
    ): ICoursePageState => {
      return {
        ...state,
        error: payload.error
      };
    },
    fetchAllCountriesSuccess: (
      state: ICoursePageState,
      payload: IFetchCountriesSuccessPayload
    ): ICoursePageState => {
      return {
        ...state,
        countries: payload.countries
      };
    },
    fetchAllCountriesError: (
      state: ICoursePageState,
      payload: ISearchErrorPayload
    ): ICoursePageState => {
      return {
        ...state,
        error: payload.error
      };
    },
    fetchLevelsSuccess: (
      state: ICoursePageState,
      payload: any
    ): ICoursePageState => {
      return {
        ...state,
        levels: payload
      };
    },
    fetchSubjectsSuccess: (
      state: ICoursePageState,
      payload: any
    ): ICoursePageState => {
      return {
        ...state,
        subjects: payload
      };
    },
    fetchGradesSuccess: (
      state: ICoursePageState,
      payload: any
    ): ICoursePageState => {
      return {
        ...state,
        grades: payload
      };
    },
  },
  effects: {
    async fetchCoursesEffect(): Promise<void> {
      try {
        const result = await getCourseService().getAllCourses();
        console.log('result', result);
        this.fetchCoursesSuccess({ courses: result });
      } catch (err) {
        this.fetchCoursesError({ error: err.message });
      }
    },
    async createCourseEffect(
      payload: ICreateNewCoursePayload,
      _rootState: any
    ): Promise<void> {
      try {
        const result = await getCourseService().createCourse(payload.data);
        this.createCourseSuccess({ course: result });
        const countries = await getCourseService().getAllCountries();
        this.fetchAllCountriesSuccess({ countries: countries });
      } catch (err) {
        this.createCourseError({ error: err.message });
      }
    },
    async createMultipleCourseEffect(
      payload: ICreateMultipleCoursePayload,
      _rootState: any
    ): Promise<void> {
      try {
        const promises = payload.grade.map((val) => {
          return getCourseService().createCourse({ ...payload.data, grade: val.content });
        });
        Promise.all(promises).then(async (results) => {
          this.createMultipleCourseSuccess({ courses: results });
          const countries = await getCourseService().getAllCountries();
          this.fetchAllCountriesSuccess({ countries: countries });
        });
      } catch (err) {
        this.createCourseError({ error: err.message });
      }
    },
    async updateCourseEffect(
      payload: IUpdateCoursePayload,
      _rootState: any
    ): Promise<void> {
      try {
        const course = await getCourseService().updateCourse(payload.data);
        this.updateCourseSuccess({ course });
      } catch (err) {
        // TODO
        this.updateCourseError({ error: err.message });
      }
    },
    async deleteCourseEffect(
      payload: IDeleteCoursePayload,
      _rootState: any
    ): Promise<void> {
      try {
        await getCourseService().deleteCourse(payload);
        this.deleteCourseSuccess(payload);
      } catch (err) {
        this.deleteCourseError({ error: err.message });
      }
    },
    async searchEffect(
      payload: ISearchPayload,
      _rootState: any
    ): Promise<any> {
      try {
        const results = await getCourseService().searchCourse(payload.keyword);
        this.searchSuccess({ courses: results });
      } catch (err) {
        this.searchError({ error: err.message });
      }
    },
    async fetchAllCountriesEffect(): Promise<void> {
      try {
        const results = await getCourseService().getAllCountries();
        this.fetchAllCountriesSuccess({ countries: results });
      } catch (err) {
        this.fetchAllCountriesError({ error: err.message });
      }
    },
    async filterCourse(
      payload: IFilterPayload,
      _rootState: any
    ): Promise<void> {
      try {
        const results = await getCourseService().filterCourse(payload);
        this.fetchCoursesSuccess({ courses: results });
      } catch (err) {
        this.fetchCoursesError({ error: err.message });
      }
    },
    async fetchSubjectsEffect(
      _payload: any,
      _rootState: any
    ): Promise<void> {
      try {
        const results = await getMetadataService().getAllSubjects();
        this.fetchSubjectsSuccess(results.data);
      } catch (err) {
        message.error(err.message || 'Internal server error');
      }
    },
    async fetchLevelsEffect(
      _payload: any,
      _rootState: any
    ): Promise<void> {
      try {
        const results = await getMetadataService().getAllLevels();
        this.fetchLevelsSuccess(results.data);
      } catch (err) {
        message.error(err.message || 'Internal server error');
      }
    },
    async fetchGradesEffect(
      _payload: any,
      _rootState: any
    ): Promise<void> {
      try {
        const results = await getMetadataService().getAllGrades();
        this.fetchGradesSuccess(results.data);
      } catch (err) {
        message.error(err.message || 'Internal server error');
      }
    },
  }
});

export default coursePageModel;
