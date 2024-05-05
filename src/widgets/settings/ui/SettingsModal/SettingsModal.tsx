import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Icon, Modal, TabItem, Tabs } from '@/shared/ui';
import { SettingGeneral } from '@/widgets/settings/ui/SettingGeneral/SettingGeneral.tsx';

import MyModelsIcon from '../../assets/server.svg';
import GeneralIcon from '../../assets/settings.svg';
import s from './SettingsModal.module.scss';

interface Props {
  className?: string;
  open: boolean;
  onClose: () => void;
}

const items = [
  {
    icon: GeneralIcon,
    label: 'General',
    content: <SettingGeneral />,
  },
  {
    icon: MyModelsIcon,
    label: 'My Models',
    content: <div>My Models</div>,
  },
];

export const SettingsModal = memo((props: Props) => {
  const { className, open, onClose } = props;

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
    <Modal open={open} onClose={onClose} className={classNames(s.settingsModal, [className])}>
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
