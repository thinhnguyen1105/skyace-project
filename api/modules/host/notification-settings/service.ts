import * as Joi from 'joi';
import * as notificationSettingsRepository from './repository';
import { IFindNotificationSettingDetail, ICreateNotificationSettingInput, IEditNotificationSettingInput } from './interface';
import logger from '../../../core/logger/log4js';

const findSettingByTenantId = async (tenantId: string): Promise<IFindNotificationSettingDetail> => {
  if (!tenantId) {
    throw new Error('Bad request');
  }

  return await notificationSettingsRepository.findSettingByTenantId(tenantId);
};

const createNotificationSetting = async (body: ICreateNotificationSettingInput): Promise<IFindNotificationSettingDetail> => {
  // validate body
  const validationRule = Joi.object().keys({
    tenant: Joi.string().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Bad request');
  }

  // check if this tenant already have a setting record
  const existedSetting = await notificationSettingsRepository.findSettingByTenantId(body.tenant);
  if (existedSetting) {
    throw new Error('Bad request');
  }

  return await notificationSettingsRepository.createNotificationSetting(body);
};

const editNotificationSetting = async (body: IEditNotificationSettingInput): Promise<void> => {
  // validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    tenant: Joi.string().required(),
    accountRegistration: Joi.object(),
    newBooking: Joi.object(),
    reschedule: Joi.object(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Bad request');
  }

  return await notificationSettingsRepository.editNotificationSetting(body);
};

export default {
  findSettingByTenantId,
  createNotificationSetting,
  editNotificationSetting,
};