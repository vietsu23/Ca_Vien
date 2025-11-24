import { createRouter, createWebHistory } from 'vue-router';

// Views
import LoginView from '@/views/auth/LoginView.vue';
import DashboardView from '@/views/dashboard/DashboardView.vue';

// Products
import ProductListView from '@/views/products/ProductListView.vue';
import ProductCreateView from '@/views/products/ProductCreateView.vue';
import ProductEditView from '@/views/products/ProductEditView.vue';

// Branches
import BranchListView from '@/views/branches/BranchListView.vue';
import BranchCreateView from '@/views/branches/BranchCreateView.vue';
import BranchEditView from '@/views/branches/BranchEditView.vue';

// Staffs
import StaffListView from '@/views/staffs/StaffListView.vue';
import StaffCreateView from '@/views/staffs/StaffCreateView.vue';
import StaffEditView from '@/views/staffs/StaffEditView.vue';

// Inventories
import InventoryListView from '@/views/inventory/InventoryListView.vue';
import InventoryUpdateView from '@/views/inventory/InventoryUpdateView.vue';

// Bills
import BillListView from '@/views/bills/BillListView.vue';
import BillCreateView from '@/views/bills/BillCreateView.vue';
import BillDetailView from '@/views/bills/BillDetailView.vue';

// Shifts
import ShiftListView from '@/views/shifts/ShiftListView.vue';
import ShiftOpenView from '@/views/shifts/ShiftOpenView.vue';
import ShiftDetailView from '@/views/shifts/ShiftDetailView.vue';

// Not Found
import NotFoundView from '@/views/notfound/NotFoundView.vue';

const routes = [
  // Login & Dashboard
  // { path: '/', redirect: '/dashboard' },
  { path: '/', component: LoginView },
  { path: '/dashboard', component: DashboardView },

  // Products
  { path: '/products', component: ProductListView },
  { path: '/products/create', component: ProductCreateView },
  { path: '/products/:id/edit', component: ProductEditView, props: true },

  // Branches
  { path: '/branches', component: BranchListView },
  { path: '/branches/create', component: BranchCreateView },
  { path: '/branches/:id/edit', component: BranchEditView, props: true },

  // Staffs
  { path: '/staffs', component: StaffListView },
  { path: '/staffs/create', component: StaffCreateView },
  { path: '/staffs/:id/edit', component: StaffEditView, props: true },

  // Inventories
  { path: '/inventories', component: InventoryListView },
  { path: '/inventories/:id/update', component: InventoryUpdateView, props: true },

  // Bills
  { path: '/bills', component: BillListView },
  { path: '/bills/create', component: BillCreateView },
  { path: '/bills/:id', component: BillDetailView, props: true },

  // Shifts
  { path: '/shifts', component: ShiftListView },
  { path: '/shifts/open', component: ShiftOpenView },
  { path: '/shifts/:id', component: ShiftDetailView, props: true },

  // Catch-all NotFound
  { path: '/:pathMatch(.*)*', component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
