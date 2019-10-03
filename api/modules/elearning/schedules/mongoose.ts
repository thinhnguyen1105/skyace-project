import * as mongoose from 'mongoose';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import addTenantSchema from '../../../core/helpers/add-tenant-schema';
import { ISchedule } from './interface';

const SchedulesSchema = new mongoose.Schema(addAuditSchema(addActiveSchema(addTenantSchema({
  start: Date,
  end: Date,
  type: String,
  student: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isCompleted: Boolean,
  baseOn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule'
  },
  isGroup: Boolean,
  isPayment: Boolean,
}))));
const SchedulesModel = mongoose.model<ISchedule>('Schedule', SchedulesSchema);

export default SchedulesModel;