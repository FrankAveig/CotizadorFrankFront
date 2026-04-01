import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ClientAuthProvider } from './context/ClientAuthContext';
import AppRouter from './router/AppRouter';
import './styles/globals.css';
import './styles/utilities.css';

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <ClientAuthProvider>
          <AppRouter />
        </ClientAuthProvider>
      </AuthProvider>
    </AppProvider>
  );
}
