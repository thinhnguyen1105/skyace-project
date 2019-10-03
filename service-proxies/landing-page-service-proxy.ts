import { IGetLandingPageInfo, IUpdateLandingPageDetail } from "api/modules/website/landing-page/interface";
import fetch from 'isomorphic-fetch';

class Exception extends Error {
    message: string;
    status: number;
    response: string;
    headers: { [key: string]: any };
    result: any;

    constructor(
        message: string,
        status: number,
        response: string,
        headers: { [key: string]: any },
        result: any
    ) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isSwaggerException = true;

    static isSwaggerException(obj: any): obj is Exception {
        return obj.isSwaggerException === true;
    }
}

function throwException(
    message: string,
    status: number,
    response: string,
    headers: { [key: string]: any },
    result?: any
): any {
    if (result !== null && result !== undefined) {
        throw result;
    } else {
        throw new Exception(message, status, response, headers, null);
    }
}

async function processResponse<T>(response: Response): Promise<T> {
    const status = response.status;

    let _headers: any = {};
    if (response.headers && response.headers.forEach) {
        response.headers.forEach((v: any, k: any) => (_headers[k] = v));
    }

    if (status === 200 || status === 201) {
        return response.text().then(responseText => {
            let result: any = null;
            let resultData = responseText === '' ? null : JSON.parse(responseText);
            result = resultData;
            return result;
        });
    } else if (status === 400) {
        return response.text().then(responseText => {
            return throwException(
                responseText,
                status,
                responseText,
                _headers
            );
        });
    } else if (status === 404) {
        return response.text().then(responseText => {
            return throwException(
                responseText,
                status,
                responseText,
                _headers
            );
        });
    } else if (status !== 200 && status !== 204) {
        return response.text().then(responseText => {
            return throwException(
                responseText,
                status,
                responseText,
                _headers
            );
        });
    }
    return Promise.resolve<T>(null as any);
}
const LandingPageServiceProxy = (baseUrl = '', _token = '') => {
    return {
        get: async (): Promise<IGetLandingPageInfo> => {
            let url = baseUrl + '/landing-page/get/';
            url = url.replace(/[?&]$/, '');
            let options = {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return fetch(url, options as any).then((response: Response) =>
                processResponse<IGetLandingPageInfo>(response)
            );
        },
        update: async (
            updateLandingPageInput: IUpdateLandingPageDetail
        ): Promise<IGetLandingPageInfo> => {
            let url = baseUrl + '/landing-page/update';
            url = url.replace(/[?&]$/, '');
            let options = {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateLandingPageInput)
            };

            return fetch(url, options as any).then((response: Response) =>
                processResponse<IGetLandingPageInfo>(response)
            );
        },
        createLandingPageForNewTenant: async (tenantId: string, tenantName: string): Promise<void> => {
            let url = baseUrl + '/landing-page/createLandingPageForNewTenant';
            url = url.replace(/[?&]$/, '');
            let options = {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tenantId,
                    tenantName
                })
            };

            return fetch(url, options as any).then((response: Response) =>
                processResponse<void>(response)
            );
        },
    };
};

export default LandingPageServiceProxy;