import { ICreateCourseInput, IUpdateCourseInput, IDeleteCourseInput, IGetAllCourses, IGetCourseDetail } from '../api/modules/elearning/courses/interface';
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
    return response.text().then((_responseText) => {
      let result: any = null;
      let resultData = _responseText === '' ? null : JSON.parse(_responseText);
      result = resultData;
      return result;
    });
  } else if (status === 400) {
    return response.text().then((_responseText) => {
      return throwException('A server error occurred.', status, _responseText, _headers);
    });
  } else if (status === 404) {
    return response.text().then((_responseText) => {
      return throwException('A server error occurred.', status, _responseText, _headers);
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException('An unexpected server error occurred.', status, _responseText, _headers);
    });
  }
  return Promise.resolve<T>(null as any);
}

const CourseServiceProxy = (baseUrl = '', token) => {
  return {
    getAllCourses: async (): Promise<any> => {
      let url = baseUrl + '/courses/all';
      url = url.replace(/[?&]$/, '');
      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // 'authorization': token ? token : '',
        },
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<IGetAllCourses>(response));
    },
    createCourse: async (createCourseInput: ICreateCourseInput): Promise<IGetCourseDetail> => {
      let url = baseUrl + '/courses/create';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(createCourseInput)
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<IGetCourseDetail>(response));
    },
    updateCourse: async (updateCourseInput: IUpdateCourseInput): Promise<void> => {
      let url = baseUrl + '/courses/update';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(updateCourseInput)
      } as any;

      return fetch(url, options).then((response: Response) => {
        processResponse<void>(response);
      });
    },
    deleteCourse: async (deleteCourseInput: IDeleteCourseInput): Promise<void> => {
      let url = baseUrl + '/courses/delete';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(deleteCourseInput)
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<void>(response));
    },
    searchCourse: async (searchCourseInput: string): Promise<IGetAllCourses> => {
      let url = baseUrl + '/courses/search?keyword=' + searchCourseInput;

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        }
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<IGetAllCourses>(response));
    },
    filterCourse: async (filterInput: any): Promise<IGetAllCourses> => {
      console.log('filterInput', filterInput);
      let url = baseUrl + '/courses/filter';
      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        },
        body: JSON.stringify(filterInput)
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<IGetAllCourses>(response));
    },
    getAllCountries: async (): Promise<any> => {
      let url = baseUrl + '/courses/get-all-countries?';
      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        }
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<IGetAllCourses>(response));
    }
  };
};

export default CourseServiceProxy;
