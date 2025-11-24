<template>
  <div class="container py-4">
    <div class="mx-auto" style="max-width: 500px;">
      <h2 class="text-center fw-bold mb-4">Mở ca mới</h2>

      <div class="card shadow-sm">
        <div class="card-body">

          <!-- Branch Name -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Chi nhánh</label>
            <input
              v-model="branchName"
              type="text"
              class="form-control"
              readonly
            />
          </div>

          <!-- Nhân viên -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Nhân viên</label>
            <input
              v-model="staffName"
              type="text"
              class="form-control"
              readonly
            />
          </div>

          <!-- Tiền mở ca -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Tiền mở ca</label>
            <input
              v-model.number="openingCash"
              type="number"
              class="form-control"
              placeholder="Nhập tiền mở ca"
            />
          </div>

          <!-- Button -->
          <button
            @click="openShift"
            class="btn btn-primary w-100"
          >
            Mở ca
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ShiftService, BranchService } from "@/services/apiService";

export default {
  name: "ShiftOpenView",
  data() {
    return {
      branchId: "",
      branchName: "",
      staffId: "",
      staffName: "",
      openingCash: 0,
    };
  },
  async mounted() {
    // Lấy branchId từ localStorage
    const branchId = localStorage.getItem("branchId");
    if (!branchId) {
      alert("Không tìm thấy chi nhánh, vui lòng chọn chi nhánh trước!");
      this.$router.push("/branches");
      return;
    }
    this.branchId = branchId;

    // Lấy tên chi nhánh
    try {
      const res = await BranchService.getById(branchId);
      this.branchName = res.data.name || branchId;
    } catch {
      this.branchName = branchId;
    }

    // Lấy staff từ localStorage
    const staff = JSON.parse(localStorage.getItem("staff"));
    if (staff && staff._id) {
      this.staffId = staff._id;
      this.staffName = staff.name;
    } else {
      this.staffName = "Không xác định";
    }
  },
  methods: {
  async openShift() {
    if (!this.openingCash || this.openingCash <= 0) {
      alert("Vui lòng nhập tiền mở ca hợp lệ!");
      return;
    }

    const payload = {
      branchId: this.branchId,
      openedBy: this.staffId,
      openingCash: this.openingCash,
    };

    try {
      const res = await ShiftService.create(payload);
      const shiftId = res.data._id; // Giả sử API trả shift object với _id
      localStorage.setItem("shiftId", shiftId); // Lưu shiftId vào localStorage

      alert("Đã mở ca!");
      this.$router.push("/inventories");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Không mở được ca!");
    }
  },
},
};
</script>

<style scoped>
.card {
  border-radius: 12px;
}
</style>
