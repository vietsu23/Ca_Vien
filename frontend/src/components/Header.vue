<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
    <div class="container">

      <!-- Logo / Brand -->
      <a class="navbar-brand fw-bold" href="#" @click.prevent="goToInventories">CaVien 69</a>


      <!-- Nút toggle khi màn hình nhỏ -->
      <button
        class="navbar-toggler"
        type="button"
        @click="menuOpen = !menuOpen"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menu chính -->
      <div
        class="collapse navbar-collapse"
        :class="{ show: menuOpen }"
        id="navbarMenu"
      >
        <ul class="navbar-nav ms-auto align-items-center">

          <!-- Thông tin nhân viên -->
          <li class="nav-item me-3">
            <span class="navbar-text fw-semibold">
              {{ staffName }} - {{ branchName }}
              <!-- <span v-if="shiftId">(Ca: {{ shiftId }})</span> -->
            </span>
          </li>

          <!-- Hóa đơn / Doanh thu -->
          <li class="nav-item me-2">
            <div class="d-flex flex-column flex-md-row gap-2">
              <button class="btn btn-outline-primary" @click="goToBills">
                Danh sách hóa đơn
              </button>
            </div>
          </li>

          <!-- Đóng ca -->
          <li class="nav-item me-2">
            <button class="btn btn-outline-success" @click="closeShift">Đóng ca</button>
          </li>

          <!-- Đăng xuất -->
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
import { ShiftService } from "@/services/apiService";

const router = useRouter();
const staffName = ref("");
const branchName = ref("");
const shiftId = ref("");

// Quản lý trạng thái menu trên mobile
const menuOpen = ref(false);
const goToInventories = () => {
  const staff = JSON.parse(localStorage.getItem("staff") || "{}");

  if (staff.role === "admin") {
    router.push("/dashboard"); // Admin thì tới dashboard
  } else {
    router.push("/inventories"); // Nhân viên bình thường
  }
};


onMounted(() => {
  const staff = JSON.parse(localStorage.getItem("staff"));
  staffName.value = staff?.name || "Không xác định";

  const branch = JSON.parse(localStorage.getItem("branch"));
  branchName.value = branch?.name || "";

  shiftId.value = localStorage.getItem("shiftId") || "";
});

// Chuyển hướng
const goToBills = () => {
  menuOpen.value = false; // ẩn menu khi click mobile
  router.push("/bills");
};

const goToRevenue = () => {
  menuOpen.value = false;
  router.push("/revenue");
};

// Đóng ca
const closeShift = () => {
  if (!shiftId.value) {
    alert("Không có ca đang mở!");
    return;
  }

  // Chuyển hướng sang trang đóng ca với shiftId
  router.push({ path: `/shifts/${shiftId.value}/close` });
};

// Đăng xuất
const logout = () => {
  localStorage.removeItem("staff");
  localStorage.removeItem("branchId");
  localStorage.removeItem("shiftId");
  router.push("/");
};
</script>

<style scoped>
.navbar-text {
  font-weight: 500;
}

/* Trên mobile: các nút Hóa đơn / Doanh thu xếp theo cột */
@media (max-width: 767px) {
  .flex-md-row {
    flex-direction: column !important;
  }
}
</style>
