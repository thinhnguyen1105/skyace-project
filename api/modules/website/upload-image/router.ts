import * as express from 'express';
import * as fs from 'fs';
import imagesService from './service';
import { saveFile } from '../../../core/helpers/upload-file';
import * as path from 'path';
import { promisify } from 'util';
import { saveVideo } from '../../../core/helpers/upload-video';
import friendlyFileName from '../../../core/helpers/get-friendly-file-name';
const imagesRouter = express.Router();

imagesRouter.post('/upload/:title/:id', saveFile().single('image'), async (req, res) => {
    try {
        await imagesService.uploadImage(req);
        res.status(200).send(friendlyFileName(req.file.originalname));
    } catch (err) {
        res.status(500).send({
            errorMessage: err.message || 'Internal server error.'
        });

    }
});

imagesRouter.post('/upload-video/:title/:id/', saveVideo().single('video'), async (req, res) => {
    try {
        if((req.file.size/1000)>7000) {
            res.status(500).send({
                errorMessage: 'Only accept <7MB mp4 file.'
            }); 
        }
        else {
        await imagesService.uploadImage(req);
        res.status(200).send(friendlyFileName(req.file.originalname));
        }
    } catch (err) {
        res.status(500).send({
            errorMessage: err.message || 'Internal server error.'
        });

    }
});

imagesRouter.post('/upload/:title', saveFile().single('image'), async (req, res) => {
    try {
        await imagesService.uploadImage(req);
        const img = friendlyFileName(req.file.originalname);
        const imgHyperLink = `/static/images/${req.params.title}/${img}`;
        res.status(200).send({img, imgHyperLink});
    } catch (err) {
        res.status(500).send({
            errorMessage: err.message || 'Internal server error.'
        });

    }
});

imagesRouter.get('/get/:title', async (req, res) => {
    try {
        const dataObject = await imagesService.getImages(req.params.title);
        res.status(200).send(dataObject);
    } catch (err) {
        res.status(500).send({
            errorMessage: err.message || 'Internal server error.'
        });

    }
});

imagesRouter.delete('/delete/:title/:id', async (req, res) => {
    try {
        await imagesService.deleteImage(req);
        const filePath = path.join(
            __dirname,
            `../../../../../../static/images/${req.params.title}/${req.params.id}`,
          );
        const unlink = promisify(fs.unlink);
        await unlink(filePath);
        res.status(200).end();
    } catch (err) {
        res.status(500).send({
            errorMessage: err.message || 'Internal server error.'
        });

    }
});
export default imagesRouter;