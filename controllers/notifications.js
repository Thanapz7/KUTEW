const db = require("../db");

// เส้นทางสำหรับสร้างการแจ้งเตือน
exports.InsertNotifications =  async (req, res) => {
  const { post_id, tutor_id, student_id, message, user_id } = req.body;
  
  try {
    const query = 'INSERT INTO notifications (post_id, tutor_id, student_id, message, user_id) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [post_id, tutor_id, student_id, message, user_id]);

    // ส่งการแจ้งเตือนไปยังผู้ใช้ผ่าน Socket.IO
    req.io.emit('notification', { notification_id: result.insertId, post_id, tutor_id, student_id, message, user_id, created_at: new Date() });

    res.status(201).send('Notification created');
  } catch (err) {
    res.status(500).send('Error creating notification');
    console.error(err);
  }
};

