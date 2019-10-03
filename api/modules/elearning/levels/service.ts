import * as Joi from 'joi';
import * as levelRepository from './repository';
import { IFindLevelsResult, IFindLevelDetail } from './interface';

const findAll = async (tenantId: string): Promise<IFindLevelsResult> => {
  return await levelRepository.findAll(tenantId);
};

const findEverything = async (tenantId: string): Promise<IFindLevelsResult> => {
  return await levelRepository.findEverything(tenantId);
};

const create = async (tenantId: string, body: any): Promise<IFindLevelDetail> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    name: Joi.string().required(),
    slug: Joi.string().required()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }
  //Check exist
  const existedLevel = await levelRepository.getLevelByName(tenantId, body.name);
  if (existedLevel) {
    throw new Error('Level is already exist.');
  }
  // Save to db
  return await levelRepository.create(tenantId, body);
};

const update = async (tenantId: string, body: any): Promise<IFindLevelDetail> => {
  // Validate Body
  if (!body._id) {
    throw new Error('Level ID is empty.');
  }

  return await levelRepository.update(tenantId, body);
};

const toggle = async (tenantId: string, body: any): Promise<IFindLevelDetail> => {
  // Validate Body
  if (!body._id) {
    throw new Error('Level ID is empty.');
  }
  if (body.isActive === undefined) {
    throw new Error('isActive is empty');
  }

  return await levelRepository.toggle(tenantId, body);
};

export default {
  findAll,
  create,
  update,
  findEverything,
  toggle
};