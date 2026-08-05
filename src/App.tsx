import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'

// Import critical components directly (for initial page load)
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'

// Lazy load non-critical components
const HowItWorks = lazy(() => import('./components/HowItWorks'))
const UseCases = lazy(() => import('./components/UseCases'))
const Technology = lazy(() => import('./components/Technology'))
const CTA = lazy(() => import('./components/CTA'))

// Lazy load all page components
const AuthPage = lazy(() => import('./components/auth/AuthPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const GalleryPage = lazy(() => import('./components/gallery/GalleryPage'))
const UploadPage = lazy(() => import('./pages/UploadPage'))
const MyModelsPage = lazy(() => import('./pages/MyModelsPage'))
const ModelDetailPage = lazy(() => import('./pages/ModelDetailPage'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1419]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  )
}

function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<div className="h-96"></div>}>
          <HowItWorks />
          <UseCases />
          <Technology />
          <CTA />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth()
  if (isLoading) return null
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  if (user?.role === 'admin') return <Navigate to="/admin" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth()
  if (isLoading) return null
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/gallery" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <>
      <Toaster position="top-right" />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/auth"      element={<AuthPage />} />
          <Route path="/gallery"   element={<GalleryPage />} />
          <Route path="/model/:shareToken" element={<ModelDetailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password"  element={<ResetPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-models"
          element={
            <ProtectedRoute>
              <MyModelsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
