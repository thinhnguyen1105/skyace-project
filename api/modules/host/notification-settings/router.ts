import * as express from 'express';
import notificationSettingsService from './service';
import logger from '../../../core/logger/log4js';

const notificationSettingsRouter = express.Router();

notificationSettingsRouter.get('/findSettingByTenantId/:tenantId', async (req: any, res) => {
  try {
    const result = await notificationSettingsService.findSettingByTenantId(req.params.tenantId);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

notificationSettingsRouter.post('/createNotificationSetting', async (req: any, res) => {
  try {
    const result = await notificationSettingsService.createNotificationSetting(req.body);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

notificationSettingsRouter.put('/editNotificationSetting', async (req: any, res) => {
  try {
    const result = await notificationSettingsService.editNotificationSetting(req.body);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

export default notificationSettingsRouter;


