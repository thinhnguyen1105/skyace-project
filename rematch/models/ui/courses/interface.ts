import {
  ICreateCourseInput,
  IUpdateCourseInput,
  IGetCourseDetail
} from '../../../../api/modules/elearning/courses/interface';

export interface ICoursePageState {
  courses: IGetCourseDetail[];
  createInput: object;
  updateInput: object;
  error: string;
  searchInput: string;
  createModalVisible: boolean;
  updateModalVisible: string;
  lookupInput?: object;
  countries: any;
  levels: any;
  subjects: any;
  grades: any;
}

export interface ICoursePageReducer {
  changeCreateInput: (
    payload: IChangeNewCourseInputPayload
  ) => ICoursePageState;
  handleSubmit: () => ICoursePageState;
}

export interface ICoursePageEffect {
  fetchAllCourses: () => Promise<void>;
  createNewCourse: (payload: ICreateNewCoursePayload) => Promise<void>;
}

export interface IChangeNewCourseInputPayload {
  data: any;
}

export interface ICreateNewCoursePayload {
  data: ICreateCourseInput;
}

export interface ICreateMultipleCoursePayload {
  data: any;
  grade: any;
}
export interface IFetchCoursesSuccessPayload {
  courses: any;
}

export interface IFetchCoursesErrorPayload {
  error: string;
}

export interface ICreateNewCourseSuccessPayload {
  course: IGetCourseDetail;
}

export interface ICreateNewCourseErrorPayload {
  error: string;
}

export interface IChangeUpdateCourseInputPayload {
  data: any;
}

export interface IToggleUpdateModalPayload {
  _id: string;
}

export interface IUpdateCoursePayload {
  data: IUpdateCourseInput;
}

export interface IUpdateCourseSuccessPayload {
  course: IGetCourseDetail;
}

export interface IUpdateCourseErrorPayload {
  error: string;
}

export interface IDeleteCoursePayload {
  _id: string;
}

export interface IDeleteCourseSuccessPayload {
  _id: string;
}

export interface IDeleteCourseErrorPayload {
  error: string;
}

export interface IGetLookupInputPayloadSuccess {
  data: object;
}

export interface IGetLookupInputPayloadError {
  error: string;
}

export interface ISearchInputChangePayload {
  keyword: string;
}

export interface ISearchPayload {
  keyword: string;
}

export interface ISearchSuccessPayload {
  courses: any;
}

export interface ISearchErrorPayload {
  error: string;
}

export interface IFetchCountriesSuccessPayload {
  countries: any;
}

export interface IFilterPayload {
  country: string;
}