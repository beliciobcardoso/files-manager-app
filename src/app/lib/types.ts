export type FileType = {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: Date | string;
  path: string;
};

export type FolderType = {
  id: number;
  key: string;
  name: string;
  path: string;
  parentKey: string;
  userId: string;
  subfolders?: FolderType[];
};