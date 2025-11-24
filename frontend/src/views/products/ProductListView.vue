<template>
  <div class="container py-4">
    <h2 class="text-center fw-bold mb-4">Danh sách sản phẩm</h2>

    <!-- Add new -->
    <!-- <div class="d-grid mb-4">
      <button
        @click="$router.push('/products/create')"
        class="btn btn-primary btn-lg"
      >
        + Thêm sản phẩm
      </button>
    </div> -->

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
                alt="Product"
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

                <!-- Buttons -->
                <div class="d-flex gap-2">
                  <button
                    class="btn btn-success btn-sm w-50"
                    @click="$router.push('/products/' + p._id)"
                  >
                    Thêm vào hóa đơn
                  </button>

                  <!-- <button
                    class="btn btn-danger btn-sm w-50"
                    @click="remove(p._id)"
                  >
                    Xóa
                  </button> -->
                </div>
              </div>
            </div>
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
    };
  },
  methods: {
    async load() {
      const res = await ProductService.getAll();
      this.products = res.data;
    },
    async remove(id) {
      if (confirm("Xóa sản phẩm này?")) {
        await ProductService.delete(id);
        this.load();
      }
    },
    formatPrice(value) {
    if (!value) return "0";
      return new Intl.NumberFormat("vi-VN").format(value);
    }
  },
  mounted() {
    this.load();
  },
};
</script>

<style scoped>
.card {
  transition: all 0.2s ease;
}
.card:hover {
  transform: scale(1.01);
  box-shadow: 0px 4px 15px rgba(0,0,0,0.15);
}
</style>
