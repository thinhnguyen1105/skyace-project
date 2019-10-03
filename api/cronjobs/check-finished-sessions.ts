import * as cron from 'node-cron';
import schedulesService from '../modules/elearning/schedules/service';
import sessionsService from '../modules/elearning/sessions/service';
import tuitionsService from '../modules/elearning/tuitions/service';
import groupTuitionsService from '../modules/elearning/group-tuitions/service';
import conversationsService from '../modules/private-message/conversations/service';
import * as fetch from 'isomorphic-fetch';

const checkFinishedSessionsJob = cron.schedule('0 1,31 * * * *', async () => {
  console.log('Checking Completed Sessions ...');

  const endedSessions = await sessionsService.findAllEndedSessions();
  const endUrlPromises = await endedSessions.map( async (val) => {
    return sessionsService.generateSessionEndRoomUrl(val._id.toString());
  });

  Promise.all(endUrlPromises).then( async (values) => {
    const fetchPromises = await values.map((value) => {
      let options = {
        method: 'POST',
        headers : {
          origin : ""
        }
      };
      return fetch(value as string, options as any);
    });
  
    Promise.all(fetchPromises).then((responses) => {
      console.log('Cronjob : ' + responses.length + ' rooms have ended successfully!');
    });
  });

  const [ , , tuitions] = await Promise.all([schedulesService.checkCompletedSchedules(), sessionsService.checkCompletedSessions(), tuitionsService.checkCompletedTuitions(), groupTuitionsService.checkCompletedGroupTuitions()]);

  await conversationsService.disableConversations(tuitions);
});

export default checkFinishedSessionsJob;
