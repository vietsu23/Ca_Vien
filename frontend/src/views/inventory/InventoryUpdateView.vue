<template>
  <div class="max-w-lg mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Cập nhật tồn kho</h1>

    <div class="space-y-4">

      <!-- Sản phẩm -->
      <div>
        <label class="font-medium">Sản phẩm</label>
        <select v-model="inventory.product" class="w-full px-3 py-2 border rounded">
          <option v-for="p in products" :key="p._id" :value="p._id">
            {{ p.name }}
          </option>
        </select>
      </div>

      <!-- Chi nhánh -->
      <div>
        <label class="font-medium">Chi nhánh</label>
        <select v-model="inventory.branch" class="w-full px-3 py-2 border rounded">
          <option v-for="b in branches" :key="b._id" :value="b._id">
            {{ b.name }}
          </option>
        </select>
      </div>

      <!-- Số lượng -->
      <div>
        <label class="font-medium">Số lượng</label>
        <input
          type="number"
          v-model="inventory.quantity"
          class="w-full px-3 py-2 border rounded"
        />
      </div>

      <button
        @click="save"
        class="bg-green-600 w-full text-white px-4 py-2 rounded"
      >
        Lưu cập nhật
      </button>

      <router-link
        to="/inventory"
        class="block text-center mt-3 text-blue-600"
      >
        Quay lại
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  InventoryService,
  BranchService,
  ProductService,
} from "@/services/apiService";

const router = useRouter();
const route = useRoute();
const id = route.params.id;

const inventory = ref({
  product: "",
  branch: "",
  quantity: 0,
});

const products = ref([]);
const branches = ref([]);

// Lấy dữ liệu ban đầu
const loadDetail = async () => {
  const res = await InventoryService.getDetail(id);
  inventory.value = {
    product: res.data.data.product._id,
    branch: res.data.data.branch._id,
    quantity: res.data.data.quantity,
  };
};

const loadInit = async () => {
  const res1 = await ProductService.getList();
  const res2 = await BranchService.getList();
  products.value = res1.data.data;
  branches.value = res2.data.data;
};

// Lưu
const save = async () => {
  await InventoryService.update(id, inventory.value);
  alert("Cập nhật thành công!");
  router.push("/inventory");
};

onMounted(() => {
  loadInit();
  loadDetail();
});
</script>
