// @ts-nocheck
import { Model } from '@nozbe/watermelondb';
import { date, json, readonly, relation, text } from '@nozbe/watermelondb/decorators';

import { modelsTable } from '@/db/model/model.schema.ts';

import { downloadsTable } from './download.schema.ts';

export class DownloadModel extends Model {
  static table = downloadsTable.name;

  @text(downloadsTable.cols.remoteUrl) remoteUrl;

  @text(downloadsTable.cols.progress) progress;

  @json(downloadsTable.cols.isFinished, (json) => json) isFinished;

  @json(downloadsTable.cols.isPaused, (json) => json) isPaused;

  @text(downloadsTable.cols.localName) localName;

  @json(downloadsTable.cols.dto, (json) => json) dto;

  @text(downloadsTable.cols.type) type;

  @relation(modelsTable.name, downloadsTable.cols.modelId) model;

  @readonly @date(downloadsTable.cols.createdAt) createdAt;

  @readonly @date(downloadsTable.cols.updatedAt) updatedAt;
}
