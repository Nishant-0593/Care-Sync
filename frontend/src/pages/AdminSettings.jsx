import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { 
  Save, 
  Settings, 
  Globe, 
  Mail, 
  Shield, 
  Bell, 
  Moon, 
  Palette, 
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

const AdminSettings = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [settings, setSettings] = useState({
        siteName: 'CareSync',
        supportEmail: 'support@caresync.com',
        enableRegistration: true,
        maintenanceMode: false,
        themeColor: '#6366f1',
        notifyAdminOnNewUser: true,
        sessionTimeout: '24'
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleChange = (e) => {
        setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Platform Settings</h1>
                        <p className="text-slate-500 font-medium">Global configuration and system preferences.</p>
                    </div>
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="btn px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {success ? 'Settings Saved!' : 'Save Changes'}
                    </button>
                </div>

                {success && (
                    <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 font-bold animate-in slide-in-from-top-4 duration-300">
                        <CheckCircle2 size={20} />
                        All changes have been successfully applied to the platform.
                    </div>
                )}

                <div className="grid gap-8">
                    {/* General Settings */}
                    <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 text-primary rounded-xl flex items-center justify-center">
                                    <Globe size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">General Configuration</h2>
                            </div>
                        </div>
                        <div className="p-8 grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Platform Name</label>
                                <input 
                                    type="text" 
                                    name="siteName"
                                    value={settings.siteName}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Support Email</label>
                                <input 
                                    type="email" 
                                    name="supportEmail"
                                    value={settings.supportEmail}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-slate-900"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Demo Video URL (YouTube Embed)</label>
                                <input 
                                    type="text" 
                                    name="videoUrl"
                                    placeholder="https://www.youtube.com/embed/..."
                                    value={settings.videoUrl || 'https://www.youtube.com/embed/ScMzIvxBSi4'}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-slate-900"
                                />
                                <p className="text-[10px] text-slate-400 font-bold ml-1 italic">Use the "embed" version of the YouTube link for best results.</p>
                            </div>
                        </div>
                    </section>

                    {/* Features & Permissions */}
                    <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                                    <Shield size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Permissions & Access</h2>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-200 transition-all group">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-slate-900">Public Registration</h4>
                                    <p className="text-sm text-slate-500 font-medium">Allow new parents and teachers to sign up without an invite.</p>
                                </div>
                                <button 
                                    onClick={() => handleToggle('enableRegistration')}
                                    className={`w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none ${settings.enableRegistration ? 'bg-primary' : 'bg-slate-300'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${settings.enableRegistration ? 'translate-x-6' : ''}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-200 transition-all group">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-slate-900">Maintenance Mode</h4>
                                    <p className="text-sm text-slate-500 font-medium">Only administrators can access the platform during maintenance.</p>
                                </div>
                                <button 
                                    onClick={() => handleToggle('maintenanceMode')}
                                    className={`w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none ${settings.maintenanceMode ? 'bg-primary' : 'bg-slate-300'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${settings.maintenanceMode ? 'translate-x-6' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Branding & UI */}
                    <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                                    <Palette size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Branding & Experience</h2>
                            </div>
                        </div>
                        <div className="p-8 grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Primary Theme Color</label>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="color" 
                                        name="themeColor"
                                        value={settings.themeColor}
                                        onChange={handleChange}
                                        className="w-16 h-16 rounded-2xl border-none cursor-pointer overflow-hidden"
                                    />
                                    <div className="space-y-1">
                                        <div className="font-bold text-slate-900">{settings.themeColor}</div>
                                        <div className="text-xs text-slate-400 font-bold">Accent & primary UI elements</div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Session Timeout (Hours)</label>
                                <select 
                                    name="sessionTimeout"
                                    value={settings.sessionTimeout}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-slate-900 appearance-none"
                                >
                                    <option value="1">1 Hour</option>
                                    <option value="12">12 Hours</option>
                                    <option value="24">24 Hours</option>
                                    <option value="168">7 Days</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="bg-rose-50 rounded-[2.5rem] border border-rose-100 p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-rose-600 tracking-tight flex items-center gap-2">
                                    <AlertCircle size={24} />
                                    Danger Zone
                                </h3>
                                <p className="text-rose-500 font-medium">Irreversible actions that affect the entire database.</p>
                            </div>
                            <button className="px-8 py-4 bg-white text-rose-600 font-bold rounded-2xl border-2 border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-lg shadow-rose-200/50">
                                Reset Platform Data
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AdminSettings;
