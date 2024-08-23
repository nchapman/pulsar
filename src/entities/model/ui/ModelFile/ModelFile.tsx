import { memo, ReactNode } from 'preact/compat';

import { ModelFileData } from '@/entities/model';
import { getQuantization } from '@/entities/model/lib/getQuantization.ts';
import { ModelTag } from '@/entities/model/ui/ModelTag/ModelTag.tsx';
import ModelProjFileIcon from '@/shared/assets/icons/file-plus.svg';
import ModelFileIcon from '@/shared/assets/icons/file-square.svg';
import TextFileIcon from '@/shared/assets/icons/text-file.svg';
import { classNames } from '@/shared/lib/func';
import { Icon, Text } from '@/shared/ui';

import s from './ModelFile.module.scss';

interface Props {
  className?: string;
  children: ReactNode;
  data: ModelFileData;
}

function getIcon(isMmproj: boolean, isGguf: boolean) {
  if (!isGguf) return TextFileIcon;
  return isMmproj ? ModelProjFileIcon : ModelFileIcon;
}

export const ModelFile = memo((props: Props) => {
  const { className, children, data } = props;
  const { name, size, isMmproj, isGguf } = data;
  const quantization = getQuantization(name);

  return (
    <div className={classNames(s.modelFile, [className])}>
      <div>
        <div className={s.header}>
          <Icon svg={getIcon(isMmproj, isGguf)} className={s.icon} />
          <Text c="primary" w="medium" s={16} className={s.fileName}>
            {name}
          </Text>
        </div>

        <div className={s.tags}>
          <ModelTag data={{ value: size, type: 'size' }} />

          {isMmproj && <ModelTag data={{ type: 'vision' }} />}

          {quantization && <ModelTag data={{ value: quantization, type: 'quantization' }} />}
        </div>
      </div>
      <div className={s.rightSide}>{children}</div>
    </div>
  );
});
