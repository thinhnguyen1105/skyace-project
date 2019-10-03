import initNodeMailer from "../node-mailer";
import * as ejs from 'ejs';
import * as path from 'path';
import smsContent from '../sms-content';
import logger from "../../../api/core/logger/log4js";
import initMessageBird from "../message-bird";

const processingCancelUnpaidTuitionEmail = (jobInfo, done) => {
  const transporter = initNodeMailer();

  // Send email to tutor
  ejs.renderFile(path.join(__dirname + `../../../../../../static/email-template/cancel-unpaid-tuition-to-tutor.ejs`), {
    tutorName: jobInfo.tutorName,
    studentName: jobInfo.studentName,
    registrationDate: jobInfo.registrationDate,
    referenceId: jobInfo.referenceId,
    subject: jobInfo.subject,
    academicLevel: jobInfo.academicLevel,
    grade: jobInfo.grade,
    numberOfSessions: jobInfo.numberOfSessions,
    hourPerSession: jobInfo.hourPerSession,
    recurring: jobInfo.recurring,
    pricePayablePerMonth: jobInfo.pricePayablePerMonth,
  }, (err, data) => {
    if (err) {
      throw new Error(err.message || 'Internal server error.');
    }

    const mailOptions = {
      to: jobInfo.tutorEmail,
      from: 'SkyAce Learning <admin@skyace-learning.com>',
      subject: jobInfo.mailSubject,
      html: data
    };

    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        logger.error(error);
        done(new Error(error.message || 'Internal server error.'));
      }
      // tslint:disable-next-line:no-console
      console.log(response);
      done();
    });
  });

  // Send email to student
  ejs.renderFile(path.join(__dirname + `../../../../../../static/email-template/cancel-unpaid-tuition-to-student.ejs`), {
    tutorName: jobInfo.tutorName,
    studentName: jobInfo.studentName,
    registrationDate: jobInfo.registrationDate,
    referenceId: jobInfo.referenceId,
    subject: jobInfo.subject,
    academicLevel: jobInfo.academicLevel,
    grade: jobInfo.grade,
    numberOfSessions: jobInfo.numberOfSessions,
    hourPerSession: jobInfo.hourPerSession,
    recurring: jobInfo.recurring,
    pricePayablePerMonth: jobInfo.pricePayablePerMonth,
  }, (err, data) => {
    if (err) {
      throw new Error(err.message || 'Internal server error.');
    }

    const mailOptions = {
      to: jobInfo.studentEmail,
      from: 'SkyAce Learning <admin@skyace-learning.com>',
      subject: jobInfo.mailSubject,
      html: data
    };

    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        logger.error(error);
        done(new Error(error.message || 'Internal server error.'));
      }
      // tslint:disable-next-line:no-console
      console.log(response);
      done();
    });
  });
};

const processingCancelUnpaidTuitionSms = (jobInfo, done) => {
  // Send sms to tutor
  const messageBird = initMessageBird();

  let tutorContent: string = '';
  tutorContent = smsContent.cancelUnpaidTuition.toTutor.replace('<%= tutorName %>', jobInfo.tutorName).replace('<%= referenceId %>', jobInfo.referenceId).replace('<%= studentName %>', jobInfo.studentName);

  messageBird.messages.create({
    originator: 'SkyAce',
    recipients: [jobInfo.tutorPhone],
    body: tutorContent,
  }, (error, response) => {
    if (error) {
      logger.error(error);
      done(new Error(error.message || 'Internal server error.'));
    } else {
      console.log('Success: ', response);
      done();
    }
  });

  // Send sms to student
  let studentContent: string = '';
  studentContent = smsContent.cancelUnpaidTuition.toStudent.replace('<%= studentName %>', jobInfo.studentName).replace('<%= referenceId %>', jobInfo.referenceId);

  messageBird.messages.create({
    originator: 'SkyAce',
    recipients: [jobInfo.studentPhone],
    body: studentContent,
  }, (error, response) => {
    if (error) {
      logger.error(error);
      done(new Error(error.message || 'Internal server error.'));
    } else {
      console.log('Success: ', response);
      done();
    }
  });
};

export {
  processingCancelUnpaidTuitionEmail,
  processingCancelUnpaidTuitionSms,
};