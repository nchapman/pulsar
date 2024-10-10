import { useUnit } from 'effector-react';
import { memo, ReactNode } from 'preact/compat';
import { useMemo, useState } from 'preact/hooks';

import { ModelFile, ModelFileData, ModelTag } from '@/entities/model';
import InfoIcon from '@/shared/assets/icons/info-circle.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Icon, Modal, Text, Tooltip } from '@/shared/ui';
import { Checkbox } from '@/shared/ui/Checkbox/Checkbox.tsx';
import { startFileDownload } from '@/widgets/model-store/lib/startFileDownload.ts';
import { $modelStoreState } from '@/widgets/model-store/model/model-store.model.ts';

import s from './AdditionalFileDownloadModal.module.scss';

type AddType = 'addMmp' | 'addLlm';

interface Props {
  className?: string;
  open: boolean;
  onClose: () => void;
  file: ModelFileData;
  type: AddType;
}

const c: Record<AddType, ReactNode[]> = {
  addLlm: [
    <>
      You have selected the <span className={s.highlight}>Vision Adapter</span> for download. We
      recommend downloading the <span className={s.highlight}>Model File</span> along with it.
    </>,
    'Would you like to download the Model File as well for full functionality?',
  ],
  addMmp: [
    <>
      You have selected the <span className={s.highlight}>Model File</span> for download. We
      recommend downloading the <span className={s.highlight}>Vision Adapter</span> along with it.
    </>,
    'Would you like to download the Vision Adapter as well for full functionality?',
  ],
};

export const AdditionalFileDownloadModal = memo((props: Props) => {
  const { className, onClose, open, type, file } = props;
  const [checked, setChecked] = useState(true);
  const files = useUnit($modelStoreState.currModelFiles);

  const secondFile = useMemo(() => {
    if (type === 'addMmp') {
      return files.find((f) => f.isMmproj);
    }

    return files.find((f) => f.fitsInMemory) || files.find((f) => f.isGguf && !f.isMmproj);
  }, [files, type]);

  const handleDownload = () => {
    [file, secondFile]
      .filter((_, idx) => (checked ? true : idx < 1))
      .sort((i) => (i?.isMmproj ? -1 : 1))
      .forEach((data) => {
        if (!data) return;
        startFileDownload($modelStoreState.currModel.getState()!, data.name, false);
      });
    onClose();
  };

  if (!secondFile) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={classNames(s.additionalFileDownloadModal, [className])}
    >
      <Text s={20} w="semi" c="primary">
        Special requirement
      </Text>

      <div className={s.divider} />

      <div className={s.files}>
        <div className={s.file}>
          <Checkbox onChange={() => undefined} checked disabled className={s.checkbox} />
          <ModelFile noTooltip data={file} className={s.file} />
        </div>

        <div className={s.divider} />

        <div className={s.file}>
          <Checkbox onChange={setChecked} checked={checked} className={s.checkbox} />
          <ModelFile noTooltip data={secondFile} className={s.file} />
        </div>
      </div>

      <div className={s.content}>
        {c[type].map((i) => (
          <Text s={16} c="primary">
            {i}
          </Text>
        ))}
      </div>

      <div className={s.footer}>
        <div className={s.footerLeft}>
          <Tooltip
            variant="primary"
            insideModal
            className={s.hiw}
            content={
              <div className={s.mmpInfoContent}>
                <Text s={12}>
                  To utilize a vision-enabled model, you need to download two specific files:
                </Text>
                <Text s={12}>
                  One primary model file, which can be recognized by the{' '}
                  <ModelTag className={s.tag} data={{ type: 'model' }} /> badge.
                </Text>
                <Text s={12}>
                  One vision adapter file <ModelTag className={s.tag} data={{ type: 'vision' }} />,
                  which allows the primary model to handle image inputs.
                </Text>
                <Text s={12}>
                  Once both files are downloaded, Hiro will automatically link them together and you
                  can start to interact with the chat.
                </Text>
              </div>
            }
            position="topLeft"
          >
            <Icon svg={InfoIcon} size={16} />
            <Text s={12}>How it works</Text>
          </Tooltip>
        </div>
        <div className={s.footerRight}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDownload}>
            Download
          </Button>
        </div>
      </div>
    </Modal>
  );
});
