<template>
  <div class="container py-4">
    <h2 class="text-center fw-bold mb-4">Danh sách sản phẩm trong chi nhánh</h2>

    <!-- Nút nhập kho -->
    <div class="d-flex justify-content-end mb-3">
      <button 
        class="btn btn-success" 
        data-bs-toggle="modal" 
        data-bs-target="#importModal"
      >
        Nhập kho
      </button>
    </div>

    <!-- Danh sách sản phẩm tồn kho -->
    <div v-if="inventory.length === 0" class="text-center text-muted py-4">
      Không có sản phẩm nào
    </div>

    <div class="row g-3">
      <div v-for="item in inventory" :key="item._id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card shadow-sm h-100 inventory-card">
          <img 
            :src="item.productId?.imageUrl || 'https://via.placeholder.com/150'" 
            class="card-img-top" 
            style="height: 180px; object-fit: cover;" 
            alt="Product"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold">{{ item.productId?.name }}</h5>
            <p class="text-muted mb-1">Chi nhánh: {{ branchName }}</p>
            <p class="text-muted mb-2 small">Số lượng: {{ item.quantity }}</p>
            <p class="text-muted mb-2 small">Giá: {{ formatPrice(item.productId?.price) }} đ</p>

            <button
              class="btn btn-primary mt-auto"
              @click="addToBill(item)"
            >
              Thêm vào hóa đơn
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal nhập kho -->
    <div class="modal fade" id="importModal" tabindex="-1" aria-labelledby="importModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="importModalLabel">Nhập kho</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-for="product in products" :key="product._id" class="d-flex align-items-center mb-2">
              <div class="flex-grow-1">
                {{ product.name }} - Giá: {{ formatPrice(product.price) }} đ
              </div>
              <input 
                type="number" 
                class="form-control w-25 ms-2" 
                v-model.number="product.quantityToAdd" 
                placeholder="Số lượng"
                min="0"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-success" @click="submitImport">Nhập kho</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { InventoryService, ProductService, BranchService } from "@/services/apiService";
import * as bootstrap from 'bootstrap';
import { useRouter } from "vue-router";

const inventory = ref([]);
const products = ref([]);
const branchName = ref("");
const router = useRouter();
const branchId = localStorage.getItem("branchId");

// Format tiền Việt Nam
const formatPrice = (value) => {
  if (!value) return "0";
  return new Intl.NumberFormat("vi-VN").format(value);
};

// Lấy danh sách tồn kho chi nhánh
const loadData = async () => {
  if (!branchId) {
    alert("Không tìm thấy chi nhánh. Vui lòng mở ca trước!");
    return;
  }

  try {
    const branchRes = await BranchService.getById(branchId);
    branchName.value = branchRes.data.name;

    const res = await InventoryService.getByBranch(branchId);
    inventory.value = res.data;
  } catch (err) {
    console.error(err);
    alert("Lỗi khi tải tồn kho!");
  }
};

// Lấy danh sách tất cả sản phẩm (cho modal nhập kho)
const loadProducts = async () => {
  try {
    const res = await ProductService.getAll();
    products.value = res.data.map(p => ({ ...p, quantityToAdd: 0 }));
  } catch (err) {
    console.error(err);
  }
};

// Thêm sản phẩm vào hóa đơn
const addToBill = (item) => {
  const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts") || "[]");

  const exist = selectedProducts.find(p => p.productId === item.productId._id);
  if (exist) {
    alert(`${item.productId.name} đã được thêm trước đó`);
  } else {
    selectedProducts.push({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: 1
    });
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
    alert(`${item.productId.name} đã được thêm vào hóa đơn`);
  }

  // Chuyển hướng tới tạo hóa đơn
  router.push("/bills/create");
};

// Nhập kho
const submitImport = async () => {
  const selected = products.value.filter(p => p.quantityToAdd > 0);
  if (selected.length === 0) {
    alert("Vui lòng nhập số lượng cho ít nhất 1 sản phẩm");
    return;
  }

  try {
    for (const p of selected) {
      await InventoryService.create({
        branchId,
        productId: p._id,
        quantity: p.quantityToAdd
      });
    }

    alert("Nhập kho thành công!");

    // Reload inventory
    await loadData();

    // Reset quantityToAdd
    products.value.forEach(p => p.quantityToAdd = 0);

    // Đóng modal an toàn
    const modalEl = document.getElementById("importModal");
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.hide();

    // Loại bỏ backdrop nếu còn sót lại
    const backdrops = document.getElementsByClassName('modal-backdrop');
    while (backdrops.length > 0) {
      backdrops[0].parentNode.removeChild(backdrops[0]);
    }

  } catch (err) {
    console.error(err.response?.data || err);
    alert("Có lỗi khi nhập kho!");
  }
};


onMounted(() => {
  loadData();
  loadProducts();
});
</script>

<style scoped>
.inventory-card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.inventory-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}
</style>
