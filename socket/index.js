const handlers = require('./handlers');

module.exports = (io, db) => {
    io.on('connection', (socket) => {
        console.log('New client connected');
        
        // Call handlers to manage the events
        handlers(io, socket, db);

        socket.on('join', (userId) => {
            console.log(`User ${userId} joined`);
            socket.join(`user_${userId}`);
    
            // Fetch all notifications from the beginning
            db.execute('SELECT message, created_at FROM notifications WHERE user_id = ? ORDER BY created_at ASC', [userId], (err, results) => {
                if (err) {
                    console.error(err);
                    return;
                }
    
                // Emit old notifications to the user
                results.forEach(notification => {
                    socket.emit('notification', {
                        message: notification.message,
                        created_at: notification.created_at
                    });
                });
            });
    
            // Poll for new notifications every 5 seconds
            const pollInterval = setInterval(() => {
                const now = new Date();
                db.execute('SELECT message, created_at FROM notifications WHERE user_id = ? AND created_at > ?', [userId, now], (err, results) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
    
                    // Emit new notifications to the user
                    results.forEach(notification => {
                        socket.emit('notification', {
                            message: notification.message,
                            created_at: notification.created_at
                        });
                    });
                });
            }, 5000); // Poll every 5 seconds
    
            socket.on('disconnect', () => {
                console.log(`User ${userId} disconnected`);
                clearInterval(pollInterval); // Stop polling when the client disconnects
            });
        });
    });
};
