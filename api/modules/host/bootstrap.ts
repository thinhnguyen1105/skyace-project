import { Router } from 'express';
import inputLookupRouter from './input-lookup/router';
import notificationSettingsRouter from './notification-settings/router';

const bootstrap = (router: Router) => {
  router.use('/dataLookup', inputLookupRouter);
  router.use('/notificationSettings', notificationSettingsRouter);
};

export default bootstrap;