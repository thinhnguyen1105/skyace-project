import LanguageModel from "./mongoose";

const getById = async (id: string): Promise<any> => {
  try {
    return LanguageModel.findById(id).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const getAll = async (): Promise<any> => {
  try {
    return LanguageModel.find({}).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findByShortName = async (shortName): Promise<any> => {
  try {
    return LanguageModel.findOne({shortName}).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const create = async (body: any): Promise<any> => {
  const newLanguage = new LanguageModel(body);
  return await newLanguage.save();
}

const updateById = async (body: any): Promise<any> => {
  return LanguageModel.findOneAndUpdate({_id: body._id}, {$set: body}, {new: true}).exec();
}

const updateByCountry = async (body: any): Promise<any> => {
  return LanguageModel.findOneAndUpdate({country: body.country}, {$set: body}, {new: true}).exec();
}

export {
  getById,
  getAll,
  create,
  updateById,
  updateByCountry,
  findByShortName
}