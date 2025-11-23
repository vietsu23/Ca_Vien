const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.get("/", billController.getAllBills);

router.get("/date", billController.getBillsByDate);

router.get("/staff/:staffId", billController.getBillsByStaffId);

router.post("/", billController.createBill);

router.delete("/:id", billController.deleteBill);

router.get("/:id", billController.getBillById);

module.exports = router;
