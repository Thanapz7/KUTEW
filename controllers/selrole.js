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
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(new Error('Only images are allowed'));
        }
        cb(null, true);
    }
}).fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'cardidPhoto', maxCount: 1 },
    { name: 'certificatePhoto', maxCount: 3 }
]);

exports.AddTutor = (req, res) => {
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

            // เรียกฟังก์ชันเพื่ออัปเดตสถานะการทำแบบฟอร์ม และroleของผู้ใช้งาน
            const updateFormRoleSql = 'UPDATE users SET role = ? ,form = ? WHERE user_id = ?';
            db.query(updateFormRoleSql, ['tutor','completed', userId], (updateErr, updateResults) => {
                if (updateErr) {
                    console.error('Error updating form status:', updateErr.stack);
                    return res.status(500).send({ message: 'Failed to update form status' });
                }
                res.status(200).json({ message: 'Profile saved and form status updated successfully' });
            });
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

            // เรียกฟังก์ชันเพื่ออัปเดตสถานะการทำแบบฟอร์ม และroleของผู้ใช้งาน
            const updateFormRoleSql = 'UPDATE users SET role = ? ,form = ? WHERE user_id = ?';
            db.query(updateFormRoleSql, ['student','completed', userId], (updateErr, updateResults) => {
                if (updateErr) {
                    console.error('Error updating form status:', updateErr.stack);
                    return res.status(500).send({ message: 'Failed to update form status' });
                }
                res.status(200).json({ message: 'Profile saved and form status updated successfully' });
            });
        });
    });
};


// เส้นทางสำหรับบันทึกสถานะการทำแบบฟอร์ม
exports.UpdateForm = (req, res) => {
    const userId = req.session.user.user_id;
    const sql = 'UPDATE users SET form = ? WHERE user_id = ?';

    db.query(sql, ['completed', userId], (err, results) => {
        if (err) {
            console.error('Error updating form status:', err.stack);
            return res.status(500).send({ message: 'Failed to update form status' });
        }
        res.status(200).send({ message: 'Form status updated successfully' });
    });
};

// เส้นทางสำหรับดึงสถานะการทำแบบฟอร์ม
exports.FormStatus = (req, res) => {
    const userId = req.session.user.user_id;
    const sql = 'SELECT form FROM users WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching form status:', err.stack);
            return res.status(500).send({ message: 'Failed to fetch form status' });
        }
        if (results.length > 0) {
            res.status(200).send({ formCompleted: results[0].form === 'completed',  
                                   formUncompleted: results[0].form === 'uncompleted' 
        });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    });
};

exports.UpdateProfilePic = (req, res) => {
     if (!req.session.user) {
         return res.status(401).json({ error: 'User not logged in' });
    }

    const userId = req.session.user.user_id;

    // ตรวจสอบ role ของผู้ใช้งานก่อน
    const checkRoleSql = 'SELECT role FROM users WHERE user_id = ?';
    db.query(checkRoleSql, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const userRole = result[0].role;

        // ใช้ multer สำหรับอัปโหลดรูป profile
        const uploadProfilePic = multer({
            storage: storage,
            fileFilter: (req, file, cb) => {
                const ext = path.extname(file.originalname).toLowerCase();
                if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
                    return cb(new Error('Only images are allowed'));
                }
                cb(null, true);
            }
        }).single('profilePhoto');

        uploadProfilePic(req, res, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const profilePic = req.file ? req.file.path : null;

            if (!profilePic) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            // ตรวจสอบ role แล้วอัปเดต profilePic ตาม role
            let updateSql;
            if (userRole === 'tutor') {
                updateSql = 'UPDATE tutors SET profilePic = ? WHERE user_id = ?';
            } else if (userRole === 'student') {
                updateSql = 'UPDATE students SET profilePic = ? WHERE user_id = ?';
            } else {
                return res.status(400).json({ error: 'Invalid role' });
            }

            db.query(updateSql, [profilePic, userId], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.status(200).json({ message: 'Profile picture updated successfully' });
            });
        });
    });
};
