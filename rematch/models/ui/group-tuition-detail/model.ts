import { createModel, ModelConfig } from '@rematch/core';
import { ITuitionDetailPageState, IFetchSessionListSuccess, ICancelReasonChange, IErrorHappen, ICancelTuition } from './interface';
import { message } from 'antd';
import { getTuitionsService } from '../../../../service-proxies';
import Router from 'next/router';

const groupTuitionDetailPageModel: ModelConfig<ITuitionDetailPageState> = createModel({
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
    async cancelTuition(payload: ICancelTuition, _rootState: any): Promise<void> {
      try {
        this.starting();

        const tuitionsService = getTuitionsService();
        await tuitionsService.cancelGroupTuition(payload.tuitionId, payload.cancelReason, payload.cancelBy, payload.userId);

        message.success('Cancel group tuition success', 3);
        Router.push('/my-tuition');
      } catch (error) {
        message.error(error.message, 4);
      }
    }
  },
});

export default groupTuitionDetailPageModel;