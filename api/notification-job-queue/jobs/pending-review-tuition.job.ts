import initNodeMailer from "../node-mailer";
import * as ejs from 'ejs';
import * as path from 'path';
import logger from "../../../api/core/logger/log4js";

const processingPendingReviewTuitionEmail = (jobInfo, done) => {
  const transporter = initNodeMailer();

  // Send email to admin
  ejs.renderFile(path.join(__dirname + `../../../../../../static/email-template/cancel-tuition-by-${jobInfo.cancelBy === 'student' ? 'student' : 'tutor'}-to-admin.ejs`), {
    adminName: jobInfo.adminName,
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
      to: jobInfo.adminEmail,
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

export {
  processingPendingReviewTuitionEmail,
};