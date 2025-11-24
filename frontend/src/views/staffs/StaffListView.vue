<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-4 text-center">Danh sách nhân viên</h2>

    <!-- Search -->
    <input
      v-model="search"
      type="text"
      placeholder="Tìm nhân viên..."
      class="w-full p-2 border rounded mb-4"
    />

    <!-- Button -->
    <button
      @click="goCreate"
      class="bg-blue-500 text-white px-4 py-2 rounded mb-4"
    >
      + Thêm nhân viên
    </button>

    <!-- Staff table -->
    <div class="overflow-x-auto">
      <table class="w-full border">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2">Tên</th>
            <th class="border p-2">Email</th>
            <th class="border p-2">Vai trò</th>
            <th class="border p-2">Chi nhánh</th>
            <th class="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="staff in filteredStaff" :key="staff._id">
            <td class="border p-2">{{ staff.name }}</td>
            <td class="border p-2">{{ staff.email }}</td>
            <td class="border p-2">{{ staff.role }}</td>
            <td class="border p-2">{{ staff.branchId?.name }}</td>
            <td class="border p-2">
              <button
                @click="edit(staff._id)"
                class="bg-green-500 text-white px-3 py-1 rounded"
              >
                Sửa
              </button>
              <button
                @click="remove(staff._id)"
                class="bg-red-500 text-white px-3 py-1 rounded ml-2"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { StaffService } from "@/services/apiService";
import { useRouter } from "vue-router";

export default {
  name: "StaffListView",
  data() {
    return {
      staffs: [],
      search: "",
    };
  },
  computed: {
    filteredStaff() {
      return this.staffs.filter((s) =>
        s.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async fetchStaff() {
      const res = await StaffService.getAll();
      this.staffs = res.data;
    },
    goCreate() {
      this.router.push("/staffs/create");
    },
    edit(id) {
      this.router.push(`/staffs/edit/${id}`);
    },
    async remove(id) {
      if (confirm("Xóa nhân viên này?")) {
        await StaffService.delete(id);
        this.fetchStaff();
      }
    },
  },
  mounted() {
    this.fetchStaff();
  },
};
</script>
