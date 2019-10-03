import { Router } from 'express';
import imagesRouter from './upload-image/router';
import blogRouter from './blog/router';
import landingPageRouter from './landing-page/router';
import languageRouter from './language/router';

const bootstrapWebsite = (router: Router) => {
  router.use('/images', imagesRouter);
  router.use('/blog', blogRouter);
  router.use('/landing-page', landingPageRouter);
  router.use('/language', languageRouter);
};

export default bootstrapWebsite;