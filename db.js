const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// สร้าง connection db แทนการใช้ createConnection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false // ใช้ถ้า SSL จำเป็น
    }
});

// ทดสอบการเชื่อมต่อจาก db
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');

    // ปล่อย connection กลับไปที่ db หลังจากใช้งานเสร็จ
    connection.release();
});

module.exports = db;
