const Product = require('../models/product');
const cloudinary = require('../config/Cloudinary');

const productController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find();
            return res.json(products);
        } catch (error) {
            console.error("GetAllProducts Error:", error);
            return res.status(500).json({ error: "Không thể lấy danh sách sản phẩm" });
        }
    },

    getProductById: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ error: "Sản phẩm không tồn tại" });
            }
            return res.json(product);
        } catch (error) {
            console.error("GetProductById Error:", error);
            return res.status(500).json({ error: "Lỗi khi lấy thông tin sản phẩm" });
        }
    },

    addProduct: async (req, res) => {
        try {
            const { name, price, quantity, description, sale } = req.body;

            if (!name || !price || !quantity) {
                return res.status(400).json({ error: "Thiếu thông tin sản phẩm" });
            }

            // Upload ảnh nếu có
            let imageUrl = "https://via.placeholder.com/150";
            if (req.file) {
                const upload = await cloudinary.uploader.upload(req.file.path, {
                    folder: "Caringfood/productimg",
                    public_id: `${Date.now()}_product`,
                });
                imageUrl = upload.secure_url;
            }

            const newProduct = new Product({
                name,
                price,
                quantity,
                description,
                sale: sale || 0,
                imageUrl
            });

            const savedProduct = await newProduct.save();
            return res.status(201).json(savedProduct);

        } catch (error) {
            console.error("AddProduct Error:", error);
            return res.status(500).json({ error: "Lỗi khi thêm sản phẩm mới" });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const productId = req.params.id;

            const existingProduct = await Product.findById(productId);
            if (!existingProduct) {
                return res.status(404).json({ error: "Sản phẩm không tồn tại" });
            }

            let updateData = { ...req.body };

            // Nếu có upload ảnh mới
            if (req.file) {
                // Xóa ảnh cũ nếu không phải ảnh mặc định
                if (existingProduct.imageUrl && !existingProduct.imageUrl.includes("placeholder")) {
                    const publicId = existingProduct.imageUrl.split('/').slice(-1)[0].split('.')[0];
                    await cloudinary.uploader.destroy(`Caringfood/productimg/${publicId}`);
                }

                const upload = await cloudinary.uploader.upload(req.file.path, {
                    folder: "Caringfood/productimg",
                    public_id: `${productId}_product`,
                    overwrite: true,
                });
                updateData.imageUrl = upload.secure_url;
            }

            const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
            return res.json(updatedProduct);

        } catch (error) {
            console.error("UpdateProduct Error:", error);
            return res.status(500).json({ error: "Lỗi khi cập nhật sản phẩm" });
        }
    },


    deleteProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ error: "Sản phẩm không tồn tại" });
            }

            // Xóa ảnh Cloudinary (nếu có và không phải placeholder)
            if (product.imageUrl && !product.imageUrl.includes("placeholder")) {
                const publicId = product.imageUrl.split('/').slice(-1)[0].split('.')[0];
                await cloudinary.uploader.destroy(`Caringfood/productimg/${publicId}`);
            }

            await Product.findByIdAndDelete(req.params.id);
            return res.json({ message: "Xóa sản phẩm thành công" });

        } catch (error) {
            console.error("DeleteProduct Error:", error);
            return res.status(500).json({ error: "Lỗi khi xóa sản phẩm" });
        }
    },

    importProducts: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ error: "Sản phẩm không tồn tại" });
            }

            let quantityToAdd = Number(req.body.quantity);
            if (!quantityToAdd || quantityToAdd <= 0) {
                return res.status(400).json({ error: "Số lượng nhập phải lớn hơn 0" });
            }

            product.quantity += quantityToAdd;
            await product.save();

            return res.json(product);

        } catch (error) {
            console.error("ImportProduct Error:", error);
            return res.status(500).json({ error: "Lỗi khi nhập số lượng sản phẩm" });
        }
    }
};

module.exports = productController;
