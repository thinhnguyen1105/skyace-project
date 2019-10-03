import * as mongoose from 'mongoose';
import { ITuition } from './interface';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import addTenantSchema from '../../../core/helpers/add-tenant-schema';

const TuitionSchema = new mongoose.Schema(addAuditSchema(addActiveSchema(addTenantSchema({
  courseForTutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseForTutor",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  sessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session"
  }],
  isCompleted: {
    type: Boolean,
    default: false
  },
  isCanceled: {
    type: Boolean,
    default: false
  },
  isPendingReview: {
    type: Boolean,
    default: false,
  },
  cancelReason: {
    type: String,
    default: ''
  },
  cancelBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelAt : Date,
  referenceId: String,
  option: String,
}))));
const TuitionsModel = mongoose.model<ITuition>('Tuition', TuitionSchema);

export {
  TuitionSchema
};
export default TuitionsModel;