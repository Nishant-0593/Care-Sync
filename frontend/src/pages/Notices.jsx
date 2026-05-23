import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import API_URL from '../config';
import { 
  ArrowLeft, 
  Megaphone, 
  Plus, 
  Trash2, 
  Loader2, 
  AlertTriangle,
  Calendar,
  Tag,
  MessageSquare,
  Sparkles,
  User,
  Heart
} from 'lucide-react';

const Notices = () => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Notice Creation Form State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newType, setNewType] = useState('General'); // 'General' | 'Safety' | 'Event' | 'Holiday'
  const [submitting, setSubmitting] = useState(false);

  // Fetch Notices
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/notices`);
      if (res.data && res.data.success) {
        setNotices(res.data.data);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError('Could not retrieve notices. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Submit Notice (Admin only)
  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/notices`,
        { title: newTitle, message: newMessage, type: newType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.success) {
        setNewTitle('');
        setNewMessage('');
        setNewType('General');
        setShowCreateForm(false);
        // Refresh list
        fetchNotices();
      }
    } catch (err) {
      console.error('Error creating notice:', err);
      setError(err.response?.data?.message || 'Failed to create notice');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for type-based color badges
  const getTypeBadgeStyles = (type) => {
    switch (type) {
      case 'Safety':
        return 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30';
      case 'Holiday':
        return 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30';
      case 'Event':
        return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30';
      default:
        return 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-500 font-sans selection:bg-primary/30 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 dark:bg-violet-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-secondary/5 dark:bg-rose-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-violet-400 transition-colors mb-4">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Megaphone className="text-primary dark:text-violet-400 animate-bounce" />
              Official Notice Board
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 font-medium">
              School alerts, general notices, calendars, and safety protocols.
            </p>
          </div>

          {/* Admin Publish Control */}
          {user && user.role === 'admin' && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-5 py-3 rounded-2xl bg-primary hover:bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-primary/25 hover:scale-[1.03] active:scale-97 transition-all duration-300 flex items-center gap-2"
            >
              <Plus size={18} />
              {showCreateForm ? 'Cancel Publish' : 'Publish Notice'}
            </button>
          )}
        </div>

        {/* Create Notice Block */}
        {showCreateForm && user && user.role === 'admin' && (
          <div className="mb-10 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-[2rem] shadow-xl p-6 sm:p-8 backdrop-blur-md animate-slide-up">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              Publish New Board Notice
            </h3>
            
            <form onSubmit={handleCreateNotice} className="space-y-5">
              <div className="grid sm:grid-cols-3 gap-5">
                {/* Title input */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Notice Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter short, descriptive title"
                    className="w-full px-4 py-3 text-sm bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white"
                  />
                </div>

                {/* Type select */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Notice Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white"
                  >
                    <option value="General">✉ General Info</option>
                    <option value="Safety">🚨 Safety Alert</option>
                    <option value="Event">📅 School Event</option>
                    <option value="Holiday">🎉 School Holiday</option>
                  </select>
                </div>
              </div>

              {/* Message text area */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Message Details</label>
                <textarea
                  required
                  rows="4"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Provide comprehensive details of the notice..."
                  className="w-full px-4 py-3 text-sm bg-slate-55 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-primary dark:hover:bg-primary text-white font-bold text-sm transition-all active:scale-97 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Broadcast Notice'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notices Cards List */}
        {error && (
          <div className="p-4 mb-8 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/50 rounded-2xl text-sm font-semibold flex items-center gap-2">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="animate-spin text-primary" size={36} />
            <span className="text-sm font-bold tracking-wider uppercase">Loading notices...</span>
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-[2.5rem] p-12 text-center text-slate-400 shadow-xl">
            <Megaphone size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No notices broadcasted yet</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto font-medium">Check back here later for official announcements and safety drills updates.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {notices.map((notice) => (
              <div 
                key={notice._id}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-[2rem] shadow-lg p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-primary/20 dark:hover:border-violet-500/20 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Visual glow on card hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-[4rem] group-hover:scale-110 transition-transform duration-500" />
                
                <div className="space-y-4">
                  {/* Category Type Badge */}
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${getTypeBadgeStyles(notice.type)}`}>
                      {notice.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(notice.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Title & Message */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-primary dark:group-hover:text-violet-400 transition-colors">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                      {notice.message}
                    </p>
                  </div>
                </div>

                {/* Footer details */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850/60 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <User size={13} className="text-slate-300 dark:text-slate-600" />
                    By: Admin
                  </span>
                  <span className="flex items-center gap-1 text-primary/70 dark:text-violet-400/70">
                    <Megaphone size={12} />
                    CareSync Board
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Notices;
