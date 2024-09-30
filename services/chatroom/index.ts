export * from './chatroomGetAll';
export * from './chatroomGetOne';
export * from './chatroomCheckMessage';
export * from './chatroomCreateOne';

export interface IChatroom {
  chatroomId: number;
  numberingId: number;
}

export interface IChatroomPreview extends IChatroom {
  lastMessage: string | null;
  lastMessageCreatedAt: string | null;
  unreadMessageCount: number | null;
}
