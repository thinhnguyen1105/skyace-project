import * as mongoose from 'mongoose';
import { IGrade } from './interface';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import addTenantSchema from '../../../core/helpers/add-tenant-schema';

const GradeSchema = new mongoose.Schema(addAuditSchema(addActiveSchema(addTenantSchema({
  name: String,
  slug: String,
  description: String,
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Level',
  }
}))));
const GradeModel = mongoose.model<IGrade>('Grade', GradeSchema);

export default GradeModel;