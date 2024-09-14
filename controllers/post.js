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
    const query = "SELECT * FROM posts WHERE user_id = ? ORDER BY posts.post_date DESC";
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
        ORDER BY posts.post_date DESC
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

exports.getPostById = (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT posts.*, tutors.name AS tutor_name, tutors.profilePic ,tutors.tutor_id
        FROM posts 
        JOIN tutors ON posts.user_id = tutors.user_id
        WHERE post_id = ?
        ORDER BY posts.date DESC
    `;
    db.query(query, [id], (err, results) => {
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

    // Query เพื่อตรวจสอบโพสต์และการ join
    const getPostQuery = 'SELECT * FROM posts WHERE post_id = ?';
    const getJoinQuery = 'SELECT * FROM joins WHERE post_id = ?';

    db.query(getPostQuery, [id], (err, postResults) => {
        if (err) {
            console.error('Error retrieving post:', err);
            return res.status(500).json({ error: 'Failed to retrieve post' });
        }

        if (postResults.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        db.query(getJoinQuery, [id], (err, joinResults) => {
            if (err) {
                console.error('Error retrieving joins:', err);
                return res.status(500).json({ error: 'Failed to retrieve joins' });
            }

            // ตรวจสอบว่ามี course_status เป็น 'Done' หรือไม่
            const hasDoneCourse = joinResults.some(join => join.course_status === 'Done');
            if (hasDoneCourse) {
                return res.status(400).json({ error: 'Cannot delete post, course is already done' });
            }

            // ตรวจสอบว่าการ join ทั้งหมดถูกปฏิเสธหรือไม่มีการ join เลย
            const allDenied = joinResults.every(join => join.join_status === 'Deny');
            const hasNoJoins = joinResults.length === 0;

            if (!hasNoJoins && !allDenied) {
                return res.status(400).json({ error: 'Cannot delete post, there are accepted joins' });
            }

            // ลบการ join ที่ถูกปฏิเสธก่อน
            const deleteDeniedJoinsQuery = 'DELETE FROM joins WHERE post_id = ? AND join_status = "Deny"';
            db.query(deleteDeniedJoinsQuery, [id], (err) => {
                if (err) {
                    console.error('Error deleting denied joins:', err);
                    return res.status(500).json({ error: 'Failed to delete denied joins' });
                }

                // หลังจากลบ joins แล้ว ให้ลบโพสต์
                const deletePostQuery = 'DELETE FROM posts WHERE post_id = ?';
                db.query(deletePostQuery, [id], (err) => {
                    if (err) {
                        console.error('Error deleting post:', err);
                        return res.status(500).json({ error: 'Failed to delete post' });
                    }

                    res.status(200).json({ message: 'Post and denied joins deleted successfully' });
                });
            });
        });
    });
};



exports.searchPost = async (req, res) => {
    const keyword = req.params.keyword;
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    const searchQuery = `
        SELECT DISTINCT posts.*, tutors.tutor_id, tutors.name AS tutor_name, tutors.profilePic AS tutor_profilePic
        FROM posts
        JOIN tutors ON tutors.user_id = posts.user_id
        LEFT JOIN joins ON joins.post_id = posts.post_id
        WHERE (posts.details LIKE ? OR 
               posts.tag LIKE ? OR 
               posts.location LIKE ?)
        AND (joins.course_status = 'do' OR joins.course_status IS NULL)
        ORDER BY posts.post_date DESC
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

exports.getAllPostForHome = async (req, res) => {
    const query = `
        SELECT DISTINCT posts.*, tutors.name AS tutor_name, tutors.profilePic 
        FROM posts
        JOIN tutors ON tutors.user_id = posts.user_id
        LEFT JOIN joins ON joins.post_id = posts.post_id
        WHERE joins.course_status = ? OR joins.course_status IS NULL
        ORDER BY posts.post_date DESC
    `;
    db.query(query, ['do'],(err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            res.status(500).json({ error: 'Failed to fetch posts' });
            return;
        }
        res.json(results);
    });
};




