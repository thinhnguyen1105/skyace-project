import * as express from 'express';
import bootstrapAuth from './modules/auth/bootstrap';
import bootstrapHost from './modules/host/bootstrap';
import checkTenant from './core/auth/check-tenant.middleware';
import bootstrapWebsite from './modules/website/bootstrap';
import bootstrapElearning from './modules/elearning/bootstrap';
import bootstrapPayment from './modules/payment/bootstrap';
import bootstrapPM from './modules/private-message/bootstrap';

const apiRouter = express.Router();

// Router-Level Middleware
apiRouter.use(checkTenant());

// Bootstrap API
bootstrapAuth(apiRouter);
bootstrapElearning(apiRouter);
bootstrapHost(apiRouter);
bootstrapWebsite(apiRouter);
bootstrapPayment(apiRouter);
bootstrapPM(apiRouter);

export default apiRouter;
