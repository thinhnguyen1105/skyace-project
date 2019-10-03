import * as mongoose from 'mongoose';
import { addAuditSchema, addActiveSchema, addTenantSchema } from '../../../core/helpers';
import { IPromoCode } from './interface';

const PromoCodeSchema = new mongoose.Schema(addAuditSchema(addActiveSchema(addTenantSchema({
  name: {
    type : String,
    required: true,
    unique: true
  },
  value : Number,
  type : String,
  quantity: Number,
  startDate: Date,
  endDate: Date,
  isInfinite: Boolean,
  description: String
}))), {timestamps: true});

const PromoCodeModel = mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema);
export default PromoCodeModel;
