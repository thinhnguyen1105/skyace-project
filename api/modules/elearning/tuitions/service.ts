import * as Joi from 'joi';
import * as tuitionsRepository from './repository';
import * as transactionRepository from '../../payment/transactions/respository';
import { IFindTuitionsResult, IFindTuitionsByUserIdQuery, IFindTuitionDetail, ICreateTuitionInput, IUpdateTuitionInput, IFinishTuition, ICancelTuition, IGetTuitions, ISendBookingConfirmEmail, IFindTuitionsQuery } from './interface';
import notificationQueue from '../../../notification-job-queue';
import * as moment from 'moment';
import * as usersRepository from '../../auth/users/repository';
import notificationSettingsService from '../../host/notification-settings/service';
import conversationsService from '../../private-message/conversations/service';
import courseService from '../courses/service';
import schedulesService from '../schedules/service';
let nodeXlsx = require('node-xlsx');

const findAllTuitionsByStudentId = async (tenantId: string, query: {studentId: string, isCompleted?: boolean; isCanceled?: boolean, isPendingReview?: boolean}): Promise<IFindTuitionsResult> => {
  // validate query
  const validationRule = Joi.object().keys({
    studentId: Joi.string().required(),
    isCompleted: Joi.boolean(),
    isCanceled: Joi.boolean(),
  });
  const { error } = Joi.validate(query, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  return await tuitionsRepository.findAllTuitionsByStudentId(tenantId, query);
};

const findTuitionsByStudentIdInCalendar = async (tenantId: string, query: {studentId: string, isCompleted?: boolean; isCanceled?: boolean, isPendingReview?: boolean}): Promise<IFindTuitionsResult> => {
  // validate query
  const validationRule = Joi.object().keys({
    studentId: Joi.string().required(),
    isCompleted: Joi.boolean(),
    isCanceled: Joi.boolean(),
  });
  const { error } = Joi.validate(query, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  return await tuitionsRepository.findTuitionsByStudentIdInCalendar(tenantId, query);
};

const findTuitions = async (tenantId: string, query: IFindTuitionsQuery): Promise<IFindTuitionsResult> => {
  let objectQueries = {} as any;
  if (query.status && query.status.length) {
    if (query.status.indexOf('active') >= 0 ){
      if ( objectQueries.isActive === false ) {
        objectQueries.isActive = 'both';
      } else {
        objectQueries.isActive = true;
      }
      if ( objectQueries.isCompleted ) {
        objectQueries.isCompleted = 'both';
      } else {
        objectQueries.isCompleted = false;
      }
      if ( objectQueries.isCanceled ) {
        objectQueries.isCanceled = 'both';
      } else {
        objectQueries.isCanceled = false;
      }
      if ( objectQueries.isPendingReview ) {
        objectQueries.isPendingReview = 'both';
      } else {
        // objectQueries.isPendingReview = false;
      }
    }
    if (query.status.indexOf('completed') >= 0 ){
      if ( objectQueries.isCompleted === false ) {
        objectQueries.isCompleted = 'both';
      } else {
        objectQueries.isCompleted = true;
      }
      if ( objectQueries.isCanceled ) {
        objectQueries.isCanceled = 'both';
      } else {
        objectQueries.isCanceled = false;
      }
      if ( objectQueries.isPendingReview ) {
        objectQueries.isPendingReview = 'both';
      } else {
        // objectQueries.isPendingReview = false;
      }
    }
    if (query.status.indexOf('canceled') >= 0 ){
      if ( objectQueries.isCanceled === false ) {
        objectQueries.isCanceled = 'both';
      } else {
        objectQueries.isCanceled = true;
      }
    }
    if (query.status.indexOf('pending-review') >= 0 ){
      if ( objectQueries.isPendingReview === false ) {
        objectQueries.isPendingReview = 'both';
      } else {
        objectQueries.isPendingReview = true;
      }
      if ( objectQueries.isCanceled ) {
        objectQueries.isCanceled = 'both';
      } else {
        objectQueries.isCanceled = false;
      }
    }
  }
  if (objectQueries.isActive === 'both') delete objectQueries.isActive;
  if (objectQueries.isCompleted === 'both') delete objectQueries.isCompleted;
  if (objectQueries.isCanceled === 'both') delete objectQueries.isCanceled;
  if (objectQueries.isPendingReview === 'both') delete objectQueries.isPendingReview;

  return await tuitionsRepository.findTuitions(tenantId, {
    ...query,
    ...objectQueries,
  });
};

const findTuitionsByTutorId = async (tenantId: string, query: IFindTuitionsByUserIdQuery): Promise<IFindTuitionsResult> => {
  if (!query.userId) {
    throw new Error('User ID cannot be empty');
  }
  return await tuitionsRepository.findByTutorId(tenantId, query);
};

const findRequestCancelByTutorId = async (tenantId: string, query: IFindTuitionsByUserIdQuery): Promise<IFindTuitionsResult> => {
  if (!query.userId) {
    throw new Error('User ID cannot be empty');
  }
  return await tuitionsRepository.findRequestCancelByTutorId(tenantId, query);
};

const findTuitionsByStudentId = async (tenantId: string, query: IFindTuitionsByUserIdQuery): Promise<IFindTuitionsResult> => {
  if (!query.userId) {
    throw new Error('User ID cannot be empty.');
  }
  return await tuitionsRepository.findByStudentId(tenantId, query);
};

const findRequestCancelByStudentId = async (tenantId: string, query: IFindTuitionsByUserIdQuery): Promise<IFindTuitionsResult> => {
  if (!query.userId) {
    throw new Error('User ID cannot be empty.');
  }
  return await tuitionsRepository.findRequestCancelByStudentId(tenantId, query);
};

const findByTuitionId = async (tenantId: string, tuitionId: string): Promise<IFindTuitionDetail> => {
  if (!tuitionId) {
    throw new Error('Tuition ID cannot be empty.');
  }
  return await tuitionsRepository.findByTuitionId(tenantId, tuitionId);
};
const findCancelTuitionStudent = async (tenantId: string, query: IFindTuitionsByUserIdQuery): Promise<IFindTuitionsResult> => {
  if (!query.userId) {
    throw new Error('User ID cannot be empty.');
  }
  return await tuitionsRepository.findCancelTuitionStudent(tenantId, query);
};

const findCancelTuitioTutor = async (tenantId: string, query: IFindTuitionsByUserIdQuery): Promise<IFindTuitionsResult> => {
  if (!query.userId) {
    throw new Error('User ID cannot be empty.');
  }
  return await tuitionsRepository.findCancelTuitionTutor(tenantId, query);
};

const createTuition = async (tenantId: string, body: ICreateTuitionInput): Promise<IFindTuitionDetail> => {
  // validate body
  const validationRule = Joi.object().keys({
    courseForTutor: Joi.string().required(),
    course: Joi.string().required(),
    tutor: Joi.string().required(),
    student: Joi.string().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }
  const courseInfo = await courseService.findCourseByIdOldStructure(body.course);
  return await tuitionsRepository.createTuition(tenantId, {
    ...body,
    referenceId: `${courseInfo.subject.slice(0,2).toUpperCase()}${courseInfo.level.slice(0,1).toUpperCase()}${String(courseInfo.grade).slice(0,1).toUpperCase()}-${moment(body.createdAt).format('YYMMDD')}-${moment(body.createdAt).format('HHmmSS')}`,
  });
};

const sendBookingConfirmEmail = async (tenantId: string, body: ISendBookingConfirmEmail): Promise<void> => {
  console.log('body', body);
  const studentPromise = usersRepository.findUserById(body.studentId);
  const tutorPromise =  usersRepository.findUserById(body.tutorId);
  const tuitionPromise = tuitionsRepository.findByTuitionId(tenantId, body.tuitionId);
  const [student, tutor, tuition] = await Promise.all([studentPromise, tutorPromise, tuitionPromise]);

  const referenceId: string = `${tuition.course.subject.slice(0,2).toUpperCase()}${tuition.course.level.slice(0,1).toUpperCase()}${String(tuition.course.grade).slice(0,1).toUpperCase()}-${moment((tuition as any).createdAt).format('YYMMDD')}`;
  const notificationSetting = await notificationSettingsService.findSettingByTenantId(tenantId);
  if (notificationSetting) {
    if (notificationSetting.newBooking.email) {
      notificationQueue.create('newBookingEmail', {
        title: 'New booking',
        studentEmail: student.email,
        tutorEmail: tutor.email,
        mailSubject: ` SkyAce – New Course Booking #${referenceId}`,
        tutorName: tutor.fullName,
        studentName: student.fullName,
        registrationDate: moment((tuition as any).createdAt).format('DD MMM YYYY, ddd'),
        referenceId,
        subject: tuition.course.subject,
        academicLevel: tuition.course.level,
        grade: tuition.course.grade,
        numberOfSessions: tuition.course.session,
        hourPerSession: tuition.course.hourPerSession,
        recurring: tuition.sessions.length > tuition.course.session ? 'True' : 'False',
        transactionId: body.transactionId,

        pricePayablePerCourse: '50',
      }).save();
    }
    if (notificationSetting.newBooking.sms) {
      notificationQueue.create('newBookingSms', {
        title: 'New booking',
        studentPhone: `${(student.phone as any).phoneID}${(student.phone as any).phoneNumber}`,
        tutorPhone: `${(tutor.phone as any).phoneID}${(tutor.phone as any).phoneNumber}`,
        tutorName: tutor.fullName,
        studentName: student.fullName,
        referenceId,
      }).save();
    }
  }
};

const updateTuition = async (tenantId: string, body: IUpdateTuitionInput): Promise<void> => {
  // validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    courseForTutor: Joi.string(),
    student: Joi.string(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  return await tuitionsRepository.updateTuition(tenantId, body);
};

const finishTuition = async (tenantId: string, body: IFinishTuition): Promise<void> => {
  // validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  return await tuitionsRepository.finishTuition(tenantId, body);
};

const cancelTuition = async (tenantId: string, body: ICancelTuition): Promise<{disabledConversations: string[]}> => {
  // validate body
  const validationRule = Joi.object().keys({
    tuitionId: Joi.string().required(),
    // cancelReason: Joi.string().required(),
    // cancelBy: Joi.string().required(),
    // userId: Joi.string().required()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  const canceledTuition = await tuitionsRepository.cancelTuition(tenantId, body);
  const deleteSchedulesPromise: any = [];
  for (let item of canceledTuition.sessions) {
    deleteSchedulesPromise.push(schedulesService.deleteScheduleByTime(tenantId, {
      start: item.start,
      end: item.end,
      owner: (item.student as any)._id,
    }));
  }
  await Promise.all(deleteSchedulesPromise);
  const disabledConversations = await conversationsService.disableConversations([canceledTuition._id]);

  const referenceId: string = `${canceledTuition.course.subject.slice(0,2).toUpperCase()}${canceledTuition.course.level.slice(0,1).toUpperCase()}${String(canceledTuition.course.grade).slice(0,1).toUpperCase()}-${moment((canceledTuition as any).createdAt).format('YYMMDD')}-${moment((canceledTuition as any).createdAt).format('HHmmSS')}`;
  const notificationSetting = await notificationSettingsService.findSettingByTenantId(tenantId);
  // Send email to student + tutor
  // TODO: Price Payable Per Month ????
  if (notificationSetting) {
    if (notificationSetting.cancelTuition.email) {
      notificationQueue.create('cancelTuitionEmail', {
        title: 'Cancel tuition',
        cancelBy: (canceledTuition as any).cancelBy,
        studentEmail: canceledTuition.student.email,
        tutorEmail: canceledTuition.tutor.email,
        mailSubject: `SkyAce – Course Termination #${referenceId}`,
        tutorName: canceledTuition.tutor.fullName,
        studentName: canceledTuition.student.fullName,
        registrationDate: moment((canceledTuition as any).createdAt).format('DD MMM YYYY, ddd'),
        referenceId,
        subject: canceledTuition.course.subject,
        academicLevel: canceledTuition.course.level,
        grade: canceledTuition.course.grade,
        numberOfSessions: canceledTuition.course.session,
        hourPerSession: canceledTuition.course.hourPerSession,
        recurring: canceledTuition.sessions.length > canceledTuition.course.session ? 'True' : 'False',

        pricePayablePerMonth: '50',
      }).save();
    }
    if (notificationSetting.cancelTuition.sms) {
      notificationQueue.create('cancelTuitionSms', {
        title: 'Cancel tuition',
        cancelBy: (canceledTuition as any).cancelBy,
        studentPhone: `${(canceledTuition.student.phone as any).phoneID}${(canceledTuition.student.phone as any).phoneNumber}`,
        tutorPhone: `${(canceledTuition.tutor.phone as any).phoneID}${(canceledTuition.tutor.phone as any).phoneNumber}`,
        tutorName: canceledTuition.tutor.fullName,
        studentName: canceledTuition.student.fullName,
        referenceId,
      }).save();
    }
  }

  await transactionRepository.updateByTuitionId(tenantId, {
    tuition: canceledTuition._id,
    isTuitionCanceled: true
  });

  return disabledConversations;
};

const cancelTuitionDueToOverduePayment = async (_id: string): Promise<{disabledConversations: string[]}> => {
  const canceledTuition = await tuitionsRepository.cancelUnpaidTuition(_id);
  const deleteSchedulesPromise: any = [];
  for (let item of canceledTuition.sessions) {
    deleteSchedulesPromise.push(schedulesService.deleteScheduleByTime(canceledTuition.tenant, {
      start: item.start,
      end: item.end,
      owner: (item.student as any)._id,
    }));
  }
  await Promise.all(deleteSchedulesPromise);
  const disabledConversations = await conversationsService.disableConversations([canceledTuition._id]);

  const referenceId: string = `${canceledTuition.course.subject.slice(0,2).toUpperCase()}${canceledTuition.course.level.slice(0,1).toUpperCase()}${String(canceledTuition.course.grade).slice(0,1).toUpperCase()}-${moment((canceledTuition as any).createdAt).format('YYMMDD')}-${moment((canceledTuition as any).createdAt).format('HHmmSS')}`;
  
  notificationQueue.create('cancelUnpaidTuitionEmail', {
    title: 'Cancel tuition',
    cancelBy: (canceledTuition as any).cancelBy,
    studentEmail: canceledTuition.student.email,
    tutorEmail: canceledTuition.tutor.email,
    mailSubject: `SkyAce – Course Termination #${referenceId}`,
    tutorName: canceledTuition.tutor.fullName,
    studentName: canceledTuition.student.fullName,
    registrationDate: moment((canceledTuition as any).createdAt).format('DD MMM YYYY, ddd'),
    referenceId,
    subject: canceledTuition.course.subject,
    academicLevel: canceledTuition.course.level,
    grade: canceledTuition.course.grade,
    numberOfSessions: canceledTuition.course.session,
    hourPerSession: canceledTuition.course.hourPerSession,
    recurring: canceledTuition.sessions.length > canceledTuition.course.session ? 'True' : 'False',

    pricePayablePerMonth: '50',
  }).save();

  notificationQueue.create('cancelUnpaidTuitionSms', {
    title: 'Cancel tuition',
    cancelBy: (canceledTuition as any).cancelBy,
    studentPhone: `${(canceledTuition.student.phone as any).phoneID}${(canceledTuition.student.phone as any).phoneNumber}`,
    tutorPhone: `${(canceledTuition.tutor.phone as any).phoneID}${(canceledTuition.tutor.phone as any).phoneNumber}`,
    tutorName: canceledTuition.tutor.fullName,
    studentName: canceledTuition.student.fullName,
    referenceId,
  }).save();

  return disabledConversations;
};

const putToPendingTuition = async (tenantId: string, body: ICancelTuition): Promise<any> => {
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

  const canceledTuition = await tuitionsRepository.putToPendingTuition(tenantId, body);
  const deleteSchedulesPromise: any = [];
  for (let item of canceledTuition.sessions) {
    deleteSchedulesPromise.push(schedulesService.deleteScheduleByTime(tenantId, {
      start: item.start,
      end: item.end,
      owner: (item.student as any)._id,
    }));
  }
  await Promise.all(deleteSchedulesPromise);
  const disabledConversations = await conversationsService.disableConversations([canceledTuition._id]);

  const referenceId: string = `${canceledTuition.course.subject.slice(0,2).toUpperCase()}${canceledTuition.course.level.slice(0,1).toUpperCase()}${String(canceledTuition.course.grade).slice(0,1).toUpperCase()}-${moment((canceledTuition as any).createdAt).format('YYMMDD')}-${moment((canceledTuition as any).createdAt).format('HHmmSS')}`;
  const admins = await usersRepository.findTenantAdminAndSys(tenantId);
  // Send email to admins
  admins.forEach((val) => {
    console.log('email', val.email);
    notificationQueue.create('pendingReviewTuition', {
      title: 'Tuition submitted to be canceled',
      cancelBy: body.cancelBy,
      studentEmail: canceledTuition.student.email,
      tutorEmail: canceledTuition.tutor.email,
      adminEmail: val.email,
      mailSubject: `SkyAce – Course Termination #${referenceId}`,
      adminName: val.fullName,
      tutorName: canceledTuition.tutor.fullName,
      studentName: canceledTuition.student.fullName,
      registrationDate: moment((canceledTuition as any).createdAt).format('DD MMM YYYY, ddd'),
      referenceId,
      subject: canceledTuition.course.subject,
      academicLevel: canceledTuition.course.level,
      grade: canceledTuition.course.grade,
      numberOfSessions: canceledTuition.course.session,
      hourPerSession: canceledTuition.course.hourPerSession,
      recurring: canceledTuition.sessions.length > canceledTuition.course.session ? 'True' : 'False',

      pricePayablePerMonth: '50',
    }).save();
  });

  return disabledConversations;
};

const deleteTuition = async (tenantId: string, tuitionId: string): Promise<void> => {
  if (!tuitionId) {
    throw new Error('Schedules ID cannot be empty.');
  }

  await tuitionsRepository.deleteOneTuition(tenantId, tuitionId);
};

const checkCompletedTuitions = async (): Promise<string[]> => {
  const checkMoment = new Date().getTime();

  const result = await tuitionsRepository.findUncompletedTuitions();
  const completedTuitions: string[] = [];
  for (let tuition of result.tuitionList) {
    let completed = true;
    for (let session of tuition.sessions) {
      if (new Date(session.end).getTime() > checkMoment) {
        completed = false;
      }
    }

    if (completed) {
      completedTuitions.push(tuition._id);
    }
  }

  // Update
  await tuitionsRepository.updateCompletedTuitions(completedTuitions);
  return completedTuitions;
};

const findNewestTuitionsBooking = async (tenantId: string, tutor: string): Promise<IGetTuitions> => {
  return await tuitionsRepository.findNewestTuitionsBooking(tenantId, tutor);
};

const exportTuitions = async (tenant: string, query: string): Promise<any> => {
  var data = await tuitionsRepository.findAllTuitions(query ? query : tenant);
  let dataExcel = [] as any;
  
  let arrHeaderTitle = [] as any;
  arrHeaderTitle.push('Reference ID');
  arrHeaderTitle.push('Details');
  arrHeaderTitle.push('Tutor');
  arrHeaderTitle.push('Student');
  arrHeaderTitle.push('Period');
  arrHeaderTitle.push('Status');
  dataExcel.push(arrHeaderTitle);

  if (data && data.length) {
    for (let item of data) {
      if (item && item._doc) {
        let rowItemValue = [] as any;
        const referenceID = item._doc.course ? `${item._doc.course.subject.slice(0,2).toUpperCase()}${item._doc.course.level.slice(0,1).toUpperCase()}${String(item._doc.course.grade).slice(0,1).toUpperCase()}-${moment((item._doc as any).createdAt).format('YYMMDD')}` : "N/A"
        rowItemValue.push(referenceID || "N/A");
        const detail = item._doc.course ? (item._doc.course.subject !== 'trial' ? `${item._doc.course.country}: ${item._doc.course.level} ${item._doc.course.grade} - ${item._doc.course.subject}` : 'Trial' ) : 'N/A';
        rowItemValue.push(detail || "N/A");
        rowItemValue.push(item._doc.tutor ? item._doc.tutor.email : "N/A");
        rowItemValue.push(item._doc.student ? item._doc.student.email : "N/A");
        const periods = item.sessions[0] ? `${moment(item._doc.sessions[0].start).format('DD MMM YYYY')} - ${moment(item._doc.sessions[item._doc.sessions.length - 1].start).format('DD MMM YYYY')}` : ''
        rowItemValue.push(periods || "N/A");
        const status = item._doc.isFinished ? 'Finished' : item._doc.canceled ? 'Canceled' : 'Current';
        rowItemValue.push(status || "N/A");
        dataExcel.push(rowItemValue);
      }
    }
  }
  let buffer = nodeXlsx.build([{name: "List Tuitions", data: dataExcel}])
  return buffer;
}

const findPartialTuitions = async (): Promise<any> => {
  return await tuitionsRepository.findPartialTuitions();
}

const notifyPayment = async (_id: string): Promise<any> => {
  const canceledTuition = await tuitionsRepository.findById(_id);

  if (canceledTuition) {
    const referenceId: string = `${canceledTuition.course.subject.slice(0,2).toUpperCase()}${canceledTuition.course.level.slice(0,1).toUpperCase()}${String(canceledTuition.course.grade).slice(0,1).toUpperCase()}-${moment((canceledTuition as any).createdAt).format('YYMMDD')}-${moment((canceledTuition as any).createdAt).format('HHmmSS')}`;
    
    notificationQueue.create('notiUnpaidTuitionEmail', {
      title: 'Notification Unpaid Tuition',
      cancelBy: (canceledTuition as any).cancelBy,
      studentEmail: canceledTuition.student.email,
      tutorEmail: canceledTuition.tutor.email,
      mailSubject: `SkyAce – Payment Notification - Course #${referenceId}`,
      tutorName: canceledTuition.tutor.fullName,
      studentName: canceledTuition.student.fullName,
      registrationDate: moment((canceledTuition as any).createdAt).format('DD MMM YYYY, ddd'),
      referenceId,
      subject: canceledTuition.course.subject,
      academicLevel: canceledTuition.course.level,
      grade: canceledTuition.course.grade,
      numberOfSessions: canceledTuition.course.session,
      hourPerSession: canceledTuition.course.hourPerSession,
      recurring: canceledTuition.sessions.length > canceledTuition.course.session ? 'True' : 'False',

      pricePayablePerMonth: '50',
    }).save();

    notificationQueue.create('notiUnpaidTuitionSms', {
      title: 'Notification Unpaid Tuition',
      cancelBy: (canceledTuition as any).cancelBy,
      studentPhone: `${(canceledTuition.student.phone as any).phoneID}${(canceledTuition.student.phone as any).phoneNumber}`,
      tutorPhone: `${(canceledTuition.tutor.phone as any).phoneID}${(canceledTuition.tutor.phone as any).phoneNumber}`,
      tutorName: canceledTuition.tutor.fullName,
      studentName: canceledTuition.student.fullName,
      referenceId,
    }).save();

    return canceledTuition;
  } else {
    return false;
  }
}

export default {
  findTuitionsByTutorId,
  findTuitionsByStudentId,
  createTuition,
  updateTuition,
  finishTuition,
  cancelTuition,
  findByTuitionId,
  deleteTuition,
  checkCompletedTuitions,
  findNewestTuitionsBooking,
  findCancelTuitionStudent,
  findCancelTuitioTutor,
  sendBookingConfirmEmail,
  findTuitions,
  findAllTuitionsByStudentId,
  findTuitionsByStudentIdInCalendar,
  exportTuitions,
  putToPendingTuition,
  findPartialTuitions,
  cancelTuitionDueToOverduePayment,
  notifyPayment,
  findRequestCancelByTutorId,
  findRequestCancelByStudentId
};