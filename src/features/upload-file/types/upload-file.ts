export interface FileData {
  file: File;
  ext: string;
  name: string;
  type: 'application' | 'image' | 'video';
}
