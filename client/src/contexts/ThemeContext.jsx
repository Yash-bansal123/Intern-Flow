import React, { createContext, useContext, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { selectThemeMode, toggleThemeMode, setThemeMode } from '../store/uiSlice';
import { getTheme } from '../theme/theme';

const ThemeContext = createContext({
  mode: 'dark',
  toggleMode: () => {},
  setMode: () => {},
});

/**
 * ThemeProvider – reads mode from Redux/localStorage,
 * builds the MUI theme, and exposes toggle helpers.
 */
export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const mode     = useSelector(selectThemeMode);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => dispatch(toggleThemeMode()),
      setMode: (m) => dispatch(setThemeMode(m)),
    }),
    [mode, dispatch],
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

/**
 * useThemeMode – shortcut to consume theme context.
 */
export const useThemeMode = () => useContext(ThemeContext);

export default ThemeProvider;
