<template>
  <div class="p-4 max-w-xl mx-auto">
    <h2 class="text-xl font-bold mb-4 text-center">Chỉnh sửa nhân viên</h2>

    <div class="space-y-3">
      <input v-model="form.name" type="text" placeholder="Tên" class="w-full p-2 border rounded" />
      <input v-model="form.email" type="email" placeholder="Email" class="w-full p-2 border rounded" />
      <input v-model="form.role" type="text" placeholder="Vai trò" class="w-full p-2 border rounded" />
      <input v-model="form.branchId" type="text" placeholder="ID Chi nhánh" class="w-full p-2 border rounded" />

      <button @click="update" class="w-full bg-green-500 text-white p-2 rounded">
        Cập nhật
      </button>
    </div>
  </div>
</template>

<script>
import { StaffService } from "@/services/apiService";

export default {
  name: "StaffEditView",
  data() {
    return {
      form: {
        name: "",
        email: "",
        role: "",
        branchId: "",
      },
    };
  },
  methods: {
    async fetchStaff() {
      const id = this.$route.params.id;
      const res = await StaffService.getById(id);
      this.form = res.data;
    },
    async update() {
      const id = this.$route.params.id;

      try {
        await StaffService.update(id, this.form);
        alert("Cập nhật thành công!");
        this.$router.push("/staffs");
      } catch (err) {
        console.error(err);
        alert("Lỗi cập nhật!");
      }
    },
  },
  mounted() {
    this.fetchStaff();
  },
};
</script>
