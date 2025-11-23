const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../config/Multer');

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

router.post("/", upload, productController.addProduct);

router.put("/:id", upload, productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

router.put("/:id/import", productController.importProducts);

module.exports = router;
