const db = require("../db");

exports.insertJoin = async (req, res) => {
    // ตรวจสอบว่ามี session และ user ใน session หรือไม่
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
  
    const post_id = req.params.id; // ดึง post_id จาก URL
    // const { user_id } = req.body; // ดึง user_id จาก request body
     const user_id = req.session.user.user_id; // ดึง user_id จาก session
  
    // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
    db.query('SELECT * FROM users WHERE user_id = ?', [user_id], (err, userResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  
      if (userResult.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // ตรวจสอบว่าโพสต์มีอยู่หรือไม่
      db.query('SELECT * FROM posts WHERE post_id = ?', [post_id], (err, postResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
  
        if (postResult.length === 0) {
          return res.status(404).json({ message: 'Post not found' });
        }
  
        // ค้นหา student_id จาก user_id
        db.query('SELECT student_id FROM students WHERE user_id = ?', [user_id], (err, studentResult) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
          }
  
          if (studentResult.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
          }
  
          const student_id = studentResult[0].student_id;
  
          // ค้นหา tutor_id จาก post_id
          db.query('SELECT tutor_id FROM tutors WHERE user_id = (SELECT user_id FROM posts WHERE post_id = ?)', [post_id], (err, tutorResult) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Internal Server Error' });
            }
  
            if (tutorResult.length === 0) {
              return res.status(404).json({ message: 'Tutor not found' });
            }
  
            const tutor_id = tutorResult[0].tutor_id;
  
            // Insert ลงในตาราง joins
            db.query('INSERT INTO joins (post_id, student_id, join_date, tutor_id) VALUES (?, ?, CURRENT_TIMESTAMP, ?)', [post_id, student_id, tutor_id], (err, joinResult) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal Server Error' });
              }
  
              res.status(200).json({ message: 'Joined post successfully', data: joinResult });
            });
          });
        });
      });
    });
  };