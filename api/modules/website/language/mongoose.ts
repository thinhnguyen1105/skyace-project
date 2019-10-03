import * as mongoose from 'mongoose';
import { ILanguage } from './interface';

const LanguageSchema = new mongoose.Schema({
    data: Object,
    name: String,
    shortName: String,
}, {timestamps: true});

const LanguageModel = mongoose.model<ILanguage>('Language', LanguageSchema);

export default LanguageModel;