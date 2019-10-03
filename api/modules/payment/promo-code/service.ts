import * as Joi from 'joi';
import * as promoCodeRepository from './repository';
import { IFindPromoCodeQuery, IFindPromoCodesResult, IFindPromoCodeDetail, ICreatePromoCodeInput, IUpdatePromoCodeInput } from './interface';

const findPromoCodes = async (tenantId: string, query: IFindPromoCodeQuery): Promise<IFindPromoCodesResult> => {
  return await promoCodeRepository.findPromoCodes(tenantId, query);
};

const create = async (tenantId: string, query: ICreatePromoCodeInput): Promise<IFindPromoCodeDetail> => {
  const validationRule = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    value: Joi.number().required(),
    type: Joi.string().required(),
    quantity: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
  });
  const { error } = Joi.validate(query, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  return await promoCodeRepository.create(tenantId, query);
};

const update = async (tenantId: string, query: IUpdatePromoCodeInput): Promise<IFindPromoCodeDetail> => {
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    name: Joi.string(),
    description: Joi.string(),
    value: Joi.number(),
    type: Joi.string(),
    quantity: Joi.number(),
    startDate: Joi.date(),
    endDate: Joi.date()
  });
  const { error } = Joi.validate(query, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  return await promoCodeRepository.update(tenantId, query);
};

const deactivate = async (tenantId: string, query: any): Promise<void> => {
  if (!query._id) {
    throw new Error('_id is required!');
  }
  return await promoCodeRepository.deactivate(tenantId, query._id);
}

const activate = async (tenantId: string, query: any): Promise<void> => {
  if(!query._id) {
    throw new Error('_id is required!');
  }
  return await promoCodeRepository.activate(tenantId, query._id);
}

const deleteOne = async (tenantId: string, query: any): Promise<void> => {
  if(!query._id) {
    throw new Error('_id is required!');
  }
  return await promoCodeRepository.deleteOne(tenantId, query._id);
}

const findByName = async (tenantId: string, query: any): Promise<IFindPromoCodeDetail> => {
  if (!query.name) {
    throw new Error('name is required!');
  }
  return await promoCodeRepository.findByName(tenantId, query.name);
}

const findByNameExcept = async (tenantId: string, query: any): Promise<IFindPromoCodeDetail> => {
  if (!query.name) {
    throw new Error('name is required!');
  }
  if (!query.old) {
    throw new Error('old name is required!');
  }
  return await promoCodeRepository.findByNameExcept(tenantId, query);
}

const findById = async (tenantId: string, query: any): Promise<IFindPromoCodeDetail> => {
  if (!query._id) {
    throw new Error('_id is required!');
  }
  return await promoCodeRepository.findById(tenantId, query._id);
}

const useCode = async (tenantId: string, query: any): Promise<void> => {
  const code = await findById(tenantId, query);
  if (code) {
    if (code.isActive) {
      if (code.isInfinite || code.quantity > 0) {
        if (code.isInfinite) {
          return;
        } else {
          await promoCodeRepository.update(tenantId, {_id: query._id, quantity: code.quantity - 1});
          return;
        }
      } else {
        throw new Error('Out of code!');
      }
    } else {
      throw new Error('Code is deactivated');
    }
  } else {
    throw new Error('Cannot find promo code!');
  }
}

export default {
  findPromoCodes,
  create,
  update,
  deactivate,
  findByName,
  findById,
  activate,
  deleteOne,
  findByNameExcept,
  useCode
};