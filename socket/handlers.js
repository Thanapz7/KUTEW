module.exports = (io, socket, db) => {
  // Handle joining a chat group
  socket.on('join group', async (groupId) => {
    try {
      const result = await db.execute('SELECT id FROM chat_groups WHERE id = ?', [groupId]);
      const groupRows = result && result[0] ? result[0] : [];
      if (groupRows.length > 0) {
        socket.join(groupId);
        const query = `
          SELECT m.*, u.username 
          FROM messages m
          JOIN users u ON m.user_id = u.id
          WHERE m.group_id = ?
        `;
        const messagesResult = await db.execute(query, [groupId]);
        const messages = messagesResult && messagesResult[0] ? messagesResult[0] : [];
        socket.emit('load messages', messages);
      } else {
        socket.emit('error', 'Invalid group ID');
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Handle sending a chat message
  socket.on('chat message', async ({ groupId, userId, msg }) => {
    try {
      console.log('Received chat message:', { groupId, userId, msg }); // เพิ่มการดีบัก
      const result = await db.execute('SELECT id FROM chat_groups WHERE id = ?', [groupId]);
      const groupRows = result && result[0] ? result[0] : [];
      if (groupRows.length > 0) {
        const query = 'INSERT INTO messages (group_id, user_id, content) VALUES (?, ?, ?)';
        await db.execute(query, [groupId, userId, msg]);
  
        // ดึงข้อมูลผู้ใช้
        const userResult = await db.execute('SELECT username FROM users WHERE id = ?', [userId]);
        const userRows = userResult && userResult[0] ? userResult[0] : [];
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

  // Handle sending a file message
  socket.on('file message', async ({ groupId, userId, file, filename, filetype }) => {
    try {
      const result = await db.execute('SELECT id FROM chat_groups WHERE id = ?', [groupId]);
      const groupRows = result && result[0] ? result[0] : [];
      if (groupRows.length > 0) {
        const query = 'INSERT INTO messages (group_id, user_id, content, filetype) VALUES (?, ?, ?, ?)';
        await db.execute(query, [groupId, userId, file, filetype]);

        // ดึงข้อมูลผู้ใช้
        const userResult = await db.execute('SELECT username FROM users WHERE id = ?', [userId]);
        const userRows = userResult && userResult[0] ? userResult[0] : [];

        if (userRows.length > 0) {
          const username = userRows[0].username;
          io.to(groupId).emit('file message', { userId, username, file, filename, filetype });
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
};
