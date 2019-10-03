import { IFindUsersResult, ICreateUserInput, IFindUserDetail, IUpdateUserInput, IFindUsersESResult, ICreateAdminUserForNewTenant, IChangePasswordInput, ICreateFranchise } from '../api/modules/auth/users/interface';
import { IGetAllCourseForTutor } from '../api/modules/elearning/course-for-tutor/interface';
import { ICreateCourseForTutorInput, IUpdateCourseForTutorInput } from '../rematch/models/ui/edit-profile-page/interface';
import { ICreateCourseInput, IGetCourseDetail, IDeleteCourseInput, IUpdateCourseInput } from '../api/modules/elearning/courses/interface';
import { apiKey, IpGeolocationURL } from '../api/config/ipgeolocation.config';
import fetch from 'isomorphic-fetch';
import { IFindByUserIdInput } from 'api/modules/elearning/ratings/interface';

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

const UsersServiceProxy = (baseUrl = '', token) => {
  return {
    find: async (
      search: string | null | undefined,
      role: string | null | undefined,
      pageNumber: number | null | undefined,
      pageSize: number | null | undefined,
      sortBy: string,
      asc: boolean,
    ): Promise<IFindUsersResult> => {
      let url = baseUrl + '/users/find?';
      if (search !== undefined) {
        url += 'search=' + encodeURIComponent('' + search) + '&';
      }
      if (role !== undefined) {
        url += 'role=' + encodeURIComponent('' + role) + '&';
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
        processResponse<IFindUsersResult>(response)
      );
    },
    findFranchises: async (
      search: string | null | undefined,
      role: string | null | undefined,
      pageNumber: number | null | undefined,
      pageSize: number | null | undefined,
      sortBy: string,
      asc: boolean,
    ): Promise<IFindUsersResult> => {
      let url = baseUrl + '/users/findFranchises?';
      if (search !== undefined) {
        url += 'search=' + encodeURIComponent('' + search) + '&';
      }
      if (role !== undefined) {
        url += 'role=' + encodeURIComponent('' + role) + '&';
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
        processResponse<IFindUsersResult>(response)
      );
    },
    findById: async (
      id: string
    ): Promise<IFindUsersResult> => {
      let url = baseUrl + '/users/findById/';
      if (id !== undefined) {
        url += encodeURIComponent('' + id) + '&';
      }
      url = url.replace(/[?&]$/, '');
      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
          'Access-Control-Allow-Credentials': true
        }
      };
      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindUsersResult>(response)
      );
    },
    findTutors: async (
      search: string | null | undefined,
      language: string | null | undefined,
      gender: string | null | undefined,
      nationality: string | null | undefined,
      education: string | null | undefined,
      race: string | null | undefined,
      courseInput: object | null | undefined,
      _minAge: number | null | undefined,
      _maxAge: number | null | undefined,
      minPrice: number | null | undefined,
      maxPrice: number | null | undefined,
      minYearsOfExp: number | null | undefined,
      maxYearsOfExp: number | null | undefined,
      minRating: number | null | undefined,
      maxRating: number | null | undefined,
      pageNumber: number | null | undefined,
      pageSize: number | null | undefined,
      sortBy: string,
      asc: boolean,
    ): Promise<IFindUsersESResult> => {
      let url = baseUrl + '/users/search?';
      url = url.replace(/[?&]$/, '');
      nationality = nationality === 'All nationality' ? "" : nationality;

      const data = JSON.stringify({
        match: {
          ...{
            search,
            "biography.language": language,
            "biography.gender": gender,
            "biography.nationality": nationality,
            "education.highestEducation": education,
            "biography.race": race
          },
        },
        range: {
          // Comment this because we have no age in data
          // minAge,
          // maxAge,
          minPrice,
          maxPrice,
          minYearsOfExp,
          maxYearsOfExp,
          minRating,
          maxRating
        },
        pagination: {
          pageNumber,
          pageSize
        },
        sort: {
          sortBy,
          asc
        },
        should : courseInput
      });

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: data
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindUsersESResult>(response)
      );
    },
    findTutorById: async (
      id: string
    ): Promise<IFindUsersResult> => {
      let url = baseUrl + '/users/findTutorById/';
      if (id !== undefined) {
        url += encodeURIComponent('' + id) + '&';
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
        processResponse<IFindUsersResult>(response)
      );
    },
    findStudentById: async (
      id: string
    ): Promise<IFindUsersResult> => {
      let url = baseUrl + '/users/findStudentById/';
      if (id !== undefined) {
        url += encodeURIComponent('' + id) + '&';
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
        processResponse<IFindUsersResult>(response)
      );
    },
    create: async (
      createUserInput: ICreateUserInput
    ): Promise<IFindUserDetail> => {
      let url = baseUrl + '/users/create';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(createUserInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindUserDetail>(response)
      );
    },
    createAdminUserForNewTenant: async (createAdminUserInput: ICreateAdminUserForNewTenant): Promise<void> => {
      let url = baseUrl + '/users/createAdminUserForNewTenant';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(createAdminUserInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    createFranchise: async (createFranchise: ICreateFranchise): Promise<any> => {
      let url = baseUrl + '/users/createFranchise';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(createFranchise)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<any>(response)
      );
    },
    update: async (updateUserInput: IUpdateUserInput): Promise<void> => {
      let url = baseUrl + '/users/update';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(updateUserInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    activate: async (userId: string): Promise<void> => {
      let url = baseUrl + '/users/activate/';
      if (userId === undefined || userId === null) {
        throw new Error(
          'The parameter \'userId\' must be defined and cannot be null.'
        );
      } else {
        url += '' + encodeURIComponent('' + userId) + '&';
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
    deactivate: async (userId: string): Promise<void> => {
      let url = baseUrl + '/users/deactivate/';
      if (userId === undefined || userId === null) {
        throw new Error(
          'The parameter \'userId\' must be defined and cannot be null.'
        );
      } else {
        url += '' + encodeURIComponent('' + userId) + '&';
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
    findTutorCoursesById: async (tutorId: string): Promise<IGetAllCourseForTutor> => {
      let url = baseUrl + '/course-for-tutor/find-by-tutor-id?tutor_id=' + tutorId;

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
    deleteTeacherSubject: async (_id: string): Promise<void> => {
      let url = baseUrl + '/course-for-tutor/delete';
      let deleteSubjectInput = { _id };
      let options = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        },
        body: JSON.stringify(deleteSubjectInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    trutlyDeleteTeacherSubject: async (_id: string): Promise<void> => {
      let url = baseUrl + '/course-for-tutor/deleteCoruseForTutor';
      let deleteSubjectInput = { _id };
      let options = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        },
        body: JSON.stringify(deleteSubjectInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    createCourseForTutor: async (input: ICreateCourseForTutorInput): Promise<void> => {
      let url = baseUrl + '/course-for-tutor/create';
      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        },
        body: JSON.stringify(input)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    updateCourseForTutor: async (input: IUpdateCourseForTutorInput): Promise<void> => {
      let url = baseUrl + '/course-for-tutor/update';
      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        },
        body: JSON.stringify(input)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
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
    trutlyDeleteCourse: async (deleteCourseInput: IDeleteCourseInput): Promise<void> => {
      let url = baseUrl + '/courses/deleteCourse';
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
    getIP: async (): Promise<void> => {
      let url = IpGeolocationURL + '/getip';

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    getUserGeolocation: async (ip: string): Promise<void> => {
      let url = IpGeolocationURL + '/ipgeo?apiKey=' + apiKey + '&ip=' + ip;
      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    getRatings: async(query: IFindByUserIdInput): Promise<void> => {
      let url = baseUrl + '/ratings/find-by-user-id?userId=' + query.userId + '&pageSize=' + query.pageSize + '&pageNumber=' + query.pageNumber ;
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        }
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<void>(response));
    },
    changePassword: async (body: IChangePasswordInput): Promise<void> => {
      let url = baseUrl + '/users/change-password';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(body)
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<void>(response));
    },
    findTenantAdmin: async (tenant: string): Promise<any> => {
      let url = baseUrl + '/users/find-tenant-admin?tenant=' + tenant;
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        }
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<any>(response));
    },
    impersonate: async (body: any): Promise<any> => {
      let url = baseUrl + '/auth/impersonate';
      url = url.replace(/[?&]$/, '');
      const data = {
        user_id: body.userId
      }

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(data)
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<any>(response));
    },
    getFranchisesList: async () : Promise<any> => {
      let url = baseUrl + '/users/getFranchisesList';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        }
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<any>(response));
    },
    getDistributorPayment: async (_id: string) : Promise<any> => {
      let url = baseUrl + '/users/distributor-payment?_id=' + _id;
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        }
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<any>(response));
    },
    getDistributorPaycheck: async (_id: string) : Promise<any> => {
      let url = baseUrl + '/users/distributor-payment?_id=' + _id;
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        }
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<any>(response));
    },
    updateDistributorPaycheck: async (_id: string, date: string) : Promise<any> => {
      let url = baseUrl + '/users/update-distributor-paycheck?_id=' + _id + '&date=' + date;
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        }
      } as any;

      return fetch(url, options).then((response: Response) => processResponse<any>(response));
    }
  };
};

export default UsersServiceProxy;