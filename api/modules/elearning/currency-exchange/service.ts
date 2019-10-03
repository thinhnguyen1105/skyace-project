import * as Joi from 'joi';
import * as currencyRepository from './repository';
import { IGetAllCurrencies, ICreateNewCurrency, IGetCurrencyDetail, IUpdateCurrency } from './interface';
import rawData from '../../../config/rawdata';

const getAllCurrencies = async (): Promise<IGetAllCurrencies> => {
  return await currencyRepository.getAllCurrencies();
};

const createCurrency = async (body: ICreateNewCurrency): Promise<IGetCurrencyDetail> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    code: Joi.string().required(),
    exchangeRate: Joi.number().required(),
    name: Joi.string().required()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }
  //Check exist
  const existedCurrency = await currencyRepository.getCurrencyByCode(body.code);
  if (existedCurrency) {
    throw new Error('Currency is already exist.');
  }
  // Save to db
  return await currencyRepository.createNewCurrency(body);
};

const updateCurrency = async (body: IUpdateCurrency): Promise<IGetCurrencyDetail> => {
  // Validate Body
  if (!body._id) {
    throw new Error('Currency ID is empty.');
  }

  return await currencyRepository.updateCurrency(body);
};

const deleteCurrency = async (_id: string): Promise<void> => {
  // Check Currency ID
  if (!_id) {
    throw new Error('Currency ID is empty.');
  }

  await currencyRepository.deleteCurrency(_id);
};

const generateDefaultCurrencies = async (): Promise<IGetCurrencyDetail[]> => {
  const promises = rawData.SAMPLE_CURRENCIES.map((val) => {
    return currencyRepository.updateOrCreate(val);
  });
  return await Promise.all(promises);
};

export default {
  getAllCurrencies,
  createCurrency,
  updateCurrency,
  deleteCurrency,
  generateDefaultCurrencies
};