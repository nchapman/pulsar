import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Icon, Modal, TabItem, Tabs, Text } from '@/shared/ui';

import MyModelsIcon from '../../assets/server.svg';
import GeneralIcon from '../../assets/settings.svg';
import { $isSettingsModalOpen, closeSettingsModal } from '../../model/settings.model.ts';
import { SettingsGeneral } from '../general/SettingsGeneral/SettingsGeneral.tsx';
import s from './SettingsModal.module.scss';

interface Props {
  className?: string;
}

const items = [
  {
    icon: GeneralIcon,
    label: 'General',
    content: <SettingsGeneral />,
  },
  {
    icon: MyModelsIcon,
    label: 'My Models',
    content: <div>My Models</div>,
  },
];

export const SettingsModal = memo((props: Props) => {
  const { className } = props;
  const open = useUnit($isSettingsModalOpen);

  const tabs: TabItem[] = items.map((item) => ({
    key: item.label,
    children: item.content,
    label: (
      <div className={s.tabLabelInner}>
        <Icon svg={item.icon} />
        {item.label}
      </div>
    ),
  }));

  return (
    <Modal
      open={open}
      onClose={closeSettingsModal}
      className={classNames(s.settingsModal, [className])}
    >
      <Text className={s.title} s={12} w="semi" c="tertiary">
        Settings
      </Text>
      <Tabs
        className={s.tabs}
        headerClassName={s.tabsHeader}
        bodyClassName={s.tabsBody}
        items={tabs}
        labelClassName={s.tabLabel}
        activeLabelClassName={s.activeTabLabel}
      />
    </Modal>
  );
});
