const express = require("express");
const router = express.Router();
const { InsertNotifications } = require("../controllers/notifications");

// เส้นทางสำหรับการสร้างการแจ้งเตือน
router.post("/notifications", (req, res) => {
    // ตรวจสอบว่ามี io ใน req หรือไม่
    if (req.io) {
        InsertNotifications(req, res, req.io);
    } else {
        res.status(500).send('Socket not initialized');
    }
});

module.exports = router;
