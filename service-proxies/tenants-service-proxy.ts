import {
  IFindTenantsResult,
  ICreateTenantInput,
  IFindTenantDetail,
  IUpdateTenantInput,
  ICompanyProfile,
  IConfiguration,
  IContractInfo,
  IBankTransfer,
  IPaypal,
  IAdminInfor,
  ICommissionFee,
} from '../api/modules/auth/tenants/interface';
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

const TenantsServiceProxy = (baseUrl = '', token = '') => {
  return {
    find: async (
      search: string | null | undefined,
      pageNumber: number | null | undefined,
      pageSize: number | null | undefined,
      sortBy: string,
      asc: boolean,
      isActive?: boolean,
    ): Promise<IFindTenantsResult> => {
      let url = baseUrl + '/tenants/find?';
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
        processResponse<IFindTenantsResult>(response)
      );
    },
    findByAdmin: async (
      search: string | null | undefined,
      pageNumber: number | null | undefined,
      pageSize: number | null | undefined,
      sortBy: string,
      asc: boolean,
      adminCreated: string,
      isActive?: boolean) : Promise<IFindTenantsResult> => {
        let url = baseUrl + '/tenants/findByAdmin?';
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
      if (adminCreated === undefined || asc === null) {
        throw new Error(
          'The parameter \'adminCreated\' must be defined and cannot be null.'
        );
      } else {
        url += 'adminCreated=' + encodeURIComponent('' + adminCreated) + '&';
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
        processResponse<IFindTenantsResult>(response)
      );
    },
    findTenantByName: async (tenantName: string): Promise<IFindTenantDetail> => {
      let url = baseUrl + `/tenants/findByName/`;
      if (tenantName === undefined || tenantName === null) {
        throw new Error(
          'The parameter \'tenantName\' must be defined and cannot be null.'
        );
      } else {
        url += encodeURIComponent('' + tenantName) + '&';
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
        processResponse<IFindTenantDetail>(response)
      );
    },
    findTenantByDomain: async (domain: string): Promise<IFindTenantDetail> => {
      let url = baseUrl + `/tenants/findByDomain/`;
      if (domain === undefined || domain === null) {
        throw new Error(
          'The parameter \'domain\' must be defined and cannot be null.'
        );
      } else {
        url += encodeURIComponent('' + domain) + '&';
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
        processResponse<IFindTenantDetail>(response)
      );
    },
    findTenantDetail: async (
      _id: string
    ): Promise<IFindTenantDetail> => {
      let url = baseUrl + `/tenants/find-detail/${_id}`;
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
        processResponse<IFindTenantDetail>(response)
      );
    },
    create: async (
      createTenantInput: ICreateTenantInput
    ): Promise<IFindTenantDetail> => {
      let url = baseUrl + '/tenants/create';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createTenantInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindTenantDetail>(response)
      );
    },
    update: async (updateTenantInput: IUpdateTenantInput): Promise<void> => {
      let url = baseUrl + '/tenants/update';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateTenantInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    updateFields: async (updateTenantInput: any): Promise<void> => {
      let url = baseUrl + '/tenants/update-fields';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateTenantInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    activate: async (tenantId: string): Promise<void> => {
      let url = baseUrl + '/tenants/activate/';
      if (tenantId === undefined || tenantId === null) {
        throw new Error(
          'The parameter \'tenantId\' must be defined and cannot be null.'
        );
      } else {
        url += '' + encodeURIComponent('' + tenantId) + '&';
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
    deactivate: async (tenantId: string): Promise<void> => {
      let url = baseUrl + '/tenants/deactivate/';
      if (tenantId === undefined || tenantId === null) {
        throw new Error(
          'The parameter \'tenantId\' must be defined and cannot be null.'
        );
      } else {
        url += '' + encodeURIComponent('' + tenantId) + '&';
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
    updateProfile: async (input: ICompanyProfile): Promise<void> => {
      let url = baseUrl + '/tenants/update/profile';
      if (input._id === undefined || input._id === null) {
        throw new Error(
          'The parameter \'tenantId\' must be defined and cannot be null.'
        );
      }
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
        processResponse<void>(response)
      );
    },
    updateAdminInfo: async (input: IAdminInfor): Promise<void> => {
      let url = baseUrl + '/tenants/update/adminInfo';
      if (input._id === undefined || input._id === null) {
        throw new Error(
          'The parameter \'tenantId\' must be defined and cannot be null.'
        );
      }
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
        processResponse<void>(response)
      );
    },
    updateConfiguration: async (input: IConfiguration): Promise<void> => {
      let url = baseUrl + '/tenants/update/configuration';
      if (input._id === undefined || input._id === null) {
        throw new Error(
          'The parameter \'tenantId\' must be defined and cannot be null.'
        );
      }
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
        processResponse<void>(response)
      );
    },
    updateContract: async (input: IContractInfo): Promise<void> => {
      let url = baseUrl + '/tenants/update/contract';
      if (input._id === undefined || input._id === null) {
        throw new Error(
          'The parameter \'tenantId\' must be defined and cannot be null.'
        );
      }
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
        processResponse<void>(response)
      );
    },
    updateBankTransfer: async (input: IBankTransfer): Promise<void> => {
      let url = baseUrl + '/tenants/update/bankTransfer';
      if (input._id === undefined || input._id === null) {
        throw new Error(
          'The parameter \'tenantId\' must be defined and cannot be null.'
        );
      }
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
        processResponse<void>(response)
      );
    },
    updatePayal: async (input: IPaypal): Promise<void> => {
      let url = baseUrl + '/tenants/update/paypal';
      if (input._id === undefined || input._id === null) {
        throw new Error(
          'The parameter \'tenantId\' must be defined and cannot be null.'
        );
      }
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
        processResponse<void>(response)
      );
    },
    updateCommissionFee: async (input: ICommissionFee): Promise<any> => {
      let url = baseUrl + '/tenants/update/commissionFee';
      if (!input._id) {
        throw new Error(
          'The parameter \'userId\' must be defined and cannot be null.'
        );
      }
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
        processResponse<void>(response)
      );
    },
    checkDomainExist: async (payload: any): Promise<any> => {
      let url = baseUrl + '/tenants/check-domain?domain=' + payload.domain + '&_id=' + payload._id;
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return fetch(url, options as any).then((response: Response) =>
        processResponse<any>(response)
      );
    },
    getPartnerPayments: async (_id: string): Promise<any> => {
      let url = baseUrl + '/tenants/partner-payment?_id=' + _id;
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return fetch(url, options as any).then((response: Response) =>
        processResponse<any>(response)
      );
    },
    getPartnerPaycheck: async (_id: string): Promise<any> => {
      let url = baseUrl + '/tenants/partner-paycheck?_id=' + _id;
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return fetch(url, options as any).then((response: Response) =>
        processResponse<any>(response)
      );
    },
    updatePartnerPaycheck: async (payload: any): Promise<any> => {
      let url = baseUrl + '/tenants/partner-paycheck?_id=' + payload._id + '&date=' + payload.date;
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return fetch(url, options as any).then((response: Response) =>
        processResponse<any>(response)
      );
    }
  };
};

export default TenantsServiceProxy;
