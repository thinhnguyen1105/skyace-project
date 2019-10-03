import { createModel, ModelConfig } from '@rematch/core';
import {
  IDistributorDetailPageState,
} from "./interface";
import { getUsersService } from "../../../../service-proxies";
import { message } from 'antd';

const distributorDetailPageModel: ModelConfig<IDistributorDetailPageState> = createModel({
  state: {
    data: {
      
    },
  },
  reducers: {
    fetchDataSuccess: (
      state: IDistributorDetailPageState,
      payload: any
    ) => {
      return {
        ...state,
        data: payload
      };
    },
    onChangeData: (
      state: IDistributorDetailPageState,
      payload: any
    ) => {
      return {
        ...state,
        data: {
          ...state.data,
          ...payload,
          phone: {
            ...(state.data && state.data.phone ? state.data.phone : {}),
            ...(payload.phone ? payload.phone : {})
          },
          distributorInfo: {
            ...(state.data && state.data.distributorInfo ? state.data.distributorInfo : {}),
            ...(payload.distributorInfo ? payload.distributorInfo : {})
          }
        }
      }
    }
  },
  effects: {
    async update(payload: any): Promise<void> {
      try {
        await getUsersService().update(payload);
        message.success('Update successfully!');
      } catch (err) {
        message.error(err.message, 4);
      }
    }
  }
});

export default distributorDetailPageModel;
