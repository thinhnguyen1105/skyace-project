import * as ejs from 'ejs';
import * as path from 'path';
import initNodeMailer from '../node-mailer';
import logger from '../../../api/core/logger/log4js';

const processingAdminCreationEmail = (jobInfo, done) => {
  const transporter = initNodeMailer();
  
  ejs.renderFile(path.join(__dirname + `../../../../../../static/email-template/admin-registration.ejs`), {
    adminName: jobInfo.adminName,
    partner: jobInfo.partner,
    email: jobInfo.email,
    password: jobInfo.password,
    domain: jobInfo.domain
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

export {
  processingAdminCreationEmail,
};