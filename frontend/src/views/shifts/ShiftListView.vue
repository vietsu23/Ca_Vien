<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-4 text-center">Danh sách ca làm</h2>

    <button
      @click="goOpenShift"
      class="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full"
    >
      + Mở ca mới
    </button>

    <div v-if="shifts.length === 0">Không có ca nào</div>

    <div v-for="shift in shifts" :key="shift._id" class="border p-3 rounded mb-3 shadow">
      <div class="font-semibold">Chi nhánh: {{ shift.branchId?.name }}</div>
      <div>Giờ mở: {{ format(shift.startTime) }}</div>
      <div>Giờ đóng: {{ shift.endTime ? format(shift.endTime) : "Chưa đóng" }}</div>

      <button
        @click="detail(shift._id)"
        class="bg-green-500 text-white px-3 py-1 rounded mt-2"
      >
        Xem chi tiết
      </button>
    </div>
  </div>
</template>

<script>
import { ShiftService } from "@/services/apiService";
import dayjs from "dayjs";

export default {
  name: "ShiftListView",
  data() {
    return {
      shifts: [],
    };
  },
  methods: {
    async loadShifts() {
      const res = await ShiftService.getAll();
      this.shifts = res.data;
    },
    format(t) {
      return dayjs(t).format("DD/MM/YYYY HH:mm");
    },
    detail(id) {
      this.$router.push(`/shifts/${id}`);
    },
    goOpenShift() {
      this.$router.push("/shifts/open");
    },
  },
  mounted() {
    this.loadShifts();
  },
};
</script>
