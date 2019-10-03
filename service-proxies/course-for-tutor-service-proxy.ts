import { IGetAllCourseForTutor, ICreateCourseForTutorInput, IGetCourseForTutorDetail, IUpdateCourseForTutorInput } from "../api/modules/elearning/course-for-tutor/interface";
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

const CourseForTutorServiceProxy = (baseUrl = '', token = '') => {
  return {
    findAll: async (): Promise<IGetAllCourseForTutor> => {
      let url = baseUrl + '/course-for-tutor/all';
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
        processResponse<IGetAllCourseForTutor>(response)
      );
    },
    findByTutorId: async (tutorId: string): Promise<IGetAllCourseForTutor> => {
      let url = baseUrl + '/course-for-tutor/find-by-tutor-id?';
      if (tutorId !== undefined) {
        url += 'tutor_id=' + encodeURIComponent('' + tutorId) + '&';
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
        processResponse<IGetAllCourseForTutor>(response)
      );
    },
    create: async (createCourseForTutorInput: ICreateCourseForTutorInput): Promise<IGetCourseForTutorDetail> => {
      let url = baseUrl + '/course-for-tutor/create';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(createCourseForTutorInput),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IGetCourseForTutorDetail>(response)
      );
    },
    update: async (updateCourseForTutorInput: IUpdateCourseForTutorInput): Promise<void> => {
      let url = baseUrl + '/course-for-tutor/update';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(updateCourseForTutorInput),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    delete: async (courseForTutorId: string): Promise<void> => {
      let url = baseUrl + '/course-for-tutor/delete';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify({
          _id: courseForTutorId,
        }),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
  };
};

export default CourseForTutorServiceProxy;