const db = require("../db");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'cardidPhoto', maxCount: 1 },
    { name: 'certificatePhoto', maxCount: 3 }
]);

exports.AddTutor = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const { name, faculty, major, year, phone, address } = req.body;
        const profilePic = req.files['profilePhoto'] ? req.files['profilePhoto'][0].path : null;
        const idPic = req.files['cardidPhoto'] ? req.files['cardidPhoto'][0].path : null;
        const certificatePic = req.files['certificatePhoto'] ? req.files['certificatePhoto'][0].path : null;

        const yearInt = parseInt(year.replace('y', ''));
        const userId = req.session.user.user_id;

        console.log('User ID:', userId); // ตรวจสอบว่า user_id ถูกเก็บในเซสชันหรือไม่

        const sql = 'INSERT INTO tutors (user_id, profilePic, name, faculty, major, year, phone, address, idPic, certificatePic, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [userId, profilePic, name, faculty, major, yearInt, phone, address, idPic, certificatePic, 'tutor'], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Profile saved successfully' });
        });
    });
};


exports.AddStudent = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const { name, faculty, major, year, phone, address } = req.body;
        const profilePic = req.files['profilePhoto'] ? req.files['profilePhoto'][0].path : null;

        const yearInt = parseInt(year.replace('y', ''));
        const userId = req.session.user.user_id;

        console.log('User ID:', userId); // ตรวจสอบว่า user_id ถูกเก็บในเซสชันหรือไม่

        const sql = 'INSERT INTO students (user_id, profilePic, name, faculty, major, year, phone, address, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [userId, profilePic, name, faculty, major, yearInt, phone, address, 'student'], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Profile saved successfully' });
        });
    });
};