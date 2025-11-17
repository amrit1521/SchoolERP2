import { api, api2 } from "./api";


export const allChatUsers = () => api.get('/chatusers/allusers')
export const OnlineChatUsers = () => api.get('/chatusers/onlineusers')

// message
export const allConversationforSpecficUser = (userId: number) => api.get(`/message/allcoversation/${userId}`)
export const speConversationForARoom = (conversationId: number, userId: number) => api.get(`/message/specoversation/${conversationId}/${userId}`)
export const sendMessage = (data: object) => api.post(`/message/send`, data)
export const sendFile = (data: object) => api2.post(`/message/send-file`, data)
export const deleteMessage = (messageId: number) => api.delete(`/message/delmessage/${messageId}`)
export const msgStarUpdate = (data:object , messageId:number )=>api.put(`/message/star/${messageId}` , data)
export const msgReportUpdate = (data:object , messageId:number )=>api.put(`/message/report/${messageId}` , data)
export const msgReactionsUpdate = (data:object , messageId:number )=>api.post(`/message/react/${messageId}` , data)

// chats
export const createPrivateRoom = (data: object) => api.post('chat/create-private', data)