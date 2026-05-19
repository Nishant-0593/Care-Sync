const Message = require('../models/Message');
const User = require('../models/User');
const Child = require('../models/Child');

// @desc    Get users for chat (contacts + child's teacher)
// @route   GET /api/messages/users
// @access  Private
exports.getChatUsers = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const currentUser = await User.findById(userId).populate('contacts', 'name email role');
        
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userRole = currentUser.role;
        let autoContacts = [];
        
        // Role-based automatic contacts
        if (userRole === 'parent') {
            const children = await Child.find({ parent: userId }).populate('teacher', 'name email role');
            autoContacts = children.map(c => c.teacher).filter(Boolean);
            const admins = await User.find({ role: 'admin' }).select('name email role');
            autoContacts = [...autoContacts, ...admins];
        } else if (userRole === 'teacher') {
            const children = await Child.find({ teacher: userId }).populate('parent', 'name email role');
            autoContacts = children.map(c => c.parent).filter(Boolean);
            const admins = await User.find({ role: 'admin' }).select('name email role');
            autoContacts = [...autoContacts, ...admins];
        } else if (userRole === 'admin') {
            // FORCE RETURN all teachers and parents for Admins to fix "No contacts found"
            const teachersAndParents = await User.find({ 
                role: { $in: ['teacher', 'parent'] },
                _id: { $ne: userId }
            }).select('name email role');
            
            console.log(`ADMIN FORCE SYNC: Found ${teachersAndParents.length} users`);
            return res.status(200).json({ 
                success: true, 
                data: teachersAndParents
            });
        }

        const allContactsMap = new Map();
        
        // Add manual contacts
        if (currentUser.contacts) {
            currentUser.contacts.forEach(c => {
                if (c && c._id) allContactsMap.set(c._id.toString(), c);
            });
        }
        
        // Add auto contacts
        autoContacts.forEach(c => {
            if (c && c._id && c._id.toString() !== userId.toString()) {
                allContactsMap.set(c._id.toString(), c);
            }
        });

        const finalContacts = Array.from(allContactsMap.values());
        res.status(200).json({ success: true, data: finalContacts });
    } catch (error) {
        console.error('getChatUsers error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search for users to add to contacts
// @route   GET /api/messages/search?q=query
// @access  Private
exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ message: 'Please provide a search query' });

        const users = await User.find({
            $and: [
                { _id: { $ne: req.user.id } },
                {
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { email: { $regex: query, $options: 'i' } },
                        { role: { $regex: query, $options: 'i' } }
                    ]
                }
            ]
        }).select('name email role');

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a user to contacts
// @route   POST /api/messages/contacts/:userId
// @access  Private
exports.addContact = async (req, res) => {
    try {
        const userToAdd = await User.findById(req.params.userId);
        if (!userToAdd) return res.status(404).json({ message: 'User not found' });

        const currentUser = await User.findById(req.user.id);
        
        // Check if already in contacts
        if (currentUser.contacts.includes(req.params.userId)) {
            return res.status(400).json({ message: 'User already in your contacts' });
        }

        currentUser.contacts.push(req.params.userId);
        await currentUser.save();

        res.status(200).json({ success: true, message: 'Contact added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get conversation history between current user and a target user
// @route   GET /api/messages/:userId
// @access  Private
exports.getConversation = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.userId;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        })
        .sort({ createdAt: 1 })
        .populate('sender', 'name')
        .populate('receiver', 'name');

        // Optional: Mark messages as read here if they were sent by the other user
        await Message.updateMany(
            { sender: otherUserId, receiver: currentUserId, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
