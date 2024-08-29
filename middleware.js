const db = require('./db'); 

// ฟังก์ชันสำหรับบันทึกข้อมูลการเข้าชม
function recordUserActivity(req, res, next) {
  const today = new Date().toISOString().split('T')[0]; // แปลงวันที่เป็น YYYY-MM-DD
  const query = 'INSERT INTO user_activity (date, user_count) VALUES (?, 1) ON DUPLICATE KEY UPDATE user_count = user_count + 1';

  db.query(query, [today], (err, result) => {
    if (err) {
      console.error('Error recording user activity:', err);
      return next(err); // ส่งต่อข้อผิดพลาดไปยัง error handler
    }
    console.log('User activity recorded');
    next(); // ดำเนินการต่อไปยัง handler ถัดไป
  });
}

module.exports = recordUserActivity;
