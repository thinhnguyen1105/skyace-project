import { HasModificationAuditInfo } from "api/core/interfaces";

export interface ILandingPageState {
    data: ILandingPageData | {};
    isBusy: boolean;
    imageTemporary3: any[];
    imageTemporary4: any[];
    studentVideoFileList: any[];
    studentVideoOggFileList: any[];
    studentVideoWebmFileList: any[];
    tutorVideoFileList: any[];
    tutorVideoOggFileList: any[];
    tutorVideoWebmFileList: any[];
    topBannerBackgroundTemporary: string;
    logoTemporary: string;
    promoPhoto1Temporary: string;
    promoPhoto2Temporary: string;
    promoPhoto3Temporary: string;
    loginModalVisible: boolean;
    registerModalVisible: boolean;
    registerSuccessModalVisible: boolean;
    resetPasswordModalVisible: boolean;
    currentTenant: string;
}

export interface ILandingPageData {
    tenantId: string;
    menuBar: IMenuBarDetail;
    logo: string;
    topBannerBackground: string;
    mainTitle: string;
    mainTitlePage2: string;
    subTitlePage2: string;
    informationCourses: string;
    popularTutionCourses: IPopularTutionCourses[];
    pages: IPageDetail[];
    tutorTitle: string;
    tutorVideoUrl: string;
    tutorVideoOggUrl: string;
    tutorVideoWebmUrl: string;
    studentTitle: string;
    studentVideoUrl: string;
    studentVideoOggUrl: string;
    studentVideoWebmUrl: string;
    promoPhoto1: string;
    promoPhoto2: string;
    promoTitle1: string;
    promoTitle2: string;
    promoPhoto3: string;
    promoTitle3: string;
    blogTitle: string;
    footerContent1: string;
    footerContent2: string;
    footerContent3: string;
    footerContent4: string;
    lastModifiedAt: Date;
}

interface IPopularTutionCourses {
    course: string;
}

export interface IMenuBarDetail {
    name: string;
    hyperlink: string;
}

interface IPageDetail {
    mainTitle: string;
    icons: string[];
    contents: string[];
    pageValue: number;
}

export interface IGetLandingPageDataSuccess {
    data: ILandingPageData;
}

export interface IGetLandingPagePayload {
    tenantId: string;
}

export interface IUpdateLandingPagePayload extends HasModificationAuditInfo {
    tenantId: string;
    menuBar?: IMenuBarDetail;
    logo?: string;
    topBannerBackground?: string;
    mainTitle?: string;
    mainTitlePage2?: string;
    subTitlePage2?: string;
    informationCourses?: string;
    popularTutionCourses?: IPopularTutionCourses[];
    pages?: IPageDetail[];
    tutorTitle?: string;
    tutorVideoUrl?: string;
    tutorVideoOggUrl?: string;
    tutorVideoWebmUrl?: string;
    studentTitle?: string;
    studentVideoUrl?: string;
    studentVideoOggUrl?: string;
    studentVideoWebmUrl?: string;
    promoPhoto1?: string;
    promoPhoto2?: string;
    promoTitle1?: string;
    promoTitle2?: string;
    promoPhoto3?: string;
    promoTitle3?: string;
    blogTitle?: string;
    footerContent1?: string;
    footerContent2?: string;
    footerContent3?: string;
    footerContent4?: string;
}

export interface IHandleImagePageChange {
    pageValue?: string;
    pageIndex?: number;
    html: string;
}

export interface IHandleEditorChange {
    html: string;
    keyValue: string;
}

export interface IImage {
    pageValue?: string;
    pageIndex?: number;
    imageUrl: string;
}

  export interface IFileListPayload {
    file: any;
  }

  export interface IHandleMenuBar {
      value: number;
      name: string;
      hyperlink: string;
  }

  export interface IOnTenantChange {
      tenantId: string;
  }

  export interface IHandlePopularTutionCourseChange{
      value: string,
      index: number;
  }

  export interface IHandleDeletePopularTutionCourses {
      index: number;
  }

  export interface IUpdateLandingPageState {
    mainTitle: string;
    mainTitlePage2: string;
    subTitlePage2: string;
    informationCourses: string;
    tutorTitle: string;
    studentTitle: string;
    promoTitle1: string;
    promoTitle2: string;
    promoTitle3: string;
    blogTitle: string;
    mainTitlePage3:string;
    mainTitlePage4: string;
    footerContent1: string;
    footerContent2: string;
    footerContent3: string;
    footerContent4: string;
  }

  export interface IOnChangeStudentVideoFileList {
      file: any;
  }

  export interface IOnChangeTutorVideoFileList {
      file: any;
  }