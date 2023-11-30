export type UploadMessageType = {
  title: string;
  file: string;
  path: string;
  mimetype: string;
  is_private?: boolean;
};

export type UpdateMessageType = {
  oldPath?: string;
  title: string;
  file: string;
  path: string;
  mimetype: string;
  is_private?: boolean;
};

export type DeleteMessageType = {
  path: string;
};
