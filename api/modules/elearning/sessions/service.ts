import * as Joi from 'joi';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as sessionsRepository from './repository';
import helper from './helper';
import { IFindSessionsQuery, IFindSessionsResult, ICreateSessionsInput, IUpdateSessionInput, IFindSessionDetail, IUploadMaterialInput, IUploadMaterialResult, IGetSessionRoomURL, IUploadReportIssueInput, IUploadRateSessionInput, IDeleteMaterialInput } from './interface';
import * as usersRepository from '../../auth/users/repository';
import logger from '../../../../api/core/logger/log4js';

const findSessionsByTuitionId = async (tenantId: string, query: IFindSessionsQuery): Promise<IFindSessionsResult> => {
  if (!query.tuitionId) {
    throw new Error('Tuition ID cannot be empty');
  }
  return await sessionsRepository.findByTuitionId(tenantId, query);
};

const findBySessionId = async (tenantId: string, sessionId: string): Promise<IFindSessionDetail> => {
  if (!sessionId) {
    throw new Error('Session ID cannot be empty');
  }
  return await sessionsRepository.findBySessionId(tenantId, sessionId);
};

const createSessions = async (tenantId: string, body: ICreateSessionsInput): Promise<IFindSessionsResult> => {
  if (!body.sessionList) {
    throw new Error('Sessions list cannot be empty');
  }
  return await sessionsRepository.createSessions(tenantId, body);
};

const updateSessions = async (tenantId: string, body: any) : Promise<IFindSessionsResult> => {
  if (!body.sessionList) {
    throw new Error('Sessions list cannot be empty');
  }
  return await sessionsRepository.updateSessions(tenantId, body);
};

const updateSession = async (tenantId: string, body: IUpdateSessionInput): Promise<void> => {
  // validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    course: Joi.string(),
    courseForTutor: Joi.string(),
    tuition: Joi.string(),
    tutor: Joi.string(),
    student: Joi.string(),
    start: Joi.date(),
    end: Joi.date(),
    materials: Joi.object(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  return await sessionsRepository.updateSession(tenantId, {
    ...body,
    isRescheduled: true
  });
};
const deleteManySessions = async (tenantId: string, sessionsId: Array<string>) => {
  if (!sessionsId) {
    throw new Error('Schedules ID cannot be empty.');
  }

  await sessionsRepository.deleteSessions(tenantId, sessionsId);
};

const generateSessionRoomURL = async (tenantId: string, _id: string, username: string, role: string): Promise<IGetSessionRoomURL> => {
  // Check Session ID
  if (!_id) {
    throw new Error('Session ID is empty.');
  }

  // Check if session existed
  const existedSession = await sessionsRepository.findBySessionId(tenantId, _id);
  if (!existedSession) {
    throw new Error('No session matched criteria!');
  } else {
    if (existedSession.isCompleted) {
      throw new Error('This session is outdated!');
    }
    var startTime = Math.abs(new Date(existedSession.start).getTime() - 30 * 60 * 1000);
    var endTime = Math.abs(new Date(existedSession.end).getTime() + 30 * 60 * 1000);
    if (Date.now() <= endTime && Date.now() >= startTime) {
      const name = existedSession.groupTuition && Object.keys(existedSession.groupTuition).length ? `${existedSession.groupTuition.course.subject} - ${existedSession.tutor.fullName}` : `${existedSession.course.subject} - ${existedSession.tutor.fullName}`;
      const urls = {
        check: helper.generateCheckRoomUrl(_id),
        create: helper.generateCreateRoomUrl(name, _id),
        join: helper.generateJoinRoomUrl(_id, username, role)
      };
      return urls;
    } else {
      throw new Error("Not the time for this session!");
    }
  }
};

const generateSessionEndRoomUrl = async (_id: string): Promise<any> => {
  if (!_id) {
    throw new Error('Session ID is empty.');
  } else {
    return helper.generateEndRoomUrl(_id);
  }
};

const generateDeleteRecordingUrl = async (_id: string): Promise<any> => {
  if (!_id) {
    throw new Error('Session ID is empty');
  } else {
    return helper.generateDeleteRecordingUrl(_id);
  }
}

const generateSessionRecordings = async (_id: string): Promise<any> => {
  if (!_id) {
    throw new Error('Session ID is empty.');
  } else {
    return helper.generateRecordingUrl(_id);
  }
}
const updateReportIssues = async (tenantId: string, sessionId: string, body: IUploadReportIssueInput): Promise<void> => {
  if (!sessionId) {
    throw new Error('Session ID cannot be empty.');
  }
  if (!body.reportInfo) {
    throw new Error('Report info cannot be empty.');
  }
  await sessionsRepository.updateReportIssue(tenantId, sessionId, body);
};

const updateRateSession = async (tenantId: string, sessionId: string, body: IUploadRateSessionInput): Promise<void> => {
  if (!sessionId) {
    throw new Error('Session ID cannot be empty.');
  }
  if (!body.rateSession) {
    throw new Error('Report info cannot be empty.');
  }
  const session = await sessionsRepository.updateRateSession(tenantId, sessionId, body);
  const rating = await calculateTutorRating(session.tutor);
  const mainUser = await usersRepository.updateRating(tenantId, session.tutor, rating) as any;
  // update rating for fake users ( group tuition );
  const promises = mainUser.groupTuitionFakeUsers ? mainUser.groupTuitionFakeUsers.map(val => {
    return usersRepository.updateRating(tenantId, val, rating);
  }) : [];
  await Promise.all(promises);
};

const updateSessionMaterials = async (tenantId: string, sessionId: string, body: IUploadMaterialInput): Promise<IUploadMaterialResult> => {
  if (!sessionId) {
    throw new Error('Session ID cannot be empty.');
  }
  if (!body.materialsInfo) {
    throw new Error('Materials info cannot be empty.');
  }

  return await sessionsRepository.updateSessionMaterials(tenantId, sessionId, body);
};

const checkFileExist = async (tenantId: string, sessionId: string, fileId: string): Promise<string> => {
  if (!sessionId) {
    throw new Error('Session ID cannot be empty.');
  }
  if (!sessionId) {
    throw new Error('File ID cannot be empty.');
  }

  const existedSession = await sessionsRepository.findBySessionId(tenantId, sessionId);
  if (!existedSession) {
    throw new Error('Session not found.');
  }

  const fileInfo = existedSession.materials.filter((item: any) => String(item._id) === fileId)[0];
  if (!fileInfo) {
    throw new Error('File not found.');
  }
  try {
    const fsAccessPromise = util.promisify(fs.access);
    await fsAccessPromise(fileInfo.downloadUrl);
  } catch (error) {
    throw new Error('File not found.');
  }

  return fileInfo.downloadUrl;
};

const deleteMaterial = async (tenantId: string, body: IDeleteMaterialInput): Promise<void> => {
  // validate body
  const validationRule = Joi.object().keys({
    sessionId: Joi.string().required(),
    materialId: Joi.string().required(),
    fileName: Joi.string().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Remove record from db
  await sessionsRepository.deleteMaterial(tenantId, body);

  // Remove file from upload folder
  fs.unlink(path.join(__dirname, `../../../../../../materials-uploaded/${body.sessionId}/${body.fileName}`), (error) => {
    if (error) {
      logger.error(error.message);
    }
  });
};

const findAllEndedSessions = async (): Promise<any> => {
  try {
    const results = await sessionsRepository.findAllEndedSession();
    return results;
  } catch (err) {
    throw new Error(err.message);
  }
};

const findOvertimeRecordingSessions = async (): Promise<any> => {
  try {
    const results = await sessionsRepository.findOvertimeRecordingSessions();
    return results;
  } catch (err) {
    throw new Error(err.message);
  }
};

const checkCompletedSessions = async (): Promise<void> => {
  await sessionsRepository.updateCompletedSessions();
};

const findUpcomingTuitions = async (tenantId: string, tutor: string): Promise<any> => {
  return await sessionsRepository.findUpcomingTuitions(tenantId, tutor);
};

const findUpcomingTuitionsOfTenant = async (tenantId: string): Promise<any> => {
  return await sessionsRepository.findUpcomingTuitionsOfTenant(tenantId);
};

const calculateTutorRating = async (tutor: string): Promise<any> => {
  try {
    const ratings = await sessionsRepository.getTutorRatings(tutor);
    const flattenArray = [].concat.apply([], ratings.map(val => val.rateSession));
    return flattenArray.length > 0 ? Number((Math.round((flattenArray.reduce((sum , val: any) => {
      return sum += (val && val.rateSession) ? val.rateSession : 0;
    } , 0) / flattenArray.length) * 2) / 2).toFixed(1)) : 0;
  } catch (error) {
    throw new Error(error.message);
  }
}

const findOverdueUnpaidSession = async (): Promise<any> => {
  return await sessionsRepository.findOverdueUnpaidSession();
}

const findNearDateSession = async () : Promise<any> => {
  return await sessionsRepository.findNearDateSession();
}

const updateSessionToCompleted = async (_id: string): Promise<any> => {
  return await sessionsRepository.updateSessionToCompleted(_id);
}

const updateSessionToNotified = async (_id: string): Promise<any> => {
  return await sessionsRepository.updateSessionToNotified(_id);
}

export default {
  findSessionsByTuitionId,
  createSessions,
  updateSession,
  findBySessionId,
  generateSessionRoomURL,
  generateSessionEndRoomUrl,
  updateSessionMaterials,
  checkFileExist,
  deleteManySessions,
  checkCompletedSessions,
  findAllEndedSessions,
  findUpcomingTuitions,
  updateReportIssues,
  updateRateSession,
  calculateTutorRating,
  deleteMaterial,
  findUpcomingTuitionsOfTenant,
  generateSessionRecordings,
  findOvertimeRecordingSessions,
  generateDeleteRecordingUrl,
  findOverdueUnpaidSession,
  findNearDateSession,
  updateSessionToCompleted,
  updateSessionToNotified,
  updateSessions,
};
