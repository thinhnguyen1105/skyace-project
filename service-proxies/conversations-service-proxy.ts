import { ICreateConversationInput, IFindConversationDetail, IFindConversationsResult, IUpdateConversationInput, ICreateOrUpdateGroupConversationInput } from "../api/modules/private-message/conversations/interface";


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

const ConversationsServiceProxy = (baseUrl = '', token) => {
  return {
    findConversationByUserId: async (userId: string, unreadConversations: string[], pageNumber: number, pageSize: number, sortBy: string, asc: boolean): Promise<IFindConversationsResult> => {
      let url = baseUrl + '/conversations/findByUserId?';
      if (userId !== undefined) {
        url += 'userId=' + encodeURIComponent('' + userId) + '&';
      }
      if (unreadConversations !== undefined) {
        unreadConversations.forEach(item => { url += "unreadConversations=" + encodeURIComponent("" + item) + "&"; });
      }
      if (pageNumber !== undefined) {
        url += 'pageNumber=' + encodeURIComponent('' + pageNumber) + '&';
      }
      if (pageSize !== undefined) {
        url += 'pageSize=' + encodeURIComponent('' + pageSize) + '&';
      }
      if (sortBy !== undefined) {
        url += 'sortBy=' + encodeURIComponent('' + sortBy) + '&';
      }
      if (asc !== undefined) {
        url += 'asc=' + encodeURIComponent('' + asc) + '&';
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

      return fetch(url, options).then((response: Response) => processResponse<IFindConversationsResult>(response));
    },
    createConversation: async (createConversationInput: ICreateConversationInput): Promise<IFindConversationDetail> => {
      let url = baseUrl + '/conversations/create';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        },
        body: JSON.stringify(createConversationInput),
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<IFindConversationDetail>(response));
    },
    updateConversation: async (updateConversationInput: IUpdateConversationInput): Promise<void> => {
      let url = baseUrl + '/conversations/update';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        },
        body: JSON.stringify(updateConversationInput),
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<void>(response));
    },
    createOrUpdateGroupConversation: async (input: ICreateOrUpdateGroupConversationInput): Promise<IFindConversationDetail> => {
      let url = baseUrl + '/conversations/createGroupConversation';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        },
        body: JSON.stringify(input)
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<IFindConversationDetail>(response));
    },
    findByIds: async (_id: string[]) : Promise<IFindConversationDetail[]> => {
      let url = baseUrl + '/conversations/findByIds' ;
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        },
        body: JSON.stringify({_id})
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<IFindConversationDetail[]>(response));
    }
  };
};

export default ConversationsServiceProxy;