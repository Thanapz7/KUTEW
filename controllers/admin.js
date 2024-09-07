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

    // อัปเดตฟิลด์ form ในตาราง users ให้เป็น 'uncompleted' ก่อน
    const updateFormQuery = `
        UPDATE users 
        SET form = ? 
        WHERE user_id = (SELECT user_id FROM tutors WHERE tutor_id = ?);
    `;

    db.query(updateFormQuery, ['uncompleted',tutor_id], (updateErr, updateResults) => {
        if (updateErr) {
            console.error('Error updating user form status:', updateErr);
            return res.status(500).json({ error: 'Failed to update user form status' });
        }

        // ตรวจสอบว่าพบ user_id ที่เกี่ยวข้องกับ tutor_id หรือไม่
        if (updateResults.affectedRows === 0) {
            return res.status(404).json({ message: 'Tutor not found for update' });
        }

        // ลบผู้สอนจากตาราง tutors
        const deleteTutorQuery = `
            DELETE FROM tutors WHERE tutor_id = ?
        `;

        db.query(deleteTutorQuery, [tutor_id], (deleteErr, deleteResults) => {
            if (deleteErr) {
                console.error('Error deleting tutor:', deleteErr);
                return res.status(500).json({ error: 'Failed to delete tutor' });
            }

            if (deleteResults.affectedRows === 0) {
                return res.status(404).json({ message: 'Tutor not found' });
            }

            res.status(200).json({ message: 'Tutor deleted and user form updated successfully' });
        });
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