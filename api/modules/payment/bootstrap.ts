import { Router } from 'express';
import transactionRouter from './transactions/router';
import promoCodeRouter from './promo-code/router';

const bootstrap = (router: Router) => {
  router.use('/transaction', transactionRouter);
  router.use('/promo-code', promoCodeRouter);
};

export default bootstrap;