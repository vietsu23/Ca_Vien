const Shift = require('../models/shift');
const Bill = require('../models/bill');

const shiftController = {

    getAllShifts: async (req, res) => {
        try {
            const shifts = await Shift.find()
                .populate("openedBy")
                .populate("closedBy");

            res.json(shifts);
        } catch (err) {
            console.error("getAllShifts Error:", err);
            res.status(500).json({ error: "Không thể lấy danh sách ca" });
        }
    },

    getShiftById: async (req, res) => {
        try {
            const shift = await Shift.findById(req.params.id)
                .populate("openedBy")
                .populate("closedBy");

            if (!shift) {
                return res.status(404).json({ error: "Ca không tồn tại" });
            }

            res.json(shift);
        } catch (err) {
            console.error("getShiftById Error:", err);
            res.status(500).json({ error: "Không thể lấy thông tin ca" });
        }
    },

   
    openShift: async (req, res) => {
        try {
            const { branchId, openedBy, openingCash } = req.body;

            if (!branchId || !openedBy || !openingCash) {
                return res.status(400).json({ error: "Thiếu thông tin mở ca" });
            }

            // Kiểm tra chi nhánh có ca đang mở hay không
            const existingShift = await Shift.findOne({
                branchId,
                closingCash: { $exists: false }
            });

            if (existingShift) {
                return res.status(400).json({ error: "Chi nhánh đang có ca chưa đóng" });
            }

            const newShift = new Shift({
                branchId,
                openedBy,
                openingCash,
            });

            const savedShift = await newShift.save();
            res.status(201).json(savedShift);

        } catch (err) {
            console.error("openShift Error:", err);
            res.status(500).json({ error: "Không thể mở ca" });
        }
    },

    closeShift: async (req, res) => {
        try {
            const { shiftId, closedBy, closingCash } = req.body;

            const shift = await Shift.findById(shiftId);
            if (!shift) {
                return res.status(404).json({ error: "Ca không tồn tại" });
            }

            if (shift.closingCash) {
                return res.status(400).json({ error: "Ca này đã được đóng rồi" });
            }

            // Tính doanh thu ca (Dựa trên hóa đơn của ca đó)
            const bills = await Bill.find({ shiftId });

            const totalRevenue = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
            const totalOrders = bills.length;

            shift.closedBy = closedBy;
            shift.closingCash = closingCash;
            shift.totalRevenue = totalRevenue;
            shift.totalOrders = totalOrders;

            const updatedShift = await shift.save();

            res.json(updatedShift);

        } catch (err) {
            console.error("closeShift Error:", err);
            res.status(500).json({ error: "Không thể đóng ca" });
        }
    },

    getShiftsByBranch: async (req, res) => {
        try {
            const { branchId } = req.params;

            const shifts = await Shift.find({ branchId })
                .populate("openedBy")
                .populate("closedBy");

            res.json(shifts);
        } catch (err) {
            console.error("getShiftsByBranch Error:", err);
            res.status(500).json({ error: "Không thể lấy ca theo chi nhánh" });
        }
    },

   
    getShiftsByDate: async (req, res) => {
        try {
            const { date } = req.query;

            const start = new Date(date);
            const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

            const shifts = await Shift.find({
                createdAt: { $gte: start, $lt: end }
            });

            if (!shifts.length) {
                return res.status(404).json({ error: "Không có ca nào trong ngày này" });
            }

            res.json(shifts);

        } catch (err) {
            console.error("getShiftsByDate Error:", err);
            res.status(500).json({ error: "Không thể lấy ca theo ngày" });
        }
    },

    
    getCurrentShiftByBranch: async (req, res) => {
        try {
            const { branchId } = req.params;

            const shift = await Shift.findOne({
                branchId,
                closingCash: { $exists: false }
            });

            if (!shift) {
                return res.status(404).json({ error: "Chi nhánh không có ca đang mở" });
            }

            res.json(shift);

        } catch (err) {
            console.error("getCurrentShift Error:", err);
            res.status(500).json({ error: "Không thể lấy ca đang mở" });
        }
    },

   
    deleteShift: async (req, res) => {
        try {
            const shift = await Shift.findByIdAndDelete(req.params.id);
            if (!shift) {
                return res.status(404).json({ error: "Ca không tồn tại" });
            }

            res.json({ message: "Xóa ca thành công" });
        } catch (err) {
            console.error("deleteShift Error:", err);
            res.status(500).json({ error: "Không thể xóa ca" });
        }
    },

};

module.exports = shiftController;
