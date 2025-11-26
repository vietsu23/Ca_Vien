import axios from "axios";

const api = axios.create({
  baseURL: "https://ca-vien-1.onrender.com/api",   // backend URL
  timeout: 10000,
});

// ================== BILL ==================
export const BillService = {
  getAll() {
    return api.get("/bills");
  },
  getByStaffId(id) {
    return api.get(`/bills/staff/${id}`);
  },
  getByShiftId(shiftId) {
    return api.get(`/bills/shift/${shiftId}`);
  },
  getById(id) {
    return api.get(`/bills/${id}`);
  },
  create(data) {
    return api.post("/bills", data);
  },
  update(id, data) {
    return api.put(`/bills/${id}`, data);
  },
  delete(id) {
    return api.delete(`/bills/${id}`);
  },
  deleteAll() {
    return api.delete("/bills"); // xóa tất cả
  }
};

// ================== SHIFT ==================
export const ShiftService = {
  getAll() {
    return api.get("/shifts");
  },
  getById(id) {
    return api.get(`/shifts/${id}`);
  },
  create(data) {
    return api.post("/shifts/open", data);
  },
  getByBranchId(branchId) {
    return api.get(`/shifts/branch/${branchId}`);
  },
  getCurrentByBranchId(branchId) {
    return api.get(`/shifts/branch/${branchId}/current`);
  },
  delete(id) {
    return api.delete(`/shifts/${id}`);
  },
  close(data) {
    // data: { shiftId, closedBy, closingCash }
    return api.put("/shifts/close", data);
  }
};

// ================== PRODUCT ==================
export const ProductService = {
  getAll() {
    return api.get("/products");
  },
  getById(id) {
    return api.get(`/products/${id}`);
  },
  create(data) {
    return api.post("/products", data);
  },
  update(id, data) {
    return api.put(`/products/${id}`, data);
  },
  delete(id) {
    return api.delete(`/products/${id}`);
  },
};

// ================== BRANCH ==================
export const BranchService = {
  getAll() {
    return api.get("/branches");
  },
  getById(id) {
    return api.get(`/branches/${id}`);
  },
  create(data) {
    return api.post("/branches", data);
  },
  update(id, data) {
    return api.put(`/branches/${id}`, data);
  },
  delete(id) {
    return api.delete(`/branches/${id}`);
  },
};

// ================== STAFF ==================
export const StaffService = {
  login(data) {
    return api.post("/staffs/login", data);
  },
  getAll() {
    return api.get("/staffs");
  },
  getById(id) {
    return api.get(`/staffs/${id}`);
  },
  create(data) {
    return api.post("/staffs", data);
  },
  update(id, data) {
    return api.put(`/staffs/${id}`, data);
  },
  delete(id) {
    return api.delete(`/staffs/${id}`);
  },
};

// ================== INVENTORY ==================
export const InventoryService = {
  getAll() {
    return api.get("/inventories");
  },
  getByBranch(branchId) {
    return api.get(`/inventories/branch/${branchId}`);
  },
  getByProductId(productId) {
    return api.get(`/inventories/product/${productId}`);
  },
  create(data) {
    return api.post("/inventories", data);
  },
  decreaseStock(data) {
    return api.post("/inventories/decrease", data);
  },
  increaseStock(data) {
    return api.post("/inventories/increase", data);
  },
  update(id, data) {
    return api.put(`/inventories/${id}`, data);
  },
  delete(id) {
    return api.delete(`/inventories/${id}`);
  },
};

export default api;
