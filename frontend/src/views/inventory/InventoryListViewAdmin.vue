<template>
  <div class="container py-4">
    <h2 class="text-center fw-bold mb-4">Tất cả tồn kho hệ thống</h2>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- Không có dữ liệu -->
    <div v-if="!loading && groupedInventoryKeys.length === 0" class="text-center text-muted py-4">
      Không có dữ liệu tồn kho
    </div>

    <!-- Danh sách branch -->
    <div v-for="branch in groupedInventoryKeys" :key="branch" class="mb-5">
      <h4 class="fw-bold mb-3">{{ branch }}</h4>

      <div class="row g-3">
        <div
          v-for="item in groupedInventory[branch]"
          :key="item._id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <div class="card shadow-sm inventory-card h-100">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ item.productId?.name }}</h5>
              <p class="text-muted small mb-1">
                Chi nhánh: <strong>{{ item.branchId?.name }}</strong>
              </p>
              <p class="text-muted small mb-1">Số lượng: {{ item.quantity }}</p>
              <p class="text-muted small">Giá: {{ formatPrice(item.productId?.price) }} đ</p>

              <!-- Nút xóa -->
              <button
                class="btn btn-danger btn-sm mt-auto"
                @click="deleteInventory(item._id, item.productId?.name)"
              >
                <i class="bi bi-trash"></i> Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr class="my-4" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { InventoryService } from "@/services/apiService";

const inventory = ref([]);
const groupedInventory = ref({});
const loading = ref(true);

// Format VNĐ
const formatPrice = (value) => {
  if (!value) return "0";
  return new Intl.NumberFormat("vi-VN").format(value);
};

// Nhóm tồn kho theo branch
const groupByBranch = (data) => {
  const groups = {};
  data.forEach((item) => {
    const branchName = item.branchId?.name || "Không xác định";
    if (!groups[branchName]) groups[branchName] = [];
    groups[branchName].push(item);
  });
  groupedInventory.value = groups;
};

// Lấy toàn bộ tồn kho
const loadInventory = async () => {
  try {
    const res = await InventoryService.getAll();
    inventory.value = res.data;
    groupByBranch(res.data);
  } catch (err) {
    console.error(err);
    alert("Lỗi khi tải tồn kho!");
  } finally {
    loading.value = false;
  }
};

// Xóa tồn kho
const deleteInventory = async (id, productName) => {
  if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${productName}" khỏi tồn kho?`)) return;
  try {
    await InventoryService.delete(id);
    alert(`Đã xóa "${productName}" khỏi tồn kho`);
    await loadInventory(); // reload lại dữ liệu
  } catch (err) {
    console.error(err);
    alert("Xảy ra lỗi khi xóa tồn kho!");
  }
};

onMounted(() => loadInventory());

// Mảng key dùng để v-for
const groupedInventoryKeys = computed(() => Object.keys(groupedInventory.value));
</script>

<style scoped>
.inventory-card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.inventory-card:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
</style>
