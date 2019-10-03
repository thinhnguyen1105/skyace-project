export interface IDashboardState {
  newStudent: number;
  newTutor: number;
  newTransaction: number;
  upcomingTuitions: any;
  canceledTuitions : any;
  reportIssuesTuitions: any;
}

export interface IFetchDashboardDataSuccessPayload {
  newStudent?: number;
  newTutor?: number;
  newTransaction?: number;
  upcomingTuitions?: any;
  canceledTuitions?: any;
  reportIssuesTuitions?: any;
}