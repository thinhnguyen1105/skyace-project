import * as mongoose from 'mongoose';
import { SchemaDefinition } from 'mongoose';

const addTenantSchema = (definition: SchemaDefinition): SchemaDefinition => {
  return {
    ...definition,
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      es_type: "text",
      ref: 'Tenant'
    },
  };
};

export default addTenantSchema;