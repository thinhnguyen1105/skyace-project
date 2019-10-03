import * as express from "express";
import loginService from "./login.service";
import registerService from "./register.service";
import resetPasswordService from './reset-password.service';
import logger from "../../../core/logger/log4js";
import config from "../../../config";
import { addCreationAuditInfo } from "../../../core/helpers";
import checkAdmin from '../../../core/auth/check-admin.middleware';

const authRouter = express.Router();

authRouter.get('/checkEmail/:email', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const result = await registerService.checkEmail(tenantId, req.params.email);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res
      .status(error.status || 500)
      .send(error.message || "Internal server error.");
  }
});

authRouter.post("/login/local", async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const token = await loginService.login(tenantId, req.body);
    res
      .cookie(`token_${req.tenant.name}`, token, {
        domain: config.nextjs.cookieDomain,
        maxAge: config.auth.expiresIn * 1000,
      })
      .status(200)
      .json({ token });
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res
      .status(error.status || 500)
      .send(error.message || "Email or password is incorrect.");
  }
});

authRouter.post("/register", async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const newUser = await registerService.registerUser(
      tenantId,
      addCreationAuditInfo(req, req.body)
    );
    res.status(200).send(newUser);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res
      .status(error.status || 500)
      .send(error.message || "Internal server error.");
  }
});

authRouter.post('/refreshToken', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const token = await loginService.refreshToken(tenantId, req.body.token);
    res.status(200).send({token});
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res
      .status(error.status || 500)
      .send(error.message || "Internal server error.");
  }
});

authRouter.post('/login/google', async (req: any, res) => {
  try {
    const token = await loginService.loginWithSocialAccount(req.tenant._id, req.body);
    res.cookie(`token_${req.tenant.name}`, token, {
        domain: config.nextjs.cookieDomain,
        maxAge: config.auth.expiresIn * 1000,
      })
      .status(200)
      .json({token});
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal Server Error");
  }
});

authRouter.post('/login/facebook', async (req: any, res) => {
  try {
    const token = await loginService.loginWithSocialAccount(req.tenant._id, req.body);
    res.cookie(`token_${req.tenant.name}`, token, {
        domain: config.nextjs.cookieDomain,
        maxAge: config.auth.expiresIn * 1000,
      })
      .status(200)
      .json({token});
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal Server Error");
  }
});

authRouter.get('/sendResetPasswordEmail/:email', async (req: any, res) => {
  try {
    await resetPasswordService.sendResetPasswordEmail(req.tenant, req.params.email);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal Server Error");
  }
});

authRouter.post('/impersonate', checkAdmin(), async (req :any , res) => {
  try {
    const token = await loginService.impersonate(req.tenant._id, req.body);
    res
      .cookie(`token_${req.tenant.name}`, token, {
        domain: config.nextjs.cookieDomain,
        maxAge: config.auth.expiresIn * 1000,
      })
      .status(200)
      .json({ token });
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal Server Error");
  }
})

export default authRouter;
