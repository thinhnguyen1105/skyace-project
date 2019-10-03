import * as path from 'path';
import { promisify } from 'util';
import * as fs from 'fs';

const uploadImage = async (req: any): Promise<void> => {

    if (!req.params.title) {
        throw new Error('Directory is not found');
    }
};

const getImages = async (title: string): Promise<{data: string[], dataHyperLink: string[]}> => {
    if (!title) {
        throw new Error('Directory is Not Found');
    }

    const filePath = path.join(
        __dirname,
        `../../../../../../static/images/${title}`,
      );
    const readdir = promisify(fs.readdir);
    const data = await readdir(filePath);
    let dataHyperlink = data.map((value) => {
        const directory = `/static/images/${title}/`;
        return directory + value;
    });
    const dataObject = {data: data, dataHyperLink: dataHyperlink};
    return dataObject;
};

const deleteImage = async (req: any): Promise<void> => {

    if (!req.params.id) {
        throw new Error('ID is not found');
    }
    if (!req.params.title) {
        throw new Error('Directory is not found');
    }
};

export default {
    uploadImage,
    getImages,
    deleteImage
};