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
        addMembersToGroup(groupId, userId, tutor_id, res);
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
          addMembersToGroup(groupId, userId, tutor_id, res);
        });
      }
    });
  };
  
  function addMembersToGroup(groupId, userId, tutor_id, res) {
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
  