const db = require("../db");

  // เส้นทางสำหรับดึงข้อมูลกลุ่มแชท
  exports.GetGroup = async (req, res) => {
    // ตรวจสอบว่ามี session user หรือไม่
    if (!req.session.user || !req.session.user.user_id) {
      return res.status(401).send('Unauthorized');
    }
  
    const userId = req.session.user.user_id;
    const sql = 'SELECT * FROM chat_groups';
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error chat:', err);
        return res.status(500).send({ message: 'Failed chat' });
      }
  
      console.log(results);  // เปลี่ยน result เป็น results
      res.json(results);
    });
  };
  