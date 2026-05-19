import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import Navbar from '../components/Navbar';
import { UserPlus, Baby, User, Briefcase, Trash2, CheckCircle2, AlertCircle, Loader2, Settings } from 'lucide-react';

const ChildManagement = () => {
    const [children, setChildren] = useState([]);
    const [parents, setParents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        parent: '',
        teacher: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [childRes, parentRes, teacherRes] = await Promise.all([
                    axios.get(`${API_URL}/children`),
                    axios.get(`${API_URL}/auth/users?role=parent`),
                    axios.get(`${API_URL}/auth/users?role=teacher`)
                ]);

                if (childRes.data.success) setChildren(childRes.data.data);
                if (parentRes.data.success) setParents(parentRes.data.data);
                if (teacherRes.data.success) setTeachers(teacherRes.data.data);
            } catch (error) {
                console.error('Error fetching management data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            let res;
            if (editingId) {
                res = await axios.put(`${API_URL}/children/${editingId}`, formData);
            } else {
                res = await axios.post(`${API_URL}/children`, formData);
            }

            if (res.data.success) {
                setMessage({ 
                    type: 'success', 
                    text: editingId ? 'Child updated successfully!' : 'Child registered successfully!' 
                });
                setFormData({ name: '', age: '', parent: '', teacher: '' });
                setEditingId(null);
                // Refresh list
                const updated = await axios.get(`${API_URL}/children`);
                setChildren(updated.data.data);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Action failed' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (child) => {
        setEditingId(child._id);
        setFormData({
            name: child.name,
            age: child.age,
            parent: child.parent?._id || child.parent,
            teacher: child.teacher?._id || child.teacher
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this child record?')) return;
        
        try {
            const res = await axios.delete(`${API_URL}/children/${id}`);
            if (res.data.success) {
                setChildren(children.filter(c => c._id !== id));
            }
        } catch (error) {
            alert('Failed to delete record');
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', age: '', parent: '', teacher: '' });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Child Management</h1>
                    <p className="text-slate-500 mt-2">Register new children and assign them to parents and teachers.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Registration Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-8 border border-slate-100 sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    {editingId ? <User size={20} /> : <UserPlus size={20} />}
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    {editingId ? 'Edit Child' : 'Register Child'}
                                </h2>
                                {editingId && (
                                    <button onClick={cancelEdit} className="ml-auto text-xs font-bold text-slate-400 hover:text-rose-500 underline uppercase">
                                        Cancel
                                    </button>
                                )}
                            </div>

                            {message.text && (
                                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Baby size={18} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary/20 transition-all outline-none text-slate-900 text-sm font-medium"
                                            placeholder="Child's full name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        required
                                        min="0"
                                        max="15"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary/20 transition-all outline-none text-slate-900 text-sm font-medium"
                                        placeholder="Age in years"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Assign Parent</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User size={18} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <select
                                            name="parent"
                                            required
                                            value={formData.parent}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary/20 transition-all outline-none text-slate-900 text-sm font-medium appearance-none"
                                        >
                                            <option value="">Select Parent</option>
                                            {parents.map(p => <option key={p._id} value={p._id}>{p.name} ({p.email})</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Assign Teacher</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Briefcase size={18} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <select
                                            name="teacher"
                                            required
                                            value={formData.teacher}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary/20 transition-all outline-none text-slate-900 text-sm font-medium appearance-none"
                                        >
                                            <option value="">Select Teacher</option>
                                            {teachers.map(t => <option key={t._id} value={t._id}>{t.name} ({t.email})</option>)}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Update Record' : 'Register Child')}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Children List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-slate-800">Registered Children</h2>
                                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">{children.length} Total</span>
                            </div>

                            {loading ? (
                                <div className="py-20 text-center text-slate-400">
                                    <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                                    <p>Loading children records...</p>
                                </div>
                            ) : children.length === 0 ? (
                                <div className="py-20 text-center text-slate-400">
                                    <Baby className="mx-auto mb-4 opacity-20" size={64} />
                                    <p>No children registered yet.</p>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {children.map(child => (
                                        <div key={child._id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform cursor-pointer" onClick={() => handleEdit(child)}>
                                                    <Baby size={24} />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEdit(child)} className="text-slate-300 hover:text-primary transition-colors">
                                                        <Settings size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(child._id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-slate-900 text-lg">{child.name}</h4>
                                            <div className="mt-4 space-y-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-400 font-medium uppercase tracking-wider">Age</span>
                                                    <span className="text-slate-700 font-bold">{child.age} Years</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-400 font-medium uppercase tracking-wider">Parent</span>
                                                    <span className="text-slate-700 font-bold">{child.parent?.name}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-400 font-medium uppercase tracking-wider">Teacher</span>
                                                    <span className="text-slate-700 font-bold">{child.teacher?.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChildManagement;
