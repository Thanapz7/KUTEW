const db = require('./db'); 

// ฟังก์ชันสำหรับบันทึกข้อมูลการเข้าชม
function recordUserActivity(req, res, next) {
    try {
        const user_id = req.session.user.user_id; // รับ user_id จาก session

        // SQL เพื่อดึงข้อมูล role ของผู้ใช้
        const checkSql = 'SELECT role FROM users WHERE user_id = ?';
        db.query(checkSql, [user_id], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send({ error: true, message: 'Database error' });
            }

            // ตรวจสอบว่าเจอผู้ใช้หรือไม่
            if (result.length === 0) {
                return res.status(404).send({ error: true, message: 'User not found' });
            }

            const role = result[0].role; // รับค่า role จากผลลัพธ์ query
            const today = new Date().toISOString().split('T')[0]; // แปลงวันที่เป็น YYYY-MM-DD

            // ตรวจสอบบทบาทของผู้ใช้
            if (role === 'tutor' || role === 'student') {
                // กำหนด SQL สำหรับการเพิ่มจำนวนผู้ใช้ตามบทบาท
                const columnToUpdate = role === 'tutor' ? 'tutor_count' : 'student_count';
                const insertSql = `INSERT INTO user_activity (date, ${columnToUpdate}) VALUES (?, 1) 
                                  ON DUPLICATE KEY UPDATE ${columnToUpdate} = ${columnToUpdate} + 1`;

                db.query(insertSql, [today], (err, result) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).send({ error: true, message: 'Database error' });
                    }

                    console.log('User activity recorded successfully:', result);
                    next(); // ดำเนินการต่อไปยัง handler ถัดไป
                });
            } else {
                // ถ้าเป็น 'admin' ไม่ต้องเพิ่มอะไร
                next(); // ดำเนินการต่อไปยัง handler ถัดไป
            }
        });
    } catch (err) {
        console.error('Error processing user activity:', err);
        res.status(500).send({ error: true, message: 'Error processing user activity' });
    }
}

module.exports = recordUserActivity;
