import { Document } from 'mongoose';
import { IsAuditable, HasActive, PageableQuery, SortableQuery, PageableResult, HasCreationAuditInfo } from '../../../core/interfaces';

export interface IConversation extends Document, IsAuditable, HasActive {
  participants: string[];
  tenant: string;
  isDisabled: boolean;
  tuition: string;
  groupTuition: string;
}

export interface IFindConversationByUserIdQuery extends PageableQuery, SortableQuery {
  userId: string;
  unreadConversations: string[];
}

export interface IFindConversationDetail {
  _id: string;
  participants: string[];
  tenant: string;
  isDisabled: boolean;
  tuition?: string;
  groupTuition?: string;
}

export interface IFindConversationsResult extends PageableResult<IFindConversationDetail> {}

export interface ICreateConversationInput extends HasCreationAuditInfo {
  participants: string[];
  tuition?: string;
  groupTuition?: string;
}

export interface IUpdateConversationInput {
  _id: string;
  participants?: string[];
  tenant?: string;
  tuition?: string;
  groupTuition?: string;
}

export interface ICreateOrUpdateGroupConversationInput {
  groupTuition: string;
}

export interface IFindGroupConversationDetail {
  data : IFindConversationDetail,
  isExist : boolean;
}