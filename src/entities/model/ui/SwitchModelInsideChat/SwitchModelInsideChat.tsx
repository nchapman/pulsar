import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import { Popover } from 'react-tiny-popover';

import { modelManager } from '@/entities/model';
import { $defaultModel } from '@/entities/settings/managers/user-settings-manager.ts';
import { goToModelStore } from '@/pages/chat';
import CheckIcon from '@/shared/assets/icons/check-circle-broken.svg';
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg';
import CubeIcon from '@/shared/assets/icons/cube.svg';
import { classNames } from '@/shared/lib/func';
import { useToggle } from '@/shared/lib/hooks';
import { Button, Icon, Text } from '@/shared/ui';

import s from './SwitchModelInsideChat.module.scss';

interface Props {
  className?: string;
}

export const SwitchModelInsideChat = memo((props: Props) => {
  const { className } = props;
  const currentModel = useUnit(modelManager.state.$currentModel);
  const availableModels = useUnit(modelManager.state.$models);
  const defaultModel = useUnit($defaultModel);
  const { off: hidePopover, toggle: togglePopover, isOn: isPopoverShown } = useToggle();

  if (!currentModel) return null;
  const { name } = modelManager.getModelData(currentModel);

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
        {Object.values(availableModels)
          .filter((m) => m.type === 'llm')
          .map((m) => (
            <Button
              active={m.id === currentModel}
              key={m.name}
              className={s.model}
              variant="clear"
              onClick={() => modelManager.switchModel(m.id)}
            >
              {m.name}
              <div className={s.modelInfo}>
                {m.id === defaultModel && (
                  <div className={s.default}>
                    <Text s={12}>Set as default</Text>
                  </div>
                )}
                {m.id === currentModel && <Icon svg={CheckIcon} className={s.selectedIcon} />}
              </div>
            </Button>
          ))}
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
