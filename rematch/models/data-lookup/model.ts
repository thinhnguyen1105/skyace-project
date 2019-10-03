import { createModel, ModelConfig } from '@rematch/core';

const dataLookupModel: ModelConfig<any> = createModel({
  state: {},
  reducers: {
    fetchDataSuccess: (_state: any, payload: {result: any}): any => {
      return {
        ...payload.result
      };
    }
  },
  effects: {},
});

export default dataLookupModel;