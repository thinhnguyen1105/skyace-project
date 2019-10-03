import * as express from 'express';
import sessionsService from './service';
import logger from '../../../core/logger/log4js';
import { validatePagination, addModificationAuditInfo, addCreationAuditInfo } from '../../../core/helpers';
import uploadMaterial from '../../../core/helpers/upload-materials';

const sessionsRouter = express.Router();

sessionsRouter.post('/updateReportIssues', async (req: any, res) => {
  try {
    const newReportIssue = {
      reportStudent: req.body.reportStudent,
      reportTutor: req.body.reportTutor,
      reasonReport: req.body.reasonReport,
      commentReport: req.body.commentReport,
      uploadBy: req.body.uploadBy,
    }
    const reportIssueInfo = await sessionsService.updateReportIssues(req.tenant ._id, req.body.sessionId, { reportInfo: newReportIssue });
    res.status(200).send(reportIssueInfo);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

sessionsRouter.post('/updateRateSession', async (req: any, res) => {
  try {
    const newRateSession = {
      rateSession: req.body.rateSession,
      commentSession: req.body.commentSession,
      uploadBy: req.body.uploadBy,
    }
    const rateSessionInfo = await sessionsService.updateRateSession(req.tenant._id, req.body.sessionId, { rateSession: newRateSession });
    res.status(200).send(rateSessionInfo);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

sessionsRouter.post('/uploadMaterials', uploadMaterial.array('materials'), async (req: any, res) => {
  try {
    const newMaterialsInfo = req.files.map((item) => ({
      fileName: item.filename,
      downloadUrl: item.path,
      uploadBy: req.body.uploadBy,
    }));

    const materialsInfo = await sessionsService.updateSessionMaterials(req.tenant._id, req.body.sessionId, { materialsInfo: newMaterialsInfo });
    res.status(200).send(materialsInfo);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

sessionsRouter.delete('/deleteMaterial', async (req: any, res) => {
  try {
    await sessionsService.deleteMaterial(req.tenant._id, req.body);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

sessionsRouter.get('/downloadMaterials/:sessionId/:fileId', async (req: any, res) => {
  try {
    const filePath = await sessionsService.checkFileExist(req.tenant._id, req.params.sessionId, req.params.fileId);
    res.download(filePath);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

sessionsRouter.get('/findByTuitionId', async (req: any, res) => {
  try {
    const result = await sessionsService.findSessionsByTuitionId(req.tenant._id, validatePagination(req.query));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

sessionsRouter.get('/findBySessionId', async (req: any, res) => {
  try {
    const result = await sessionsService.findBySessionId(req.tenant._id, req.query.sessionId);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

sessionsRouter.post('/createSessions', async (req: any, res) => {
  try {
    const result = await sessionsService.createSessions(req.tenant._id, { sessionList: req.body.sessionList.map((item) => addCreationAuditInfo(req, item)) } as any);
    res.status(201).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

sessionsRouter.put('/updateSessions', async (req: any, res) => {
  try {
    const result = await sessionsService.updateSessions(req.tenant._id, { sessionList: req.body.sessionList.map((item) => addCreationAuditInfo(req, item)) } as any);
    res.status(201).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

sessionsRouter.put('/update', async (req: any, res) => {
  try {
    await sessionsService.updateSession(req.tenant._id, addModificationAuditInfo(req, req.body));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});
sessionsRouter.delete('/deleteMany', async (req: any, res) => {
  try {
    const tenantId = req.tenant._id;
    await sessionsService.deleteManySessions(tenantId, req.body);
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

sessionsRouter.get('/generate-url', async (req: any, res) => {
  try {
    const result = await sessionsService.generateSessionRoomURL(req.tenant._id, req.query._id, req.query.name, req.query.role);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

sessionsRouter.get('/generate-end-url', async (req: any, res) => {
  try {
    const result = await sessionsService.generateSessionEndRoomUrl(req.query._id);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
})

sessionsRouter.get('/checkCompletedSessions', async (_req: any, res) => {
  try {
    await sessionsService.checkCompletedSessions();
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

sessionsRouter.get('/get-upcoming-tuitions', async (req: any, res) => {
  try {
    const result = await sessionsService.findUpcomingTuitions(req.tenant._id, req.query.tutor);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
});

sessionsRouter.get('/tutor-rating', async (req: any, res) => {
  try {
    const result = await sessionsService.calculateTutorRating(req.query.tutor);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
})

sessionsRouter.get('/recordings', async (req: any, res) => {
  try {
    const result = await sessionsService.generateSessionRecordings(req.query._id);
    res.status(200).send({result});
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || "Internal server error.");
  }
})

export default sessionsRouter;