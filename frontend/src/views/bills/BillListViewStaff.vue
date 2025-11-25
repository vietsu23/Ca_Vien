<template>
  <div class="container py-4">
    <h1 class="text-center mb-4">Danh sách hóa đơn</h1>

    <!-- Thống kê doanh thu -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h6 class="card-title">Doanh thu tổng</h6>
            <p class="card-text fw-bold fs-5">{{ formatPrice(totalRevenue) }} đ</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h6 class="card-title">Doanh thu tiền mặt</h6>
            <p class="card-text fw-bold fs-5">{{ formatPrice(cashRevenue) }} đ</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h6 class="card-title">Doanh thu chuyển khoản</h6>
            <p class="card-text fw-bold fs-5">{{ formatPrice(cardRevenue) }} đ</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h6 class="card-title">Tiền mặt hiện có</h6>
            <p class="card-text fw-bold fs-5">{{ formatPrice(cashOnHand) }} đ</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bảng hóa đơn -->
    <div class="table-responsive border rounded">
      <table class="table table-striped table-bordered mb-0">
        <thead class="table-light">
          <tr>
            <th>Mã HĐ</th>
            <th>Nhân viên</th>
            <th>Chi nhánh</th>
            <th>Tổng tiền</th>
            <th>Ngày</th>
            <th>Thanh toán</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in bills" :key="b._id">
            <td>{{ b.name }}</td>
            <td>{{ b.staff?.name }}</td>
            <td>{{ b.branchId?.name || '---' }}</td>
            <td>{{ formatPrice(b.totalAmount) }} đ</td>
            <td>{{ formatDate(b.sellDate || b.createdAt) }}</td>
            <td class="text-center">
              <span v-if="b.paymentMethod === 'cash'" class="text-success" title="Tiền mặt">💵</span>
              <span v-else-if="b.paymentMethod === 'card'" class="text-primary" title="Chuyển khoản">💳</span>
              <span v-else>---</span>
            </td>
            <td>
              <router-link :to="`/bills/${b._id}`" class="btn btn-sm btn-outline-primary">Xem</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <div class="d-flex justify-content-center gap-2 mt-3">
      <button class="btn btn-outline-secondary" :disabled="page === 1" @click="page--">Trước</button>
      <button class="btn btn-outline-secondary" @click="page++">Sau</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { BillService, ShiftService } from "@/services/apiService";

const bills = ref([]);
const page = ref(1);

const totalRevenue = ref(0);
const cashRevenue = ref(0);
const cardRevenue = ref(0);
const cashOnHand = ref(0);
let shiftData = null;

const loadData = async () => {
  try {
    const shiftId = localStorage.getItem("shiftId");
    if (!shiftId) {
      bills.value = [];
      totalRevenue.value = 0;
      cashRevenue.value = 0;
      cardRevenue.value = 0;
      cashOnHand.value = 0;
      return;
    }

    // Lấy thông tin shift
    const shiftRes = await ShiftService.getById(shiftId);
    shiftData = shiftRes.data;

    // Lấy hóa đơn theo shiftId
    const res = await BillService.getByShiftId(shiftId, { page: page.value });
    bills.value = res.data.data || res.data || [];

    // Tính doanh thu
    totalRevenue.value = bills.value.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    cashRevenue.value = bills.value.filter(b => b.paymentMethod === 'cash').reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    cardRevenue.value = bills.value.filter(b => b.paymentMethod === 'card').reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    cashOnHand.value = cashRevenue.value + (shiftData?.openingCash || 0);

  } catch (err) {
    console.error("AxiosError", err);
  }
};

watch(page, () => loadData());
onMounted(loadData);

const formatDate = (str) => str ? new Date(str).toLocaleString() : '---';
const formatPrice = (value) => value ? new Intl.NumberFormat("vi-VN").format(value) : 0;
</script>
