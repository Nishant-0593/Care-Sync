import { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { Send, User as UserIcon, Search, MessageSquare, Circle, UserPlus, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const Chat = () => {
    const { user } = useContext(AuthContext);
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const targetUserId = queryParams.get('userId');
    
    const socketRef = useRef(null);
    const selectedContactRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Keep ref in sync with state
    useEffect(() => {
        selectedContactRef.current = selectedContact;
    }, [selectedContact]);

    // Fetch contacts
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await axios.get(`${API_URL}/messages/users`);
                if (res.data.success) {
                    setContacts(res.data.data);
                    
                    // Auto-select if userId is in URL
                    if (targetUserId) {
                        const target = res.data.data.find(c => c._id === targetUserId);
                        if (target) {
                            setSelectedContact(target);
                        } else {
                            // If not in contacts, search and add them (Syllabus: Deep diving into auth/contacts)
                            try {
                                const userRes = await axios.get(`${API_URL}/messages/search?q=${targetUserId}`);
                                if (userRes.data.success && userRes.data.data.length > 0) {
                                    const foundUser = userRes.data.data[0];
                                    await axios.post(`${API_URL}/messages/contacts/${foundUser._id}`);
                                    setContacts(prev => [...prev, foundUser]);
                                    setSelectedContact(foundUser);
                                }
                            } catch (e) {
                                console.error('Auto-add contact error:', e);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };
        fetchContacts();
    }, [targetUserId]);

    // Socket connection
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Derive socket URL from API_URL (strip /api)
        const socketUrl = API_URL.replace('/api', '');
        const newSocket = io(socketUrl, {
            auth: { token }
        });

        newSocket.on('connect', () => {
            console.log('Connected to chat server');
        });

        newSocket.on('receive_message', (message) => {
            const currentSelected = selectedContactRef.current;
            // Only add message if it's from the selected contact
            const senderId = message.sender._id || message.sender;
            if (currentSelected && senderId === currentSelected._id) {
                setMessages((prev) => [...prev, message]);
            } else {
                console.log('New message from another user', message);
            }
        });

        newSocket.on('user_status', ({ userId, status }) => {
            setOnlineUsers((prev) => {
                const next = new Set(prev);
                if (status === 'online') next.add(userId);
                else next.delete(userId);
                return next;
            });
        });

        socketRef.current = newSocket;

        return () => {
            if (newSocket) newSocket.close();
        };
    }, []); // Initialize only once

    // Fetch conversation history when selected contact changes
    useEffect(() => {
        if (!selectedContact) return;

        const fetchMessages = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/messages/${selectedContact._id}`);
                if (res.data.success) {
                    setMessages(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
        
        // Check online status of selected contact
        if (socketRef.current) {
            socketRef.current.emit('check_status', { userId: selectedContact._id }, (res) => {
                if (res.status === 'online') {
                    setOnlineUsers(prev => new Set(prev).add(res.userId));
                }
            });
        }

    }, [selectedContact]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !socketRef.current || !selectedContact) return;

        const messageData = {
            receiverId: selectedContact._id,
            content: input
        };

        socketRef.current.emit('send_message', messageData, (response) => {
            if (response.success) {
                setMessages((prev) => [...prev, response.message]);
                setInput('');
            }
        });
    };

    const filteredContacts = contacts.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearch = async (val) => {
        setSearchTerm(val);
        if (!val.trim()) {
            setSearchResults([]);
            setSearching(false);
            return;
        }

        setSearching(true);
        try {
            const res = await axios.get(`${API_URL}/messages/search?q=${val}`);
            if (res.data.success) {
                setSearchResults(res.data.data);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearching(false);
        }
    };

    const addContactToDB = async (userId) => {
        try {
            const res = await axios.post(`${API_URL}/messages/contacts/${userId}`);
            if (res.data.success) {
                // Refresh contacts
                const contactsRes = await axios.get(`${API_URL}/messages/users`);
                setContacts(contactsRes.data.data);
                setShowSearch(false);
                setSearchTerm('');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding contact');
        }
    };

    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 flex max-w-[1400px] w-full mx-auto overflow-hidden">
                
                {/* Sidebar - Contacts */}
                <div className="w-full sm:w-80 md:w-96 bg-white border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-xl font-bold text-slate-800">Messages</h1>
                            <button 
                                onClick={() => {
                                    setShowSearch(!showSearch);
                                    setSearchTerm('');
                                    setSearchResults([]);
                                }}
                                className={`p-2 rounded-xl transition-all ${showSearch ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {showSearch ? <X size={20} /> : <UserPlus size={20} />}
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text"
                                placeholder={showSearch ? "Search people to add..." : "Search contacts..."}
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                value={searchTerm}
                                onChange={(e) => showSearch ? handleSearch(e.target.value) : setSearchTerm(e.target.value)}
                            />
                        </div>
                        {!showSearch && (
                            <p className="text-[10px] text-slate-400 mt-2 ml-1">
                                Tip: Click the <span className="font-bold">+</span> icon to find new teachers/parents.
                            </p>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {showSearch ? (
                            <div className="space-y-1">
                                <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Results</div>
                                {searching ? (
                                    <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={24} /></div>
                                ) : searchResults.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400 text-sm">No users found</div>
                                ) : (
                                    searchResults.map(result => (
                                        <div key={result._id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-300">
                                                    {result.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{result.name}</div>
                                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase">{result.role}</div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => addContactToDB(result._id)}
                                                className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                                                title="Add to contacts"
                                            >
                                                <UserPlus size={18} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                <MessageSquare className="mx-auto mb-2 opacity-20" size={40} />
                                <p className="text-sm">No contacts found</p>
                            </div>
                        ) : (
                            <div className="space-y-6 py-4">
                                {/* Teachers Section */}
                                {filteredContacts.some(c => c.role === 'teacher') && (
                                    <div>
                                        <div className="px-4 mb-2 flex items-center gap-2">
                                            <div className="h-px flex-1 bg-slate-100"></div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                {user?.role === 'admin' ? 'School Teachers' : 'Your Teachers'}
                                            </span>
                                            <div className="h-px flex-1 bg-slate-100"></div>
                                        </div>
                                        {filteredContacts.filter(c => c.role === 'teacher').map(contact => (
                                            <ContactItem 
                                                key={contact._id} 
                                                contact={contact} 
                                                selectedContact={selectedContact} 
                                                setSelectedContact={setSelectedContact} 
                                                onlineUsers={onlineUsers} 
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Admin Section */}
                                {filteredContacts.some(c => c.role === 'admin') && (
                                    <div>
                                        <div className="px-4 mb-2 flex items-center gap-2">
                                            <div className="h-px flex-1 bg-slate-100"></div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">School Admin</span>
                                            <div className="h-px flex-1 bg-slate-100"></div>
                                        </div>
                                        {filteredContacts.filter(c => c.role === 'admin').map(contact => (
                                            <ContactItem 
                                                key={contact._id} 
                                                contact={contact} 
                                                selectedContact={selectedContact} 
                                                setSelectedContact={setSelectedContact} 
                                                onlineUsers={onlineUsers} 
                                            />
                                        ))}
                                    </div>
                                )}
                                
                                {/* Others (if any) */}
                                {filteredContacts.some(c => c.role !== 'teacher' && c.role !== 'admin') && (
                                    <div>
                                        <div className="px-4 mb-2 flex items-center gap-2">
                                            <div className="h-px flex-1 bg-slate-100"></div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                {user?.role === 'admin' ? 'School Parents' : (user?.role === 'teacher' ? 'Your Parents' : 'Other Contacts')}
                                            </span>
                                            <div className="h-px flex-1 bg-slate-100"></div>
                                        </div>
                                        {filteredContacts.filter(c => c.role !== 'teacher' && c.role !== 'admin').map(contact => (
                                            <ContactItem 
                                                key={contact._id} 
                                                contact={contact} 
                                                selectedContact={selectedContact} 
                                                setSelectedContact={setSelectedContact} 
                                                onlineUsers={onlineUsers} 
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedContact ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                        selectedContact.role === 'admin' ? 'bg-rose-500' : selectedContact.role === 'teacher' ? 'bg-indigo-500' : 'bg-emerald-500'
                                    }`}>
                                        {selectedContact.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-slate-800 leading-tight">{selectedContact.name}</h2>
                                        <div className="flex items-center gap-1.5">
                                            <Circle size={8} fill={onlineUsers.has(selectedContact._id) ? "currentColor" : "none"} className={onlineUsers.has(selectedContact._id) ? "text-emerald-500" : "text-slate-300"} />
                                            <span className={`text-xs font-medium ${onlineUsers.has(selectedContact._id) ? "text-emerald-500" : "text-slate-400"}`}>
                                                {onlineUsers.has(selectedContact._id) ? 'Online' : 'Offline'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-4">
                                {loading ? (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                        <MessageSquare size={48} className="mb-2 opacity-10" />
                                        <p>No messages yet. Send a greeting!</p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const senderId = msg.sender?._id || msg.sender;
                                        const isMe = senderId === user?.id || senderId === user?._id;
                                        return (
                                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] group`}>
                                                    <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm transition-all ${
                                                        isMe 
                                                        ? 'bg-primary text-white rounded-tr-none' 
                                                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                                                    }`}>
                                                        {msg.content}
                                                    </div>
                                                    <p className={`text-[10px] mt-1 text-slate-400 ${isMe ? 'text-right' : 'text-left'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-4 border-t border-slate-100">
                                <form onSubmit={sendMessage} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={`Message ${selectedContact.name}...`}
                                        className="flex-1 bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!input.trim()}
                                        className="bg-primary text-white p-3 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
                                <MessageSquare size={32} className="text-primary/40" />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-800">Select a conversation</h2>
                            <p className="text-sm max-w-xs text-center mt-1">
                                Choose a contact from the sidebar to start chatting with teachers or parents.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const ContactItem = ({ contact, selectedContact, setSelectedContact, onlineUsers }) => (
    <div 
        onClick={() => setSelectedContact(contact)}
        className={`p-4 flex items-center gap-3 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800 ${
            selectedContact?._id === contact._id ? 'bg-indigo-50/50 dark:bg-indigo-900/30 border-r-4 border-primary' : ''
        }`}
    >
        <div className="relative">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                contact.role === 'admin' ? 'bg-rose-500' : contact.role === 'teacher' ? 'bg-indigo-500' : 'bg-emerald-500'
            }`}>
                {contact.name.charAt(0).toUpperCase()}
            </div>
            {onlineUsers.has(contact._id) && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
            )}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{contact.name}</h3>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                    {contact.role}
                </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {onlineUsers.has(contact._id) ? 'Online' : 'Offline'}
            </p>
        </div>
    </div>
);

export default Chat;
