export * from './documentCreate';
export * from './documentGenerateMessage';
export * from './documentSendData';
export * from './documentGetOne';
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
