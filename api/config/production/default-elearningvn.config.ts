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
      callbackURL: 'https://skyace.techkids.io/api/auth/login/googleCallback',
    },
    facebookOauth: {
      clientID: '1842008296094931',
      clientSecret: '40bb0bb62067c036a3e8e1af22a91006',
      callbackURL: 'https://skyace.techkids.io/api/auth/login/facebookCallback',
    },
  },
  database: {
    mongoConnectionString: 'mongodb://localhost:27017/skyace',
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
    apiUrl: 'https://elearningvn.site/api',
    tenantUrl: 'http://<%tenant%>.elearningvn.site',
    hostUrl: 'https://elearningvn.site',
    tailUrl : '.elearningvn.site',
    checkUrlRegex: /https?:\/\/(\S*\.)?elearningvn.site/,
    checkUrlRegexFrontEnd: /(\S*\.)?elearningvn.site/,
    cookieDomain: '.elearningvn.site',
    corsOrigin: /.*\.elearningvn.site$/,
    adminTenantId: '5b59880ef172d619186f024a',
  },
  messageBird: {
    accessKey: 'R9b8p6qiVwd0eKmD1nBWfHuVl',
  },
  paypal: {
    sandbox: 'AVh4kYu1KzIvZW1XPFdBO67myAn0-QqM9io97mgmugHwi71Ba2K_Zasex0GgxQT8MQsXNyHhumaFgbYR',
    production: 'AQYWiZUChBple_GbUK_YIze2SyZ0TlEQ4UsfdjPSiQ9PRVcc-A6zA5Zi7pQab5kn9IjQDYx1upp_fCPr',
    clientId: 'AVh4kYu1KzIvZW1XPFdBO67myAn0-QqM9io97mgmugHwi71Ba2K_Zasex0GgxQT8MQsXNyHhumaFgbYR',
    secret: 'EJJIk34mDThXgyRLPB9YuRSA8mphBWuRH8lm63y1CPSOKbepe_HeBYlHl_xQlM59FOyr1Qof7sEcrKtw',
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