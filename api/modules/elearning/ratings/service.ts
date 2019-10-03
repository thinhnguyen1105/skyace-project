import * as Joi from 'joi';
import * as ratingRepository from './repository';
import { IFindRatingsResult, IFindRatingDetail, ICreateRatingInput, IUpdateRatingInput, IFindByUserIdInput } from './interface';

const findByUserId = async (tenantId: string, query: IFindByUserIdInput): Promise<IFindRatingsResult> => {
  if (!query.userId) {
    throw new Error('User ID cannot be empty');
  }
  return await ratingRepository.findByUserId(tenantId, query);
};

const findById = async (tenantId: string, _id: string): Promise<IFindRatingDetail> => {
  if (!_id) {
    throw new Error('Rating ID cannot be empty');
  }
  return await ratingRepository.findById(tenantId, _id);
};

const create = async (tenantId: string, body: ICreateRatingInput): Promise<IFindRatingDetail> => {
  // validate body
  const validationRule = Joi.object().keys({
    rateSession: Joi.number().required(),
    commentSession: Joi.string().required(),
    uploadBy: Joi.string().required(),
    tutor: Joi.string().required()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }
  return await ratingRepository.create(tenantId, body);
};

const update = async (tenantId: string, body: IUpdateRatingInput): Promise<IFindRatingDetail> => {
  // validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    rateSession: Joi.number(),
    commentSession: Joi.string(),
    uploadBy: Joi.string()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  return await ratingRepository.update(tenantId, body);
};

const migrateRatings = async (): Promise<void> => {
  return await ratingRepository.migrateRatings();
}

export default {
  findByUserId,
  findById,
  create,
  update,
  migrateRatings
};
