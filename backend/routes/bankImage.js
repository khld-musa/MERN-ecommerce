const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// GET /api/v1/bank-image/:filename
router.get('/bank-image/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../uploads/bank_statements', req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ success: false, message: 'Image not found' });
    }
});

module.exports = router;
