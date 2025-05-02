// src/App.js

import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// Komponen UI & Layout
import Navbar from "./components/Navbar/Navbar";
import NotFound from "./pages/NotFound";
// import LoadingFallback from "./components/LoadingFallback"; // Hapus impor ini

// Konteks & Tema
import ThemeProvider from "./contexts/ThemeContext"; // 1. Import ThemeProvider dari context Anda
import { AuthProvider } from "./contexts/AuthContext";

// Routing & Guards
import routesConfig from "./routes/routes";
import { PrivateRoute, PublicRoute } from "./routes/RouteGuards";

const pages = import.meta.glob("./pages/**/*.{js,jsx}", { eager: false });

const getLazyComponent = (componentPath) => {
  if (!componentPath) {
    console.error("Component path is missing in route configuration.");
    return () => (
      <div>Error: Komponen tidak terdefinisi dalam konfigurasi rute.</div>
    );
  }

  // Path harus diawali "./pages/" dan pakai extension yang sesuai
  const keyJsx   = `./pages/${componentPath}.jsx`;
  const keyJs    = `./pages/${componentPath}.js`;
  const importer = pages[keyJsx] || pages[keyJs];

  if (!importer) {
    console.warn(`Page not found: ${componentPath}`);
    return () => <NotFound />;
  }

  // importer adalah function returning promise
  const Lazy = lazy(importer);
  return Lazy;
};

const renderRoutes = (routes) => {
  return routes.map((route, index) => {
    const LazyComponent = getLazyComponent(route.component);

    const elementWithGuard =
      route.isPrivate === true ? (
        <PrivateRoute /* requiredRoles={route.requiredRoles} */>
          <LazyComponent />
        </PrivateRoute>
      ) : route.isPrivate === false ? (
        <PublicRoute>
          <LazyComponent />
        </PublicRoute>
      ) : (
        <LazyComponent />
      );

    if (route.index === true) {
      return <Route key={index} index element={elementWithGuard} />;
    } else if (route.children && route.children.length > 0) {
      return (
        <Route key={index} path={route.path} element={elementWithGuard}>
          {renderRoutes(route.children)}
        </Route>
      );
    } else {
      return <Route key={index} path={route.path} element={elementWithGuard} />;
    }
  });
};
// --- Akhir Fungsi Helper Render Rute ---

// 2. Definisikan LoadingFallback di sini lagi (atau pindah ke file komponen jika mau)
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "calc(100vh - 64px)",
      width: "100%",
    }}
  >
    {/* Anda bisa pakai CircularProgress dari MUI di sini */}
    Memuat...
  </div>
);

function App() {
  return (
    // Router tetap membungkus semua
    <Router>
      {/* AuthProvider di dalam Router */}
      <AuthProvider>
        {/* 3. Gunakan ThemeProvider dari context Anda */}
        {/* ThemeProvider ini sudah berisi MuiThemeProvider dan CssBaseline */}
        <ThemeProvider>
          <Navbar /> {/* Navbar di dalam semua provider */}
          <main>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {renderRoutes(routesConfig)}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
