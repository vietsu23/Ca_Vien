const Bill = require("../models/bill");
const Inventory = require("../models/inventory");
const Product = require("../models/product");

const billController = {

    // Lấy tất cả hóa đơn
    getAllBills: async (req, res) => {
        try {
            const bills = await Bill.find()
                .populate("branchId")
                .populate("staff")
                .populate("shiftId")
                .populate("products.productId");

            res.json(bills);
        } catch (error) {
            res.status(500).json({ message: "Không thể lấy thông tin hóa đơn" });
        }
    },

    // Lấy hóa đơn theo ID
    getBillById: async (req, res) => {
        try {
            const bill = await Bill.findById(req.params.id)
                .populate("branchId")
                .populate("staff")
                .populate("shiftId")
                .populate("products.productId");

            if (!bill) return res.status(404).json({ error: "Hóa đơn không tồn tại" });

            res.json(bill);
        } catch (error) {
            res.status(500).json({ error: "Lỗi khi lấy thông tin hóa đơn" });
        }
    },

    // ➕ Tạo hóa đơn từ tồn kho
    createBill: async (req, res) => {
        const session = await Bill.startSession();
        session.startTransaction();

        try {
            const { products, totalAmount, perdiscount, staff, branchId, shiftId, paymentMethod } = req.body;

            if (!products || !staff || !branchId) {
                return res.status(400).json({ error: "Thiếu thông tin hóa đơn" });
            }

            // Kiểm tra từng sản phẩm trong tồn kho
            for (let item of products) {

                const inventory = await Inventory.findOne({
                    branchId,
                    productId: item.productId
                }).session(session);

                if (!inventory) {
                    throw new Error(`Chi nhánh không có sản phẩm ID ${item.productId}`);
                }

                if (inventory.quantity < item.quantity) {
                    throw new Error(`Sản phẩm ${item.productId} không đủ tồn kho`);
                }

                // Trừ tồn kho
                inventory.quantity -= item.quantity;
                await inventory.save({ session });
            }

            // Tạo hóa đơn
            const newBill = new Bill({
                branchId,
                products,
                totalAmount,
                perdiscount,
                staff,
                shiftId,
                paymentMethod,
            });

            const savedBill = await newBill.save({ session });

            await session.commitTransaction();
            session.endSession();

            res.status(201).json(savedBill);

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({ error: error.message || "Lỗi khi tạo hóa đơn" });
        }
    },

    // ❌ Xóa hóa đơn + trả lại tồn kho
    deleteBill: async (req, res) => {
        const session = await Bill.startSession();
        session.startTransaction();

        try {
            const bill = await Bill.findById(req.params.id).session(session);

            if (!bill) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ error: "Hóa đơn không tồn tại" });
            }

            // Trả hàng về tồn kho
            for (let item of bill.products) {
                const inventory = await Inventory.findOne({
                    branchId: bill.branchId,
                    productId: item.productId
                }).session(session);

                if (inventory) {
                    inventory.quantity += item.quantity;
                    await inventory.save({ session });
                }
            }

            await Bill.findByIdAndDelete(req.params.id).session(session);

            await session.commitTransaction();
            session.endSession();

            res.json({ message: "Xóa hóa đơn thành công" });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({ error: "Lỗi khi xóa hóa đơn" });
        }
    },

    // Lấy hóa đơn theo nhân viên
    getBillsByStaffId: async (req, res) => {
        try {
            const bills = await Bill.find({ staff: req.params.staffId })
                .populate("products.productId")
                .populate("branchId")
                .populate("shiftId");

            res.json(bills);
        } catch (error) {
            res.status(500).json({ error: "Lỗi khi lấy hóa đơn theo nhân viên" });
        }
    },

    // Lọc hóa đơn theo ngày
    getBillsByDate: async (req, res) => {
        try {
            const { date } = req.query;

            const start = new Date(date);
            const end = new Date(start.getTime() + 86400000);

            const bills = await Bill.find({
                sellDate: { $gte: start, $lt: end }
            }).populate("products.productId");

            res.json(bills);
        } catch (error) {
            res.status(500).json({ error: "Lỗi khi lấy hóa đơn theo ngày" });
        }
    },

};

module.exports = billController;
