import * as log4js from 'log4js';
const setupLogger = () => {
  if (process.env.NODE_ENV === 'development') {
    log4js.configure({
      appenders: { console: { type: 'console' } },
      categories: { default: { appenders: ['console'], level: 'ALL' } },
    });
  } else {
    log4js.configure({
      appenders: {
        everything: { type: 'dateFile', filename: 'logs/logs.log' },
      },
      categories: {
        default: { appenders: ['everything'], level: 'ALL' },
      },
    });
  }
};

const logger = log4js.getLogger();
logger.level = 'debug'; // default level is OFF - which means no logs at all.

export default logger;
export { setupLogger };
