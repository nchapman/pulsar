import * as stylex from '@stylexjs/stylex';

import { withOpacity } from '@/shared/lib/func';

const root = {
  white: '#ffffff',
  black: '#000000',

  gray50: '#f9f9f9',
  gray100: '#ececec',
  gray200: '#cdcdcd',
  gray300: '#b4b4b4',
  gray400: '#9b9b9b',
  gray500: '#676767',
  gray600: '#424242',
  gray700: '#2f2f2f',
  gray800: '#212121',
  gray900: '#171717',

  brand: '#ffffff',
};

const text = {
  textPrimary: root.gray100,
  textSecondary: root.gray300,
  textTertiary: root.gray500,
  textQuaternary: root.gray700,
};

const border = {
  borderLight: withOpacity(root.white, 10),
  borderMedium: withOpacity(root.white, 15),
  borderHeavy: withOpacity(root.white, 20),
  borderXHeavy: withOpacity(root.white, 25),
};

const mainBackground = {
  mainBackgroundPrimary: root.gray800,
  mainBackgroundSecondary: root.gray700,
  mainBackgroundTertiary: root.gray600,
  mainBackgroundQuaternary: withOpacity(root.white, 5),
};

const sidebarBackground = {
  sidebarBackgroundPrimary: root.gray900,
  sidebarBackgroundSecondary: root.gray800,
  sidebarBackgroundTertiary: root.gray700,
};

const link = {
  linkDefault: '#7AB7FF',
  linkHover: '#5E83B3',
};

const icon = {
  iconDefault: withOpacity(root.white, 60),
  iconHover: withOpacity(root.white, 80),
  iconActive: withOpacity(root.white, 100),
  iconDisabled: withOpacity(root.white, 15),
};

const semantic = {
  success: '#12B76A',
  warning: '#FDB022',
  error: '#F04438',
  info: '#0089C2',
};

const button = {
  buttonPrimaryDefault: withOpacity(root.white, 100),
  buttonPrimaryHover: withOpacity(root.white, 90),
  buttonPrimaryDisabled: withOpacity(root.white, 30),

  buttonSecondaryDefault: withOpacity(root.white, 0),
  buttonSecondaryHover: withOpacity(root.white, 5),
  buttonSecondaryDisabled: withOpacity(root.white, 0),

  buttonTextPrimary: root.gray700,
  buttonTextPrimaryDisabled: withOpacity(root.gray700, 70),

  buttonTextSecondary: root.gray100,
  buttonTextSecondaryDisabled: withOpacity(root.gray100, 15),
};

export const colors = stylex.defineVars({
  ...root,
  ...text,
  ...border,
  ...mainBackground,
  ...sidebarBackground,
  ...link,
  ...icon,
  ...semantic,
  ...button,
});
