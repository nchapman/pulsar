/* eslint-disable no-await-in-loop */
import { open as openDialog } from '@tauri-apps/api/dialog';
import { readDir, readTextFile } from '@tauri-apps/api/fs';
import { appDataDir } from '@tauri-apps/api/path';
import { open as openPath } from '@tauri-apps/api/shell';
import { memo } from 'preact/compat';

import { database, documentsRepository } from '@/db/index.ts';
import { classNames } from '@/shared/lib/func';
import { loge, logi } from '@/shared/lib/Logger.ts';
import { LeftPanel } from '@/shared/ui';

import { ChatHistory } from '../ChatHistory/ChatHistory.tsx';
import { SidebarFooter } from '../SidebarFooter/SidebarFooter.tsx';
import s from './Sidebar.module.scss';

interface Props {
  className?: string;
  open: boolean;
}

export const Sidebar = memo((props: Props) => {
  const { className, open } = props;

  const openAppData = async () => {
    const appDataDirPath = await appDataDir();
    openPath(appDataDirPath);
  };

  const scanDir = async () => {
    try {
      const directory = await openDialog({ directory: true, multiple: false });
      logi('Sidebar', directory);

      if (typeof directory === 'string') {
        // clear the table? Can be optimized later

        // Read the contents and place them on the table
        const files = await readDir(directory);

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < files.length; i++) {
          const file = files[i]!;
          const { path } = file;

          logi('Sidebar', `inserting file ${file.path}`);

          const content = await readTextFile(path);

          await documentsRepository.create({
            filename: file.name!,
            path,
            text: content,
          });
        }

        // recreate fts table
        // await database.execute('DROP TABLE documents_fts');
        // Create the virtual table for fts
        // await database.execute(`
        //   CREATE VIRTUAL TABLE documents_fts
        //   USING fts5(filename, text, content="documents", content_rowid="id");
        // `);

        const ftsQueryResult = await database.select("SELECT * FROM documents_fts('blah')");

        logi('Sidebar', `fts query result ${JSON.stringify(ftsQueryResult, null, 2)}`);
      }
    } catch (e: any) {
      loge('Sidebar', e);
    }
  };

  return (
    <LeftPanel
      open={open}
      className={classNames(s.panel, [className])}
      contentClassName={s.sidebar}
    >
      <ChatHistory className={s.chatHistory} />
      <SidebarFooter className={s.sidebarFooter} />
      {/* @ts-ignore */}
      {process.env.NODE_ENV === 'development' && (
        <>
          {/* eslint-disable-next-line react/button-has-type */}
          <button className={s.debug} onClick={openAppData}>
            Open App Data
          </button>
          {/* eslint-disable-next-line react/button-has-type */}
          <button className={s.debug} onClick={scanDir}>
            Select scan dir
          </button>
        </>
      )}
    </LeftPanel>
  );
});
