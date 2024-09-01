import { memo, ReactNode } from 'preact/compat';

import { ModelFileData, ModelTag } from '@/entities/model';
import { getQuantization } from '@/entities/model/lib/getQuantization.ts';
import ModelProjFileIcon from '@/shared/assets/icons/file-plus.svg';
import ModelFileIcon from '@/shared/assets/icons/file-square.svg';
import InfoIcon from '@/shared/assets/icons/info-circle.svg';
import TextFileIcon from '@/shared/assets/icons/text-file.svg';
import { classNames } from '@/shared/lib/func';
import { Icon, Text, Tooltip } from '@/shared/ui';

import s from './ModelFile.module.scss';

interface Props {
  className?: string;
  children: ReactNode;
  data: ModelFileData;
  isDownloads?: boolean;
}

function getIcon(isMmproj: boolean, isGguf: boolean) {
  if (!isGguf) return TextFileIcon;
  return isMmproj ? ModelProjFileIcon : ModelFileIcon;
}

export const ModelFile = memo((props: Props) => {
  const { className, children, data, isDownloads } = props;
  const { name, size, isMmproj, isGguf } = data;
  const quantization = getQuantization(name);

  return (
    <div className={classNames(s.modelFile, [className], { [s.downloads]: isDownloads })}>
      <div>
        <div className={s.header}>
          <Icon svg={getIcon(isMmproj, isGguf)} className={s.icon} />
          <Text c="primary" w="medium" s={16} className={s.fileName}>
            {name}
          </Text>
          {isMmproj && !isDownloads && (
            <Tooltip
              variant="primary"
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
                    One vision adapter file <ModelTag className={s.tag} data={{ type: 'vision' }} />
                    , which allows the primary model to handle image inputs.
                  </Text>
                  <Text s={12}>
                    Once both files are downloaded, Pulsar will automatically link them together and
                    you can start to interact with the chat.
                  </Text>
                </div>
              }
              position="topLeft"
            >
              <Icon svg={InfoIcon} className={s.mmpInfo} size={16} />
            </Tooltip>
          )}
        </div>

        <div className={s.tags}>
          {!isGguf && <ModelTag isDownloads={isDownloads} data={{ type: 'other' }} />}

          {isGguf && !isMmproj && <ModelTag isDownloads={isDownloads} data={{ type: 'model' }} />}

          {isMmproj && <ModelTag isDownloads={isDownloads} data={{ type: 'vision' }} />}

          {quantization && (
            <ModelTag
              isDownloads={isDownloads}
              data={{ value: quantization, type: 'quantization' }}
            />
          )}

          <ModelTag isDownloads={isDownloads} data={{ value: size, type: 'size' }} />
        </div>
      </div>
      <div className={s.rightSide}>{children}</div>
    </div>
  );
});
