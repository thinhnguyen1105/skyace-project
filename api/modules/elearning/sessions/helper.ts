import * as sha1 from 'js-sha1';
import * as uuid from 'uuid';
import config from '../../../config/bigbluebutton.config';

function generateChecksum(param: string) {
  param = param.replace('?', '');
  return sha1(param + config.bigbluebutton.serverKey).toLowerCase();
}

function generateHash() {
  return uuid.v4();
}

function generateCreateRoomUrl(name: string, id: string) {
  name = name.replace(/\s/g, '%20');
  const params = `create?name=${name}&meetingID=${id}&attendeePW=${config.bigbluebutton.attendeeDefaultPassword}&moderatorPW=${config.bigbluebutton.moderatorDefaultPassword}&record=true&autoStartRecording=true&allowStartStopRecording=true&hash=${generateHash()}`;
  return `${config.bigbluebutton.proxyServer}${config.bigbluebutton.serverAPIUrl}${params}&checksum=${generateChecksum(params)}`;
}

function generateCheckRoomUrl(id: string) {
  const params = `isMeetingRunning?meetingID=${id}&hash=${generateHash()}`;
  return `${config.bigbluebutton.proxyServer}${config.bigbluebutton.serverAPIUrl}${params}&checksum=${generateChecksum(params)}`;
}

function generateJoinRoomUrl(id: string, username: string, role: string) {
  username = username.replace(/\s/g, '%20');
  const params = `join?fullName=${username}&meetingID=${id}&password=${role === 'tutor' ? config.bigbluebutton.moderatorDefaultPassword : config.bigbluebutton.attendeeDefaultPassword}&joinViaHTML5=true&redirect=true&hash=${generateHash()}`;
  return `${config.bigbluebutton.serverAPIUrl}${params}&checksum=${generateChecksum(params)}`;
}

function generateEndRoomUrl (id: string) {
  const params = `end?meetingID=${id}&password=${config.bigbluebutton.moderatorDefaultPassword}&hash=${generateHash()}`;
  return `${config.bigbluebutton.proxyServer}${config.bigbluebutton.serverAPIUrl}${params}&checksum=${generateChecksum(params)}`;
}

function generateRecordingUrl (id: string){
  const params = `getRecordings?meetingID=${id}&hash=${generateHash()}`;
  return `${config.bigbluebutton.proxyServer}${config.bigbluebutton.serverAPIUrl}${params}&checksum=${generateChecksum(params)}`;
}

function generateDeleteRecordingUrl (id: string) {
  const params = `deleteRecordings?recordID=${id}&hash=${generateHash()}`
  return `${config.bigbluebutton.proxyServer}${config.bigbluebutton.serverAPIUrl}${params}&checksum=${generateChecksum(params)}`;
}

export default {
  generateCheckRoomUrl,
  generateCreateRoomUrl,
  generateJoinRoomUrl,
  generateEndRoomUrl,
  generateRecordingUrl,
  generateDeleteRecordingUrl
};