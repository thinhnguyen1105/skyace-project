import { ILoginInput, IRegisterInput, ILoginResult, ILoginWithSocialAccountInput } from '../api/modules/auth/auth/interface';
import { IFindUserDetail, IUpdateUserInput } from '../api/modules/auth/users/interface';
import { ISaveSocialUserPayload } from '../rematch/models/profile/interface';
import fetch from 'isomorphic-fetch';

class Exception extends Error {
  message: string;
  status: number;
  response: string;
  headers: { [key: string]: any; };
  result: any;

  constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
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

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
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
    response.headers.forEach((v: any, k: any) => _headers[k] = v);
  }

  if (status === 200 || status === 201) {
      return response.text().then((responseText) => {
      let result: any = null;
      let resultData = responseText === '' ? null : JSON.parse(responseText);
      result = resultData;
      return result;
      });
  } else if (status === 400) {
      return response.text().then((responseText) => {
      return throwException(responseText, status, responseText, _headers);
      });
  } else if (status === 404) {
      return response.text().then((responseText) => {
      return throwException(responseText, status, responseText, _headers);
      });
  } else if (status !== 200 && status !== 204) {
      return response.text().then((responseText) => {
      return throwException(responseText, status, responseText, _headers);
      });
  }
  return Promise.resolve<T>(null as any);
}

const AuthServiceProxy = (baseUrl = '', token) => {
  return {
    checkEmail: async (email: string): Promise<boolean> => {
      let url = baseUrl + '/auth/checkEmail/';
      if (email !== undefined) {
        url += encodeURIComponent('' + email) + '&';
      }
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        },
      } as any;
      
      return fetch(url, options).then((response: Response) => processResponse<boolean>(response));
    },
    loginLocal: async (loginInput: ILoginInput): Promise<ILoginResult> => {
      let url = baseUrl + '/auth/login/local';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        },
        body: JSON.stringify(loginInput),
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<ILoginResult>(response));
    },
    register: async (registerInput: IRegisterInput): Promise<IFindUserDetail> => {
      let url = baseUrl + '/auth/register';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        },
        body: JSON.stringify(registerInput),
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<IFindUserDetail>(response));
    },
    refreshToken: async (oldToken: string): Promise<{token: string}> => {
      let url = baseUrl + '/auth/refreshToken';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        },
        body: JSON.stringify({token: oldToken}),
      } as any;
      return fetch(url, options).then((response: Response) => processResponse<{token: string}>(response));
    },
    updateSocialUser: async(socialUserPayload: ISaveSocialUserPayload): Promise<any> => {
      let url = baseUrl + '/users/update/social';
      url = url.replace(/[?&]$/, '');
      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(socialUserPayload)
      } as any;
      return fetch(url, options).then((response: Response) => processResponse<any>(response));
    },
    loginWithGoogle: async (loginWithSocialAccountInput: ILoginWithSocialAccountInput): Promise<{token: string}> => {
      let url = baseUrl + '/auth/login/google';

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(loginWithSocialAccountInput),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<{token: string}>(response)
      );
    },
    loginWithFacebook: async (loginWithSocialAccountInput: ILoginWithSocialAccountInput): Promise<{token: string}> => {
      let url = baseUrl + '/auth/login/facebook';

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(loginWithSocialAccountInput),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<{token: string}>(response)
      );
    },
    sendResetPasswordEmail: async (email: string): Promise<void> => {
      let url = baseUrl + '/auth/sendResetPasswordEmail/';
      if (email !== undefined) {
        url += encodeURIComponent('' + email) + '&';
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
        processResponse<void>(response)
      );
    },
    updateNewPassword: async (updateNewPassword: IUpdateUserInput): Promise<void> => {
      let url = baseUrl + '/users/update';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(updateNewPassword),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
   };
};

export default AuthServiceProxy;
