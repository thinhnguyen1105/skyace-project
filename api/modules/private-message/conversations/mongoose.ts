import * as mongoose from 'mongoose';
import { IConversation } from './interface';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import addTenantSchema from '../../../core/helpers/add-tenant-schema';

const ConversationSchema = new mongoose.Schema(addAuditSchema(addActiveSchema(addTenantSchema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  tuition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tuition"
  },
  groupTuition : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GroupTuition"
  },
  isDisabled: Boolean,
}))), {timestamps: true});
const ConversationsModel = mongoose.model<IConversation>('Conversation', ConversationSchema);

export {
  ConversationSchema,
};
export default ConversationsModel;