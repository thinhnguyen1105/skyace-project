import * as express from 'express';
import inputLookupService from './service';
import logger from '../../../core/logger/log4js';

const inputLookupRouter = express.Router();

inputLookupRouter.get('/find', async (req: any, res) => {
  try {
    const result = await inputLookupService.find(req.tenant._id);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || 'Internal server error.');
  }
});

export default inputLookupRouter;