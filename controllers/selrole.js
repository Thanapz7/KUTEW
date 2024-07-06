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
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const { name, faculty, major, year, phone, address } = req.body;
        const profilePic = req.files['profilePhoto'] ? req.files['profilePhoto'][0].path : null;
        const idPic = req.files['cardidPhoto'] ? req.files['cardidPhoto'][0].path : null;
        const certificatePic = req.files['certificatePhoto'] ? req.files['certificatePhoto'][0].path : null;

        console.log('Received data:', { profilePic, name, faculty, major, year, phone, address, idPic, certificatePic });

        const yearInt = parseInt(year.replace('y', ''));

        const sql = 'INSERT INTO tutors (profilePic, name, faculty, major, year, phone, address, idPic, certificatePic, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [profilePic, name, faculty, major, yearInt, phone, address, idPic, certificatePic, 'tutor'], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Profile saved successfully' });
        });
    });
};


  

exports.AddStudent = (req, res) => {
    try {
        const studentData = JSON.parse(req.body.studentData);
        const { name, major, branch, year, phone, address } = studentData;
        const profilePic = req.files['profilePic'] ? req.files['profilePic'][0].filename : null;
        const idPic = req.files['idPic'] ? req.files['idPic'][0].filename : null;
        const certificatePic = req.files['certificatePic'] ? req.files['certificatePic'].map(file => file.filename) : [];

        const sql = 'INSERT INTO students (profilePic, name, major, branch, year, phone, address, idPic, certificatePic, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "student")';

        db.query(sql, [profilePic, name, major, branch, year, phone, address, idPic, JSON.stringify(certificatePic)], (err, result) => {
            if (err) {
                console.error('Error inserting student:', err);
                res.status(500).send('Error inserting student record');
                return;
            }
            res.send({
                message: 'Student record added successfully',
                data: {
                    profilePic,
                    name,
                    major,
                    branch,
                    year,
                    phone,
                    address,
                    idPic,
                    certificatePic
                }
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).send('Unexpected error');
    }
};
