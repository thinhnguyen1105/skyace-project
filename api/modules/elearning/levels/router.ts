import * as express from 'express';
import levelService from './service';
import logger from '../../../core/logger/log4js';

const levelRouter = express.Router();

levelRouter.get('/all', async (_req: any, res) => {
  try {
    const result = await levelService.findAll(_req.tenant._id);
    res.status(200).send(result);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

levelRouter.get('/all-include-inactive', async (_req: any, res) => {
  try {
    const result = await levelService.findEverything(_req.tenant._id);
    res.status(200).send(result);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

levelRouter.post('/create', async (req: any, res) => {
  try {
    const newLevel = await levelService.create(req.tenant._id, req.body);
    res.status(200).send(newLevel);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

levelRouter.put('/update', async (req: any, res) => {
  try {
    const result = await levelService.update(req.tenant._id, req.body);
    res.status(200).send(result);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

levelRouter.put('/toggle', async (req: any, res) => {
  try {
    const result = await levelService.toggle(req.tenant._id, req.body);
    res.status(200).send(result);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

export default levelRouter;