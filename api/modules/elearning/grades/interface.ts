import { IsAuditable,  HasTenant, HasActive } from '../../../core/interfaces';
import { Document } from 'mongoose';
export interface IGrade extends Document, HasActive, IsAuditable, HasTenant {
  name: string;
  slug: string;
  description: string;
  level: any;
}

export interface IFindGradesResult {
  total: number;
  data: any;
}

export interface IFindGradeDetail {
  _id: string;
  name: string;
  slug: string;
  description: string;
  level: any;
  tenant: any;
  isActive: boolean;
}