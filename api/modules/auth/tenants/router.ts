import * as express from 'express';
import * as uuid from 'uuid';
import tenantsService from './service';
import { validatePagination, addCreationAuditInfo, addModificationAuditInfo } from '../../../core/helpers';
import logger from '../../../core/logger/log4js';
import uploadTenantFile from '../../../core/helpers/upload-tenant-file';

const tenantsRouter = express.Router();

tenantsRouter.get('/find', async (req, res) => {
  try {
    const result = await tenantsService.findTenants(validatePagination(req.query));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.get('/findByAdmin', async (req, res) => {
  try {
    const result = await tenantsService.findTenantsByAdmin(validatePagination(req.query));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
})

tenantsRouter.get('/findByName/:tenantName', async (req, res) => {
  try {
    const result = await tenantsService.findTenantByName(req.params.tenantName);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.get('/findByDomain/:domain', async (req, res) => {
  try {
    const result = await tenantsService.findTenantByDomain(req.params.domain);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
})

tenantsRouter.get('/find-detail/:id', async (req: any, res) => {
  try {
    const result = await tenantsService.findTenantById(req.params.id);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.post('/upload-file', uploadTenantFile.array('materials'), async (req: any, res) => {
  try {
    const newFileList = req.files.map((item) => ({
      fileName: item.filename,
      downloadUrl: item.path,
      uploadBy: req.tenant._id
    }));

    res.status(200).send(newFileList);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.post('/update-files', uploadTenantFile.array('materials'), async (req: any, res) => {
  try {
    const newFileList = req.files.map((item) => ({
      _id: uuid.v4(),
      fileName: item.filename,
      downloadUrl: item.path,
      uploadBy: req.tenant._id
    }));

    const fileLists = await tenantsService.updateFileList(req.tenant._id, { fileLists: newFileList });
    res.status(200).send(fileLists);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.get('/download-file', async(req: any, res) => {
  try {
    const filePath = await tenantsService.checkFileExist(req.query.tenant, req.query.fileId);
    res.download(filePath);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
})

tenantsRouter.post('/create', async (req: any, res) => {
  try {
    const newTenant = await tenantsService.createTenant(addCreationAuditInfo(req, req.body));
    res.status(201).send(newTenant);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

/** update tenant */
tenantsRouter.put('/update', async (req, res) => {
  try {
    await tenantsService.updateTenant(addModificationAuditInfo(req, req.body));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

/** update company's profile of tenant */
tenantsRouter.put('/update/profile', async (req, res) => {
  try {
    await tenantsService.updateCompanyProfile(req.body);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.put('/update/adminInfo', async (req, res) => {
  try {
    await tenantsService.updateAdminInfo(req.body);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.put('/update/configuration', async (req, res) => {
  try {
    await tenantsService.updateConfiguration(req.body);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.put('/update/contract', async (req, res) => {
  try {
    await tenantsService.updateContracInfo(req.body);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.put('/update/bankTransfer', async (req, res) => {
  try {
    await tenantsService.updateBankTransfer(req.body);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.put('/update/paypal', async (req, res) => {
  try {
    await tenantsService.updatePaypal(req.body);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.put('/update/commissionFee', async (req, res) => {
  try {
    const result = await tenantsService.updateCommissionFee(req.body);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.put('/activate/:tenantId', async (req, res) => {
  try {
    await tenantsService.activateTenant(addModificationAuditInfo(req, req.params));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.put('/deactivate/:tenantId', async (req, res) => {
  try {
    await tenantsService.deactivateTenant(addModificationAuditInfo(req, req.params));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.put('/update-fields', async (req, res) => {
  try {
    const result = await tenantsService.updateFields(req.body);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.get('/check-domain', async (req, res) => {
  try {
    const result = await tenantsService.checkDomainExists(req.query);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.get('/dashboard', async (req: any, res) => {
  try {
    const result = await tenantsService.getDashboardInfo(req.query.tenant || req.tenant._id);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.post('/update-distributor', async (_req, res) => {
  try {
    await tenantsService.updateDistributor();
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.get('/export-partners', async (_req, res) => {
  try {
    const result = await tenantsService.exportPartners(_req.query.distributor);
    res.status(200).attachment('partners.xlsx').send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.get('/partner-payment', async (_req, res) => {
  try {
    const result = await tenantsService.getPartnerPayments(_req.query._id);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.get('/partner-paycheck', async (_req, res) => {
  try {
    const result = await tenantsService.getPartnerPaycheck(_req.query._id);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

tenantsRouter.put('/partner-paycheck', async (_req, res) => {
  try {
    await tenantsService.updatePartnerPaycheck(_req.query);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

export default tenantsRouter;