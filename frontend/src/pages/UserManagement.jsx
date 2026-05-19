import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import Navbar from '../components/Navbar';
import { UserPlus, User, Mail, Shield, Trash2, CheckCircle2, AlertCircle, Loader2, Search } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'teacher'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/auth/users`);
            if (res.data.success) setUsers(res.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            // Reusing the register endpoint
            const res = await axios.post(`${API_URL}/auth/register`, formData);
            if (res.data.success) {
                setMessage({ type: 'success', text: 'User created successfully!' });
                setFormData({ name: '', email: '', password: '', role: 'teacher' });
                fetchUsers();
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create user' });
        } finally {
            setSubmitting(false);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
                    <p className="text-slate-500 mt-2">Manage all system users including teachers and parents.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Creation Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-8 border border-slate-100 sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    <UserPlus size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Add New User</h2>
                            </div>

                            {message.text && (
                                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary/20 transition-all outline-none text-slate-900 text-sm font-medium"
                                        placeholder="Enter name"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary/20 transition-all outline-none text-slate-900 text-sm font-medium"
                                        placeholder="user@example.com"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary/20 transition-all outline-none text-slate-900 text-sm font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Assign Role</label>
                                    <select
                                        name="role"
                                        required
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary/20 transition-all outline-none text-slate-900 text-sm font-medium appearance-none"
                                    >
                                        <option value="teacher">Teacher</option>
                                        <option value="parent">Parent</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Create User'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* User List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <h2 className="text-xl font-bold text-slate-800">System Users</h2>
                                <div className="relative max-w-xs w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text"
                                        placeholder="Search by name or email..."
                                        className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {loading ? (
                                <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={32} /></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-100">
                                                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                                                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                                                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                                                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {filteredUsers.map(u => (
                                                <tr key={u._id} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                                                {u.name.charAt(0)}
                                                            </div>
                                                            <div className="font-bold text-slate-800">{u.name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                                            u.role === 'admin' ? 'bg-rose-100 text-rose-600' : 
                                                            u.role === 'teacher' ? 'bg-indigo-100 text-primary' : 
                                                            'bg-emerald-100 text-emerald-600'
                                                        }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-sm text-slate-500">{u.email}</td>
                                                    <td className="py-4 text-right">
                                                        <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserManagement;
