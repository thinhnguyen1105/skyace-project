import * as express from 'express';
import languageService from './service';
import logger from '../../../core/logger/log4js';
import { languageMiddleware } from './middleware';

const languageRouter = express.Router();

languageRouter.get('/get-all/', async(_req: any, res) => {
    try {
        const result = await languageService.getAll();
        res.status(200).send(result);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send(error.message || 'Internal server error.');
    }
});

languageRouter.get('/find-by-id', async(req: any, res) => {
  try {
    const result = await languageService.getById(req.query._id);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || 'Internal server error.');
  }
})

languageRouter.get('/find-by-short-name', async (req: any, res) => {
  try {
    const result = await languageService.findByShortName(req.query.shortName);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || 'Internal server error.');
  }
})

languageRouter.post('/create', async(req, res) => {
    try {
        const result = await languageService.create(req.body);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send(error.message || 'Internal server error.');
    }
});

languageRouter.put('/update-by-country', async(req, res) => {
    try {
        const result = await languageService.updateByCountry(req.body);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send(error.message || 'Internal server error.');
    }
});

languageRouter.post('/upload-file', languageMiddleware.single('lang'), async (req: any, res) => {
  try {
    if (req.file) {
      if (req.file.filename) {
        res.status(200).send(`${req.file.filename}`);
      }
    } else {
      res.status(200).end();
    }
  } catch (error) {
    res.status(error.status || 500).send(error.message || 'Internal Server Error');
  }
});

export default languageRouter;