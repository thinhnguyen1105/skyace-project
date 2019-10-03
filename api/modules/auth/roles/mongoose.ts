import * as mongoose from 'mongoose';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import addTenantSchema from '../../../core/helpers/add-tenant-schema';
import { IRole } from './interface';

const RolesSchema = new mongoose.Schema(addAuditSchema(addActiveSchema(addTenantSchema({
  name: String,
  normalizedName: String,
  permissions: Array,
  isDefault: Boolean,
}))));
const RolesModel = mongoose.model<IRole>('Role', RolesSchema);

export default RolesModel;