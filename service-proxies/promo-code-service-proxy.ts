import {
  IFindPromoCodesResult, IFindPromoCodeDetail, ICreatePromoCodeInput, IUpdatePromoCodeInput
} from '../api/modules/payment/promo-code/interface';
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

const PromoCodeServiceProxy = (baseUrl = '', token = '') => {
  return {
    find: async (
      search: string | null | undefined,
      pageNumber: number | null | undefined,
      pageSize: number | null | undefined,
      sortBy: string,
      asc: boolean,
      isActive?: boolean,
    ): Promise<IFindPromoCodesResult> => {
      let url = baseUrl + '/promo-code/find?';
      if (search !== undefined) {
        url += 'search=' + encodeURIComponent('' + search) + '&';
      }
      if (pageNumber !== undefined) {
        url += 'pageNumber=' + encodeURIComponent('' + pageNumber) + '&';
      }
      if (pageSize !== undefined) {
        url += 'pageSize=' + encodeURIComponent('' + pageSize) + '&';
      }
      if (sortBy === undefined || sortBy === null) {
        throw new Error(
          'The parameter \'sortBy\' must be defined and cannot be null.'
        );
      } else {
        url += 'sortBy=' + encodeURIComponent('' + sortBy) + '&';
      }
      if (asc === undefined || asc === null) {
        throw new Error(
          'The parameter \'asc\' must be defined and cannot be null.'
        );
      } else {
        url += 'asc=' + encodeURIComponent('' + asc) + '&';
      }
      if (isActive !== undefined) {
        url += 'isActive=' + encodeURIComponent('' + isActive) + '&';
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
        processResponse<IFindPromoCodesResult>(response)
      );
    },
    findByName: async (name: string): Promise<IFindPromoCodeDetail> => {
      let url = baseUrl + `/promo-code/find-by-name?`;
      if (name === undefined || name === null) {
        throw new Error(
          'The parameter \'name\' must be defined and cannot be null.'
        );
      } else {
        url += 'name=' + encodeURIComponent('' + name) + '&';
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
        processResponse<IFindPromoCodeDetail>(response)
      );
    },
    findById: async (_id: string): Promise<IFindPromoCodeDetail> => {
      let url = baseUrl + `/promo-code/find-by-id?`;
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
        processResponse<IFindPromoCodeDetail>(response)
      );
    },
    create: async (
      input: ICreatePromoCodeInput
    ): Promise<IFindPromoCodeDetail> => {
      let url = baseUrl + '/promo-code/create';
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
        processResponse<IFindPromoCodeDetail>(response)
      );
    },
    update: async (input: IUpdatePromoCodeInput): Promise<IFindPromoCodeDetail> => {
      let url = baseUrl + '/promo-code/update';
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
        processResponse<IFindPromoCodeDetail>(response)
      );
    },
    activate: async (_id: string): Promise<void> => {
      let url = baseUrl + '/promo-code/activate?';
      if (_id === undefined || _id === null) {
        throw new Error(
          'The parameter \'_id\' must be defined and cannot be null.'
        );
      } else {
        url += '_id=' + encodeURIComponent('' + _id) + '&';
      }
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    deactivate: async (_id: string): Promise<void> => {
      let url = baseUrl + '/promo-code/deactivate?';
      if (_id === undefined || _id === null) {
        throw new Error(
          'The parameter \'_id\' must be defined and cannot be null.'
        );
      } else {
        url += '_id=' + encodeURIComponent('' + _id) + '&';
      }
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    delete: async (_id: string): Promise<void> => {
      let url = baseUrl + '/promo-code/delete?';
      if (_id === undefined || _id === null) {
        throw new Error(
          'The parameter \'_id\' must be defined and cannot be null.'
        );
      } else {
        url += '_id=' + encodeURIComponent('' + _id) + '&';
      }
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    findByNameExcept: async (name: string, oldName: string): Promise<IFindPromoCodeDetail> => {
      let url = baseUrl + `/promo-code/find-by-name-except?`;
      if (name === undefined || name === null) {
        throw new Error(
          'The parameter \'name\' must be defined and cannot be null.'
        );
      } else {
        url += 'name=' + encodeURIComponent('' + name) + '&';
      }
      if (oldName === undefined || oldName === null) {
        throw new Error(
          'The parameter \'oldName\' must be defined and cannot be null.'
        );
      } else {
        url += 'old=' + encodeURIComponent('' + oldName) + '&';
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
        processResponse<IFindPromoCodeDetail>(response)
      );
    },
    useCode: async (_id: string): Promise<IFindPromoCodeDetail> => {
      let url = baseUrl + `/promo-code/use-code?`;
      if (_id === undefined || _id === null) {
        throw new Error(
          'The parameter \'_id\' must be defined and cannot be null.'
        );
      } else {
        url += '_id=' + encodeURIComponent('' + _id);
      }

      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
      };
      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindPromoCodeDetail>(response)
      );
    }
  };
};

export default PromoCodeServiceProxy;
