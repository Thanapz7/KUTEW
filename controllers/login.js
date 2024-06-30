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
  
    if (!username || !password) {
        return res.status(400).send({ error: true, message: 'Please provide complete details' });
    }
  
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            return res.status(500).send({ error: true, message: 'Database error' });
        }
  
        if (results.length === 0) {
            return res.status(401).send({ error: true, message: 'Invalid username or password' });
        }
  
        const user = results[0];
        
        // Compare the hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).send({ error: true, message: 'Error comparing passwords' });
            }
  
            if (!isMatch) {
                return res.status(401).send({ error: true, message: `Invalid username or password ${username},${password}` });
            }
  
            // Successful login
            res.send({ error: false, message: 'Login successful', user: { id: user.id, username: user.username, email: user.email, role: user.role } });
        });
    });
  };

// Register
// exports.LoginSignup = async (req, res) => {
//     const { username, password } = req.body;
//     const query = 'INSERT INTO Users (username, password, role) VALUES (?, ?, "user")';
//     db.query(query, [username, password], (err, results) => {
//         if (err) {
//             console.error('Error inserting user:', err);
//             return res.status(500).json({ message: 'Error inserting user' });
//         }
//         res.json({ message: 'User registered successfully' });
//     });
// };

 // Login
// exports.LoginSignin = async (req, res) => {
//     const { username, password } = req.body;
//     const query = 'SELECT * FROM Users WHERE Username = ? AND Password = ?';
//     db.query(query, [username, password], (err, results) => {
//         if (err) {
//             console.error('Error querying user:', err);
//             return res.status(500).json({ message: 'Error querying user' });
//         }
//         if (results.length > 0) {
//             const user = results[0];
//             const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey, {
//                 expiresIn: '1h'
//             });
//             res.status(200).json({ message: 'Login successfully', token });
            
//         } else {
//             res.status(401).json({ message: `Invalid username or password ${username} , ${password}` });
//         }
//     });
// };


