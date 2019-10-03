import ConversationsModel from './mongoose';
import * as groupTuitionRepository from '../../elearning/group-tuitions/repository';
import { IFindConversationByUserIdQuery, IFindConversationsResult, IFindConversationDetail, ICreateConversationInput, IUpdateConversationInput, ICreateOrUpdateGroupConversationInput } from './interface';

const findConversationByUserId = async (tenantId: string, query: IFindConversationByUserIdQuery): Promise<IFindConversationsResult> => {
  try {
    const totalPromise = ConversationsModel.find({$and: [
      {tenant: tenantId},
      {isDisabled: false},
      {participants: query.userId}
    ]})
      .countDocuments()
      .exec();

    if (!query.unreadConversations) {
      const dataPromise = ConversationsModel.find({$and: [
        {tenant: tenantId},
        {isDisabled: false},
        {participants: query.userId},
      ]})
        .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(Number(query.pageSize))
        .populate('participants')
        .populate('tuition')
        .populate('groupTuition')
        .exec();

      const [total, data] = await Promise.all([totalPromise, dataPromise]);

      return {
        total,
        data,
      } as any;
    } else if (Array.isArray(query.unreadConversations) && query.unreadConversations.length >= 10) {
      const dataPromise = ConversationsModel.find({$and: [
        {tenant: tenantId},
        {isDisabled: false},
        {participants: query.userId},
        {_id: {$in: query.unreadConversations}},
      ]})
        .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
        .populate('participants')
        .populate('tuition')
        .populate('groupTuition')
        .exec();

      const [total, data] = await Promise.all([totalPromise, dataPromise]);

      return {
        total,
        data,
      } as any;
    } else if (typeof query.unreadConversations === 'string' || (Array.isArray(query.unreadConversations) && query.unreadConversations.length < 10)) {
      const unreadDataPromise = ConversationsModel.find({$and: [
        {tenant: tenantId},
        {isDisabled: false},
        {participants: query.userId},
        {_id: {$in: query.unreadConversations}},
      ]})
        .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
        .populate('participants')
        .populate('tuition')
        .populate('groupTuition')
        .exec();

      const dataPromise = ConversationsModel.find({$and: [
        {tenant: tenantId},
        {isDisabled: false},
        {participants: query.userId},
        {_id: {$not: {$in: query.unreadConversations}}},
      ]})
        .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(10 - Number(query.unreadConversations.length))
        .populate('participants')
        .populate('tuition')
        .populate('groupTuition')
        .exec();
      
      const [total, data, unreadData] = await Promise.all([totalPromise, dataPromise, unreadDataPromise]);

      return {
        total,
        data: [...unreadData, ...data],
      } as any;
    } else {
      throw new Error('Bad request');
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findByIds = async (tenantId: string , _id: string[]): Promise<IFindConversationDetail[]> => {
  try {
    return await ConversationsModel.find({tenant: tenantId, _id: {$in : _id}})
    .populate('participants')
    .populate('tuition')
    .populate('groupTuition').exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const createConversation = async (tenantId: string, body: ICreateConversationInput): Promise<IFindConversationDetail> => {
  try {
    const newConversation = new ConversationsModel({
      ...body,
      tenant: tenantId,
      isDisabled: false,
    });
    return await newConversation.save();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateConversation = async (_tenantId: string, body: IUpdateConversationInput): Promise<void> => {
  try {
    await ConversationsModel.findOneAndUpdate({_id: body._id}, {$set: body}).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const createOrUpdateGroupConversation = async (tenantId: string, body: ICreateOrUpdateGroupConversationInput): Promise<IFindConversationDetail> => {
  try {
    const existedGroupTuition = await groupTuitionRepository.findByTuitionId(tenantId, body.groupTuition);
    if (existedGroupTuition) {
      const criteria = {
        participants : [existedGroupTuition.tutor._id, ...existedGroupTuition.students.map(val => val._id)],
        tenant: tenantId,
        isDisabled: false,
        groupTuition: body.groupTuition
      }
      const result = ConversationsModel.findOneAndUpdate({groupTuition : body.groupTuition}, {$set: criteria}, {new: true, upsert : true}).exec();
      return result;
    }
    else {
      throw new Error('Cannot find group tuition!');
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error');
  }
}

const disableConversations = async (tuitionList: string[]): Promise<{disabledConversations: string[]}> => {
  try {
    await ConversationsModel.updateMany({ tuition: { $in: tuitionList } }, { $set: { isDisabled: true } }).exec();
    const conversations = await ConversationsModel.find({ tuition: { $in: tuitionList } }).exec();
    
    return {
      disabledConversations: conversations.map((item) => item._id),
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error');
  }
};

export {
  findConversationByUserId,
  createConversation,
  updateConversation,
  createOrUpdateGroupConversation,
  disableConversations,
  findByIds
};