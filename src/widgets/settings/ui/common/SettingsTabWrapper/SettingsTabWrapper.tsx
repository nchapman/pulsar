import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';

import BackIcon from '../../../assets/arrow-narrow-left.svg';
import { SettingsRouteData } from '../../../types/settings.types.ts';
import s from './SettingsTabWrapper.module.scss';

interface Props {
  className?: string;
  mainRoute: string;
  routesData: SettingsRouteData;
  onChangeRoute: (route: string) => void;
  route: string;
}

export const SettingsTabWrapper = memo((props: Props) => {
  const { className, routesData, mainRoute, route, onChangeRoute } = props;
  const isMainRoute = route === mainRoute;

  const handleGoBack = () => {
    onChangeRoute(mainRoute);
  };

  // @ts-ignore
  const { title, content } = routesData[route];

  return (
    <div className={classNames(s.settingsTabWrapper, [className])}>
      {!isMainRoute && (
        <Button variant="clear" icon={BackIcon} onClick={handleGoBack} className={s.back} />
      )}
      <Text s={20} w="semi" c="primary">
        {title}
      </Text>

      <div className={s.children}>{content}</div>
    </div>
  );
});
