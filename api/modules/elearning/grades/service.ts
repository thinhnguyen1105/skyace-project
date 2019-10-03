import * as Joi from 'joi';
import * as gradeRepository from './repository';
import { IFindGradesResult, IFindGradeDetail } from './interface';

const findAll = async (tenantId: string): Promise<IFindGradesResult> => {
  return await gradeRepository.findAll(tenantId);
};

const findEverything = async (tenantId: string): Promise<IFindGradesResult> => {
  return await gradeRepository.findEverything(tenantId);
};

const create = async (tenantId: string, body: any): Promise<IFindGradeDetail> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    name: Joi.string().required(),
    slug: Joi.string().required(),
    level: Joi.string().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }
  //Check exist
  const existedGrade = await gradeRepository.getGradeByName(tenantId, body.name);
  if (existedGrade) {
    throw new Error('Grade is already exist.');
  }
  // Save to db
  return await gradeRepository.create(tenantId, body);
};

const update = async (tenantId: string, body: any): Promise<IFindGradeDetail> => {
  // Validate Body
  if (!body._id) {
    throw new Error('Grade ID is empty.');
  }

  return await gradeRepository.update(tenantId, body);
};

export default {
  findAll,
  create,
  update,
  findEverything
};