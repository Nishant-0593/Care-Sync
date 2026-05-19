import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LogOut, User, MessageCircle, Heart, Bell, LayoutDashboard, Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const { darkMode, toggleTheme } = useContext(ThemeContext);
    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light mode' : 'Dark mode'}
        >
            <div className="toggle-thumb">
                {darkMode ? <Moon size={12} className="text-white" /> : <Sun size={12} className="text-amber-800" />}
            </div>
        </button>
    );
};

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if current page is any of the dashboards
    const isDashboard = ['/admin', '/teacher', '/parent'].includes(location.pathname);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null; // Don't show navbar if not logged in

    return (
        <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/30 group-hover:rotate-12 transition-transform duration-300">
                                <Heart size={20} fill="currentColor" />
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-br from-primary via-indigo-600 to-violet-700 bg-clip-text text-transparent tracking-tight">CareSync</span>
                        </Link>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-10">
                        <Link 
                            to={user.role === 'admin' ? '/admin' : user.role === 'teacher' ? '/teacher' : '/parent'} 
                            className={`text-sm font-bold transition-colors flex items-center gap-2 ${location.pathname === '/' ? 'text-slate-600' : 'text-primary'}`}
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>
                        <Link to="/chat" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-2">
                            <MessageCircle size={18} />
                            Messages
                        </Link>
                        <a href="http://localhost:5001/notice" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-2">
                            <Bell size={18} />
                            Notices
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <div className="hidden sm:flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-2xl border border-slate-100 group">
                            <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <User size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-900 leading-none mb-1">{user.name}</span>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">{user.role}</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all hover:scale-110 active:scale-95"
                            title="Sign Out"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
