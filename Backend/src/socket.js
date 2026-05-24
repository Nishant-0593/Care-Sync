const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');

const onlineUsers = new Map(); 

const initializeSocket = (io) => {
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
        
        socket.join(userId);
        
        const currentSockets = onlineUsers.get(userId) || 0;
        onlineUsers.set(userId, currentSockets + 1);
        
        if (currentSockets === 0) {
            io.emit('user_status', { userId, status: 'online' });
        }

        socket.on('send_message', async (data, callback) => {
            try {
                const { receiverId, content } = data;
                
                const message = await Message.create({
                    sender: userId,
                    receiver: receiverId,
                    content
                });

               
                await message.populate('sender', 'name');      
                io.to(receiverId).emit('receive_message', message);
                if (callback) callback({ success: true, message });
            } catch (error) {
                if (callback) callback({ success: false, error: error.message });
            }
        });

        
        socket.on('check_status', (data, callback) => {
            const status = onlineUsers.has(data.userId) ? 'online' : 'offline';
            if (callback) callback({ userId: data.userId, status });
        });

        
        socket.on('disconnect', () => {
            const remainingSockets = onlineUsers.get(userId) - 1;
            if (remainingSockets <= 0) {
                onlineUsers.delete(userId);
                
                io.emit('user_status', { userId, status: 'offline' });
            } else {
                onlineUsers.set(userId, remainingSockets);
            }
        });
    });
};

module.exports = initializeSocket;
