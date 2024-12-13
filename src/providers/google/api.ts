import { GoogleGenerativeAI, GenerateContentRequest, GenerationConfig } from "@google/generative-ai"
import type { ResponseSchema } from '@google/generative-ai'
import { SchemaType } from '@google/generative-ai'

/**
 * Payload interface for Google AI API requests
 */
export interface GoogleFetchPayload {
  /** Google API key */
  apiKey: string
  /** Model identifier (e.g., "gemini-1.5-pro") */
  model: string
  /** Whether to stream the response */
  stream: boolean
  /** Request content and parameters */
  body: GenerateContentRequest
  /** Optional abort signal for cancellation */
  signal?: AbortSignal
  /** Optional schema for structured output */
  schema: ResponseSchema
}

/**
 * Fetches chat completion from Google's Generative AI
 * @param payload Request configuration and content
 * @returns Promise of either streamed or complete response
 */
export const fetchChatCompletion = async(payload: GoogleFetchPayload) => {
  const { apiKey, body, model, stream, schema } = payload
  
  const genAI = new GoogleGenerativeAI(apiKey)


  const genModel = genAI.getGenerativeModel({model})

  body.generationConfig = {
    responseMimeType: "application/json",
    responseSchema: schema,
  }

  console.log("called with schema", schema, "for model", model)
  console.log("body", body)
  if (stream) {
    return genModel.generateContentStream(body)
  } else {
    return genModel.generateContent(body)
  }
}
