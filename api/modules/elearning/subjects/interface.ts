import { IsAuditable,  HasTenant, HasActive } from '../../../core/interfaces';
import { Document } from 'mongoose';
export interface ISubject extends Document, HasActive, IsAuditable, HasTenant {
  name: string;
  slug: string;
  description: string;
}

export interface IFindSubjectsResult {
  total: number;
  data: any;
}

export interface IFindSubjectDetail {
  _id: string;
  name: string;
  slug: string;
  description: string;
  tenant: any;
  isActive: boolean;
}