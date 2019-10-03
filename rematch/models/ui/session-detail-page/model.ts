import { createModel, ModelConfig } from '@rematch/core';
import { getSessionsService, getTutorSchedulesService } from '../../../../service-proxies';
import { message, Modal } from 'antd';
import { extendMoment } from 'moment-range';
import moment from 'moment';
import * as convertXML from "xml-js";
const extendedMoment = extendMoment(moment);
import { ISessionDetailPageState, IUploadMaterialsSuccess, IErrorHappen, IFetchMediaUrl, ICreateReschedule, ISaveReschedule, IFetchSessionInfoSuccess, ISendConfirmEmail, IFetchSessionInfo, IDeleteMaterialPayload, ILoadSchedulesPayload } from './interface';
import { ILoadTutorSchedulesSuccess } from '../information-tutor-page/interface';

const inputDateInUserTimezone = (date: any = new Date().toString() , timeZone) => {
  const browserTimezone = - new Date().getTimezoneOffset() / 60;
  const deltaTimezone = timeZone - browserTimezone;

  return new Date(new Date(date).getTime() + deltaTimezone * 60 * 60 * 1000);
}

const sessionDetailPageModel: ModelConfig<ISessionDetailPageState> = createModel({
  state: {
    isBusy: false,
    isUploading: false,
    uploadMaterialModalVisible: false,
    rescheduleModalVisible: false,
    tutorSchedules: [],
    reschedule: {},

    sessionUrls: {},
    materialsInfo: [],
    errorMessage: '',
    sessionInfo: {},
    isOpenModalRepportIssue: false,
    reportTutor: false,
    reasonReport: [],
    commentReport: '',
    isOpenModalRateSession: false,
    rateSession: undefined,
    commentWithRate: '',
    reportStudent: false,
    recordings: []
  },
  reducers: {
    starting: (state: ISessionDetailPageState): ISessionDetailPageState => {
      return {
        ...state,
        isBusy: true,
      };
    },
    openUploadMaterialModal: (state: ISessionDetailPageState): ISessionDetailPageState => {
      return {
        ...state,
        uploadMaterialModalVisible: true,
      };
    },
    closeUploadMaterialModal: (state: ISessionDetailPageState): ISessionDetailPageState => {
      return {
        ...state,
        uploadMaterialModalVisible: false,
        errorMessage: '',
      };
    },
    closeRescheduleModal: (state: ISessionDetailPageState): ISessionDetailPageState => {
      return {
        ...state,
        rescheduleModalVisible: false,
        reschedule: {},
      };
    },
    generateUrlsSuccess: (state: ISessionDetailPageState, payload: IFetchMediaUrl): ISessionDetailPageState => {
      return {
        ...state,
        sessionUrls: payload
      };
    },
    uploadMaterialsSuccess: (state: ISessionDetailPageState, payload: IUploadMaterialsSuccess): ISessionDetailPageState => {
      return {
        ...state,
        materialsInfo: payload.newMaterialsInfo,
        uploadMaterialModalVisible: false,
        errorMessage: '',
        isUploading: false,
      };
    },
    errorHappen: (state: ISessionDetailPageState, payload: IErrorHappen): ISessionDetailPageState => {
      return {
        ...state,
        errorMessage: payload.errorMessage,
      };
    },
    startUploading: (state: ISessionDetailPageState): ISessionDetailPageState => {
      return {
        ...state,
        isUploading: true,
      };
    },
    loadTutorSchedulesSuccess: (state: ISessionDetailPageState, payload: ILoadTutorSchedulesSuccess): ISessionDetailPageState => {
      return {
        ...state,
        tutorSchedules: payload.result.data,
        isBusy: false,
        rescheduleModalVisible: true,
      };
    },
    createReschedule: (state: ISessionDetailPageState, payload: ICreateReschedule): ISessionDetailPageState => {
      return {
        ...state,
        reschedule: payload.reschedule,
      };
    },
    saveRescheduleSuccess: (state: ISessionDetailPageState, payload: ISaveReschedule): ISessionDetailPageState => {
      return {
        ...state,
        isBusy: false,
        rescheduleModalVisible: false,
        sessionInfo: {
          ...state.sessionInfo,
          ...payload.newSessionInfo
        },
        reschedule: {},
        tutorSchedules: state.tutorSchedules.map((item) => {
          if (new Date(item.start).getTime() === new Date(payload.newScheduleInfo.oldStart).getTime() && item.owner === payload.newScheduleInfo.owner) {
            return {
              ...item,
              start: new Date(payload.newScheduleInfo.start),
              end: new Date(payload.newScheduleInfo.end),
            };
          } else {
            return item;
          }
        }),
      };
    },
    fetchSessionInfoSuccess: (state: ISessionDetailPageState, payload: IFetchSessionInfoSuccess): ISessionDetailPageState => {
      return {
        ...state,
        sessionInfo: payload.sessionInfo,
      };
    },
    openModalRepportIssue: (state: ISessionDetailPageState): ISessionDetailPageState => {
      return {
        ...state,
        isOpenModalRepportIssue: true
      };
    },
    closeModalRepportIssue: (state: ISessionDetailPageState): ISessionDetailPageState => {
      return {
        ...state,
        isOpenModalRepportIssue: false,
        reportTutor: false,
        reportStudent: false,
        reasonReport: [],
        commentReport: '',

      };
    },
    openModalRateSession: (state: ISessionDetailPageState): ISessionDetailPageState => {
      return {
        ...state,
        isOpenModalRateSession: true,
      };
    },
    closeModalRateSession: (state: ISessionDetailPageState): ISessionDetailPageState => {
      return {
        ...state,
        isOpenModalRateSession: false,
        rateSession: undefined,
        commentWithRate: '',
      };
    },
    updataRateSession: (state: ISessionDetailPageState, payload: Number): ISessionDetailPageState => {
      return {
        ...state,
        rateSession: payload,
      };
    },
    reportInfoChange: (state: ISessionDetailPageState, payload: any): ISessionDetailPageState => {
      return {
        ...state,
        ...payload
      };
    },
    deleteMaterialSuccess: (state: ISessionDetailPageState, payload: IDeleteMaterialPayload): ISessionDetailPageState => {
      return {
        ...state,
        materialsInfo: state.materialsInfo.filter((item) => item._id !== payload.materialId),
      };
    },
    fetchRecordingsSuccess: (state: ISessionDetailPageState, payload: any): ISessionDetailPageState => {
      return {
        ...state,
        recordings: payload
      }
    }
  },
  effects: {
    async generateUrl(
      payload: any,
      _rootState: any
    ): Promise<void> {
      try {
        const sessionsService = getSessionsService();
        const sessionUrls = await sessionsService.generateUrl(payload._id, payload.name, payload.role);

        this.generateUrlsSuccess(sessionUrls);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async loadSchedules(payload: ILoadSchedulesPayload, _rootState: any): Promise<void> {
      try {
        this.starting();

        const tutorSchedulesService = getTutorSchedulesService();
        const tutorSchedulesPromise = tutorSchedulesService.find(payload.start, payload.end, payload.tutorId);
        const studentSchedulesPromise = tutorSchedulesService.findByUserId(payload.start, payload.end, payload.studentId);

        const [tutorSchedules, studentSchedules] = await Promise.all([tutorSchedulesPromise, studentSchedulesPromise]);

        this.loadTutorSchedulesSuccess({
          result: {
            data: [...tutorSchedules.data.filter((item) => item.owner.toString() !== payload.studentId), ...studentSchedules.data]
          }
        });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async saveReschedule(payload: ISaveReschedule, _rootState: any): Promise<void> {
      try {
        this.starting();

        // Update Schedule + Session
        const tutorSchedulesService = getTutorSchedulesService();
        const sessionsService = getSessionsService();

        await Promise.all([tutorSchedulesService.reschedule(payload.newScheduleInfo as any), sessionsService.updateSession(payload.newSessionInfo as any)]);
        Modal.success({
          title : '',
          content: `You have opted to reschedule your lesson with ${payload.role === 'student' ? payload.tutor : payload.student} from ${extendedMoment(inputDateInUserTimezone(payload.newScheduleInfo.oldStart, payload.timeZone)).format('HH:mm, DD MMM YYYY')} to ${extendedMoment(inputDateInUserTimezone(payload.newScheduleInfo.start, payload.timeZone)).format('HH:mm, DD MMM YYYY')}. You will receive a confirmation email shortly, please check your inbox and let us know if you did not receive the email.`
        })

        this.saveRescheduleSuccess(payload);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async sendConfirmEmail(payload: ISendConfirmEmail, _rootState: any): Promise<void> {
      try {
        this.starting();

        const tutorSchedulesService = getTutorSchedulesService();
        await tutorSchedulesService.sendConfirmEmail(payload);
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async fetchSessionInfo(payload: IFetchSessionInfo, _rootState: any): Promise<void> {
      try {
        this.starting();

        const sessionsService = getSessionsService();
        const sessionInfo = await sessionsService.findBySessionId(payload.sessionId);

        this.fetchSessionInfoSuccess({ sessionInfo });
        this.uploadMaterialsSuccess({ newMaterialsInfo: sessionInfo.materials });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async fetchRecordings(payload: string, _rootState: any): Promise<void> {
      try {
        this.starting();

        const sessionsService = getSessionsService();
        const url = await sessionsService.generateRecordingsUrl(payload) as any;
        if (url.result) {
          let recordingsResult = await sessionsService.getRecordings(url.result);
          recordingsResult = JSON.parse(convertXML.xml2json(recordingsResult as any, {
            compact: true,
            spaces: 2
          }));
          if (recordingsResult.response.returncode._text === 'SUCCESS') {
            if (recordingsResult.response.recordings && recordingsResult.response.recordings.recording) {
              if (recordingsResult.response.recordings.recording.length) {
                const recordings = recordingsResult.response.recordings.recording.filter((val) => {
                  return val.playback && val.playback.format && val.playback.format.url && val.playback.format.url._text
                }).map((val) => val.playback.format.url._text);
                this.fetchRecordingsSuccess(recordings);
              } else {
                const recording = recordingsResult.response.recordings.recording;
                if (recording && recording.playback && recording.playback.format && recording.playback.format.url && recording.playback.format.url._text) {
                  this.fetchRecordingsSuccess([recording.playback.format.url._text]);
                }
              }
            }
          } else {

          }
        } else {

        }
      } catch (error) {
        message.error(error.message , 4);
      }
    },
    async deleteMaterial(payload: IDeleteMaterialPayload, _rootState: any): Promise<void>  {
      try {
        this.starting();

        const sessionsService = getSessionsService();
        await sessionsService.deleteMaterial(payload);

        this.deleteMaterialSuccess(payload);
      } catch (error) {
        message.error(error.message, 4);
      }
    }
  },
});

export default sessionDetailPageModel;