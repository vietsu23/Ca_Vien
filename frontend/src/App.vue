<template>
  <div id="app">
    <!-- Chỉ hiển thị header khi không phải trang login/shift-open -->
    <EmployeeHeader v-if="showHeader" />

    <router-view />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import EmployeeHeader from "@/components/Header.vue";

const route = useRoute();

// Ẩn header trên trang login hoặc mở ca
const showHeader = computed(() => {
  return !["/login", "/shift/open"].includes(route.path);
});
</script>
