<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h2 class="text-xl font-bold mb-4 text-center">Chi tiết ca</h2>

    <div v-if="!shift">Đang tải dữ liệu...</div>

    <div v-else>
      <div class="border p-4 rounded shadow mb-4">
        <p><strong>Chi nhánh:</strong> {{ shift.branchId?.name }}</p>
        <p><strong>Giờ mở:</strong> {{ format(shift.startTime) }}</p>
        <p>
          <strong>Giờ đóng:</strong>
          {{ shift.endTime ? format(shift.endTime) : "Chưa đóng" }}
        </p>
      </div>

      <h3 class="font-semibold mb-2">Danh sách hóa đơn trong ca:</h3>
      <div v-if="bills.length === 0">Không có hóa đơn nào.</div>

      <ul>
        <li
          v-for="bill in bills"
          :key="bill._id"
          class="border p-2 rounded mb-2"
        >
          <p>Mã hóa đơn: {{ bill._id }}</p>
          <p>Nhân viên: {{ bill.staffId?.name }}</p>
          <p>Tổng tiền: {{ bill.total }} đ</p>

          <button
            @click="$router.push('/bills/' + bill._id)"
            class="bg-blue-500 text-white px-3 py-1 rounded mt-2"
          >
            Xem
          </button>
        </li>
      </ul>
    </div>

    <button
      @click="$router.push('/shifts')"
      class="bg-gray-500 text-white px-4 py-2 rounded mt-4 w-full"
    >
      Quay lại
    </button>
  </div>
</template>

<script>
import { ShiftService } from "@/services/apiService";
import { BillService } from "@/services/apiService";
import dayjs from "dayjs";

export default {
  name: "ShiftDetailView",
  data() {
    return {
      shift: null,
      bills: [],
    };
  },
  methods: {
    async loadShift() {
      const id = this.$route.params.id;
      const res = await ShiftService.getById(id);
      this.shift = res.data;

      const billRes = await BillService.getAll();
      this.bills = billRes.data.filter(
        (b) => b.shiftId === this.shift._id
      );
    },
    format(t) {
      return dayjs(t).format("DD/MM/YYYY HH:mm");
    },
  },
  mounted() {
    this.loadShift();
  },
};
</script>
