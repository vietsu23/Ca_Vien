<template>
  <div class="container py-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="fw-bold fs-4 fs-md-3">Danh sách chi nhánh</h1>
    </div>

    <!-- Branches Table -->
    <div class="table-responsive shadow-sm rounded border mb-5">
      <table class="table table-striped table-bordered align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th class="text-center">Tên</th>
            <th class="text-center">Địa chỉ</th>
            <th class="text-center">SĐT</th>
            <th class="text-center" style="width: 150px;">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="b in branches" :key="b._id">
            <td>{{ b.name }}</td>
            <td>{{ b.address }}</td>
            <td>{{ b.phone }}</td>

            <td class="text-center">
              <button
                class="btn btn-primary btn-sm w-100"
                @click="openShift(b._id)"
              >
                Mở ca
              </button>
            </td>
          </tr>

          <tr v-if="branches.length === 0">
            <td colspan="4" class="text-center text-muted py-3">
              Chưa có chi nhánh nào.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Shifts Table -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="fw-bold fs-5">Ca làm hiện tại</h2>
    </div>

    <div class="table-responsive shadow-sm rounded border">
      <table class="table table-striped table-bordered align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th class="text-center">Chi nhánh</th>
            <th class="text-center">Nhân viên mở ca</th>
            <th class="text-center" style="width: 120px;">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="s in shifts" :key="s._id">
            <td>{{ s.branchId?.name || "N/A" }}</td>
            <td>{{ s.openedBy?.name || "N/A" }}</td>

            <td class="text-center">
              <button
                class="btn btn-success btn-sm w-100"
                @click="enterShift(s.branchId?._id)"
              >
                Vào ca
              </button>
            </td>
          </tr>

          <tr v-if="shifts.length === 0">
            <td colspan="4" class="text-center text-muted py-3">
              Không có ca làm nào đang mở.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { BranchService, ShiftService } from "@/services/apiService";

const router = useRouter();
const branches = ref([]);
const shifts = ref([]);

// --- Load Branches ---
const loadBranches = async () => {
  try {
    const res = await BranchService.getAll();
    branches.value = res.data;
  } catch (err) {
    console.error("Lỗi load branches:", err);
  }
};

// --- Load Shifts ---
const loadShifts = async () => {
  try {
    const res = await ShiftService.getAll();
    shifts.value = res.data;
  } catch (err) {
    console.error("Lỗi load shifts:", err);
  }
};

// format datetime
const formatTime = (t) => new Date(t).toLocaleString("vi-VN");

// open shift
const openShift = (branchId) => {
  localStorage.setItem("branchId", branchId);
  router.push("/shifts/open");
};

// enter shift (go to inventories)
const enterShift = (branchId) => {
  localStorage.setItem("branchId", branchId);
  router.push("/inventories");
};

onMounted(() => {
  loadBranches();
  loadShifts();
});
</script>
