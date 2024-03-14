import { ReactNode } from 'preact/compat';
import { useEffect, useMemo, useState } from 'preact/hooks';

import { getDefaultTheme } from '../lib/getDefaultTheme';
import { Theme, ThemeContext } from '../lib/ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

const defaultTheme = getDefaultTheme();
const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const defaultProps = useMemo(() => ({ theme: Theme.DARK, setTheme }), []);

  useEffect(() => {
    document.body.classList.add(theme);

    return () => {
      document.body.classList.remove(theme);
    };
  }, [theme]);

  return <ThemeContext.Provider value={defaultProps}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
