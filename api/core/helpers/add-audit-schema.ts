import { SchemaDefinition } from 'mongoose';

const addAuditSchema = (definition: SchemaDefinition): SchemaDefinition => {
  return {
    ...definition,
    createdBy: {
      type: String,
      es_type: "text"
    },
    createdAt: Date,
    lastModifiedBy: {
      type: String,
      es_type: "text"
    },
    lastModifiedAt: Date,
  };
};

export default addAuditSchema;
