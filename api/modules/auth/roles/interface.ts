import { Document } from 'mongoose';
import { IsAuditable, HasActive, HasTenant, HasCreationAuditInfo, PageableQuery, SortableQuery, PageableResult, HasModificationAuditInfo } from '../../../core/interfaces';

export interface IRole extends Document, IsAuditable, HasActive, HasTenant {
  name: string;
  normalizedName: string;
  permissions: string[];
  isDefault: boolean;
}

export interface ICreateRoleInput extends HasCreationAuditInfo {
  name: string;
  permisstions: string[];
  isDefault: boolean;
}

export interface IFindRolesQuery extends PageableQuery, SortableQuery {
  search?: string;
  filter?: string[];
}

export interface IFindRoleDetail {
  _id: string;
  name: string;
  normalizedName: string;
  permissions: string[];
  isDefault: boolean;
  isActive: boolean;
}

export interface IFindRolesResult extends PageableResult<IFindRoleDetail> {}

export interface IUpdateRoleInput extends HasModificationAuditInfo {
  _id: string;
  name?: string;
  permissions?: string[];
  isDefault?: boolean;
}

export interface IActivateRole extends HasModificationAuditInfo {
  roleId: string;
}