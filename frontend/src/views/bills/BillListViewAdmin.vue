<template>
  <div class="container py-4">
    <h1 class="text-center mb-4">Danh sách tất cả hóa đơn</h1>

    <!-- Bảng hóa đơn -->
     <div class="d-flex justify-content-end mb-2">
  <button class="btn btn-danger" @click="deleteAllBills">Xóa tất cả hóa đơn</button>
</div>

    <div class="table-responsive border rounded">
      <table class="table table-striped table-bordered mb-0">
        <thead class="table-light">
          <tr>
            <th>Mã HĐ</th>
            <th>Nhân viên</th>
            <th>Chi nhánh</th>
            <th>Tổng tiền</th>
            <th>Ngày</th>
            <th>Thanh toán</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in bills" :key="b._id">
            <td>{{ b.name }}</td>
            <td>{{ b.staff?.name || '---' }}</td>
            <td>{{ b.branchId?.name || '---' }}</td>
            <td>{{ formatPrice(b.totalAmount) }} đ</td>
            <td>{{ formatDate(b.sellDate || b.createdAt) }}</td>
            <td class="text-center">
              <span v-if="b.paymentMethod === 'cash'" class="text-success">💵</span>
              <span v-else-if="b.paymentMethod === 'card'" class="text-primary">💳</span>
              <span v-else>---</span>
            </td>
            <td>
              <button class="btn btn-sm btn-outline-warning me-1" @click="openEditDialog(b)">Chỉnh sửa</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteBill(b._id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal chỉnh sửa -->
    <div v-if="editDialogVisible" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-content p-3">
          <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thanh toán HĐ {{ editingBill?.name }}</h5>
            <button type="button" class="btn-close" @click="closeEditDialog"></button>
          </div>
          <div class="modal-body">
            <label>Hình thức thanh toán:</label>
            <select v-model="editingBill.paymentMethod" class="form-select">
              <option value="cash">Tiền mặt</option>
              <option value="card">Chuyển khoản</option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeEditDialog">Hủy</button>
            <button class="btn btn-primary" @click="savePaymentMethod">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { BillService } from "@/services/apiService";

const bills = ref([]);
const editDialogVisible = ref(false);
const editingBill = ref(null);

const loadData = async () => {
  try {
    const res = await BillService.getAll();
    bills.value = res.data || [];
  } catch (err) {
    console.error(err);
  }
};

const openEditDialog = (bill) => {
  editingBill.value = { ...bill }; // clone để chỉnh sửa
  editDialogVisible.value = true;
};

const closeEditDialog = () => {
  editDialogVisible.value = false;
  editingBill.value = null;
};

const savePaymentMethod = async () => {
  try {
    await BillService.update(editingBill.value._id, { paymentMethod: editingBill.value.paymentMethod });
    // Cập nhật local
    const idx = bills.value.findIndex(b => b._id === editingBill.value._id);
    if (idx !== -1) bills.value[idx].paymentMethod = editingBill.value.paymentMethod;
    closeEditDialog();
  } catch (err) {
    console.error("Cập nhật lỗi", err);
  }
};

const deleteBill = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa hóa đơn này?")) return;
  try {
    await BillService.delete(id);
    bills.value = bills.value.filter(b => b._id !== id);
  } catch (err) {
    console.error(err);
  }
};
const deleteAllBills = async () => {
  if (!confirm("Bạn có chắc muốn xóa tất cả hóa đơn?")) return;
  try {
    await BillService.deleteAll(); // gọi API xóa tất cả
    bills.value = [];
  } catch (err) {
    console.error("Xóa tất cả hóa đơn lỗi", err);
  }
};


onMounted(loadData);

const formatDate = (str) => str ? new Date(str).toLocaleString() : '---';
const formatPrice = (value) => value ? new Intl.NumberFormat("vi-VN").format(value) : 0;
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0; /* top/right/bottom/left = 0 */
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-dialog {
  max-width: 400px;
  width: 100%;
  background-color: #fff;
  border-radius: 0.3rem;
  z-index: 2001;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.3);
}
</style>
