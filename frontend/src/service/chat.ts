import { api, api2 } from "./api";


export const allChatUsers = () => api.get('/chatusers/allusers')

// message
export const allConversationforSpecficUser = (userId: number) => api.get(`/message/allcoversation/${userId}`)
export const speConversationForARoom = (conversationId: number, userId: number) => api.get(`/message/specoversation/${conversationId}/${userId}`)
export const sendMessage = (data: object) => api.post(`/message/send`, data)
export const sendFile = (data: object) => api2.post(`/message/send-file`, data)
export const deleteMessage = (messageId: number) => api.delete(`/message/delmessage/${messageId}`)

// chats
export const createPrivateRoom = (data: object) => api.post('chat/create-private', data)