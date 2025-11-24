<template>
  <div class="p-4 max-w-xl mx-auto">
    <h2 class="text-xl font-bold mb-4 text-center">Sửa sản phẩm</h2>

    <div v-if="!form.name">Đang tải...</div>

    <div v-else class="space-y-3">
      <input v-model="form.name" type="text" class="w-full border p-2 rounded" />
      <input v-model="form.price" type="number" class="w-full border p-2 rounded" />
      <input v-model="form.category" type="text" class="w-full border p-2 rounded" />

      <div>
        <p class="mb-1 font-semibold">Ảnh hiện tại:</p>
        <img :src="form.imageUrl" class="w-24 h-24 object-cover rounded mb-2" />
        <input type="file" @change="onFileChange" />
      </div>

      <button @click="update" class="bg-green-600 text-white w-full p-2 rounded">
        Lưu thay đổi
      </button>
    </div>
  </div>
</template>

<script>
import { ProductService } from "@/services/apiService";

export default {
  name: "ProductEditView",
  data() {
    return {
      form: {},
      imageFile: null,
    };
  },
  methods: {
    async load() {
      const id = this.$route.params.id;
      const res = await ProductService.getById(id);
      this.form = res.data;
    },
    onFileChange(e) {
      this.imageFile = e.target.files[0];
    },
    async update() {
      try {
        const fd = new FormData();
        Object.keys(this.form).forEach((k) => fd.append(k, this.form[k]));
        if (this.imageFile) fd.append("image", this.imageFile);

        await ProductService.update(this.form._id, fd);
        alert("Cập nhật thành công!");
        this.$router.push("/products");
      } catch (e) {
        console.error(e);
        alert("Lỗi khi cập nhật sản phẩm!");
      }
    },
  },
  mounted() {
    this.load();
  },
};
</script>
