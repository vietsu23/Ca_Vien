<template>
  <div class="container py-4">
    <div class="mx-auto" style="max-width: 500px">
      
      <h1 class="text-center fw-bold mb-4">Thêm chi nhánh</h1>

      <div class="card shadow-sm">
        <div class="card-body">

          <div class="mb-3">
            <label class="form-label fw-semibold">Tên chi nhánh</label>
            <input
              v-model="form.name"
              class="form-control"
              placeholder="Nhập tên chi nhánh"
            />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Địa chỉ</label>
            <input
              v-model="form.address"
              class="form-control"
              placeholder="Nhập địa chỉ"
            />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Số điện thoại</label>
            <input
              v-model="form.phone"
              class="form-control"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <button
            @click="save"
            class="btn btn-success w-100 py-2"
          >
            Lưu chi nhánh
          </button>
        </div>
      </div>

      <router-link
        to="/branches"
        class="d-block text-center mt-3 text-primary fw-semibold"
      >
        ← Quay lại danh sách
      </router-link>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { BranchService } from "@/services/apiService";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref({
  name: "",
  address: "",
  phone: ""
});

const save = async () => {
  if (!form.value.name) return alert("Tên chi nhánh không được để trống!");

  await BranchService.create(form.value);

  alert("Thêm chi nhánh thành công!");
  router.push("/branches");
};
</script>

<style scoped>
.card {
  border-radius: 12px;
}
</style>
