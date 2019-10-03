import * as Joi from 'joi';
import * as courseForTutorRepository from './repository';
import { ICreateCourseForTutorInput, IGetCourseForTutorDetail, IUpdateCourseForTutorInput, IGetAllCourseForTutor, ICourseForTutor } from './interface';

const createCourseForTutor = async (body: ICreateCourseForTutorInput, tenantId: string): Promise<IGetCourseForTutorDetail> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    tutor: Joi.string().required(),
    course: Joi.string(),
    hourlyRate: Joi.number().required(),
    groupTuition: Joi.string()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }
  // Save to db
  return await courseForTutorRepository.createCourseForTutor({...body, tenant_id: tenantId});
};

const updateCourseForTutor = async (body: IUpdateCourseForTutorInput): Promise<ICourseForTutor> => {
  // Validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    hourlyRate: Joi.number().required(),
    tenant_id: Joi.string()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Update
  const result = await courseForTutorRepository.updateCourseForTutor(body);
  return result;
};

const getAllCourseForTutor = async (tenantId: string): Promise<any> => {
  return await courseForTutorRepository.getAll(tenantId);
};

const findByTutorId = async (tutorId: string, tenantId: string): Promise<IGetAllCourseForTutor> => {
  return await courseForTutorRepository.findByTutorId(tutorId, tenantId);
};

const deleteCourseForTutor = async (_id: string, tenantId: string): Promise<void> => {
  return await courseForTutorRepository.deleteCourseForTutor(_id, tenantId);
};
const trutlyDeleteCourseForTutor = async (_id: string, tenantId: string): Promise<void> => {
  return await courseForTutorRepository.trutlyDeleteCourseForTutor(_id, tenantId);
};
export default {
    createCourseForTutor,
    updateCourseForTutor,
    getAllCourseForTutor,
    findByTutorId,
    deleteCourseForTutor,
    trutlyDeleteCourseForTutor
  };