import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { 
  ShieldCheck, 
  Clock, 
  MessageCircle, 
  ClipboardCheck, 
  Camera, 
  Users, 
  ChevronRight,
  Heart,
  Star,
  LogOut,
  LayoutDashboard,
  Sun,
  Moon
} from 'lucide-react';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const getDashboardPath = (role) => {
    switch(role) {
      case 'admin': return '/admin';
      case 'teacher': return '/teacher';
      case 'parent': return '/parent';
      default: return '/';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/30 group-hover:rotate-12 transition-transform duration-300">
                <Heart size={28} fill="currentColor" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-br from-primary via-indigo-600 to-violet-700 bg-clip-text text-transparent tracking-tight">
                CareSync
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-slate-600 hover:text-primary font-semibold transition-colors">Features</a>
              <a href="#about" className="text-slate-600 hover:text-primary font-semibold transition-colors">About Us</a>
              
              {user ? (
                <div className="flex items-center gap-6">
                  <Link to="/chat" className="text-slate-600 hover:text-primary font-semibold transition-colors flex items-center gap-2">
                    <MessageCircle size={18} />
                    Messages
                  </Link>
                  <a href="http://localhost:5001/notice" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-primary font-semibold transition-colors">
                    Notices
                  </a>
                  <Link to={getDashboardPath(user.role)} className="btn-secondary flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2">
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                  <button onClick={logout} className="text-slate-600 hover:text-rose-500 font-bold transition-colors flex items-center gap-1">
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <a href="http://localhost:5001/notice" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-primary font-semibold transition-colors mr-4">
                    Official Notices
                  </a>
                  <Link to="/login" className="text-slate-900 font-bold hover:text-primary transition-colors">Log In</Link>
                  <Link to="/signup" className="btn px-8 py-3 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">Get Started</Link>
                </div>
              )}
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
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-in-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white shadow-lg shadow-slate-200/50 border border-slate-100 text-primary text-xs font-bold uppercase tracking-wider">
                <span>Next-Gen Childcare Management</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[1.2] tracking-tight">
                Modernizing <span className="text-primary italic">Care</span> for a New Era.
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-lg font-medium">
                The all-in-one platform connecting parents and educators to provide the best start for every child.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="btn px-8 py-4 text-lg rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group">
                  Get Started
                  <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="relative lg:ml-4 animate-slide-in-right">
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />
              <div className="card p-2 relative overflow-hidden rounded-[2rem] shadow-2xl">
                <img 
                  src="/caresync_hero_image_1777615920372.png" 
                  alt="CareSync App Preview" 
                  className="rounded-[1.5rem] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-sm font-black text-primary tracking-[0.2em] uppercase">Core Capabilities</h2>
            <h3 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">Everything you need, in one place.</h3>
            <p className="text-lg text-slate-500 font-medium">
              Enterprise-grade tools simplified for the best childcare experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: <Clock className="text-blue-500" />,
                title: 'Live Attendance',
                desc: 'Intelligent check-in system with real-time sync across all devices and parent notifications.',
                bg: 'bg-blue-50'
              },
              {
                icon: <MessageCircle className="text-emerald-500" />,
                title: 'Instant Messaging',
                desc: 'End-to-end encrypted chat between parents and educators. Share updates and photos securely.',
                link: '/chat',
                bg: 'bg-emerald-50'
              },
              {
                icon: <ClipboardCheck className="text-orange-500" />,
                title: 'Nutrition Tracking',
                desc: 'Digital meal logs and allergy alerts ensuring every child receives the right care at the right time.',
                bg: 'bg-orange-50'
              },
              {
                icon: <Camera className="text-pink-500" />,
                title: 'Activity Timeline',
                desc: 'A beautiful visual diary of a childs day, capturing milestones and precious moments.',
                bg: 'bg-pink-50'
              },
              {
                icon: <ShieldCheck className="text-indigo-500" />,
                title: 'Smart Reporting',
                desc: 'Automated progress reports and development tracking powered by comprehensive data insights.',
                bg: 'bg-indigo-50'
              },
              {
                icon: <Users className="text-purple-500" />,
                title: 'Role-Based Access',
                desc: 'Granular permissions and specialized dashboards for admins, teachers, and parents.',
                bg: 'bg-purple-50'
              }
            ].map((feature, i) => {
              const content = (
                <>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-[5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className={`w-20 h-20 rounded-3xl ${feature.bg} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    {React.cloneElement(feature.icon, { size: 36 })}
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-4">{feature.title}</h4>
                  <p className="text-lg text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                  
                  {feature.link && (
                    <div className="mt-8 inline-flex items-center text-primary font-bold hover:gap-2 transition-all">
                      Learn more <ChevronRight size={20} />
                    </div>
                  )}
                </>
              );

              const cardClasses = "group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden text-left";

              return feature.link ? (
                <Link 
                  key={i} 
                  to={user ? feature.link : '/login'} 
                  className={cardClasses}
                >
                  {content}
                </Link>
              ) : (
                <div key={i} className={cardClasses}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-[3rem] p-10 lg:p-20 relative overflow-hidden text-center lg:text-left">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-4xl lg:text-6xl font-black text-white leading-tight">
                  Ready to transform your <span className="text-primary italic">childcare?</span>
                </h3>
                <p className="text-lg text-slate-400 font-medium max-w-md">
                  Join 12,000+ educators making a difference with CareSync.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/signup" className="btn px-8 py-4 text-lg rounded-2xl shadow-xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all">
                    Get Started Free
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <div className="bg-gradient-to-br from-primary to-indigo-600 w-full aspect-square rounded-[3rem] shadow-2xl rotate-3 flex items-center justify-center p-8 overflow-hidden group">
                  <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 flex flex-col gap-4 group-hover:scale-105 transition-transform duration-700">
                    <div className="w-2/3 h-8 bg-white/20 rounded-lg animate-pulse" />
                    <div className="w-full h-32 bg-white/20 rounded-xl animate-pulse" />
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="w-1/2 h-4 bg-white/20 rounded-md animate-pulse" />
                        <div className="w-3/4 h-4 bg-white/20 rounded-md animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <Heart size={20} fill="currentColor" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight">CareSync</span>
              </div>
              <p className="max-w-md text-base text-slate-500 font-medium leading-relaxed">
                Empowering the next generation through seamless connection and intelligent childcare management.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'Instagram', 'LinkedIn'].map(social => (
                  <a key={social} href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
                    <span className="sr-only">{social}</span>
                    <Star size={16} />
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h5 className="text-xs font-black text-slate-900 uppercase tracking-widest">Product</h5>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-500 font-bold hover:text-primary transition-colors">Platform Features</a></li>
                <li><a href="#" className="text-sm text-slate-500 font-bold hover:text-primary transition-colors">Pricing Plans</a></li>
                <li><a href="#" className="text-sm text-slate-500 font-bold hover:text-primary transition-colors">Security First</a></li>
                <li><a href="#" className="text-sm text-slate-500 font-bold hover:text-primary transition-colors">Mobile App</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="text-xs font-black text-slate-900 uppercase tracking-widest">Resources</h5>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-500 font-bold hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="text-sm text-slate-500 font-bold hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm text-slate-500 font-bold hover:text-primary transition-colors">Community</a></li>
                <li><a href="#" className="text-sm text-slate-500 font-bold hover:text-primary transition-colors">API Status</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-slate-400 font-bold">© 2026 CareSync Inc. Built with love for future leaders.</p>
            <div className="flex gap-8">
              <a href="#" className="text-[10px] text-slate-400 hover:text-slate-900 font-bold transition-colors">Privacy Policy</a>
              <a href="#" className="text-[10px] text-slate-400 hover:text-slate-900 font-bold transition-colors">Terms of Service</a>
              <a href="#" className="text-[10px] text-slate-400 hover:text-slate-900 font-bold transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

