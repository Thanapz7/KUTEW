const db = require("../db");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './payment/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(new Error('Only images are allowed'));
        }
        cb(null, true);
    }
}).fields([
    { name: 'paymentPic', maxCount: 1 },
]);

//เมื่อstudentกดjoin
// exports.insertJoin = async (req, res) => {
//     // ตรวจสอบว่ามี session และ user ใน session หรือไม่
//     if (!req.session || !req.session.user) {
//       return res.status(401).json({ message: 'User not authenticated' });
//     }
  
//     const post_id = req.params.id; // ดึง post_id จาก URL
//     // const { user_id } = req.body; // ดึง user_id จาก request body
//      const user_id = req.session.user.user_id; // ดึง user_id จาก session
  
//     // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
//     db.query('SELECT * FROM users WHERE user_id = ?', [user_id], (err, userResult) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Internal Server Error' });
//       }
  
//       if (userResult.length === 0) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // ตรวจสอบว่าโพสต์มีอยู่หรือไม่
//       db.query('SELECT * FROM posts WHERE post_id = ?', [post_id], (err, postResult) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ message: 'Internal Server Error' });
//         }
  
//         if (postResult.length === 0) {
//           return res.status(404).json({ message: 'Post not found' });
//         }
  
//         // ค้นหา student_id จาก user_id
//         db.query('SELECT student_id FROM students WHERE user_id = ?', [user_id], (err, studentResult) => {
//           if (err) {
//             console.error(err);
//             return res.status(500).json({ message: 'Internal Server Error' });
//           }
  
//           if (studentResult.length === 0) {
//             return res.status(404).json({ message: 'Student not found' });
//           }
  
//           const student_id = studentResult[0].student_id;
  
//           // ค้นหา tutor_id จาก post_id
//           db.query('SELECT tutor_id FROM tutors WHERE user_id = (SELECT user_id FROM posts WHERE post_id = ?)', [post_id], (err, tutorResult) => {
//             if (err) {
//               console.error(err);
//               return res.status(500).json({ message: 'Internal Server Error' });
//             }
  
//             if (tutorResult.length === 0) {
//               return res.status(404).json({ message: 'Tutor not found' });
//             }
  
//             const tutor_id = tutorResult[0].tutor_id;
  
//             // Insert ลงในตาราง joins
//             db.query('INSERT INTO joins (post_id, student_id, join_date, tutor_id) VALUES (?, ?, CURRENT_TIMESTAMP, ?)', [post_id, student_id, tutor_id], (err, joinResult) => {
//               if (err) {
//                 console.error(err);
//                 return res.status(500).json({ message: 'Internal Server Error' });
//               }
  
//               res.status(200).json({ message: 'Joined post successfully', data: joinResult });
//             });
//           });
//         });
//       });
//     });
//   };

//test
//เมื่อstudentกดjoin
exports.insertJoin = async (req, res) => {
  // ตรวจสอบว่ามี session และ user ใน session หรือไม่
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const post_id = req.params.id; // ดึง post_id จาก URL
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

        // ตรวจสอบว่ามีการเข้าร่วมโพสต์นี้แล้วหรือไม่
        db.query('SELECT * FROM joins WHERE post_id = ? AND student_id = ?', [post_id, student_id], (err, joinResult) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
          }

          if (joinResult.length > 0) {
            return res.status(400).json({ message: 'Student already joined this post' });
          }

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
  });
};


  //หาstudentในjoin
  exports.getJoin = async (req, res) => {
    const post_id = req.params.id;
    const query = `
        SELECT joins.*, students.student_id AS student_id, students.name AS student_name, students.profilePic AS student_profilePic
        FROM joins
        INNER JOIN students ON joins.student_id = students.student_id
        WHERE joins.post_id = ?
    `;
    db.query(query, [post_id], (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            res.status(500).json({ error: 'Failed to fetch posts' });
            return;
        }
        res.status(200).json({ message: 'Get student in join successfully', data: results });
    });
};

//ใส่Acceptเมื่อยอมรับ
exports.updateJoinAccept = async (req, res) => {
    const post_id = req.params.id;
    const query = `
        UPDATE joins SET join_status = ?
        WHERE post_id = ?
    `;
    db.query(query, ['Accept', post_id], (err, results) => {
        if (err) {
            console.error('Error updating join:', err);
            res.status(500).json({ error: 'Failed to update join' });
            return;
        }
        res.status(200).json({ message: 'Update join status successfully'});
    });
};

//ใส่Denyเมื่อปฎิเสธ
exports.updateJoinDeny = async (req, res) => {
  const post_id = req.params.id;
  const query = `
      UPDATE joins SET join_status = ?
      WHERE post_id = ?
  `;
  db.query(query, ['Deny', post_id], (err, results) => {
      if (err) {
          console.error('Error updating join:', err);
          res.status(500).json({ error: 'Failed to update join' });
          return;
      }
      res.status(200).json({ message: 'Update join status successfully'});
  });
};

// เมื่อจ่ายตัง (payment)
exports.updateJoinPayment = async (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // ตรวจสอบว่าไฟล์ที่อัปโหลดมีอยู่หรือไม่
        if (!req.files['paymentPic']) {
            return res.status(400).json({ error: 'Payment picture is required' });
        }

        const paymentPic = req.files['paymentPic'][0].path;

        // ตรวจสอบว่า req.params.id มีอยู่หรือไม่
        const join_id = req.params.id;
        if (!join_id) {
            return res.status(400).json({ error: 'Join ID is required' });
        }

        // ใช้คำสั่ง UPDATE เพื่ออัปเดตข้อมูลในตาราง joins
        const sql = 'UPDATE joins SET paymentPic = ?, payment_date = CURRENT_TIMESTAMP WHERE join_id = ?';
        db.query(sql, [paymentPic, join_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Payment picture updated successfully' });
        });
    });
};

// ตรวจสอบสถานะการเข้าร่วม
exports.checkJoinStatus = async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const post_id = req.params.id;
  const user_id = req.session.user.user_id;

  db.query('SELECT student_id FROM students WHERE user_id = ?', [user_id], (err, studentResult) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (studentResult.length === 0) {
          return res.status(404).json({ message: 'Student not found' });
      }

      const student_id = studentResult[0].student_id;

      db.query('SELECT * FROM joins WHERE post_id = ? AND student_id = ?', [post_id, student_id], (err, joinResult) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Internal Server Error' });
          }

          if (joinResult.length > 0) {
              return res.status(200).json({ joined: true });
          } else {
              return res.status(200).json({ joined: false });
          }
      });
  });
};
