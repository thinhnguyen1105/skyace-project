import * as express from 'express';
import gradeService from './service';
import logger from '../../../core/logger/log4js';

const gradeRouter = express.Router();

gradeRouter.get('/all', async (_req: any, res) => {
  try {
    const result = await gradeService.findAll(_req.tenant._id);
    res.status(200).send(result);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

gradeRouter.get('/all-include-inactive', async (_req: any, res) => {
  try {
    const result = await gradeService.findEverything(_req.tenant._id);
    res.status(200).send(result);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

gradeRouter.post('/create', async (req: any, res) => {
  try {
    const newGrade = await gradeService.create(req.tenant._id, req.body);
    res.status(200).send(newGrade);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

gradeRouter.put('/update', async (req: any, res) => {
  try {
    const result = await gradeService.update(req.tenant._id, req.body);
    res.status(200).send(result);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

export default gradeRouter;