import { HasCreationAuditInfo, HasModificationAuditInfo } from "../../../core/interfaces";
import { Document } from 'mongoose';
export interface ILandingPage extends Document, HasCreationAuditInfo, HasModificationAuditInfo {
    tenantId: string;
    menuBar: IMenuBarDetails;
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
  }

  interface IPopularTutionCourses {
    course: string;
  }


  interface IMenuBarDetails {
    name: string;
    hyperlink: string;
  }

  interface IPageDetail {
    mainTitle: string;
    icons: string[];
    contents: string[];
    pageValue: number;
  }

  export interface IGetLandingPageInfo {
    _id: string;
    tenantId: string;
    menuBar: IMenuBarDetails;
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

  export interface IUpdateLandingPageDetail extends HasModificationAuditInfo {
    tenantId: string;                 
    menuBar?: IMenuBarDetails;
    logo?: string;
    topBannerBackground?: string;
    mainTitle?: string;
    mainTitlePage2?: string;
    subTitlePage2?: string;
    informationCourses?: string;
    popularTutionCourses?: IPopularTutionCourses[];
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
    pages?: string;
    footerContent1?: string;
    footerContent2?: string;
    footerContent3?: string;
    footerContent4?: string;
  }

  export interface ICreateLandingPageForNewTenant extends HasCreationAuditInfo, HasModificationAuditInfo {
    tenantId: string;
    menuBar: IMenuBarDetails;
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
  }