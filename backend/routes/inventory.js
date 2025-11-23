const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get("/", inventoryController.getAllInventories);

router.get("/branch/:branchId", inventoryController.getInventoryByBranch);

router.get("/product/:productId", inventoryController.getInventoryByProduct);

router.post("/", inventoryController.addInventory);

router.put("/:id", inventoryController.updateInventory);

router.delete("/:id", inventoryController.deleteInventory);

router.post("/decrease", inventoryController.decreaseStock);

router.post("/increase", inventoryController.increaseStock);

module.exports = router;
