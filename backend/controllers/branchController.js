const Branch = require("../models/branch");

const branchController = {

    // Lấy tất cả chi nhánh
    getAllBranches: async (req, res) => {
        try {
            const branches = await Branch.find();
            res.json(branches);
        } catch (error) {
            res.status(500).json({ error: "Không thể lấy danh sách chi nhánh" });
        }
    },

    // Lấy chi nhánh theo ID
    getBranchById: async (req, res) => {
        try {
            const branch = await Branch.findById(req.params.id);

            if (!branch) {
                return res.status(404).json({ error: "Chi nhánh không tồn tại" });
            }

            res.json(branch);
        } catch (error) {
            res.status(500).json({ error: "Lỗi khi lấy thông tin chi nhánh" });
        }
    },

    // Tạo chi nhánh mới
    createBranch: async (req, res) => {
        try {
            const { name, phone, address } = req.body;

            if (!name || !phone) {
                return res.status(400).json({ error: "Tên và số điện thoại chi nhánh là bắt buộc" });
            }

            // Kiểm tra số điện thoại trùng
            const existing = await Branch.findOne({ phone });
            if (existing) {
                return res.status(400).json({ error: "Số điện thoại đã tồn tại" });
            }

            const newBranch = new Branch({
                name,
                phone,
                address,
            });

            const savedBranch = await newBranch.save();

            res.status(201).json(savedBranch);
        } catch (error) {
            res.status(500).json({ error: "Lỗi khi tạo chi nhánh mới" });
        }
    },

    // Cập nhật chi nhánh
    updateBranch: async (req, res) => {
        try {
            const { name, phone, address } = req.body;

            const updatedBranch = await Branch.findByIdAndUpdate(
                req.params.id,
                { name, phone, address },
                { new: true, runValidators: true }
            );

            if (!updatedBranch) {
                return res.status(404).json({ error: "Chi nhánh không tồn tại" });
            }

            res.json(updatedBranch);
        } catch (error) {
            res.status(500).json({ error: "Lỗi khi cập nhật chi nhánh" });
        }
    },

    // Xóa chi nhánh
    deleteBranch: async (req, res) => {
        try {
            const branch = await Branch.findByIdAndDelete(req.params.id);

            if (!branch) {
                return res.status(404).json({ error: "Chi nhánh không tồn tại" });
            }

            res.json({ message: "Xóa chi nhánh thành công" });
        } catch (error) {
            res.status(500).json({ error: "Lỗi khi xóa chi nhánh" });
        }
    },

    // Tìm kiếm chi nhánh theo tên
    searchBranchByName: async (req, res) => {
        try {
            const { keyword } = req.query;

            const branches = await Branch.find({
                name: { $regex: keyword, $options: "i" }
            });

            res.json(branches);
        } catch (error) {
            res.status(500).json({ error: "Lỗi khi tìm kiếm chi nhánh" });
        }
    },

};

module.exports = branchController;
