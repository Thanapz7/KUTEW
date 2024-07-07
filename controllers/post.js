const db = require("../db");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './QRcode/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).fields([
    { name: 'QRcodePhoto', maxCount: 1 },
]);


exports.insertPost = async (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const { details, tag, location, date, price, people, hours } = req.body;
        const QRcodePic = req.files['QRcodePhoto'] ? req.files['QRcodePhoto'][0].path : null;

        console.log('Received post:', { details, tag, location, date, price, people, hours, QRcode: QRcodePic });

        const priceInt = parseInt(price);
        const peopleInt = parseInt(people);
        const hoursInt = parseInt(hours);

        const sql = 'INSERT INTO posts (details, tag, location, date, price, people, hours, QRcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [ details, tag, location, date, priceInt, peopleInt, hoursInt, QRcodePic], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Post saved successfully' });
        });
    });
};

exports.getAllPost = async (req, res) => {
    const query = 'SELECT * FROM posts';
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

        const query = 'UPDATE posts SET details = ?, tag = ?, location = ?, date = ?, price = ?, people = ?, hours = ?, QRcode = ? WHERE post_id = ?';
        db.query(query, [details, tag, location, date, price, people, hours, QRcodePic, id], (err) => {
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
    
    // Query to get the post before deleting
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

        // Query to delete the post
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