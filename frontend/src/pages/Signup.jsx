import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import API_URL from '../config';
import { User, Mail, Lock, Shield, Heart, ArrowLeft, ChevronRight, Eye, EyeOff, Check } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'parent',
        adminSecretKey: '',
        teacherSecretKey: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [adminExists, setAdminExists] = useState(false);
    
    const { login } = useContext(AuthContext);
    const { setDarkMode } = useContext(ThemeContext);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        setDarkMode(false);
    }, [setDarkMode]);

    const allRoles = [
        { id: 'parent', label: 'Parent', desc: 'Monitor your child\'s daily activities and progress' },
        { id: 'teacher', label: 'Teacher', desc: 'Manage classrooms, attendance, and student logs' },
        { id: 'admin', label: 'Administrator', desc: 'Full school management and staff coordination' }
    ];

    const roles = allRoles.filter(r => r.id !== 'admin' || !adminExists);

    const selectedRole = roles.find(r => r.id === formData.role);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsRoleOpen(false);
            }
        };

        const checkAdmin = async () => {
            try {
                const res = await axios.get(`${API_URL}/auth/admin-exists`);
                setAdminExists(res.data.exists);
            } catch (err) {
                console.error('Error checking admin existence:', err);
            }
        };

        checkAdmin();
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (roleId) => {
        setFormData({ ...formData, role: roleId });
        setIsRoleOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            const res = await axios.post(`${API_URL}/auth/register`, registerData);
            login(res.data.user);
            
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
                setError(err.response?.data?.message || 'Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc] relative overflow-hidden py-20">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />


            <div className="max-w-xl w-full relative">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to home
                </Link>

                <div className="text-center mb-8 animate-slide-up">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white mb-6 shadow-xl shadow-primary/20">
                        <Heart size={32} fill="currentColor" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h2>
                    <p className="mt-3 text-slate-500 text-lg">Join the most trusted childcare network</p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 lg:p-12 border border-slate-100 animate-fade-in">
                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-semibold flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                            {error}
                        </div>
                    )}
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User size={20} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail size={20} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={20} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        minLength="6"
                                        value={formData.password}
                                        onChange={handleChange}
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

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={20} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        required
                                        minLength="6"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 relative" ref={dropdownRef}>
                            <label className="text-sm font-bold text-slate-700 ml-1">Account Role</label>
                            <button
                                type="button"
                                onClick={() => setIsRoleOpen(!isRoleOpen)}
                                className={`w-full flex items-center justify-between pl-12 pr-6 py-4 bg-slate-50 border-2 rounded-[1.25rem] transition-all outline-none ${isRoleOpen ? 'border-primary/20 bg-white ring-4 ring-primary/5' : 'border-transparent'}`}
                            >
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Shield size={20} className={`${isRoleOpen ? 'text-primary' : 'text-slate-400'} transition-colors`} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-slate-900 font-bold">{selectedRole.label}</span>
                                </div>
                                <ChevronRight size={20} className={`text-slate-400 transition-transform duration-300 ${isRoleOpen ? 'rotate-90' : ''}`} />
                            </button>

                            {isRoleOpen && (
                                <div className="absolute z-50 w-full mt-2 bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    {roles.map((role) => (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => handleRoleSelect(role.id)}
                                            className={`w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors ${formData.role === role.id ? 'bg-primary/5' : ''}`}
                                        >
                                            <div className="flex flex-col">
                                                <span className={`font-bold ${formData.role === role.id ? 'text-primary' : 'text-slate-900'}`}>{role.label}</span>
                                                <span className="text-xs text-slate-500">{role.desc}</span>
                                            </div>
                                            {formData.role === role.id && <Check size={18} className="text-primary" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {formData.role === 'admin' && (
                            <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                                <label className="text-sm font-bold text-rose-600 ml-1">Admin Secret Key</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={20} className="text-rose-400 group-focus-within:text-rose-600 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        name="adminSecretKey"
                                        required
                                        value={formData.adminSecretKey}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-rose-50/30 border-2 border-rose-100 rounded-[1.25rem] focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-500/5 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                        placeholder="Enter secret key to authorize admin account"
                                    />
                                </div>
                                <p className="text-[10px] text-rose-500 ml-1 font-semibold italic">* Only authorized staff can create an administrator account.</p>
                            </div>
                        )}

                        {formData.role === 'teacher' && (
                            <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                                <label className="text-sm font-bold text-indigo-600 ml-1">Teacher Invite Code</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Shield size={20} className="text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        name="teacherSecretKey"
                                        required
                                        value={formData.teacherSecretKey}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-indigo-50/30 border-2 border-indigo-100 rounded-[1.25rem] focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                        placeholder="Enter invite code provided by school"
                                    />
                                </div>
                                <p className="text-[10px] text-indigo-500 ml-1 font-semibold italic">* Contact school administration to get your unique invite code.</p>
                            </div>
                        )}

                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <input type="checkbox" required className="mt-1 w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary" />
                            <span className="text-xs text-slate-500 leading-relaxed font-medium">
                                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>. I understand CareSync will process my data securely.
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-600 hover:to-primary text-white font-extrabold rounded-[1.25rem] shadow-lg shadow-primary/25 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 group"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                <p className="mt-8 text-center text-slate-600 font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline transition-all">
                        Log in instead
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
