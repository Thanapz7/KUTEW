const db = require("../db");

// เส้นทางสำหรับสร้างการแจ้งเตือน
exports.InsertNotifications = async (req, res, io) => {
  const { message, user_id } = req.body;

  try {
      if (!message || !user_id) {
          return res.status(400).send('Missing required fields');
      }

      const query = 'INSERT INTO notifications (message, user_id) VALUES (?, ?)';
      const [result] = await db.promise().query(query, [message, user_id]);

      // ใช้ io ที่ส่งเข้ามา
      io.emit('notification', { 
          notification_id: result.insertId, 
          message, 
          user_id,
          created_at: new Date().toISOString() 
      });

      res.status(201).send('Notification created');
  } catch (err) {
      console.error('Error creating notification:', err);
      res.status(500).send('Error creating notification');
  }
};



