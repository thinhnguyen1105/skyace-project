import * as express from 'express';
import landingPageService from './service';
import logger from '../../../core/logger/log4js';
import { addModificationAuditInfo } from '../../../core/helpers';

const landingPageRouter = express.Router();

landingPageRouter.get('/get/', async(req: any, res) => {
    try {
        const result = await landingPageService.getLandingPageInfo(req.tenant._id);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send(error.message || 'Internal server error.');
    }
});

landingPageRouter.post('/createLandingPageForNewTenant', async(req, res) => {
    try {
        const result = await landingPageService.createLandingPageForNewTenant(req.body.tenantId, req.body.tenantName);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send(error.message || 'Internal server error.');
    }
});

landingPageRouter.put('/update', async(req, res) => {
    try {
        const result = await landingPageService.updateLandingPage(addModificationAuditInfo(req, req.body));
        res.status(200).send(result);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send(error.message || 'Internal server error.');
    }
});

landingPageRouter.post('/update-many', async(_req, res) => {
    try {
        const result = await landingPageService.updateMany();
        res.status(200).send(result);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send(error.message || 'Internal server error.');
    }
});

export default landingPageRouter;