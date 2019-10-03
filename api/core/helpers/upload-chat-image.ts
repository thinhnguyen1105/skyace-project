import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';

const storage = multer.diskStorage({
  destination: async (_req: any, _file, cb) => {
    const fileFolder = path.join(__dirname, `../../../../../static/images/private-message`);
    const fsAcessPromise = util.promisify(fs.access);
    try {
      await fsAcessPromise(fileFolder);
    } catch (error) {
      const fsMkdirPromise = util.promisify(fs.mkdir);
      await fsMkdirPromise(fileFolder);
    }
    cb(null, path.join(__dirname, `../../../../../static/images/private-message`));
  },
  filename: async (_req: any, file, cb) => {
    cb(null, file.originalname);
  }
});

const uplodaChatImage = multer({
  storage,
});

export default uplodaChatImage;