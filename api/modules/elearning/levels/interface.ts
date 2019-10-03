import { IsAuditable,  HasTenant, HasActive } from '../../../core/interfaces';
import { Document } from 'mongoose';
export interface ILevel extends Document, HasActive, IsAuditable, HasTenant {
  name: string;
  slug: string;
  description: string;
}

export interface IFindLevelsResult {
  total: number;
  data: any;
}

export interface IFindLevelDetail {
  _id: string;
  name: string;
  slug: string;
  description: string;
  tenant: any;
  isActive: boolean;
}