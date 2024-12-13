import { fetchChatCompletion } from './api'
import { parseMessageList, parseStream } from './parser'
import type { Message } from '@/types/message'
import type { HandlerPayload, Provider } from '@/types/provider'
import { GenerateContentResult } from '@google/generative-ai'

export const handlePrompt: Provider['handlePrompt'] = async(payload, signal?: AbortSignal) => {
  if (payload.botId === 'chat_continuous')
    return handleChatCompletion(payload, signal)
  if (payload.botId === 'chat_single')
    return handleChatCompletion(payload, signal)
}

export const handleRapidPrompt: Provider['handleRapidPrompt'] = async(prompt, globalSettings) => {
  const rapidPromptPayload = {
    conversationId: 'temp',
    conversationType: 'chat_single',
    botId: 'temp',
    globalSettings: {
      ...globalSettings,
      model: 'gemini-2.0-flash-exp',
      temperature: 0.4,
      maxTokens: 10240,
      maxOutputTokens: 1024,
      topP: 0.8,
      topK: 1,
    },
    botSettings: {},
    prompt,
    messages: { contents: [{ role: 'user', parts: [{ text: prompt }] }] },
  } as unknown as HandlerPayload
  const result = await handleChatCompletion(rapidPromptPayload)
  if (typeof result === 'string')
    return result
  return ''
}

export const handleChatCompletion = async(payload: HandlerPayload, signal?: AbortSignal) => {
  const messages: Message[] = []

  let maxTokens = payload.globalSettings.maxTokens as number
  let messageHistorySize = payload.globalSettings.messageHistorySize as number

  // Iterate through the message history
  while (messageHistorySize > 0) {
    messageHistorySize--
    // Get the last message from the payload
    const m = payload.messages.pop()
    if (m === undefined)
      break

    if (maxTokens - m.content.length < 0)
      break

    maxTokens -= m.content.length
    messages.unshift(m)
  }

  const stream = payload.globalSettings.stream as boolean ?? true
  try {
    const result = await fetchChatCompletion({
      apiKey: payload.globalSettings.apiKey as string,
      stream,
      body: {
        contents: parseMessageList(messages),
        generationConfig: {
          temperature: payload.globalSettings.temperature as number,
          maxOutputTokens: payload.globalSettings.maxOutputTokens as number,
          topP: payload.globalSettings.topP as number,
          topK: payload.globalSettings.topK as number
        }
      },
      signal,
      model: payload.globalSettings.model as string,
      schema: payload.schema,
    })

    if (stream)
      return parseStream(result)
    
    return (result as GenerateContentResult).response.text()
  } catch (error: any) {
    throw new Error(`Failed to fetch chat completion: ${error.message}`)
  }
}
