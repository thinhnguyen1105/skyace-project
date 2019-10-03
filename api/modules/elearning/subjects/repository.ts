import SubjectModel from './mongoose';
import { IFindSubjectsResult, IFindSubjectDetail } from './interface';

const findAll = async (tenantId: string): Promise<IFindSubjectsResult> => {
  try {
    const totalPromise = SubjectModel.find({ tenant: tenantId, isActive: true })
      .countDocuments()
      .exec();

    const dataPromise = SubjectModel.find({ tenant: tenantId, isActive: true })
      .sort('name')
      .exec();

    const [total, data] = await Promise.all([totalPromise, dataPromise]);

    return {
      total,
      data
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findEverything = async (tenantId: string): Promise<IFindSubjectsResult> => {
  try {
    const totalPromise = SubjectModel.find({ tenant: tenantId })
      .countDocuments()
      .exec();

    const dataPromise = SubjectModel.find({ tenant: tenantId })
      .sort('name')
      .exec();

    const [total, data] = await Promise.all([totalPromise, dataPromise]);

    return {
      total,
      data
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const getSubjectByName = async (tenantId: string, name: string): Promise<IFindSubjectDetail> => {
  return await SubjectModel.findOne({tenant: tenantId, name: name}).exec() as any;
}

const create = async (tenantId: string, body: any): Promise<IFindSubjectDetail> => {
  try {
    const newSubject = new SubjectModel({
      ...body,
      tenant: tenantId,
    });
    return await newSubject.save();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const update = async (tenantId: string, body: any): Promise<IFindSubjectDetail> => {
  try {
    return await SubjectModel.findOneAndUpdate({_id: body._id, tenant: tenantId}, {$set: body}, {new: true}).exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const get = async (): Promise<any> => {
  return await SubjectModel.find({}).exec();
}

const findOne = async (query: string): Promise<any> => {
  return await SubjectModel.findOne({name : query})
} 

export {
  findAll,
  create,
  update,
  getSubjectByName,
  get,
  findOne,
  findEverything
};
