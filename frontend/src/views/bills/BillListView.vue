<template>
  <div class="p-4">
    <h1 class="text-xl md:text-2xl font-bold mb-4">Danh sách hóa đơn</h1>

    <!-- Bộ lọc -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
      <input
        v-model="keyword"
        class="px-3 py-2 border rounded"
        placeholder="Tìm theo ID hoặc nhân viên..."
      />

      <input
        v-model="date"
        type="date"
        class="px-3 py-2 border rounded"
      />

      <button
        @click="loadData"
        class="bg-blue-600 text-white rounded px-4 py-2"
      >
        Lọc
      </button>
    </div>

    <!-- Bảng -->
    <div class="overflow-auto border rounded">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 border">Mã HĐ</th>
            <th class="p-2 border">Nhân viên</th>
            <th class="p-2 border">Tổng tiền</th>
            <th class="p-2 border">Ngày</th>
            <th class="p-2 border">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="b in bills"
            :key="b._id"
            class="hover:bg-gray-50"
          >
            <td class="p-2 border">{{ b._id }}</td>
            <td class="p-2 border">{{ b.staff?.name }}</td>
            <td class="p-2 border">{{ b.total }}đ</td>
            <td class="p-2 border">{{ formatDate(b.createdAt) }}</td>
            <td class="p-2 border text-center">
              <router-link
                :to="`/bill/${b._id}`"
                class="text-blue-600 hover:underline"
              >
                Xem
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <div class="flex justify-center gap-2 mt-4">
      <button @click="page--" :disabled="page === 1"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >Trước</button>

      <button @click="page++"
        class="px-3 py-1 border rounded"
      >Sau</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { BillService } from "@/services/apiService";

const bills = ref([]);
const keyword = ref("");
const date = ref("");
const page = ref(1);

const loadData = async () => {
  const res = await BillService.getAll({
    keyword: keyword.value,
    date: date.value,
    page: page.value,
  });
  bills.value = res.data.data;
};

onMounted(loadData);

const formatDate = (str) => new Date(str).toLocaleString();
</script>
