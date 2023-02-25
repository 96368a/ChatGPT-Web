import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
})

export const getConversations =async () => {
  return (await api.get('/conversations')).data
}

export const getConversationsHistory = async (id: string) => {
  return (await api.get(`/conversation/${id}`)).data
}
