import * as mongoose from 'mongoose';
import { IGroupTuition } from './interface';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import addTenantSchema from '../../../core/helpers/add-tenant-schema';

const GroupTuitionSchema = new mongoose.Schema(addAuditSchema(addActiveSchema(addTenantSchema({
  courseForTutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseForTutor",
  },
  course: {
    country: {
      type : String,
      es_type: "text",
      es_fielddata: true,
      es_analyzer: "my_analyzer",
    },
    subject: {
      type: String,
      es_type: "text",
      es_fielddata: true,
      es_analyzer: "my_analyzer"
    },
    level: {
      type: String,
      es_type: "text",
      es_fielddata: true,
      es_analyzer: "my_analyzer"
    },
    grade: {
      type: String,
      es_type: "text",
      es_fielddata: true,
      es_analyzer: "my_analyzer"
    },
    session: {
      type: Number, 
      es_type: "integer"
    },
    hourlyRate: {
      type: Number,
      es_type: "integer" 
    },
    hourPerSession: {
      type: Number,
      es_type: "integer" 
    },
    minClassSize: {
      type: Number,
      es_type: "integer" 
    },
    maxClassSize: {
      type: Number,
      es_type: "integer" 
    },
    startReg: {
      type: Date,
      es_type: "keyword"
    },
    endReg: {
      type: Date,
      es_type: "keyword"
    },
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    es_type: 'nested'
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    es_type: 'nested'
  }],
  sessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    es_type: 'nested'
  }],
  isCompleted: {
    type: Boolean,
    default: false,
  },
  isCanceled: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  cancelReason: {
    type: String,
    default: ''
  },
  cancelBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    es_type: 'nested' 
  },
  cancelAt : Date,
  period: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule'
  }],
  slotsHolded : [{
    student: String,
    startTime: Number
  }],
  referenceId: {
    type: String,
    default: ''
  },
}))), {timestamps: true});
const GroupTuitionModel = mongoose.model<IGroupTuition>('GroupTuition', GroupTuitionSchema);

export {
  GroupTuitionSchema,
};
export default GroupTuitionModel;