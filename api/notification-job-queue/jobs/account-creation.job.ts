import * as ejs from 'ejs';
import * as path from 'path';
import initNodeMailer from '../node-mailer';
import smsContent from '../sms-content';
import logger from '../../../api/core/logger/log4js';
import initMessageBird from '../message-bird';

const processingAccountCreationEmail = (jobInfo, done) => {
  const transporter = initNodeMailer();
  
  ejs.renderFile(path.join(__dirname + `../../../../../../static/email-template/account-registration-to-${jobInfo.isStudent ? 'student' : 'tutor'}.ejs`), {
    studentName: jobInfo.studentName,
    tutorName: jobInfo.tutorName,
    activateUrl: jobInfo.activateUrl,
  }, (err, data) => {
    if (err) {
      throw new Error(err.message || 'Internal server error.');
    }

    const mailOptions = {
      to: jobInfo.receiverEmail,
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

const processingAccountCreationSms = async (jobInfo, done) => {
  // Send SMS
  const messageBird = initMessageBird();

  let content: string = '';
  if (jobInfo.isStudent) {
    content = smsContent.accountRegistration.toStudent.replace('<%= studentName %>', jobInfo.studentName);
  } else {
    content = smsContent.accountRegistration.toTutor.replace('<%= tutorName %>', jobInfo.tutorName);
  }

  messageBird.messages.create({
    originator: 'SkyAce',
    recipients: [jobInfo.receiverPhone],
    body: content,
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
  processingAccountCreationEmail,
  processingAccountCreationSms,
};