import * as express from 'express';
import conversationsService from './service';
import logger from '../../../core/logger/log4js';
import { addCreationAuditInfo, validatePagination, addModificationAuditInfo } from '../../../core/helpers';
import uplodaChatImage from '../../../core/helpers/upload-chat-image';

const conversationsRouter = express.Router();

conversationsRouter.get('/findByUserId', async (req: any, res) => {
  try {
    const newTenant = await conversationsService.findConversationByUserId(req.tenant._id, validatePagination(req.query));
    res.status(200).send(newTenant);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

conversationsRouter.post('/findByIds', async (req: any, res) => {
  try {
    const results = await conversationsService.findByIds(req.tenant._id, req.body._id);
    res.status(200).send(results);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
})

conversationsRouter.post('/create', async (req: any, res) => {
  try {
    const newTenant = await conversationsService.createConversation(req.tenant._id, addCreationAuditInfo(req, req.body));
    res.status(201).send(newTenant);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

conversationsRouter.put('/update', async (req: any, res) => {
  try {
    const newTenant = await conversationsService.updateConversation(req.tenant._id, addModificationAuditInfo(req, req.body) as any);
    res.status(201).send(newTenant);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

conversationsRouter.post('/uploadChatImage', uplodaChatImage.array('chatImage'), async (_req: any, res) => {
  try {
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

conversationsRouter.post('/createGroupConversation', async (req: any, res) => {
  try {
    const newConversation = await conversationsService.createOrUpdateGroupConversation(req.tenant._id, addCreationAuditInfo(req, addModificationAuditInfo(req, req.body)) as any);
    res.status(201).send(newConversation);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
})

export default conversationsRouter;