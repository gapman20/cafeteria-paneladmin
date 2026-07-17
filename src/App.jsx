import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SiteProvider, useSite } from './context/SiteContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';

// Lazy Loaded Pages
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Services = React.lazy(() => import('./pages/Services'));
const ServiceDetail1 = React.lazy(() => import('./pages/ServiceDetail1'));
const ServiceDetail2 = React.lazy(() => import('./pages/ServiceDetail2'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Admin = React.lazy(() => import('./pages/Admin'));
const CustomPage = React.lazy(() => import('./pages/CustomPage'));
const Login = React.lazy(() => import('./pages/Login'));

const AppContent = () => {
  const { pages, isAuthenticated } = useSite();
  const componentMap = {
    home: <Home />,
    about: <About />,
    services: <Services />,
    portfolio: <Portfolio />,
  };

  return (
    <div className="app-container">
      <ScrollToTop />
      <Navbar />
      <main>
        <React.Suspense fallback={
          <div className="loading-fallback">
            <div className="spinner"></div>
            <span>Cargando...</span>
          </div>
        }>
          <Routes>
            {pages.filter(p => p.active).map(page => (
              <Route 
                key={page.id} 
                path={page.path} 
                element={page.isCustom ? <CustomPage page={page} /> : componentMap[page.id]} 
              />
            ))}
            {/* Static Sub-routes */}
            <Route path="/menu/1" element={<ServiceDetail1 />} />
            <Route path="/menu/2" element={<ServiceDetail2 />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/admin" element={isAuthenticated ? <Admin /> : <Login />} />
          </Routes>
        </React.Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <SiteProvider>
        <AppContent />
      </SiteProvider>
    </ErrorBoundary>
  );
};

export default App;
