<template>
  <div class="container py-4" style="max-width: 600px;">
    <div class="card shadow-sm">
      <div class="card-body">
        <h3 class="text-center fw-bold mb-4">Thêm sản phẩm</h3>

        <div class="mb-3">
          <label class="form-label">Tên sản phẩm</label>
          <input v-model="form.name" type="text" class="form-control" placeholder="Nhập tên sản phẩm">
        </div>

        <div class="mb-3">
          <label class="form-label">Giá</label>
          <input v-model="form.price" type="number" class="form-control" placeholder="Nhập giá sản phẩm">
        </div>

        <div class="mb-3">
          <label class="form-label">Số lượng</label>
          <input v-model="form.quantity" type="number" class="form-control" placeholder="Nhập số lượng">
        </div>

        <div class="mb-3">
          <label class="form-label">Giảm giá (%)</label>
          <input v-model="form.sale" type="number" class="form-control" placeholder="Phần trăm giảm giá (nếu có)">
        </div>

        <div class="mb-3">
          <label class="form-label">Mô tả</label>
          <textarea v-model="form.description" class="form-control" rows="3" placeholder="Mô tả sản phẩm"></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label">Ảnh sản phẩm</label>
          <input type="file" class="form-control" @change="onFileChange">
        </div>

        <button @click="create" class="btn btn-primary w-100 py-2 fw-bold">
          Thêm sản phẩm
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ProductService } from "@/services/apiService";

export default {
  name: "ProductCreateView",
  data() {
    return {
      form: {
        name: "",
        price: "",
        quantity: "",
        description: "",
        sale: 0,
      },
      imageFile: null,
    };
  },
  methods: {
    onFileChange(e) {
      this.imageFile = e.target.files[0];
    },

    async create() {
      if (!this.form.name || !this.form.price || !this.form.quantity) {
        alert("Vui lòng nhập đầy đủ tên, giá và số lượng!");
        return;
      }

      try {
        const fd = new FormData();
        for (const k in this.form) fd.append(k, this.form[k]);
        if (this.imageFile) fd.append("image", this.imageFile);

        await ProductService.create(fd);

        alert("Thêm sản phẩm thành công!");
        this.$router.push("/products");

      } catch (e) {
        console.error("Create Error:", e);
        alert("Lỗi khi thêm sản phẩm!");
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
