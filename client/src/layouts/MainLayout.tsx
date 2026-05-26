import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, LogOut, Menu, Moon, ShieldCheck, Sun, Users, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Students', to: '/dashboard', icon: Users },
    { label: 'Courses', to: '/courses', icon: GraduationCap },
    { label: 'Reports', to: '/reports', icon: BookOpen },
  ];

  const pageTitle = navItems.find((item) => item.to === location.pathname)?.label || 'Student Dashboard';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-[#07111f] dark:text-white">
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/50 bg-white/88 p-5 shadow-xl backdrop-blur-xl transition lg:translate-x-0 dark:border-white/10 dark:bg-slate-950/88 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-black">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-600 text-white">
              <ShieldCheck className="h-6 w-6" />
            </span>
            StudentFlow
          </Link>
          <button className="rounded-lg p-2 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-10 space-y-2">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Signed in</p>
          <p className="mt-1 truncate text-sm font-bold">{user?.fullName || 'Administrator'}</p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
        </div>
      </aside>

      {sidebarOpen && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/60 bg-white/72 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/72 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <button className="rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-white/10 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Secure workspace</p>
              <h1 className="text-xl font-black sm:text-2xl">{pageTitle === 'Students' ? 'Student Dashboard' : pageTitle}</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={toggleTheme} className="rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-white/10" aria-label="Toggle theme">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button onClick={handleLogout} className="btn-secondary px-3">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
