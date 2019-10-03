import * as mongoose from 'mongoose';
import { ISubject } from './interface';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import addTenantSchema from '../../../core/helpers/add-tenant-schema';

const SubjectSchema = new mongoose.Schema(addAuditSchema(addActiveSchema(addTenantSchema({
  name: String,
  slug: String,
  description: String
}))));
const SubjectModel = mongoose.model<ISubject>('Subject', SubjectSchema);

export default SubjectModel;