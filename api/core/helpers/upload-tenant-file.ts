import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as uuid from 'uuid';

const hash = uuid.v4();

const storage = multer.diskStorage({
  destination: async (_req: any, _file, cb) => {
    const fileFolder = path.join(__dirname, `../../../../../materials-uploaded/${hash}`);
    const fsAcessPromise = util.promisify(fs.access);
    try {
      await fsAcessPromise(fileFolder);
    } catch (error) {
      const fsMkdirPromise = util.promisify(fs.mkdir);
      await fsMkdirPromise(fileFolder);
    }
    cb(null, path.join(__dirname, `../../../../../materials-uploaded/${hash}`));
  },
  filename: async (_req: any, file, cb) => {
    const fileFolder = path.join(__dirname, `../../../../../materials-uploaded/${hash}`);
    const fsReaddirPromise = util.promisify(fs.readdir);

    const fileList = await fsReaddirPromise(fileFolder);
    const lastDot = file.originalname.lastIndexOf('.');
    const fileName = file.originalname.slice(0, lastDot).trim();
    const fileType = file.originalname.slice(lastDot + 1).trim();
    const sameFileName = fileList.filter((item) => item.indexOf(fileName) === 0);

    cb(null, `${fileName}${sameFileName.length === 0 ? '' : `(${sameFileName.length})`}.${fileType}`);
  }
});

const uploadMaterial = multer({
  storage,
});

export default uploadMaterial;