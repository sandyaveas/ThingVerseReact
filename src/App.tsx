import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { PublicClientApplication, InteractionStatus } from "@azure/msal-browser";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { msalConfig, loginRequest } from "./authConfig";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import DeviceDetail from "./pages/DeviceDetail";
import PlaceholderPage from "./pages/PlaceholderPage";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const msalInstance = new PublicClientApplication(msalConfig);

function LoginPage() {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    if (accounts.length > 0) {
      navigate("/");
    }
  }, [accounts, navigate]);

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(e => {
      console.error("Login Error:", e);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001529] p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl text-center">
        <div className="space-y-2">
          <div className="mx-auto h-16 w-16 bg-[#0089D1] rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">ThingVerse</h2>
          <p className="text-slate-500">Device Management Solutions</p>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Please sign in with your Azure AD account to access the dashboard.
          </p>
          <Button 
            onClick={handleLogin}
            className="w-full bg-[#0089D1] hover:bg-[#0077B5] text-white py-6 text-lg font-semibold rounded-lg transition-all transform hover:scale-[1.02]"
          >
            Sign in with Microsoft
          </Button>
          
          <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-200 text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Azure Configuration Tip:</p>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Ensure the following URL is added as a <strong>Single-page application</strong> Redirect URI in your Azure Portal:
            </p>
            <code className="block mt-1 p-1 bg-slate-100 rounded text-[10px] text-blue-600 break-all">
              {window.location.origin}
            </code>
          </div>
        </div>
        
        <div className="pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            &copy; 2026 ThingVerse. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        console.log("Initializing MSAL with origin:", window.location.origin);
        await msalInstance.initialize();
        await msalInstance.handleRedirectPromise();
        setIsInitialized(true);
      } catch (err) {
        console.error("MSAL Initialization Error:", err);
        setIsInitialized(true);
      }
    };
    
    initializeMsal();
  }, []);

  // Render the app immediately, MSAL will initialize in the background
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <AppContent />
      </Router>
    </MsalProvider>
  );
}

function AppContent() {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PlaceholderPage title="Dashboard" description="Thingverse Dashboard for all products." />} />
        <Route path="/device-management" element={<Dashboard />} />
        <Route path="/device/:mac" element={<DeviceDetail />} />
        
        {/* Placeholder Routes */}
        <Route path="/product-onboarding" element={<PlaceholderPage title="Product Onboarding" description="Manage the onboarding process for new products and hardware versions." />} />
        <Route path="/fulfillment" element={<PlaceholderPage title="Fulfillment Process" description="Track and manage the fulfillment lifecycle of devices and orders." />} />
        <Route path="/user-management" element={<PlaceholderPage title="User Management" description="Administer user accounts, roles, and permissions across the platform." />} />
        <Route path="/reports" element={<PlaceholderPage title="Reports" description="Generate and view detailed analytics and operational reports." />} />
        <Route path="/admin" element={<PlaceholderPage title="Administration" description="Configure system-wide settings and security policies." />} />
        <Route path="/support" element={<PlaceholderPage title="Support" description="Access help resources and manage support tickets." />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
