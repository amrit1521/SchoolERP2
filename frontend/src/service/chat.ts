import { api } from "./api";


export const allChatUsers = () => api.get('/chatusers/allusers')

// message
export const allConversationforSpecficUser = (userId: number) => api.get(`/message/allcoversation/${userId}`)
export const speConversationForARoom = (conversationId: number) => api.get(`/message/specoversation/${conversationId}`)
export const sendMessage = (data: object) => api.post(`/message/send` , data)

// chats
export const createPrivateRoom = (data:object)=>api.post('chat/create-private' , data)