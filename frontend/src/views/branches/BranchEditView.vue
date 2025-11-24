<template>
  <div class="p-4 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Sửa chi nhánh</h1>

    <div class="space-y-4 border rounded p-4">
      <input
        v-model="form.name"
        class="w-full px-3 py-2 border rounded"
        placeholder="Tên chi nhánh"
      />

      <input
        v-model="form.address"
        class="w-full px-3 py-2 border rounded"
        placeholder="Địa chỉ"
      />

      <input
        v-model="form.phone"
        class="w-full px-3 py-2 border rounded"
        placeholder="Số điện thoại"
      />

      <button
        @click="update"
        class="bg-blue-600 text-white w-full py-2 rounded"
      >
        Cập nhật
      </button>
    </div>

    <router-link to="/branches" class="block text-center mt-4 text-blue-600">
      ← Quay lại
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { BranchService } from "@/services/apiService";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const id = route.params.id;

const form = ref({
  name: "",
  address: "",
  phone: ""
});

// Load data vào form
onMounted(async () => {
  const res = await BranchService.getById(id);
  form.value = res.data.data;
});

const update = async () => {
  await BranchService.update(id, form.value);
  alert("Cập nhật thành công!");
  router.push("/branches");
};
</script>
