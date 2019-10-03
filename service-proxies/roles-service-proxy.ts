import { IFindRolesResult, ICreateRoleInput, IFindRoleDetail, IUpdateRoleInput } from "../api/modules/auth/roles/interface";
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

const RolesServiceProxy = (baseUrl = '', token) => {
  return {
    find: async (
      search: string | null | undefined,
      filter: string[] | null | undefined,
      pageNumber: number | null | undefined,
      pageSize: number | null | undefined,
      sortBy: string,
      asc: boolean
    ): Promise<IFindRolesResult> => {
      let url = baseUrl + '/roles/find?';
      if (search !== undefined) {
        url += 'search=' + encodeURIComponent('' + search) + '&';
      }
      if (filter !== undefined && filter!== null) {
        filter.forEach(item => { url += "filter=" + encodeURIComponent("" + item) + "&"; });
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
        processResponse<IFindRolesResult>(response)
      );
    },
    create: async (
      createRoleInput: ICreateRoleInput
    ): Promise<IFindRoleDetail> => {
      let url = baseUrl + '/roles/create';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(createRoleInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindRoleDetail>(response)
      );
    },
    update: async (updateRoleInput: IUpdateRoleInput): Promise<void> => {
      let url = baseUrl + '/roles/update';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(updateRoleInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    activate: async (roleId: string): Promise<void> => {
      let url = baseUrl + '/roles/activate/';
      if (roleId === undefined || roleId === null) {
        throw new Error(
          'The parameter \'roleId\' must be defined and cannot be null.'
        );
      } else {
        url += '' + encodeURIComponent('' + roleId) + '&';
      }
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
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
    deactivate: async (roleId: string): Promise<void> => {
      let url = baseUrl + '/roles/deactivate/';
      if (roleId === undefined || roleId === null) {
        throw new Error(
          'The parameter \'userId\' must be defined and cannot be null.'
        );
      } else {
        url += '' + encodeURIComponent('' + roleId) + '&';
      }
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
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

export default RolesServiceProxy;