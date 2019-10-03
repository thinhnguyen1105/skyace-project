import * as express from 'express';
import * as next from 'next';
import * as jwtDecode from 'jwt-decode';
import CheckTenant from './auth/check-tenant';
import Authorize from './auth/authorization';
import blogService from '../api/modules/website/blog/service';
import landingPageService from '../api/modules/website/landing-page/service';
import imagesService from '../api/modules/website/upload-image/service';
import currencyService from '../api/modules/elearning/currency-exchange/service';
import usersService from '../api/modules/auth/users/service';
import tenantsService from '../api/modules/auth/tenants/service';
import rolesService from '../api/modules/auth/roles/service';
import courseForTutorService from '../api/modules/elearning/course-for-tutor/service';
import courseService from '../api/modules/elearning/courses/service';
import tuitionsService from '../api/modules/elearning/tuitions/service';
import sessionsService from '../api/modules/elearning/sessions/service';
import groupTuitionsService from '../api/modules/elearning/group-tuitions/service';
import notificationSettingsService from '../api/modules/host/notification-settings/service';
import transactionsService from '../api/modules/payment/transactions/service';
import promoCodeService from '../api/modules/payment/promo-code/service';
import ratingService from '../api/modules/elearning/ratings/service';

const setupNextjsRoutes = (server: express.Express, app: next.Server) => {
  const handle = app.getRequestHandler();
  server.get('/_next/*', (req, res) => {
    handle(req, res);
  });

  server.get('/static/*', (req, res) => {
    handle(req, res);
  });
};

const setupPublicRoutes = (server: express.Express, app: next.Server) => {
  server.get('/error', (req, res) => {
    app.render(req, res, '/error', req.query);
  });

  server.use(CheckTenant());

  server.get('/', Authorize(), async (req: any, res) => {
    if (req.query.profile && req.query.profile.isLoggedIn) {
      if (req.query.profile.roles.indexOf('tutor') > -1) {
        res.redirect('/tutor-dashboard');
      } else if (req.query.profile.roles.indexOf('student') > -1) {
        res.redirect('/my-tuition');
      } else if (req.query.profile.roles.indexOf('sysadmin') > -1) {
        res.redirect('/white-label-partners');
      } else if (req.query.profile.roles.indexOf('admin') > -1) {
        res.redirect('/admin/dashboard');
      } else if (req.query.profile.roles.indexOf('franchise') > -1) {
        res.redirect('/white-label-partners');
      } else {
        res.redirect('/my-tuition');
      }
    } else {
      const blogsPromise = blogService.getActivePost({
        searchInput: '',
        pageNumber: 1,
        pageSize: 3,
        sortBy: 'createdAt',
        asc: false
      });
      const landingPagePromise = landingPageService.getLandingPageInfo(req.tenant._id ? req.tenant._id : 'default');
      const [blogs, landingPage] = await Promise.all([blogsPromise, landingPagePromise]);

      app.render(req, res, '/index', {
        ...req.query,
        blogs,
        landingPage,
      });
    }
  });

  server.get('/terms-and-conditions', async (req: any, res) => {
    const landingPagePromise = landingPageService.getLandingPageInfo(req.tenant._id ? req.tenant._id : 'default');
    const [landingPage] = await Promise.all([landingPagePromise]);
    app.render(req, res, '/terms-and-conditions', { ...req.query, landingPage });
  });

  server.get('/privacy-policy', async (req: any, res) => {
    const landingPagePromise = landingPageService.getLandingPageInfo(req.tenant._id ? req.tenant._id : 'default');

    const [landingPage] = await Promise.all([landingPagePromise]);
    app.render(req, res, '/privacy-policy', { ...req.query, landingPage });
  });

  server.get('/faq', async (req: any, res) => {
    const landingPagePromise = landingPageService.getLandingPageInfo(req.tenant._id ? req.tenant._id : 'default');

    const [landingPage] = await Promise.all([landingPagePromise]);
    app.render(req, res, '/faq', { ...req.query, landingPage });
  });

  server.get('/reset-password', (req, res) => {
    if (!req.query.token) {
      res.redirect('/');
    } else {
      const tokenData: any = jwtDecode(req.query.token);
      if (tokenData && tokenData.exp && tokenData.exp < Math.round(new Date().getTime() / 1000)) {
        res.redirect('/');
      } else {
        app.render(req, res, '/reset-password', {
          ...req.query,
          accountId: tokenData._id,
          email: tokenData.email,
        });
      }
    }
  });

  server.get('/posts/:title', async (req: any, res) => {
    const postDetailPromise = blogService.getPostByFriendlyUrl(req.params.title);
    const landingPagePromise = landingPageService.getLandingPageInfo(req.tenant._id ? req.tenant._id : 'default');

    const [postDetail, landingPage] = await Promise.all([postDetailPromise, landingPagePromise]);

    app.render(req, res, '/blog-detail', {
      ...req.query,
      title: req.params.title,
      postDetail,
      landingPage,
    }, Object.assign({
      title: req.params.title,
      slug: req.params.slug,
      name: req.params.name
    }, req.query));
  });

  server.get('/blog-detail', (req, res) => {
    if (req.query.title) {
      res.redirect(`/blog/${req.query.title}`);
    }
    res.redirect('/blog');
  });

  server.get('/upload-images', Authorize('sysadmin'), async (req, res) => {
    const images = await imagesService.getImages('default');
    app.render(req, res, '/upload-images', {
      ...req.query,
      images,
    });
  });

  server.get('/blog/blog-page', Authorize('sysadmin'), async (req, res) => {
    const blogs = await blogService.findPostByTitle({
      searchInput: '',
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'createdAt',
      asc: true
    });
    app.render(req, res, '/blog/blog-page', {
      ...req.query,
      blogs,
    });
  });

  server.get('/exchange-rate', Authorize('sysadmin'), async (req, res) => {
    const currencies = await currencyService.getAllCurrencies();

    app.render(req, res, '/exchange-rate', {
      ...req.query,
      currencies,
    });
  });

  server.get('/language', Authorize('sysadmin'), async (req, res) => {
    app.render(req, res, '/language', {
      ...req.query,
    });
  });

  server.get('/login-student/findATutor', Authorize(), async (req: any, res) => {
    const tutors = await usersService.searchUsers(req.tenant._id, {
      match: {
        ...{
          search: '',
          "biography.language": '',
          "biography.gender": '',
          "biography.nationality": '',
          "education.highestEducation": '',
          "biography.race": '',
        },
        ...{}
      },
      range: {
        minPrice: 0,
        maxPrice: 100,
        minYearsOfExp: 0,
        maxYearsOfExp: 10,
        minRating: 0,
        maxRating: 5,
      },
      pagination: {
        pageNumber: 1,
        pageSize: 10,
      },
      sort: {
        sortBy: 'fullName',
        asc: true,
      }
    });

    app.render(req, res, '/login-student/findATutor', {
      ...req.query,
      tutors,
    });
  });

  server.get('/login-student/my-calendar', Authorize('student'), async (req: any, res) => {
    app.render(req, res, '/login-student/my-calendar', {
      ...req.query,
    });
  });

  server.get('/login-student/informationTutor/:tutorId', Authorize(), async (req: any, res) => {
    const tutorInfo = await usersService.findTutorById(req.tenant._id, req.params.tutorId);

    let tuitionInfo: any = {};
    if (req.query.extend) {
      tuitionInfo = await tuitionsService.findByTuitionId(req.tenant._id, req.query.tuition);
    }

    var studentTuitionList = null as any;
    if (req.query.profile) {
      studentTuitionList = await tuitionsService.findAllTuitionsByStudentId(req.tenant._id, { studentId: req.query.profile._id, isCompleted: false, isCanceled: false, isPendingReview: false });
    } else {
      studentTuitionList = null;
    }
    app.render(req, res, '/login-student/informationTutor', {
      ...req.query,
      tutorId: req.params.tutorId,
      tutorInfo,
      tuitionInfo,
      studentTuitionList,
    });
  });

  server.get('/login-student/informationGroupTuition/:groupId', Authorize(), async (req: any, res) => {
    const groupInfo = await groupTuitionsService.findByTuitionId(req.tenant._id, req.params.groupId);
    const tutorInfo = await usersService.findTutorById(req.tenant._id, groupInfo.tutor._id);
    const ratings = await ratingService.findByUserId(req.tenant._id , {
      userId: groupInfo.tutor._id,
      pageSize: 5,
      pageNumber: 1
    });

    app.render(req, res, '/login-student/informationGroupTuition', {
      ...req.query,
      groupId: req.params.groupId,
      groupInfo,
      tutorInfo,
      ratings
    });
  });

  server.get('/login-student/editProfileStudent', Authorize('student'), (req, res) => {
    app.render(req, res, '/login-student/editProfileStudent', req.query);
  });

  server.get('/calendar/tutor', Authorize('tutor'), (req, res) => {
    app.render(req, res, '/calendar/tutor', req.query);
  });

  server.get('/calendar/session-detail/:sessionId', Authorize(), async (req: any, res) => {
    app.render(req, res, '/calendar/session-detail', {
      ...req.query, sessionId: req.params.sessionId,
    });
  });

  server.get('/calendar/group-session-detail/:sessionId', Authorize(), (req, res) => {
    app.render(req, res, '/calendar/group-session-detail', { ...req.query, sessionId: req.params.sessionId });
  });

  server.get('/white-label-partners', Authorize(['sysadmin', 'franchise']), async (req, res) => {
    var tenants = {
      data: [],
      total: 0
    } as any;
    if (req.query.profile) {
      if (req.query.profile.roles && req.query.profile.roles[0] === 'sysadmin') {
        tenants = await tenantsService.findTenants({
          search: '',
          pageNumber: 1,
          pageSize: 10,
          sortBy: 'name',
          asc: true,
        });
      } else if (req.query.profile.roles && req.query.profile.roles[0] === 'franchise') {
        tenants = await tenantsService.findTenantsByAdmin({
          search: '',
          pageNumber: 1,
          pageSize: 10,
          sortBy: 'name',
          asc: true,
          adminCreated: req.query.profile._id
        })
      }
    }
    app.render(req, res, '/tenants', {
      ...req.query,
      tenants,
    });
  });

  server.get('/tenant-detail/:tenantId', Authorize(['sysadmin', 'franchise']), async (req, res) => {
    const tenantInfo: any = await tenantsService.findTenantById(req.params.tenantId);

    app.render(req, res, '/tenant-detail', {
      ...req.query,
      tenantId: req.params.tenantId,
      profile: req.query.profile,
      tenantInfo,
    });
  });

  server.get('/distributor-detail/:userId', Authorize(['sysadmin', 'franchise']), async (req, res) => {
    const distributorInfo: any = await usersService.findById(req.params.userId);

    app.render(req, res, '/distributor-detail', {
      ...req.query,
      userId: req.params.tenantId,
      profile: req.query.profile,
      distributorInfo,
    }, Object.assign(
      {
        userId: req.params.tenantId,
        slug: req.params.slug,
        name: req.params.name
      },
      req.query,
    )
    );
  });

  server.get('/distributor-payment/:userId', Authorize(['sysadmin', 'franchise']), async (req, res) => {
    const distributorInfo: any = await usersService.findById(req.params.userId);
    const distributorPayment: any = await usersService.getPaymentOfDistributor(req.params.userId);
    const distributorPaycheck: any = await usersService.getDistributorPaycheck(req.params.userId);

    app.render(req, res, '/payment-record/distributor', {
      ...req.query,
      userId: req.params.tenantId,
      profile: req.query.profile,
      distributorInfo,
      distributorPayment,
      distributorPaycheck
    }, Object.assign(
      {
        userId: req.params.tenantId,
        slug: req.params.slug,
        name: req.params.name
      },
      req.query,
    )
    );
  });

  server.get('/partner-payment/:partnerId', Authorize(['sysadmin', 'franchise', 'admin']), async (req, res) => {
    const partnerInfo: any = await tenantsService.findTenantById(req.params.partnerId);
    const partnerPayment: any = await tenantsService.getPartnerPayments(req.params.partnerId);
    const partnerPaycheck: any = await tenantsService.getPartnerPaycheck(req.params.partnerId);

    app.render(req, res, '/payment-record/white-label', {
      ...req.query,
      partnerId: req.params.tenantId,
      profile: req.query.profile,
      partnerInfo,
      partnerPayment,
      partnerPaycheck
    }, Object.assign(
      {
        userId: req.params.tenantId,
        slug: req.params.slug,
        name: req.params.name
      },
      req.query,
    )
    );
  });

  server.get('/tenant-detail', Authorize('admin'), (req, res) => {
    if (req.query.tenantId) {
      res.redirect(`/tenant-detail/${req.query.tenantId}`);
    }
    res.redirect('/tenant-detail');
  });

  server.get('/distributors', Authorize('sysadmin'), async (req: any, res) => {
    const users = await usersService.findFranchises({
      search: "",
      role: '',
      pageSize: 10,
      pageNumber: 1,
      sortBy: "email",
      asc: true,
    });

    app.render(req, res, '/franchise', {
      ...req.query,
      users,
    });
  });

  server.get('/admin/promo-code', Authorize(['sysadmin' , 'admin']), async (req: any, res) => {
    const promoCodes = await promoCodeService.findPromoCodes(req.tenant._id, {
      search: "",
      pageSize: 10,
      pageNumber: 1,
      sortBy: "name",
      asc: true,
    })
    app.render(req, res, '/promo-code', {
      ...req.query,
      promoCodes
    });
  })

  server.get('/edit-profile-user', Authorize('tutor'), (req, res) => {
    app.render(req, res, '/edit-profile-user', req.query);
  });

  server.get('/tutoring', Authorize('tutor'), async (req: any, res) => {
    const coursesByTutorIdPromise = courseForTutorService.findByTutorId(req.query.profile._id, req.tenant._id);
    const coursesAvailablePromise = courseService.getAllCourses(req.tenant._id);
    const tutorInfo = await usersService.findTutorById(req.tenant._id, req.query.profile._id);

    const [coursesByTutorId, coursesAvailable] = await Promise.all([coursesByTutorIdPromise, coursesAvailablePromise]);

    app.render(req, res, '/tutoring', {
      ...req.query,
      coursesByTutorId,
      coursesAvailable,
      tutorInfo,
    });
  })

  server.get('/tutoring/subjects', Authorize('tutor'), async (req: any, res) => {
    const coursesByTutorIdPromise = courseForTutorService.findByTutorId(req.query.profile._id, req.tenant._id);
    const coursesAvailablePromise = courseService.getAllCourses(req.tenant._id);
    const tutorInfo = await usersService.findTutorById(req.tenant._id, req.query.profile._id);

    const [coursesByTutorId, coursesAvailable] = await Promise.all([coursesByTutorIdPromise, coursesAvailablePromise]);

    app.render(req, res, '/tutoring', {
      ...req.query,
      coursesByTutorId,
      coursesAvailable,
      tutorInfo,
    });
  })

  server.get('/my-tuition', Authorize(), async (req: any, res) => {
    let tuitions: any = {
      data: [],
      total: 0,
    };
    if (req.query.profile.roles.indexOf('student') > -1) {
      tuitions = await tuitionsService.findTuitionsByStudentId(req.tenant._id, {
        isCompleted: false,
        userId: req.query.profile._id,
        pageNumber: 1,
        pageSize: 5,
        sortBy: 'createdAt',
        asc: true,
        isCanceled: false,
      });
    } else if (req.query.profile.roles.indexOf('tutor') > -1) {
      tuitions = await tuitionsService.findTuitionsByTutorId(req.tenant._id, {
        isCompleted: false,
        userId: req.query.profile._id,
        pageNumber: 1,
        pageSize: 5,
        sortBy: 'createdAt',
        asc: true,
        isCanceled: false,
      });
    }

    app.render(req, res, '/my-tuition', {
      ...req.query,
      tuitions,
    });
  });

  server.get('/tutor-dashboard', Authorize('tutor'), async (req: any, res) => {
    const newestBookingsPromise = tuitionsService.findNewestTuitionsBooking(req.tenant._id, req.query.profile._id);
    const upcomingTuitionsPromise = sessionsService.findUpcomingTuitions(req.tenant._id, req.query.profile._id);
    const [newestBookings, upcomingTuitions] = await Promise.all([newestBookingsPromise, upcomingTuitionsPromise]);

    app.render(req, res, '/tutor-dashboard', {
      ...req.query,
      newestBookings,
      upcomingTuitions,
    });
  });

  server.get('/calendar/tuition-detail/:tuitionId', Authorize(), async (req: any, res) => {
    const tuitionInfo = await tuitionsService.findByTuitionId(req.tenant._id, req.params.tuitionId);

    app.render(req, res, '/calendar/tuition-detail', {
      ...req.query,
      tuitionId: req.params.tuitionId,
      tuitionInfo,
    });
  });

  server.get('/calendar/group-tuition-detail/:tuitionId', Authorize(), async (req: any, res) => {
    const groupTuitionInfo = await groupTuitionsService.findByTuitionId(req.tenant._id, req.params.tuitionId);

    app.render(req, res, '/calendar/group-tuition-detail', {
      ...req.query,
      tuitionId: req.params.tuitionId,
      groupTuitionInfo
    })
  })

  // White label admin panel
  server.get('/admin/company-info', Authorize('admin'), (req, res) => {
    app.render(req, res, '/white-label-admin/update-tenant-info', req.query);
  });

  server.get('/admin/landing-page', Authorize('admin'), async (req: any, res) => {
    const blogsPromise = blogService.findPostByTitle({
      searchInput: '',
      pageNumber: 1,
      pageSize: 3,
      sortBy: 'createdAt',
      asc: false
    });
    const landingPagePromise = landingPageService.getLandingPageInfo(req.tenant._id ? req.tenant._id : 'default');

    const [blogs, landingPage] = await Promise.all([blogsPromise, landingPagePromise]);
    app.render(req, res, '/white-label-admin/landing-page', {
      ...req.query,
      blogs,
      landingPage,
    });
  });

  server.get('/admin/dashboard', Authorize('admin'), (req: any, res) => {
    app.render(req, res, '/white-label-admin/dashboard', {
      ...req.query,
      tenant: req.tenant._id
    });
  });

  server.get('/admin/tuitions', Authorize('admin'), async (req: any, res) => {
    const tuitions = await tuitionsService.findTuitions(req.tenant._id, {
      search: '',
      isCompleted: undefined,
      isCanceled: undefined,
      isPendingReview: undefined,
      pageSize: 10,
      pageNumber: 1,
      sortBy: "createdAt",
      asc: true,
      status: []
    });

    app.render(req, res, '/white-label-admin/tuitions', {
      ...req.query,
      tuitions
    });
  });

  server.get('/admin/student-transactions', Authorize('admin'), async (req: any, res) => {
    const transactions = await transactionsService.findTransactions(req.tenant._id, {
      search: '',
      pageSize: 10,
      pageNumber: 1,
      sortBy: "createdAt",
      asc: true,
    });

    app.render(req, res, '/white-label-admin/transactions', { ...req.query, transactions });
  });

  server.get('/admin/tutor-transactions', Authorize('admin'), async (req: any, res) => {
    const transactions = await transactionsService.findTransactions(req.tenant._id, {
      search: '',
      pageSize: 10,
      pageNumber: 1,
      sortBy: "createdAt",
      asc: true,
    });

    app.render(req, res, '/white-label-admin/tutor-transactions', { ...req.query, transactions });
  });

  server.get('/admin/rating', Authorize('admin'), (req, res) => {
    app.render(req, res, '/white-label-admin/rating', req.query);
  });

  server.get('/admin/roles', Authorize('admin'), async (req, res) => {
    const roles = await rolesService.findRoles({
      search: "",
      filter: undefined,
      pageSize: 10,
      pageNumber: 1,
      sortBy: "name",
      asc: true,
    });

    app.render(req, res, '/white-label-admin/roles', {
      ...req.query,
      roles,
    });
  });

  server.get('/admin/users', Authorize('admin'), async (req: any, res) => {
    const users = await usersService.findUsers(req.tenant._id, {
      search: "",
      role: '',
      pageSize: 10,
      pageNumber: 1,
      sortBy: "email",
      asc: true,
    });

    app.render(req, res, '/white-label-admin/users', {
      ...req.query,
      users,
    });
  });

  server.get('/admin/edit-profile-by-admin/:userId/:roles', Authorize('admin'), (req, res) => {
    app.render(req, res, '/white-label-admin/edit-profile-by-admin', {
      ...req.query,
      userId: req.params.userId,
      roles: req.params.roles,
    });
  });

  server.get('/admin/academic-setup', Authorize('admin'), (req, res) => {
    app.render(req, res, '/white-label-admin/academic-setup', req.query);
  });

  server.get('/admin/subject', Authorize('admin'), (req, res) => {
    app.render(req, res, '/white-label-admin/subject', req.query);
  });

  server.get('/admin/level', Authorize('admin'), (req, res) => {
    app.render(req, res, '/white-label-admin/level', req.query);
  });

  server.get('/admin/grade', Authorize('admin'), (req, res) => {
    app.render(req, res, '/white-label-admin/grade', req.query);
  });

  server.get('/admin/commission-fee', Authorize('sysadmin'), (req, res) => {
    app.render(req, res, '/white-label-admin/commission-fee', req.query);
  });

  server.get('/admin/notifications', Authorize('admin'), async (req: any, res) => {
    const notificationSetting = await notificationSettingsService.findSettingByTenantId(req.tenant._id);

    app.render(req, res, '/white-label-admin/notifications', {
      ...req.query,
      notificationSetting,
    });
  });

  server.get('/blog/list', (req, res) => {
    app.render(req, res, '/blog/list', req.query);
  });
};

const bootstrapNextjs = async (server: express.Express) => {
  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev });
  await app.prepare();

  setupNextjsRoutes(server, app);
  setupPublicRoutes(server, app);
};

export { bootstrapNextjs };
