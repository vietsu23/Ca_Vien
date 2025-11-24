<template>
  <div class="p-4 max-w-xl mx-auto">
    <h2 class="text-xl font-bold mb-4 text-center">Thêm nhân viên</h2>

    <div class="space-y-3">
      <input v-model="form.name" type="text" placeholder="Tên" class="w-full p-2 border rounded" />
      <input v-model="form.email" type="email" placeholder="Email" class="w-full p-2 border rounded" />
      <input v-model="form.password" type="password" placeholder="Mật khẩu" class="w-full p-2 border rounded" />
      <input v-model="form.role" type="text" placeholder="Vai trò" class="w-full p-2 border rounded" />
      <input v-model="form.branchId" type="text" placeholder="ID Chi nhánh" class="w-full p-2 border rounded" />

      <button @click="create" class="w-full bg-blue-500 text-white p-2 rounded">
        Tạo nhân viên
      </button>
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
        email: "",
        password: "",
        role: "",
        branchId: "",
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
        alert("Lỗi tạo nhân viên!");
      }
    },
  },
};
</script>
