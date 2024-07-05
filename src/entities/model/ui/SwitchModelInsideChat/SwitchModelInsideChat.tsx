import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import { Popover } from 'react-tiny-popover';

import { DEFAULT_LLM } from '@/entities/model';
import { goToModelStore } from '@/pages/chat';
import CheckIcon from '@/shared/assets/icons/check-circle-broken.svg';
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg';
import CubeIcon from '@/shared/assets/icons/cube.svg';
import { classNames } from '@/shared/lib/func';
import { useToggle } from '@/shared/lib/hooks';
import { Button, Icon, Text } from '@/shared/ui';

import { LlmName, supportedLlms } from '../../consts/supported-llms.const.ts';
import { $currentModel } from '../../model/manage-models-model.ts';
import s from './SwitchModelInsideChat.module.scss';

interface Props {
  className?: string;
}

export const SwitchModelInsideChat = memo((props: Props) => {
  const { className } = props;
  const currentModel = useUnit($currentModel);
  const { off: hidePopover, toggle: togglePopover, isOn: isPopoverShown } = useToggle();

  if (!currentModel) return null;
  const { name } = supportedLlms[currentModel];

  const popover = (
    <div className={s.popover}>
      <div className={s.popoverHead}>
        <Text className={s.hint} s={12} w="semi">
          Choose Model
        </Text>

        <Button className={s.explore} variant="clear" onClick={goToModelStore}>
          Explore models
          <Icon svg={CubeIcon} className={s.icon} />
        </Button>
      </div>

      <div>
        {Object.keys(supportedLlms).map((i) => {
          const { name } = supportedLlms[i as LlmName];

          return (
            <Button
              active={i === currentModel}
              key={name}
              className={s.model}
              variant="clear"
              onClick={() => undefined}
            >
              {name}
              <div className={s.modelInfo}>
                {i === DEFAULT_LLM && (
                  <div className={s.default}>
                    <Text s={12}>Set as default</Text>
                  </div>
                )}
                {i === currentModel && <Icon svg={CheckIcon} className={s.selectedIcon} />}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <Popover
      isOpen={isPopoverShown}
      positions={['bottom']}
      content={popover}
      align="start"
      padding={4}
      onClickOutside={hidePopover}
    >
      <div>
        <Button
          onClick={togglePopover}
          className={classNames(s.switchModelInsideChat, [className], { [s.open]: isPopoverShown })}
          variant="clear"
        >
          {name}
          <Icon svg={ChevronDownIcon} className={s.icon} />
        </Button>
      </div>
    </Popover>
  );
});
