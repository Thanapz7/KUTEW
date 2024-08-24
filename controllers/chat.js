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
  
  