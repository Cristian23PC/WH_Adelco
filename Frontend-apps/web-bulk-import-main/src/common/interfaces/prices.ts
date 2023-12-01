export interface IPrices {
  sendingPlatform: string;
  broadcastChannel: string;
  documents: IDocuments[];
  personalizations: IPersonalizations[];
}

interface IDocuments {
  filename: string;
  content: IDocumentContent;
  contentId: string;
  extension: string;
}

interface IDocumentContent {
  type: string;
  data: Uint8Array;
}

interface IPersonalizations {
  dynamicData: object;
}
