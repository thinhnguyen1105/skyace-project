import { IFindPostResult, IFindBlogDetail, IUpdateBlogDetail } from "../../../../api/modules/website/blog/interface";

export interface IBlogPageState {
  data: IFindBlogDetail[];
  isBusy: boolean;
  errorMessage: string;
  deactivateStatus: string;
  searchByTitleData: IFindBlogDetail[];
  showEditModal: boolean;
  showAllPosts: boolean;
  total: number;
  search: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  asc: boolean;
  currentBlog: IFindBlogDetail;
  fileList: any[];
  imageTemporary: string;
  recentPosts: any[];
  loginModalVisible: boolean;
  registerModalVisible: boolean;
  registerSuccessModalVisible: boolean;
  resetPasswordModalVisible: boolean;
}

export interface ICreateNewBlogPayload {
  title: string;
  subtitle: string;
  author: string;
  tags: string[];
  content: string;
  imageSrc: string;
  isActive: boolean;
  isDraft: boolean;
}

export interface ISearchChangePayload {
  searchValue: string;
}

export interface IFetchDataPayload {
  search: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  asc: boolean;
}

export interface IErrorHappenPayload {
  errorMessage: string;
}

export interface IFetchDataSuccessPayload {
  result: IFindPostResult;
}
export interface IGetPostByIdSuccess {
  data: IFindBlogDetail;
}

export interface IUpdateBlogSuccessPayload {
  blogInfo: IFindBlogDetail;
}

export interface IActivateBlogSuccessPayload {
  blogId: string;
}

export interface IUpdateBlogPayload {
  blogInfo: IUpdateBlogDetail;
}

export interface IImage {
  imageUrl: string;
}

export interface IFileListPayload {
  file: any;
}

export interface IPaginationChange {
  current: number;
  pageSize: number;
}

export interface IGetPostById {
  blogId: string;
}

export interface IGetPostByFriendlyUrl {
  friendlyUrl: string;
}
