<template>
  <div class="container py-4" style="max-width: 500px;">
    <h2 class="text-center fw-bold mb-4">Thêm nhân viên</h2>

    <div class="card shadow-sm">
      <div class="card-body">

        <!-- Name -->
        <div class="mb-3">
          <label class="form-label">Tên nhân viên</label>
          <input
            v-model="form.name"
            type="text"
            class="form-control"
            placeholder="Nhập tên"
          />
        </div>

        <!-- Phone -->
        <div class="mb-3">
          <label class="form-label">Số điện thoại</label>
          <input
            v-model="form.phone"
            type="text"
            class="form-control"
            placeholder="Nhập số điện thoại"
          />
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input
            v-model="form.password"
            type="password"
            class="form-control"
            placeholder="Nhập mật khẩu"
          />
        </div>

        <!-- Role -->
        <div class="mb-3">
          <label class="form-label">Vai trò</label>
          <select v-model="form.role" class="form-select">
            <option value="">-- Chọn vai trò --</option>
            <option value="staff">Nhân viên</option>
            <option value="admin">Quản trị</option>
          </select>
        </div>

        <!-- Button -->
        <button
          @click="create"
          class="btn btn-primary w-100 py-2 mt-2"
        >
          Tạo nhân viên
        </button>

      </div>
    </div>
  </div>
</template>
<script>
import { StaffService } from "@/services/apiService";

export default {
  name: "StaffCreateView",
  data() {
    return {
      form: {
        name: "",
        phone: "",
        password: "",
        role: "",
      },
    };
  },
  methods: {
    async create() {
      try {
        await StaffService.create(this.form);
        alert("Tạo nhân viên thành công!");
        this.$router.push("/staffs");
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Lỗi tạo nhân viên!");
      }
    },
  },
};
</script>
