const Staff = require('../models/staff');
const bcrypt = require('bcrypt');

const staffController = {
    getAllStaffs: async (req, res) => {
        try {
            const staffs = await Staff.find().select("-password");
            return res.json(staffs);
        } catch (error) {
            console.error("GetAllStaffs Error:", error);
            return res.status(500).json({ message: "Không thể lấy danh sách nhân viên" });
        }
    },

 
    getStaffById: async (req, res) => {
        try {
            const staff = await Staff.findById(req.params.id).select("-password");
            if (!staff) {
                return res.status(404).json({ error: "Nhân viên không tồn tại" });
            }
            return res.json(staff);
        } catch (error) {
            console.error("GetStaffById Error:", error);
            return res.status(500).json({ error: "Lỗi khi lấy thông tin nhân viên" });
        }
    },

    addStaff: async (req, res) => {
        try {
            const { name, phone, password, role } = req.body;

            if (!name || !phone || !password) {
                return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin nhân viên" });
            }

            // Check phone trùng
            const existing = await Staff.findOne({ phone });
            if (existing) {
                return res.status(400).json({ error: "Số điện thoại đã tồn tại" });
            }

            // Băm mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            const newStaff = new Staff({
                name,
                phone,
                password: hashedPassword,
                role: role || "staff",
            });

            const savedStaff = await newStaff.save();
            return res.status(201).json({
                message: "Tạo nhân viên thành công",
                staff: {
                    _id: savedStaff._id,
                    name: savedStaff.name,
                    phone: savedStaff.phone,
                    role: savedStaff.role,
                    createdAt: savedStaff.createdAt
                }
            });

        } catch (error) {
            console.error("AddStaff Error:", error);
            return res.status(500).json({ error: "Lỗi khi thêm nhân viên mới" });
        }
    },


    updateStaff: async (req, res) => {
        try {
            const id = req.params.id;

            let updateData = { ...req.body };

            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }

            const updatedStaff = await Staff.findByIdAndUpdate(id, updateData, { new: true }).select("-password");

            if (!updatedStaff) {
                return res.status(404).json({ error: "Nhân viên không tồn tại" });
            }

            return res.json(updatedStaff);

        } catch (error) {
            console.error("UpdateStaff Error:", error);
            return res.status(500).json({ error: "Lỗi khi cập nhật nhân viên" });
        }
    },


    deleteStaff: async (req, res) => {
        try {
            const staff = await Staff.findByIdAndDelete(req.params.id);
            if (!staff) {
                return res.status(404).json({ error: "Nhân viên không tồn tại" });
            }
            return res.json({ message: "Xóa nhân viên thành công" });
        } catch (error) {
            console.error("DeleteStaff Error:", error);
            return res.status(500).json({ error: "Lỗi khi xóa nhân viên" });
        }
    },

    loginStaff: async (req, res) => {
        try {
            const { phone, password } = req.body;

            const staff = await Staff.findOne({ phone });
            if (!staff) {
                return res.status(404).json({ error: "Số điện thoại không tồn tại" });
            }

            const isMatch = await bcrypt.compare(password, staff.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Sai mật khẩu" });
            }

            return res.json({
                message: "Đăng nhập thành công",
                staff: {
                    _id: staff._id,
                    name: staff.name,
                    phone: staff.phone,
                    role: staff.role
                }
            });

        } catch (error) {
            console.error("LoginStaff Error:", error);
            return res.status(500).json({ error: "Lỗi khi đăng nhập" });
        }
    }
};

module.exports = staffController;
