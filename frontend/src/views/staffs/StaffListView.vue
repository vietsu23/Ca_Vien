<template>
  <div class="container py-4">
    <h2 class="text-center fw-bold mb-4">Danh sách nhân viên</h2>

    <!-- Search -->
    <div class="input-group mb-4">
      <span class="input-group-text">
        <i class="bi bi-search"></i>
      </span>
      <input
        v-model="search"
        type="text"
        class="form-control"
        placeholder="Tìm nhân viên..."
      />
    </div>

    <!-- Button -->
    <div class="mb-4">
      <button
        @click="goCreate"
        class="btn btn-primary btn-lg w-100"
      >
        + Thêm nhân viên
      </button>
    </div>

    <!-- Staff Table -->
    <div class="table-responsive shadow-sm rounded">
      <table class="table table-striped table-bordered align-middle">
        <thead class="table-light">
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Chi nhánh</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="staff in filteredStaff" :key="staff._id">
            <td>{{ staff.name }}</td>
            <td>{{ staff.email }}</td>
            <td>
              <span class="badge bg-info text-dark">
                {{ staff.role }}
              </span>
            </td>
            <td>{{ staff.branchId?.name }}</td>
            <td class="text-center">
              <div class="btn-group">
                <button
                  @click="edit(staff._id)"
                  class="btn btn-success btn-sm"
                >
                  <i class="bi bi-pencil-square"></i> Sửa
                </button>
                <button
                  @click="remove(staff._id)"
                  class="btn btn-danger btn-sm"
                >
                  <i class="bi bi-trash"></i> Xóa
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="filteredStaff.length === 0">
            <td colspan="5" class="text-center py-3 text-muted">
              Không có nhân viên nào.
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
