import * as multer from 'multer';
import * as path from 'path';
import friendlyFileName from './get-friendly-file-name';

const defaultFolder = path.join(__dirname, `../../../../../static/images/default`);
const blogsFolder = path.join(__dirname, `../../../../../static/images/blog`);
const landingPageFolder = path.join(__dirname, `../../../../../static/images/landing-page`);
const usersFolder = path.join(__dirname, `../../../../../static/images/users`);
const companyFolder = path.join(__dirname, `../../../../../static/images/company-logo`);

const imageFilter = function (_req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

export const saveFile = () => {
    var storage = multer.diskStorage({
        destination: (req: any, _file, cb) => {
            switch (req.params.title) {
                case 'blog':
                    cb(null, blogsFolder);
                    break;
                case 'users':
                    cb(null, usersFolder);
                    break;
                case 'landing-page':
                    cb(null, landingPageFolder);
                    break;
                case 'company-logo':
                    cb(null, companyFolder);
                    break;
                case 'default':
                    cb(null, defaultFolder);
                    break;
                default:
                    cb(null, defaultFolder);
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
    var upload = multer({ storage: storage, fileFilter: imageFilter });
    return upload;
};
