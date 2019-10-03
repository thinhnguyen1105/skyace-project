import { IFindTuitionsResult, ICreateTuitionInput, IFindTuitionDetail, IUpdateTuitionInput, ISendBookingConfirmEmail } from "../api/modules/elearning/tuitions/interface";
import { ICreateGroupTuitionInput, IUpdateGroupTuitionInput, IDeleteGroupTuitionInput, IFindGroupTuitionDetail, IBookingGroupTuitionInput } from '../api/modules/elearning/group-tuitions/interface';
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

const TuitionsServiceProxy = (baseUrl = '', token = '') => {
  return {
    findAllTuitionsByStudentId: async (studentId: string, isCompleted: boolean|undefined, isCanceled: boolean|undefined): Promise<IFindTuitionsResult> => {
      let url = baseUrl + '/tuitions/findAllTuitionsByStudentId?';
      if (studentId !== undefined) {
        url += 'studentId=' + encodeURIComponent('' + studentId) + '&';
      }
      if (isCompleted !== undefined) {
        url += 'isCompleted=' + encodeURIComponent('' + isCompleted) + '&';
      }
      if (isCanceled !== undefined) {
        url += 'isCanceled=' + encodeURIComponent('' + isCanceled) + '&';
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
        processResponse<IFindTuitionsResult>(response)
      );
    },
    findTuitionsByStudentId: async (studentId: string, isCompleted: boolean|undefined, isCanceled: boolean|undefined): Promise<IFindTuitionsResult> => {
      let url = baseUrl + '/tuitions/findTuitionsByStudentId?';
      if (studentId !== undefined) {
        url += 'studentId=' + encodeURIComponent('' + studentId) + '&';
      }
      if (isCompleted !== undefined) {
        url += 'isCompleted=' + encodeURIComponent('' + isCompleted) + '&';
      }
      if (isCanceled !== undefined) {
        url += 'isCanceled=' + encodeURIComponent('' + isCanceled) + '&';
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
        processResponse<IFindTuitionsResult>(response)
      );
    },
    findTuitions: async (search: string, isCompleted: boolean|undefined, isCanceled: boolean|undefined, pageNumber: number, pageSize: number, sortBy: string, asc: boolean, status: any): Promise<IFindTuitionsResult> => {
      let url = baseUrl + '/tuitions/findTuitions?';
      if (search !== undefined) {
        url += 'search=' + encodeURIComponent('' + search) + '&';
      }
      if (isCompleted !== undefined) {
        url += 'isCompleted=' + encodeURIComponent('' + isCompleted) + '&';
      }
      if (isCanceled !== undefined) {
        url += 'isCanceled=' + encodeURIComponent('' + isCanceled) + '&';
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
      if (status) {
        status.forEach(item => { url += "status=" + encodeURIComponent("" + item) + "&"; });
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
        processResponse<IFindTuitionsResult>(response)
      );
    },
    findByTutorId: async (tutorId: string, isCompleted: boolean, pageNumber: number, pageSize: number, sortBy: string, asc: boolean, isCanceled: boolean): Promise<IFindTuitionsResult> => {
      let url = baseUrl + '/tuitions/findByTutorId?';
      if (tutorId !== undefined) {
        url += 'userId=' + encodeURIComponent('' + tutorId) + '&';
      }
      if (isCompleted !== undefined) {
        url += 'isCompleted=' + encodeURIComponent('' + isCompleted) + '&';
      }
      if (isCanceled !== undefined) {
        url += 'isCanceled=' + encodeURIComponent('' + isCanceled) + '&';
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
        processResponse<IFindTuitionsResult>(response)
      );
    },
    findByStudentId: async (studentId: string, isCompleted: boolean, pageNumber: number, pageSize: number, sortBy: string, asc: boolean, isCanceled: boolean): Promise<IFindTuitionsResult> => {
      let url = baseUrl + '/tuitions/findByStudentId?';
      if (studentId !== undefined) {
        url += 'userId=' + encodeURIComponent('' + studentId) + '&';
      }
      if (isCompleted !== undefined) {
        url += 'isCompleted=' + encodeURIComponent('' + isCompleted) + '&';
      }
      if (isCanceled !== undefined) {
        url += 'isCanceled=' + encodeURIComponent('' + isCanceled) + '&';
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
        processResponse<IFindTuitionsResult>(response)
      );
    },
    findDataRequestCancelByStudentId: async (studentId: string, pageNumber: number, pageSize: number, sortBy: string, asc: boolean): Promise<IFindTuitionsResult> => {
      let url = baseUrl + '/tuitions/findRequestCancelByStudentId?';
      if (studentId !== undefined) {
        url += 'userId=' + encodeURIComponent('' + studentId) + '&';
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
        processResponse<IFindTuitionsResult>(response)
      );
    },
    findDataRequestCancelByTutorId: async (tutorId: string, pageNumber: number, pageSize: number, sortBy: string, asc: boolean): Promise<IFindTuitionsResult> => {
      let url = baseUrl + '/tuitions/findRequestCancelByTutorId?';
      if (tutorId !== undefined) {
        url += 'userId=' + encodeURIComponent('' + tutorId) + '&';
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
        processResponse<IFindTuitionsResult>(response)
      );
    },
    findCancelTuitionStudent: async (studentId: string, isCompleted: boolean, pageNumber: number, pageSize: number, sortBy: string, asc: boolean): Promise<IFindTuitionsResult> => {
      let url = baseUrl + '/tuitions/findCancelTuitionStudent?';
      if (studentId !== undefined) {
        url += 'userId=' + encodeURIComponent('' + studentId) + '&';
      }
      if (isCompleted !== undefined) {
        url += 'isCompleted=' + encodeURIComponent('' + isCompleted) + '&';
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
        processResponse<IFindTuitionsResult>(response)
      );
    },
    findCancelTuitionTutor: async (tutorId: string, isCompleted: boolean, pageNumber: number, pageSize: number, sortBy: string, asc: boolean): Promise<IFindTuitionsResult> => {
      let url = baseUrl + '/tuitions/findCancelTuitionTutor?';
      if (tutorId !== undefined) {
        url += 'userId=' + encodeURIComponent('' + tutorId) + '&';
      }
      if (isCompleted !== undefined) {
        url += 'isCompleted=' + encodeURIComponent('' + isCompleted) + '&';
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
        processResponse<IFindTuitionsResult>(response)
      );
    },
    findByTuitionId: async (tuitionId: string): Promise<IFindTuitionDetail> => {
      let url = baseUrl + '/tuitions/findByTuitionId?';
      if (tuitionId !== undefined) {
        url += 'tuitionId=' + encodeURIComponent('' + tuitionId) + '&';
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
        processResponse<IFindTuitionDetail>(response)
      );
    },
    createTuition: async (createTuitionInput: ICreateTuitionInput): Promise<IFindTuitionDetail> => {
      let url = baseUrl + '/tuitions/create';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(createTuitionInput),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindTuitionDetail>(response)
      );
    },
    updateTuition: async (updateTuitionInput: IUpdateTuitionInput): Promise<void> => {
      let url = baseUrl + '/tuitions/update';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(updateTuitionInput),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    finishTuition: async (tuitionId: string): Promise<void> => {
      let url = baseUrl + '/tuitions/finishTuition';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify({ tuitionId }),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    cancelTuition: async (tuitionId: string): Promise<any> => {
      let url = baseUrl + '/tuitions/cancel';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify({
          tuitionId,
        }),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<{disabledConversations: string[]}>(response)
      );
    },
    putToPendingTuition: async (tuitionId: string, cancelReason: string, cancelBy: string, userId: string): Promise<{disabledConversations: string[]}> => {
      let url = baseUrl + '/tuitions/pending';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify({
          tuitionId,
          cancelReason,
          cancelBy,
          userId
        }),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<{disabledConversations: string[]}>(response)
      );
    },
    delete: async (tuitionId: string): Promise<void> => {
      let url = baseUrl + '/tuitions/delete';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify({ tuitionId })
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    checkCompletedTuitions: async (): Promise<void> => {
      let url = baseUrl + '/tuitions/checkCompletedTuitions';
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
        processResponse<void>(response)
      );
    },
    getUpcomingTuitions: async (tutor: string): Promise<void> => {
      let url = baseUrl + '/sessions/get-upcoming-tuitions?tutor=' + tutor;
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
        processResponse<void>(response)
      );
    },
    getNewestBookings: async (tutor: string): Promise<void> => {
      let url = baseUrl + '/tuitions/newest-tuition-bookings?tutor=' + tutor;
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
        processResponse<void>(response)
      );
    },
    createGroupTuition: async (body: ICreateGroupTuitionInput): Promise<void> => {
      let url = baseUrl + '/group-tuitions/create';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(body)
      }

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    getGroupTuitionByTutorId: async (payload: string): Promise<void> => {
      let url = baseUrl + '/group-tuitions/find-by-tutor-id?_id=' + payload;
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        }
      }

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    getGroupTuitionById: async (payload: string): Promise<any> => {
      let url = baseUrl + '/group-tuitions/find-by-tuition-id?tuitionId=' + payload;
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : ''
        }
      }

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      )
    },
    findGroupTuitionByTuitionId: async (payload: string): Promise<IFindGroupTuitionDetail> => {
      let url = baseUrl + '/group-tuitions/find-by-tuition-id?tuitionId=' + payload;
      url = url.replace(/[?&]$/, '');
      let options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        }
      }

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindGroupTuitionDetail>(response)
      );
    },
    updateGroupTuition: async (body: IUpdateGroupTuitionInput): Promise<void> => {
      let url = baseUrl + '/group-tuitions/update';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(body)
      }

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    deleteGroupTuition: async (body: IDeleteGroupTuitionInput): Promise<void> => {
      let url = baseUrl + '/group-tuitions/delete';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(body)
      }

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    checkBookingCondition: async (body: IBookingGroupTuitionInput): Promise<void> => {
      let url = baseUrl + '/group-tuitions/check-booking-condition';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(body)
      }

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    bookGroupTuition: async (body: IBookingGroupTuitionInput): Promise<void> => {
      let url = baseUrl + '/group-tuitions/booking';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(body)
      }

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    cancelGroupTuition: async (tuitionId: string, cancelReason: string, cancelBy: string, userId: string): Promise<void> => {
      let url = baseUrl + '/group-tuitions/cancel';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify({
          tuitionId,
          cancelReason,
          cancelBy,
          userId
        }),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    sendBookingConfirmEmail: async (newBookingInfo: ISendBookingConfirmEmail): Promise<void> => {
      let url = baseUrl + '/tuitions/sendBookingConfirmEmail';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(newBookingInfo),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    holdSlot: async(body: IBookingGroupTuitionInput): Promise<any> => {
      let url = baseUrl + '/group-tuitions/hold-slot';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(body)
      }

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    cancelSlot: async(body: IBookingGroupTuitionInput): Promise<any> => {
      let url = baseUrl + '/group-tuitions/cancel-slot';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(body)
      }

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    }
  };
};

export default TuitionsServiceProxy;