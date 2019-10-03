import * as mongoose from 'mongoose';
import { addAuditSchema, addActiveSchema, addTenantSchema } from '../../../core/helpers';
import { ITransaction } from './interface';

const TransactionSchema = new mongoose.Schema(addAuditSchema(addActiveSchema(addTenantSchema({
  address: {
    city: String,
    country_code: String,
    line1: String,
    postal_code: String,
    recipient_name: String,
    state: String,
  },
  cancelled: Boolean,
  email: String,
  paid: Boolean,
  payerID: String,
  paymentId: String,
  paymentToken: String,
  paymentDetail: Object,
  tuition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tuition",
  },
  groupTuition: {
    type : mongoose.Schema.Types.ObjectId,
    ref: "GroupTuition"
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  returnUrl: String,
  promoCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PromoCode"
  },
  isDiscount100: Boolean,
  startAmount: Number,
  totalAmount: Number,
  option: String,
  studentRemark: String,
  tutorRemark: String,
  isTuitionCanceled: Boolean,
  invoice: String,
}))), {timestamps: true});

const TransactionModel = mongoose.model<ITransaction>('Transaction', TransactionSchema);
export default TransactionModel;
