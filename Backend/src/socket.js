const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');

const onlineUsers = new Map(); // Map to store userId -> socketId

const initializeSocket = (io) => {
    // Middleware for authentication
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];
            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.user._id.toString();
        
        // Join a room unique to this user
        socket.join(userId);
        
        // Add to online users (we still keep track for status, but using a Set of IDs might be better)
        // For simplicity, let's just track how many sockets a user has
        const currentSockets = onlineUsers.get(userId) || 0;
        onlineUsers.set(userId, currentSockets + 1);
        
        // Broadcast that user came online if this is their first socket
        if (currentSockets === 0) {
            io.emit('user_status', { userId, status: 'online' });
        }

        // Listen for outgoing messages
        socket.on('send_message', async (data, callback) => {
            try {
                const { receiverId, content } = data;
                
                // Save message to database
                const message = await Message.create({
                    sender: userId,
                    receiver: receiverId,
                    content
                });

                // Populate sender info before broadcasting
                await message.populate('sender', 'name');

                // Deliver to receiver instantly (all their tabs)
                io.to(receiverId).emit('receive_message', message);

                // Acknowledge back to sender
                if (callback) callback({ success: true, message });
            } catch (error) {
                if (callback) callback({ success: false, error: error.message });
            }
        });

        // Check if a specific user is online
        socket.on('check_status', (data, callback) => {
            const status = onlineUsers.has(data.userId) ? 'online' : 'offline';
            if (callback) callback({ userId: data.userId, status });
        });

        // Handle disconnects
        socket.on('disconnect', () => {
            const remainingSockets = onlineUsers.get(userId) - 1;
            if (remainingSockets <= 0) {
                onlineUsers.delete(userId);
                // Broadcast offline status only if last tab closed
                io.emit('user_status', { userId, status: 'offline' });
            } else {
                onlineUsers.set(userId, remainingSockets);
            }
        });
    });
};

module.exports = initializeSocket;
