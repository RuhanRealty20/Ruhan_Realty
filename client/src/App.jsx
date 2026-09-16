import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { LoadingSkeleton } from './components/ui';
import { usePageTracking } from './hooks/usePageTracking';

const Home = lazy(() => import('./pages/Home'));
const Properties = lazy(() => import('./pages/Properties'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const ConversionPage = lazy(() => import('./pages/ConversionPage'));
const Areas = lazy(() => import('./pages/Areas'));
const AreaDetail = lazy(() => import('./pages/AreaDetail'));
const Market = lazy(() => import('./pages/Market'));
const About = lazy(() => import('./pages/About'));
const Insights = lazy(() => import('./pages/Insights'));
const InsightDetail = lazy(() => import('./pages/InsightDetail'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads'));
const AdminContent = lazy(() => import('./pages/admin/AdminContent'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

function RouteTracker() {
  usePageTracking();
  return null;
}

function ProtectedAdmin({ children }) {
  const location = useLocation();
  const token = sessionStorage.getItem('rr_access_token');
  return token ? children : <Navigate to="/admin/login" replace state={{ from: location }} />;
}

export function App() {
  return (
    <Suspense fallback={<div className="page-loader"><LoadingSkeleton lines={5} /></div>}>
      <RouteTracker />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:slug" element={<PropertyDetail />} />
          {['buy','sell','rent','landlord','invest','relocate','new-construction','contact'].map((path) => <Route key={path} path={path} element={<ConversionPage type={path} />} />)}
          <Route path="ny-nj-to-miami" element={<ConversionPage type="relocate" relocationLanding />} />
          <Route path="areas" element={<Areas />} />
          <Route path="areas/:slug" element={<AreaDetail />} />
          <Route path="market-today" element={<Market />} />
          <Route path="about" element={<About />} />
          <Route path="insights" element={<Insights />} />
          <Route path="insights/:slug" element={<InsightDetail />} />
          <Route path="privacy" element={<Legal type="privacy" />} />
          <Route path="terms" element={<Legal type="terms" />} />
          <Route path="cookies" element={<Legal type="cookies" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin" element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>}>
          <Route index element={<AdminDashboard />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
