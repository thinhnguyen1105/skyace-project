import * as express from 'express';
import promoCodeService from './service';
import { validatePagination, addCreationAuditInfo } from '../../../../api/core/helpers';

const promoCodeRouter = express.Router();

promoCodeRouter.get('/find', async (req: any, res) => {
  try {
    const result = await promoCodeService.findPromoCodes(req.tenant._id, validatePagination(req.query));
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

promoCodeRouter.post('/create', async (req: any, res) => {
  try {
    const result = await promoCodeService.create(req.tenant._id, addCreationAuditInfo(req, req.body));
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

promoCodeRouter.put('/update', async (req: any, res) => {
  try {
    const result = await promoCodeService.update(req.tenant._id, req.body);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

promoCodeRouter.put('/deactivate', async (req: any, res) => {
  try {
    await promoCodeService.deactivate(req.tenant._id, req.query);
    res.status(200).end();
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

promoCodeRouter.put('/activate', async (req: any, res) => {
  try {
    await promoCodeService.activate(req.tenant._id, req.query);
    res.status(200).end();
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

promoCodeRouter.delete('/delete', async (req: any, res) => {
  try {
    await promoCodeService.deleteOne(req.tenant._id, req.query);
    res.status(200).end();
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

promoCodeRouter.get('/find-by-name', async (req: any, res) => {
  try {
    const result = await promoCodeService.findByName(req.tenant._id, req.query);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

promoCodeRouter.get('/find-by-name-except', async (req: any, res) => {
  try {
    const result = await promoCodeService.findByNameExcept(req.tenant._id, req.query);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

promoCodeRouter.get('/find-by-id', async (req: any, res) => {
  try {
    const result = await promoCodeService.findById(req.tenant._id, req.query);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

promoCodeRouter.put('/use-code', async (req: any, res) => {
  try {
    await promoCodeService.useCode(req.tenant._id, req.query);
    res.status(200).end();
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

export default promoCodeRouter;