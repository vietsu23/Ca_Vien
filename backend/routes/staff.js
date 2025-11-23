const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

router.get("/", staffController.getAllStaffs);

router.get("/:id", staffController.getStaffById);

router.post("/", staffController.addStaff);

router.put("/:id", staffController.updateStaff);

router.delete("/:id", staffController.deleteStaff);

router.post("/login", staffController.loginStaff);

module.exports = router;
