import * as jwt from 'jsonwebtoken';
import config from '../../config';
import logger from '../logger/log4js';
import { ITokenData } from '../../modules/auth/auth/interface';

const Authorize = () => {
  return async (req, res, next) => {
    const token = req.cookies[`token_${req.tenant.name}`] ? req.cookies[`token_${req.tenant.name}`]
      : req.headers.authorization ? req.headers.authorization : '';

    if (!token) {
      res.status(401).end('Unauthorized');
    } else {
      let payload: ITokenData = {} as any;
      try {
        payload = jwt.verify(token, config.auth.secret) as any;
      } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(401).end('Unauthorized');
      }

      if (payload && payload.exp && payload.exp < Math.round(new Date().getTime() / 1000)) {
        res.status(401).end('Token expired');
      }

      if (payload.tenant._id === String(req.tenant._id)) {
        req.email = payload.email;
        req.userId = payload._id;

        if (payload.roles && (payload.roles.indexOf('admin') >= 0 || payload.roles.indexOf('sysadmin') >= 0 || payload.roles.indexOf('franchise') >= 0)) {
          next();
          return;
        } else {
          res.status(401).end('Unauthorized');
        }
      } else {
        res.status(401).end('Unauthorized');
        return;
      }
    }
  };
};

export default Authorize;