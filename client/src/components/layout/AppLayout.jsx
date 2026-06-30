import React, { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setCredentials } from '../../store/authSlice';
import { authApi } from '../../api/authApi';

const AppLayout = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const { user, accessToken } = useSelector((state) => state.auth);

  // On every mount (including page refresh), if we have a token but no user object,
  // re-fetch /auth/me to rehydrate the user into Redux state.
  useEffect(() => {
    const rehydrateUser = async () => {
      if (accessToken && !user) {
        try {
          const res = await authApi.getMe();
          // getMe returns response.data → { success, data: userObj }
          const userObj = res.data ?? res;
          dispatch(setUser(userObj));
        } catch (err) {
          // Token invalid — authSlice logout will be triggered by the 401 interceptor
          console.warn('Could not rehydrate user:', err?.response?.status);
        }
      }
    };
    rehydrateUser();
  }, [accessToken, user, dispatch]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { sm: `calc(100% - ${sidebarOpen ? 260 : 80}px)` },
          transition: 'width 0.2s ease',
        }}
      >
        <Header />
        <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
