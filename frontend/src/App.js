// src/App.js

import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import ThemeProvider from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext"; // <-- 1. Import AuthProvider
import routesConfig from "./routes/routes";
import NotFound from "./pages/NotFound";
import { PrivateRoute, PublicRoute } from "./routes/RouteGuards";

const getLazyComponent = (componentPath) => {
  if (!componentPath) {
    console.error("Component path is missing in route configuration.");
    return () => <div>Error: Komponen tidak terdefinisi</div>;
  }
  return lazy(() => import(`./pages/${componentPath}`));
};

// Modifikasi renderRoutes untuk menggunakan Route Guards
const renderRoutes = (routes) => {
  return routes.map((route, index) => {
    const LazyComponent = getLazyComponent(route.component);
    const element = <LazyComponent />; // Komponen yang akan dirender

    // Tentukan elemen pembungkus berdasarkan isPrivate
    let routeElement;
    if (route.isPrivate === true) {
      // Jika private, bungkus dengan PrivateRoute (yang berisi Outlet)
      // PrivateRoute sendiri akan menangani logika redirect jika tidak terotentikasi
      // Komponen asli (LazyComponent) akan dirender melalui Outlet di PrivateRoute
      routeElement = (
        <Route element={<PrivateRoute />}>
          <Route path={route.path} element={element} />
        </Route>
      );
      // Note: Jika route private punya children, logika nesting perlu disesuaikan
      // agar children dirender di dalam Outlet komponen induk (LazyComponent),
      // bukan langsung di bawah PrivateRoute. Ini jadi lebih kompleks.
      // Pendekatan yang lebih umum adalah menerapkan guard *di dalam* App.js atau
      // membungkus <Route> secara kondisional.

      // *** Pendekatan Alternatif (Lebih Sederhana untuk Nested): ***
      // Bungkus elemen komponen dengan guard jika diperlukan
      // routeElement = <Route path={route.path} element={<PrivateRoute><LazyComponent /></PrivateRoute>} />;
      // ^^ Tapi ini kurang ideal karena PrivateRoute harus handle children prop ^^

      // *** Pendekatan yang lebih umum di App.js (Lihat di bawah) ***
    } else if (route.isPrivate === false) {
      // Jika public, bungkus dengan PublicRoute (yang berisi Outlet)
      // PublicRoute akan redirect jika sudah terotentikasi
      routeElement = (
        <Route element={<PublicRoute />}>
          <Route path={route.path} element={element} />
        </Route>
      );
      // routeElement = <Route path={route.path} element={<PublicRoute><LazyComponent /></PublicRoute>} />; // Alternatif kurang ideal
    } else {
      // Jika isPrivate tidak didefinisikan, anggap saja route biasa
      routeElement = <Route path={route.path} element={element} />;
    }

    // --- PENDEKATAN LEBIH BAIK & UMUM UNTUK GUARDS ---
    // Kita akan gunakan pendekatan ini daripada yang di atas
    const guardedElement =
      route.isPrivate === true ? (
        <PrivateRoute>
          <LazyComponent />
        </PrivateRoute> // PrivateRoute membungkus komponen
      ) : route.isPrivate === false ? (
        <PublicRoute>
          <LazyComponent />
        </PublicRoute> // PublicRoute membungkus komponen
      ) : (
        <LazyComponent />
      ); // Tanpa guard

    // Jika route punya anak (nested)
    if (route.children && route.children.length > 0) {
      // Komponen Induk (LazyComponent) HARUS punya <Outlet />
      // Guard diterapkan pada elemen induk ini
      return (
        <Route key={index} path={route.path} element={guardedElement}>
          {renderRoutes(route.children)} {/* Render anak secara rekursif */}
        </Route>
      );
    }

    // Jika tidak punya anak
    return <Route key={index} path={route.path} element={guardedElement} />;
  });
};

const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "calc(100vh - 64px)",
    }}
  >
    Memuat...
  </div>
);

function App() {
  return (
    // 2. Bungkus SEMUA dengan AuthProvider (di luar ThemeProvider atau sebaliknya, urutan tidak terlalu masalah)
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Navbar />
          <main style={{ paddingTop: "64px" }}>
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
        </Router>
      </ThemeProvider>
    </AuthProvider> // <-- Penutup AuthProvider
  );
}

export default App;
