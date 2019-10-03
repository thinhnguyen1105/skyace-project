import initNodeMailer from "../node-mailer";
import * as ejs from 'ejs';
import * as path from 'path';
import initMessageBird from "../message-bird";
import smsContent from '../sms-content';
import logger from "../../../api/core/logger/log4js";

const processingRescheduleEmail = (jobInfo, done) => {
  const transporter = initNodeMailer();

  // Send email to tutor
  ejs.renderFile(path.join(__dirname + `../../../../../../static/email-template/reschedule-by-${jobInfo.rescheduleBy === 'student' ? 'student' : 'tutor'}-to-tutor.ejs`), {
    studentName: jobInfo.studentName,
    tutorName: jobInfo.tutorName,
    oldStart: jobInfo.oldStart,
    newStart: jobInfo.newStart,
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
  ejs.renderFile(path.join(__dirname + `../../../../../../static/email-template/reschedule-by-${jobInfo.rescheduleBy === 'student' ? 'student' : 'tutor'}-to-student.ejs`), {
    studentName: jobInfo.studentName,
    tutorName: jobInfo.tutorName,
    oldStart: jobInfo.oldStart,
    newStart: jobInfo.newStart,
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

const processingRescheduleSms = (jobInfo, done) => {
  const messageBird = initMessageBird();

  // Send sms to tutor
  let tutorContent: string = '';
  if (jobInfo.rescheduleBy === 'student') {
    tutorContent = smsContent.rescheduleByStudent.toTutor
      .replace('<%= tutorName %>', jobInfo.tutorName)
      .replace('<%= studentName %>', jobInfo.studentName)
      .replace('<%= oldStart %>', jobInfo.oldStart)
      .replace('<%= newStart %>', jobInfo.newStart);
  } else {
    tutorContent = smsContent.rescheduleByTutor.toTutor
    .replace('<%= tutorName %>', jobInfo.tutorName)
    .replace('<%= studentName %>', jobInfo.studentName)
    .replace('<%= oldStart %>', jobInfo.oldStart)
    .replace('<%= newStart %>', jobInfo.newStart);
  }
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
  if (jobInfo.rescheduleBy === 'student') {
    studentContent = smsContent.rescheduleByStudent.toStudent
      .replace('<%= studentName %>', jobInfo.studentName)
      .replace('<%= oldStart %>', jobInfo.oldStart)
      .replace('<%= newStart %>', jobInfo.newStart);
  } else {
    studentContent = smsContent.rescheduleByTutor.toStudent
    .replace('<%= tutorName %>', jobInfo.tutorName)
    .replace('<%= studentName %>', jobInfo.studentName)
    .replace('<%= oldStart %>', jobInfo.oldStart)
    .replace('<%= newStart %>', jobInfo.newStart);
  }
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
  processingRescheduleEmail,
  processingRescheduleSms,
};