export interface Data {
  id: string
  title: string
  messages: Message[]
}
export interface Message {
  id: string
  msg: string
  role: string
  parent: string
  speed?: number
}
