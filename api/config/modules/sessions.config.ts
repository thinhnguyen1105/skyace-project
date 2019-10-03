const sessionsModuleConfig = {
  maximumDelayEndTime : 30 * 60 * 1000, // 30 mins
  maximumCronTime : 6 * 60 * 60 * 1000, // 6 hours
  maximumRecordingTime : 7 * 24 * 60 * 60 * 1000, // 7 days,
  maximumPaymentTime: 1 * 24 * 60 * 60 * 1000, // 1 days
  maximumNotifyPaymentTime: 3 * 24 * 60 * 60 * 1000,// 3 days
};

export default sessionsModuleConfig;