import fetch from 'isomorphic-fetch';
import { IFindNotificationSettingDetail, ICreateNotificationSettingInput, IEditNotificationSettingInput } from '../api/modules/host/notification-settings/interface';

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

const NotificationSettingsServiceProxy = (baseUrl = '', token) => {
  return {
    findSettingByTenantId: async (tenantId: string): Promise<IFindNotificationSettingDetail> => {
      let url = baseUrl + '/notificationSettings/findSettingByTenantId/';
      if (tenantId !== undefined) {
        url += encodeURIComponent('' + tenantId) + '&';
      }
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        }
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindNotificationSettingDetail>(response)
      );
    },
    createNotificationSetting: async (createNotificationSettingInput: ICreateNotificationSettingInput): Promise<IFindNotificationSettingDetail> => {
      let url = baseUrl + '/notificationSettings/createNotificationSetting';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(createNotificationSettingInput),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindNotificationSettingDetail>(response)
      );
    },
    editNotificationSetting: async (editNotificationSettingInput: IEditNotificationSettingInput): Promise<void> => {
      let url = baseUrl + '/notificationSettings/editNotificationSetting';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(editNotificationSettingInput),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
  };
};

export default NotificationSettingsServiceProxy;