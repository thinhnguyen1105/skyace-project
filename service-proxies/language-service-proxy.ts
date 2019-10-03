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

const LanguageServiceProxy = (baseUrl = '', token = '') => {
  return {
    find: async (): Promise<any> => {
      let url = baseUrl + '/language/get-all?';
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
        processResponse<any>(response)
      );
    },
    findByShortName: async (name: string): Promise<any> => {
      let url = baseUrl + `/language/find-by-short-name?`;
      if (name === undefined || name === null) {
        throw new Error(
          'The parameter \'shortName\' must be defined and cannot be null.'
        );
      } else {
        url += 'shortName=' + encodeURIComponent('' + name) + '&';
      }
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
      };
      return fetch(url, options as any).then((response: Response) =>
        processResponse<any>(response)
      );
    },
    findById: async (_id: string): Promise<any> => {
      let url = baseUrl + `/language/find-by-id?`;
      if (_id === undefined || _id === null) {
        throw new Error(
          'The parameter \'id\' must be defined and cannot be null.'
        );
      } else {
        url += '_id=' + encodeURIComponent('' + _id) + '&';
      }
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
      };
      return fetch(url, options as any).then((response: Response) =>
        processResponse<any>(response)
      );
    },
    create: async (
      input: any
    ): Promise<any> => {
      let url = baseUrl + '/language/create';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<any>(response)
      );
    },
    update: async (input: any): Promise<any> => {
      let url = baseUrl + '/language/update';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<any>(response)
      );
    },
  };
};

export default LanguageServiceProxy;
