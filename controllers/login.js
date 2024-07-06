// const jwt = require('jsonwebtoken');
// const secretKey = process.env.MYSECRETKEY

const express = require("express");
const bcrypt = require('bcrypt');
const db = require("../db");
const saltRounds = 10;


// Register
exports.LoginSignup = async  (req, res) => {
    const { username, password, email } = req.body;
  
    if (!username || !password || !email) {
        return res.status(400).send({ error: true, message: 'Please provide complete details' });
    }
    
    // Hash the password before saving to the database
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send({ error: true, message: 'Error hashing password' });
        }
  
        const sql = 'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, "user")';
        db.query(sql, [username, hashedPassword, email], (err, result) => {
            if (err) {
                return res.status(500).send({ error: true, message: 'Database error' });
            }
            res.redirect(303,'/');
            //res.send({ error: false, message: 'User registered successfully', data: result.insertId });
        });
    });
  };

// Login
exports.LoginSignin = async (req, res) => {
    const { username, password } = req.body;

    // ตรวจสอบและล็อกค่าของ username และ password
    console.log('Username:', username);
    console.log('Password:', password);

    if (!username || !password) {
        return res.status(400).send({ error: true, message: 'Please provide complete details' });
    }

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send({ error: true, message: 'Database error' });
        }

        console.log('Database results:', results);

        if (results.length === 0) {
            return res.status(401).send({ error: true, message: 'Invalid username or password' });
        }

        const user = results[0];

        // ตรวจสอบและล็อกค่าของ user.password
        console.log('Hashed Password:', user.password);

        // ตรวจสอบว่าทั้ง password และ user.password มีค่าหรือไม่
        if (!password || !user.password) {
            return res.status(500).send({ error: true, message: 'Password or hashed password missing' });
        }

        // เปรียบเทียบรหัสผ่านที่ถูกแฮช
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).send({ error: true, message: 'Error comparing passwords' });
            }

            if (!isMatch) {
                return res.status(401).send({ error: true, message: 'Invalid username or password' });
            }

            // เข้าสู่ระบบสำเร็จ
            res.send({ error: false, message: 'Login successful', user: { id: user.id, username: user.username, email: user.email, role: user.role } });
        });
    });
};



