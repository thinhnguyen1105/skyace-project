import { createModel, ModelConfig } from '@rematch/core';
import {
  IDistributorPaymentPageState,
} from "./interface";
import { getUsersService } from "../../../../service-proxies";
import { message } from 'antd';

const distributorDetailPageModel: ModelConfig<IDistributorPaymentPageState> = createModel({
  state: {
    distributorInfo: null,
    distributorPayment: [],
    distributorPaycheck : []
  },
  reducers: {
    fetchDistributorInfoSuccess: (
      state: IDistributorPaymentPageState,
      payload: any
    ) => {
      return {
        ...state,
        distributorInfo: payload
      };
    },
    fetchDistributorPaymentSuccess: (
      state: IDistributorPaymentPageState,
      payload: any
    ) => {
      return {
        ...state,
        distributorPayment: payload
      };
    },
    fetchDistributorPaycheckSuccess: (
      state: IDistributorPaymentPageState,
      payload: any
    ) => {
      return {
        ...state,
        distributorPaycheck: payload
      };
    },
    updateDistributorPaycheck: (
      state: IDistributorPaymentPageState,
      payload: string
    ) => {
      return {
        ...state,
        distributorPaycheck: state.distributorPaycheck.indexOf(payload) >= 0 ? 
          state.distributorPaycheck.filter(val => val !== payload) : [...state.distributorPaycheck, payload]
      };
    }
  },
  effects: {
    async updatePaycheck(payload: any): Promise<void> {
      try {
        await getUsersService().updateDistributorPaycheck(payload._id, payload.date);
        this.updateDistributorPaycheck(payload.date);
      } catch (err) {
        message.error(err.message, 4);
      }
    }
  }
});

export default distributorDetailPageModel;
