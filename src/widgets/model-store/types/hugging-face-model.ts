import { ModelEntry } from '@huggingface/hub';

export interface HuggingFaceModel extends ModelEntry {
  downloadsAllTime: number;
  author: string;
  sha: string;
  tags: string[];
}

export interface ModelFile {
  name: string;
  size: number;
  isGguf: boolean;
  fitsInMemory?: boolean;
  isMmproj: boolean;
}

export type HuggingFaceTask =
  | 'other'
  | 'text-classification'
  | 'token-classification'
  | 'table-question-answering'
  | 'question-answering'
  | 'zero-shot-classification'
  | 'translation'
  | 'summarization'
  | 'feature-extraction'
  | 'text-generation'
  | 'text2text-generation'
  | 'fill-mask'
  | 'sentence-similarity'
  | 'text-to-speech'
  | 'text-to-audio'
  | 'automatic-speech-recognition'
  | 'audio-to-audio'
  | 'audio-classification'
  | 'voice-activity-detection'
  | 'depth-estimation'
  | 'image-classification'
  | 'object-detection'
  | 'image-segmentation'
  | 'text-to-image'
  | 'image-to-text'
  | 'image-to-image'
  | 'image-to-video'
  | 'unconditional-image-generation'
  | 'video-classification'
  | 'reinforcement-learning'
  | 'robotics'
  | 'tabular-classification'
  | 'tabular-regression'
  | 'tabular-to-text'
  | 'table-to-text'
  | 'multiple-choice'
  | 'text-retrieval'
  | 'time-series-forecasting'
  | 'text-to-video'
  | 'image-text-to-text'
  | 'visual-question-answering'
  | 'document-question-answering'
  | 'zero-shot-image-classification'
  | 'graph-ml'
  | 'mask-generation'
  | 'zero-shot-object-detection'
  | 'text-to-3d'
  | 'image-to-3d'
  | 'image-feature-extraction';
