import * as mongoose from 'mongoose';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import { ILandingPage } from './interface';

const LandingPageSchema = new mongoose.Schema(addAuditSchema(addActiveSchema({
    tenantId: String,
    menuBar: Object,
    logo: String,
    topBannerBackground: String,
    mainTitle: String,
    mainTitlePage2: String,
    subTitlePage2: String,
    informationCourses: String,
    popularTutionCourses: [{course: String}],
    pages: [{
        mainTitle: String,
        icons: [String],
        contents: [String],
        pageValue: Number,
    }],
    tutorTitle: String,
    tutorVideoUrl: String,
    tutorVideoOggUrl: String,
    tutorVideoWebmUrl: String,
    studentTitle: String,
    studentVideoUrl: String,
    studentVideoOggUrl: String,
    studentVideoWebmUrl: String,
    promoPhoto1: String,
    promoPhoto2: String,
    promoTitle1: String,
    promoTitle2: String,
    promoPhoto3: String,
    promoTitle3: String,
    blogTitle: String,
    footerContent1: String,
    footerContent2: String,
    footerContent3: String,
    footerContent4: String,
})));

const LandingPageModel = mongoose.model<ILandingPage>('LandingPage', LandingPageSchema);

export default LandingPageModel;