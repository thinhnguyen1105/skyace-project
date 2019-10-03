import { createModel, ModelConfig } from '@rematch/core';
import {
  ISubjectPageState,
} from "./interface";
import { getMetadataService } from "../../../../service-proxies";
import { message } from 'antd';

const coursePageModel: ModelConfig<ISubjectPageState> = createModel({
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
      state: ISubjectPageState,
      payload: any
    ): ISubjectPageState => {
      return {
        ...state,
        data: payload
      };
    },
    toggleCreateModal: (
      state: ISubjectPageState,
      payload: boolean
    ): ISubjectPageState => {
      return {
        ...state,
        createModalVisible: payload,
      }
    },
    changeInput: (
      state: ISubjectPageState,
      payload: any
    ): ISubjectPageState => {
      return {
        ...state,
        inputs: {
          ...state.inputs,
          ...payload
        }
      }
    },
    createSuccess: (
      state: ISubjectPageState,
      payload: any
    ): ISubjectPageState => {
      return {
        ...state,
        data: [payload, ...state.data]
      }
    },
    updateData: (
      state: ISubjectPageState,
      payload: any
    ): ISubjectPageState => {
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
      state: ISubjectPageState,
      payload: boolean
    ): ISubjectPageState => {
      return {
        ...state,
        updateModalVisible: payload,
      }
    },
    changeUpdateInputs : (
      state: ISubjectPageState,
      payload: any
    ): ISubjectPageState => {
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
    async fetchSubjectsEffect(): Promise<void> {
      try {
        const result = await getMetadataService().getAllSubjectsIncludeInactive();
        this.fetchDataSuccess(result.data || []);
      } catch (err) {
        message.error(err.message || "Internal server error");
      }
    },
  }
});

export default coursePageModel;
