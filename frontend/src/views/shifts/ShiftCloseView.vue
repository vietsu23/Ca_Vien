<template>
  <div class="container py-4 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4 text-center">Đóng ca</h1>

    <div v-if="shift" class="border rounded p-4 space-y-3 shadow-sm">
      <p><strong>Tiền mở ca:</strong> {{ formatPrice(shift.openingCash) }} đ</p>
      <p><strong>Doanh thu hiện tại:</strong> {{ formatPrice(totalRevenue) }} đ</p>
      <p><strong>Doanh thu tiền mặt:</strong> {{ formatPrice(cashRevenue) }} đ</p>
    <p><strong>Doanh thu chuyển khoản:</strong> {{ formatPrice(cardRevenue) }} đ</p>
      <p><strong>Số đơn hàng:</strong> {{ shift.totalOrders || bills.length }}</p>

      <!-- Nhập tiền mặt cuối ca -->
      <div class="mt-3">
        <label for="closingCash" class="form-label fw-semibold">Tiền mặt cuối ca:</label>
        <input
          id="closingCash"
          type="number"
          v-model.number="closingCash"
          class="form-control"
          min="0"
          placeholder="Nhập tiền mặt cuối ca"
        />
      </div>

      <div class="mt-4 d-flex gap-2">
        <button
          class="btn btn-success flex-grow-1"
          :disabled="closingCash < 0"
          @click="closeShift"
        >
          Đóng ca
        </button>
        <button class="btn btn-outline-secondary flex-grow-1" @click="cancel">
          Hủy
        </button>
      </div>
    </div>

    <div v-else class="text-center text-muted py-4">
      Không có ca đang mở.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { ShiftService, BillService } from "@/services/apiService";
import { useRouter } from "vue-router";

const router = useRouter();
const shift = ref(null);
const bills = ref([]);
const closingCash = ref(0);

// Lấy thông tin ca hiện tại từ localStorage
const branchId = localStorage.getItem("branchId");
const staff = JSON.parse(localStorage.getItem("staff") || "{}");
const branchName = ref("");

// Tính tổng doanh thu hiện tại từ hóa đơn
const totalRevenue = computed(() =>
  bills.value.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
);
const cashRevenue = computed(() =>
  bills.value
    .filter(b => b.paymentMethod === "cash")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
);

const cardRevenue = computed(() =>
  bills.value
    .filter(b => b.paymentMethod === "card")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
);


// Load ca hiện tại
const loadCurrentShift = async () => {
  if (!branchId) return;

  try {
    const res = await ShiftService.getCurrentByBranchId(branchId);
    shift.value = res.data;

    // Lấy danh sách hóa đơn của ca
    const billsRes = await BillService.getByShiftId(shift.value._id);
    bills.value = billsRes.data || [];
  } catch (err) {
    console.error(err);
    shift.value = null;
  }
};

onMounted(() => {
  branchName.value = JSON.parse(localStorage.getItem("branch"))?.name || "";
  loadCurrentShift();
});

// Đóng ca
const closeShift = async () => {
  if (!shift.value) return;

  try {
    await ShiftService.close({
      shiftId: shift.value._id,
      closedBy: staff._id,
      closingCash: closingCash.value,
    });
    alert("Đóng ca thành công!");
    localStorage.removeItem("shiftId");
    router.push("/branches");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.error || "Không thể đóng ca");
  }
};

// Hủy và quay lại
const cancel = () => {
  router.push("/inventories");
};

// Format tiền
const formatPrice = (value) => value ? new Intl.NumberFormat("vi-VN").format(value) : 0;
</script>
