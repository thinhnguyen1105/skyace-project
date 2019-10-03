import * as nodemailer from 'nodemailer';

const initNodeMailer= () => {
  return nodemailer.createTransport({
    // service: 'gmail',
    // host: 'smtp.gmail.com',
    // auth: {
    //   user: 'tienloinguyen22@gmail.com',
    //   pass: 'tienloi22'
    // },
    host: 'mail.skyace-learning.com',
    // secure: false,
    port: 587,
    ignoreTLS: true,
    auth: {
      user: 'admin@skyace-learning.com',
      pass: 'gqmdExhCe3FA'
    },
  });
};

export default initNodeMailer;