import * as mongoose from 'mongoose';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import { ICourseForTutor } from './interface';
import CourseObject from '../courses/mongoose';
const CourseSchema = CourseObject.schema;

const CourseForTutorSchema = new mongoose.Schema(addAuditSchema(addActiveSchema({
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      es_schema: CourseSchema,
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      es_type: "nested"
    },
    tuitions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tuition",
      es_type: "nested",
      es_include_in_parent: true
    }],
    groupTuition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupTuition",
      es_type: "nested",
      es_include_in_parent: true
    },
    hourlyRate: Number,
    tenant_id: {
      type: String,
      es_type: "keyword"
    },
    isDeleted : {
      type: Boolean,
      default: false
    },
    isGroup: {
      type: Boolean
    }
})));
const CourseForTutorModel = mongoose.model<ICourseForTutor>('CourseForTutor', CourseForTutorSchema);

export default CourseForTutorModel;