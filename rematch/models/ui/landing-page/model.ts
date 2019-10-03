import { createModel, ModelConfig } from '@rematch/core';
import { ILandingPageState, IGetLandingPageDataSuccess, IHandleImagePageChange, IHandleEditorChange, IImage, IHandleMenuBar, IOnTenantChange, IHandlePopularTutionCourseChange, IHandleDeletePopularTutionCourses, IUpdateLandingPageState, IOnChangeStudentVideoFileList, IOnChangeTutorVideoFileList } from "./interface";
import { getLandingPageService } from '../../../../service-proxies';
import { message } from 'antd';
import { IUpdateLandingPageDetail } from '../../../../api/modules/website/landing-page/interface';
import config from "../../../../api/config/default.config";

const landingPageModel: ModelConfig<ILandingPageState> = createModel({
    state: {
        data: {},
        isBusy: false,
        imageTemporary3: [],
        imageTemporary4: [],
        studentVideoFileList: [],
        studentVideoOggFileList: [],
        studentVideoWebmFileList: [],
        tutorVideoFileList: [],
        tutorVideoOggFileList: [],
        tutorVideoWebmFileList: [],
        topBannerBackgroundTemporary: '',
        logoTemporary: '',
        promoPhoto1Temporary: '',
        promoPhoto2Temporary: '',
        promoPhoto3Temporary: '',
        loginModalVisible: false,
        registerModalVisible: false,
        registerSuccessModalVisible: false,
        resetPasswordModalVisible: false,
        currentTenant: 'default'
    },
    reducers: {
        'loginPageModel/onLoginSuccess': (state: ILandingPageState): ILandingPageState => {
            return {
                ...state,
                loginModalVisible: false,
            };
        },
        openResetPasswordModal: (state: ILandingPageState): ILandingPageState => {
            return {
                ...state,
                resetPasswordModalVisible: true,
                loginModalVisible: false,
            };
        },
        closeResetPasswordModal: (state: ILandingPageState): ILandingPageState => {
            return {
                ...state,
                resetPasswordModalVisible: false,
                loginModalVisible: false,
            };
        },
        openLoginModal: (state: ILandingPageState): ILandingPageState => {
            return {
                ...state,
                loginModalVisible: true,
                registerModalVisible: false,
                registerSuccessModalVisible: false,
            };
        },
        closeLoginModal: (state: ILandingPageState): ILandingPageState => {
            return {
                ...state,
                loginModalVisible: false,
            };
        },
        openRegisterModal: (state: ILandingPageState): ILandingPageState => {
            return {
                ...state,
                loginModalVisible: false,
                registerModalVisible: true,
                registerSuccessModalVisible: false,
            };
        },
        closeRegisterModal: (state: ILandingPageState): ILandingPageState => {
            return {
                ...state,
                registerModalVisible: false,
            };
        },
        openRegisterSuccessModal: (state: ILandingPageState): ILandingPageState => {
            return {
                ...state,
                loginModalVisible: false,
                registerModalVisible: false,
                registerSuccessModalVisible: true,
            };
        },
        closeLoginSuccessModal: (state: ILandingPageState): ILandingPageState => {
            return {
                ...state,
                registerSuccessModalVisible: false,
            };
        },
        starting: (
            state: ILandingPageState,
        ): ILandingPageState => {
            return {
                ...state,
                isBusy: true,
            };
        },
        getLandingPageDataSuccess: (
            state: ILandingPageState,
            payload: IGetLandingPageDataSuccess
        ): ILandingPageState => {
            return {
                ...state,
                isBusy: false,
                data: payload.data
            };
        },
        updateLandingPageDataSuccess: (
            state: ILandingPageState,
            payload: IGetLandingPageDataSuccess
        ): ILandingPageState => {
            return {
                ...state,
                isBusy: false,
                data: payload.data
            };
        },
        handleImagePageChange: (
            state: ILandingPageState,
            payload: IHandleImagePageChange
        ): ILandingPageState => {
            message.success('Upload image successful');
            if (payload.pageValue === '3' || payload.pageValue === '4') {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        pages: (state.data as any).pages.map((value, index) => {
                            if (index + 3 === (state.data as any).pages[Number(payload.pageValue) - 3].pageValue) {
                                value.icons[payload.pageIndex as any] = payload.html;
                                return value;
                            } else {
                                return value;
                            }
                        })
                    },
                };
            } else if (payload.pageValue === 'top-banner-background') {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        topBannerBackground: payload.html
                    }
                };
            } else if (payload.pageValue === 'logo') {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        logo: payload.html
                    }
                };
            } else if (payload.pageValue === 'promoPhoto1') {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        promoPhoto1: payload.html
                    }
                };
            } else if (payload.pageValue === 'promoPhoto2') {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        promoPhoto2: payload.html
                    }
                };
            } else if (payload.pageValue === 'promoPhoto3') {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        promoPhoto3: payload.html
                    }
                };
            }

            else {
                return {
                    ...state
                };
            }
        },
        handleContentPageChange: (
            state: ILandingPageState,
            payload: IHandleImagePageChange
        ): ILandingPageState => {
            if (payload.pageValue === '3' || payload.pageValue === '4') {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        pages: (state.data as any).pages.map((value, index) => {
                            if (index + 3 === (state.data as any).pages[Number(payload.pageValue) - 3].pageValue) {
                                value.contents[payload.pageIndex as any] = payload.html;
                                return value;
                            } else {
                                return value;
                            }
                        })
                    },
                };
            } else {
                return {
                    ...state
                };
            }
        },
        handleBeforeUpload: (
            state: ILandingPageState,
            payload: IImage
        ): ILandingPageState => {
            if (payload.pageValue === '3') {
                return {
                    ...state,
                    imageTemporary3: ((state.data as any).pages[0].icons).map((value, index) => {
                        if (index === payload.pageIndex) {
                            value = payload.imageUrl;
                            return value;
                        } else {
                            return value;
                        }
                    })
                };
            } else if (payload.pageValue === '4') {
                return {
                    ...state,
                    imageTemporary4: ((state.data as any).pages[1].icons).map((value, index) => {
                        if (index === payload.pageIndex) {
                            value[index] = payload.imageUrl;
                            return value;
                        } else {
                            return value;
                        }
                    })
                };
            } else if (payload.pageValue === 'top-banner-background') {
                return {
                    ...state,
                    topBannerBackgroundTemporary: payload.imageUrl
                };
            } else if (payload.pageValue === 'logo') {
                return {
                    ...state,
                    logoTemporary: payload.imageUrl
                };
            } else if (payload.pageValue === 'promoPhoto1') {
                return {
                    ...state,
                    promoPhoto1Temporary: payload.imageUrl
                };
            } else if (payload.pageValue === 'promoPhoto2') {
                return {
                    ...state,
                    promoPhoto2Temporary: payload.imageUrl
                };
            } else if (payload.pageValue === 'promoPhoto3') {
                return {
                    ...state,
                    promoPhoto3Temporary: payload.imageUrl
                };
            } else {
                return {
                    ...state
                };
            }
        },
        handleEditorChange: (
            state: ILandingPageState,
            payload: IHandleEditorChange
        ): ILandingPageState => {
            switch (payload.keyValue) {
                case 'logo':
                    return {
                        ...state,
                        data: {
                            ...state.data,
                            logo: payload.html
                        }
                    };
                case 'topBannerBackground':
                    return {
                        ...state,
                        data: {
                            ...state.data,
                            topBannerBackground: payload.html
                        }
                    };
                default:
                    return {
                        ...state
                    };
            }
        },

        handlePopularTutionCoursesChange: (
            state: ILandingPageState,
            payload: IHandlePopularTutionCourseChange
        ): ILandingPageState => {
            return {
                ...state,
                data: {
                    ...state.data,
                    popularTutionCourses: (state.data as any).popularTutionCourses.map((value, index) => {
                        if (index === payload.index) {
                            return { course: payload.value };
                        } else {
                            return value;
                        }
                    })
                }
            }
        },

        handleDeletePopularTutionCourses: (
            state: ILandingPageState,
            payload: IHandleDeletePopularTutionCourses
        ): ILandingPageState => {
            return {
                ...state,
                data: {
                    ...state.data,
                    popularTutionCourses: (state.data as any).popularTutionCourses.filter((_value, i) => i !== payload.index)
                }
            }
        },
        handleAddPopularTutionCourses: (
            state: ILandingPageState,
        ): ILandingPageState => {
            return {
                ...state,
                data: {
                    ...state.data,
                    popularTutionCourses: [...(state.data as any).popularTutionCourses, { course: '' }]
                }
            }
        },
        handleMenuBarChange: (
            state: ILandingPageState,
            payload: IHandleMenuBar
        ): ILandingPageState => {
            return {
                ...state,
                data: {
                    ...state.data,
                    menuBar: {
                        ...(state.data as any).menuBar,
                        [payload.value]: { name: payload.name, hyperlink: payload.hyperlink }
                    }
                }
            };
        },
        onTenantChange: (
            state: ILandingPageState,
            payload: IOnTenantChange
        ): ILandingPageState => {
            return {
                ...state,
                currentTenant: payload.tenantId
            }
        },
        onChangeStudentVideoFileList: (
            state: ILandingPageState,
            payload: IOnChangeStudentVideoFileList
        ): ILandingPageState => {
            return {
                ...state,
                studentVideoFileList: [payload.file],
            }
        },
        onChangeStudentVideoOggFileList: (
            state: ILandingPageState,
            payload: IOnChangeStudentVideoFileList
        ): ILandingPageState => {
            return {
                ...state,
                studentVideoOggFileList: [payload.file],
            }
        },
        onChangeStudentVideoWebmFileList: (
            state: ILandingPageState,
            payload: IOnChangeStudentVideoFileList
        ): ILandingPageState => {
            return {
                ...state,
                studentVideoWebmFileList: [payload.file],
            }
        },
        onChangeTutorVideoFileList: (
            state: ILandingPageState,
            payload: IOnChangeTutorVideoFileList
        ): ILandingPageState => {
            return {
                ...state,
                tutorVideoFileList: [payload.file],
            }
        },
        onChangeTutorVideoOggFileList: (
            state: ILandingPageState,
            payload: IOnChangeTutorVideoFileList
        ): ILandingPageState => {
            return {
                ...state,
                tutorVideoOggFileList: [payload.file],
            }
        },
        onChangeTutorVideoWebmFileList: (
            state: ILandingPageState,
            payload: IOnChangeTutorVideoFileList
        ): ILandingPageState => {
            return {
                ...state,
                tutorVideoWebmFileList: [payload.file],
            }
        },
        updateLandingPageState: (
            state: ILandingPageState,
            payload: IUpdateLandingPageState,
        ): ILandingPageState => {
            return {
                ...state,
                data: {
                    ...state.data,
                    mainTitle: payload.mainTitle,
                    mainTitlePage2: payload.mainTitlePage2,
                    subTitlePage2: payload.subTitlePage2,
                    informationCourses: payload.informationCourses,
                    tutorTitle: payload.tutorTitle,
                    studentTitle: payload.studentTitle,
                    promoTitle1: payload.promoTitle1,
                    promoTitle2: payload.promoTitle2,
                    promoTitle3: payload.promoTitle3,
                    blogTitle: payload.blogTitle,
                    pages: (state.data as any).pages.map((value, index) => {
                        if (index === 0) {
                            return {
                                ...value,
                                mainTitle: payload.mainTitlePage3
                            }
                        } else if (index === 1) {
                            return {
                                ...value,
                                mainTitle: payload.mainTitlePage4,
                            }
                        } else {
                            return value;
                        }
                    }),
                    footerContent1: payload.footerContent1,
                    footerContent2: payload.footerContent2,
                    footerContent3: payload.footerContent3,
                    footerContent4: payload.footerContent4,
                }

            }
        }
    },
    effects: {
        async getLandingPageDataEffect(
            // payload: IGetLandingPagePayload,
            _rootState: any
        ): Promise<void> {
            try {
                this.starting();
                const LandingPageService = getLandingPageService();
                const data = await LandingPageService.get();
                // payload.tenantId
                this.getLandingPageDataSuccess({ data });
            } catch (error) {
                console.log(error);
            }
        },
        async updateLandingPageDataEffect(
            payload: IUpdateLandingPageDetail,
            rootState: any
        ): Promise<void> {
            try {
                this.starting();
                if (rootState.landingPageModel.studentVideoFileList.length !== 0) {
                    let studentFormData = new FormData();
                    rootState.landingPageModel.studentVideoFileList.forEach((file) => {
                        studentFormData.set('video', file);
                    });
                    await fetch(
                        `${
                        config.nextjs.apiUrl
                        }/images/upload-video/landing-page/student-video-${payload.tenantId}`, {
                            method: 'POST',
                            headers: {
                                'authorization': rootState.profileModel.token,
                            },
                            body: studentFormData,
                        }
                    );
                }
                if (rootState.landingPageModel.studentVideoOggFileList.length !== 0) {
                    let studentFormData = new FormData();
                    rootState.landingPageModel.studentVideoOggFileList.forEach((file) => {
                        studentFormData.set('video', file);
                    });
                    await fetch(
                        `${
                        config.nextjs.apiUrl
                        }/images/upload-video/landing-page/student-video-${payload.tenantId}`, {
                            method: 'POST',
                            headers: {
                                'authorization': rootState.profileModel.token,
                            },
                            body: studentFormData,
                        }
                    );
                }
                if (rootState.landingPageModel.studentVideoWebmFileList.length !== 0) {
                    let studentFormData = new FormData();
                    rootState.landingPageModel.studentVideoWebmFileList.forEach((file) => {
                        studentFormData.set('video', file);
                    });
                    await fetch(
                        `${
                        config.nextjs.apiUrl
                        }/images/upload-video/landing-page/student-video-${payload.tenantId}`, {
                            method: 'POST',
                            headers: {
                                'authorization': rootState.profileModel.token,
                            },
                            body: studentFormData,
                        }
                    );
                }
                if (rootState.landingPageModel.tutorVideoFileList.length !== 0) {
                    let tutorFormData = new FormData();
                    rootState.landingPageModel.tutorVideoFileList.forEach((file) => {
                        tutorFormData.set('video', file);
                    });
                    await fetch(
                        `${
                        config.nextjs.apiUrl
                        }/images/upload-video/landing-page/tutor-video-${payload.tenantId}`, {
                            method: 'POST',
                            headers: {
                                'authorization': rootState.profileModel.token,
                            },
                            body: tutorFormData,
                        }
                    );
                }
                if (rootState.landingPageModel.tutorVideoOggFileList.length !== 0) {
                    let tutorFormData = new FormData();
                    rootState.landingPageModel.tutorVideoOggFileList.forEach((file) => {
                        tutorFormData.set('video', file);
                    });
                    await fetch(
                        `${
                        config.nextjs.apiUrl
                        }/images/upload-video/landing-page/tutor-video-${payload.tenantId}`, {
                            method: 'POST',
                            headers: {
                                'authorization': rootState.profileModel.token,
                            },
                            body: tutorFormData,
                        }
                    );
                }
                if (rootState.landingPageModel.tutorVideoWebmFileList.length !== 0) {
                    let tutorFormData = new FormData();
                    rootState.landingPageModel.tutorVideoWebmFileList.forEach((file) => {
                        tutorFormData.set('video', file);
                    });
                    await fetch(
                        `${
                        config.nextjs.apiUrl
                        }/images/upload-video/landing-page/tutor-video-${payload.tenantId}`, {
                            method: 'POST',
                            headers: {
                                'authorization': rootState.profileModel.token,
                            },
                            body: tutorFormData,
                        }
                    );
                }
                const LandingPageService = getLandingPageService();
                const newLandingPageData = await LandingPageService.update({
                    tenantId: payload.tenantId,
                    menuBar: rootState.landingPageModel.data.menuBar,
                    logo: rootState.landingPageModel.data.logo,
                    topBannerBackground: rootState.landingPageModel.data.topBannerBackground,
                    mainTitle: payload.mainTitle,
                    mainTitlePage2: payload.mainTitlePage2,
                    subTitlePage2: payload.subTitlePage2,
                    informationCourses: payload.informationCourses,
                    popularTutionCourses: rootState.landingPageModel.data.popularTutionCourses,
                    tutorTitle: payload.tutorTitle,
                    studentTitle: payload.studentTitle,
                    promoPhoto1: rootState.landingPageModel.data.promoPhoto1,
                    promoPhoto2: rootState.landingPageModel.data.promoPhoto2,
                    promoTitle1: payload.promoTitle1,
                    promoTitle2: payload.promoTitle2,
                    promoPhoto3: rootState.landingPageModel.data.promoPhoto3,
                    promoTitle3: payload.promoTitle3,
                    blogTitle: payload.blogTitle,
                    pages: rootState.landingPageModel.data.pages,
                    footerContent1: payload.footerContent1,
                    footerContent2: payload.footerContent2,
                    footerContent3: payload.footerContent3,
                    footerContent4: payload.footerContent4,
                    tutorVideoUrl: payload.tutorVideoUrl,
                    tutorVideoOggUrl: payload.tutorVideoOggUrl,
                    tutorVideoWebmUrl: payload.tutorVideoWebmUrl,
                    studentVideoUrl: payload.studentVideoUrl,
                    studentVideoOggUrl: payload.studentVideoOggUrl,
                    studentVideoWebmUrl: payload.studentVideoWebmUrl,
                } as any);
                this.updateLandingPageDataSuccess({ data: newLandingPageData });
                message.success('Update landing page successfully!', 3);
            } catch (error) {
                message.error(error.message, 4);
            }
        }
    }
});

export default landingPageModel;