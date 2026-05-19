import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { 
    BookOpen, Camera, Coffee, CheckCircle, MessageSquare, 
    ChevronRight, User, Calendar, Clock, Loader2, X 
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const ParentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [children, setChildren] = useState([]);
    const [activities, setActivities] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('activities');
    const [selectedChild, setSelectedChild] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [childRes, actRes, attRes] = await Promise.all([
                    axios.get(`${API_URL}/children`),
                    axios.get(`${API_URL}/activities`),
                    axios.get(`${API_URL}/attendance`)
                ]);
                if (childRes.data.success) setChildren(childRes.data.data);
                if (actRes.data.success) setActivities(actRes.data.data);
                if (attRes.data.success) setAttendance(attRes.data.data);
            } catch (err) {
                console.error('Error fetching parent data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter activities by selected child
    const filteredActivities = selectedChild === 'all' 
        ? activities 
        : activities.filter(a => (a.child?._id || a.child) === selectedChild);

    // Filter attendance by selected child
    const filteredAttendance = selectedChild === 'all'
        ? attendance
        : attendance.filter(a => (a.child?._id || a.child) === selectedChild);

    // Calculate attendance stats
    const totalAttendance = filteredAttendance.length;
    const presentCount = filteredAttendance.filter(a => a.status === 'present').length;
    const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    const tabs = [
        { id: 'activities', label: 'Activities', icon: Camera, count: filteredActivities.length },
        { id: 'attendance', label: 'Attendance', icon: CheckCircle, count: filteredAttendance.length },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="animate-spin mx-auto text-primary mb-3" size={32} />
                    <p className="text-slate-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl rotate-3">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                Hello, {user?.name}! 👨‍👩‍👧
                            </h1>
                            <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                                <Calendar size={16} className="text-emerald-500" />
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <Link to="/chat" className="flex items-center gap-2 bg-white text-slate-700 px-5 py-3 rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all font-semibold">
                        <MessageSquare size={20} className="text-primary" />
                        Messages
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                            <User size={24} />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">My Children</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{children.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                            <Camera size={24} />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Activities Logged</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{activities.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                            <CheckCircle size={24} />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Attendance Rate</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{attendanceRate}%</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                            <Clock size={24} />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Records</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalAttendance}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Tabs */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Child Filter + Tabs */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            {/* Child Filter Bar */}
                            {children.length > 1 && (
                                <div className="p-4 border-b border-slate-50 flex items-center gap-2 overflow-x-auto">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 whitespace-nowrap">Filter:</span>
                                    <button
                                        onClick={() => setSelectedChild('all')}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                            selectedChild === 'all' 
                                            ? 'bg-primary text-white' 
                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:hover:bg-transparent'
                                        }`}
                                    >
                                        All Children
                                    </button>
                                    {children.map(child => (
                                        <button
                                            key={child._id}
                                            onClick={() => setSelectedChild(child._id)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                                selectedChild === child._id 
                                                ? 'bg-primary text-white' 
                                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:hover:bg-transparent'
                                            }`}
                                        >
                                            {child.name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Tab Headers */}
                            <div className="flex border-b border-slate-100">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative ${
                                            activeTab === tab.id 
                                            ? 'text-primary' 
                                            : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        <tab.icon size={18} />
                                        {tab.label}
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                            activeTab === tab.id 
                                            ? 'bg-primary/10 text-primary' 
                                            : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            {tab.count}
                                        </span>
                                        {activeTab === tab.id && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="divide-y divide-slate-50">
                                {activeTab === 'activities' && (
                                    <>
                                        {filteredActivities.length === 0 ? (
                                            <div className="p-12 text-center">
                                                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Camera size={32} />
                                                </div>
                                                <p className="text-slate-500 font-medium">No activities yet.</p>
                                                <p className="text-slate-400 text-sm mt-1">Your child's teacher will post updates here.</p>
                                            </div>
                                        ) : (
                                            filteredActivities.map((activity, i) => (
                                                <div key={activity._id || i} className="p-5 hover:bg-slate-50/50 dark:hover:bg-transparent transition-colors">
                                                    <div className="flex gap-4">
                                                        <div 
                                                            className="flex-shrink-0 cursor-pointer group"
                                                            onClick={() => activity.image && setSelectedImage(`${API_URL.replace('/api', '')}${activity.image}`)}
                                                            title={activity.image ? "Click to view image" : ""}
                                                        >
                                                            {activity.image ? (
                                                                <div className="relative overflow-hidden rounded-2xl w-16 h-16 border border-slate-100">
                                                                    <img 
                                                                        src={`${API_URL.replace('/api', '')}${activity.image}`} 
                                                                        alt={activity.title}
                                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                                        <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                                                                    <BookOpen size={24} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div>
                                                                    <p className="font-bold text-slate-900 text-sm">{activity.title}</p>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <span className="text-xs text-indigo-600 font-semibold">
                                                                            {activity.child?.name || 'Your Child'}
                                                                        </span>
                                                                        {activity.teacher && (
                                                                            <span className="text-[10px] text-slate-400">
                                                                                by {activity.teacher?.name || 'Teacher'}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                                                                    {new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                    {' · '}
                                                                    {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            {activity.description && (
                                                                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{activity.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </>
                                )}

                                {activeTab === 'attendance' && (
                                    <>
                                        {filteredAttendance.length === 0 ? (
                                            <div className="p-12 text-center">
                                                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <CheckCircle size={32} />
                                                </div>
                                                <p className="text-slate-500 font-medium">No attendance records yet.</p>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Attendance Summary Bar */}
                                                <div className="p-5 bg-slate-50/50">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Attendance</span>
                                                        <span className="text-sm font-bold text-slate-900">{attendanceRate}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                                                        <div 
                                                            className={`h-2.5 rounded-full transition-all duration-700 ${
                                                                attendanceRate >= 80 ? 'bg-emerald-500' : attendanceRate >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                                                            }`}
                                                            style={{ width: `${attendanceRate}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-3 text-[10px] font-bold">
                                                        <span className="text-emerald-600">✓ Present: {presentCount}</span>
                                                        <span className="text-rose-500">✗ Absent: {filteredAttendance.filter(a => a.status === 'absent').length}</span>
                                                    </div>
                                                </div>
                                                {/* Attendance Records */}
                                                {filteredAttendance.slice(0, 10).map((record, i) => (
                                                    <div key={record._id || i} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-transparent transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                                record.status === 'present' ? 'bg-emerald-50 text-emerald-600' :
                                                                'bg-rose-50 text-rose-600'
                                                            }`}>
                                                                {record.status === 'present' ? <CheckCircle size={18} /> :
                                                                 <span className="font-bold text-sm">✗</span>}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm text-slate-900">{record.child?.name || 'Child'}</p>
                                                                <p className="text-[10px] text-slate-400">
                                                                    {new Date(record.date || record.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                            record.status === 'present' ? 'bg-emerald-50 text-emerald-700' :
                                                            'bg-rose-50 text-rose-700'
                                                        }`}>
                                                            {record.status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Children Cards */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800">Your Children</h2>
                        {children.length === 0 ? (
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center">
                                <p className="text-slate-500">No children registered yet.</p>
                            </div>
                        ) : (
                            children.map(child => (
                                <div key={child._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-primary">
                                            <User size={28} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800">{child.name}</h3>
                                            <p className="text-slate-500 text-sm">Age: {child.age} years</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                            <span className="text-sm font-medium text-slate-600">Teacher</span>
                                            <span className="text-sm font-bold text-slate-900">{child.teacher?.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                            <span className="text-sm font-medium text-slate-600">Activities</span>
                                            <span className="text-sm font-bold text-indigo-600">
                                                {activities.filter(a => (a.child?._id || a.child) === child._id).length} logged
                                            </span>
                                        </div>
                                        <Link
                                            to={`/chat?userId=${child.teacher?._id}`}
                                            className="w-full py-3 bg-primary/10 text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all"
                                        >
                                            <MessageSquare size={18} />
                                            Message {child.teacher?.name?.split(' ')[0] || 'Teacher'}
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Support Card */}
                        <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-primary/20">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                    <MessageSquare size={28} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">General Support</h3>
                                    <p className="text-white/70 text-sm">Talk to school admin</p>
                                </div>
                            </div>
                            <Link to="/chat" className="w-full py-3 bg-white text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                                Open Messenger
                                <ChevronRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Image Lightbox Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
                        <img 
                            src={selectedImage} 
                            alt="Expanded activity" 
                            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button 
                            className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={20} className="font-bold" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParentDashboard;
