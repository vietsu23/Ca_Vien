<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Chi tiết hóa đơn</h1>

    <!-- Thông tin hóa đơn -->
    <div class="border rounded p-4 space-y-2">
      <p><strong>Mã HĐ:</strong> {{ bill.name || bill._id }}</p>
      <p><strong>Nhân viên:</strong> {{ bill.staff?.name || '---' }}</p>
      <p><strong>Chi nhánh:</strong> {{ bill.branchId?.name || '---' }}</p>
      <p><strong>Ngày:</strong> {{ formatDate(bill.sellDate || bill.createdAt) }}</p>
      <p><strong>Tổng tiền:</strong> {{ formatPrice(bill.totalAmount) }} đ</p>
      <p>
        <strong>Thanh toán:</strong>
        <span v-if="bill.paymentMethod === 'cash'" title="Tiền mặt">💵</span>
        <span v-else-if="bill.paymentMethod === 'card'" title="Chuyển khoản">💳</span>
        <span v-else>---</span>
      </p>
    </div>

    <!-- Danh sách sản phẩm -->
    <h2 class="text-xl font-semibold mt-6 mb-3">Danh sách sản phẩm</h2>
    <div class="border rounded overflow-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 border">Sản phẩm</th>
            <th class="p-2 border">Số lượng</th>
            <th class="p-2 border">Giá</th>
            <th class="p-2 border">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in bill.products" :key="item._id">
            <td class="p-2 border">{{ item.productId?.name || '---' }}</td>
            <td class="p-2 border">{{ item.quantity || 0 }}</td>
            <td class="p-2 border">{{ formatPrice(item.productId?.price) }} đ</td>
            <td class="p-2 border">{{ formatPrice((item.productId?.price || 0) * (item.quantity || 0)) }} đ</td>
          </tr>
        </tbody>
      </table>
    </div>

    <router-link
      to="/bills"
      class="mt-4 block text-center text-blue-600"
    >
      ← Quay lại danh sách
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { BillService } from "@/services/apiService";

const route = useRoute();
const id = route.params.id;

// Khởi tạo bill an toàn
const bill = ref({
  products: [],
  staff: {},
  branchId: {},
  shiftId: {},
  totalAmount: 0,
  paymentMethod: null,
  sellDate: null,
});

// Lấy dữ liệu hóa đơn
onMounted(async () => {
  try {
    const res = await BillService.getById(id);
    bill.value = res.data; // backend trả trực tiếp bill
  } catch (err) {
    console.error("Lỗi khi lấy hóa đơn:", err);
    alert("Không thể tải thông tin hóa đơn!");
  }
});

// Format ngày
const formatDate = (str) => str ? new Date(str).toLocaleString() : '---';

// Format số tiền
const formatPrice = (value) => value ? new Intl.NumberFormat("vi-VN").format(value) : 0;
</script>
