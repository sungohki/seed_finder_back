export * from './documentInsert';
export * from './documentCreateOne';
export * from './documentGetOne';
export * from './documentGetAll';
export * from './documentDeleteOne';
export * from './documentUpdateOne';

export interface IDocumentGuide {
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
  deviceToken: string;
}
