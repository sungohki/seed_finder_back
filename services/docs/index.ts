export * from './documentInsert';
export * from './documentCreateOne';
export * from './documentGetOne';
export * from './documentGetAll';
export * from './documentUpdate';

export interface IGuide {
  id: number;
  documentTopicId: string;
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

export interface IDocumentRequest {
  title: string;
  message: string;
  numberingId: string;
}

export interface IMessage {
  id: number;
  documentId: number;
  guideId: number;
  messageContent: string;
}
