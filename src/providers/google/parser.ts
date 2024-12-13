import { createParser } from 'eventsource-parser'
import type { Message } from '@/types/message'
import type { ParsedEvent, ReconnectInterval } from 'eventsource-parser'

export const parseMessageList = (rawList: Message[]) => {
  if (rawList.length === 0)
    return []

  const parsedList = []
  // if first message is system message, insert an empty message after it
  if (rawList[0].role === 'system') {
    parsedList.push({ role: 'user', parts: [{ text: rawList[0].content }] })
    parsedList.push({ role: 'model', parts: [{ text: 'OK.' }] })
  }
  // convert other messages
  const roleDict = {
    user: 'user',
    assistant: 'model',
  } as const
  for (const message of rawList) {
    if (message.role === 'system')
      continue
    parsedList.push({
      role: roleDict[message.role],
      parts: [{ text: message.content }],
    })
  }
  return parsedList
}

export const parseStream = (response: any) => {
  const encoder = new TextEncoder()
  
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response.stream) {
          const text = chunk.text()
          const queue = encoder.encode(text)
          console.log("response text", text)
          controller.enqueue(queue)
        }
        controller.close()
      } catch (e) {
        controller.error(e)
      }
    },
  })
}
