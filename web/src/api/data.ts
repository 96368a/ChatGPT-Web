export interface Data {
  conversation_id: string
  messages: Message[]
}
export interface Message {
  id: string
  msg: string
  role: string
  parent: string
}
