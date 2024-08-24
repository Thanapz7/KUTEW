module.exports = (io, socket, db) => {
  // Handle joining a chat group
  socket.on('join group', (groupId, userId) => {
    try {
      if (!groupId) {
        socket.emit('error', 'Invalid group ID');
        return;
      }
      if (!userId) {
        socket.emit('error', 'User not authenticated');
        return;
      }

      // ตรวจสอบว่าผู้ใช้เป็นสมาชิกของกลุ่มหรือไม่
      const query = `
        SELECT cg.id, u.username 
        FROM chat_groups cg
        JOIN group_members gm ON cg.id = gm.group_id
        JOIN users u ON u.user_id = gm.user_id
        WHERE cg.id = ? AND gm.user_id = ?
      `;

      db.query(query, [groupId, userId], (err, groupRows) => {
        if (err) {
          console.error('Error joining group:', err);
          socket.emit('error', 'Error joining group');
          return;
        }

        if (groupRows.length > 0) {
          const username = groupRows[0].username; // ดึง username ของผู้ใช้
          socket.username = username; // เก็บ username ใน socket สำหรับใช้งานภายหลัง
          socket.join(groupId);

          const messageQuery = `
            SELECT m.*, u.username 
            FROM messages m
            JOIN users u ON m.user_id = u.user_id
            WHERE m.group_id = ?
          `;
          db.query(messageQuery, [groupId], (err, messages) => {
            if (err) {
              console.error('Error loading messages:', err);
              socket.emit('error', 'Error loading messages');
              return;
            }

            socket.emit('load messages', messages);
          });
        } else {
          socket.emit('error', 'You are not a member of this group');
        }
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      socket.emit('error', 'Unexpected error');
    }
  });

  // Handle sending a chat message
  socket.on('chat message', ({ groupId, userId, msg }) => {
    try {
      if (!groupId || !userId || !msg) {
        console.error('Invalid data:', { groupId, userId, msg });
        socket.emit('error', 'Invalid data');
        return;
      }

      console.log('Received chat message:', { groupId, userId, msg });

      const query = `
        SELECT cg.id 
        FROM chat_groups cg
        JOIN group_members gm ON cg.id = gm.group_id
        WHERE cg.id = ? AND gm.user_id = ?
      `;

      db.query(query, [groupId, userId], (err, groupRows) => {
        if (err) {
          console.error('Error finding group:', err);
          socket.emit('error', 'Error finding group');
          return;
        }

        if (groupRows.length > 0) {
          const insertQuery = 'INSERT INTO messages (user_id, group_id, content) VALUES (?, ?, ?)';
          db.query(insertQuery, [userId, groupId, msg], (err) => {
            if (err) {
              console.error('Error saving message:', err);
              socket.emit('error', 'Error saving message');
              return;
            }

            io.to(groupId).emit('chat message', { userId, username: socket.username, msg });
          });
        } else {
          socket.emit('error', 'You are not a member of this group');
        }
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      socket.emit('error', 'Unexpected error');
    }
  });

  // Handle sending a file message
  socket.on('file message', ({ groupId, userId, file, filename, filetype }) => {
    try {
      if (!groupId || !userId || !file || !filename || !filetype) {
        console.error('Invalid data:', { groupId, userId, file, filename, filetype });
        socket.emit('error', 'Invalid data');
        return;
      }

      console.log('Received file message:', { groupId, userId, filename, filetype });

      const query = `
        SELECT cg.id 
        FROM chat_groups cg
        JOIN group_members gm ON cg.id = gm.group_id
        WHERE cg.id = ? AND gm.user_id = ?
      `;

      db.query(query, [groupId, userId], (err, groupRows) => {
        if (err) {
          console.error('Error finding group:', err);
          socket.emit('error', 'Error finding group');
          return;
        }

        if (groupRows.length > 0) {
          const insertQuery = 'INSERT INTO messages (user_id, group_id, content, filetype) VALUES (?, ?, ?, ?)';
          db.query(insertQuery, [userId, groupId, file, filetype], (err) => {
            if (err) {
              console.error('Error saving file message:', err);
              socket.emit('error', 'Error saving file message');
              return;
            }

            io.to(groupId).emit('file message', { userId, username: socket.username, file, filename, filetype });
          });
        } else {
          socket.emit('error', 'You are not a member of this group');
        }
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      socket.emit('error', 'Unexpected error');
    }
  });
};
