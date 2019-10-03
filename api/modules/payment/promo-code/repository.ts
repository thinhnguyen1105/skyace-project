import PromoCodeModel from './mongoose';
import { IFindPromoCodeQuery, IFindPromoCodesResult, IFindPromoCodeDetail, ICreatePromoCodeInput, IUpdatePromoCodeInput } from './interface';

const findPromoCodes = async (tenantId: string, query: IFindPromoCodeQuery): Promise<IFindPromoCodesResult> => {
  try {
    const options = query.search ? 
    {
      $and : [
        {tenant: tenantId},
        {name: { $regex: query.search, $options: 'i' }}
      ]
    } : {
      tenant: tenantId
    }
    
    const totalPromise = PromoCodeModel.find(options)
      .countDocuments()
      .exec();

    const dataPromise = PromoCodeModel.find(options)
      .sort((query.asc as any) === 'true' || query.asc === true ? query.sortBy : `-${query.sortBy}`)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
      .populate('tutor')
      .populate('student')
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

const findByName = async (tenantId: string, query: string): Promise<IFindPromoCodeDetail> => {
  try {
    return await PromoCodeModel.findOne({ tenant: tenantId, name: query}).exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const findByNameExcept = async (tenantId: string, query: any): Promise<IFindPromoCodeDetail> => {
  try {
    const result = await PromoCodeModel.findOne({ 
      $and: 
        [{ tenant: tenantId } ,{ name: query.name}, {name : {$ne : query.old}}]
    }).exec() as any;
    return result;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const findById = async (tenantId: string, query: string): Promise<IFindPromoCodeDetail> => {
  try {
    return await PromoCodeModel.findOne({ tenant: tenantId, _id: query}).exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const create = async (tenantId: string, promoCode: ICreatePromoCodeInput): Promise<IFindPromoCodeDetail> => {
  try {
    const newPromoCode = new PromoCodeModel({
      ...promoCode,
      tenant: tenantId,
    });
    return await newPromoCode.save();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const update = async (tenantId: string, promoCode: IUpdatePromoCodeInput): Promise<IFindPromoCodeDetail> => {
  try {
    return await PromoCodeModel.findOneAndUpdate({tenant : tenantId , _id: promoCode._id}, {$set : promoCode}, {new: true}).exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const deactivate = async (tenantId: string, _id: string): Promise<void> => {
  try {
    await PromoCodeModel.updateOne({tenant: tenantId, _id: _id} , {isActive: false}).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const activate = async (tenantId: string, _id: string): Promise<void> => {
  try {
    await PromoCodeModel.updateOne({tenant: tenantId, _id: _id} , {isActive: true}).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const deleteOne = async (tenantId: string, _id: string): Promise<void> => {
  try {
    await PromoCodeModel.deleteOne({tenant: tenantId, _id: _id}).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

export {
  findPromoCodes,
  create,
  findByName,
  findByNameExcept,
  findById,
  update,
  deactivate,
  activate,
  deleteOne
};