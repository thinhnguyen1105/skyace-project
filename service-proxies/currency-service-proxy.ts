import { IGetAllCurrencies, IUpdateCurrency, IGetCurrencyDetail, ICreateNewCurrency } from "../api/modules/elearning/currency-exchange/interface";
import { API_URL } from "../api/config/currency.config";
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

const CurrencyServiceProxy = (baseUrl = '', _token = '') => {
  return {
    getAllCurrencies: async(): Promise<IGetAllCurrencies> => {
      let url = baseUrl + '/currencies/all';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IGetAllCurrencies>(response)
      );
    },
    updateCurrencies: async(updateInput: IUpdateCurrency): Promise<IGetCurrencyDetail> => {
      let url = baseUrl + '/currencies/update';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IGetCurrencyDetail>(response)
      );
    },
    createCurrency: async(createInput: ICreateNewCurrency): Promise<IGetCurrencyDetail> => {
      let url = baseUrl + '/currencies/create';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IGetCurrencyDetail>(response)
      );
    },
    deleteCurrency: async(deleteInput: string): Promise<IGetCurrencyDetail> => {
      let url = baseUrl + '/currencies/delete';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({_id : deleteInput})
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IGetCurrencyDetail>(response)
      );
    },
    getRealtimeCurrencyRate: async(payload: any): Promise<any> => {
      const promises = payload.map((val) => {
        let url = API_URL + 'convert?q=' + val + '_SGD';
        let options = {
          method: 'GET'
        };
        return fetch(url, options as any).then((response: Response) =>
          processResponse<IGetCurrencyDetail>(response)
        ); 
      })

      return await Promise.all(promises);
    }
  };
};

export default CurrencyServiceProxy;