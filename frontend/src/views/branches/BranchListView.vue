<template>
  <div class="container py-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="fw-bold fs-4 fs-md-3">Danh sách chi nhánh</h1>
    </div>

    <!-- Table -->
    <div class="table-responsive shadow-sm rounded border">
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

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { BranchService } from "@/services/apiService";

const router = useRouter();
const branches = ref([]);

const loadData = async () => {
  try {
    const res = await BranchService.getAll();
    branches.value = res.data;
  } catch (err) {
    console.error("Lỗi load branches:", err);
  }
};

const openShift = (branchId) => {
  localStorage.setItem("branchId", branchId);
  router.push("/shifts/open"); // chuyển sang trang mở ca
};

onMounted(loadData);
</script>
