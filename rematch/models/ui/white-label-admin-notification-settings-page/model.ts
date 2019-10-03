import { createModel, ModelConfig } from '@rematch/core';
import { INotificationSettingsPageState, IGetSettingByTenantIdSuccessPayload, IGetSettingByTenantIdPayload, ISettingDataChangePayload, ISaveSettingDataPayload } from './interface';
import { message } from 'antd';
import { getNotificationSettingsService } from '../../../../service-proxies';

const notificationSettingsPageModel: ModelConfig<INotificationSettingsPageState> = createModel({
  state: {
    isBusy: false,
    settingData: {},
  },
  reducers: {
    starting: (state: INotificationSettingsPageState): INotificationSettingsPageState => {
      return {
        ...state,
        isBusy: true,
      }
    },
    getSettingByTenantIdSuccess: (state: INotificationSettingsPageState, payload: IGetSettingByTenantIdSuccessPayload): INotificationSettingsPageState => {
      return {
        ...state,
        settingData: payload.settingData,
      };
    },
    handleSettingDataChange: (state: INotificationSettingsPageState, payload: ISettingDataChangePayload): INotificationSettingsPageState => {
      return {
        ...state,
        settingData: {
          ...state.settingData,
          ...payload,
        },
      };
    },
    saveSettingDataSuccess: (state: INotificationSettingsPageState): INotificationSettingsPageState => {
      return {
        ...state,
        isBusy: false,
      };
    },
  },
  effects: {
    async getSettingByTenantId(payload: IGetSettingByTenantIdPayload, _rootState): Promise<void> {
      try {
        const notificationSettingsService = getNotificationSettingsService();
        const settingData = await notificationSettingsService.findSettingByTenantId(payload.tenantId);
        console.log(settingData);
        this.getSettingByTenantIdSuccess({settingData});
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async saveSettingData(payload: ISaveSettingDataPayload, _rootState: any): Promise<void> {
      try {
        this.starting();

        const notificationSettingsService = getNotificationSettingsService();
        await notificationSettingsService.editNotificationSetting(payload.settingData as any);

        this.saveSettingDataSuccess();
      } catch (error) {
        message.error(error.message, 4);
      }
    },
  },
});

export default notificationSettingsPageModel;