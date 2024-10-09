export * from './documentInsert';
export * from './documentCreateOne';
export * from './documentGetOne';
export * from './documentGetAll';
export * from './documentUpdate';

export interface IGuide {
  id: number;
  guideTitle: string;
  guideContent: string;
}

export interface IDocument {
  id: number;
  userId: number;
  title: string;
  createdAt: string;
}

export interface IDocumentDetail extends IDocument {
  ideaMessage: string;
}

export interface IMessage {
  id: number;
  guideId: number;
  messageContent: string;
}
