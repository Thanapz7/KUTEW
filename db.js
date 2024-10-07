const mysql = require('mysql2');
const dbUrl = process.env.CLEARDB_DATABASE_URL;  // ดึง URL ของฐานข้อมูลจาก environment variable

// สร้าง pool การเชื่อมต่อ
const db = mysql.createPool({
  uri: dbUrl  // ใช้ URI จาก ClearDB สำหรับการเชื่อมต่อ
});

// ทดสอบการเชื่อมต่อกับฐานข้อมูล
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to ClearDB MySQL:', err);
    return;
  }
  console.log('Connected to ClearDB MySQL');
  connection.release(); // ปล่อย connection กลับไปยัง pool
});

module.exports = db;
