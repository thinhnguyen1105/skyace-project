import * as express from 'express';
import subjectService from './service';
import logger from '../../../core/logger/log4js';

const subjectRouter = express.Router();

subjectRouter.get('/all', async (_req: any, res) => {
  try {
    const result = await subjectService.findAll(_req.tenant._id);
    res.status(200).send(result);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

subjectRouter.get('/all-include-inactive', async (_req: any, res) => {
  try {
    const result = await subjectService.findEverything(_req.tenant._id);
    res.status(200).send(result);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

subjectRouter.post('/create', async (req: any, res) => {
  try {
    const newSubject = await subjectService.create(req.tenant._id, req.body);
    res.status(200).send(newSubject);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

subjectRouter.put('/update', async (req: any, res) => {
  try {
    const result = await subjectService.update(req.tenant._id, req.body);
    res.status(200).send(result);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

export default subjectRouter;