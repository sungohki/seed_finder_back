export * from './documentCreate';
export * from './generateMessage';
export * from './supportSendData';
export * from './getDocContents';
export * from './documentUpdate';
export interface IGuide {
  id: number;
  guideTitle: string;
  guideContent: string;
}

export interface IDocument {
  id: number;
  userId: number;
  ideaMessage: string;
}

export interface IMessage {
  id: number;
  guideId: number;
  messageContent: string;
}
