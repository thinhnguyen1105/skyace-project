import { createModel, ModelConfig } from '@rematch/core';
import { message } from 'antd';
import { IUploadImagesState, IGetImageSuccessPayload, IGetImagePayload, IDeleteImagePayload, IOnChangeAlbumPayload, IOnImageUploadingPayload, IDeleteImageSuccessPayload, IUploadImagesSuccessPayload, IUploadImagePayload } from './interface';
import { getUploadImagesService } from '../../../../service-proxies';
import friendlyFileName from '../../../../api/core/helpers/get-friendly-file-name';
const uploadImagesModel: ModelConfig<IUploadImagesState> = createModel({
    state: {
        isBusy: false,
        data: [],
        dataHyperLink: [],
        isEditFilename: false,
        currentImage: '',
        search: '',
        addingNewFile: false,
        currentAlbum: 'default',
        newAlbumname: '',
        albumList: [],
        imageTemporary: ''
    },
    reducers: {
        starting: (
            state: IUploadImagesState,
        ): IUploadImagesState => {
            return {
                ...state,
                isBusy: true,
            };
        },
        getImageSuccess: (
            state: IUploadImagesState,
            payload: IGetImageSuccessPayload
        ): IUploadImagesState => {
            return {
                ...state,
                isBusy: false,
                data: payload.data.data,
                dataHyperLink: payload.data.dataHyperLink
            };
        },
        deleteImageSuccess: (
            state: IUploadImagesState,
            payload: IDeleteImageSuccessPayload
        ): IUploadImagesState => {
            message.success('Delete image successful');
            const currentHyperLink = `/static/images/${state.currentAlbum}/${payload.currentData}`;
            return {
                ...state,
                isBusy: false,
                data: state.data.filter(data => data !== payload.currentData),
                dataHyperLink: state.dataHyperLink.filter(data => data !== currentHyperLink)
            };
        },
        uploadImageSuccess: (
            state: IUploadImagesState,
            payload: IUploadImagesSuccessPayload
        ): IUploadImagesState => {
            message.success('Upload image successful');
            return {
                ...state,
                isBusy: false,
                data: [payload.img, ...state.data],
                dataHyperLink: [payload.imgHyperLink, ...state.dataHyperLink]
            };
        },
        onChangeAlbum: (
            state: IUploadImagesState,
            payload: IOnChangeAlbumPayload
        ): IUploadImagesState => {
            return {
                ...state,
                currentAlbum: payload.currentAlbum
            };
        },
        onImageUploading: (
            state: IUploadImagesState,
            payload: IOnImageUploadingPayload
        ): IUploadImagesState|any => {
            let isDuplicate = false;
            const fileName = friendlyFileName(payload.file.name);
            state.data.map((value, _index) => {
                if (value === fileName) {
                        isDuplicate = true;
                }
            });
            if (!isDuplicate) {
            message.success(`Upload image ${fileName} successfully!`);
            return {
                ...state,
                imageTemporary: payload.base64Image,
                data: [fileName, ...state.data],
                dataHyperLink: [`/static/images/${state.currentAlbum}/${fileName}`, ...state.dataHyperLink]
            };
        } else { message.error('Duplicate file name.', 4); }
        }
    },
    effects: {
        async getImagesEffect(
            payload: IGetImagePayload,
            _rootState: any
        ): Promise<void> {
            try {
                this.starting();
                const UploadImagesService = getUploadImagesService();
                const data = await UploadImagesService.get(
                    payload.title
                );
                this.getImageSuccess({ data });
            } catch (error) {
                message.error(error.message, 4);
            }
        },
        async deleteImageEffect(
            payload: IDeleteImagePayload,
            _rootState: any
        ): Promise<void> {
            try {
                this.starting();
                const UploadImagesService = getUploadImagesService();
                await UploadImagesService.delete(
                    payload.title,
                    payload.id
                );
                this.deleteImageSuccess({currentData: payload.id});
            } catch (error) {
                message.error(error.message, 4);
            }
        },
        async uploadImageEffect(
            payload: IUploadImagePayload,
            _rootState: any
        ): Promise<void> {
            try {
                console.log(payload);
                this.starting();
                const UploadImagesService = getUploadImagesService();
                const result = await UploadImagesService.upload(
                    payload.title,
                    payload.file,
                    payload.id,
                );
                this.uploadImageSuccess(result);
            } catch (error) {
                message.error(error.message, 4);
            }
        },
    }
});

export default uploadImagesModel;