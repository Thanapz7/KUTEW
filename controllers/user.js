const db = require("../db");

exports.getAllTutors = async (req, res) => {
    const query = 'SELECT * FROM tutors';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            res.status(500).json({ error: 'Failed to fetch posts' });
            return;
        }
        res.json(results);
    });
};
exports.getAllStudents = async (req, res) => {
    const query = 'SELECT * FROM students';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            res.status(500).json({ error: 'Failed to fetch posts' });
            return;
        }
        res.json(results);
    });
};

exports.getAllUsers = async (req, res) => {
    const userId = req.session.user.user_id;
    const query = `
    SELECT
        users.user_id,
        users.email,
        COALESCE(tutors.name, students.name) AS name,
        COALESCE(tutors.faculty, students.faculty) AS faculty,
        COALESCE(tutors.major, students.major) AS major,
        COALESCE(tutors.year, students.year) AS year,
        COALESCE(tutors.phone, students.phone) AS phone,
        COALESCE(tutors.address, students.address) AS address,
        COALESCE(tutors.profilePic, students.profilePic) AS profilePic,
        users.role
    FROM
        users
    LEFT JOIN
        tutors ON users.user_id = tutors.user_id
    LEFT JOIN
        students ON users.user_id = students.user_id
    WHERE
        users.user_id = ?;
    `;
    
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            res.status(500).json({ error: 'Failed to fetch user data' });
            return;
        }
        console.log('User data:',results[0]); // Log the fetched data
        res.json(results[0]);  // Assuming you only need one user data
    });
};

exports.StudentgetUser = async (req, res) => {
    const { id } = req.params; // ดึงค่า id จาก req.params
    const query = `
    SELECT u.user_id 
    FROM students s
    JOIN users u ON s.user_id = u.user_id
    WHERE s.student_id = ?;
    `;
    
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            res.status(500).json({ error: 'Failed to fetch user data' });
            return;
        }

        if (results.length > 0) {
            res.status(200).json({ user_id: results[0].user_id });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
};

exports.TutorgetUser = async (req, res) => {
    const { id } = req.params; // ดึงค่า id จาก req.params
    const query = `
    SELECT u.user_id 
    FROM students s
    JOIN users u ON s.user_id = u.user_id
    WHERE s.student_id = ?;
    `;
    
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            res.status(500).json({ error: 'Failed to fetch user data' });
            return;
        }

        if (results.length > 0) {
            res.status(200).json({ user_id: results[0].user_id });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
};

exports.getTutordata = async (req, res) => {
    const { id } = req.params; // ดึงค่า id จาก req.params
    const query = `
    SELECT * 
    FROM users u
    JOIN tutors t ON t.user_id = u.user_id 
    WHERE u.user_id = ?;
    `;
    
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            res.status(500).json({ error: 'Failed to fetch user data' });
            return;
        }

        // ส่งผลลัพธ์กลับไปยัง client
        res.json(results);
    });
};

exports.getStudentdata = async (req, res) => {
    const { id } = req.params; // ดึงค่า id จาก req.params
    const query = `
    SELECT * 
    FROM users u
    JOIN students s ON s.user_id = u.user_id 
    WHERE u.user_id = ?;
    `;
    
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            res.status(500).json({ error: 'Failed to fetch user data' });
            return;
        }

        // ส่งผลลัพธ์กลับไปยัง client
        res.json(results);
    });
};

exports.getAllTutorsByID = async (req, res) => {
    const tutor_id= req.params.tutor_id;
    const query = 'SELECT * FROM tutors WHERE tutor_id = ?';
    db.query(query, [tutor_id],(err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            res.status(500).json({ error: 'Failed to fetch posts' });
            return;
        }
        res.json(results);
    });
};

exports.getUsersRating = async (req, res) => {
    const tutorId = req.params.tutor_id;
    const query = 'SELECT AVG(rating) AS average_rating FROM comments WHERE tutor_id = ?';
    db.query(query, [tutorId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        // ตรวจสอบและจัดรูปแบบให้เหลือ 2 ตำแหน่งทศนิยม ถ้าไม่เป็น null
        const averageRating = results[0].average_rating !== null 
            ? parseFloat(results[0].average_rating).toFixed(2) 
            : "No Ratings";
        res.json({ rating: averageRating });
    });
};

exports.getUserPrice = async (req, res) => {
    const userId = req.session.user.user_id;

    const query = `
        SELECT SUM(p.price) AS tutor_price
        FROM posts p
        JOIN joins j ON p.post_id = j.post_id
        WHERE j.tutor_id = (SELECT tutor_id FROM tutors WHERE user_id = ?) AND j.paymentPic IS NOT NULL AND j.course_status = ?;
    `;

    db.query(query, [userId, 'done'], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        // ตรวจสอบว่ามีข้อมูลหรือไม่ ถ้ามีให้แสดงราคา ถ้าไม่มีให้แสดงข้อความแจ้งเตือน
        if (results.length > 0) {
            res.json({ price: results[0].tutor_price });
        } else {
            res.status(404).json({ message: 'No payment found for this Tutor' });
        }
    });
};
