import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';

const storage = multer.diskStorage({
  destination: async (req: any, _file, cb) => {
    const fileFolder = path.join(__dirname, `../../../../../materials-uploaded/${req.body.sessionId}`);
    const fsAcessPromise = util.promisify(fs.access);
    try {
      await fsAcessPromise(fileFolder);
    } catch (error) {
      const fsMkdirPromise = util.promisify(fs.mkdir);
      await fsMkdirPromise(fileFolder);
    }
    cb(null, path.join(__dirname, `../../../../../materials-uploaded/${req.body.sessionId}`));
  },
  filename: async (req: any, file, cb) => {
    const fileFolder = path.join(__dirname, `../../../../../materials-uploaded/${req.body.sessionId}`);
    const fsReaddirPromise = util.promisify(fs.readdir);

    const fileList = await fsReaddirPromise(fileFolder);
    const lastDot = file.originalname.lastIndexOf('.');
    const fileName = file.originalname.slice(0, lastDot).trim();
    const fileType = file.originalname.slice(lastDot + 1).trim();
    const sameFileName = fileList.filter((item) => item.indexOf(fileName) === 0);

    cb(null, `${fileName} ${sameFileName.length === 0 ? '' : `(${sameFileName.length})`}.${fileType}`);
  }
});

const uploadMaterial = multer({
  storage,
});

export default uploadMaterial;