export type ModelTagType =
  | 'type'
  | 'arch'
  | 'params'
  | 'vision'
  | 'has-vision'
  | 'full-precision'
  | 'too-large'
  | 'size'
  | 'quantization';

export interface Tag {
  value: string;
  type: ModelTagType;
}
