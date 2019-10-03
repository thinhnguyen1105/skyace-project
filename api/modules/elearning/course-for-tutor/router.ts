import * as express from 'express';
import courseForTutorService from './service';
import logger from '../../../core/logger/log4js';

const courseForTutorRouter = express.Router();

courseForTutorRouter.post('/create', async (req: any, res) => {
  try {
    const newCourse = await courseForTutorService.createCourseForTutor(req.body, req.tenant._id);
    res.status(200).send(newCourse);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send({errorMessasge: err.message || 'Internal server error.'});
  }
});

courseForTutorRouter.put('/update', async (req: any, res) => {
  try {
    const result = await courseForTutorService.updateCourseForTutor(req.body);
    res.status(200).send(result);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send({errorMessasge: err.message || 'Internal server error.'});
  }
});

courseForTutorRouter.get('/all', async (req: any, res) => {
  try {
    const results = await courseForTutorService.getAllCourseForTutor(req.tenant._id);
    res.status(200).send(results);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send({errorMessasge: err.message || 'Internal server error.'});
  }
});

courseForTutorRouter.get('/find-by-tutor-id', async (req: any, res) => {
  try {
    const results = await courseForTutorService.findByTutorId(req.query.tutor_id, req.tenant._id);
    res.status(200).send(results);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send({errorMessasge: err.message || 'Internal server error.'});
  }
});

courseForTutorRouter.delete('/delete', async (req: any, res) => {
  try {
    await courseForTutorService.deleteCourseForTutor(req.body._id, req.tenant._id);
    res.status(200).end();
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send({errorMessasge: err.message || 'Internal server error.'});
  }
});

courseForTutorRouter.delete('/deleteCoruseForTutor', async (req: any, res) => {
  try {
    await courseForTutorService.trutlyDeleteCourseForTutor(req.body._id, req.tenant._id);
    res.status(200).end();
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send({errorMessasge: err.message || 'Internal server error.'});
  }
});

export default courseForTutorRouter;