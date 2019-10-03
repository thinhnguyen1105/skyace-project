import * as express from 'express';
import currencyService from './service';
import logger from '../../../core/logger/log4js';

const currencyRouter = express.Router();

currencyRouter.get('/all', async (_req, res) => {
  try {
    const result = await currencyService.getAllCurrencies();
    res.status(200).send(result);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

currencyRouter.post('/create', async (req: any, res) => {
  try {
    const newCurrency = await currencyService.createCurrency(req.body);
    res.status(200).send(newCurrency);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

currencyRouter.put('/update', async (req: any, res) => {
  try {
    const result = await currencyService.updateCurrency(req.body);
    res.status(200).send(result);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

currencyRouter.delete('/delete', async (req: any, res) => {
  try {
    await currencyService.deleteCurrency(req.body._id);
    res.status(200).end();
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

currencyRouter.post('/generate-default-currencies', async (_req, res) => {
  try {
    await currencyService.generateDefaultCurrencies();
    res.status(200).end();
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

export default currencyRouter;