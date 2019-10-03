import * as express from 'express';
import transactionService from './service';
import { validatePagination, addCreationAuditInfo } from '../../../../api/core/helpers';

const transactionRouter = express.Router();

transactionRouter.get('/findTransactions', async (req: any, res) => {
  try {
    const result = await transactionService.findTransactions(req.tenant._id, validatePagination(req.query));
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

transactionRouter.post('/create', async (req: any, res) => {
  try {
    const result = await transactionService.createTransaction(req.tenant._id, addCreationAuditInfo(req, req.body));
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

transactionRouter.put('/update', async (req: any, res) => {
  try {
    const result = await transactionService.update(req.body);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

transactionRouter.post('/getAccessToken', async (req: any, res) => {
  try {
    const result = await transactionService.createTransaction(req.tenant._id, addCreationAuditInfo(req, req.body));
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

transactionRouter.post('/create-invoice', async (_req: any, res) => {
  try {
    await transactionService.createInvoiceForStudent(_req.body);
    res.status(200).end();
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

transactionRouter.get('/export-transactions', async(_req: any, res) => {
  try {
    const result = await transactionService.exportTransactions(_req.tenant._id, _req.query._id);
    res.status(200).attachment('transactions.xlsx').send(result);
  } catch (err) {
    res.status(err.status || 500).send(err.message || "Internal server error.");
  }
})

export default transactionRouter;