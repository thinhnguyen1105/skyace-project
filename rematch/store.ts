import { init } from '@rematch/core';
import tutorSchedulePageModel from './models/ui/tutor-schedule-page/model';
import tenantsPageModel from './models/ui/tenants-page/model';
import profileModel from './models/profile/model';
import editProfilePageModel from './models/ui/edit-profile-page/model';
import loginPageModel from './models/ui/login-page/model';
import coursePageModel from './models/ui/courses/model';
import findATutorPageModel from './models/ui/find-tutor-page/model';
import signUpPageModel from './models/ui/register-page/model';
import dataLookupModel from './models/data-lookup/model';
import blogPageModel from './models/ui/blog/model';
import landingPageModel from './models/ui/landing-page/model';
import informationTutorPageModel from './models/ui/information-tutor-page/model';
import myTuitionPageModel from './models/ui/my-tuition/model';
import tuitionDetailPageModel from './models/ui/tuition-detail/model';
import sessionDetailPageModel from './models/ui/session-detail-page/model';
import uploadImagesModel from './models/ui/upload-images/model';
import exchangeRatePageModel from './models/ui/exchange-rate-page/model';
import paypalPageModel from './models/payment-button/model';
import tutoringPageModel from './models/ui/tutoring-page/model';
import groupTuitionDetailPageModel from './models/ui/group-tuition-detail/model';
import resetPasswordPageModel from './models/ui/reset-password-page/model';
import usersPageModel from './models/ui/white-label-admin-users-page/model';
import rolesPageModel from './models/ui/white-label-admin-roles-page/model';
import tuitionsPageModel from './models/ui/white-label-admin-tuitions-page/model';
import transactionsPageModel from './models/ui/white-label-admin-transactions-page/model';
import studentCalendarPageModel from './models/ui/student-calendar-page/model';
import notificationSettingsPageModel from './models/ui/white-label-admin-notification-settings-page/model';
import dashboardModel from './models/ui/white-label-admin-dashboard/model';
import franchisePageModel from './models/ui/franchise-page/model';
import promoCodePageModel from './models/ui/promo-code-page/model';
import distributorDetailPageModel from './models/ui/distributor-detail-page/model';
import tutorDashboardPageModel from './models/ui/tutor-dashboard/model';
import distributorPaymentPageModel from './models/ui/distributor-payment/model';
import partnerPaymentPageModel from './models/ui/partner-payment/model';
import subjectPageModel from './models/ui/white-label-admin-subjects-page/model';
import levelPageModel from './models/ui/white-label-admin-levels-page/model';
import gradePageModel from './models/ui/white-label-admin-grades-page/model';
import languageModel from './models/language/model';

export const initStore = (initialState: any = {}) => {
  return init({
    models: {
      dataLookupModel,
      profileModel,
      tenantsPageModel,
      loginPageModel,
      signUpPageModel,
      tutorSchedulePageModel,
      editProfilePageModel,
      coursePageModel,
      findATutorPageModel,
      rolesPageModel,
      blogPageModel,
      landingPageModel,
      informationTutorPageModel,
      paypalPageModel,
      myTuitionPageModel,
      tuitionDetailPageModel,
      sessionDetailPageModel,
      uploadImagesModel,
      exchangeRatePageModel,
      notificationSettingsPageModel,
      tutoringPageModel,
      groupTuitionDetailPageModel,
      resetPasswordPageModel,
      usersPageModel,
      tuitionsPageModel,
      transactionsPageModel,
      studentCalendarPageModel,
      dashboardModel,
      franchisePageModel,
      promoCodePageModel,
      distributorDetailPageModel,
      tutorDashboardPageModel,
      distributorPaymentPageModel,
      partnerPaymentPageModel,
      subjectPageModel,
      levelPageModel,
      gradePageModel,
      languageModel,
    },
    redux: {
      initialState
    }
  });
};

export default initStore;