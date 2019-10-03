import AuthServiceProxy from './auth-service-proxy';
import TenantsServiceProxy from './tenants-service-proxy';
import UsersServiceProxy from './users-service-proxy';
import CourseServiceProxy from './course-service-proxy';
import config from '../api/config';
import DataLookupServiceProxy from './data-lookup-service-proxy';
import RolesServiceProxy from './roles-service-proxy';
import BlogServiceProxy from './blog-service-proxy';
import LandingPageServiceProxy from './landing-page-service-proxy';
import TutorSchedulesServiceProxy from './tutor-schedule-service-proxy';
import TransactionServiceProxy from './transaction-service-proxy';
import CourseForTutorServiceProxy from './course-for-tutor-service-proxy';
import TuitionsServiceProxy from './tuitions-service-proxy';
import SessionsServiceProxy from './session-service-proxy';
import UploadImagesServiceProxy from './upload-images-service-proxy';
import CurrencyServiceProxy from './currency-service-proxy';
import NotificationSettingsServiceProxy from './notification-setting-service-proxy';
import ConversationsServiceProxy from './conversations-service-proxy';
import DashboardServiceProxy from './dashboard-service-proxy';
import PromoCodeServiceProxy from './promo-code-service-proxy';
import MetadataServiceProxy from './metadata-service-proxy';
import LanguageServiceProxy from './language-service-proxy';

const getAuthService = (token = '') => {
  return AuthServiceProxy(config.nextjs.apiUrl, token);
};

const getTenantsService = (token = '') => {
  return TenantsServiceProxy(config.nextjs.apiUrl, token);
};

const getUsersService = (token = '') => {
  return UsersServiceProxy(config.nextjs.apiUrl, token);
};

const getCourseService = (token = '') => {
  return CourseServiceProxy(config.nextjs.apiUrl, token);
};

const getDataLookupService = (token = '') => {
  return DataLookupServiceProxy(config.nextjs.apiUrl, token);
};

const getBlogService = (token = '') => {
  return BlogServiceProxy(config.nextjs.apiUrl, token);
};

const getRolesService = (token = '') => {
  return RolesServiceProxy(config.nextjs.apiUrl, token);
};

const getLandingPageService = (token = '') => {
  return LandingPageServiceProxy(config.nextjs.apiUrl, token);
};

const getTutorSchedulesService = (token = '') => {
  return TutorSchedulesServiceProxy(config.nextjs.apiUrl, token);
};

const getTransactionService = (token = '') => {
  return TransactionServiceProxy(config.nextjs.apiUrl, token);
};
const getCourseForTutorService = (token = '') => {
  return CourseForTutorServiceProxy(config.nextjs.apiUrl, token);
};

const getTuitionsService = (token = '') => {
  return TuitionsServiceProxy(config.nextjs.apiUrl, token);
};

const getSessionsService = (token = '') => {
  return SessionsServiceProxy(config.nextjs.apiUrl, token);
};

const getUploadImagesService = (token = '') => {
  return UploadImagesServiceProxy(config.nextjs.apiUrl, token);
};

const getCurrencyService = (token = '') => {
  return CurrencyServiceProxy(config.nextjs.apiUrl, token);
};

const getNotificationSettingsService = (token = '') => {
  return NotificationSettingsServiceProxy(config.nextjs.apiUrl, token);
};

const getConversationService = (token = '') => {
  return ConversationsServiceProxy(config.nextjs.apiUrl, token);
};

const getDashboardService = (token = '') => {
  return DashboardServiceProxy(config.nextjs.apiUrl, token);
}

const getPromoCodeService = (token = '') => {
  return PromoCodeServiceProxy(config.nextjs.apiUrl, token);
}

const getMetadataService = (token = '') => {
  return MetadataServiceProxy(config.nextjs.apiUrl, token);
}

const getLanguageService = (token = '') => {
  return LanguageServiceProxy(config.nextjs.apiUrl, token);
}

export {
  getAuthService,
  getTenantsService,
  getUsersService,
  getCourseService,
  getDataLookupService,
  getRolesService,
  getBlogService,
  getLandingPageService,
  getTutorSchedulesService,
  getTransactionService,
  getCourseForTutorService,
  getTuitionsService,
  getSessionsService,
  getUploadImagesService,
  getCurrencyService,
  getNotificationSettingsService,
  getConversationService,
  getDashboardService,
  getPromoCodeService,
  getMetadataService,
  getLanguageService,
};
