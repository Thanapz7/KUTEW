module.exports = (io, socket, db) => {
  // Handle joining a chat group
  socket.on('join group', (groupId) => {
    try {
      if (!groupId) {
        socket.emit('error', 'Invalid group ID');
        return;
      }

      db.query('SELECT id FROM chat_groups WHERE id = ?', [groupId], (err, groupRows) => {
        if (err) {
          console.error('Error joining group:', err);
          socket.emit('error', 'Error joining group');
          return;
        }

        if (groupRows.length > 0) {
          socket.join(groupId);

          const query = `
            SELECT m.*, u.username 
            FROM messages m
            JOIN users u ON m.user_id = u.user_id
            WHERE m.group_id = ?
          `;
          db.query(query, [groupId], (err, messages) => {
            if (err) {
              console.error('Error loading messages:', err);
              socket.emit('error', 'Error loading messages');
              return;
            }

            socket.emit('load messages', messages);
          });
        } else {
          socket.emit('error', 'Invalid group ID');
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
      db.query('SELECT id FROM chat_groups WHERE id = ?', [groupId], (err, groupRows) => {
        if (err) {
          console.error('Error finding group:', err);
          socket.emit('error', 'Error finding group');
          return;
        }

        if (groupRows.length > 0) {
          const query = 'INSERT INTO messages (group_id, user_id, content) VALUES (?, ?, ?)';
          db.query(query, [groupId, userId, msg], (err) => {
            if (err) {
              console.error('Error inserting message:', err);
              socket.emit('error', 'Error inserting message');
              return;
            }

            db.query('SELECT username FROM users WHERE user_id = ?', [userId], (err, userRows) => {
              if (err) {
                console.error('Error finding user:', err);
                socket.emit('error', 'Error finding user');
                return;
              }

              if (userRows.length > 0) {
                const username = userRows[0].username;
                io.to(groupId).emit('chat message', { userId, username, msg });
              } else {
                console.error('User not found:', userId);
                socket.emit('error', 'User not found');
              }
            });
          });
        } else {
          socket.emit('error', 'Invalid group ID');
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

      db.query('SELECT id FROM chat_groups WHERE id = ?', [groupId], (err, groupRows) => {
        if (err) {
          console.error('Error finding group:', err);
          socket.emit('error', 'Error finding group');
          return;
        }

        if (groupRows.length > 0) {
          const query = 'INSERT INTO messages (group_id, user_id, content, filetype) VALUES (?, ?, ?, ?)';
          db.query(query, [groupId, userId, file, filetype], (err) => {
            if (err) {
              console.error('Error inserting file message:', err);
              socket.emit('error', 'Error inserting file message');
              return;
            }

            db.query('SELECT username FROM users WHERE user_id = ?', [userId], (err, userRows) => {
              if (err) {
                console.error('Error finding user:', err);
                socket.emit('error', 'Error finding user');
                return;
              }

              if (userRows.length > 0) {
                const username = userRows[0].username;
                io.to(groupId).emit('file message', { userId, username, file, filename, filetype });
              } else {
                console.error('User not found:', userId);
                socket.emit('error', 'User not found');
              }
            });
          });
        } else {
          socket.emit('error', 'Invalid group ID');
        }
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      socket.emit('error', 'Unexpected error');
    }
  });
};
