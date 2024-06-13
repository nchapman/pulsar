import { memo, useLayoutEffect } from 'preact/compat';

import DownloadIcon from '@/shared/assets/icons/download.svg';
import { classNames } from '@/shared/lib/func';
import { useToggle } from '@/shared/lib/hooks';
import { changeTheme } from '@/shared/theme';
import { Button, Icon, Text } from '@/shared/ui';

import { ModelCard } from '../ModelCard/ModelCard';
import s from './InitialModelDownload.module.scss';

interface Props {
  className?: string;
}

export const InitialModelDownload = memo((props: Props) => {
  const { className } = props;
  // const { on: pause, off: resume, isOn: isPaused } = useToggle();
  const { on: startDownload, isOn: isDownloading } = useToggle();

  // const downloadInfo = useStoreMap($modelsDownload, (s) => s[model]);

  useLayoutEffect(() => {
    changeTheme('dark');
  }, []);

  const handleModelDownload = () => {
    startDownload();
    // downloadModelEff(model);
  };

  return (
    <div className={classNames(s.initialModelDownload, [className])}>
      <Text className={s.requiredTitle} c="primary" w="bold" s={18}>
        Required model
      </Text>

      <ModelCard model={'a' as any} className={s.modelCard} />

      <div className={s.action}>
        {/* {downloadInfo?.percent ? ( */}
        {/*  <Progress */}
        {/*    onPause={pause} */}
        {/*    isPaused={isPaused} */}
        {/*    onResume={resume} */}
        {/*    percent={downloadInfo?.percent} */}
        {/*  /> */}
        {/* ) : ( */}
        <Button onClick={handleModelDownload} variant="primary" loading={isDownloading}>
          <Icon svg={DownloadIcon} />
          Download model
        </Button>
        {/* )} */}
      </div>
    </div>
  );
});
