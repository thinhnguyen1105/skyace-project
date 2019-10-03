import { createModel, ModelConfig } from '@rematch/core';
import { IStudentCalendarPageState, IGetStudentTuitionsPayload, IGetStudentTuitionsSuccessPayload } from './interface';
import { message } from 'antd';
import { getTuitionsService } from '../../../../service-proxies';

const studentCalendarPageModel: ModelConfig<IStudentCalendarPageState> = createModel({
  state: {
    isBusy: false,
    tuitionList: [],
  },
  reducers: {
    starting: (state: IStudentCalendarPageState): IStudentCalendarPageState => {
      return {
        ...state,
        isBusy: true,
      };
    },
    getStudentTuitionsSuccess: (state: IStudentCalendarPageState, payload: IGetStudentTuitionsSuccessPayload): IStudentCalendarPageState => {
      return {
        ...state,
        isBusy: false,
        tuitionList: payload.tuitionList,
      };
    },
  },
  effects: {
    async getStudentTuitions(payload: IGetStudentTuitionsPayload, _rootState: any): Promise<void> {
      try {
        this.starting();

        const tuitionsService = getTuitionsService();
        const tuitionList = await tuitionsService.findAllTuitionsByStudentId(payload.studentId, payload.isCompleted, payload.isCanceled);

        this.getStudentTuitionsSuccess({tuitionList: tuitionList.data});
      } catch (error) {
        message.error(error.message, 4);
      }
    },
  }
});

export default studentCalendarPageModel;