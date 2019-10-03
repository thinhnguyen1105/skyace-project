import { Document } from 'mongoose';
import { HasCreationAuditInfo, HasModificationAuditInfo, HasActive, PageableQuery, PageableResult, SortableQuery} from '../../../core/interfaces';

export interface IPromoCode extends Document, HasActive, HasCreationAuditInfo, HasModificationAuditInfo {
  name: string;
  value : number;
  type : string;
  quantity: number;
  startDate: Date;
  endDate: Date;
  isInfinite: boolean;
  description: string;
}

export interface IFindPromoCodeQuery extends PageableQuery, SortableQuery {
  search?: string;
}

export interface IFindPromoCodesResult extends PageableResult<IFindPromoCodeDetail> {}

export interface IFindPromoCodeDetail {
  _id: string;
  name: string;
  value : number;
  type : string;
  quantity: number;
  startDate: Date;
  endDate: Date;
  isInfinite: boolean;
  description: string;
  isActive: boolean;
}

export interface ICreatePromoCodeInput extends HasCreationAuditInfo, HasActive{
  name: string;
  description: string;
  value: number;
  type: string;
  quantity: number;
  startDate: Date;
  isInfinite: boolean;
  endDate: Date;
}

export interface IUpdatePromoCodeInput {
  _id: string;
  name?: string;
  description?: string;
  value?: number;
  quantity?: number;
  isInfinite?: boolean;
  type?: number;
  startDate?: Date;
  endDate?: Date;
}
