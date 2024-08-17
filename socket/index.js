const db = require("../db");

module.exports = (io, db) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('join', (userId) => {
            console.log(`User ${userId} joined`);
            socket.join(`user_${userId}`);

            // ดึงการแจ้งเตือนที่ยังไม่ได้อ่านทั้งหมดตั้งแต่แรก
            db.execute('SELECT message, created_at FROM notifications WHERE user_id = ? ORDER BY created_at ASC', [userId], (err, results) => {
                if (err) {
                    console.error(err);
                    return;
                }

                // ส่งการแจ้งเตือนเก่าๆ ไปให้ผู้ใช้
                results.forEach(notification => {
                    socket.emit('notification', {
                        message: notification.message,
                        created_at: notification.created_at
                    });
                });
            });

            // กำหนดเวลาเริ่มต้นสำหรับการ polling
            let lastCheckTime = new Date();

            // Poll การแจ้งเตือนใหม่ทุกๆ 5 วินาที
            const pollInterval = setInterval(() => {
                db.execute('SELECT message, created_at FROM notifications WHERE user_id = ? AND created_at > ?', [userId, lastCheckTime], (err, results) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // ส่งการแจ้งเตือนใหม่ๆ ไปให้ผู้ใช้
                    results.forEach(notification => {
                        socket.emit('notification', {
                            message: notification.message,
                            created_at: notification.created_at
                        });
                    });

                    // อัปเดตเวลาที่เช็คครั้งล่าสุด
                    lastCheckTime = new Date();
                });
            }, 1000); // Poll ทุกๆ 1 วินาที

            socket.on('disconnect', () => {
                console.log(`User ${userId} disconnected`);
                clearInterval(pollInterval); // หยุด polling เมื่อ client ตัดการเชื่อมต่อ
            });
        });
    });
};
