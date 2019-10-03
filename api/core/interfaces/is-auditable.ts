// tslint:disable-next-line:interface-name
export interface HasCreationAuditInfo {
  createdBy: string;
  createdAt: Date;
}

// tslint:disable-next-line:interface-name
export interface HasModificationAuditInfo {
  lastModifiedBy: string;
  lastModifiedAt: Date;
}

export interface IsAuditable
  extends HasCreationAuditInfo,
    HasModificationAuditInfo {}
