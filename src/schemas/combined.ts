import { ResponseSchema, SchemaType } from '@google/generative-ai'

const combinedResponseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    message: {
      type: SchemaType.STRING,
      description: "answer the question asked, this should be a human readable response in markdown format"
    },
    does_message_reference_cat: {
      type: SchemaType.BOOLEAN,
      description: "Whether the message contains any reference to cats"
    }
  },
  required: ["message", "does_message_reference_cat"]
} 

export { combinedResponseSchema }