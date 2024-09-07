const db = require("../db");

exports.getAllTutorsPending = async (req, res) => {
    const query = 'SELECT * FROM tutors WHERE status = "pending"';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            res.status(500).json({ error: 'Failed to fetch posts' });
            return;
        }
        res.json(results);
    });
};

exports.updateAcceptTutor = async (req, res) => {
    const tutor_id = req.params.id;
    const query = `
        UPDATE tutors SET status = ?
        WHERE tutor_id = ?
    `;
    db.query(query, ['Accept', tutor_id], (err, results) => {
        if (err) {
            console.error('Error updating join:', err);
            res.status(500).json({ error: 'Failed to update join' });
            return;
        }
        res.status(200).json({ message: 'Update join status successfully'});
    });
};

exports.DenyDeleteTutor = async (req, res) => {
    const tutor_id = req.params.id;
    const query = `
        DELETE FROM tutors WHERE tutor_id = ?
    `;
    
    db.query(query, [tutor_id], (err, results) => {
        if (err) {
            console.error('Error deleting tutor:', err);
            res.status(500).json({ error: 'Failed to delete tutor' });
            return;
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Tutor not found' });
        }

        res.status(200).json({ message: 'Tutor deleted successfully' });
    });
};


exports.getUserActivity = async (req, res) => {
    const query = 'SELECT date, tutor_count, student_count FROM user_activity';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error Get Count', err);
            res.status(500).json({ error: 'Failed to Get Count' });
            return;
        }
        res.status(200).json({ message: 'Get User Count successfully',results});
    });
};