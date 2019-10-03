import * as express from 'express';
import usersService from './service';
import { addCreationAuditInfo, validatePagination, addModificationAuditInfo } from '../../../core/helpers';
import logger from '../../../core/logger/log4js';
import checkTenant from '../../../core/auth/check-tenant.middleware';
import loginService from '../auth/login.service';
import config from '../../../config';
import uploadUserFile from '../../../core/helpers/upload-user-file';

const usersRouter = express.Router();

usersRouter.get('/find', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const results = await usersService.findUsers(tenantId, validatePagination(req.query));
    res.status(200).send(results);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

usersRouter.get('/findFranchises', async (req: any, res) => {
  try {
    const results = await usersService.findFranchises(validatePagination(req.query));
    res.status(200).send(results);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

usersRouter.get('/getFranchisesList', async (_req, res) => {
  try {
    const results = await usersService.getAllFranchiseName();
    res.status(200).send(results);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

usersRouter.get('/findById/:id', async (req: any, res) => {
  try {
    const result = await usersService.findById(req.params.id);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

usersRouter.get('/findTutorById/:id', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const result = await usersService.findTutorById(tenantId, req.params.id);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});
usersRouter.get('/findStudentById/:id', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const result = await usersService.findStudentById(tenantId, req.params.id);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

/** create new local user */
usersRouter.post('/create', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const newUser = await usersService.createUser(tenantId, addCreationAuditInfo(req, req.body));
    res.status(201).send(newUser);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

usersRouter.post('/createAdminUserForNewTenant', async (req: any, res) => {
  try {
    await usersService.createAdminUserForNewTenant(addCreationAuditInfo(req, req.body));
    res.status(201).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

usersRouter.post('/createFranchise', async (req: any, res) => {
  try {
    const result = await usersService.createFranchise(req.tenant._id, addCreationAuditInfo(req, req.body));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

/** update social user */
usersRouter.put('/update/social', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    await usersService.updateSocialUser(tenantId, addModificationAuditInfo(req, req.body));
    const token = await loginService.createToken(req.tenant._id, {
      _id: req.body._id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      fullName: [req.body.firstName, req.body.lastName].join(' '),
      normalizedFullName: [req.body.firstName, req.body.lastName].join(' ').toLocaleLowerCase(),
      email: req.body.email,
      roles: req.body.roles,
      tenant: req.tenant,
      phone: req.phone,
      timeZone: req.body.timeZone,
      currency: req.body.currency,
    });
    res.cookie(`token_${req.tenant.name}`, token, {
      domain: config.nextjs.cookieDomain,
      maxAge: config.auth.expiresIn * 1000,
    }).status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

usersRouter.get('/verifyEmail/:userId', async (req: any, res) => {
  try {
    const user = await usersService.verifyEmail(addModificationAuditInfo(req, req.params));
    res.status(200).redirect(`${user.tenant.name === 'admin' ? config.nextjs.hostUrl : config.nextjs.tenantUrl.replace('<%tenant%>', user.tenant.domain)}/`);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

usersRouter.put('/activate/:userId', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    await usersService.activateUser(tenantId, addModificationAuditInfo(req, req.params));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

usersRouter.put('/deactivate/:userId', async (req: any, res) => {
  try {
    await usersService.deactivateUser(addModificationAuditInfo(req, req.params));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

usersRouter.post('/search', async (req: any, res) => {
  try {
    const results = await usersService.searchUsers(req.tenant._id, req.body);
    res.status(200).send(results);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

usersRouter.patch('/update', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const results = await usersService.updateUser(tenantId, req.body);
    res.status(200).send(results);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

usersRouter.post('/generate-test-data', checkTenant(), async (req: any, res) => {
  try {
    await usersService.generateTestData(req.tenant._id);
    res.status(200).end();
  } catch (err) {
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

// sync index from mongodb to elasticsearch
usersRouter.post('/sync-elastic', checkTenant(), async(req: any, res) => {
  try {
    await usersService.syncElasticSearch(req.tenant._id);
    res.status(200).end();
  } catch (err) {
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
});

// remove old currency to fit with new schema
usersRouter.delete('/old-currency-and-timezone', async(_req: any, res) => {
  try {
    await usersService.removeOldCurrencyAndTimeZoneFromUsers();
    res.status(200).end();
  } catch (err) {
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
})

usersRouter.put('/change-password', async(req: any, res) => {
  try {
    await usersService.changePassword(req.tenant._id, req.body);
    res.status(200).end();
  } catch (err) {
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
})

usersRouter.get('/find-tenant-admin', async(req: any, res) => {
  try {
    const result = await usersService.findTenantAdmin(req.query.tenant);
    res.status(200).send(result);
  } catch (err) {
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
})

usersRouter.get('/export-distributors', async(_req: any, res) => {
  try {
    const result = await usersService.exportDistributors();
    res.status(200).attachment('distributors.xlsx').send(result);
  } catch (err) {
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
})

usersRouter.get('/export-users', async(_req: any, res) => {
  try {
    const result = await usersService.exportUsers(_req.tenant._id, _req.query._id);
    res.status(200).attachment('users.xlsx').send(result);
  } catch (err) {
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
})

usersRouter.post('/upload-file', uploadUserFile.array('materials'), async (req: any, res) => {
  try {
    const newFileList = req.files.map((item) => ({
      fileName: item.filename,
      downloadUrl: item.path,
    }));

    res.status(200).send(newFileList);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

usersRouter.get('/distributor-payment', async (req: any, res) => {
  try {
    const result = await usersService.getPaymentOfDistributor(req.query._id);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

usersRouter.put('/update-distributor-paycheck', async (req: any, res) => {
  try {
    await usersService.updateDistributorPaycheck(req.query);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
})

usersRouter.get('/get-distributor-paycheck', async (req: any, res) => {
  try {
    const result = await usersService.getDistributorPaycheck(req.query._id);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
})

export default usersRouter;