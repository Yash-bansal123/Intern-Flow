import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { setCredentials, logout as logoutAction, setLoading, setError } from '../store/authSlice';
import { useSnackbar } from 'notistack';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const login = useCallback(async (email, password) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      // authApi.login returns response.data which is:
      //   { success: true, data: { user, accessToken, refreshToken }, message: "Login successful" }
      // So we must read .data.data to get the actual payload
      const responseBody = await authApi.login({ email, password });
      const payload = responseBody.data; // { user, accessToken, refreshToken }

      if (!payload || !payload.accessToken) {
        throw new Error('Invalid response from server');
      }

      dispatch(setCredentials({
        user: payload.user,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      }));

      enqueueSnackbar(`Welcome back, ${payload.user?.first_name || 'User'}!`, { variant: 'success' });
      navigate('/dashboard');
      return true;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      dispatch(setError(message));
      enqueueSnackbar(message, { variant: 'error' });
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, navigate, enqueueSnackbar]);

  const register = useCallback(async (userData) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const responseBody = await authApi.register(userData);
      const message = responseBody.message || 'Registration successful!';
      enqueueSnackbar(message, { variant: 'success' });
      navigate('/login');
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      dispatch(setError(message));
      enqueueSnackbar(message, { variant: 'error' });
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, navigate, enqueueSnackbar]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Logout errors are non-critical — still clear local state
      console.warn('Logout API error (ignored):', err?.response?.data?.message || err.message);
    } finally {
      dispatch(logoutAction());
      navigate('/login');
    }
  }, [dispatch, navigate]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};
