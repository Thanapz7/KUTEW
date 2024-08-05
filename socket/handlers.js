module.exports = (io, socket, db) => {
    // เมื่อผู้ใช้เข้าร่วมกลุ่มแชท
    socket.on('join group', async (groupId) => {
     const [groupRows] = await db.execute('SELECT id FROM chat_groups WHERE id = ?', [groupId]);
     if (groupRows.length > 0) {
       socket.join(groupId);
       const query = `
          SELECT m.*, u.username 
          FROM messages m
          JOIN users u ON m.user_id = u.id
          WHERE m.group_id = ?
        `;
       const [messages] = await db.execute(query, [groupId]);
       socket.emit('load messages', messages);
     } else {
       socket.emit('error', 'Invalid group ID');
     }
   });
   
   // เมื่อมีการส่งข้อความแชทในกลุ่ม
   socket.on('chat message', async ({ groupId, userId, msg }) => {
     try {
       console.log('Received chat message:', { groupId, userId, msg }); // เพิ่มการดีบัก
       const [groupRows] = await db.execute('SELECT id FROM chat_groups WHERE id = ?', [groupId]);
       if (groupRows.length > 0) {
         const query = 'INSERT INTO messages (group_id, user_id, content) VALUES (?, ?, ?)';
         await db.execute(query, [groupId, userId, msg]);
   
         // ดึงข้อมูลผู้ใช้
         const [userRows] = await db.execute('SELECT username FROM users WHERE id = ?', [userId]);
         if (userRows.length > 0) {
           const username = userRows[0].username;
           io.to(groupId).emit('chat message', { userId, username, msg });
         } else {
           console.error('User not found:', userId);
         }
       } else {
         socket.emit('error', 'Invalid group ID');
       }
     } catch (err) {
       console.error(err);
     }
   });
 
   // เมื่อมีการส่งไฟล์ในกลุ่มแชท
   socket.on('file message', async ({ groupId, userId, file, filename, filetype }) => {
     try {
       const [groupRows] = await db.execute('SELECT id FROM chat_groups WHERE id = ?', [groupId]);
       if (groupRows.length > 0) {
         const query = 'INSERT INTO messages (group_id, user_id, content, filetype) VALUES (?, ?, ?, ?)';
         await db.execute(query, [groupId, userId, file, filetype]);
 
         // ดึงข้อมูลผู้ใช้
         const [userRows] = await db.execute('SELECT username FROM users WHERE id = ?', [userId]);
         const username = userRows[0].username;
 
         io.to(groupId).emit('file message', { userId, username, file, filename, filetype });
       } else {
         socket.emit('error', 'Invalid group ID');
       }
     } catch (err) {
       console.error(err);
     }
   });
   };