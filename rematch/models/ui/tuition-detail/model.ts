import { createModel, ModelConfig } from '@rematch/core';
import { ITuitionDetailPageState, IFetchSessionList, IFetchSessionListSuccess, ICancelReasonChange, IErrorHappen, ICancelTuition } from './interface';
import { message } from 'antd';
import { getSessionsService, getTuitionsService } from '../../../../service-proxies';
import firebase from 'firebase';
import Router from 'next/router';
import initFirebaseApp from '../../../../nextjs/helpers/init-firebase';

const tuitionDetailPageModel: ModelConfig<ITuitionDetailPageState> = createModel({
  state: {
    isBusy: false,
    cancelTuitionModalVisible: false,
    errorMessage: '',

    sessionList: [],
    cancelReason: '',
  },
  reducers: {
    starting: (state: ITuitionDetailPageState): ITuitionDetailPageState => {
      return {
        ...state,
        isBusy: true
      };
    },
    openCancelTuitionModal: (state: ITuitionDetailPageState): ITuitionDetailPageState => {
      return {
        ...state,
        cancelTuitionModalVisible: true
      };
    },
    closeCancelTuitionModal: (state: ITuitionDetailPageState): ITuitionDetailPageState => {
      return {
        ...state,
        cancelTuitionModalVisible: false,
        errorMessage: '',
        cancelReason: '',
      };
    },
    fetchSessionListSuccess: (state: ITuitionDetailPageState, payload: IFetchSessionListSuccess): ITuitionDetailPageState => {
      return {
        ...state,
        isBusy: false,
        sessionList: payload.sessionList,
      };
    },
    cancelReasonChange: (state: ITuitionDetailPageState, payload: ICancelReasonChange): ITuitionDetailPageState => {
      return {
        ...state,
        cancelReason: payload.cancelReason,
      };
    },
    errorHappen: (state: ITuitionDetailPageState, payload: IErrorHappen): ITuitionDetailPageState => {
      return {
        ...state,
        errorMessage: payload.errorMessage,
      };
    }
  },
  effects: {
    async fetchSessionList(payload: IFetchSessionList, _rootState: any): Promise<void> {
      try {
        this.starting();

        const sessionsService = getSessionsService();
        const result = await sessionsService.findByTuitionId(payload.tuitionId);

        this.fetchSessionListSuccess({sessionList: result.data});
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async cancelTuition(payload: ICancelTuition, rootState: any): Promise<void> {
      try {
        this.starting();

        const tuitionsService = getTuitionsService();
        const result = await tuitionsService.putToPendingTuition(payload.tuitionId, payload.cancelReason, payload.cancelBy, payload.userId);

        if (!firebase.apps.length) {
          initFirebaseApp();
        }
        for (let item of result.disabledConversations) {
          firebase.database().ref(`skyace-notification/${rootState.profileModel._id}/${item}`).remove();
        }

        message.success('Tuition has been submitted to admin to review', 3);
        Router.push('/my-tuition');
      } catch (error) {
        message.error(error.message, 4);
      }
    }
  },
});

export default tuitionDetailPageModel;