import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as uuid from 'uuid';
import config from '../../../config/modules/language.config';

const languageFilter = (_req: any, file: any, cb: any) => {
  if (!file.originalname.match(config.fileExt)) {
      return cb(new Error('Only xlsx file is allowed'), false);
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: async (_req: any, _file: any, cb: any) => {
    const fileFolder = path.join(__dirname, `../../../../../../static/xlsx`);
    const fsAccessPromise = util.promisify(fs.access);
    try {
      await fsAccessPromise(fileFolder);
    } catch (error) {
      const fsMkdirPromise = util.promisify(fs.mkdir);
      await fsMkdirPromise(fileFolder);
    }
    cb(null, path.join(__dirname, `../../../../../../static/xlsx`));
  },
  filename: async (_req: any, file: any, cb: any) => {
    const hash = uuid.v4();
    const lastDot = file.originalname.lastIndexOf('.');
    const fileType = file.originalname.slice(lastDot + 1).trim();
    cb(null, `${hash}.${fileType}`);
  },
});

export const languageMiddleware = multer({
  storage,
  fileFilter: languageFilter,
});
