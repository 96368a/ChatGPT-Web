import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
})

export const getConversationsHistory = async (id: string) => {
  return (await api.get(`/conversation/${id}`)).data
}
