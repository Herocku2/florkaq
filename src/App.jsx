import React, { useEffect, Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { securityCleaner } from "./utils/securityCleaner";

// Lazy load all components to reduce initial bundle size
const Create = lazy(() => import("./screens/Create").then(module => ({ default: module.Create })));
const CreateScreen = lazy(() => import("./screens/CreateScreen").then(module => ({ default: module.CreateScreen })));
const HomeAll = lazy(() => import("./screens/HomeAll").then(module => ({ default: module.HomeAll })));
const HomeDetalletoken = lazy(() => import("./screens/HomeDetalletoken").then(module => ({ default: module.HomeDetalletoken })));
const HomeNew = lazy(() => import("./screens/HomeNew").then(module => ({ default: module.HomeNew })));
const HomeNext = lazy(() => import("./screens/HomeNext").then(module => ({ default: module.HomeNext })));
const News = lazy(() => import("./screens/News").then(module => ({ default: module.News })));
const Publish = lazy(() => import("./screens/Publish").then(module => ({ default: module.Publish })));
const PublishScreen = lazy(() => import("./screens/PublishScreen").then(module => ({ default: module.PublishScreen })));
const SwapScreen = lazy(() => import("./screens/SwapScreen").then(module => ({ default: module.SwapScreen })));
const Vote = lazy(() => import("./screens/Vote").then(module => ({ default: module.Vote })));
const VoteDetalletoken = lazy(() => import("./screens/VoteDetalletoken").then(module => ({ default: module.VoteDetalletoken })));
const Auth = lazy(() => import("./screens/Auth/Auth").then(module => ({ default: module.Auth })));
const ForumSimple = lazy(() => import("./screens/ForumSimple/ForumSimple").then(module => ({ default: module.ForumSimple })));
const TokenDetail = lazy(() => import("./screens/TokenDetail").then(module => ({ default: module.TokenDetail })));

// Loading component for better UX
const LoadingSpinner = () => (
  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000'}}>
    <div style={{color: '#ff01a1', fontSize: '18px', fontFamily: 'Orbitron'}}>Loading...</div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={<LoadingSpinner />}><HomeAll /></Suspense>,
  },
  {
    path: "/next",
    element: <Suspense fallback={<LoadingSpinner />}><HomeNext /></Suspense>,
  },
  {
    path: "/vote",
    element: <Suspense fallback={<LoadingSpinner />}><Vote /></Suspense>,
  },
  {
    path: "/news",
    element: <Suspense fallback={<LoadingSpinner />}><News /></Suspense>,
  },
  {
    path: "/forum",
    element: <Suspense fallback={<LoadingSpinner />}><ForumSimple /></Suspense>,
  },
  {
    path: "/create",
    element: <Suspense fallback={<LoadingSpinner />}><Create /></Suspense>,
  },
  {
    path: "/publish",
    element: <Suspense fallback={<LoadingSpinner />}><Publish /></Suspense>,
  },
  {
    path: "/auth",
    element: <Suspense fallback={<LoadingSpinner />}><Auth /></Suspense>,
  },
  {
    path: "/token/:tokenName",
    element: <Suspense fallback={<LoadingSpinner />}><TokenDetail /></Suspense>,
  },
  {
    path: "/swap",
    element: <Suspense fallback={<LoadingSpinner />}><SwapScreen /></Suspense>,
  },
  // Legacy routes - redirect to main routes for backwards compatibility
  {
    path: "/homeu47all",
    element: <Suspense fallback={<LoadingSpinner />}><HomeAll /></Suspense>,
  },
  {
    path: "/homeu47next",
    element: <Suspense fallback={<LoadingSpinner />}><HomeNext /></Suspense>,
  },
  {
    path: "/homeu47new",
    element: <Suspense fallback={<LoadingSpinner />}><HomeNew /></Suspense>,
  },
  {
    path: "/homeu47detalletokenu47compra",
    element: <Suspense fallback={<LoadingSpinner />}><HomeDetalletoken /></Suspense>,
  },
  {
    path: "/voteu47detalletokenu47vista",
    element: <Suspense fallback={<LoadingSpinner />}><VoteDetalletoken /></Suspense>,
  },
  // Multi-step create/publish routes - using main components with step parameters
  {
    path: "/create/:step",
    element: <Suspense fallback={<LoadingSpinner />}><Create /></Suspense>,
  },
  {
    path: "/publish/:step",
    element: <Suspense fallback={<LoadingSpinner />}><Publish /></Suspense>,
  },
]);

export const App = () => {
  // Inicializar medidas de seguridad al cargar la aplicación
  useEffect(() => {
    securityCleaner.initialize();
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};
