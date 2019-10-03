import * as mongoose from 'mongoose';
import { ICurrency } from './interface';

const CurrencySchema = new mongoose.Schema({
  code: String,
  exchangeRate: Number,
  name: String
});
const CurrencyModel = mongoose.model<ICurrency>('Currency', CurrencySchema);

export default CurrencyModel;