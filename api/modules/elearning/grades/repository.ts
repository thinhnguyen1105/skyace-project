import GradeModel from './mongoose';
import { IFindGradesResult, IFindGradeDetail } from './interface';

const findAll = async (tenantId: string): Promise<IFindGradesResult> => {
  try {
    const totalPromise = GradeModel.find({ tenant: tenantId, isActive: true })
      .countDocuments()
      .exec();

    const dataPromise = GradeModel.find({ tenant: tenantId, isActive: true })
      .sort('name')
      .populate('level')
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

const findEverything = async (tenantId: string): Promise<IFindGradesResult> => {
  try {
    const totalPromise = GradeModel.find({ tenant: tenantId })
      .countDocuments()
      .exec();

    const dataPromise = GradeModel.find({ tenant: tenantId })
      .sort('name')
      .populate('level')
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

const get = async (): Promise<any> => {
  try {
    return await GradeModel.find({}).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const getGradeByName = async (tenantId: string, name: string): Promise<IFindGradeDetail> => {
  return await GradeModel.findOne({tenant: tenantId, name: name}).exec() as any;
}

const create = async (tenantId: string, body: any): Promise<IFindGradeDetail> => {
  try {
    const newGrade = new GradeModel({
      ...body,
      tenant: tenantId,
    });
    return await newGrade.save();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const update = async (tenantId: string, body: any): Promise<IFindGradeDetail> => {
  try {
    return await GradeModel.findOneAndUpdate({_id: body._id, tenant: tenantId}, {$set: body}, {new: true}).exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const findOne = async (query: string): Promise<any> => {
  return await GradeModel.findOne({name : query})
} 

export {
  findAll,
  create,
  update,
  getGradeByName,
  get,
  findOne,
  findEverything
};
