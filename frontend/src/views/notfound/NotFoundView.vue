<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100 p-4 text-center">
    <h1 class="text-6xl font-bold text-red-600 mb-4">404</h1>
    <p class="text-xl md:text-2xl mb-6">Oops! Trang bạn tìm không tồn tại.</p>
    <button
      @click="$router.push('/')"
      class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition"
    >
      Quay về trang chủ
    </button>
  </div>
</template>

<script>
export default {
  name: "NotFoundView",
};
</script>

<style scoped>
/* Optional: thêm animation fade-in */
div {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
