import { IFindSchedulesResult, ICreateScheduleInput, IFindScheduleDetail, IUpdateScheduleInput, IRescheduleInput, ICheckMultipleBookingsResult } from "../api/modules/elearning/schedules/interface";
import { ISendConfirmEmail } from "../rematch/models/ui/session-detail-page/interface";
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

const TutorSchedulesServiceProxy = (baseUrl = '', token) => {
  return {
    find: async (
      start: Date,
      end: Date,
      tutorId: string,
    ): Promise<IFindSchedulesResult> => {
      let url = baseUrl + '/schedules/find?';
      if (start !== undefined) {
        url += 'start=' + encodeURIComponent('' + start) + '&';
      }
      if (end !== undefined) {
        url += 'end=' + encodeURIComponent('' + end) + '&';
      }
      if (tutorId !== undefined) {
        url += 'tutorId=' + encodeURIComponent('' + tutorId) + '&';
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
        processResponse<IFindSchedulesResult>(response)
      );
    },
    findByUserId: async (
      start: Date,
      end: Date,
      userId: string,
    ): Promise<IFindSchedulesResult> => {
      let url = baseUrl + '/schedules/findByUserId?';
      if (start !== undefined) {
        url += 'start=' + encodeURIComponent('' + start) + '&';
      }
      if (end !== undefined) {
        url += 'end=' + encodeURIComponent('' + end) + '&';
      }
      if (userId !== undefined) {
        url += 'userId=' + encodeURIComponent('' + userId) + '&';
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
        processResponse<IFindSchedulesResult>(response)
      );
    },

    trialScheduleByUserId: async (
      userId: string,
    ): Promise<IFindSchedulesResult> => {
      let url = baseUrl + '/schedules/trialScheduleByUserId?';
      if (userId !== undefined) {
        url += 'userId=' + encodeURIComponent('' + userId) + '&';
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
        processResponse<IFindSchedulesResult>(response)
      );
    },
    create: async (createScheduleInput: ICreateScheduleInput): Promise<IFindScheduleDetail> => {
      let url = baseUrl + '/schedules/create';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(createScheduleInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindScheduleDetail>(response)
      );
    },
    createStudentBookings: async (createStudentBookingInput: { newBookings: ICreateScheduleInput[] }): Promise<IFindSchedulesResult> => {
      let url = baseUrl + '/schedules/createStudentBookings';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(createStudentBookingInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindSchedulesResult>(response)
      );
    },
    createMultipleSchedules: async (createMultipleSchedulesInput: { scheduleList: ICreateScheduleInput[] }): Promise<IFindSchedulesResult> => {
      let url = baseUrl + '/schedules/createMultipleSchedules';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(createMultipleSchedulesInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<IFindSchedulesResult>(response)
      );
    },
    updatePaymentSuccess: async (updateMultipleSchedules: string[]): Promise<void> => {
      let url = baseUrl + '/schedules/updateMultipleSchedules';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(updateMultipleSchedules)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    checkMultilpleBookings: async (checkStudentBookingsInput: { newSchedules: ICreateScheduleInput[] }): Promise<ICheckMultipleBookingsResult> => {
      let url = baseUrl + '/schedules/checkMultilpleBookings';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(checkStudentBookingsInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<ICheckMultipleBookingsResult>(response)
      );
    },
    update: async (updateScheduleInput: IUpdateScheduleInput): Promise<void> => {
      let url = baseUrl + '/schedules/update';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(updateScheduleInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    delete: async (deleteSchedule: IFindScheduleDetail): Promise<void> => {
      let url = baseUrl + '/schedules/delete';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(deleteSchedule),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    reschedule: async (rescheduleInput: IRescheduleInput): Promise<void> => {
      let url = baseUrl + '/schedules/reschedule';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(rescheduleInput),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    deleteMany: async (schedulesId: Array<string>): Promise<void> => {
      let url = baseUrl + '/schedules/deleteMany';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(schedulesId)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    sendConfirmEmail: async (sendConfirmEmailInput: ISendConfirmEmail): Promise<void> => {
      let url = baseUrl + '/schedules/sendRescheduleConfirmEmail';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(sendConfirmEmailInput)
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    checkCompletedSchedules: async (): Promise<void> => {
      let url = baseUrl + '/schedules/checkCompletedSchedules';
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
    deleteRepeatSchedules: async (baseSchedule: IFindScheduleDetail): Promise<any> => {
      let url = baseUrl + '/schedules/deleteRepeatSchedules';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(baseSchedule),
      };

      return fetch(url, options as any).then((response: Response) =>
        processResponse<void>(response)
      );
    },
    checkSessionInsideTutorSchedules: async (body: any): Promise<any> => {
      let url = baseUrl + '/schedules/checkSessionInsideTutorSchedules';
      url = url.replace(/[?&]$/, '');

      let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? token : '',
        },
        body: JSON.stringify(body)
      };

      return fetch(url , options as any).then((response: Response) => 
        processResponse<any>(response)
      );
    }
  };
};

export default TutorSchedulesServiceProxy;
