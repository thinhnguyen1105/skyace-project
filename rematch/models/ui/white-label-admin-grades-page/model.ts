import { createModel, ModelConfig } from '@rematch/core';
import {
  IGradePageState,
} from "./interface";
import { getMetadataService } from "../../../../service-proxies";
import { message } from 'antd';

const coursePageModel: ModelConfig<IGradePageState> = createModel({
  state: {
    data: [],
    levels: [],
    createModalVisible: false,
    inputs: {
      name: "",
      description: "",
      level: ""
    },
    updateInputs: {},
    updateModalVisible: false,
  },
  reducers: {
    fetchDataSuccess: (
      state: IGradePageState,
      payload: any
    ): IGradePageState => {
      return {
        ...state,
        data: payload
      };
    },
    fetchLevelSuccess: (
      state: IGradePageState,
      payload: any
    ): IGradePageState => {
      return {
        ...state,
        levels: payload
      }
    },
    toggleCreateModal: (
      state: IGradePageState,
      payload: boolean
    ): IGradePageState => {
      return {
        ...state,
        createModalVisible: payload,
      }
    },
    changeInput: (
      state: IGradePageState,
      payload: any
    ): IGradePageState => {
      return {
        ...state,
        inputs: {
          ...state.inputs,
          ...payload
        }
      }
    },
    createSuccess: (
      state: IGradePageState,
      payload: any
    ): IGradePageState => {
      return {
        ...state,
        data: [payload, ...state.data]
      }
    },
    updateData: (
      state: IGradePageState,
      payload: any
    ): IGradePageState => {
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
      state: IGradePageState,
      payload: boolean
    ): IGradePageState => {
      return {
        ...state,
        updateModalVisible: payload,
      }
    },
    changeUpdateInputs : (
      state: IGradePageState,
      payload: any
    ): IGradePageState => {
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
    async fetchGradesEffect(): Promise<void> {
      try {
        const result = await getMetadataService().getAllGradesIncludeInactive();
        this.fetchDataSuccess(result.data || []);
      } catch (err) {
        message.error(err.message || "Internal server error");
      }
    },
    async fetchLevelsEffect(): Promise<void> {
      try {
        const result = await getMetadataService().getAllLevelsIncludeInactive();
        this.fetchLevelSuccess(result.data || []);
      } catch (err) {
        message.error(err.message || "Internal server error");
      }
    }
  }
});

export default coursePageModel;
