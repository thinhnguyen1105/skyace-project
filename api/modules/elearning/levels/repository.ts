import LevelModel from './mongoose';
import { IFindLevelsResult, IFindLevelDetail } from './interface';
import GradeModel from '../grades/mongoose';

const findAll = async (tenantId: string): Promise<IFindLevelsResult> => {
  try {
    const totalPromise = LevelModel.find({ tenant: tenantId, isActive: true })
      .countDocuments()
      .exec();

    const dataPromise = LevelModel.find({ tenant: tenantId, isActive: true })
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

const findEverything = async (tenantId: string): Promise<IFindLevelsResult> => {
  try {
    const totalPromise = LevelModel.find({ tenant: tenantId })
      .countDocuments()
      .exec();

    const dataPromise = LevelModel.find({ tenant: tenantId })
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

const findOne = async (query: string): Promise<any> => {
  return await LevelModel.findOne({name : query})
}

const get = async (): Promise<any> => {
  return await LevelModel.find({}).exec();
}

const getLevelByName = async (tenantId: string, name: string): Promise<IFindLevelDetail> => {
  return await LevelModel.findOne({tenant: tenantId, name: name}).exec() as any;
}

const create = async (tenantId: string, body: any): Promise<IFindLevelDetail> => {
  try {
    const newLevel = new LevelModel({
      ...body,
      tenant: tenantId,
    });
    return await newLevel.save();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const update = async (tenantId: string, body: any): Promise<IFindLevelDetail> => {
  try {
    return await LevelModel.findOneAndUpdate({_id: body._id, tenant: tenantId}, {$set: body}, {new: true}).exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const toggle = async (tenantId: string, body: any) : Promise<IFindLevelDetail> => {
  try {
    await GradeModel.updateMany({level: body._id}, {$set : {isActive: body.isActive}}).exec();
    return await LevelModel.findOneAndUpdate({_id: body._id, tenant: tenantId}, {$set: body}, {new: true}).exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

export {
  findAll,
  create,
  update,
  getLevelByName,
  get,
  findOne,
  findEverything,
  toggle
};
