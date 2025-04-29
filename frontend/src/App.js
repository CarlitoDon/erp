// src/App.js

import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet, // Pastikan Outlet diimport jika digunakan di Private/PublicRoute
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import ThemeProvider from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import routesConfig from "./routes/routes";
import NotFound from "./pages/NotFound";
import { PrivateRoute, PublicRoute } from "./routes/RouteGuards";

const getLazyComponent = (componentPath) => {
  if (!componentPath) {
    console.error("Component path is missing in route configuration.");
    return () => <div>Error: Komponen tidak terdefinisi</div>;
  }

  // Anda bisa menyederhanakan penanganan error lazy load sedikit
  return lazy(() =>
    import(`./pages/${componentPath}`).catch((error) => {
      console.error(`Gagal load komponen: ${componentPath}`, error);
      // Return komponen yang valid dengan export default
      return { default: () => <NotFound /> };
    })
  );
};

// --- Perbaikan Fungsi renderRoutes ---
const renderRoutes = (routes) => {
  return routes.map((route, index) => {
    // 1. Dapatkan komponen lazy
    const LazyComponent = getLazyComponent(route.component);

    // 2. Tentukan elemen yang sudah diguard (jika perlu) *SEBELUM* digunakan
    const guardedElement =
      route.isPrivate === true ? (
        <PrivateRoute> {/* Pastikan PrivateRoute merender children atau <Outlet/> */}
          <LazyComponent />
        </PrivateRoute>
      ) : route.isPrivate === false ? (
        <PublicRoute> {/* Pastikan PublicRoute merender children atau <Outlet/> */}
          <LazyComponent />
        </PublicRoute>
      ) : (
        <LazyComponent /> // Tanpa guard
      );

    // 3. Hapus blok 'let routeElement;' yang lama

    // 4. Bangun elemen Route berdasarkan tipe rute (index, nested, atau biasa)
    if (route.index === true) {
      // Rute Indeks: Gunakan prop 'index'
      return <Route key={index} index element={guardedElement} />;
    } else if (route.children && route.children.length > 0) {
      // Rute Nested Parent: Gunakan 'path' dan render children secara rekursif
      // Komponen Induk (LazyComponent) di dalam guardedElement HARUS punya <Outlet />
      return (
        <Route key={index} path={route.path} element={guardedElement}>
          {renderRoutes(route.children)}
        </Route>
      );
    } else {
      // Rute Biasa: Gunakan 'path'
      return <Route key={index} path={route.path} element={guardedElement} />;
    }
  });
};
// --- Akhir Perbaikan ---


const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "calc(100vh - 64px)", // Sesuaikan jika tinggi Navbar berbeda
      width: '100%' // Pastikan fallback mengisi lebar
    }}
  >
    {/* Anda bisa menggunakan CircularProgress MUI di sini */}
    Memuat...
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Navbar />
          <main>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {renderRoutes(routesConfig)}
                {/* Redirect default dari root */}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />} // Atau ke /login jika belum auth?
                />
                {/* Rute fallback 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;