import * as cron from 'node-cron';
// import schedulesService from '../modules/elearning/schedules/service';
import sessionsService from '../modules/elearning/sessions/service';
import tuitionsService from '../modules/elearning/tuitions/service';
// import groupTuitionsService from '../modules/elearning/group-tuitions/service';
// import conversationsService from '../modules/private-message/conversations/service';
// import * as fetch from 'isomorphic-fetch';

// const checkFinishedSessionsJob = cron.schedule('0 1,31 * * * *', async () => {
const checkOutdatePaymentJob = cron.schedule('0 0 */2 * * *', async () => {
  console.log('Checking Timeout Partial Payments ...');

  // Find all unpaid partial sessions
  const unpaidSessions = await sessionsService.findOverdueUnpaidSession();
  // Cancel the tuition if meets requirement ( With email & sms notification)
  const unpaidTuitions = unpaidSessions.reduce((result , val) => {
    if (result.indexOf(String(val.tuition)) >= 0) {
      return result;
    } else {
      return [...result, String(val.tuition)];
    }
  }, []);
  const cancelTuitionPromises = unpaidTuitions.map((val) => {
    return tuitionsService.cancelTuitionDueToOverduePayment(val)
  });
  await Promise.all(cancelTuitionPromises);
  // Update sessions to completed
  const updateToCompletedPromises = unpaidSessions.map((val) => {
    return sessionsService.updateSessionToCompleted(val._id);
  })
  await Promise.all(updateToCompletedPromises);
  
  // Find all near date sessions
  const nearDateSessions = await sessionsService.findNearDateSession();
  const nearDateTuitions = nearDateSessions.reduce((result , val) => {
    if (result.indexOf(String(val.tuition)) >= 0) {
      return result;
    } else {
      return [...result, String(val.tuition)];
    }
  }, []);

  // Send notification email
  const notifyEmailPromises = nearDateTuitions.map((val) => {
    return tuitionsService.notifyPayment(val);
  })
  await Promise.all(notifyEmailPromises);

  // Update sessions to notified
  const updateToNotifiedPromises = nearDateSessions.map((val) => {
    return sessionsService.updateSessionToNotified(val._id);
  })
  await Promise.all(updateToNotifiedPromises);
});

export default checkOutdatePaymentJob;
