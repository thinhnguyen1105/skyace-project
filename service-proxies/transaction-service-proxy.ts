import { IFindTransactionDetail, ICreateTransactionInput, IGetAccessTokenResult, IFindTransactionsResult } from "api/modules/payment/transactions/interface";
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

const TransactionServiceProxy = (baseUrl = '', token = '') => {
  return {
    findTransactions: async (search: string, pageNumber: number, pageSize: number, sortBy: string, asc: boolean): Promise<IFindTransactionsResult> => {
      let url = baseUrl + '/transaction/findTransactions?';
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
        processResponse<IFindTransactionsResult>(response)
      );
    },
    create: async (
      createTransactionInput: ICreateTransactionInput
    ): Promise<IFindTransactionDetail> => {
      let url = baseUrl + '/transaction/create';
      url = url.replace(/[?&]$/, '');
      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createTransactionInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindTransactionDetail>(response)
      );
    },
    update: async (
      createTransactionInput: any
    ): Promise<IFindTransactionDetail> => {
      let url = baseUrl + '/transaction/update';
      url = url.replace(/[?&]$/, '');
      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createTransactionInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindTransactionDetail>(response)
      );
    },
    getAccessToken: async (
    ): Promise<IGetAccessTokenResult> => {
      let base64 = require('base-64');
      let url = 'https://api.sandbox.paypal.com/v1/oauth2/token';
      let clientId = 'AVh4kYu1KzIvZW1XPFdBO67myAn0-QqM9io97mgmugHwi71Ba2K_Zasex0GgxQT8MQsXNyHhumaFgbYR';
      let secret = 'EJJIk34mDThXgyRLPB9YuRSA8mphBWuRH8lm63y1CPSOKbepe_HeBYlHl_xQlM59FOyr1Qof7sEcrKtw';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en_US',
          'Authorization': 'Basic ' + base64.encode(clientId + ":" + secret),
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
        body: JSON.stringify({ grant_type: 'client_credentials' })
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IGetAccessTokenResult>(response)
      );
    }
  };

};

export default TransactionServiceProxy;
