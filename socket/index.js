const db = require("../db");

module.exports = (io, db) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('join', (userId) => {
            
            console.log(`User ${userId} joined`);
            socket.join(`user_${userId}`);

            // ดึงการแจ้งเตือนทั้งหมดที่ยังไม่ได้อ่านของผู้ใช้
            db.execute('SELECT message, created_at FROM notifications WHERE user_id = ?', [userId], (err, results) => {
                if (err) {
                    console.error(err);
                    return;
                }

                // ส่งการแจ้งเตือนทั้งหมดไปยังผู้ใช้
                results.forEach(notification => {
                    socket.emit('notification', {
                        message: notification.message,
                        created_at: notification.created_at
                    });
                });
            });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};
