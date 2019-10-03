import * as kue from 'kue';
import logger from '../core/logger/log4js';
import { processingRescheduleEmail, processingRescheduleSms } from './jobs/re-schedule.job';
import { processingAccountCreationSms, processingAccountCreationEmail } from './jobs/account-creation.job';
import { processingCancelTuitionSms, processingCancelTuitionEmail } from './jobs/cancel-tuition.job';
import { processingNewBookingSms, processingNewBookingEmail } from './jobs/newbooking.job';
import { processingResetPasswordEmail } from './jobs/reset-password.job';
import { processingAdminCreationEmail } from './jobs/admin-creation.job';
import { processingDistributorCreationEmail } from './jobs/distributor-creation.job';
import { processingPendingReviewTuitionEmail } from './jobs/pending-review-tuition.job';
import { processingCancelUnpaidTuitionEmail, processingCancelUnpaidTuitionSms } from './jobs/cancel-unpaid-tuition.job';
import { processingNotiUnpaidTuitionEmail, processingNotiUnpaidTuitionSms } from './jobs/noti-unpaid-tuition.job';

const notificationQueue = kue.createQueue();
notificationQueue.setMaxListeners(100);

notificationQueue.on( 'error', (error => {
  logger.error(`${error.message} ${error.stack}`);
}));

notificationQueue.process('accountCreationEmail', (job, done) => {
  processingAccountCreationEmail(job.data, done);
});
notificationQueue.process('accountCreationSms', (job, done) => {
  processingAccountCreationSms(job.data, done);
});

notificationQueue.process('cancelTuitionEmail', (job, done) => {
  processingCancelTuitionEmail(job.data, done);
});
notificationQueue.process('cancelTuitionSms', (job, done) => {
  processingCancelTuitionSms(job.data, done);
});

notificationQueue.process('cancelUnpaidTuitionEmail', (job, done) => {
  processingCancelUnpaidTuitionEmail(job.data, done);
});
notificationQueue.process('cancelUnpaidTuitionSms', (job, done) => {
  processingCancelUnpaidTuitionSms(job.data, done);
});

notificationQueue.process('notiUnpaidTuitionEmail', (job, done) => {
  processingNotiUnpaidTuitionEmail(job.data, done);
});
notificationQueue.process('notiUnpaidTuitionSms', (job, done) => {
  processingNotiUnpaidTuitionSms(job.data, done);
});

notificationQueue.process('rescheduleEmail', (job, done) => {
  processingRescheduleEmail(job.data, done);
});
notificationQueue.process('rescheduleSms', (job, done) => {
  processingRescheduleSms(job.data, done);
});

notificationQueue.process('newBookingEmail', (job, done) => {
  processingNewBookingEmail(job.data, done);
});
notificationQueue.process('newBookingSms', (job, done) => {
  processingNewBookingSms(job.data, done);
});

notificationQueue.process('resetPasswordEmail', (job, done) => {
  processingResetPasswordEmail(job.data, done);
});

notificationQueue.process('adminCreationEmail', (job, done) => {
  processingAdminCreationEmail(job.data, done);
});

notificationQueue.process('distributorCreationEmail', (job, done) => {
  processingDistributorCreationEmail(job.data, done);
});

notificationQueue.process('pendingReviewTuition', (job, done) => {
  processingPendingReviewTuitionEmail(job.data, done);
});

export default notificationQueue;