<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Chi tiết hóa đơn</h1>

    <div class="border rounded p-4 space-y-2">
      <p><strong>Mã HĐ:</strong> {{ bill._id }}</p>
      <p><strong>Nhân viên:</strong> {{ bill.staff?.name }}</p>
      <p><strong>Ngày:</strong> {{ formatDate(bill.createdAt) }}</p>
      <p><strong>Tổng tiền:</strong> {{ bill.total }}đ</p>
    </div>

    <h2 class="text-xl font-semibold mt-6 mb-3">Danh sách sản phẩm</h2>

    <div class="border rounded overflow-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 border">Sản phẩm</th>
            <th class="p-2 border">SL</th>
            <th class="p-2 border">Giá</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in bill.items" :key="item._id">
            <td class="p-2 border">{{ item.product?.name }}</td>
            <td class="p-2 border">{{ item.quantity }}</td>
            <td class="p-2 border">{{ item.price }}đ</td>
          </tr>
        </tbody>
      </table>
    </div>

    <router-link
      to="/bills"
      class="mt-4 block text-center text-blue-600"
    >
      ← Quay lại danh sách
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { BillService } from "@/services/apiService";
import { useRoute } from "vue-router";

const route = useRoute();
const id = route.params.id;

const bill = ref({ items: [] });

onMounted(async () => {
  const res = await BillService.getById(id);
  bill.value = res.data.data;
});

const formatDate = (str) => new Date(str).toLocaleString();
</script>
