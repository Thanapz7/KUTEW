const db = require("../db");

// เส้นทางสำหรับสร้างการแจ้งเตือน
exports.InsertNotifications = async (req, res) => {
  const { post_id, tutor_id, student_id, message, user_id, join_id } = req.body;
  
  try {
    if (!message || !user_id) {
      return res.status(400).send('Missing required fields');
    }

    const query = 'INSERT INTO notifications (post_id, tutor_id, student_id, message, user_id, join_id ) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.promise().query(query, [post_id, tutor_id, student_id, message, user_id, join_id ]);

    req.io.emit('notification', { 
      notification_id: result.insertId, 
      post_id, 
      tutor_id, 
      student_id, 
      message, 
      user_id,
      join_id, 
      created_at: new Date().toISOString() 
    });

    res.status(201).send('Notification created');
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).send('Error creating notification');
  }
};


