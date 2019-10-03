import { createModel, ModelConfig } from '@rematch/core';
import {
  ILevelPageState,
} from "./interface";
import { getMetadataService } from "../../../../service-proxies";
import { message } from 'antd';

const coursePageModel: ModelConfig<ILevelPageState> = createModel({
  state: {
    data: [],
    createModalVisible: false,
    inputs: {
      name: "",
      description: ""
    },
    updateInputs: {},
    updateModalVisible: false,
  },
  reducers: {
    fetchDataSuccess: (
      state: ILevelPageState,
      payload: any
    ): ILevelPageState => {
      return {
        ...state,
        data: payload
      };
    },
    toggleCreateModal: (
      state: ILevelPageState,
      payload: boolean
    ): ILevelPageState => {
      return {
        ...state,
        createModalVisible: payload,
      }
    },
    changeInput: (
      state: ILevelPageState,
      payload: any
    ): ILevelPageState => {
      return {
        ...state,
        inputs: {
          ...state.inputs,
          ...payload
        }
      }
    },
    createSuccess: (
      state: ILevelPageState,
      payload: any
    ): ILevelPageState => {
      return {
        ...state,
        data: [payload, ...state.data]
      }
    },
    updateData: (
      state: ILevelPageState,
      payload: any
    ): ILevelPageState => {
      return {
        ...state,
        data: state.data.map((val: any) => {
          return val._id === payload._id ? 
          {
            ...val,
            ...payload
          } : val
        })
      }
    },
    toggleUpdateModal: (
      state: ILevelPageState,
      payload: boolean
    ): ILevelPageState => {
      return {
        ...state,
        updateModalVisible: payload,
      }
    },
    changeUpdateInputs : (
      state: ILevelPageState,
      payload: any
    ): ILevelPageState => {
      return {
        ...state,
        updateInputs: {
          ...state.updateInputs,
          ...payload
        }
      }
    }
  },
  effects: {
    async fetchLevelsEffect(): Promise<void> {
      try {
        const result = await getMetadataService().getAllLevelsIncludeInactive();
        this.fetchDataSuccess(result.data || []);
      } catch (err) {
        message.error(err.message || "Internal server error");
      }
    },
  }
});

export default coursePageModel;
