import { Router } from 'express';
import conversationsRouter from './conversations/router';

const bootstrapPM = (router: Router) => {
  router.use('/conversations', conversationsRouter);
};

export default bootstrapPM;