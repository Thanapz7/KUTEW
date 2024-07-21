const db = require("../db");
const multer = require('multer');
const path = require('path');

// การตั้งค่าการเก็บไฟล์รูปภาพ
const storage = multer.diskStorage({
    destination: './QRcode/',
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
    { name: 'QRcodePhoto', maxCount: 1 },
]);

// ฟังก์ชันเพื่อเพิ่มโพสต์ใหม่
exports.insertPost = async (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const { details, tag, location, date, price, people, hours } = req.body;
        const QRcodePic = req.files['QRcodePhoto'] ? req.files['QRcodePhoto'][0].path : null;

        console.log('Received post:', { details, tag, location, date, price, people, hours, QRcode: QRcodePic });

        // เช็คว่าข้อมูลถูกต้องหรือไม่ก่อนแปลงเป็นตัวเลข
        const priceInt = isNaN(parseInt(price)) ? 0 : parseInt(price);
        const peopleInt = isNaN(parseInt(people)) ? 0 : parseInt(people);
        const hoursInt = isNaN(parseInt(hours)) ? 0 : parseInt(hours);

        const userId = req.session.user.user_id;

        const sql = 'INSERT INTO posts (details, tag, location, date, price, people, hours, QRcode, user_id ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [details, tag, location, date, priceInt, peopleInt, hoursInt, QRcodePic, userId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Post saved successfully' });
        });
    });
};


exports.getMyPost = async (req, res) => {
    const userId = req.session.user.user_id;
    const query = "SELECT * FROM posts WHERE user_id = ?";
    db.query(query, [userId],(err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            res.status(500).json({ error: 'Failed to fetch posts' });
            return;
        }
        //console.log(userId)
        res.json(results);
    });
};

exports.getAllPost = async (req, res) => {
    const query = `
        SELECT posts.*, tutors.name AS tutor_name, tutors.profilePic 
        FROM posts 
        JOIN tutors ON posts.user_id = tutors.user_id
        ORDER BY posts.date DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            res.status(500).json({ error: 'Failed to fetch posts' });
            return;
        }
        res.json(results);
    });
};


exports.updatePost = async (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const { id } = req.params;
        const { details, tag, location, date, price, people, hours } = req.body;
        const QRcodePic = req.files['QRcodePhoto'] ? req.files['QRcodePhoto'][0].path : null;

        console.log('Update post:', { details, tag, location, date, price, people, hours, QRcode: QRcodePic });

        const priceInt = parseInt(price) || 0;
        const peopleInt = parseInt(people) || 0;
        const hoursInt = parseInt(hours) || 0;

        const query = 'UPDATE posts SET details = ?, tag = ?, location = ?, date = ?, price = ?, people = ?, hours = ?, QRcode = ? WHERE post_id = ?';
        db.query(query, [details, tag, location, date, priceInt, peopleInt, hoursInt, QRcodePic, id], (err) => {
            if (err) {
                console.error('Error updating post:', err);
                res.status(500).json({ error: 'Failed to update post' });
                return;
            }
            res.json({ details, tag, location, date, price, people, hours, QRcodePic });
        });
    });
};

exports.deletePost = async (req, res) => {
    const { id } = req.params;
    
    const getQuery = 'SELECT * FROM Posts WHERE post_id = ?';
    db.query(getQuery, [id], (err, results) => {
        if (err) {
            console.error('Error retrieving post:', err);
            return res.status(500).json({ error: 'Failed to retrieve post' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const postToDelete = results[0];

        const deleteQuery = 'DELETE FROM Posts WHERE post_id = ?';
        db.query(deleteQuery, [id], (err) => {
            if (err) {
                console.error('Error deleting post:', err);
                return res.status(500).json({ error: 'Failed to delete post' });
            }

            res.status(200).json(postToDelete);
        });
    });
};

exports.searchPost = async (req, res) => {
    const { keyword } = req.query;

    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    const searchQuery = `
        SELECT * FROM posts 
        WHERE details LIKE ? OR 
              tag LIKE ? OR 
              location LIKE ?
    `;

    const searchValue = `%${keyword}%`;

    db.query(searchQuery, [searchValue, searchValue, searchValue], (err, results) => {
        if (err) {
            console.error('Error searching posts:', err);
            return res.status(500).json({ error: 'Failed to search posts' });
        }

        res.json(results);
    });
};
