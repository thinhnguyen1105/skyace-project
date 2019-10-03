import * as languageRepository from './repository';
import * as Joi from 'joi';
const excelToJson = require('convert-excel-to-json');

const getById = async (id: string): Promise<any> => {
  return await languageRepository.getById(id);
}

const findByShortName = async (shortName: string): Promise<any> => {
  return await languageRepository.findByShortName(shortName);
}

const getAll = async (): Promise<any> => {
  return await languageRepository.getAll();
}

const create = async (body: any): Promise<any> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    name: Joi.string().required(),
    shortName: Joi.string().required(),
    url: Joi.string().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error('Bad request');
  }

  const path = process.cwd();
  const result = excelToJson({
    sourceFile: `${path}/static/xlsx/${body.url}`,
  });

  if (result && (Object as any).values(result).length) {
    let data = (Object as any).values(result)[0];
    let obj = {};
    data.forEach((val, index) => {
      if (index === 0) return;
      else {
        if (val && val.A && val.C) {
          obj[val.A] = {
            key: val.A,
            translated: val.C,
            }
          }
        }
    })
    const existedLang = await languageRepository.findByShortName(body.shortName);
    if (existedLang) {
      return await languageRepository.updateById({
        ...body,
        _id: existedLang._id,
        data: obj
      });
    } else {
      return await languageRepository.create({
        ...body,
        data: obj
      });
    }
  } else {
    throw new Error('Unreadable file format!');
  }
}

const updateByCountry = async (body: any): Promise<any> => {
  return await languageRepository.updateByCountry(body);
}

export default {
    getById,
    getAll,
    create,
    updateByCountry,
    findByShortName
};