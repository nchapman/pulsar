export type ModelTagType =
  | 'type'
  | 'arch'
  | 'params'
  | 'vision'
  | 'hasVision'
  | 'full-precision'
  | 'too-large'
  | 'recommended'
  | 'size'
  | 'quantization';

export interface Tag {
  value?: string | number;
  type: ModelTagType;
}
