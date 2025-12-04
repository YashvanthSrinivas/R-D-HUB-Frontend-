import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Researchers from "./pages/Researchers";
import ResearcherDetail from "./pages/ResearcherDetail";
import CreateProfile from "./pages/CreateProfile";
import IEEESearch from "./pages/IEEESearch";
import Collaboration from "./pages/Collaboration";
import Assistant from "./pages/Assistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Redirect component for auth page
const AuthRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (user) {
    return <Navigate to={user.is_researcher ? '/dashboard' : '/ieee-search'} replace />;
  }
  
  return <Auth />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthRedirect />} />
      <Route path="/researchers" element={<Researchers />} />
      <Route path="/researchers/:id" element={<ResearcherDetail />} />
      <Route path="/ieee-search" element={<IEEESearch />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-profile"
        element={
          <ProtectedRoute requireResearcher>
            <CreateProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/collaboration"
        element={
          <ProtectedRoute>
            <Collaboration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assistant"
        element={
          <ProtectedRoute>
            <Assistant />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
