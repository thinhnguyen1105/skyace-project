import initNodeMailer from "../node-mailer";
import * as ejs from 'ejs';
import * as path from 'path';
import smsContent from '../sms-content';
import logger from "../../../api/core/logger/log4js";
import initMessageBird from "../message-bird";

const processingNewBookingEmail = (jobInfo, done) => {
  const transporter = initNodeMailer();

  // Send email to tutor
  ejs.renderFile(path.join(__dirname + `../../../../../../static/email-template/new-booking-to-tutor.ejs`), {
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
    pricePayablePerCourse: jobInfo.pricePayablePerCourse,
  }, (err, data) => {
    if (err) {
      throw new Error(err.message || 'Internal server error.');
    }

    const mailOptions = {
      to: jobInfo.tutorEmail,
      from: 'SkyAce Learning <admin@skyace-learning.com>',
      subject: jobInfo.mailSubject,
      html: data,
      attachments: jobInfo.transactionId ? [{
        filename: 'statement.pdf',
        contentType: 'application/pdf',
        path: path.join(__dirname + `../../../../../../static/invoices/${jobInfo.transactionId}-tutor.pdf`)
      }] : []
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
  ejs.renderFile(path.join(__dirname + `../../../../../../static/email-template/new-booking-to-student.ejs`), {
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
    pricePayablePerCourse: jobInfo.pricePayablePerCourse,
  }, (err, data) => {
    if (err) {
      throw new Error(err.message || 'Internal server error.');
    }

    const mailOptions = {
      to: jobInfo.studentEmail,
      from: 'SkyAce Learning <admin@skyace-learning.com>',
      subject: jobInfo.mailSubject,
      html: data,
      attachments: jobInfo.transactionId ? [{
        filename: 'invoice.pdf',
        contentType: 'application/pdf',
        path: path.join(__dirname + `../../../../../../static/invoices/${jobInfo.transactionId}-student.pdf`)
      }] : []
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

const processingNewBookingSms = (jobInfo, done) => {
  const messageBird = initMessageBird();

  // Send sms to tutor
  const tutorContent: string = smsContent.newBooking.toTutor.replace('<%= tutorName %>', jobInfo.tutorName);
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
  let studentContent: string = smsContent.newBooking.toStudent
    .replace('<%= studentName %>', jobInfo.studentName)
    .replace('<%= referenceId %>', jobInfo.referenceId);
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
  processingNewBookingEmail,
  processingNewBookingSms,
};