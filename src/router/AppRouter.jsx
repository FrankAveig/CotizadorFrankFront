import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import PortalLayout from '../layouts/PortalLayout';
import ProtectedRoute from './ProtectedRoute';
import ProtectedPortalRoute from './ProtectedPortalRoute';
import Loader from '../components/ui/Loader';

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const ClientsPage = lazy(() => import('../pages/clients/ClientsPage'));
const ClientDetailPage = lazy(() => import('../pages/clients/ClientDetailPage'));
const ClientFormPage = lazy(() => import('../pages/clients/ClientFormPage'));
const QuotesPage = lazy(() => import('../pages/quotes/QuotesPage'));
const QuoteDetailPage = lazy(() => import('../pages/quotes/QuoteDetailPage'));
const QuoteFormPage = lazy(() => import('../pages/quotes/QuoteFormPage'));
const ProjectsPage = lazy(() => import('../pages/projects/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('../pages/projects/ProjectDetailPage'));
const PaymentCreatePage = lazy(() => import('../pages/payments/PaymentCreatePage'));
const DocumentViewerPage = lazy(() => import('../pages/documents/DocumentViewerPage'));
const NotFoundPage = lazy(() => import('../pages/not-found/NotFoundPage'));

const PortalLoginPage = lazy(() => import('../pages/portal/PortalLoginPage'));
const PortalDashboardPage = lazy(() => import('../pages/portal/PortalDashboardPage'));
const PortalProfilePage = lazy(() => import('../pages/portal/PortalProfilePage'));
const PortalSettingsPage = lazy(() => import('../pages/portal/PortalSettingsPage'));
const PortalQuotesPage = lazy(() => import('../pages/portal/PortalQuotesPage'));
const PortalQuoteDetailPage = lazy(() => import('../pages/portal/PortalQuoteDetailPage'));
const PortalProjectsPage = lazy(() => import('../pages/portal/PortalProjectsPage'));
const PortalProjectDetailPage = lazy(() => import('../pages/portal/PortalProjectDetailPage'));
const PortalDocumentsPage = lazy(() => import('../pages/portal/PortalDocumentsPage'));

function SuspenseLoader({ children }) {
  return (
    <Suspense fallback={<Loader fullPage size="lg" />}>
      {children}
    </Suspense>
  );
}

const routerBasename =
  (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || undefined;

export default function AppRouter() {
  return (
    <BrowserRouter basename={routerBasename}>
      <SuspenseLoader>
        <Routes>
          {/* Admin auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Admin protected dashboard routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />

              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clients/new" element={<ClientFormPage />} />
              <Route path="/clients/:id" element={<ClientDetailPage />} />
              <Route path="/clients/:id/edit" element={<ClientFormPage />} />

              <Route path="/quotes" element={<QuotesPage />} />
              <Route path="/quotes/new" element={<QuoteFormPage />} />
              <Route path="/quotes/:id" element={<QuoteDetailPage />} />
              <Route path="/quotes/:id/edit" element={<QuoteFormPage />} />

              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/projects/:id/payments" element={<PaymentCreatePage />} />

              <Route path="/documents/:id" element={<DocumentViewerPage />} />
            </Route>
          </Route>

          {/* Portal client login (public) */}
          <Route path="/portal/login" element={<PortalLoginPage />} />

          {/* Portal client protected routes */}
          <Route element={<ProtectedPortalRoute />}>
            <Route element={<PortalLayout />}>
              <Route path="/portal" element={<PortalDashboardPage />} />
              <Route path="/portal/quotes" element={<PortalQuotesPage />} />
              <Route path="/portal/quotes/:id" element={<PortalQuoteDetailPage />} />
              <Route path="/portal/projects" element={<PortalProjectsPage />} />
              <Route path="/portal/projects/:id" element={<PortalProjectDetailPage />} />
              <Route path="/portal/documents" element={<PortalDocumentsPage />} />
              <Route path="/portal/profile" element={<PortalProfilePage />} />
              <Route path="/portal/settings" element={<PortalSettingsPage />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SuspenseLoader>
    </BrowserRouter>
  );
}
