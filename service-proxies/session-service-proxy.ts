import { IFindSessionsResult, ICreateSessionsInput, IUpdateSessionInput, IFindSessionDetail, IDeleteMaterialInput } from "../api/modules/elearning/sessions/interface";
import fetch from 'isomorphic-fetch';
import config from "../api/config";

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

const SessionsServiceProxy = (baseUrl = '', token = '') => {
  return {
    deleteMaterial: async (deleteMaterialInput: IDeleteMaterialInput): Promise<void> => {
      let url = baseUrl + '/sessions/deleteMaterial?';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(deleteMaterialInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    findByTuitionId: async (tuitionId: string): Promise<IFindSessionsResult> => {
      let url = baseUrl + '/sessions/findByTuitionId?';
      if (tuitionId !== undefined) {
        url += 'tuitionId=' + encodeURIComponent('' + tuitionId) + '&';
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
        processResponse<IFindSessionsResult>(response)
      );
    },
    findBySessionId: async (sessionId: string): Promise<IFindSessionDetail> => {
      let url = baseUrl + '/sessions/findBySessionId?';
      if (sessionId !== undefined) {
        url += 'sessionId=' + encodeURIComponent('' + sessionId) + '&';
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
        processResponse<IFindSessionDetail>(response)
      );
    },
    createSessions: async (createSessionsInput: ICreateSessionsInput): Promise<IFindSessionsResult> => {
      let url = baseUrl + '/sessions/createSessions';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(createSessionsInput),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindSessionsResult>(response)
      );
    },
    updateSessions: async (updateSessionsInput: any): Promise<IFindSessionsResult> => {
      let url = baseUrl + '/sessions/updateSessions';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(updateSessionsInput),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindSessionsResult>(response)
      );
    },
    deleteMany: async (sessionsId: Array<string>): Promise<void> => {
      let url = baseUrl + '/sessions/deleteMany';
      url = url.replace(/[?&]$/, '');
      let options = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(sessionsId)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    updateSession: async (updateSessionInput: IUpdateSessionInput): Promise<void> => {
      let url = baseUrl + '/sessions/update';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(updateSessionInput),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    generateUrl: async (_id: string, name: string, role: string): Promise<void> => {
      let url = baseUrl + '/sessions/generate-url?_id=' + _id + '&name=' + name + '&role=' + role;
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        }
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    generateRecordingsUrl: async (_id: string): Promise<void> => {
      let url = baseUrl + '/sessions/recordings?_id=' + _id;
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        }
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    checkRoom: async (url: string): Promise<any> => {
      let options = {
        method: "POST",
        headers: {
          origin: config.nextjs.hostUrl
        }
      };

      return fetch(url, options as any).then((response: any) =>
        response.text()
      );
    },
    createRoom: async (url: string): Promise<any> => {
      let options = {
        method: "POST",
        headers: {
          origin: config.nextjs.hostUrl
        }
      };

      return fetch(url, options as any).then((response: any) =>
        response.text()
      );
    },
    getRecordings: async (url: string): Promise<any> => {
      let options = {
        method: "GET",
        headers: {
          origin: config.nextjs.hostUrl
        }
      };

      return fetch(url, options as any).then((response: any) =>
        response.text()
      );
    },
    checkCompletedSessions: async (): Promise<void> => {
      let url = baseUrl + '/sessions/checkCompletedSessions';
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
        processResponse<void>(response)
      );
    },
  };
};

export default SessionsServiceProxy;
