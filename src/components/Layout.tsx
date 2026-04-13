import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Settings, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  LifeBuoy, 
  ChevronRight,
  Menu,
  X,
  LogOut,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const user = accounts[0];

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Product Onboarding", icon: Package, path: "/product-onboarding" },
    { name: "Fulfillment Process", icon: Truck, path: "/fulfillment" },
    { name: "Device Management", icon: Settings, path: "/device-management", active: true },
    { name: "User Management", icon: Users, path: "/user-management" },
    { name: "Reports", icon: BarChart3, path: "/reports" },
    { name: "Administration", icon: ShieldCheck, path: "/admin" },
    { name: "Support", icon: LifeBuoy, path: "/support" },
  ];

  const handleLogout = () => {
    instance.logoutPopup().catch(e => console.error(e));
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#001529] text-white transition-all duration-300 flex flex-col z-50",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo Section */}
        <div className="p-4 flex items-center gap-3 border-b border-white/10 h-16">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shrink-0">
            <span className="text-[#001529] font-bold text-xl">T</span>
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">ThingVerse</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.active && location.pathname.startsWith('/device'));
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors group relative",
                      isActive 
                        ? "bg-[#0089D1] text-white" 
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "group-hover:text-white")} />
                    {isSidebarOpen && (
                      <>
                        <span className="text-sm font-medium flex-1">{item.name}</span>
                        <ChevronRight className={cn("h-4 w-4 opacity-50", isActive ? "opacity-100" : "group-hover:opacity-100")} />
                      </>
                    )}
                    {!isSidebarOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          {isSidebarOpen ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                  <User className="h-4 w-4 text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{user?.name || "Sandeep Trigunayat!"}</p>
                  <p className="text-[10px] text-slate-400 truncate">Multiple Roles</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-md text-slate-600"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h2 className="text-lg font-semibold text-slate-800 hidden md:block">ThingVerse - Device Management Solutions</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-slate-500">Welcome,</p>
              <p className="text-sm font-bold text-slate-900">{user?.name || "Sandeep Trigunayat!"}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
              <span className="text-sm font-bold text-slate-600">ST</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
