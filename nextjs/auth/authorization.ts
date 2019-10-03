import * as jwtDecode from 'jwt-decode';
import config from '../../api/config';
import logger from '../../api/core/logger/log4js';
import { ITokenData } from '../../api/modules/auth/auth/interface';
import loginService from "../../api/modules/auth/auth/login.service";

const Authorize = (role: any = '') => {
  return async (req, res, next) => {
    const loginUrl = `${req.protocol}://${req.get('host')}`;

    const urlRegex = config.nextjs.checkUrlRegexFrontEnd;
    const matchResult = req.get('host').match(urlRegex);

    let token: string = '';
    if (matchResult && matchResult[1]) {
      token = req.cookies[`token_${matchResult[1].replace('.', '')}`] ? req.cookies[`token_${matchResult[1].replace('.', '')}`] : '';
    } else {
      token = req.cookies[`token_admin`] ? req.cookies[`token_admin`] : '';
    }

    if (!token) {
      if (req.url === '/' || new RegExp(/^\/login-student\/findATutor/).test(req.url) || new RegExp(/^\/login-student\/informationTutor/).test(req.url) || new RegExp(/^\/login-student\/informationGroupTuition/).test(req.url)) {
        next();
        return;
      } else {
        res.redirect(loginUrl);
      }
    } else if (token) {
      let payload: ITokenData = {} as any;

      try {
        payload = jwtDecode(token);
      } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.redirect(loginUrl);
      }

      if (payload && payload.exp && payload.exp < Math.round(new Date().getTime() / 1000)) {
        logger.error(`Token Expired`);
        res.redirect(loginUrl);
      }

      // Refresh Token
      try {
        const newToken = await loginService.refreshToken(req.tenant._id, token);

        if (req.cookies[`token_${matchResult[1]}`]) {
          res.cookie(`token_${matchResult[1]}`, newToken, {
            domain: config.nextjs.cookieDomain,
            maxAge: config.auth.expiresIn * 1000,
          });
        } else {
          res.cookie('token_admin', newToken, {
            domain: config.nextjs.cookieDomain,
            maxAge: config.auth.expiresIn * 1000,
          });
        }
        const newTokenData: ITokenData = jwtDecode(newToken);
        req.query.profile = {
          ...newTokenData,
          token: newToken,
          isLoggedIn: true,
        };
      } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.redirect(loginUrl);
      }

      // Check if 'Tenant' in token === 'Tenant' in URL
      if (matchResult && matchResult[1] && payload.tenant && matchResult[1].replace('.', '') === payload.tenant.name) {
        // Verify Role
        if (!role || (payload.roles as any).indexOf('sysadmin') > -1) {
          next();
          return;
        } else if (!payload.roles || (typeof role === "string" && payload.roles.indexOf(role) === -1)) {
          res.redirect(loginUrl);
        } else if (payload.roles && role.constructor === Array){
          const matchedRole = role.filter((val) => {
            return (payload.roles as any).indexOf(val) >= 0
          });
          if (matchedRole.length) {
            next();
            return;
          } else {
            res.redirect(loginUrl);
          }
        } else {
          next();
          return;
        }
      } else if (!matchResult[1] && payload.tenant && payload.tenant.name === 'admin') {
        // Verify Role
        if (!role || (payload.roles as any).indexOf('sysadmin') > -1) {
          next();
          return;
        } else if (!payload.roles || (typeof role === "string" && payload.roles.indexOf(role) === -1)) {
          res.redirect(loginUrl);
        } else if (payload.roles && role.constructor === Array){
          const matchedRole = role.filter((val) => {
            return (payload.roles as any).indexOf(val) >= 0
          });
          if (matchedRole.length) {
            next();
            return;
          } else {
            res.redirect(loginUrl);
          }
        } else {
          next();
          return;
        }
      } else {
        res.redirect(loginUrl);
      }
    }
  };
};

export default Authorize;