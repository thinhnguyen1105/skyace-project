import { Router } from 'express';
import authRouter from './auth/router';
import usersRouter from './users/router';
import tenantsRouter from './tenants/router';
import rolesRouter from './roles/router';

const bootstrap = (router: Router) => {
  router.use('/auth', authRouter);
  router.use('/users', usersRouter);
  router.use('/tenants', tenantsRouter);
  router.use('/roles', rolesRouter);
};

export default bootstrap;
