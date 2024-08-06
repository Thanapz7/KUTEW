const db = require("../db");

module.exports = (io, db) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('join', (userId) => {
            console.log(`User ${userId} joined`);
            socket.join(`user_${userId}`);

            // ดึงการแจ้งเตือนทั้งหมดที่ยังไม่ได้อ่านของผู้ใช้
            db.execute('SELECT message, created_at FROM notifications WHERE user_id = ? ', [userId], (err, results) => {
                if (err) {
                    console.error(err);
                    return;
                }

                results.forEach(notification => {
                    socket.emit('notification', {
                        message: notification.message,
                        created_at: notification.created_at
                    });
                });
            });

            // Poll การแจ้งเตือนใหม่ทุกๆ 5 วินาที
            const pollInterval = setInterval(() => {
                db.execute('SELECT message, created_at FROM notifications WHERE user_id = ? AND created_at > ? ', [userId, new Date()], (err, results) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    results.forEach(notification => {
                        socket.emit('notification', {
                            message: notification.message,
                            created_at: notification.created_at
                        });
                    });
                });
            }, 5000); // Poll ทุกๆ 5 วินาที

            socket.on('disconnect', () => {
                console.log('Client disconnected');
                clearInterval(pollInterval); // หยุด polling เมื่อ client ตัดการเชื่อมต่อ
            });
        });
    });
};
