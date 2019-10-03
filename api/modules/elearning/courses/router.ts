import * as express from 'express';
import courseService from './service';
import logger from '../../../core/logger/log4js';

const courseRouter = express.Router();

courseRouter.get('/all', async (req: any, res) => {
  try {
    req = req;
    const result = await courseService.getAllCourses(req.tenant._id);
    res.status(200).send(result);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send({ errorMessage: err.message || 'Internal server error.' });
  }
});

courseRouter.post('/create', async (req: any, res) => {
  try {
    const newCourse = await courseService.createCourse(req.body, req.tenant._id);
    res.status(200).send(newCourse);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send({ errorMessage: err.message || 'Internal server error.' });
  }
});

courseRouter.put('/update', async (req: any, res) => {
  try {
    const result = await courseService.updateCourse(req.body, req.tenant._id);
    res.status(200).send(result);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send({ errorMessage: err.message || 'Internal server error.' });
  }
});

courseRouter.delete('/delete', async (req: any, res) => {
  try {
    await courseService.deleteCourse(req.body, req.tenant._id);
    res.status(200).end();
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send({ errorMessage: err.message || 'Internal server error.' });
  }
});

courseRouter.delete('/deleteCourse', async (req: any, res) => {
  try {
    await courseService.trutlyDeleteCourse(req.body, req.tenant._id);
    res.status(200).end();
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send({ errorMessage: err.message || 'Internal server error.' });
  }
});

courseRouter.get('/search', async (req: any, res) => {
  try {
    const results = await courseService.searchAllFields(req.query, req.tenant._id);
    res.status(200).send(results);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send({ errorMessage: err.message || 'Internal server error.' });
  }
});

courseRouter.post('/filter', async (req: any, res) => {
  try {
    const results = await courseService.filterCourse(req.body, req.tenant._id);
    res.status(200).send(results);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send({ errorMessage: err.message || 'Internal server error.' });
  }
});

courseRouter.get('/get-all-countries', async (req: any, res) => {
  try {
    const results = await courseService.getAllCountries(req.tenant._id);
    res.status(200).send(results);
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send({ errorMessage: err.message || 'Internal server error.' });
  }
});

courseRouter.post('/regenerate', async (_req, res) => {
  try {
    await courseService.regenerateCourseData();
    res.status(200).end();
  } catch (err) {
    logger.error(`${err.message} ${err.stack}`);
    res.status(err.status || 500).send({ errorMessage: err.message || 'Internal server error.' });
  }
})

export default courseRouter;