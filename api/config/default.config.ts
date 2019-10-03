const defaultConfig = {
  app: {
    defaultPageSize: 10,
    maxPageSize: 50,
    gridPage: {
      defaultPageSize: 10,
      pageSizes: [10, 20, 50],
    },
  },
  auth: {
    expiresIn: 3 * 60 * 60,
    secret: 'Ba2THViaoHd8Nn7tNNoRfWxrbi4u1oDefkQtdk01FzqY11Pr8dlM7fkkQnZJWKP',
    googleOauth: {
      clientID: '809846546437-edm3c5a2v55ukfgruceme0aa8upn0crd.apps.googleusercontent.com',
      clientSecret: 'hidVckqUgO-jGm7a0ib41cku',
      callbackURL: 'http://localhost:3000/api/auth/login/googleCallback',
    },
    facebookOauth: {
      clientID: '1842008296094931',
      clientSecret: '40bb0bb62067c036a3e8e1af22a91006',
      callbackURL: 'http://localhost:3000/api/auth/login/facebookCallback',
    },
  },
  database: {
    mongoConnectionString: 'mongodb://localhost:27017/skyace-prod',
    mongoConnectionToken: 'mongoConnectionToken',
  },
  swagger: {
    title: 'Techkids Web Starter Kit API',
    description: 'API documentation',
    version: '1.0',
    url: '/api/docs',
    jsonUrl: '/api/docs.json',
    basePath: '/api',
    setHomeAsApiDoc: false,
  },
  nextjs: {
    apiUrl: 'http://localhost:3000/api',
    tenantUrl: 'http://<%tenant%>.localhost:3000',
    hostUrl: 'http://localhost:3000',
    tailUrl: '.localhost:3000',
    checkUrlRegex: /http?:\/\/(\S*\.)?localhost:3000/,
    checkUrlRegexFrontEnd: /(\S*\.)?localhost:3000/,
    cookieDomain: 'localhost',
    corsOrigin: /.*\.localhost:3000$/,
    adminTenantId: '5b59880ef172d619186f024a',
  },
  messageBird: {
    accessKey: 'R9b8p6qiVwd0eKmD1nBWfHuVl',
  },
  paypal: {
    sandbox: 'AW-R0iJ8Coy1sRH3CwDUomRjZylmhTyOogjQ32zNyIna3UEexT3tDuUv-Cgo1cSHNvyYcFfDgwtKDNBl',
    production: 'Aftguy-W5DoI60LJVXp8WpQsuduChEXX_SXS4yz2M6oMcVCnAchehcLFHzvJJl3xVjexfqLM2LhWD9u7',
    clientId: 'AW-R0iJ8Coy1sRH3CwDUomRjZylmhTyOogjQ32zNyIna3UEexT3tDuUv-Cgo1cSHNvyYcFfDgwtKDNBl',
    secret: 'EJT895YlRQ_N7cKvpUPqocWKmdT_MoLwQ9i-WLyyW78_9tTL1W3HvQuNAX1f8AZNQ5xbGA1mvwTfPrfO',
    //for skyace account
    // clientId: 'Aftguy-W5DoI60LJVXp8WpQsuduChEXX_SXS4yz2M6oMcVCnAchehcLFHzvJJl3xVjexfqLM2LhWD9u7',
    // secret: 'EEVrrCPej_gzroNrXSjEJGt4M3xnlQcT95f7ywraK8xKpRLkBmATXqcySpmB8Nhw3Z7rfUlZ-S4hz9U7',
  },
  firebase: {
    apiKey: "AIzaSyD4yuxgDqgYdou4P6Tvxkzi0HEWcVnfyos",
    authDomain: "skyace-learning.firebaseapp.com",
    databaseURL: "https://skyace-learning.firebaseio.com",
    projectId: "skyace-learning",
    storageBucket: "skyace-learning.appspot.com",
    messagingSenderId: "95330634190"
  },
  sysadmin: {
    defaultCommissionFee: 75,
  }
};

export default defaultConfig;