import { Document } from 'mongoose';

export interface ILanguage extends Document {
  data: any;
  name: string;
  shortName: string;
}