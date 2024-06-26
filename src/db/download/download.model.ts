// @ts-nocheck
import { Model } from '@nozbe/watermelondb';
import { date, json, readonly, text } from '@nozbe/watermelondb/decorators';

import { downloadsTable } from './download.schema.ts';

export class DownloadModel extends Model {
  static table = downloadsTable.name;

  @text(downloadsTable.cols.remoteUrl) remoteUrl;

  @json(downloadsTable.cols.downloadingData, (json) => json) downloadingData;

  @text(downloadsTable.cols.localName) localName;

  @json(downloadsTable.cols.dto, (json) => json) dto;

  @text(downloadsTable.cols.type) type;

  @text(downloadsTable.cols.modelId) modelId;

  @readonly @date(downloadsTable.cols.createdAt) createdAt;

  @readonly @date(downloadsTable.cols.updatedAt) updatedAt;
}
