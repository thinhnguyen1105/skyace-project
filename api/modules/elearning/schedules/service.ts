import * as Joi from 'joi';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';
import * as schedulesRepository from './repository';
import * as usersRepository from '../../auth/users/repository';
import { IFindSchedulesQuery, IFindSchedulesResult, ICreateScheduleInput, IFindScheduleDetail, IUpdateScheduleInput, IRescheduleInput, ISendRescheduleConfirmEmailInput, ISaveStudentBookingsInput, ICreateMultipleSchedulesInput, ICheckMultipleBookingsResult, IFindScheduleByUserIdQuery, IFindTrialScheduleByUserIdQuery } from './interface';
import notificationSettingsService from '../../host/notification-settings/service';
import notificationQueue from '../../../notification-job-queue';
import * as tuitionsRepository from '../tuitions/repository';

const extendedMoment = extendMoment(moment);

const findSchedules = async (tenantId: string, query: IFindSchedulesQuery): Promise<IFindSchedulesResult> => {
  return await schedulesRepository.findSchedules(tenantId, query);
};

const findByUserId = async (tenantId: string, query: IFindScheduleByUserIdQuery): Promise<IFindSchedulesResult> => {
  return await schedulesRepository.findByUserId(tenantId, query);
};

const trialScheduleByUserId = async (tenantId: string, query: IFindTrialScheduleByUserIdQuery): Promise<IFindSchedulesResult> => {
  return await schedulesRepository.trialScheduleByUserId(tenantId, query);
};

const createSchedule = async (tenantId: string, body: ICreateScheduleInput): Promise<IFindScheduleDetail> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    start: Joi.date().required(),
    end: Joi.date().required(),
    type: Joi.string().required(),
    owner: Joi.string().required(),
    parent: Joi.string(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check In The Past
  if (new Date().getTime() > new Date(body.start).getTime()) {
    throw new Error('Cannot create schedule in the past!');
  }

  // Check Overlapsed
  const overlapsed = await schedulesRepository.checkSchedule(tenantId, {
    start: body.start,
    end: body.end,
    tutorId: body.parent ? body.parent : body.owner
  });
  if (overlapsed) {
    throw new Error('Schedule overlapsed!');
  }

  // Save to db
  return await schedulesRepository.createNewSchedule(tenantId, body);
};

const createMultipleSchedules = async (tenantId: string, body: ICreateMultipleSchedulesInput): Promise<IFindSchedulesResult> => {
  // Validate body
  const bodyValidationRule = Joi.object().keys({
    schedulesList: Joi.array().required(),
  });
  const result = Joi.validate(body, bodyValidationRule, {
    allowUnknown: true,
  });
  if (result.error) {
    throw new Error('Bad request!');
  }

  const schedulesList = body.schedulesList.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  // Check Collapsed
  const start = new Date(extendedMoment(schedulesList[0].start).startOf('day').toString()).toUTCString() as any;
  const end = new Date(extendedMoment(schedulesList[schedulesList.length - 1].end).endOf('day').toString()).toUTCString() as any;
  const tutorId = schedulesList[0].owner;
  const existedSchedules = await schedulesRepository.findSchedules(tenantId, {start, end, tutorId});

  if (existedSchedules.data.length > 0) {
    for (let schedule of schedulesList) {
      for (let item of existedSchedules.data.filter((itemm) => itemm.type === 'tutor')) {
        const scheduleRange = extendedMoment.range(schedule.start, schedule.end);
        const itemRange = extendedMoment.range(item.start, item.end);
        if (scheduleRange.overlaps(itemRange)) {
          throw new Error('Times has been used for other schedules. Please check your calendar!');
        }
      }
    }
  }

  // Save to db
  return await schedulesRepository.createMultipleSchedules(tenantId, body);
};

const checkMultilpleBookings = async (tenantId: string, body: ICreateMultipleSchedulesInput): Promise<ICheckMultipleBookingsResult> => {
  // Validate body
  const bodyValidationRule = Joi.object().keys({
    schedulesList: Joi.array().required(),
  });
  const result = Joi.validate(body, bodyValidationRule, {
    allowUnknown: true,
  });
  if (result.error) {
    throw new Error('Bad request!');
  }

  // Check Collapsed
  const schedulesList = body.schedulesList.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  const start: any = new Date(extendedMoment(schedulesList[0].start).startOf('day').toString()).toUTCString();
  const end: any = new Date(extendedMoment(schedulesList[schedulesList.length - 1].end).endOf('day').toString()).toUTCString();
  const tutorId: string = schedulesList[0].parent as any;
  const existedSchedules = await schedulesRepository.findSchedulesForCheckBookings(tenantId, {start, end, tutorId});
  const unqualifiedBookings: any[] = [];
  const withinTutorScheduleBookings: any[] = [];
  const qualifiedBookings: any[] = [];

  // within tutor schedules
  for (let item of schedulesList) {
    let isWithinTutorSchedule = false;
    for (let schedule of existedSchedules.data.filter((itemm) => itemm.type === 'tutor' && !item.isGroup)) {
      const scheduleRange = extendedMoment.range(schedule.start, schedule.end);

      if (scheduleRange.contains(new Date(item.start)) && scheduleRange.contains(new Date(item.end))) {
        isWithinTutorSchedule = true;
        break;
      }
    }
    if (!isWithinTutorSchedule) {
      unqualifiedBookings.push(item);
      // throw new Error('Cant create booking outside of tutor schedules. Please check tutor calendar');
    } else if (isWithinTutorSchedule) {
      withinTutorScheduleBookings.push(item);
    }
  }

  // without student bookings, other group tuitions or trial bookings
  for (let item of withinTutorScheduleBookings) {
    let isOverlapped = false;
    for (let booking of existedSchedules.data.filter((itemm) => itemm.type === 'student' || (itemm.type === 'tutor' && itemm.isGroup) || itemm.type === 'trial')) {
      const bookingRange = extendedMoment.range(booking.start, booking.end);
      const itemRange = extendedMoment.range(item.start, item.end);

      if (itemRange.overlaps(bookingRange)) {
        isOverlapped = true;
        break;
        // throw new Error('Times has been booked by others. Please check tutor calendar');
      }
    }
    
    if (isOverlapped) {
      unqualifiedBookings.push(item);
    } else if (!isOverlapped) {
      qualifiedBookings.push(item);
    }
  }

  return {
    unqualifiedBookings,
    qualifiedBookings
  };
};

const createStudentBookings = async (tenantId: string, body: ISaveStudentBookingsInput): Promise<IFindSchedulesResult> => {
  // Validate body
  const bodyValidationRule = Joi.object().keys({
    newBookings: Joi.array().required(),
  });
  const result = Joi.validate(body, bodyValidationRule, {
    allowUnknown: true,
  });
  if (result.error) {
    throw new Error('Bad request');
  }

  // Check Overlapsed
  const start: any = new Date(extendedMoment(body.newBookings[0].start).startOf('day').toString()).toUTCString();
  const end: any = new Date(extendedMoment(body.newBookings[body.newBookings.length - 1].end).endOf('day').toString()).toUTCString();
  const tutorId: any = body.newBookings[0].parent;

  const existedSchedules = await schedulesRepository.findSchedules(tenantId, {start, end, tutorId});
  if (existedSchedules.data.length > 0) {
    for (let schedule of body.newBookings) {
      let isWithinTutorRange = false;

      for (let item of existedSchedules.data.filter((itemm) => itemm.type === 'tutor')) {
        const itemRange = extendedMoment.range(item.start, item.end);
        if (itemRange.contains(new Date(schedule.start)) && itemRange.contains(new Date(schedule.end))) {
          isWithinTutorRange = true;
          break;
        }
      }

      if (!isWithinTutorRange) {
        throw new Error(`Cant create booking outside of tutor schedules !`);
      }
    }

    for (let schedule of body.newBookings) {
      for (let item of existedSchedules.data.filter((itemm) => itemm.type === 'student')) {
        const scheduleRange = extendedMoment.range(schedule.start, schedule.end);
        const itemRange = extendedMoment.range(item.start, item.end);
        if (scheduleRange.overlaps(itemRange)) {
          throw new Error('Times has been booked by others!');
        }
      }
    }
  }

  // Save to db
  return await schedulesRepository.createMultipleSchedules(tenantId, {schedulesList: body.newBookings});
};

const updateSchedule = async (tenantId: string, body: IUpdateScheduleInput): Promise<void> => {
  // Validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    start: Joi.date(),
    end: Joi.date(),
    type: Joi.string(),
    owner: Joi.string(),
    parent: Joi.string(),
    status: Joi.string(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If schedule Exist
  const existedSchedule = await schedulesRepository.findScheduleById(tenantId, body._id);
  if (!existedSchedule) {
    throw new Error('Schedule does not exist!');
  }

  // Check overlapped
  const start: any = new Date(extendedMoment(body.start).startOf('day').toString()).toUTCString();
  const end: any = new Date(extendedMoment(body.end).endOf('day').toString()).toUTCString();
  const existedSchedules = await schedulesRepository.findSchedulesForCheckBookings(tenantId, {start, end, tutorId: existedSchedule.owner});
  const tutorSchedules = existedSchedules.data.filter((item) => item.type === 'tutor' && !item.isGroup && String(item._id) !== String(existedSchedule._id));
  const studentBookings = existedSchedules.data.filter((item) => item.type === 'student');

  const newRange = extendedMoment.range(body.start, body.end);
  for (let schedule of tutorSchedules) {
    const scheduleRange = extendedMoment.range(schedule.start, schedule.end);
    if (scheduleRange.overlaps(newRange)) {
      throw new Error('Timing unsuitable');
    }
  }

  const oldRange = extendedMoment.range(existedSchedule.start, existedSchedule.end);
  const studentBookingsInsideOldRange: any = [];
  for (let booking of studentBookings) {
    const bookingRange = extendedMoment.range(booking.start, booking.end);
    if (oldRange.contains(bookingRange)) {
      studentBookingsInsideOldRange.push(booking);
    }
  }

  for (let booking of studentBookingsInsideOldRange) {
    const bookingRange = extendedMoment.range(booking.start, booking.end);
    if (!newRange.contains(bookingRange)) {
      throw new Error('Unable to update selected timeslot; existing student booking detected');
    }
  }

  // Update
  await schedulesRepository.updateSchedule(tenantId, body);
};

const reschedule = async (tenantId: string, body: IRescheduleInput): Promise<void> => {
  // Validate body
  const validationRule = Joi.object().keys({
    start: Joi.date().required(),
    end: Joi.date().required(),
    oldStart: Joi.date().required(),
    oldEnd: Joi.date().required(),
    type: Joi.string(),
    owner: Joi.string(),
    parent: Joi.string(),
    status: Joi.string(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If Schedule Exist
  const existedSchedule = await schedulesRepository.findScheduleByTime(tenantId, body);
  console.log('existedSchedule', existedSchedule);
  if (!existedSchedule) {
    throw new Error('Bad request!');
  }

  // Check !In the past
  if (new Date(body.start).getTime() < new Date().getTime()) {
    throw new Error('Re-schedule time cannot in the past !!');
  }

  // Check re-schedule
  const otherSchedules = await schedulesRepository.findSchedules(tenantId, {
    start: new Date(extendedMoment(body.start).startOf('day').toString()).toUTCString() as any,
    end: new Date(extendedMoment(body.start).endOf('day').toString()).toUTCString() as any,
    tutorId: body.tutorId,
  });
  const tutorSchedules = otherSchedules.data.filter((item) => item.type === 'tutor');
  const studentBookings = otherSchedules.data.filter((item) => item.type === 'student' && new Date(item.start).getTime() !== new Date(body.oldStart).getTime());

  // within tutor schedules
  if (tutorSchedules.length > 0) {
    let result = false;
    for (let schedule of tutorSchedules) {
      const scheduleRange = extendedMoment.range(new Date(schedule.start), new Date(schedule.end));
      if (scheduleRange.contains(new Date(body.start)) && scheduleRange.contains(new Date(body.end))) {
        result = true;
        break;
      }
    }
    if (!result) {
      throw new Error('Invalid Re-schedule time!');
    }
  } else {
    throw new Error('Invalid Re-schedule time!');
  }

  // check without other student bookings
  if (studentBookings.length > 0) {
    for (let booking of studentBookings) {
      const bookingRange = extendedMoment.range(booking.start, booking.end);
      const rescheduleRange = extendedMoment.range(body.start, body.end);

      if (rescheduleRange.overlaps(bookingRange)) {
        throw new Error('Invalid Re-schedule time!');
      }
    }
  }

  // Check Within 2 weeks
  if (new Date(body.end).getTime() < new Date(body.oldStart).getTime() - 2 * 604800000 || new Date(body.start).getTime() > new Date(body.oldEnd).getTime() + 2 * 604800000) {
    throw new Error('Re-Schedule time must be within 2 weeks!');
  }

  // Update Schedules
  await await schedulesRepository.updateSchedule(tenantId, {
    _id: String(existedSchedule._id),
    start: body.start,
    end: body.end,
    lastModifiedAt: body.lastModifiedAt,
    lastModifiedBy: body.lastModifiedBy,
  });
};

const inputDateInUserTimezone = (date: any = new Date().toString(), userOffset) => {
  const serverTimezone = - new Date().getTimezoneOffset() / 60;
  const deltaTimezone = userOffset - serverTimezone;

  return new Date(new Date(date).getTime() + deltaTimezone * 60 * 60 * 1000);
}

const sendRescheduleConfirmEmail = async (tenantId: string, body: ISendRescheduleConfirmEmailInput) => {
  const studentPromise = usersRepository.findUserById(body.studentId);
  const tutorPromise =  usersRepository.findUserById(body.tutorId);
  const tuitionPromise = tuitionsRepository.findByTuitionId(tenantId, body.tuitionId);
  const [student, tutor, tuition] = await Promise.all([studentPromise, tutorPromise, tuitionPromise]);

  const referenceId: string = `${tuition.course.subject.slice(0,2).toUpperCase()}${tuition.course.level.slice(0,1).toUpperCase()}${String(tuition.course.grade).slice(0,1).toUpperCase()}-${extendedMoment((tuition as any).createdAt).format('YYMMDD')}`;
  // Push send mail and sms to job queue
  const notificationSetting = await notificationSettingsService.findSettingByTenantId(tenantId);
  if (notificationSetting.reschedule.email) {
    notificationQueue.create('rescheduleEmail', {
      title: 'Reschedule email',
      rescheduleBy: body.rescheduleInfo.rescheduleBy,
      studentEmail: student.email,
      tutorEmail: tutor.email,
      mailSubject: `SkyAce – Reschedule #${referenceId}`,
      studentName: student.fullName,
      tutorName: tutor.fullName,
      oldStart: extendedMoment(inputDateInUserTimezone(body.rescheduleInfo.oldStart, student.timeZone.offset)).format('DD MMM YYYY - HH:mm'),
      newStart: extendedMoment(inputDateInUserTimezone(body.rescheduleInfo.newStart, student.timeZone.offset)).format('DD MMM YYYY - HH:mm'),
    }).save();
  }
  if (notificationSetting.reschedule.sms) {
    notificationQueue.create('rescheduleSms', {
      title: 'Reschedule sms',
      rescheduleBy: body.rescheduleInfo.rescheduleBy,
      studentPhone: `${(student.phone as any).phoneID}${(student.phone as any).phoneNumber}`,
      tutorPhone: `${(tutor.phone as any).phoneID}${(tutor.phone as any).phoneNumber}`,
      studentName: student.fullName,
      tutorName: tutor.fullName,
      oldStart: extendedMoment(inputDateInUserTimezone(body.rescheduleInfo.oldStart, student.timeZone.offset)).format('DD MMM YYYY - HH:mm'),
      newStart: extendedMoment(inputDateInUserTimezone(body.rescheduleInfo.newStart, student.timeZone.offset)).format('DD MMM YYYY - HH:mm'),
    }).save();
  }
};

const deleteSchedule = async (tenantId: string, body: IFindScheduleDetail): Promise<void> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    start: Joi.date().required(),
    end: Joi.date().required(),
    type: Joi.string().required(),
    owner: Joi.string().required(),
    parent: Joi.string(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error('Bad request');
  }

  // Check if any student bookings inside tutor schedule
  const schedules = await schedulesRepository.findSchedules(tenantId, {start: body.start, end: body.end, tutorId: body.owner});
  const studentBookings = schedules.data.filter((item) => item.type === 'student');
  if (studentBookings.length > 0) {
    throw new Error('Unable to delete selected timeslot; existing student booking detected');
  }

  await schedulesRepository.deleteOneSchedule(tenantId, body._id);
};

const deleteRepeatSchedules = async (tenantId: string, body: IFindScheduleDetail): Promise<any> => {
  if (!body._id) {
    throw new Error('Bad request');
  }

  const tutorRepeatSchedules = await schedulesRepository.findRepeatSchedules(tenantId, body);

  if (tutorRepeatSchedules.length > 0) {
    const studentBookings = await schedulesRepository.findSchedules(tenantId, {
      start: tutorRepeatSchedules[0].start,
      end: tutorRepeatSchedules[tutorRepeatSchedules.length - 1].end,
      tutorId: body.owner,
    });

    const canDeleteSchedules: any[] = [];
    let number = 0;
    for (let schedule of [body, ...tutorRepeatSchedules]) {
      const scheduleRange = extendedMoment.range(schedule.start, schedule.end);
      let canDelete = true;
      for (let booking of studentBookings.data.filter((item) => item.type === 'student')) {
        if (scheduleRange.contains(booking.start) && scheduleRange.contains(booking.end)) {
          canDelete = false;
          number += 1;
          break;
        }
      }
      if (canDelete) {
        canDeleteSchedules.push(schedule._id);
      }
    }

    if (number === 0) {
      await schedulesRepository.deleteSchedules(tenantId, canDeleteSchedules);
    } else {
      return {
        number: number,
        canDeleteSchedules,
      };
    }
  } else {
    await schedulesRepository.deleteOneSchedule(tenantId, body._id);
  }
};

const deleteManySchedules = async (tenantId: string, schedulesId: Array<string>): Promise<void> => {
  if (!schedulesId) {
    throw new Error('Schedules ID cannot be empty.');
  }

  await schedulesRepository.deleteSchedules(tenantId, schedulesId);
};

const deleteScheduleByTime = async (tenantId: string, scheduleInfo: {start: any; end: any; owner: string;}): Promise<void> => {
  const validationRule = Joi.object().keys({
    start: Joi.required(),
    end: Joi.required(),
    owner: Joi.required(),
  });
  const { error } = Joi.validate(scheduleInfo, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    // console.log('error', error);
    throw new Error('Bad request');
  }

  await schedulesRepository.deleteScheduleByTime(tenantId, scheduleInfo);
};

const updatePaymentComplete = async (tenantId: string, schedulesId: Array<string>): Promise<void> => {
  if (!schedulesId) {
    throw new Error('Schedules ID cannot be empty.');
  }

  await schedulesRepository.updatePaymentComplete(tenantId, schedulesId);
};

const checkCompletedSchedules = async (): Promise<void> => {
  await schedulesRepository.updateCompletedSchedules(new Date().toUTCString());
};

const checkSessionInsideTutorSchedule = async (tenantId: string, query: any): Promise<boolean> => {
  return await schedulesRepository.checkSessionInsideTutorSchedule(tenantId, query);
}

export default {
  findSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  createStudentBookings,
  createMultipleSchedules,
  checkMultilpleBookings,
  reschedule,
  deleteManySchedules,
  sendRescheduleConfirmEmail,
  checkCompletedSchedules,
  deleteRepeatSchedules,
  updatePaymentComplete,
  deleteScheduleByTime,
  findByUserId,
  trialScheduleByUserId,
  checkSessionInsideTutorSchedule
};
