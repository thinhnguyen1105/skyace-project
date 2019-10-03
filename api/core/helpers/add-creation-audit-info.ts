import { HasCreationAuditInfo } from '../interfaces';

const addCreationAuditInfo = <T extends HasCreationAuditInfo>(
  req: any,
  model: any,
): T => {
  return {
    ...model,
    createdBy: req.email,
    createdAt: new Date(),
  };
};

export default addCreationAuditInfo;
