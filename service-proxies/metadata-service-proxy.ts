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

const MetadataServiceProxy = (baseUrl = '', _token = '') => {
  return {
    getAllSubjects: async(): Promise<any> => {
      let url = baseUrl + '/subjects/all';
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
    getAllSubjectsIncludeInactive: async(): Promise<any> => {
      let url = baseUrl + '/subjects/all-include-inactive';
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
    updateSubject: async(updateInput: any): Promise<any> => {
      let url = baseUrl + '/subjects/update';
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
        processResponse<any>(response)
      );
    },
    createSubject: async(createInput: any): Promise<any> => {
      let url = baseUrl + '/subjects/create';
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
        processResponse<any>(response)
      );
    },
    getAllLevels: async(): Promise<any> => {
      let url = baseUrl + '/levels/all';
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
    getAllLevelsIncludeInactive: async(): Promise<any> => {
      let url = baseUrl + '/levels/all-include-inactive';
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
    updateLevel: async(updateInput: any): Promise<any> => {
      let url = baseUrl + '/levels/update';
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
        processResponse<any>(response)
      );
    },
    toggleLevelActive: async(updateInput: any): Promise<any> => {
      let url = baseUrl + '/levels/toggle';
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
        processResponse<any>(response)
      );
    },
    createLevel: async(createInput: any): Promise<any> => {
      let url = baseUrl + '/levels/create';
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
        processResponse<any>(response)
      );
    },
    getAllGrades: async(): Promise<any> => {
      let url = baseUrl + '/grades/all';
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
    getAllGradesIncludeInactive: async(): Promise<any> => {
      let url = baseUrl + '/grades/all-include-inactive';
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
    updateGrade: async(updateInput: any): Promise<any> => {
      let url = baseUrl + '/grades/update';
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
        processResponse<any>(response)
      );
    },
    createGrade: async(createInput: any): Promise<any> => {
      let url = baseUrl + '/grades/create';
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
        processResponse<any>(response)
      );
    },
  };
};

export default MetadataServiceProxy;