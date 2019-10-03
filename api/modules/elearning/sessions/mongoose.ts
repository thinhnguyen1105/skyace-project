import * as mongoose from 'mongoose';
import { ISession } from './interface';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import addTenantSchema from '../../../core/helpers/add-tenant-schema';

const SessionSchema = new mongoose.Schema(addAuditSchema(addActiveSchema(addTenantSchema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  courseForTutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseForTutor",
  },
  tuition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tuition",
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  groupTuition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GroupTuition",
  },
  start: Date,
  end: Date,
  isCompleted: Boolean,
  isRescheduled: {
    type: Boolean,
    default: false
  },
  materials: [{
    uploadBy: String,
    fileName: String,
    downloadUrl: String,
    uploadDate: Date,
  }],
  reportSession: [
    {
      reportStudent: Boolean,
      reportTutor: Boolean,
      reasonReport: Array,
      commentReport: String,
      uploadBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      uploadDate: Date,
    }
  ],
  rateSession: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rating"
  }],
  isPaid: Boolean,
  isPaymentNotified: Boolean,
}))));
const SessionsModel = mongoose.model<ISession>('Session', SessionSchema);

export default SessionsModel;