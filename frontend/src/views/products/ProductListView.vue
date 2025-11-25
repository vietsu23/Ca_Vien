<template>
  <div class="container py-4">
    <h2 class="text-center fw-bold mb-4">Danh sách sản phẩm</h2>

    <!-- Add new -->
    <div class="d-grid mb-4">
      <button
        @click="$router.push('/products/create')"
        class="btn btn-primary btn-lg"
      >
        + Thêm sản phẩm
      </button>
    </div>

    <!-- No product -->
    <div v-if="products.length === 0" class="text-center text-muted py-4">
      Không có sản phẩm nào
    </div>

    <!-- Product List -->
    <div class="row g-3">
      <div
        v-for="p in products"
        :key="p._id"
        class="col-12 col-md-6"
      >
        <div class="card shadow-sm rounded-3 h-100">
          <div class="row g-0">
            <!-- Image -->
            <div class="col-4 d-flex justify-content-center align-items-center p-2">
              <img
                :src="p.imageUrl"
                class="img-fluid rounded"
                style="width: 100px; height: 100px; object-fit: cover;"
              />
            </div>

            <!-- Info -->
            <div class="col-8">
              <div class="card-body py-2">
                <h5 class="card-title mb-1 fw-bold">{{ p.name }}</h5>
                <p class="card-text mb-1">
                  Giá: <strong>{{ formatPrice(p.price) }} đ</strong>
                </p>
                <p class="text-muted mb-2 small">Số lượng: {{ p.quantity }}</p>

                <div class="d-flex gap-2">
                  <button
                    class="btn btn-success btn-sm w-50"
                    @click="openEdit(p)"
                  >Chỉnh sửa</button>

                  <button
                    class="btn btn-danger btn-sm w-50"
                    @click="openDelete(p)"
                  >Xóa</button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= EDIT MODAL ================= -->
    <div v-if="editVisible" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-content p-3">
          <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa sản phẩm</h5>
            <button class="btn-close" @click="closeEdit"></button>
          </div>

          <div class="modal-body">
            <div class="mb-2">
              <label class="form-label">Tên sản phẩm</label>
              <input v-model="form.name" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Giá</label>
              <input v-model="form.price" type="number" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Số lượng</label>
              <input v-model="form.quantity" type="number" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Giảm giá (%)</label>
              <input v-model="form.sale" type="number" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Mô tả</label>
              <textarea v-model="form.description" class="form-control"></textarea>
            </div>

            <div class="mb-2">
              <label class="form-label">Ảnh mới (nếu muốn thay)</label>
              <input type="file" class="form-control" @change="onFile" />
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeEdit">Hủy</button>
            <button class="btn btn-primary" @click="saveEdit">Lưu</button>
          </div>

        </div>
      </div>
    </div>

    <!-- ================= DELETE MODAL ================= -->
    <div v-if="deleteVisible" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-content p-3 text-center">
          <h5 class="fw-bold">Bạn chắc chắn muốn xóa?</h5>
          <p class="text-muted">{{ deleteProduct?.name }}</p>

          <div class="d-flex justify-content-center gap-3 mt-3">
            <button class="btn btn-secondary" @click="deleteVisible = false">
              Hủy
            </button>
            <button class="btn btn-danger" @click="confirmDelete">
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ProductService } from "@/services/apiService";

export default {
  name: "ProductListView",
  data() {
    return {
      products: [],

      // Edit
      editVisible: false,
      editId: null,
      form: {},
      newImage: null,

      // Delete
      deleteVisible: false,
      deleteProduct: null,
    };
  },

  methods: {
    async load() {
      const res = await ProductService.getAll();
      this.products = res.data;
    },

    formatPrice(v) {
      return new Intl.NumberFormat("vi-VN").format(v || 0);
    },

    // ----------------- Edit -----------------
    openEdit(p) {
      this.editId = p._id;
      this.form = { ...p };
      this.newImage = null;
      this.editVisible = true;
    },

    closeEdit() {
      this.editVisible = false;
    },

    onFile(e) {
      this.newImage = e.target.files[0];
    },

    async saveEdit() {
      const fd = new FormData();
      Object.keys(this.form).forEach((k) => fd.append(k, this.form[k]));
      if (this.newImage) fd.append("image", this.newImage);

      await ProductService.update(this.editId, fd);

      // update UI ngay
      const idx = this.products.findIndex(p => p._id === this.editId);
      if (idx !== -1) this.products[idx] = { ...this.form };

      this.editVisible = false;
      this.load();
    },

    // ----------------- Delete -----------------
    openDelete(p) {
      this.deleteProduct = p;
      this.deleteVisible = true;
    },

    async confirmDelete() {
      await ProductService.delete(this.deleteProduct._id);
      this.products = this.products.filter(p => p._id !== this.deleteProduct._id);
      this.deleteVisible = false;
    },
  },

  mounted() {
    this.load();
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-dialog {
  max-width: 450px;
  width: 100%;
  z-index: 3000;
}

.modal-content {
  background: white !important;
  padding: 15px;
  border-radius: 12px;
  z-index: 4000;
}

</style>
