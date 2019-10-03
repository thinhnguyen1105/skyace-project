import * as Joi from 'joi';
import * as conversationsRepository from './repository';
import { IFindConversationByUserIdQuery, IFindConversationsResult, IFindConversationDetail, ICreateConversationInput, IUpdateConversationInput, ICreateOrUpdateGroupConversationInput } from './interface';

const findConversationByUserId = async (tenantId: string, query: IFindConversationByUserIdQuery): Promise<IFindConversationsResult> => {
  if (!query.userId) {
    throw new Error('Bad request');
  }
  return await conversationsRepository.findConversationByUserId(tenantId, query);
};

const findByIds = async (tenantId: string, _id : string[]) : Promise<IFindConversationDetail[]> => {
  if (!_id) {
    throw new Error('Bad request');
  }
  return await conversationsRepository.findByIds(tenantId, _id);
}

const createConversation = async (tenantId: string, body: ICreateConversationInput): Promise<IFindConversationDetail> => {
  // validate body
  const validationRule = Joi.object().keys({
    participants: Joi.array().required(),
    tuition: Joi.string().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  return await conversationsRepository.createConversation(tenantId, body);
};

const updateConversation = async (tenantId: string, body: IUpdateConversationInput): Promise<void> => {
  // validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  return await conversationsRepository.updateConversation(tenantId, body);
};

const createOrUpdateGroupConversation = async (tenantId: string, body: ICreateOrUpdateGroupConversationInput): Promise<IFindConversationDetail> => {
  // validate body
  const validationRule = Joi.object().keys({
    groupTuition: Joi.string().required()
  });

  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true
  });
  
  if (error) {
    throw new Error(error.details[0].message);
  }

  return await conversationsRepository.createOrUpdateGroupConversation(tenantId, body);
}

const disableConversations = async (tuitionList: string[]): Promise<{disabledConversations: string[]}> => {
  if (!tuitionList) {
    throw new Error('Bad request');
  }

  return await conversationsRepository.disableConversations(tuitionList);
};

export default {
  findConversationByUserId,
  createConversation,
  updateConversation,
  createOrUpdateGroupConversation,
  disableConversations,
  findByIds
};