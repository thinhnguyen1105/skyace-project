import * as mongoose from 'mongoose';
import { IRating } from './interface';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import addTenantSchema from '../../../core/helpers/add-tenant-schema';

const RatingSchema = new mongoose.Schema(addAuditSchema(addActiveSchema(addTenantSchema({
  rateSession: Number,
  commentSession: String,
  uploadDate: Date,
  uploadBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}))), {timestamps: true});
const RatingModel = mongoose.model<IRating>('Rating', RatingSchema);

export default RatingModel;