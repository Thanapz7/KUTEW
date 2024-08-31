const db = require("../db");

exports.insertComment = (req, res) => {
    const userId = req.session.user.user_id;
    const tutor_id = req.params.tutor_id;

    const { text } = req.body;

    if (!text ) {
        return res.status(400).json({ error: 'Text are required' });
    }

    const sql = `
        INSERT INTO comments (text, tutor_id, student_id)
        VALUES (?, ?, (SELECT student_id FROM students WHERE user_id = ?))
    `;

    db.query(sql, [text, tutor_id, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Comment saved successfully' });
    });
};

exports.ReportComment = (req, res) => {
    const comment_id = req.params.comment_id;

    if (!comment_id) {
        return res.status(400).json({ error: 'Comment ID is required' });
    }

    const sql = `
        UPDATE comments SET status = ?
        WHERE comment_id = ?
    `;

    db.query(sql, ['Reported', comment_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.status(200).json({ message: 'Report successfully' });
    });
};

exports.RejectReportComment = (req, res) => {
    const comment_id = req.params.comment_id;

    if (!comment_id) {
        return res.status(400).json({ error: 'Comment ID is required' });
    }

    const sql = `
        UPDATE comments SET status = ?
        WHERE comment_id = ?
    `;

    db.query(sql, ['Normal', comment_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.status(200).json({ message: 'Reject successfully' });
    });
};

exports.GetAllCommentByIdTutor = (req, res) => {
    const tutor_id = req.params.tutor_id;

    if (!tutor_id) {
        return res.status(400).json({ error: 'Tutor ID is required' });
    }

    const sql = `
        SELECT text, tutor_id, student_id 
        FROM comments
        WHERE tutor_id = ?
    `;

    db.query(sql, [tutor_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No comments found for this tutor' });
        }

        res.status(200).json({ comments: results });
    });
};

exports.GetAllCommentReport = (req, res) => {
    const sql = `
        SELECT text, tutor_id, student_id 
        FROM comments
        WHERE status = ?
    `;

    db.query(sql, ['Reported'], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No comments found for this tutor' });
        }

        res.status(200).json({ comments: results });
    });
};

