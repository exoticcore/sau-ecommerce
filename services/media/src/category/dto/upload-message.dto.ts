export type UploadMessageType = {
  title: string;
  path: string;
  file: string;
  mimetype: string;
};

export type UpdateCategoryType = {
  oldPath: string;
  title: string;
  file: string;
  path: string;
  mimetype: string;
};

export type DeleteCategoryType = {
  title: string;
  path: string;
};
