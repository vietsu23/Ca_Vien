<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light px-3">
    <div class="card shadow-lg border-0 rounded-4" style="max-width: 420px; width: 100%;">
      <div class="card-body p-4 p-md-5">

        <!-- Title -->
        <h2 class="text-center mb-4 fw-bold text-secondary">Đăng nhập hệ thống</h2>

        <!-- Form -->
        <form @submit.prevent="handleLogin">
          
          <!-- Username -->
          <div class="mb-3">
            <label class="form-label">Số điện thoại</label>
            <input 
              v-model="form.phone"
              type="text" 
              class="form-control form-control-lg"
              placeholder="Nhập số điện thoại"
              required 
            />
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label class="form-label">Mật khẩu</label>
            <input 
              v-model="form.password"
              type="password" 
              class="form-control form-control-lg"
              placeholder="Nhập mật khẩu"
              required 
            />
          </div>

          <!-- Error Message -->
          <p v-if="errorMessage" class="text-danger text-center small">
            {{ errorMessage }}
          </p>

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="btn btn-primary btn-lg w-100 mt-2"
            :disabled="loading"
          >
            <span v-if="loading">Đang đăng nhập...</span>
            <span v-else>Đăng nhập</span>
          </button>

        </form>

        <!-- Footer -->
        <p class="text-center text-muted small mt-4 mb-0">
          © 2025 Cavien System
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { StaffService } from "@/services/apiService";

const form = ref({
  phone: "",
  password: "",
});

const loading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const res = await StaffService.login(form.value);

    if (res.data && res.data.staff) {
      const staff = res.data.staff;
      localStorage.setItem("staff", JSON.stringify(staff));

      // Kiểm tra role
      if (staff.role === "admin") {
        window.location.href = "/dashboard"; // Nếu là manager
      } else {
        window.location.href = "/branches"; // Nếu là nhân viên bình thường
      }

    } else {
      errorMessage.value = "Sai tài khoản hoặc mật khẩu!";
    }

  } catch (err) {
    errorMessage.value = "Đăng nhập thất bại!";
  } finally {
    loading.value = false;
  }
};

</script>

<style scoped>
.card {
  border-radius: 1.5rem;
}
</style>
