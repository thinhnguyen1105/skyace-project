import * as express from 'express';
import ratingService from './service';
import logger from '../../../core/logger/log4js';
// import { validatePagination, addModificationAuditInfo, addCreationAuditInfo } from '../../../core/helpers';

const ratingRouter = express.Router();

ratingRouter.get('/find-by-id', async (req: any, res) => {
  try {
    const result = await ratingService.findById(req.tenant._id, req.query);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

ratingRouter.get('/find-by-user-id', async (req: any, res) => {
  try {
    const result = await ratingService.findByUserId(req.tenant._id, req.query);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

ratingRouter.post('/create', async (req: any, res) => {
  try {
    const result = await ratingService.create(req.tenant._id, req.body);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

ratingRouter.put('/update', async (req: any, res) => {
  try {
    const result = await ratingService.update(req.tenant._id, req.body);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

// ratingRouter.post('/migrate-ratings', async (_req, res) => {
//   try {
//     await ratingService.migrateRatings();
//     res.status(200).end();
//   } catch (error) {
//     logger.error(`${error.message} ${error.stack}`);
//     res.status(error.status || 500).send(error.message || "Internal server error.");
//   }
// });

export default ratingRouter;