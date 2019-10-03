import * as Joi from 'joi';
import * as subjectRepository from './repository';
import { IFindSubjectsResult, IFindSubjectDetail } from './interface';

const findAll = async (tenantId: string): Promise<IFindSubjectsResult> => {
  return await subjectRepository.findAll(tenantId);
};

const findEverything = async (tenantId: string): Promise<IFindSubjectsResult> => {
  return await subjectRepository.findEverything(tenantId);
};

const create = async (tenantId: string, body: any): Promise<IFindSubjectDetail> => {
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
  const existedSubject = await subjectRepository.getSubjectByName(tenantId, body.name);
  if (existedSubject) {
    throw new Error('Subject is already exist.');
  }
  // Save to db
  return await subjectRepository.create(tenantId, body);
};

const update = async (tenantId: string, body: any): Promise<IFindSubjectDetail> => {
  // Validate Body
  if (!body._id) {
    throw new Error('Subject ID is empty.');
  }

  return await subjectRepository.update(tenantId, body);
};

export default {
  findAll,
  create,
  update,
  findEverything
};