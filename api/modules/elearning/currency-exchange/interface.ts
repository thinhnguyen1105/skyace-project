import { Document } from 'mongoose';

export interface ICurrency extends Document {
  code: string;
  exchangeRate: number;
  name: string;
}

export interface IGetCurrencyDetail {
  _id: string;
  code: string;
  exchangeRate: number;
  name: string;
}

export interface IGetAllCurrencies {
  results: IGetCurrencyDetail[];
}

export interface ICreateNewCurrency {
  code: string;
  exchangeRate: number;
  name: string;
}

export interface IUpdateCurrency {
  _id: string;
  code?: string;
  exchangeRate?: number;
  name?: string;
}