<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
    <div class="container">

      <a class="navbar-brand fw-bold" href="#">POS System</a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarMenu"
        aria-controls="navbarMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarMenu">
        <ul class="navbar-nav ms-auto align-items-center">

          <li class="nav-item me-3">
            <span class="navbar-text fw-semibold">
              {{ staffName }} - {{ branchName }} 
              <span v-if="shiftId">(Ca: {{ shiftId }})</span>
            </span>
          </li>

          <!-- Dropdown -->
          <li class="nav-item dropdown me-2">
            <button
              ref="dropdownBtn"
              class="btn btn-outline-primary dropdown-toggle"
              type="button"
            >
              Hóa đơn / Doanh thu
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" @click.prevent="goToBills">Danh sách hóa đơn</a></li>
              <li><a class="dropdown-item" @click.prevent="goToRevenue">Xem doanh thu</a></li>
            </ul>
          </li>

          <li class="nav-item me-2">
            <button class="btn btn-outline-success" @click="closeShift">Đóng ca</button>
          </li>

          <li class="nav-item">
            <button class="btn btn-outline-danger" @click="logout">Đăng xuất</button>
          </li>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as bootstrap from "bootstrap";
import { ShiftService } from "@/services/apiService";

const router = useRouter();
const staffName = ref("");
const branchName = ref("");
const shiftId = ref("");

// Dropdown button ref
const dropdownBtn = ref(null);
let dropdownInstance = null;

onMounted(() => {
  const staff = JSON.parse(localStorage.getItem("staff"));
  staffName.value = staff?.name || "Không xác định";

  const branch = JSON.parse(localStorage.getItem("branch"));
  branchName.value = branch?.name || "";

  shiftId.value = localStorage.getItem("shiftId") || "";

  // Tạo dropdown instance trên nút trigger
  if (dropdownBtn.value) {
    dropdownInstance = new bootstrap.Dropdown(dropdownBtn.value, { autoClose: true });
  }
});

const goToBills = () => {
  if (dropdownInstance) dropdownInstance.hide(); // ẩn dropdown
  router.push("/bills");
};

const goToRevenue = () => {
  if (dropdownInstance) dropdownInstance.hide(); // ẩn dropdown
  router.push("/revenue");
};

const closeShift = async () => {
  if (!shiftId.value) {
    alert("Không có ca đang mở!");
    return;
  }

  try {
    await ShiftService.close(shiftId.value);
    alert("Đã đóng ca thành công!");
    localStorage.removeItem("shiftId");
    router.push("/login");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.error || "Không thể đóng ca!");
  }
};

const logout = () => {
  localStorage.removeItem("staff");
  localStorage.removeItem("branch");
  localStorage.removeItem("shiftId");
  router.push("/login");
};
</script>

<style scoped>
.navbar-text {
  font-weight: 500;
}
</style>
