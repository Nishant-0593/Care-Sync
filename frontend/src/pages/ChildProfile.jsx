import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API_URL from '../config';
import { Activity, Coffee, Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChildProfile = () => {
    const { id } = useParams();
    const [child, setChild] = useState(null);
    const [activities, setActivities] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChildData();
    }, [id]);

    const fetchChildData = async () => {
        try {
            setLoading(true);
            const [childRes, activitiesRes, attendanceRes] = await Promise.all([
                axios.get(`${API_URL}/children/${id}`),
                axios.get(`${API_URL}/activities`),
                axios.get(`${API_URL}/attendance`)
            ]);
            
            setChild(childRes.data.data);
            
            // Filter activities and attendance for this specific child
            const childActivities = activitiesRes.data.data.filter(a => a.child?._id === id);
            const childAttendance = attendanceRes.data.data.filter(a => a.child?._id === id);
            
            setActivities(childActivities);
            setAttendance(childAttendance);
        } catch (error) {
            console.error('Error fetching child data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!child) return <div className="p-8 text-center">Child not found</div>;

    const attendanceRate = attendance.length > 0 
        ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link to="/teacher" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold mb-6 transition-colors">
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                {/* Header Profile */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700"></div>
                    <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-8 mt-20">
                        <div className="w-40 h-40 bg-white rounded-[2rem] p-3 shadow-2xl shadow-indigo-200">
                            <div className="w-full h-full bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 text-5xl font-black">
                                {child.name.charAt(0)}
                            </div>
                        </div>
                        <div className="text-center sm:text-left flex-1 mb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{child.name}</h1>
                                <span className="px-4 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest self-center sm:self-auto">
                                    Student
                                </span>
                            </div>
                            <p className="text-slate-500 font-bold mt-2 text-lg">
                                Age: {child.age} • Class: {child.teacher?.name}'s Group
                            </p>
                        </div>
                        <div className="flex gap-3 mb-4">
                            <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Stats & Info */}
                    <div className="space-y-6">
                        {/* Attendance Card */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-slate-900">Attendance</h3>
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                    <Calendar size={20} />
                                </div>
                            </div>
                            <div className="flex items-end gap-4 mb-6">
                                <span className="text-5xl font-black text-slate-900">{attendanceRate}%</span>
                                <span className="text-slate-500 font-bold mb-2">Overall Rate</span>
                            </div>
                            <div className="space-y-3">
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-emerald-500 transition-all duration-1000" 
                                        style={{ width: `${attendanceRate}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                                    <span>{attendance.filter(a => a.status === 'present').length} Present</span>
                                    <span>{attendance.filter(a => a.status === 'absent').length} Absent</span>
                                </div>
                            </div>
                        </div>

                        {/* Family Info */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-6">Family Info</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Parent Name</p>
                                        <p className="font-bold text-slate-900">{child.parent?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                        <Coffee size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                        <p className="font-bold text-slate-900">{child.parent?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Activities */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                    <Activity className="text-indigo-600" size={24} />
                                    Activity Timeline
                                </h3>
                                <button className="text-indigo-600 font-bold text-sm">View Archive</button>
                            </div>
                            
                            {activities.length === 0 ? (
                                <div className="p-20 text-center">
                                    <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Clock size={40} />
                                    </div>
                                    <p className="text-slate-500 font-bold text-lg">No activities recorded for {child.name} yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-10 relative before:absolute before:left-[17px] before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100">
                                    {activities.map((activity, i) => (
                                        <div key={i} className="relative pl-12 group">
                                            <div className="absolute left-0 top-1.5 w-9 h-9 bg-white border-4 border-slate-50 rounded-xl flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform">
                                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <h4 className="text-xl font-black text-slate-900">{activity.title}</h4>
                                                    <p className="text-slate-500 font-medium mt-1 leading-relaxed">
                                                        {activity.description}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                                        {new Date(activity.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-sm font-bold text-indigo-600 mt-1">
                                                        {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
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

export default ChildProfile;

