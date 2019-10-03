import { createModel, ModelConfig } from '@rematch/core';
import { message } from 'antd';
import { getDashboardService } from "../../../../service-proxies";
import { 
  IDashboardState,
  IFetchDashboardDataSuccessPayload
} from './interface';
const dashboardModel: ModelConfig<IDashboardState> = createModel({
    state: {
      newStudent: 0,
      newTutor: 0,
      newTransaction: 0,
      upcomingTuitions: [],
      canceledTuitions: [],
      reportIssuesTuitions: []
    },
    reducers: {
      fetchDashboardDataSuccess: (state: IDashboardState, payload: IFetchDashboardDataSuccessPayload): IDashboardState => {
        return {
          ...state,
          ...payload
        }
      }
    },
    effects: {
      async fetchDashboardData() : Promise<void> {
        try {
          const results = await getDashboardService().getDashboardData();
          this.fetchDashboardDataSuccess({
            newTutor : results.tutor || 0,
            newStudent: results.student || 0,
            newTransaction : results.transaction || 0,
            upcomingTuitions: results.upcomingTuitions || [],
            canceledTuitions: results.canceledTuitions || [],
            reportIssuesTuitions: results.reportIssuesTuitions || []
          });
        } catch (error) {
          message.error(error.message, 4);
        }
      }
    }
});

export default dashboardModel;