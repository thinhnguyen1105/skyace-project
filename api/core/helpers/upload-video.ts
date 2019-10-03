import * as multer from 'multer';
import * as path from 'path';
import friendlyFileName from './get-friendly-file-name';
const landingPageFolder = path.join(__dirname, `../../../../../static/images/landing-page`);

const videoFilter = function (_req, file, cb) {
  if (!file.originalname.match(/\.(mp4|ogg|webm)$/i)) {
      return cb(new Error('Only mp4, ogg, webm files are allowed!'), false);
  }
  if((file.size / 1000) > 7000) {
    return cb(new Error('Only accept < 7MB mp4, ogg, webm file'), false);
}
  cb(null, true);
};

export const saveVideo = () => {
  var storage = multer.diskStorage({
      destination: (req: any, _file, cb) => {
          switch (req.params.title) {
              case 'landing-page':
                  cb(null, landingPageFolder);
                  break;
          }
      },
      filename: (req: any, file, cb) => {
          if (req.params.id) {
              cb(null, friendlyFileName(file.fieldname) + '-' + req.params.id + '.' + file.mimetype.slice(6, 10));
          } else {
              cb(null, friendlyFileName(file.originalname));
          }
      }
  });
  var upload = multer({ storage: storage, fileFilter: videoFilter });
  return upload;
};