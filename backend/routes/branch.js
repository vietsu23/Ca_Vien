const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');

router.get("/", branchController.getAllBranches);

router.get("/search", branchController.searchBranchByName);

router.post("/", branchController.createBranch);

router.put("/:id", branchController.updateBranch);

router.delete("/:id", branchController.deleteBranch);

router.get("/:id", branchController.getBranchById);

module.exports = router;
