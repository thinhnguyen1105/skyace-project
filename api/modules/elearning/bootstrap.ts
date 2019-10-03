import { Router } from 'express';
import courseRouter from './courses/router';
import schedulesRouter from './schedules/router';
import courseForTutorRouter from './course-for-tutor/router';
import tuitionsRouter from './tuitions/router';
import sessionsRouter from './sessions/router';
import currencyRouter from './currency-exchange/router';
import groupTuitionsRouter from './group-tuitions/router';
import ratingRouter from './ratings/router';
import subjectRouter from './subjects/router';
import levelRouter from './levels/router';
import gradeRouter from './grades/router';

const bootstrap = (router: Router) => {
  router.use('/courses', courseRouter);
  router.use('/schedules', schedulesRouter);
  router.use('/course-for-tutor', courseForTutorRouter);
  router.use('/tuitions', tuitionsRouter);
  router.use('/sessions', sessionsRouter);
  router.use('/currencies', currencyRouter);
  router.use('/group-tuitions', groupTuitionsRouter);
  router.use('/ratings', ratingRouter);
  router.use('/subjects', subjectRouter);
  router.use('/levels', levelRouter);
  router.use('/grades', gradeRouter);
};

export default bootstrap;