import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  loginClient,
  changeClientPassword,
  getClientProfile,
} from '../modules/portal/services/portal-auth.service';
import { appHref } from '../core/utils/appBase.js';

const ClientAuthContext = createContext(null);

export function ClientAuthProvider({ children }) {
  const [client, setClient] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('client_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = !!token && !!client;

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('client_token');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await getClientProfile();
        setClient(response.data.data);
        setToken(storedToken);
      } catch {
        localStorage.removeItem('client_token');
        localStorage.removeItem('client_data');
        setToken(null);
        setClient(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);

    try {
      const response = await loginClient({ email, password });
      const { token: newToken, client: clientData } = response.data.data;

      localStorage.setItem('client_token', newToken);
      localStorage.setItem('client_data', JSON.stringify(clientData));
      setToken(newToken);
      setClient(clientData);

      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al iniciar sesión';
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_data');
    setToken(null);
    setClient(null);
    setError(null);
    window.location.href = appHref('/portal/login');
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setError(null);

    try {
      await changeClientPassword({ currentPassword, newPassword });
    } catch (err) {
      const message = err.response?.data?.message || 'Error al cambiar la contraseña';
      setError(message);
      throw err;
    }
  }, []);

  const value = {
    client,
    token,
    loading,
    error,
    login,
    logout,
    changePassword,
    isAuthenticated,
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);

  if (!context) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }

  return context;
}

export default ClientAuthContext;
