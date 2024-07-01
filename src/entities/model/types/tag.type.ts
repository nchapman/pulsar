export type ModelTagType =
  | 'type'
  | 'arch'
  | 'params'
  | 'vision'
  | 'has-vision'
  | 'full-precision'
  | 'too-large'
  | 'recommended'
  | 'size'
  | 'quantization';

export interface Tag {
  value: string | number;
  type: ModelTagType;
}
