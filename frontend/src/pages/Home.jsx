import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import API_URL from '../config';

const BACKEND_URL = API_URL.replace('/api', '');
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
  Moon,
  Send,
  Sparkles,
  ChevronLeft,
  CheckCircle,
  HelpCircle,
  Plus,
  Minus,
  TrendingUp,
  Smile,
  ArrowRight,
  Award,
  ChevronUp
} from 'lucide-react';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  // --- Dynamic Widget States ---
  const [activePreviewTab, setActivePreviewTab] = useState('parent'); // 'parent' | 'teacher'
  
  // Parent App Mock State
  const [childCheckedIn, setChildCheckedIn] = useState(true);
  const [parentLikedMilestones, setParentLikedMilestones] = useState({});
  const [chatMessageInput, setChatMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'teacher', text: "Good morning Sarah! Leo settled in great today. ☀️", time: "8:30 AM" },
    { id: 2, sender: 'parent', text: "Wonderful! Did he finish his morning snack?", time: "8:32 AM" },
    { id: 3, sender: 'teacher', text: "Yes! He ate all of his apple slices and oatmeal. 🍎", time: "8:35 AM" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // Teacher App Mock State
  const [teacherChildren, setTeacherChildren] = useState([
    { id: 1, name: 'Leo Carter', status: 'Present', avatar: '🦁', time: '8:15 AM' },
    { id: 2, name: 'Emma Wilson', status: 'Present', avatar: '🐱', time: '8:22 AM' },
    { id: 3, name: 'Noah Davis', status: 'Absent', avatar: '🦊', time: '-' }
  ]);
  const [teacherToast, setTeacherToast] = useState('');

  // Timeline Milestones
  const [milestones, setMilestones] = useState([
    { id: 1, type: 'checkin', text: 'Checked in safely by Sarah Carter.', time: '8:15 AM', hearts: 2 },
    { id: 2, type: 'activity', text: 'Completed finger painting art project: "A Bright Summer Sun". 🎨', time: '10:15 AM', hearts: 5 },
    { id: 3, type: 'food', text: 'Eats Lunch: 100% finished organic chicken, rice & broccoli. 🥦', time: '12:30 PM', hearts: 3 },
    { id: 4, type: 'sleep', text: 'Nap Time: Fell asleep quickly. Slept soundly for 1.5 hours. 💤', time: '2:15 PM', hearts: 4 }
  ]);

  // --- Calculator States ---
  const [calcChildren, setCalcChildren] = useState(30);
  const [calcAdminHours, setCalcAdminHours] = useState(15);

  // --- Testimonials States ---
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonials = [
    {
      text: "CareSync gives me total peace of mind. Getting live check-ins and beautiful photo updates of Leo's day makes me feel like I'm right there with him. I can't imagine our childcare without it!",
      author: "Sarah Jenkins",
      role: "Parent of a 3-year-old",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
    },
    {
      text: "Our admin workload has dropped dramatically. We went from chaotic paper sheets and manual text messages to a single, elegant ecosystem. The parents are happier, and teachers have so much more time to teach!",
      author: "Marcus Vance",
      role: "Director of Little Sprouts Academy",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120"
    },
    {
      text: "No more tracking down parents or filling out daily paper logs at the end of the day. CareSync is super simple to use on my tablet. Adding meals, naps, and messages takes seconds.",
      author: "Elena Rostova",
      role: "Lead Preschool Educator",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120"
    }
  ];

  // --- FAQ States ---
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    {
      q: "Is my child's data safe and private?",
      a: "Absolutely. CareSync uses modern enterprise-grade end-to-end encryption. All media, personal details, and messaging are securely protected. Only verified staff and authorized family members can access child data."
    },
    {
      q: "How do parents and teachers connect?",
      a: "Center administrators can generate secure, unique invite codes for both teachers and parents. Once a parent creates an account with their invite code, they are instantly linked to their child's daily feed and educators."
    },
    {
      q: "Can the system run on tablets and smartphones?",
      a: "Yes! CareSync is carefully designed to be fully responsive. It runs beautifully on iPad/Android tablets in the classroom, smartphones in the hands of parents, and desktop computers in administration offices."
    },
    {
      q: "Do you offer customer support and training?",
      a: "Yes, we provide 24/7 dedicated email and chat support. Plus, when a school signs up, they get access to easy step-by-step video training for all educators and administrators to get up to speed within hours."
    }
  ];

  // --- Newsletter State ---
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Auto-scroll chat mock to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  // Rotate testimonials automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessageInput.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'parent',
      text: chatMessageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatMessageInput('');
    setIsTyping(true);

    // Simulate Teacher automated response after 1.5 seconds
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Aw, you are so welcome! He just finished storytime and is currently playing with blocks. 🧸",
        "Absolutely, we will let you know how his afternoon nap goes!",
        "Yes, we'll make sure to get some pictures of his painting to share later today!"
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'teacher',
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  const toggleMilestoneHeart = (id) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        const liked = !parentLikedMilestones[id];
        setParentLikedMilestones(prevLiked => ({ ...prevLiked, [id]: liked }));
        return { ...m, hearts: liked ? m.hearts + 1 : m.hearts - 1 };
      }
      return m;
    }));
  };

  const toggleTeacherStatus = (id) => {
    setTeacherChildren(prev => prev.map(child => {
      if (child.id === id) {
        const newStatus = child.status === 'Present' ? 'Absent' : 'Present';
        const newTime = newStatus === 'Present' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
        return { ...child, status: newStatus, time: newTime };
      }
      return child;
    }));
  };

  const handleSendDailyReport = () => {
    setTeacherToast("Daily reports successfully compiled and sent to all parents! 🚀");
    setTimeout(() => setTeacherToast(''), 4000);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSubscribed(false), 5000);
  };

  const getDashboardPath = (role) => {
    switch(role) {
      case 'admin': return '/admin';
      case 'teacher': return '/teacher';
      case 'parent': return '/parent';
      default: return '/';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500 overflow-x-hidden selection:bg-primary/30">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 dark:bg-violet-600/10 rounded-full blur-3xl -z-20 pointer-events-none animate-pulse-slow" />
      <div className="absolute top-[800px] left-1/4 w-[400px] h-[400px] bg-secondary/5 dark:bg-rose-600/5 rounded-full blur-3xl -z-20 pointer-events-none animate-pulse-slow" />

      {/* ============ NAVIGATION ============ */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-11 h-11 bg-gradient-to-br from-primary to-indigo-600 dark:from-violet-500 dark:to-fuchsia-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 dark:shadow-violet-900/30 group-hover:rotate-12 transition-all duration-300">
                <Heart size={24} fill="currentColor" className="animate-pulse" />
              </div>
              <span className="text-2xl font-black font-display bg-gradient-to-br from-primary via-indigo-600 to-violet-700 dark:from-violet-400 dark:via-fuchsia-500 dark:to-pink-500 bg-clip-text text-transparent tracking-tight">
                CareSync
              </span>
            </div>

            {/* Menu Items */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-violet-400 font-semibold transition-colors duration-200">Features</a>
              <a href="#calculator" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-violet-400 font-semibold transition-colors duration-200">Impact</a>
              <a href="#testimonials" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-violet-400 font-semibold transition-colors duration-200">Reviews</a>
              
              {user ? (
                <div className="flex items-center gap-5 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <Link to="/chat" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-violet-400 font-semibold transition-colors flex items-center gap-2">
                    <MessageCircle size={18} />
                    Messages
                  </Link>
                  <a href={`${BACKEND_URL}/notice`} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-violet-400 font-semibold transition-colors">
                    Notices
                  </a>
                  <Link to={getDashboardPath(user.role)} className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-primary hover:scale-[1.03] transition-all duration-300 text-sm">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <button onClick={logout} className="text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 font-bold transition-colors text-sm flex items-center gap-1.5">
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-5 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <a href={`${BACKEND_URL}/notice`} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-violet-400 font-semibold transition-colors text-sm mr-2">
                    Notices
                  </a>
                  <Link to="/login" className="text-slate-900 dark:text-slate-200 font-bold hover:text-primary dark:hover:text-violet-400 transition-colors text-sm">Log In</Link>
                  <Link to="/signup" className="px-6 py-3 rounded-2xl font-bold bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/25 hover:scale-[1.03] active:scale-98 transition-all duration-300 text-sm">
                    Get Started
                  </Link>
                </div>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="theme-toggle ml-2"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={darkMode ? 'Light mode' : 'Dark mode'}
              >
                <div className="toggle-thumb">
                  {darkMode ? <Moon size={12} className="text-white" /> : <Sun size={12} className="text-amber-800" />}
                </div>
              </button>
            </div>

            {/* Mobile Menu Icon / Theme Toggle */}
            <div className="flex md:hidden items-center gap-4">
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <div className="toggle-thumb">
                  {darkMode ? <Moon size={12} className="text-white" /> : <Sun size={12} className="text-amber-800" />}
                </div>
              </button>
              {user ? (
                <Link to={getDashboardPath(user.role)} className="p-2.5 bg-primary rounded-xl text-white">
                  <LayoutDashboard size={18} />
                </Link>
              ) : (
                <Link to="/login" className="px-4 py-2 bg-primary rounded-xl text-white font-bold text-xs">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-5 space-y-8 animate-slide-in-left text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 dark:bg-violet-500/10 text-primary dark:text-violet-400 text-xs font-black uppercase tracking-wider">
                <Sparkles size={14} className="animate-spin" />
                <span>Next-Gen Childcare Management ⚡</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold font-display text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                Modernizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600 dark:from-violet-400 dark:to-fuchsia-500 italic">Care</span> <br />
                for a New Era.
              </h1>
              
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium max-w-lg mx-auto lg:mx-0">
                The beautifully integrated hub linking parents and passionate educators together to guarantee the most inspiring growth for every child.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/signup" className="px-8 py-4.5 text-lg font-bold bg-primary hover:bg-primary/95 text-white rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.03] active:scale-97 transition-all duration-300 flex items-center justify-center gap-2 group">
                  Start Free Account
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="px-8 py-4.5 text-lg font-bold border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 rounded-2xl hover:scale-[1.03] active:scale-97 transition-all duration-300 flex items-center justify-center">
                  Explore Features
                </a>
              </div>

              {/* Sub-badges */}
              <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-6 text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" />
                  <span className="text-sm font-bold">14-Day Free Trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" />
                  <span className="text-sm font-bold">No Credit Card Needed</span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE MOCK PREVIEW WIDGET */}
            <div className="lg:col-span-7 relative animate-slide-in-right">
              {/* Decorative Glow */}
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/20 dark:bg-violet-600/20 rounded-full blur-3xl -z-10 animate-float" />
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-secondary/15 dark:bg-rose-600/15 rounded-full blur-3xl -z-10 animate-float-delayed" />
              
              {/* Product Hub Wrapper */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-[2.5rem] shadow-2xl p-4 sm:p-6 overflow-hidden max-w-2xl mx-auto backdrop-blur-md">
                
                {/* Hub Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/60 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Live Interactive Demo</span>
                  </div>
                  
                  {/* Tabs Controller */}
                  <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl w-full sm:w-auto">
                    <button
                      onClick={() => setActivePreviewTab('parent')}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                        activePreviewTab === 'parent' 
                          ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Users size={12} />
                      Parent App
                    </button>
                    <button
                      onClick={() => setActivePreviewTab('teacher')}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                        activePreviewTab === 'teacher' 
                          ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Award size={12} />
                      Teacher Portal
                    </button>
                  </div>
                </div>

                {/* ============ TAB: PARENT VIEW ============ */}
                {activePreviewTab === 'parent' && (
                  <div className="grid md:grid-cols-12 gap-5 transition-all duration-500">
                    
                    {/* Left: Device Mockup (Home Timeline & Checkin) */}
                    <div className="md:col-span-7 bg-slate-50 dark:bg-slate-950 p-4 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/40 relative">
                      
                      {/* Custom Screen Top */}
                      <div className="flex justify-between items-center pb-3 border-b border-slate-200/60 dark:border-slate-800/60 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🦁</span>
                          <div>
                            <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">Leo Carter</h4>
                            <p className="text-[10px] text-slate-400 font-semibold">Age: 3 years</p>
                          </div>
                        </div>

                        {/* Interactive Check-In Pill */}
                        <button 
                          onClick={() => setChildCheckedIn(!childCheckedIn)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                            childCheckedIn 
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60' 
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border border-transparent'
                          }`}
                        >
                          {childCheckedIn ? '✓ Present' : 'Absent'}
                        </button>
                      </div>

                      {/* Scrollable Milestones Timeline */}
                      <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                        {milestones.map((item) => (
                          <div key={item.id} className="relative pl-6 pb-2 border-l border-slate-200 dark:border-slate-800 last:border-none last:pb-0">
                            
                            {/* Dot Icon */}
                            <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                              item.type === 'checkin' ? 'bg-emerald-500' :
                              item.type === 'activity' ? 'bg-blue-500' :
                              item.type === 'food' ? 'bg-orange-500' : 'bg-violet-500'
                            }`}>
                              <span className="text-[8px] font-bold">
                                {item.type === 'checkin' ? '✓' : item.type === 'activity' ? '🎨' : item.type === 'food' ? '🥗' : '💤'}
                              </span>
                            </div>

                            {/* Text content */}
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block">{item.time}</span>
                                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{item.text}</p>
                              </div>
                              
                              {/* Interactive Hearts Counter */}
                              <button 
                                onClick={() => toggleMilestoneHeart(item.id)}
                                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold transition-all border ${
                                  parentLikedMilestones[item.id] 
                                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 text-rose-500' 
                                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:text-rose-400'
                                }`}
                              >
                                <Heart size={10} fill={parentLikedMilestones[item.id] ? "currentColor" : "none"} />
                                {item.hearts}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Real-time Message Sim */}
                    <div className="md:col-span-5 flex flex-col justify-between bg-slate-50 dark:bg-slate-950 p-4 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/40">
                      
                      {/* Contact Info */}
                      <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200/60 dark:border-slate-800/60 mb-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-600">
                          Ms.E
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Elena Rostova</h5>
                          <span className="text-[9px] text-emerald-500 font-bold block">Online</span>
                        </div>
                      </div>

                      {/* Chat Bubbles */}
                      <div className="space-y-2 flex-1 max-h-[140px] overflow-y-auto pr-1 mb-3 text-[11px]">
                        {chatMessages.map((msg) => (
                          <div 
                            key={msg.id} 
                            className={`flex flex-col max-w-[85%] ${msg.sender === 'parent' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                          >
                            <div className={`p-2.5 rounded-2xl leading-relaxed ${
                              msg.sender === 'parent' 
                                ? 'bg-primary text-white rounded-tr-none' 
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-800/60'
                            }`}>
                              {msg.text}
                            </div>
                            <span className="text-[8px] text-slate-400 mt-1 font-semibold">{msg.time}</span>
                          </div>
                        ))}

                        {/* Typing Animation */}
                        {isTyping && (
                          <div className="mr-auto items-start max-w-[85%]">
                            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800/60 flex gap-1">
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                          </div>
                        )}
                        <div ref={chatBottomRef} />
                      </div>

                      {/* Messaging Form */}
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                          type="text"
                          value={chatMessageInput}
                          onChange={(e) => setChatMessageInput(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-slate-900 dark:text-white"
                        />
                        <button type="submit" className="p-2 bg-primary hover:bg-indigo-600 text-white rounded-xl transition-all">
                          <Send size={12} />
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* ============ TAB: TEACHER VIEW ============ */}
                {activePreviewTab === 'teacher' && (
                  <div className="space-y-4 transition-all duration-500">
                    
                    {/* Upper Quick Stats bar */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl text-center border border-slate-100 dark:border-slate-850">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Present Today</span>
                        <span className="text-xl font-black text-slate-850 dark:text-slate-100 leading-tight">
                          {teacherChildren.filter(c => c.status === 'Present').length} / {teacherChildren.length}
                        </span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl text-center border border-slate-100 dark:border-slate-850">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Naps Logged</span>
                        <span className="text-xl font-black text-slate-850 dark:text-slate-100 leading-tight">1</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl text-center border border-slate-100 dark:border-slate-850">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Meal Reports</span>
                        <span className="text-xl font-black text-slate-850 dark:text-slate-100 leading-tight">3 / 3</span>
                      </div>
                    </div>

                    {/* Children List Grid */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/40">
                      <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3">Classroom Checklist</h4>
                      
                      <div className="space-y-2">
                        {teacherChildren.map((child) => (
                          <div 
                            key={child.id}
                            className="flex justify-between items-center p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850 hover:border-slate-200 dark:hover:border-slate-800 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{child.avatar}</span>
                              <div>
                                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">{child.name}</h5>
                                <span className="text-[9px] text-slate-450 dark:text-slate-500">Checkin: {child.time}</span>
                              </div>
                            </div>

                            {/* Status toggler */}
                            <button
                              onClick={() => toggleTeacherStatus(child.id)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                child.status === 'Present' 
                                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40' 
                                  : 'bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40'
                              }`}
                            >
                              {child.status}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Compile Button */}
                    <div className="flex justify-end pt-2 gap-3 items-center">
                      {teacherToast && (
                        <div className="text-xs text-indigo-600 dark:text-violet-400 font-bold animate-zoom-in">
                          {teacherToast}
                        </div>
                      )}
                      
                      <button
                        onClick={handleSendDailyReport}
                        className="px-5 py-2.5 bg-primary hover:bg-indigo-650 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 flex items-center gap-1.5 active:scale-95"
                      >
                        <ClipboardCheck size={14} />
                        Publish Daily Reports
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============ STATS SECTION ============ */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200/50 dark:border-slate-800/40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1">
              <span className="text-3xl lg:text-4xl font-extrabold font-display bg-gradient-to-r from-primary to-indigo-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">15k+</span>
              <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Children Connected</p>
            </div>
            
            <div className="space-y-1">
              <span className="text-3xl lg:text-4xl font-extrabold font-display bg-gradient-to-r from-primary to-indigo-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">99.8%</span>
              <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Parent Satisfaction</p>
            </div>

            <div className="space-y-1">
              <span className="text-3xl lg:text-4xl font-extrabold font-display bg-gradient-to-r from-primary to-indigo-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">4.9/5</span>
              <div className="flex items-center justify-center gap-0.5 text-amber-500">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
              </div>
              <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">App Rating</p>
            </div>

            <div className="space-y-1">
              <span className="text-3xl lg:text-4xl font-extrabold font-display bg-gradient-to-r from-primary to-indigo-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">70%+</span>
              <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Admin Hours Saved</p>
            </div>

          </div>
        </div>
      </section>

      {/* ============ CORE FEATURES SECTION ============ */}
      <section id="features" className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="inline-block px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-violet-950/30 text-primary dark:text-violet-400 text-xs font-black uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="text-3xl lg:text-[2.75rem] font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
              Everything you need, in one place.
            </h2>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium">
              Enterprise-grade tools simplified into a beautiful interface built to empower parents and educators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="text-blue-500 dark:text-blue-400" />,
                title: 'Live Attendance',
                desc: 'Smart digital check-in interface that instantly updates teacher rosters, monitors room ratios, and updates parent apps.',
                bg: 'bg-blue-50 dark:bg-blue-950/20'
              },
              {
                icon: <MessageCircle className="text-emerald-500 dark:text-emerald-400" />,
                title: 'Instant Messaging',
                desc: 'Secure, real-time messaging between families and educators. Share quick inquiries, daily plans, and notes easily.',
                link: '/chat',
                bg: 'bg-emerald-50 dark:bg-emerald-950/20'
              },
              {
                icon: <ClipboardCheck className="text-orange-500 dark:text-orange-400" />,
                title: 'Nutrition Tracking',
                desc: 'Digital daily menus, allergy warnings, and real-time logging of snacks and lunch completions for children.',
                bg: 'bg-orange-50 dark:bg-orange-950/20'
              },
              {
                icon: <Camera className="text-pink-500 dark:text-pink-400" />,
                title: 'Activity Timelines',
                desc: 'Capture milestones and joyful moments in beautiful photo and text timelines delivered instantly to parents.',
                bg: 'bg-pink-50 dark:bg-pink-950/20'
              },
              {
                icon: <ShieldCheck className="text-indigo-500 dark:text-indigo-400" />,
                title: 'Smart Analytics & Reporting',
                desc: 'Track early-learning development patterns and download automated, compliance-ready records easily.',
                bg: 'bg-indigo-50 dark:bg-indigo-950/20'
              },
              {
                icon: <Users className="text-purple-500 dark:text-purple-400" />,
                title: 'Role-Based Access',
                desc: 'Highly customized workspaces ensuring administrators, teachers, and parents have tailored features.',
                bg: 'bg-purple-50 dark:bg-purple-950/20'
              }
            ].map((feature, i) => {
              const content = (
                <div className="relative z-10 flex flex-col h-full">
                  {/* Floating abstract graphic */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-[4rem] group-hover:scale-110 transition-transform duration-500 -z-10" />

                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {React.cloneElement(feature.icon, { size: 24 })}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-violet-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium flex-grow">
                    {feature.desc}
                  </p>
                  
                  {feature.link && (
                    <div className="mt-6 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary dark:text-violet-400 group-hover:translate-x-1.5 transition-transform duration-300">
                      <span>Launch Chat</span>
                      <ArrowRight size={12} />
                    </div>
                  )}
                </div>
              );

              const cardClasses = "group relative bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/60 hover:border-primary/20 dark:hover:border-violet-500/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden";

              return feature.link ? (
                <Link key={i} to={user ? feature.link : '/login'} className={cardClasses}>
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

      {/* ============ DYNAMIC EFFICIENCY CALCULATOR ============ */}
      <section id="calculator" className="py-24 lg:py-32 bg-white dark:bg-slate-900 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Info details */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-block px-3 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-widest">
                Impact Calculator
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold font-display text-slate-900 dark:text-white leading-tight">
                Calculate your <br />
                CareSync Efficiency
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Traditional paperwork, attendance sheets, and fragmented chat systems cost childcare centers dozens of hours weekly. See how much time you save.
              </p>
              
              <div className="space-y-4 pt-2">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-orange-500 shrink-0">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Eliminate double data entry</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Write once. Instant broadcast to compliance dashboards and parent app timelines.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-violet-950/20 flex items-center justify-center text-primary shrink-0">
                    <Smile size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Delight 100% of parents</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Immediate transparency and beautiful timelines drastically increase retention and enrollment scores.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: The Interactive Calculator widget */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 p-6 sm:p-10 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/40 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-[5rem] -z-10" />

              <div className="space-y-8">
                {/* Control 1: Children count */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">How many children in your center?</label>
                    <span className="px-3 py-1 bg-white dark:bg-slate-900 rounded-xl text-primary font-black text-sm border border-slate-100 dark:border-slate-800">
                      {calcChildren} Kids
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    value={calcChildren}
                    onChange={(e) => setCalcChildren(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>5 kids</span>
                    <span>150 kids</span>
                  </div>
                </div>

                {/* Control 2: Admin hours */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Admin/Reporting Hours per week?</label>
                    <span className="px-3 py-1 bg-white dark:bg-slate-900 rounded-xl text-orange-500 font-black text-sm border border-slate-100 dark:border-slate-800">
                      {calcAdminHours} Hours
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="40"
                    value={calcAdminHours}
                    onChange={(e) => setCalcAdminHours(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>2 hrs/wk</span>
                    <span>40 hrs/wk</span>
                  </div>
                </div>

                {/* Result Block */}
                <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
                  
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 w-full h-1 bg-primary" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Hours Saved / Month</span>
                    <span className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white mt-1">
                      ~{Math.round(calcAdminHours * 4 * 0.72)} hrs
                    </span>
                    <p className="text-[10px] font-bold text-slate-450 dark:text-slate-500 mt-2">72% time reduction</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 w-full h-1 bg-orange-500" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Parent Engagement Boost</span>
                    <span className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white mt-1 text-orange-500">
                      +{Math.min(100, Math.round(95 + (calcChildren * 0.05)))}%
                    </span>
                    <p className="text-[10px] font-bold text-slate-450 dark:text-slate-500 mt-2">Real-time daily feed transparency</p>
                  </div>

                </div>

                {/* Micro CTA */}
                <div className="text-center">
                  <Link to="/signup" className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary dark:text-violet-400 hover:text-indigo-600">
                    <span>Unlock these savings now</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ============ INTERACTIVE TESTIMONIALS SLIDER ============ */}
      <section id="testimonials" className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="inline-block px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 text-xs font-black uppercase tracking-widest">
              Success Stories
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold font-display text-slate-900 dark:text-white leading-tight">
              Beloved by educators & families
            </h2>
          </div>

          {/* Testimonial Active Display Card */}
          <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl p-8 sm:p-12 border border-slate-100 dark:border-slate-800 text-center sm:text-left transition-all duration-300">
            {/* Absolute quote background */}
            <div className="absolute top-6 left-6 sm:top-10 sm:left-10 text-[8rem] font-serif text-slate-100 dark:text-slate-800 leading-none select-none -z-0">“</div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-center">
              {/* Profile Image with Ring */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-indigo-650 rounded-full blur-[2px] -z-10 scale-[1.06]" />
                <img 
                  src={testimonials[testimonialIndex].avatar} 
                  alt={testimonials[testimonialIndex].author} 
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-slate-900"
                />
              </div>

              {/* Text Block */}
              <div className="space-y-4 flex-1">
                {/* 5-star rating */}
                <div className="flex justify-center sm:justify-start gap-1 text-amber-500">
                  {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                <p className="text-base sm:text-lg text-slate-650 dark:text-slate-350 leading-relaxed font-semibold italic">
                  "{testimonials[testimonialIndex].text}"
                </p>

                <div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{testimonials[testimonialIndex].author}</h4>
                  <p className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">{testimonials[testimonialIndex].role}</p>
                </div>
              </div>
            </div>

            {/* Slide Navigation Controls */}
            <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 flex gap-2">
              <button 
                onClick={() => setTestimonialIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setTestimonialIndex(prev => (prev + 1) % testimonials.length)}
                className="w-10 h-10 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button 
                key={i}
                onClick={() => setTestimonialIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  testimonialIndex === i ? 'w-8 bg-primary' : 'w-2 bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ============ PRECISE FAQ COLLAPSIBLE ACCORDION ============ */}
      <section className="py-24 lg:py-32 bg-white dark:bg-slate-900 transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="inline-block px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest">
              Have Questions?
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold font-display text-slate-900 dark:text-white leading-tight">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left gap-4"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                      {faq.q}
                    </span>
                    <span className={`w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}>
                      <ChevronUp size={16} />
                    </span>
                  </button>

                  {/* Expandable Panel */}
                  <div 
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? 'max-h-[250px] opacity-100 border-t border-slate-100 dark:border-slate-900' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="px-6 py-5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed bg-white/40 dark:bg-slate-900/30">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============ PREMIUM CALL TO ACTION SECTION ============ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          
          <div className="bg-slate-900 dark:bg-slate-950 rounded-[3rem] p-8 sm:p-12 lg:p-20 relative overflow-hidden border border-slate-800/80 shadow-2xl">
            {/* Ambient visual overlay inside */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-6 text-center lg:text-left">
                <span className="inline-block px-3 py-1.5 rounded-xl bg-white/10 text-violet-300 text-xs font-black uppercase tracking-wider">
                  Get Started In Minutes
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white leading-tight">
                  Ready to transform your <span className="text-primary dark:text-violet-400 italic">childcare?</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-400 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                  Join hundreds of educators and thousands of connected parents providing the highest standard of daily early education.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/signup" className="px-8 py-4 bg-primary hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.03] active:scale-97 transition-all duration-300">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="px-8 py-4 border border-slate-700 text-slate-200 font-bold hover:bg-white/5 rounded-2xl hover:scale-[1.03] active:scale-97 transition-all duration-300">
                    Log In
                  </Link>
                </div>
              </div>

              {/* Graphic side */}
              <div className="hidden lg:block relative">
                <div className="bg-gradient-to-br from-primary to-indigo-650 w-full aspect-square max-w-[340px] mx-auto rounded-[2.5rem] shadow-2xl rotate-3 flex items-center justify-center p-6 overflow-hidden group hover:rotate-0 transition-transform duration-700">
                  <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 flex flex-col justify-between group-hover:scale-105 transition-transform duration-700">
                    <div className="flex justify-between items-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
                      <div className="px-2.5 py-1 bg-emerald-500 text-white text-[9px] font-black rounded-full uppercase tracking-wider">Live Active</div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-2/3 h-5 bg-white/25 rounded-md animate-pulse" />
                      <div className="w-full h-12 bg-white/20 rounded-lg animate-pulse" />
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse" />
                      <div className="flex-1 space-y-1">
                        <div className="w-1/2 h-3 bg-white/25 rounded-md animate-pulse" />
                        <div className="w-3/4 h-3 bg-white/20 rounded-md animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ============ FOOTER SECTION ============ */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/40 pt-16 pb-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-12 mb-16">
            
            {/* Left: Brand info & Newsletter */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <Heart size={18} fill="currentColor" />
                </div>
                <span className="text-xl font-black text-slate-900 dark:text-white font-display tracking-tight">CareSync</span>
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm">
                Empowering early childhood development through transparent, high-end, and secure digital collaboration.
              </p>

              {/* Newsletter subscribe */}
              <div className="space-y-2 pt-2">
                <h5 className="text-xs font-black uppercase text-slate-700 dark:text-slate-350 tracking-wider">Stay Connected</h5>
                
                {newsletterSubscribed ? (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold py-2 flex items-center gap-1.5 animate-zoom-in">
                    <CheckCircle size={14} />
                    Thank you! Check your inbox for our onboarding guide.
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex max-w-sm">
                    <input 
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-grow px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-l-xl focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2.5 bg-primary hover:bg-indigo-600 text-white font-bold text-xs rounded-r-xl transition-all"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Footnote Nav groups */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              
              <div className="space-y-4">
                <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Platform</h5>
                <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-450">
                  <li><a href="#features" className="font-semibold hover:text-primary transition-colors">Features Grid</a></li>
                  <li><a href="#calculator" className="font-semibold hover:text-primary transition-colors">Impact Sliders</a></li>
                  <li><Link to="/login" className="font-semibold hover:text-primary transition-colors">Sign In Portal</Link></li>
                  <li><Link to="/signup" className="font-semibold hover:text-primary transition-colors">Register Center</Link></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Support</h5>
                <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-450">
                  <li><a href="#" className="font-semibold hover:text-primary transition-colors">Documentation</a></li>
                  <li><a href="#" className="font-semibold hover:text-primary transition-colors">Help Center</a></li>
                  <li><a href="#" className="font-semibold hover:text-primary transition-colors">Developer API</a></li>
                  <li><a href="#" className="font-semibold hover:text-primary transition-colors">Systems Status</a></li>
                </ul>
              </div>

              <div className="space-y-4 col-span-2 sm:col-span-1">
                <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Connect</h5>
                <div className="flex gap-3">
                  {['Twitter', 'Instagram', 'LinkedIn'].map(social => (
                    <a 
                      key={social} 
                      href="#" 
                      className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 hover:border-primary/20 hover:scale-105 active:scale-95 transition-all"
                      title={social}
                    >
                      <span className="text-[10px] font-bold uppercase">{social[0]}</span>
                    </a>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Base bottom details */}
          <div className="pt-8 border-t border-slate-200/50 dark:border-slate-800/40 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold">
              © 2026 CareSync Inc. Built with love and human craft for future leaders.
            </p>
            <div className="flex gap-6 text-[9px] sm:text-xs font-bold text-slate-400">
              <a href="#" className="hover:text-slate-950 dark:hover:text-slate-100 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-950 dark:hover:text-slate-100 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-950 dark:hover:text-slate-100 transition-colors">Security Details</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Home;
