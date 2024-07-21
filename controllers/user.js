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
        COALESCE(tutors.profilePic, students.profilePic) AS profilePic
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



