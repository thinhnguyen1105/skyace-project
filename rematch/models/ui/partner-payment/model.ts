import { createModel, ModelConfig } from '@rematch/core';
import {
  IPartnerPaymentPageState,
} from "./interface";
import { getTenantsService } from "../../../../service-proxies";
import { message } from 'antd';

const partnerDetailPageModel: ModelConfig<IPartnerPaymentPageState> = createModel({
  state: {
    partnerInfo: null,
    partnerPayment: [],
    partnerPaycheck : []
  },
  reducers: {
    fetchPartnerInfoSuccess: (
      state: IPartnerPaymentPageState,
      payload: any
    ) => {
      return {
        ...state,
        partnerInfo: payload
      };
    },
    fetchPartnerPaymentSuccess: (
      state: IPartnerPaymentPageState,
      payload: any
    ) => {
      return {
        ...state,
        partnerPayment: payload
      };
    },
    fetchPartnerPaycheckSuccess: (
      state: IPartnerPaymentPageState,
      payload: any
    ) => {
      return {
        ...state,
        partnerPaycheck: payload
      };
    },
    updatePartnerPaycheck: (
      state: IPartnerPaymentPageState,
      payload: string
    ) => {
      return {
        ...state,
        partnerPaycheck: state.partnerPaycheck.indexOf(payload) >= 0 ? 
          state.partnerPaycheck.filter(val => val !== payload) : [...state.partnerPaycheck, payload]
      };
    }
  },
  effects: {
    async updatePaycheck(payload: any): Promise<void> {
      try {
        await getTenantsService().updatePartnerPaycheck({
          _id: payload._id,
          date: payload.date
        });
        this.updatePartnerPaycheck(payload.date);
      } catch (err) {
        message.error(err.message, 4);
      }
    }
  }
});

export default partnerDetailPageModel;
