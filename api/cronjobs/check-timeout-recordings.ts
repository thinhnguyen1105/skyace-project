import * as cron from 'node-cron';
import sessionsService from '../modules/elearning/sessions/service';
import * as fetch from 'isomorphic-fetch';
import * as convertXML from "xml-js";

const checkTimeoutRecordings = cron.schedule('0 0 0 * * *', async () => {
  console.log('Checking Overdue Recordings ...');

  const overtimeRecordingSessions = await sessionsService.findOvertimeRecordingSessions();
  const getRecordingsPromise = await overtimeRecordingSessions.map( async (val) => {
    return sessionsService.generateSessionRecordings(val._id.toString());
  });

  const recordingUrls = await Promise.all(getRecordingsPromise);
  const recordingsPromise = recordingUrls.map((val) => {
    let options = {
      method: 'GET',
      headers: {
        origin: ""
      }
    }
    return fetch(val as string, options as any).then((res) => res.text());
  });
  const recordings = await Promise.all(recordingsPromise);
  let recordingIDs = recordings.map((recording) => {
    let recordingsResult = JSON.parse(convertXML.xml2json(recording as any, {
      compact: true,
      spaces: 2
    }));
    if (recordingsResult.response.returncode._text === 'SUCCESS') {
      if (recordingsResult.response.recordings && recordingsResult.response.recordings.recording) {
        if (recordingsResult.response.recordings.recording.length) {
          return recordingsResult.response.recordings.recording.map((val) => val.recordID._text);
        } else {
          return [recordingsResult.response.recordings.recording.recordID._text];
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  });
  recordingIDs = recordingIDs.filter((val: string) => val);
  recordingIDs = [].concat.apply([], recordingIDs);
  const generateDeleteRecordingPromises = recordingIDs.map((val) => {
    return sessionsService.generateDeleteRecordingUrl(val);
  })

  const deleteRecordingUrls = await Promise.all(generateDeleteRecordingPromises);
  const callAPIPromises = deleteRecordingUrls.map((val) => {
    let options = {
      method: 'DELETE',
      headers: {
        origin: ""
      }
    }
    return fetch(val as string, options as any).then((res) => res.text());
  })

  await Promise.all(callAPIPromises);
});

export default checkTimeoutRecordings;
