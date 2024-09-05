const db = require("../db");

  // เส้นทางสำหรับดึงข้อมูลกลุ่มแชท
  exports.GetGroup = async (req, res) => {
    if (!req.session.user || !req.session.user.user_id) {
      return res.status(401).send('Unauthorized');
    }
  
    const userId = req.session.user.user_id;
    const sql = `
      SELECT cg.id, cg.name 
      FROM chat_groups cg
      JOIN group_members gm ON cg.id = gm.group_id
      WHERE gm.user_id = ?
    `;
  
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching groups:', err);
        return res.status(500).send({ message: 'Failed to fetch groups' });
      }
  
      res.json(results);
    });
  };
  
  //เพิ่มทั้งกลุ่มและสมาชิกในครั้งเดียว
exports.CreateChatGroupWithMembers = async (req, res) => {
  //const { tutor_id, userId ,post_id} = req.body;
    const tutor_id = req.params.tutor_id;
    const userId = req.session.user.user_id;
    const post_id = req.params.post_id;
  
    const sqlCheckGroup = `
      SELECT id FROM chat_groups 
      WHERE tutor_id = ? AND post_id = ?
    `;
  
    db.query(sqlCheckGroup, [tutor_id, post_id], (err, groupResults) => {
      if (err) {
        console.error('Error checking existing chat group:', err);
        return res.status(500).send({ message: 'Failed to check existing chat group' });
      }
  
      let groupId;
      if (groupResults.length > 0) {
        groupId = groupResults[0].id;
        addMembersToGroupForTutor(groupId, userId, tutor_id, res);
      } else {
        const sqlInsertGroup = `
          INSERT INTO chat_groups (name, tutor_id, post_id)
          VALUES (
            (SELECT name FROM tutors WHERE tutor_id = ?), 
            ?, ?
          );
        `;
  
        db.query(sqlInsertGroup, [tutor_id, tutor_id, post_id], (err, insertResults) => {
          if (err) {
            console.error('Error adding chat group:', err);
            return res.status(500).send({ message: 'Failed to add chat group' });
          }
  
          groupId = insertResults.insertId;
          addMembersToGroupForTutor(groupId, userId, tutor_id, res);
        });
      }
    });
  };
  
  function addMembersToGroupForTutor(groupId, userId, tutor_id, res) {
    // ฟังก์ชันตรวจสอบและเพิ่มสมาชิก
    const addMember = (groupId, user_id, res, callback) => {
      const sqlCheckMember = `
        SELECT * FROM group_members WHERE group_id = ? AND user_id = ?
      `;
      db.query(sqlCheckMember, [groupId, user_id], (err, memberResults) => {
        if (err) {
          console.error('Error checking group member:', err);
          return res.status(500).send({ message: 'Failed to check group member' });
        }
        
        if (memberResults.length === 0) {
          const sqlInsertMember = `
            INSERT INTO group_members (group_id, user_id)
            VALUES (?, ?)
          `;
          db.query(sqlInsertMember, [groupId, user_id], (err) => {
            if (err) {
              console.error('Error adding group member:', err);
              return res.status(500).send({ message: 'Failed to add group member' });
            }
            callback();
          });
        } else {
          callback();
        }
      });
    };
  
    // เรียกใช้ฟังก์ชันเพื่อเพิ่ม user และ tutor
    addMember(groupId, userId, res, () => {
      const tutorUserIdQuery = `SELECT user_id FROM tutors WHERE tutor_id = ?`;
      db.query(tutorUserIdQuery, [tutor_id], (err, results) => {
        if (err) {
          console.error('Error fetching tutor user_id:', err);
          return res.status(500).send({ message: 'Failed to fetch tutor user_id' });
        }
        
        const tutorUserId = results[0].user_id;
        addMember(groupId, tutorUserId, res, () => {
          res.json({ message: 'Chat group and members added successfully', groupId });
        });
      });
    });
  }
  
//เพิ่มทั้งกลุ่มและสมาชิกในครั้งเดียว สำหรับadmin
exports.CreateChatGroupWithAdmin = async (req, res) => {
  const admin_id = process.env.ADMIN_ID; 
  const userId = req.session.user.user_id;
  //const {userId} = req.body;

  const sqlInsertGroup = `
    INSERT INTO chat_groups (name)
    VALUES (
      CONCAT('admin-', (SELECT username FROM users WHERE user_id = ?))
    );
  `;

  db.query(sqlInsertGroup, [userId], (err, insertResults) => {
    if (err) {
      console.error('Error adding chat group:', err);
      return res.status(500).send({ message: 'Failed to add chat group' });
    }

    const groupId = insertResults.insertId;
    addMembersToGroupForAdmin(groupId, userId, admin_id, res);
  });
};

function addMembersToGroupForAdmin(groupId, userId, admin_id, res) {
  const addMember = (groupId, user_id, res, callback) => {
    const sqlCheckMember = `
      SELECT * FROM group_members WHERE group_id = ? AND user_id = ?
    `;
    db.query(sqlCheckMember, [groupId, user_id], (err, memberResults) => {
      if (err) {
        console.error('Error checking group member:', err);
        return res.status(500).send({ message: 'Failed to check group member' });
      }

      if (memberResults.length === 0) {
        const sqlInsertMember = `
          INSERT INTO group_members (group_id, user_id)
          VALUES (?, ?)
        `;
        db.query(sqlInsertMember, [groupId, user_id], (err) => {
          if (err) {
            console.error('Error adding group member:', err);
            return res.status(500).send({ message: 'Failed to add group member' });
          }
          callback();
        });
      } else {
        callback();
      }
    });
  };

  // เรียกใช้ฟังก์ชันเพื่อเพิ่ม user และ admin
  addMember(groupId, userId, res, () => {
    const adminUserIdQuery = `SELECT user_id FROM users WHERE user_id = ?`;
    db.query(adminUserIdQuery, [admin_id], (err, results) => {
      if (err) {
        console.error('Error fetching admin user_id:', err);
        return res.status(500).send({ message: 'Failed to fetch admin user_id' });
      }

      const adminUserId = results[0].user_id;
      addMember(groupId, adminUserId, res, () => {
        res.json({ message: 'Chat group and members added successfully', groupId });
      });
    });
  });
}

//เพิ่มทั้งกลุ่มและสมาชิกในครั้งเดียว สำหรับadmin
exports.CreateChatGroupWithAdminForTutor = async (req, res) => {
  try {
    const admin_id = process.env.ADMIN_ID; // คุณสามารถเปลี่ยนเป็น req.params หรือค่าอื่น ๆ ตามความจำเป็น
    const tutor_id = req.params.tutor_id;

    // Query เพื่อดึง user_id ของ tutor
    const sql = `SELECT user_id FROM tutors WHERE tutor_id = ?`;
    const tutorResults = await new Promise((resolve, reject) => {
      db.query(sql, [tutor_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (tutorResults.length === 0) {
      return res.status(404).send({ message: 'Tutor not found' });
    }

    const userId = tutorResults[0].user_id;

    // Query เพื่อสร้าง Chat Group
    const sqlInsertGroup = `
      INSERT INTO chat_groups (name)
      VALUES (
        CONCAT('admin-', (SELECT username FROM users WHERE user_id = ?))
      );
    `;

    const insertResults = await new Promise((resolve, reject) => {
      db.query(sqlInsertGroup, [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    const groupId = insertResults.insertId;

    // เพิ่มสมาชิกเข้า group (user และ admin)
    await addMembersToGroupForAdmin(groupId, userId, admin_id, res);
    res.json({ message: 'Chat group and members added successfully', groupId });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).send({ message: 'Failed to create chat group' });
  }
};

// ฟังก์ชันสำหรับเพิ่มสมาชิกเข้า group
async function addMembersToGroupForAdmin(groupId, userId, admin_id, res) {
  const addMember = async (groupId, user_id) => {
    const sqlCheckMember = `SELECT * FROM group_members WHERE group_id = ? AND user_id = ?`;
    const memberResults = await new Promise((resolve, reject) => {
      db.query(sqlCheckMember, [groupId, user_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (memberResults.length === 0) {
      const sqlInsertMember = `INSERT INTO group_members (group_id, user_id) VALUES (?, ?)`;
      await new Promise((resolve, reject) => {
        db.query(sqlInsertMember, [groupId, user_id], (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
  };

  // เพิ่ม tutor เข้า group
  await addMember(groupId, userId);

  // เพิ่ม admin เข้า group
  await addMember(groupId, admin_id);
}
