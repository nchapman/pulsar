import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import { useCallback } from 'preact/hooks';

import { goToAgents } from '@/app/routes';
import CubeIcon from '@/shared/assets/icons/cube.svg';
import LensIcon from '@/shared/assets/icons/search.svg';
import { classNames, getState } from '@/shared/lib/func';
import { Button, Icon, Input } from '@/shared/ui';

import s from './AgentsSearch.module.scss';

interface Props {
  className?: string;
  onPopoverClose: () => void;
}

const placeholder = 'Search agents...';

const [$searchAgentsNavbarValue, setSearchAgentsNavbarValue] = getState('');

export const AgentsSearch = memo((props: Props) => {
  const { className, onPopoverClose } = props;
  const value = useUnit($searchAgentsNavbarValue);

  const handleSubmit = useCallback((e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    // todo: implement search
  }, []);

  return (
    <form onSubmit={handleSubmit} className={classNames(s.agentsSearch, [className])}>
      <Icon svg={LensIcon} className={s.icon} />
      <Input
        autofocus
        placeholder={placeholder}
        className={s.input}
        value={value}
        // disabled={isLoading}
        onChange={setSearchAgentsNavbarValue}
      />
      <Button
        className={s.explore}
        variant="clear"
        onClick={() => {
          goToAgents();
          onPopoverClose();
        }}
      >
        <Icon svg={CubeIcon} className={s.icon} />
        Explore in Library
      </Button>
    </form>
  );
});
