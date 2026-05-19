import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import API_URL from '../config';
import { 
    BookOpen, 
    Users, 
    Clock, 
    MessageSquare, 
    Plus, 
    CheckCircle, 
    Calendar,
    ChevronRight,
    Camera,
    Info,
    AlertCircle,
    LayoutDashboard,
    X
} from 'lucide-react';

const TeacherDashboard = () => {
    const { user } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const [activities, setActivities] = useState([]);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRosterModal, setShowRosterModal] = useState(false);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [showActivityModal, setShowActivityModal] = useState(false);
    
    // Form states
    const [attendanceData, setAttendanceData] = useState({});
    const [activityForm, setActivityForm] = useState({ childId: '', title: '', description: '', image: null });
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [studentsRes, activitiesRes, attendanceRes] = await Promise.all([
                axios.get(`${API_URL}/children`),
                axios.get(`${API_URL}/activities`),
                axios.get(`${API_URL}/attendance`)
            ]);
            setStudents(studentsRes.data.data);
            setActivities(activitiesRes.data.data);
            setAttendanceHistory(attendanceRes.data.data || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const promises = Object.entries(attendanceData).map(([childId, status]) => 
                axios.post(`${API_URL}/attendance`, { childId, status })
            );
            await Promise.all(promises);
            setShowAttendanceModal(false);
            setAttendanceData({});
            fetchDashboardData(); // Refresh to update "Today's Presence"
            alert('Attendance marked successfully!');
        } catch (error) {
            console.error('Error marking attendance:', error);
            alert('Failed to mark attendance');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogActivity = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        const formData = new FormData();
        formData.append('childId', activityForm.childId);
        formData.append('title', activityForm.title);
        formData.append('description', activityForm.description);
        if (activityForm.image) {
            formData.append('image', activityForm.image);
        }

        try {
            await axios.post(`${API_URL}/activities`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowActivityModal(false);
            setActivityForm({ childId: '', title: '', description: '', image: null });
            fetchDashboardData(); // Refresh activities
            alert('Activity logged successfully!');
        } catch (error) {
            console.error('Error logging activity:', error);
            alert('Failed to log activity');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteActivity = async (activityId) => {
        if (!window.confirm('Delete this activity?')) return;
        try {
            await axios.delete(`${API_URL}/activities/${activityId}`);
            setActivities(prev => prev.filter(a => a._id !== activityId));
        } catch (error) {
            console.error('Error deleting activity:', error);
            alert('Failed to delete activity');
        }
    };

    // Calculate Today's Presence
    const todayStr = new Date().toDateString();
    const todaysAttendance = attendanceHistory.filter(a => new Date(a.createdAt || a.date).toDateString() === todayStr);
    const presentTodayCount = todaysAttendance.filter(a => a.status === 'present').length;
    const totalAssignedStudents = students.length;


    if (loading && students.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl rotate-3">
                                {user?.name.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                Hello, Teacher {user?.name}! 👋
                            </h1>
                            <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                                <Calendar size={16} className="text-indigo-500" />
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Link to="/chat" className="flex items-center gap-2 bg-white text-slate-700 px-5 py-3 rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all font-semibold">
                            <MessageSquare size={20} className="text-indigo-500" />
                            Messages
                        </Link>
                        <button 
                            onClick={() => setShowActivityModal(true)}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all font-semibold"
                        >
                            <Plus size={20} />
                            Log Activity
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total Students', value: totalAssignedStudents, icon: Users, color: 'emerald' },
                        { label: 'Today\'s Presence', value: `${presentTodayCount}/${totalAssignedStudents}`, icon: CheckCircle, color: 'blue' },
                        { label: 'Activities Logged', value: activities.length, icon: Camera, color: 'purple' },
                        { label: 'Unread Messages', value: '0', icon: MessageSquare, color: 'amber' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-4`}>
                                <stat.icon size={24} />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Actions Area */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Tab Headers */}
                        <div className="flex bg-white rounded-2xl p-2 shadow-sm border border-slate-100 mb-6">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                    activeTab === 'overview' 
                                    ? 'bg-primary text-white shadow-md' 
                                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-transparent hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <LayoutDashboard size={18} />
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('activities')}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                    activeTab === 'activities' 
                                    ? 'bg-primary text-white shadow-md' 
                                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-transparent hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <Camera size={18} />
                                Activities
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                                    activeTab === 'activities' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                                }`}>
                                    {activities.length}
                                </span>
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'overview' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Roster Card */}
                                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                        <Users size={80} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Class Roster</h3>
                                    <p className="text-slate-500 mb-6">Manage student profiles and parent contact details.</p>
                                    <button 
                                        onClick={() => setShowRosterModal(true)}
                                        className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                                    >
                                        View Students <ChevronRight size={20} />
                                    </button>
                                </div>

                                {/* Attendance Card */}
                                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                        <Clock size={80} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Attendance</h3>
                                    <p className="text-slate-500 mb-6">Quickly mark presence for your morning and afternoon sessions.</p>
                                    <button 
                                        onClick={() => setShowAttendanceModal(true)}
                                        className="flex items-center gap-2 text-amber-600 font-bold hover:gap-3 transition-all"
                                    >
                                        Mark Today <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900 text-lg">All Logged Activities</h3>
                                    <button 
                                        onClick={() => setShowActivityModal(true)}
                                        className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline"
                                    >
                                        <Plus size={16} /> New Activity
                                    </button>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {activities.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Camera size={32} />
                                            </div>
                                            <p className="text-slate-500 font-medium">No activities logged yet.</p>
                                            <p className="text-slate-400 text-sm mt-1">Click "Log Activity" to add the first update.</p>
                                        </div>
                                    ) : (
                                        activities.map((activity, i) => (
                                            <div key={activity._id || i} className="p-5 hover:bg-slate-50/50 dark:hover:bg-transparent transition-colors group">
                                                <div className="flex gap-4">
                                                    {/* Image or Icon */}
                                                    <div 
                                                        className="flex-shrink-0 cursor-pointer group/img"
                                                        onClick={() => activity.image && setSelectedImage(`${API_URL.replace('/api', '')}${activity.image}`)}
                                                        title={activity.image ? "Click to view image" : ""}
                                                    >
                                                        {activity.image ? (
                                                            <div className="relative overflow-hidden rounded-2xl w-16 h-16 border border-slate-100">
                                                                <img 
                                                                    src={`${API_URL.replace('/api', '')}${activity.image}`} 
                                                                    alt={activity.title}
                                                                    className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                                                                />
                                                                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
                                                                    <Camera className="text-white opacity-0 group-hover/img:opacity-100 transition-opacity" size={16} />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                                                <BookOpen size={24} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <p className="font-bold text-slate-900 text-sm">{activity.title}</p>
                                                                <p className="text-xs text-primary font-semibold mt-0.5">
                                                                    {activity.child?.name || 'Unknown Student'}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                                                                    {new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                    {' · '}
                                                                    {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                                <button 
                                                                    onClick={() => handleDeleteActivity(activity._id)}
                                                                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-1"
                                                                    title="Delete activity"
                                                                >
                                                                    <AlertCircle size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {activity.description && (
                                                            <p className="text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{activity.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
                            <div className="flex items-center gap-3 mb-6">
                                <Info size={20} className="text-indigo-200" />
                                <h4 className="font-bold">Daily Tip</h4>
                            </div>
                            <p className="text-indigo-100 leading-relaxed italic">
                                "Patience and understanding are the keys to a child's heart. Take a moment to celebrate small wins today!"
                            </p>
                        </div>


                    </div>
                </div>
            </main>

            {/* --- Modals --- */}

            {/* Roster Modal */}
            {showRosterModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-900">Class Roster</h2>
                            <button onClick={() => setShowRosterModal(false)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <div className="overflow-auto p-6">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-slate-400 text-sm uppercase tracking-wider">
                                        <th className="pb-4 font-semibold">Student Name</th>
                                        <th className="pb-4 font-semibold">Age</th>
                                        <th className="pb-4 font-semibold">Parent Contact</th>
                                        <th className="pb-4 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {students.map((student) => (
                                        <tr key={student._id}>
                                            <td className="py-4 font-bold text-slate-900">{student.name}</td>
                                            <td className="py-4 text-slate-500">{student.age} years</td>
                                            <td className="py-4">
                                                <p className="text-slate-900 font-medium">{student.parent?.name}</p>
                                                <p className="text-xs text-slate-500">{student.parent?.email}</p>
                                            </td>
                                            <td className="py-4">
                                                <Link to={`/child/${student._id}`} className="text-indigo-600 font-bold text-sm">View Profile</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Attendance Modal */}
            {showAttendanceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Mark Attendance</h2>
                                <p className="text-slate-500 text-sm">{new Date().toDateString()}</p>
                            </div>
                            <button onClick={() => setShowAttendanceModal(false)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <form onSubmit={handleMarkAttendance}>
                            <div className="p-6 max-h-[60vh] overflow-auto space-y-4">
                                {students.map((student) => (
                                    <div key={student._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="font-bold text-slate-800">{student.name}</span>
                                        <div className="flex gap-2">
                                            {['present', 'absent'].map((status) => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() => setAttendanceData({...attendanceData, [student._id]: status})}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                                        attendanceData[student._id] === status 
                                                        ? 'bg-primary text-white' 
                                                        : 'bg-white text-slate-500 border border-slate-200 hover:border-primary/50'
                                                    }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 border-t border-slate-100 flex justify-end">
                                <button 
                                    disabled={submitting}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : 'Save Attendance'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Activity Modal */}
            {showActivityModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-900">Log Daily Activity</h2>
                            <button onClick={() => setShowActivityModal(false)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <form onSubmit={handleLogActivity} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Select Student</label>
                                <select 
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={activityForm.childId}
                                    onChange={(e) => setActivityForm({...activityForm, childId: e.target.value})}
                                >
                                    <option value="">Choose a student...</option>
                                    {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Activity Title</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="e.g. Painting Session"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={activityForm.title}
                                    onChange={(e) => setActivityForm({...activityForm, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                <textarea 
                                    rows="3"
                                    placeholder="What did the child do today?"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={activityForm.description}
                                    onChange={(e) => setActivityForm({...activityForm, description: e.target.value})}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Upload Photo (Optional)</label>
                                <div className="relative group">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => setActivityForm({...activityForm, image: e.target.files[0]})}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center group-hover:border-indigo-300 transition-colors">
                                        <Camera className="text-slate-400 group-hover:text-indigo-500 mb-2" size={24} />
                                        <p className="text-xs font-bold text-slate-500 group-hover:text-indigo-600">
                                            {activityForm.image ? activityForm.image.name : 'Click to select or drag photo'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button 
                                disabled={submitting}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 disabled:opacity-50 mt-2"
                            >
                                {submitting ? 'Posting...' : 'Post Activity Update'}
                            </button>

                        </form>
                    </div>
                </div>
            )}

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

export default TeacherDashboard;

