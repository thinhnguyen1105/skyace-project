import NotificationSettingsModel from './mongoose';
import { IFindNotificationSettingDetail, ICreateNotificationSettingInput, IEditNotificationSettingInput } from './interface';
import logger from '../../../core/logger/log4js';

const findSettingByTenantId = async (tenantId: string): Promise<IFindNotificationSettingDetail> => {
  try {
    return await NotificationSettingsModel.findOne({tenant: tenantId}).exec() as any;
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal server error.');
  }
};

const createNotificationSetting = async (body: ICreateNotificationSettingInput): Promise<IFindNotificationSettingDetail> => {
  try {
    const newSetting = new  NotificationSettingsModel({
      ...body,
      accountRegistration: {
        email: true,
        sms: true,
      },
      cancelTuition: {
        email: true,
        sms: true,
      },
      newBooking: {
        email: true,
        sms: true,
      },
      reschedule: {
        email: true,
        sms: true,
      },
    });

    return await newSetting.save();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal server error.');
  }
};

const editNotificationSetting = async (body: IEditNotificationSettingInput): Promise<void> => {
  try {
    await NotificationSettingsModel.updateOne({_id: body._id}, body).exec();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal server error.');
  }
};

export {
  findSettingByTenantId,
  createNotificationSetting,
  editNotificationSetting,
};
