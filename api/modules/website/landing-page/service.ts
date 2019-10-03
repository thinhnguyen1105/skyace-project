import { IUpdateLandingPageDetail, IGetLandingPageInfo } from "./interface";
import * as Joi from 'joi';
import * as landingPageRepository from './repository';

const updateLandingPage = async (body: IUpdateLandingPageDetail): Promise<IGetLandingPageInfo> => {
    const validationRule = Joi.object().keys({
        tenantId: Joi.string().required(),
        menuBar: Joi.object(),
        logo: Joi.string(),
        topBannerBackground: Joi.string(),
        mainTitle: Joi.string(),
        mainTitlePage2: Joi.string(),
        subTitlePage2: Joi.string(),
        informationCourses: Joi.string(),
        popularTutionCourses: Joi.array(),
        tutorTitle: Joi.string(),
        tutorVideoUrl: Joi.string(),
        studentTitle: Joi.string(),
        studentVideoUrl: Joi.string(),
        promoPhoto1: Joi.string(),
        promoPhoto2: Joi.string(),
        promoTitle1: Joi.string(),
        promoTitle2: Joi.string(),
        promoPhoto3: Joi.string(),
        promoTitle3: Joi.string(),
        blogTitle: Joi.string(),
        page3: Joi.array(),
        page4: Joi.array(),
        footerLinks: Joi.string(),
        footerContent: Joi.string(),
    });
    const { error } = Joi.validate(body, validationRule, {
        allowUnknown: true,
    });
    if (error) {
        throw new Error(error.details[0].message);
    }
    if (!body.tenantId) {
        throw new Error('ID not found!');
    }

    return await landingPageRepository.updateLandingPageInfo(body);
};

const createLandingPageForNewTenant = async (tenantId: string, _tenantName: string): Promise<void> => {
    if (!tenantId) {
        throw new Error('Bad request');
    }
    
    // Check if there is a record for this tenantId
    const exitedLandingPage = await landingPageRepository.getLandingPageInfo(tenantId);
    if (exitedLandingPage) {
        throw new Error('Landing page already exist');
    }

    // Get default landing page
    const defaultLandingPage = await landingPageRepository.getLandingPageInfo('default');

    // Create new landing page
    return await landingPageRepository.createLandingPageForNewTenant({
        tenantId,
        menuBar: defaultLandingPage.menuBar, // New hyperlink base on new tenant name
        logo: defaultLandingPage.logo,
        topBannerBackground: defaultLandingPage.topBannerBackground,
        mainTitle: defaultLandingPage.mainTitle,
        mainTitlePage2: defaultLandingPage.mainTitlePage2,
        subTitlePage2: defaultLandingPage.subTitlePage2,
        informationCourses: defaultLandingPage.informationCourses,
        popularTutionCourses: defaultLandingPage.popularTutionCourses,
        tutorTitle: defaultLandingPage.tutorTitle,
        tutorVideoUrl: defaultLandingPage.tutorVideoUrl,
        tutorVideoOggUrl: defaultLandingPage.tutorVideoOggUrl,
        tutorVideoWebmUrl: defaultLandingPage.tutorVideoWebmUrl,
        studentTitle: defaultLandingPage.studentTitle,
        studentVideoUrl: defaultLandingPage.studentVideoUrl,
        studentVideoOggUrl: defaultLandingPage.studentVideoOggUrl,
        studentVideoWebmUrl: defaultLandingPage.studentVideoWebmUrl,
        promoPhoto1: defaultLandingPage.promoPhoto1,
        promoPhoto2: defaultLandingPage.promoPhoto2,
        promoTitle1: defaultLandingPage.promoTitle1,
        promoTitle2: defaultLandingPage.promoTitle2,
        promoPhoto3: defaultLandingPage.promoPhoto3,
        promoTitle3: defaultLandingPage.promoTitle3,
        blogTitle: defaultLandingPage.blogTitle,
        pages: defaultLandingPage.pages,
        footerContent1: defaultLandingPage.footerContent1,
        footerContent2: defaultLandingPage.footerContent2,
        footerContent3: defaultLandingPage.footerContent3,
        footerContent4: defaultLandingPage.footerContent4,
        createdAt: new Date(),
        createdBy: '',
        lastModifiedAt: new Date(),
        lastModifiedBy: '',
    });
};

const getLandingPageInfo = async (tenantId: string): Promise<IGetLandingPageInfo> => {
    if (!tenantId) {
        throw new Error('TenantId is empty');
    }
    return await landingPageRepository.getLandingPageInfo(tenantId);
};

const updateMany = async (): Promise<void> => {
    await landingPageRepository.updateMany();
};

export default {
    getLandingPageInfo,
    updateLandingPage,
    createLandingPageForNewTenant,
    updateMany
};