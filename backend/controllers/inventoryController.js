const Inventory = require('../models/inventory');
const Product = require('../models/product');
const Branch = require('../models/branch');

const inventoryController = {
    // Lấy toàn bộ tồn kho
    getAllInventories: async (req, res) => {
        try {
            const inventories = await Inventory.find()
                .populate('branchId', 'name')
                .populate('productId', 'name price');

            res.json(inventories);
        } catch (error) {
            res.status(500).json({ error: 'Không thể lấy danh sách tồn kho' });
        }
    },

    // Lấy tồn kho theo chi nhánh
    getInventoryByBranch: async (req, res) => {
        try {
            const inventories = await Inventory.find({ branchId: req.params.branchId })
                .populate('productId', 'name price');

            res.json(inventories);
        } catch (error) {
            res.status(500).json({ error: 'Không thể lấy tồn kho theo chi nhánh' });
        }
    },

    // Lấy tồn kho theo sản phẩm
    getInventoryByProduct: async (req, res) => {
        try {
            const inventories = await Inventory.find({ productId: req.params.productId })
                .populate('branchId', 'name');

            res.json(inventories);
        } catch (error) {
            res.status(500).json({ error: 'Không thể lấy tồn kho theo sản phẩm' });
        }
    },

    // Thêm tồn kho mới
    addInventory: async (req, res) => {
        try {
            const { branchId, productId, quantity } = req.body;

            if (!branchId || !productId || quantity == null) {
                return res.status(400).json({ error: 'Vui lòng nhập đủ thông tin tồn kho' });
            }

            const existing = await Inventory.findOne({ branchId, productId });
            if (existing) {
                return res.status(400).json({ error: 'Sản phẩm đã tồn tại trong kho chi nhánh này' });
            }

            const newInventory = new Inventory({ branchId, productId, quantity });
            const saved = await newInventory.save();

            res.status(201).json(saved);
        } catch (error) {
            res.status(500).json({ error: 'Không thể thêm tồn kho' });
        }
    },

    // Cập nhật tồn kho
    updateInventory: async (req, res) => {
        try {
            const updated = await Inventory.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            if (!updated) {
                return res.status(404).json({ error: 'Không tìm thấy tồn kho' });
            }

            res.json(updated);
        } catch (error) {
            res.status(500).json({ error: 'Không thể cập nhật tồn kho' });
        }
    },

    // Xóa 1 dòng tồn kho
    deleteInventory: async (req, res) => {
        try {
            const deleted = await Inventory.findByIdAndDelete(req.params.id);

            if (!deleted) {
                return res.status(404).json({ error: 'Không tìm thấy tồn kho để xóa' });
            }

            res.json({ message: 'Xoá tồn kho thành công' });
        } catch (error) {
            res.status(500).json({ error: 'Không thể xóa tồn kho' });
        }
    },

    // Giảm tồn kho sau khi bán hàng
    decreaseStock: async (req, res) => {
        try {
            const { branchId, productId, quantity } = req.body;

            const inventory = await Inventory.findOne({ branchId, productId });
            if (!inventory) {
                return res.status(404).json({ error: 'Không tìm thấy tồn kho sản phẩm này' });
            }

            if (inventory.quantity < quantity) {
                return res.status(400).json({ error: 'Tồn kho không đủ' });
            }

            inventory.quantity -= quantity;
            await inventory.save();

            res.json(inventory);
        } catch (error) {
            res.status(500).json({ error: 'Không thể giảm tồn kho' });
        }
    },

    // Tăng tồn kho (nhập hàng)
    increaseStock: async (req, res) => {
        try {
            const { branchId, productId, quantity } = req.body;

            let inventory = await Inventory.findOne({ branchId, productId });

            if (!inventory) {
                inventory = new Inventory({ branchId, productId, quantity });
            } else {
                inventory.quantity += quantity;
            }

            await inventory.save();
            res.json(inventory);
        } catch (error) {
            res.status(500).json({ error: 'Không thể tăng tồn kho' });
        }
    }
};

module.exports = inventoryController;
