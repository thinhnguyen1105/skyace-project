import { IFindNotificationSettingDetail } from "../../../../api/modules/host/notification-settings/interface";

export interface INotificationSettingsPageState {
  isBusy: boolean;
  settingData: IFindNotificationSettingDetail|{};
}

export interface IGetSettingByTenantIdSuccessPayload {
  settingData: IFindNotificationSettingDetail;
}

export interface IGetSettingByTenantIdPayload {
  tenantId: string;
}

export interface ISettingDataChangePayload {
  [key: string]: any;
}

export interface ISaveSettingDataPayload {
  settingData: IFindNotificationSettingDetail;
}