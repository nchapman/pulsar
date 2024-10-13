import { downloadsMock } from './download.mock.ts';
import { DownloadItem } from './download.repository.ts';

export class DownloadsRepositoryMock {
  downloads: DownloadItem[] = downloadsMock;

  async getById(id: Id): Promise<DownloadItem> {
    return Promise.resolve(this.downloads.find((download) => download.id === id) as DownloadItem);
  }

  async getAll(_?: any, __ = false): Promise<DownloadItem[]> {
    return Promise.resolve(this.downloads);
  }

  async create(data: Dto<DownloadItem>): Promise<DownloadItem> {
    const newDownload = {
      ...data,
      id: String(this.downloads.length + 1),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.downloads.push(newDownload);
    return Promise.resolve(newDownload);
  }

  async update(id: Id, data: UpdateDto<DownloadItem>): Promise<DownloadItem> {
    const download = this.downloads.find((download) => download.id === id) as DownloadItem;
    if (!download) return Promise.resolve(download);

    Object.assign(download, data);
    return Promise.resolve(download);
  }

  async remove(id: Id): Promise<void> {
    this.downloads = this.downloads.filter((download) => download.id !== id);
    return Promise.resolve();
  }

  async archiveAll(): Promise<void> {
    this.downloads = this.downloads.map((download) => ({ ...download, isArchived: true }));
    return Promise.resolve();
  }

  async removeAll(): Promise<void> {
    this.downloads = [];
    return Promise.resolve();
  }
}
