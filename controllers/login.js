const bcrypt = require('bcrypt');
const db = require("../db");
const saltRounds = 10;

// Register
exports.LoginSignup = async (req, res) => {
    const { username, password, email } = req.body;

    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Email:', email);

    if (!username || !password || !email) {
        return res.status(400).send({ error: true, message: 'Please provide complete details' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sql = 'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, "user")';
        db.query(sql, [username, hashedPassword, email], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send({ error: true, message: 'Database error' });
            }
            console.log('User registered successfully:', result.insertId);
            res.status(201).send({ error: false, message: 'User registered successfully' });
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).send({ error: true, message: 'Error hashing password' });
    }
};

// Login
exports.LoginSignin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ error: true, message: 'Please provide complete details' });
    }

    try {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, [username], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send({ error: true, message: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(401).send({ error: true, message: 'Invalid username or password' });
            }

            const user = results[0];

            try {
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(401).send({ error: true, message: 'Invalid username or password' });
                }

                // เก็บข้อมูลผู้ใช้ในเซสชัน
                req.session.user = {
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                };

                console.log('Session user:', req.session.user); // ตรวจสอบการเก็บข้อมูลในเซสชัน

                res.send({ error: false, message: 'Login successful', user: { id: user.user_id, username: user.username, email: user.email, role: user.role } });
            } catch (compareErr) {
                console.error('Error comparing passwords:', compareErr);
                return res.status(500).send({ error: true, message: 'Error comparing passwords' });
            }
        });
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).send({ error: true, message: 'Unexpected error' });
    }
};