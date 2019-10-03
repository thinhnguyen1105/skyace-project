import * as mongoose from 'mongoose';
import { ILevel } from './interface';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import addTenantSchema from '../../../core/helpers/add-tenant-schema';

const LevelSchema = new mongoose.Schema(addAuditSchema(addActiveSchema(addTenantSchema({
  name: String,
  slug: String,
  description: String,
}))));
const LevelModel = mongoose.model<ILevel>('Level', LevelSchema);

export default LevelModel;