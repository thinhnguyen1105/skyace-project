import * as mongoose from 'mongoose';
import { addAuditSchema } from '../../../core/helpers';
import addTenantSchema from '../../../core/helpers/add-tenant-schema';
import { INotificationSetting } from './interface';

const NotificationSettingSchema = new mongoose.Schema(addAuditSchema(addTenantSchema({
  accountRegistration: {
    email: Boolean,
    sms: Boolean,
  },
  cancelTuition: {
    email: Boolean,
    sms: Boolean,
  },
  newBooking: {
    email: Boolean,
    sms: Boolean,
  },
  reschedule: {
    email: Boolean,
    sms: Boolean,
  }
})));
const NotificationSettingsModel = mongoose.model<INotificationSetting>('NotificationSetting', NotificationSettingSchema);

export default NotificationSettingsModel;