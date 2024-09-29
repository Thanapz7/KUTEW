const handlers = require('./handlers');

module.exports = (io, db) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        // ตรวจสอบว่ามี session และ user อยู่ใน session หรือไม่
        const session = socket.handshake.session;

        if (session && session.user) {
            const userId = session.user.user_id;
            console.log('User connected with ID:', userId);

            // Call handlers to manage the events
            handlers(io, socket, db);

            socket.on('join', () => {
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

                // Initialize last checked time for polling
                let lastCheckedTime = new Date();

                // Poll for new notifications every 5 seconds
                const pollInterval = setInterval(() => {
                    db.execute('SELECT message, created_at FROM notifications WHERE user_id = ? AND created_at > ?', [userId, lastCheckedTime], (err, results) => {
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

                        // Update lastCheckedTime to the latest notification time
                        if (results.length > 0) {
                            lastCheckedTime = results[results.length - 1].created_at;
                        }
                    });
                }, 5000); // Poll every 5 seconds

                socket.on('disconnect', () => {
                    console.log(`User ${userId} disconnected`);
                    clearInterval(pollInterval); // Stop polling when the client disconnects
                });
            });

        } else {
            console.error('User not authenticated');
            socket.emit('error', 'User not authenticated');
        }
    });
};
