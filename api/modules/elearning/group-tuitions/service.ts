import * as Joi from 'joi';
import * as groupTuitionsRepository from './repository';
import { IFindGroupTuitionsResult, IFindGroupTuitionsByUserIdQuery, IFindGroupTuitionDetail, ICreateGroupTuitionInput, IUpdateGroupTuitionInput, IDeleteGroupTuitionInput, IBookingGroupTuitionInput, ICancelTuition } from './interface';
import notificationQueue from '../../../notification-job-queue';
import notificationSettingsService from '../../host/notification-settings/service';
import * as moment from 'moment';

const inputDateInUserTimezone = (date: any = new Date().toString(), userOffset) => {
  const serverTimezone = - new Date().getTimezoneOffset() / 60;
  const deltaTimezone = userOffset - serverTimezone;

  return new Date(new Date(date).getTime() + deltaTimezone * 60 * 60 * 1000);
}

const findTuitionsByTutorId = async (tenantId: string, _id: string): Promise<any> => {
  if (!_id) {
    throw new Error('User ID cannot be empty.');
  }
  return await groupTuitionsRepository.findByTutorId(tenantId, _id);
};

const findTuitionsByStudentId = async (tenantId: string, query: IFindGroupTuitionsByUserIdQuery): Promise<IFindGroupTuitionsResult> => {
  if (!query.userId) {
    throw new Error('User ID cannot be empty.');
  }
  return await groupTuitionsRepository.findByStudentId(tenantId, query.userId, query.isCompleted);
};

const findByTuitionId = async (tenantId: string, tuitionId: string): Promise<IFindGroupTuitionDetail> => {
  if (!tuitionId) {
    throw new Error('Group tuition ID cannot be empty.');
  }
  return await groupTuitionsRepository.findByTuitionId(tenantId, tuitionId);
};

const createTuition = async (tenantId: string, body: ICreateGroupTuitionInput): Promise<IFindGroupTuitionDetail> => {
  // validate body
  const validationRule = Joi.object().keys({
    course: Joi.object().required(),
    tutor: Joi.string().required(),
    period: Joi.array().required()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  return await groupTuitionsRepository.createTuition(tenantId, {
    ...body,
    referenceId: `${body.course.subject.slice(0,2).toUpperCase()}${body.course.level.slice(0,1).toUpperCase()}${String(body.course.grade).slice(0,1).toUpperCase()}-${moment(body.createdAt).format('YYMMDD')}`,
  });
};

const updateTuition = async (tenantId: string, body: IUpdateGroupTuitionInput): Promise<any> => {
  // validate body
  const validationRule = Joi.object().keys({
    _id : Joi.string().required(),
    course: Joi.object(),
    period: Joi.array()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  return await groupTuitionsRepository.updateTuition(tenantId, body);
}

const deleteTuition = async (tenantId: string, body: IDeleteGroupTuitionInput): Promise<any> => {
  // validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  return await groupTuitionsRepository.deleteTuition(tenantId, body);
}

const bookingTuition = async (tenantId: string, body: IBookingGroupTuitionInput): Promise<any> => {
  // validate body
  const validationRule = Joi.object().keys({
    tuition_id: Joi.string().required(),
    student_id: Joi.string().required()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true
  });
  if (error) {
    throw new Error(error.details[0].message);
  }
  return await groupTuitionsRepository.bookingTuition(tenantId, body);
}

const checkBookingCondition = async (tenantId: string, body: IBookingGroupTuitionInput): Promise<any> => {
  // validate body
  const validationRule = Joi.object().keys({
    tuition_id: Joi.string().required(),
    student_id: Joi.string().required()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true
  });
  if (error) {
    throw new Error(error.details[0].message);
  }
  return await groupTuitionsRepository.checkBookingCondition(tenantId, body);
}

const checkCompletedGroupTuitions = async (): Promise<void> => {
  const checkMoment = new Date().getTime();

  const result = await groupTuitionsRepository.findUncompletedTuitions();
  const completedTuitions: string[] = [];
  const completedCourses: string[] = [];
  for (let tuition of result) {
    let completed = true;
    // Check sessions end time
    if (tuition.sessions && tuition.sessions.length) {
      for (let session of tuition.sessions) {
        if (new Date(session.end).getTime() > checkMoment) {
          completed = false;
        }
      }
    }

    // Check period end time instead
    else if (tuition.period && tuition.period.length) {
      for (let schedule of tuition.period) {
        if (new Date(schedule.end).getTime() > checkMoment) {
          completed = false;
        }
      }
    }

    // End registration time => Completed course
    if (new Date(tuition.course.endReg).getTime() < checkMoment) {
      completed = true;
    }

    if (completed) {
      completedTuitions.push(tuition._id);
      completedCourses.push(tuition.courseForTutor);
    }
  }

  // Update
  await groupTuitionsRepository.updateCompletedTuitions(completedTuitions, completedCourses);
}

const cancelTuition = async (tenantId: string, body: ICancelTuition): Promise<void> => {
  // validate body
  const validationRule = Joi.object().keys({
    tuitionId: Joi.string().required(),
    cancelReason: Joi.string().required(),
    cancelBy: Joi.string().required(),
    userId: Joi.string().required()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  const canceledTuition = await groupTuitionsRepository.cancelTuition(tenantId, body);
  const referenceId: string = `${canceledTuition.course.subject.slice(0,2).toUpperCase()}${canceledTuition.course.level.slice(0,1).toUpperCase()}${String(canceledTuition.course.grade).slice(0,1).toUpperCase()}-${moment((canceledTuition as any).createdAt).format('YYMMDD')}`;
  const notificationSetting = await notificationSettingsService.findSettingByTenantId(tenantId);

  // Send email to student + tutor
  // TODO: Price Payable Per Month ????
  if (notificationSetting) {
    if (notificationSetting.cancelTuition.email) {
      notificationQueue.create('cancelTuitionEmail', {
        title: `SkyAce - Course Termination #${referenceId}`,
        receiver: canceledTuition.tutor.email,
        cancelBy: body.cancelBy,
        tutorName: canceledTuition.tutor.fullName,
        studentName: canceledTuition.students && canceledTuition.students.length ? canceledTuition.students.map((val , index) => index === canceledTuition.students.length - 1 ? val.fullName : val.fullName + ', ').join(" ") : 'There is no student in this tuition.',
        registrationDate: inputDateInUserTimezone((canceledTuition as any).createdAt, canceledTuition.tutor.timeZone.offset).toLocaleString(),
        referenceId,
        subject: canceledTuition.course.subject,
        academicLevel: canceledTuition.course.level,
        grade: canceledTuition.course.grade,
        numberOfSessions: canceledTuition.course.session,
        hourPerSession: canceledTuition.course.hourPerSession,
        recurring: canceledTuition.sessions.length > canceledTuition.course.session ? 'True' : 'False',
        pricePayablePerMonth: '50',
      }).save();

      if (canceledTuition.students && canceledTuition.students.length) {
        canceledTuition.students.forEach(val => {
          notificationQueue.create('cancelTuitionEmail', {
            title: `SkyAce - Course Termination #${referenceId}`,
            receiver: val.email,
            cancelBy: body.cancelBy,
            studentName: val.fullName,
            tutorName: canceledTuition.tutor.fullName,
            registrationDate: inputDateInUserTimezone((canceledTuition as any).createdAt, val.timeZone.offset).toLocaleString(),
            referenceId,
            subject: canceledTuition.course.subject,
            academicLevel: canceledTuition.course.level,
            grade: canceledTuition.course.grade,
            numberOfSessions: canceledTuition.course.session,
            hourPerSession: canceledTuition.course.hourPerSession,
            recurring: canceledTuition.sessions.length > canceledTuition.course.session ? 'True' : 'False',
            pricePayablePerMonth: '50',
          }).save();
        }) 
      }
    }
  }
};

const holdSlot = async (tenantId: string, body: IBookingGroupTuitionInput): Promise<any> => {
  // validate body
  const validationRule = Joi.object().keys({
    tuition_id: Joi.string().required(),
    student_id: Joi.string().required()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true
  });
  if (error) {
    throw new Error(error.details[0].message);
  }
  return await groupTuitionsRepository.holdSlot(tenantId, body);
}

const cancelSlot = async (tenantId: string, body: IBookingGroupTuitionInput): Promise<any> => {
  // validate body
  const validationRule = Joi.object().keys({
    tuition_id: Joi.string().required(),
    student_id: Joi.string().required()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true
  });
  if (error) {
    throw new Error(error.details[0].message);
  }
  return await groupTuitionsRepository.cancelSlot(tenantId, body); 
}

const getAllTimeoutSlots = async (): Promise<any> => {
  return await groupTuitionsRepository.getAllTimeoutSlots(); 
}

export default {
  findTuitionsByTutorId,
  findTuitionsByStudentId,
  createTuition,
  updateTuition,
  bookingTuition,
  checkBookingCondition,
  checkCompletedGroupTuitions,
  findByTuitionId,
  deleteTuition,
  cancelTuition,
  cancelSlot,
  holdSlot,
  getAllTimeoutSlots
};