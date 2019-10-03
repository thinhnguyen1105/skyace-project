import * as mongoose from 'mongoose';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import { ICourse } from './interface';

const CourseSchema = new mongoose.Schema(addAuditSchema(addActiveSchema({
  country: {
    type : String,
    es_type: "text",
    es_fielddata: true,
    es_analyzer: "my_analyzer",
  },
  tenant_id: {
    type: String,
    es_type: "keyword"    
  },
  level: {
    // type: String,
    type: mongoose.Schema.Types.Mixed,
    ref: "Level",
  },
  grade: {
    // type: String,
    type: mongoose.Schema.Types.Mixed,
    ref: 'Grade',
  },
  subject: {
    // type: String,
    type: mongoose.Schema.Types.Mixed,
    ref: "Subject"
  },
  session: {
    type: Number,
    es_type: "integer"
  },
  hourPerSession: {
    type: Number,
    es_type: "integer"
  },
  isDeleted: {
    type: Boolean,
    es_type: "boolean"
  },
  academicStart: String,
  academicEnd: String,
  isConverted: Boolean
})));
CourseSchema.index({ subject: 'text' });
const CourseModel = mongoose.model<ICourse>('Course', CourseSchema);

export {
  CourseSchema,
};
export default CourseModel