import TiposPropiedad from "@/pages/admin/TiposPropiedad";
import Ubicaciones from "@/pages/admin/Ubicaciones";
import Caracteristicas from "@/pages/admin/Caracteristicas";
import AdminHome from "@/pages/admin";
import Dashboard from "@/pages/admin/Dashboard";
import TiposOperacion from "@/pages/admin/TiposOperacion";
import Propiedades from "@/pages/admin/Propiedades";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Nosotros from "./pages/Nosotros";
import NuestrosServicios from "./pages/NuestrosServicios";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/admin/ToastProvider";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import Login from "@/pages/admin/Login";
import PropertyDetail from "./pages/PropertyDetail";
import { useForceRefresh } from "./hooks/useForceRefresh";
import { trackPageView } from "@/utils/metaPixel";
import { captureTrackingAttribution } from "@/utils/trackingAttribution";
import { ensureGoogleAnalytics, trackGaPageView } from "@/utils/googleAnalytics";

const queryClient = new QueryClient();

// Layout para páginas públicas
const PublicLayout = () => {
  // Hook para forzar actualizaciones y evitar caché
  useForceRefresh();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const MetaPixelPageView = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!location.pathname.startsWith("/admin")) {
      captureTrackingAttribution();
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (location.pathname.startsWith("/admin")) return;
    trackPageView();
  }, [location.pathname, location.search]);

  return null;
};

const GoogleAnalyticsPageView = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      ensureGoogleAnalytics();
      return;
    }

    trackGaPageView(`${location.pathname}${location.search}`, document.title);
  }, [location.pathname, location.search]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <MetaPixelPageView />
            <GoogleAnalyticsPageView />
            <Routes>
              {/* Layout público */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/propiedades" element={<Properties />} />
                <Route path="/nuestros-servicios" element={<NuestrosServicios />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/propiedad/:slug" element={<PropertyDetail />} />
              </Route>
              {/* Rutas CMS admin */}
              <Route path="/admin/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminHome />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="propiedades" element={<Propiedades />} />
                  <Route path="tipos" element={<TiposPropiedad />} />
                  <Route path="tipos-operacion" element={<TiposOperacion />} />
                  <Route path="ubicaciones" element={<Ubicaciones />} />
                  <Route path="caracteristicas" element={<Caracteristicas />} />
                  {/* Más rutas hijas aquí */}
                </Route>
              </Route>
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
