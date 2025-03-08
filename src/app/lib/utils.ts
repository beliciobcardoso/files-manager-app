export const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
  else return `${(size / 1048576).toFixed(2)} MB`;
};

export const isImageFile = (fileType: string): boolean => {
  return fileType.startsWith('image/');
};

export const isTextFile = (fileType: string): boolean => {
  const textTypes = ['text/', 'application/json', 'application/xml', 'application/javascript'];
  return textTypes.some(type => fileType.includes(type));
};

export const isPdfFile = (fileType: string): boolean => {
  return fileType === 'application/pdf';
};