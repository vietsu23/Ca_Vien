<template>
  <div class="p-4 max-w-xl mx-auto">
    <h2 class="text-xl font-bold mb-4 text-center">Thêm sản phẩm</h2>

    <div class="space-y-3">
      <input v-model="form.name" type="text" placeholder="Tên sản phẩm" class="w-full border p-2 rounded" />
      <input v-model="form.price" type="number" placeholder="Giá" class="w-full border p-2 rounded" />
      <input v-model="form.category" type="text" placeholder="Loại" class="w-full border p-2 rounded" />

      <input type="file" @change="onFileChange" class="w-full" />

      <button @click="create" class="bg-blue-600 text-white w-full p-2 rounded">
        Thêm sản phẩm
      </button>
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
        category: "",
      },
      imageFile: null,
    };
  },
  methods: {
    onFileChange(e) {
      this.imageFile = e.target.files[0];
    },
    async create() {
      try {
        const fd = new FormData();
        Object.keys(this.form).forEach((k) => fd.append(k, this.form[k]));
        if (this.imageFile) fd.append("image", this.imageFile);

        await ProductService.create(fd);
        alert("Thêm thành công!");
        this.$router.push("/products");
      } catch (e) {
        console.error(e);
        alert("Lỗi khi thêm sản phẩm!");
      }
    },
  },
};
</script>
