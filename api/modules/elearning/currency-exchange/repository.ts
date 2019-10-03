import CurrencyModel from './mongoose';
import { IGetAllCurrencies, ICreateNewCurrency, IGetCurrencyDetail, IUpdateCurrency } from './interface';

const getAllCurrencies = async (): Promise<IGetAllCurrencies> => {
  try {
    const currencies = await CurrencyModel.find({}).sort({name : 1}).exec();
    return {results : currencies};
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const getCurrencyByCode = async (code: string): Promise<IGetCurrencyDetail> => {
  try {
    return await CurrencyModel.findOne({code : code}).exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const createNewCurrency = async (body: ICreateNewCurrency): Promise<IGetCurrencyDetail> => {
  try {
    const newCurrency = new CurrencyModel(body);
    return await newCurrency.save();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateCurrency = async (body: IUpdateCurrency): Promise<IGetCurrencyDetail> => {
  try {
    return await CurrencyModel.findOneAndUpdate({_id: body._id}, {$set: body}, {new : true, upsert: true}).exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const deleteCurrency = async (_id: string): Promise<void> => {
  try {
    await CurrencyModel.deleteOne({_id: _id}).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateOrCreate = async (body: ICreateNewCurrency): Promise<IGetCurrencyDetail> => {
  try {
    return await CurrencyModel.findOneAndUpdate({code: body.code}, {$set: body}, {new: true, upsert: true}).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

export {
  getAllCurrencies,
  createNewCurrency,
  updateCurrency,
  deleteCurrency,
  updateOrCreate,
  getCurrencyByCode
};