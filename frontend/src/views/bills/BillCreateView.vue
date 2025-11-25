<template>
  <div class="container py-4">

    <!-- Tiêu đề hóa đơn -->
    <h1 class="text-2xl fw-bold mb-4 text-center">
      {{ billName || "Tạo hóa đơn" }}
    </h1>

    <!-- Chọn sản phẩm -->
    <div class="mb-4 d-flex gap-2">
      <select v-model="selectedProductId" class="form-select w-50">
        <option value="">-- Chọn sản phẩm --</option>
        <option v-for="p in filteredProducts" :key="p._id" :value="p._id">
          {{ p.name }} - {{ formatPrice(p.price) }} đ
        </option>
      </select>

      <input 
        type="number" 
        v-model.number="quantityToAdd" 
        class="form-control w-25" 
        min="1" 
        placeholder="SL"
      />

      <button class="btn btn-primary" @click="addItem">Thêm</button>
    </div>

    <!-- Bảng sản phẩm -->
    <div v-if="items.length === 0" class="text-center text-muted py-4">
      Chưa có sản phẩm nào trong hóa đơn
    </div>

    <div v-else class="table-responsive border rounded shadow-sm mb-4">
      <table class="table table-striped table-bordered align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
  <tr v-for="(item, index) in items" :key="item.productId">
    <td>{{ item.name }}</td>
    <!-- Giá gốc, chỉ hiển thị -->
    <td>{{ formatPrice(item.price) }} đ</td>
    
    <!-- Chỉnh số lượng -->
    <td>
      <input 
        type="number" 
        v-model.number="item.quantity" 
        min="1" 
        class="form-control" 
        style="width: 80px;"
        @input="updateTotal(index)"
      />
    </td>
    
    <!-- Thành tiền có thể chỉnh -->
    <td>
      <input
        type="number"
        v-model.number="item.total"
        class="form-control"
        style="width: 120px;"
      />
    </td>
    
    <td class="text-center">
      <button class="btn btn-danger btn-sm" @click="removeItem(index)">X</button>
    </td>
  </tr>
</tbody>

      </table>
    </div>

    <!-- Tổng tiền -->
    <div class="text-end fw-bold fs-5 mb-4">
      Tổng: {{ formatPrice(total) }} đ
    </div>

    <!-- Thanh toán -->
    <div class="d-flex gap-2">
      <button 
        class="btn btn-success flex-grow-1 py-2" 
        :disabled="items.length === 0" 
        @click="saveBill('cash')"
      >
        Thanh toán tiền mặt
      </button>
      <button 
        class="btn btn-primary flex-grow-1 py-2" 
        :disabled="items.length === 0" 
        @click="saveBill('card')"
      >
        Thanh toán chuyển khoản
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ProductService, BillService } from "@/services/apiService";
import { useRouter } from "vue-router";

const router = useRouter();

const products = ref([]);
const filteredProducts = ref([]);
const items = ref([]);

const selectedProductId = ref("");
const quantityToAdd = ref(1);
const billName = ref("");

const formatPrice = (value) => {
  if (!value) return "0";
  return new Intl.NumberFormat("vi-VN").format(value);
};

const loadProducts = async () => {
  const res = await ProductService.getAll();
  products.value = res.data;
  filteredProducts.value = [...products.value];
};

const addItem = () => {
  if (!selectedProductId.value || quantityToAdd.value < 1) return;

  const p = products.value.find((p) => p._id === selectedProductId.value);
  if (!p) return;

  const exist = items.value.find((i) => i.productId === p._id);
  if (exist) {
    alert(`${p.name} đã có trong hóa đơn!`);
    return;
  }

  items.value.push({
    productId: p._id,
    name: p.name,
    price: p.price,
    quantity: quantityToAdd.value,
    total: p.price * quantityToAdd.value,
  });

  selectedProductId.value = "";
  quantityToAdd.value = 1;

  localStorage.setItem("selectedProducts", JSON.stringify(items.value));
};

// Khi thay đổi số lượng, nếu người dùng chưa chỉnh thành tiền thủ công thì vẫn tính tự động
const updateTotal = (index) => {
  const item = items.value[index];
  // Nếu người dùng chưa nhập thành tiền thì tự tính
  if (!item.totalManual) {
    item.total = item.price * item.quantity;
  }
};

// Khi người dùng chỉnh thành tiền thủ công, đánh dấu
const onTotalChange = (index) => {
  items.value[index].totalManual = true;
};

// Computed tổng tiền
const total = computed(() =>
  items.value.reduce((sum, i) => sum + (i.total || 0), 0)
);


const removeItem = (index) => {
  items.value.splice(index, 1);
  localStorage.setItem("selectedProducts", JSON.stringify(items.value));
};

const saveBill = async (paymentMethod) => {
  if (items.value.length === 0) {
    alert("Chưa có sản phẩm nào!");
    return;
  }

  const staff = JSON.parse(localStorage.getItem("staff"));
  const branchId = localStorage.getItem("branchId");
  const shiftId = localStorage.getItem("shiftId");

  if (!staff || !branchId || !shiftId) {
    alert("Thiếu thông tin nhân viên, chi nhánh hoặc ca làm việc!");
    return;
  }

  const billData = {
    name: billName.value,
    staff: staff._id,
    shiftId,
    branchId,
    products: items.value.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      price: i.price,
    })),
    totalAmount: total.value,
    perdiscount: 0,
    paymentMethod,
  };

  try {
    await BillService.create(billData);

    alert("Tạo hóa đơn thành công!");
    items.value = [];
    localStorage.removeItem("selectedProducts");

    router.push("/inventories");
  } catch (err) {
    console.error(err.response?.data || err);
    alert(err.response?.data?.error || "Có lỗi khi tạo hóa đơn!");
  }
};

onMounted(async () => {
  // 1. Sinh tên hóa đơn tự động
  let billsCount = parseInt(localStorage.getItem("billsCount") || "0");
  billsCount += 1;
  billName.value = "HD" + billsCount.toString().padStart(5, "0");
  localStorage.setItem("billsCount", billsCount);

  // 2. Load sản phẩm
  await loadProducts();

  // 3. Load các sản phẩm đã chọn từ localStorage
  const selected = JSON.parse(localStorage.getItem("selectedProducts") || "[]");
  items.value = selected.map((i) => ({
    ...i,
    total: i.total || i.price * i.quantity,
  }));
});
</script>

<style scoped>
/* Bạn có thể thêm style bootstrap hoặc tuỳ chỉnh */
</style>
