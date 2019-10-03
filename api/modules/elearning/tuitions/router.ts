import * as express from 'express';
import tuitionsService from './service';
import logger from '../../../core/logger/log4js';
import { validatePagination, addCreationAuditInfo, addModificationAuditInfo } from '../../../core/helpers';

const tuitionsRouter = express.Router();

tuitionsRouter.get('/findTuitions', async (req: any, res) => {
  try {
    const result = await tuitionsService.findTuitions(req.tenant._id, validatePagination(req.query));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.get('/findByTutorId', async (req: any, res) => {
  try {
    const result = await tuitionsService.findTuitionsByTutorId(req.tenant._id, validatePagination(req.query));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.get('/findRequestCancelByTutorId', async (req: any, res) => {
  try {
    const result = await tuitionsService.findRequestCancelByTutorId(req.tenant._id, validatePagination(req.query));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.get('/findAllTuitionsByStudentId', async (req: any, res) => {
  try {
    const result = await tuitionsService.findAllTuitionsByStudentId(req.tenant._id, req.query);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.get('/findTuitionsByStudentId', async (req: any, res) => {
  try {
    const result = await tuitionsService.findTuitionsByStudentIdInCalendar(req.tenant._id, req.query);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.get('/findByStudentId', async (req: any, res) => {
  try {
    const result = await tuitionsService.findTuitionsByStudentId(req.tenant._id, validatePagination(req.query));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.get('/findRequestCancelByStudentId', async (req: any, res) => {
  try {
    const result = await tuitionsService.findRequestCancelByStudentId(req.tenant._id, validatePagination(req.query));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.get('/findCancelTuitionStudent', async (req: any, res) => {
  try {
    const result = await tuitionsService.findCancelTuitionStudent(req.tenant._id, validatePagination(req.query));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.get('/findCancelTuitionTutor', async (req: any, res) => {
  try {
    const result = await tuitionsService.findCancelTuitioTutor(req.tenant._id, validatePagination(req.query));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.get('/findByTuitionId', async (req: any, res) => {
  try {
    const result = await tuitionsService.findByTuitionId(req.tenant._id, req.query.tuitionId);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.post('/create', async (req: any, res) => {
  try {
    const newTenant = await tuitionsService.createTuition(req.tenant._id, addCreationAuditInfo(req, req.body));
    res.status(201).send(newTenant);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.post('/sendBookingConfirmEmail', async (req: any, res) => {
  try {
    await tuitionsService.sendBookingConfirmEmail(req.tenant._id, req.body);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.put('/update', async (req: any, res) => {
  try {
    await tuitionsService.updateTuition(req.tenant._id, addModificationAuditInfo(req, req.body));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.put('/finishTuition', async (req: any, res) => {
  try {
    await tuitionsService.finishTuition(req.tenant._id, addModificationAuditInfo(req, req.body));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.delete('/delete', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    await tuitionsService.deleteTuition(tenantId, req.body.tuitionId);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.put('/cancel', async (req: any, res) => {
  try {
    const disabledConversations = await tuitionsService.cancelTuition(req.tenant._id, addModificationAuditInfo(req, req.body));
    res.status(200).json(disabledConversations);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.put('/pending', async (req: any, res) => {
  try {
    const disabledConversations = await tuitionsService.putToPendingTuition(req.tenant._id, addModificationAuditInfo(req, req.body));
    res.status(200).json(disabledConversations);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.get('/checkCompletedTuitions', async (_req: any, res) => {
  try {
    await tuitionsService.checkCompletedTuitions();
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.get('/newest-tuition-bookings', async (req: any, res) => {
  try {
    const result = await tuitionsService.findNewestTuitionsBooking(req.tenant._id, req.query.tutor);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tuitionsRouter.get('/export-tuitions', async(_req: any, res) => {
  try {
    const result = await tuitionsService.exportTuitions(_req.tenant._id, _req.query._id);
    res.status(200).attachment('tuitions.xlsx').send(result);
  } catch (err) {
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
})

export default tuitionsRouter;