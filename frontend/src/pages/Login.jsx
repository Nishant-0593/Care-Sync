import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import API_URL from '../config';
import { Mail, Lock, LogIn, Heart, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState('login'); // 'login' | 'forgot' | 'reset'
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    const { login } = useContext(AuthContext);
    const { setDarkMode } = useContext(ThemeContext);
    const navigate = useNavigate();

    useEffect(() => {
        setDarkMode(false);
    }, [setDarkMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            login(res.data.user, res.data.token);
            
            // Redirect based on role
            switch(res.data.user.role) {
                case 'admin': navigate('/admin'); break;
                case 'teacher': navigate('/teacher'); break;
                case 'parent': navigate('/parent'); break;
                default: navigate('/');
            }
        } catch (err) {
            if (!err.response) {
                setError('Cannot connect to the server. Please ensure the backend is running and MongoDB is connected.');
            } else {
                setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
            setSuccessMsg(res.data.message || 'OTP sent to your email.');
            setView('reset');
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/reset-password`, { email, otp, newPassword });
            setSuccessMsg('Password reset successfully. You can now log in.');
            setView('login');
            setPassword('');
            setOtp('');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc] relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />


            <div className="max-w-md w-full relative">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to home
                </Link>

                <div className="text-center mb-8 animate-slide-up">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary to-indigo-600 text-white mb-6 shadow-xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Heart size={40} fill="currentColor" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                        {view === 'login' && 'Welcome Back'}
                        {view === 'forgot' && 'Reset Password'}
                        {view === 'reset' && 'Enter OTP'}
                    </h2>
                    <p className="mt-3 text-slate-500 text-lg">
                        {view === 'login' && 'Sign in to manage your CareSync dashboard'}
                        {view === 'forgot' && 'Enter your email to receive a reset code'}
                        {view === 'reset' && 'Enter the OTP sent to your email'}
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 lg:p-10 border border-slate-100 animate-fade-in">
                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-semibold flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                            {error}
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-sm font-semibold flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                            {successMsg}
                        </div>
                    )}
                    
                    {view === 'login' && (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={20} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-slate-700">Password</label>
                                <a href="#" onClick={(e) => { e.preventDefault(); setView('forgot'); setError(''); setSuccessMsg(''); }} className="text-xs font-bold text-primary hover:underline">Forgot Password?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-600 hover:to-primary text-white font-bold rounded-[1.25rem] shadow-lg shadow-primary/25 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In 
                                    <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                    )}

                    {view === 'forgot' && (
                        <form className="space-y-6" onSubmit={handleForgotPassword}>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail size={20} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-600 hover:to-primary text-white font-bold rounded-[1.25rem] shadow-lg shadow-primary/25 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Send OTP'
                                )}
                            </button>
                            <div className="text-center mt-4">
                                <button type="button" onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }} className="text-sm font-bold text-slate-500 hover:text-primary">Back to Login</button>
                            </div>
                        </form>
                    )}

                    {view === 'reset' && (
                        <form className="space-y-6" onSubmit={handleResetPassword}>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">OTP</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={20} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                        placeholder="Enter OTP"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={20} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-600 hover:to-primary text-white font-bold rounded-[1.25rem] shadow-lg shadow-primary/25 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                            <div className="text-center mt-4">
                                <button type="button" onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }} className="text-sm font-bold text-slate-500 hover:text-primary">Back to Login</button>
                            </div>
                        </form>
                    )}
                </div>
                
                {view === 'login' && (
                <p className="mt-8 text-center text-slate-600 font-medium">
                    New to CareSync?{' '}
                    <Link to="/signup" className="text-primary font-bold hover:underline transition-all">
                        Create an account
                    </Link>
                </p>
                )}
            </div>
        </div>
    );
};

export default Login;
