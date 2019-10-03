import { SchemaDefinition } from 'mongoose';

const addActiveSchema = (definition: SchemaDefinition): SchemaDefinition => {
  return {
    ...definition,
    isActive: Boolean,
  };
};

export default addActiveSchema;