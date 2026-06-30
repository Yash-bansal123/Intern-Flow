import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  themeMode: localStorage.getItem('themeMode') || 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
      localStorage.setItem('themeMode', action.payload);
    },
    toggleThemeMode: (state) => {
      const newMode = state.themeMode === 'light' ? 'dark' : 'light';
      state.themeMode = newMode;
      localStorage.setItem('themeMode', newMode);
    },
  },
});

export const { toggleSidebar, setThemeMode, toggleThemeMode } = uiSlice.actions;
export default uiSlice.reducer;
