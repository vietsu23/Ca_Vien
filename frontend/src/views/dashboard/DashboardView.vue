<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6">
    <!-- HEADER -->
    <header
      class="flex justify-between items-center bg-white p-4 shadow rounded-xl mb-6"
    >
      <h1 class="text-xl sm:text-2xl font-bold text-gray-700">
        Dashboard quản lý
      </h1>

      <div class="flex items-center gap-3">
        <span class="text-gray-600 font-medium">
          {{ staff?.name || "Nhân viên" }}
        </span>

        <button
          class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
          @click="logout"
        >
          Đăng xuất
        </button>
      </div>
    </header>

    <!-- STAT CARDS -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div
        v-for="card in statCards"
        :key="card.title"
        class="bg-white p-4 rounded-xl shadow flex flex-col items-start"
      >
        <p class="text-sm text-gray-500">{{ card.title }}</p>
        <p class="text-2xl font-bold mt-1">{{ card.value }}</p>
      </div>
    </div>

    <!-- CURRENT SHIFT -->
    <div class="bg-white p-5 rounded-xl shadow mb-6">
      <h2 class="text-lg font-bold mb-3 text-gray-700">
        Ca làm việc hiện tại
      </h2>

      <div v-if="currentShift" class="space-y-2">
        <p><strong>Mã ca:</strong> {{ currentShift._id }}</p>
        <p><strong>Người mở ca:</strong> {{ currentShift.openedByName }}</p>
        <p><strong>Tiền mở ca:</strong> {{ currentShift.openingCash }} VND</p>
        <p>
          <strong>Thời gian:</strong>
          {{ new Date(currentShift.createdAt).toLocaleString() }}
        </p>
      </div>

      <p v-else class="text-gray-500">Chưa có ca nào đang mở.</p>
    </div>

    <!-- QUICK ACTIONS -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <button
        v-for="action in quickActions"
        :key="action.label"
        class="bg-blue-600 text-white p-4 rounded-xl shadow hover:bg-blue-700 transition"
        @click="go(action.route)"
      >
        {{ action.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  BillService,
  ShiftService,
  InventoryService,
  StaffService,
} from "@/services/apiService";

const staff = ref(JSON.parse(localStorage.getItem("staff")));

const statCards = ref([
  { title: "Tổng doanh thu hôm nay", value: "0đ" },
  { title: "Tổng đơn hôm nay", value: 0 },
  { title: "Sản phẩm tồn kho", value: 0 },
  { title: "Tổng nhân viên", value: 0 },
]);

const currentShift = ref(null);

const quickActions = [
  { label: "Quản lý Hóa đơn", route: "/bills" },
  { label: "Quản lý Sản phẩm", route: "/products" },
  { label: "Quản lý Nhân viên", route: "/staffs" },
  { label: "Quản lý Ca", route: "/shifts" },
];

// Lấy dữ liệu thống kê
const loadDashboard = async () => {
  try {
    // 1. Lấy tổng bill hôm nay
    const billsRes = await BillService.getAll();
    const today = new Date().toISOString().split("T")[0];

    const todaysBills = billsRes.data.filter((b) =>
      b.createdAt.startsWith(today)
    );

    const revenue = todaysBills.reduce(
      (sum, bill) => sum + (bill.total || 0),
      0
    );

    statCards.value[0].value = revenue.toLocaleString() + "đ";
    statCards.value[1].value = todaysBills.length;

    // 2. Inventory
    const invRes = await InventoryService.getAll();
    statCards.value[2].value = invRes.data.length;

    // 3. Staff count
    const staffRes = await StaffService.getAll();
    statCards.value[3].value = staffRes.data.length;

    // 4. Current shift
    if (staff.value?.branchId) {
      const shiftRes = await ShiftService.getCurrentByBranchId(
        staff.value.branchId
      );
      currentShift.value = shiftRes.data || null;
    }
  } catch (err) {
    console.log("Dashboard error:", err);
  }
};

const go = (route) => {
  window.location.href = route;
};

const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};

onMounted(() => {
  loadDashboard();
});
</script>

<style scoped>
</style>
