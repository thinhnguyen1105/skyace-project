import * as express from 'express';
import groupTuitionsService from './service';
import logger from '../../../core/logger/log4js';
import {validatePagination, addModificationAuditInfo } from '../../../core/helpers';

const groupTuitionsRouter = express.Router();

groupTuitionsRouter.get('/find-by-tutor-id', async (req: any, res) => {
  try {
    const result = await groupTuitionsService.findTuitionsByTutorId(req.tenant._id, req.query._id);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

groupTuitionsRouter.get('/find-by-student-id', async (req: any, res) => {
  try {
    const result = await groupTuitionsService.findTuitionsByStudentId(req.tenant._id, validatePagination(req.query));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

groupTuitionsRouter.get('/find-by-tuition-id', async (req: any, res) => {
  try {
    const result = await groupTuitionsService.findByTuitionId(req.tenant._id, req.query.tuitionId);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

groupTuitionsRouter.post('/create', async (req: any, res) => {
  try {
    const result = await groupTuitionsService.createTuition(req.tenant._id, req.body);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

groupTuitionsRouter.put('/update', async (req: any, res) => {
  try {
    const result = await groupTuitionsService.updateTuition(req.tenant._id, req.body);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

groupTuitionsRouter.delete('/delete', async (req: any, res) => {
  try {
    await groupTuitionsService.deleteTuition(req.tenant._id, req.body);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
})

groupTuitionsRouter.post('/booking', async (req: any, res) => {
  try {
    const results = await groupTuitionsService.bookingTuition(req.tenant._id, req.body);
    res.status(200).send(results);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
})

groupTuitionsRouter.post('/check-booking-condition', async (req: any, res) => {
  try {
    const results = await groupTuitionsService.checkBookingCondition(req.tenant._id, req.body);
    res.status(200).send(results);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
})

groupTuitionsRouter.put('/cancel', async (req: any, res) => {
  try {
    await groupTuitionsService.cancelTuition(req.tenant._id, addModificationAuditInfo(req, req.body));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

groupTuitionsRouter.post('/hold-slot', async (req: any, res) => {
  try {
    const result = await groupTuitionsService.holdSlot(req.tenant._id, req.body);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

groupTuitionsRouter.post('/cancel-slot', async (req: any, res) => {
  try {
    await groupTuitionsService.cancelSlot(req.tenant._id, req.body);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});


export default groupTuitionsRouter;