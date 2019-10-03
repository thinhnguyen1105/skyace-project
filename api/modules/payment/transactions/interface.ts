import { Document } from 'mongoose';
import { HasCreationAuditInfo, HasModificationAuditInfo, HasActive, PageableQuery, SortableQuery, PageableResult } from '../../../core/interfaces';

export interface ITransaction extends Document, HasActive, HasCreationAuditInfo, HasModificationAuditInfo {
  address: {
    city: string;
    country_code: string;
    line1: string;
    postal_code: string;
    recipient_name: string;
    state: string;
  };
  cancelled: boolean;
  email: string;
  paid: boolean;
  payerID: string;
  paymentId: string;
  paymentToken: string;
  returnUrl: string;
  paymentDetail: any;
  tuition: string;
  groupTuition: string;
  tutor: string;
  student: string;
  tenant: string;
  promoCode: any;
  isDiscount100: boolean;
  startAmount: number;
  option: string;
  isTuitionCanceled: boolean;
  studentRemark: string;
  tutorRemark: string;
}

export interface IFindTransactionsQuery extends PageableQuery, SortableQuery {
  search?: string;
}

export interface IFindTransactionsResult extends PageableResult<IFindTransactionDetail> {}

export interface ICreateTransactionInput extends HasCreationAuditInfo, HasActive {
  address: {
    city: string;
    country_code: string;
    line1: string;
    postal_code: string;
    recipient_name: string;
    state: string;
  };
  cancelled: boolean;
  email: string;
  paid: boolean;
  payerID: string;
  paymentId: string;
  paymentToken: string;
  returnUrl: string;
  tuition: string;
  groupTuition: string;
  tutor: string;
  student: string;
  paymentDetail: any;
  promoCode?: string;
  isDiscount100?: boolean;
  startAmount: number;
  option: string;
  isTuitionCanceled: boolean;
  studentRemark: string;
  tutorRemark: string;
}

export interface IFindTransactionDetail extends HasActive {
  _id: string;
  address: {
    city: string;
    country_code: string;
    line1: string;
    postal_code: string;
    recipient_name: string;
    state: string;
  };
  cancelled: boolean;
  email: string;
  paid: boolean;
  payerID: string;
  paymentId: string;
  paymentToken: string;
  returnUrl: string;
  isActive: boolean;
  paymentDetail: any;
  tuition: string;
  groupTuition: string;
  tutor: string;
  student: string;
  tenant: string;
  promoCode?: any;
  isDiscount100?: boolean;
  startAmount: number;
  option: string;
  isTuitionCanceled: boolean;
  studentRemark: string;
  tutorRemark: string;
}

export interface IGetAccessTokenResult {
  scope: string;
  nonce: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  tenant: string;
}