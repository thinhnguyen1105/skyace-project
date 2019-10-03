import { createModel, ModelConfig } from '@rematch/core';
import { IErrorHappenPayload, IFetchDataSuccessPayload, IUpdateBlogSuccessPayload, IActivateBlogSuccessPayload, IFileListPayload, IImage, IPaginationChange, IGetPostById, IGetPostByIdSuccess, IGetPostByFriendlyUrl } from './interface';
import { IBlogPageState, ICreateNewBlogPayload, ISearchChangePayload, IFetchDataPayload } from './interface';
import { IFindBlogDetail, IUpdateBlogDetail } from 'api/modules/website/blog/interface';
import { message } from 'antd';
import { getBlogService } from '../../../../service-proxies';
import config from '../../../../api/config/default.config';

const blogPageModel: ModelConfig<IBlogPageState> = createModel({
  state: {
    errorMessage: '',
    data: [],
    isBusy: false,
    deactivateStatus: '',
    searchByTitleData: [],
    showEditModal: false,
    search: '',
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    asc: false,
    total: 0,
    currentBlog: {} as any,
    showAllPosts: true,
    fileList: [],
    imageTemporary: '',
    recentPosts: [],
    loginModalVisible: false,
    registerModalVisible: false,
    registerSuccessModalVisible: false,
    resetPasswordModalVisible: false,
  },
  reducers: {
    clearState: (_state: IBlogPageState): IBlogPageState => {
      return {
        errorMessage: '',
        data: [],
        isBusy: false,
        deactivateStatus: '',
        searchByTitleData: [],
        showEditModal: false,
        search: '',
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        asc: true,
        total: 0,
        currentBlog: {} as any,
        showAllPosts: true,
        fileList: [],
        imageTemporary: '',
        recentPosts: [],
        loginModalVisible: false,
        registerModalVisible: false,
        registerSuccessModalVisible: false,
        resetPasswordModalVisible: false,
      };
    },
    openResetPasswordModal: (state: IBlogPageState): IBlogPageState => {
      return {
        ...state,
        resetPasswordModalVisible: true,
        loginModalVisible: false,
      };
    },
    closeResetPasswordModal: (state: IBlogPageState): IBlogPageState => {
      return {
        ...state,
        resetPasswordModalVisible: false,
        loginModalVisible: false,
      };
    },
    openLoginModal: (state: IBlogPageState): IBlogPageState => {
      return {
        ...state,
        loginModalVisible: true,
        registerModalVisible: false,
        registerSuccessModalVisible: false,
      };
    },
    closeLoginModal: (state: IBlogPageState): IBlogPageState => {
      return {
        ...state,
        loginModalVisible: false,
      };
    },
    openRegisterModal: (state: IBlogPageState): IBlogPageState => {
      return {
        ...state,
        loginModalVisible: false,
        registerModalVisible: true,
        registerSuccessModalVisible: false,
      };
    },
    closeRegisterModal: (state: IBlogPageState): IBlogPageState => {
      return {
        ...state,
        registerModalVisible: false,
      };
    },
    openRegisterSuccessModal: (state: IBlogPageState): IBlogPageState => {
      return {
        ...state,
        loginModalVisible: false,
        registerModalVisible: false,
        registerSuccessModalVisible: true,
      };
    },
    closeLoginSuccessModal: (state: IBlogPageState): IBlogPageState => {
      return {
        ...state,
        registerSuccessModalVisible: false,
      };
    },
    starting: (
      state: IBlogPageState,
    ): IBlogPageState => {
      return {
        ...state,
        isBusy: true,
      };
    },
    blogInfoChange: (
      state: IBlogPageState,
      payload: any
    ): IBlogPageState => {
      return {
        ...state,
        currentBlog: {
          ...state.currentBlog,
          ...payload
        }
      };
    },
    searchChangeReducer: (
      state: IBlogPageState,
      payload: ISearchChangePayload
    ): IBlogPageState => {
      return {
        ...state,
        search: payload.searchValue
      };
    },
    fetchDataReducer: (
      state: IBlogPageState,
      payload: IFetchDataPayload
    ): IBlogPageState => {
      return {
        ...state,
        ...payload
      };
    },
    errorHappen: (
      state: IBlogPageState,
      payload: IErrorHappenPayload
    ): IBlogPageState => {
      return {
        ...state,
        errorMessage: payload.errorMessage
      };
    },
    fetchDataSuccess: (
      state: IBlogPageState,
      payload: IFetchDataSuccessPayload
    ): IBlogPageState => {
      return {
        ...state,
        isBusy: false,
        total: payload.result.total,
        data: payload.result.data
      };
    },
    getPostByIdSuccess: (
      state: IBlogPageState,
      payload: IGetPostByIdSuccess
    ): IBlogPageState => {
      return {
        ...state,
        data: [payload.data]
      };
    },
    getPostByFriendlyUrlSuccess: (
      state: IBlogPageState,
      payload: IGetPostByIdSuccess
    ): IBlogPageState => {
      return {
        ...state,
        data: [payload.data]
      };
    },
    createNewBlogSuccess: (
      state: IBlogPageState,
      payload: IFindBlogDetail
    ): IBlogPageState => {
      return {
        ...state,
        isBusy: false,
        total: state.total + 1,
        data: [payload, ...state.data],
        currentBlog: {} as any,
        errorMessage: '',
        showAllPosts: true,
      };
    },
    updateBlogSuccess: (
      state: IBlogPageState,
      payload: IUpdateBlogSuccessPayload
    ): IBlogPageState => {
      return {
        ...state,
        isBusy: false,
        showEditModal: false,
        data: state.data.map(item => {
          if (item._id === (payload.blogInfo._id)) {
            return {
              ...item,
              ...payload.blogInfo
            } as IFindBlogDetail;
          } else {
            return item;
          }
        })
      };
    },
    activateBlogSuccess: (
      state: IBlogPageState,
      payload: IActivateBlogSuccessPayload
    ): IBlogPageState => {
      const activatedBlog = state.data.filter(
        item => item._id === payload.blogId
      )[0];
      activatedBlog.isActive = true;
      return {
        ...state,
        isBusy: false,
        data: state.data.map(item => {
          if (item._id === payload.blogId) {
            return activatedBlog;
          } else {
            return item;
          }
        })
      };
    },
    deactivateBlogSuccess: (
      state: IBlogPageState,
      payload: IActivateBlogSuccessPayload
    ): IBlogPageState => {
      const deactivatedBlog = state.data.filter(
        item => item._id === payload.blogId
      )[0];
      deactivatedBlog.isActive = false;
      return {
        ...state,
        isBusy: false,
        data: state.data.map(item => {
          if (item._id === payload.blogId) {
            return deactivatedBlog;
          } else {
            return item;
          }
        })
      };
    },
    changeRadioButton: (
      state: IBlogPageState,
    ): IBlogPageState => {
      return {
        ...state,
        showAllPosts: !state.showAllPosts
      };
    },
    onShowEditModal: (
      state: IBlogPageState,
    ): IBlogPageState => {
      return {
        ...state,
        showEditModal: true,
        fileList: [],
        imageTemporary: ''
      };
    },
    onHideEditModal: (
      state: IBlogPageState,
    ): IBlogPageState => {
      return {
        ...state,
        showEditModal: false,
        fileList: [],
        imageTemporary: ''
      };
    },
    onIncludeDeactivePostSuccess: (
      state: IBlogPageState,
      payload: IFetchDataSuccessPayload
    ): IBlogPageState => {
      return {
        ...state,
        isBusy: false,
        total: payload.result.total,
        data: payload.result.data
      };
    },
    onExcludeDeactivePostSuccess: (
      state: IBlogPageState,
      payload: IFetchDataSuccessPayload
    ): IBlogPageState => {
      return {
        ...state,
        isBusy: false,
        total: payload.result.total,
        data: payload.result.data
      };
    },
    onChangeFileList: (
      state: IBlogPageState,
      payload: IFileListPayload
    ): IBlogPageState => {
      return {
        ...state,
        fileList: [payload.file]
      };
    },
    handleBeforeUpload: (
      state: IBlogPageState,
      payload: IImage
    ): IBlogPageState => {
      return {
        ...state,
        imageTemporary: payload.imageUrl,
        isBusy: false
      };
    },
    handlePaginationChange: (
      state: IBlogPageState,
      payload: IPaginationChange
    ): IBlogPageState => {
      return {
        ...state,
        pageNumber: payload.current,
        pageSize: payload.pageSize
      };
    },
    getRecentPostsSuccess: (
      state: IBlogPageState,
      payload: IFetchDataSuccessPayload
    ): IBlogPageState => {
      return {
        ...state,
        isBusy: false,
        recentPosts: payload.result.data
      };
    }
  },
  effects: {
    async fetchDataEffect(
      payload: IFetchDataPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const BlogService = getBlogService();
        const result = await BlogService.findPostByTitle(
          payload.search,
          payload.pageNumber,
          payload.pageSize,
          payload.sortBy,
          payload.asc
        );
        this.fetchDataSuccess({ result });
      } catch (error) {
        console.log(error);
      }
    },
    async searchChangeEffect(
      payload: ISearchChangePayload,
      rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const BlogsService = getBlogService();
        const result = await BlogsService.findPostByTitle(
          payload.searchValue,
          rootState.blogPageModel.pageNumber,
          rootState.blogPageModel.pageSize,
          rootState.blogPageModel.sortBy,
          rootState.blogPageModel.asc
        );
        this.fetchDataSuccess({ result });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async createNewBlog(
      payload: ICreateNewBlogPayload,
      rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const blogService = getBlogService();
        const newBlog = await blogService.newpost({
          ...payload,
          imageSrc: 'none',
          isActive: true,
        });
        let formData = new FormData();
        rootState.blogPageModel.fileList.forEach((file) => {
          formData.set('image', file);
        });
        await fetch(
          `${config.nextjs.apiUrl}/images/upload/blog/${newBlog._id}`, {
            method: 'POST',
            headers: {
              'authorization': rootState.profileModel.token,
            },
            body: formData,
          }
        );
        await blogService.edit({
          _id: newBlog._id,
          imageSrc: rootState.blogPageModel.fileList.length === 0 ? 'none' : `/static/images/blog/image-${newBlog._id}.${rootState.blogPageModel.fileList[0].type.slice(6, 10)}`
        } as any);

        this.createNewBlogSuccess({
          ...newBlog,
          imageSrc: rootState.blogPageModel.fileList.length === 0 ? 'none' : `/static/images/blog/image-${newBlog._id}.${rootState.blogPageModel.fileList[0].type.slice(6, 10)}`
        });
        message.success('Create new blog Successfully!', 3);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async updateBlog(
      payload: IUpdateBlogDetail,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const BlogsService = getBlogService();
        const newBlogInfo = await BlogsService.edit(payload);

        this.updateBlogSuccess({ blogInfo: newBlogInfo });
        message.success('Update blog successfully!', 3);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async activateBlog(
      payload: IActivateBlogSuccessPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const blogService = getBlogService();
        await blogService.activate(payload.blogId);
        this.activateBlogSuccess(payload);
        message.success('Activate blog successfully!', 3);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async deactivateBlog(
      payload: IActivateBlogSuccessPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const blogService = getBlogService();
        await blogService.deactivate(payload.blogId);

        this.deactivateBlogSuccess(payload);
        message.success('Deactivate blog successfully!', 3);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async onIncludeDeactivePost(
      payload: ISearchChangePayload,
      rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const blogService = getBlogService();
        const result = await blogService.findPostByTitle(
          payload.searchValue,
          rootState.blogPageModel.pageNumber,
          rootState.blogPageModel.pageSize,
          rootState.blogPageModel.sortBy,
          rootState.blogPageModel.asc
        );
        this.onIncludeDeactivePostSuccess({ result: result });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async onExcludeDeactivePost(
      payload: ISearchChangePayload,
      rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const blogService = getBlogService();
        const result = await blogService.getActivePost(
          payload.searchValue,
          rootState.blogPageModel.pageNumber,
          rootState.blogPageModel.pageSize,
          rootState.blogPageModel.sortBy,
          rootState.blogPageModel.asc
        );
        this.onExcludeDeactivePostSuccess({ result: result });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async getPostByIdEffect(
      payload: IGetPostById,
      _rootState: any
    ): Promise<void> {
      try {
        const blogService = getBlogService();
        const result = await blogService.getPostById(
          payload.blogId
        );
        this.getPostByIdSuccess({ data: result });
      } catch (error) {
        console.log(error);
      }
    },
    async getPostByFriendlyUrlEffect(
      payload: IGetPostByFriendlyUrl,
      _rootState: any
    ): Promise<void> {
      try {
        const blogService = getBlogService();
        const result = await blogService.getPostByFriendlyUrl(
          payload.friendlyUrl
        );
        this.getPostByFriendlyUrlSuccess({ data: result });
      } catch (error) {
        console.log(error);
      }
    },
    async getRecentPostsEffect(
      _payload: any,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const BlogService = getBlogService();
        const result = await BlogService.getLastestPost();
        this.getRecentPostsSuccess({ result });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async getActivePostEffect(
      payload: IFetchDataPayload,
      _rootState: any
    ): Promise<void> {
      try {
        this.starting();
        const blogService = getBlogService();
        const result = await blogService.getActivePost(
          payload.search,
          payload.pageNumber,
          payload.pageSize,
          payload.sortBy,
          payload.asc,
        );
        this.fetchDataSuccess({ result: result });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
  }
});

export default blogPageModel;