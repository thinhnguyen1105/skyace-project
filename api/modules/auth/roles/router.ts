import * as express from 'express';
import rolesService from './service';
import { addCreationAuditInfo, validatePagination, addModificationAuditInfo } from '../../../core/helpers';
import logger from '../../../core/logger/log4js';

const rolesRouter = express.Router();

rolesRouter.get('/find', async (req: any, res) => {
  try {
    const result = await rolesService.findRoles(validatePagination(req.query));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

rolesRouter.post('/create', async (req: any, res) => {
  try {
    const newRole = await rolesService.createRole(addCreationAuditInfo(req, req.body));
    res.status(201).send(newRole);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

rolesRouter.put('/update', async (req: any, res) => {
  try {
    await rolesService.updateRole(addModificationAuditInfo(req, req.body));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

rolesRouter.put('/activate/:roleId', async (req: any, res) => {
  try {
    await rolesService.activateRole(addModificationAuditInfo(req, req.params));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

rolesRouter.put('/deactivate/:roleId', async (req: any, res) => {
  try {
    await rolesService.deactivateRole(addModificationAuditInfo(req, req.params));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

export default rolesRouter;