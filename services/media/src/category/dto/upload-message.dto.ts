export type UploadMessageType = {
  file: Express.Multer.File;
  title: string;
  is_pravate: boolean;
};
