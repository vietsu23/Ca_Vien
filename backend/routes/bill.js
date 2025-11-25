const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.get("/", billController.getAllBills);

router.get("/date", billController.getBillsByDate);

router.get("/staff/:staffId", billController.getBillsByStaffId);

router.get("/shift/:shiftId", billController.getBillsByShiftId)

router.post("/", billController.createBill);

router.delete("/:id", billController.deleteBill);

router.delete("/", billController.deleteAllBills);

router.get("/:id", billController.getBillById);

router.put("/:id", billController.updateBill);

module.exports = router;
