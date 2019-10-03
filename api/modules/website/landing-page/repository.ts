import LandingPageModel from "./mongoose";
import { IGetLandingPageInfo, IUpdateLandingPageDetail, ICreateLandingPageForNewTenant } from "./interface";

const getLandingPageInfo = async (tenantId: string): Promise<IGetLandingPageInfo> => {
    try {
        const data = await LandingPageModel
            .findOne(
                {
                    tenantId: tenantId,
                }
            )
            .exec();
        return data!;
    } catch (error) {
      throw new Error(error.message || 'Internal server error.');
    }
};

const updateLandingPageInfo = async (body: IUpdateLandingPageDetail): Promise<IGetLandingPageInfo> => {
    try {
        return await LandingPageModel
        .findOneAndUpdate({ tenantId: body.tenantId }, { $set: body }, {new: true})
        .exec() as any;
    } catch (error) {
      throw new Error(error.message || 'Internal server error.');
    }
};

const createLandingPageForNewTenant = async (body: ICreateLandingPageForNewTenant): Promise<void> => {
    try {
        const newLandingPage = new LandingPageModel(body);
        await newLandingPage.save();
    } catch (error) {
      throw new Error(error.message || 'Internal server error.');
    }
};

const updateMany = async (): Promise<void> => {
    try {
        const defaultData = await LandingPageModel
        .findOne(
            {
                tenantId: 'default',
            }
        )
        .exec() as any;
        await LandingPageModel.updateMany({}, {$set: {
            popularTutionCourses: (defaultData as any).popularTutionCourses, 
            tutorTitle: (defaultData as any).tutorTitle,
            tutorVideoUrl: (defaultData as any).tutorVideoUrl,
            tutorVideoOggUrl: (defaultData as any).tutorVideoOggUrl,
            tutorVideoWebmUrl: (defaultData as any).tutorVideoWebmUrl,
            studentTitle: (defaultData as any).studentTitle,
            studentVideoUrl: (defaultData as any).studentVideoUrl,
            studentVideoOggUrl: (defaultData as any).studentVideoOggUrl,
            studentVideoWebmUrl: (defaultData as any).studentVideoWebmUrl,
            promoPhoto1: (defaultData as any).promoPhoto1,
            promoPhoto2: (defaultData as any).promoPhoto2,
            promoPhoto3: (defaultData as any).promoPhoto3,
            promoTitle1: (defaultData as any).promoTitle1,
            promoTitle2: (defaultData as any).promoTitle2,
            promoTitle3: (defaultData as any).promoTitle3,
            blogTitle: (defaultData as any).blogTitle,
            footerContent1: defaultData.footerContent1,
            footerContent2: defaultData.footerContent2,
            footerContent3: defaultData.footerContent3,
        }})
        .exec();
    } catch (error) {
      throw new Error(error.message || 'Internal server error.');
    }
};

export {
    getLandingPageInfo,
    updateLandingPageInfo,
    createLandingPageForNewTenant,
    updateMany
};