import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@src/contexts/AuthContext'
import { TenantProvider } from '@src/contexts/TenantContext'
import { ProtectedRoute } from '@src/components/ProtectedRoute'
import { Login } from '@src/pages/Login'
import { Signup } from '@src/pages/Signup'
import { Dashboard } from '@src/pages/Dashboard'
import { AuthCallback } from '@src/pages/AuthCallback'
import { ResetPassword } from '@src/pages/ResetPassword'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TenantProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </TenantProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
