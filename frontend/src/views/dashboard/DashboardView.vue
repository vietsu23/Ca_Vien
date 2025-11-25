<template>
  <div class="container py-4">

    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 fw-bold">Dashboard quản lý</h1>
      <div>
        <span class="me-3">{{ staff?.name || "Nhân viên" }}</span>
        <button class="btn btn-danger btn-sm" @click="logout">Đăng xuất</button>
      </div>
    </div>

    <!-- STAT CARDS -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3" v-for="card in statCards" :key="card.title">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <p class="text-muted mb-1">{{ card.title }}</p>
            <h5 class="card-title fw-bold">{{ card.value }}</h5>
          </div>
        </div>
      </div>
    </div>

    <!-- Doanh thu theo chi nhánh -->
    <div class="card mb-4 shadow-sm">
      <div class="card-header fw-bold">Doanh thu theo chi nhánh hôm nay</div>
      <ul class="list-group list-group-flush">
        <li
          class="list-group-item d-flex justify-content-between align-items-center"
          v-for="(revenue, branchId) in revenueByBranch"
          :key="branchId"
        >
          {{ branchNames[branchId] || branchId }}
          <span class="fw-bold">{{ formatPrice(revenue) }} đ</span>
        </li>
      </ul>
    </div>


    <!-- QUICK ACTIONS -->
    <div class="row g-3">
      <div class="col-6 col-md-3" v-for="action in quickActions" :key="action.label">
        <button class="btn btn-primary w-100 py-3" @click="go(action.route)">
          {{ action.label }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { BillService, ShiftService, InventoryService, StaffService } from "@/services/apiService";

const staff = ref(JSON.parse(localStorage.getItem("staff") || "{}"));
const statCards = ref([
  { title: "Tổng doanh thu hôm nay", value: "0 đ" },
  { title: "Tổng đơn hôm nay", value: 0 },
  { title: "Sản phẩm tồn kho", value: 0 },
  { title: "Tổng nhân viên", value: 0 },
]);

const currentShift = ref(null);
const revenueByBranch = ref({});
const branchNames = ref({}); // lưu tên chi nhánh theo branchId

const quickActions = [
  { label: "Quản lý Hóa đơn", route: "/bills/admin" },
  { label: "Quản lý Sản phẩm", route: "/products" },
  { label: "Quản lý Nhân viên", route: "/staffs" },
  { label: "Quản lý Tồn Kho", route: "/inventories/admin" },
];

// format tiền
const formatPrice = (value) => value ? new Intl.NumberFormat("vi-VN").format(value) : 0;

// load dữ liệu dashboard
const loadDashboard = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 1. Lấy tất cả hóa đơn
    const billsRes = await BillService.getAll();
    const bills = billsRes.data || [];

    // Lọc hóa đơn hôm nay
    const todaysBills = bills.filter(b => b.sellDate.startsWith(today));

    // Tổng doanh thu và số đơn
    const totalRevenue = todaysBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    statCards.value[0].value = formatPrice(totalRevenue) + " đ";
    statCards.value[1].value = todaysBills.length;

    // Doanh thu theo chi nhánh
    const revenueMap = {};
    const branchMap = {};
    for (let bill of todaysBills) {
      const branchId = bill.branchId?._id || bill.branchId;
      const branchName = bill.branchId?.name || branchId;
      revenueMap[branchId] = (revenueMap[branchId] || 0) + (bill.totalAmount || 0);
      branchMap[branchId] = branchName;
    }
    revenueByBranch.value = revenueMap;
    branchNames.value = branchMap;

    // Inventory count
    const invRes = await InventoryService.getAll();
    statCards.value[2].value = invRes.data.length;

    // Staff count
    const staffRes = await StaffService.getAll();
    statCards.value[3].value = staffRes.data.length;

    // Current shift



  } catch (err) {
    console.error("Dashboard error:", err);
  }
};

// chuyển hướng
const go = (route) => {
  window.location.href = route;
};

// logout
const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};

onMounted(() => {
  loadDashboard();
});
</script>

<style scoped>
.card-body p {
  margin: 0;
}
</style>
