import * as express from 'express';
import schedulesService from './service';
import logger from '../../../core/logger/log4js';
import { validateSchedulePagination, addCreationAuditInfo, addModificationAuditInfo } from '../../../core/helpers';

const schedulesRouter = express.Router();

schedulesRouter.get('/find', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const result = await schedulesService.findSchedules(tenantId, validateSchedulePagination(req.query));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

schedulesRouter.get('/findByUserId', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const result = await schedulesService.findByUserId(tenantId, validateSchedulePagination(req.query));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

schedulesRouter.get('/trialScheduleByUserId', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const result = await schedulesService.trialScheduleByUserId(tenantId, req.query);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

schedulesRouter.post('/create', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const newSchedule = await schedulesService.createSchedule(tenantId, addCreationAuditInfo(req, req.body));
    res.status(201).send(newSchedule);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

schedulesRouter.put('/update', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    await schedulesService.updateSchedule(tenantId, addModificationAuditInfo(req, req.body));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

schedulesRouter.delete('/delete', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    await schedulesService.deleteSchedule(tenantId, req.body);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});


schedulesRouter.delete('/deleteRepeatSchedules', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const result = await schedulesService.deleteRepeatSchedules(tenantId, req.body);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

schedulesRouter.post('/createMultipleSchedules', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const newSchedules = await schedulesService.createMultipleSchedules(tenantId, { schedulesList: req.body.scheduleList.map((item) => addCreationAuditInfo(req, item)) } as any);
    res.status(201).send(newSchedules);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

schedulesRouter.post('/checkMultilpleBookings', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const checkMultipleBookingsResult = await schedulesService.checkMultilpleBookings(tenantId, { schedulesList: req.body.newSchedules });
    res.status(201).send(checkMultipleBookingsResult);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

schedulesRouter.post('/createStudentBookings', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    const newBookings = await schedulesService.createStudentBookings(tenantId, { newBookings: req.body.newBookings.map((item) => addCreationAuditInfo(req, item)) });
    res.status(201).send(newBookings);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

schedulesRouter.put('/reschedule', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    await schedulesService.reschedule(tenantId, addModificationAuditInfo(req, req.body));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

schedulesRouter.post('/sendRescheduleConfirmEmail', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    await schedulesService.sendRescheduleConfirmEmail(tenantId, req.body);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

schedulesRouter.delete('/deleteMany', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    await schedulesService.deleteManySchedules(tenantId, req.body);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

schedulesRouter.put('/updateMultipleSchedules', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    await schedulesService.updatePaymentComplete(tenantId, req.body);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

schedulesRouter.get('/checkCompletedSchedules', async (_req: any, res) => {
  try {
    await schedulesService.checkCompletedSchedules();
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

schedulesRouter.post('/checkSessionInsideTutorSchedules', async (_req: any, res) => {
  try {
    const result = await schedulesService.checkSessionInsideTutorSchedule(_req.tenant._id, _req.body);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

export default schedulesRouter;
