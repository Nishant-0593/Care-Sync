import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { 
  Users, 
  Settings, 
  Activity, 
  Baby, 
  ChevronRight, 
  ShieldCheck,
  Bell
} from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                            <ShieldCheck size={12} />
                            Administrator Access
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Command <span className="text-primary italic">Center.</span>
                        </h1>
                        <p className="text-base text-slate-500 font-medium max-w-lg">
                            Manage the CareSync ecosystem from your central dashboard.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/admin/users" className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:border-primary/20 transition-all overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[3rem] group-hover:scale-110 transition-transform" />
                        <div className="w-12 h-12 bg-indigo-50 text-primary rounded-xl flex items-center justify-center mb-6">
                            <Users size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">User Directory</h3>
                        <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
                            Manage parents, teachers, and staff accounts.
                        </p>
                        <div className="flex items-center text-primary font-bold gap-2 group-hover:gap-3 transition-all uppercase tracking-widest text-[10px]">
                            Manage Directory <ChevronRight size={14} />
                        </div>
                    </Link>

                    <Link to="/admin/children" className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:border-amber-500/20 transition-all overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[3rem] group-hover:scale-110 transition-transform" />
                        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mb-6">
                            <Baby size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Children</h3>
                        <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
                            Register new students and track records.
                        </p>
                        <div className="flex items-center text-amber-500 font-bold gap-2 group-hover:gap-3 transition-all uppercase tracking-widest text-[10px]">
                            Access Records <ChevronRight size={14} />
                        </div>
                    </Link>

                    <Link to="/admin/settings" className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:border-rose-500/20 transition-all overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-[3rem] group-hover:scale-110 transition-transform" />
                        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-6">
                            <Settings size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Settings</h3>
                        <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
                            Configure global preferences and branding.
                        </p>
                        <div className="flex items-center text-rose-500 font-bold gap-2 group-hover:gap-3 transition-all uppercase tracking-widest text-[10px]">
                            Configure System <ChevronRight size={14} />
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
