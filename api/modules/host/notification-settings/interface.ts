import { Document } from 'mongoose';
import { IsAuditable, HasCreationAuditInfo, HasModificationAuditInfo } from '../../../core/interfaces';

export interface INotificationSetting extends Document, IsAuditable {
  tenant: string;
  accountRegistration: {
    email: boolean;
    sms: boolean;
  };
  cancelTuition: {
    email: boolean;
    sms: boolean;
  };
  newBooking: {
    email: boolean;
    sms: boolean;
  };
  reschedule: {
    email: boolean;
    sms: boolean;
  };
}

export interface IFindNotificationSettingDetail {
  _id: string;
  tenant: string;
  accountRegistration: {
    email: boolean;
    sms: boolean;
  };
  cancelTuition: {
    email: boolean;
    sms: boolean;
  };
  newBooking: {
    email: boolean;
    sms: boolean;
  };
  reschedule: {
    email: boolean;
    sms: boolean;
  };
}

export interface ICreateNotificationSettingInput extends HasCreationAuditInfo{
  tenant: string;
}

export interface IEditNotificationSettingInput extends HasModificationAuditInfo {
  _id: string;
  tenant: string;
  accountRegistration?: {
    email: boolean;
    sms: boolean;
  };
  cancelTuition?: {
    email: boolean;
    sms: boolean;
  };
  newBooking?: {
    email: boolean;
    sms: boolean;
  };
  reschedule?: {
    email: boolean;
    sms: boolean;
  };
}