const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');

router.get("/", shiftController.getAllShifts);

router.get("/:id", shiftController.getShiftById);

router.post("/open", shiftController.openShift);

router.post("/close", shiftController.closeShift);

router.get("/branch/:branchId", shiftController.getShiftsByBranch);

router.get("/branch/:branchId/current", shiftController.getCurrentShiftByBranch);

router.get("/day", shiftController.getShiftsByDate);

router.delete("/:id", shiftController.deleteShift);

module.exports = router;
