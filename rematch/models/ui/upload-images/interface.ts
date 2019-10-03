export interface IUploadImagesState {
    isBusy: boolean;
    data: string[];
    dataHyperLink: string[];
    isEditFilename: boolean;
    currentImage: any;
    search: string;
    addingNewFile: boolean;
    currentAlbum: string;
    newAlbumname: string;
    albumList: string[];
    imageTemporary: string;
}

export interface IGetImageSuccessPayload {
    data: IGetImageDetails;
}

interface IGetImageDetails {
    data: string[];
    dataHyperLink: string[];
}

export interface IGetImagePayload {
    title: string;
}

export interface IUploadImagePayload {
    title: string;
    id?: string;
    file: any;
}

export interface IDeleteImagePayload {
    title: string;
    id: string;
}

export interface IOnChangeAlbumPayload {
    currentAlbum: string;
}

export interface IOnImageUploadingPayload {
    file: any;
    base64Image: string;
}

export interface IDeleteImageSuccessPayload {
    currentData: string;
}

export interface IUploadImagesSuccessPayload {
    img: string;
    imgHyperLink: string;
}
