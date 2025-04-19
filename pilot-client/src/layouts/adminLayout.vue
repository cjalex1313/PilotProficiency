<template>
  <div class="min-h-screen flex">
    <div
      class="side-bar bg-indigo-500 text-slate-300 p-3"
      :class="{ 'w-64': isExpanded, 'w-16': !isExpanded }"
    >
      <div v-if="isExpanded" class="mt-6">
        <div class="text-3xl text-center">Admin Portal</div>
        <div class="links mt-10">
          <RouterLink
            to="/admin"
            class="block bg-indigo-600 mb-3 p-2 rounded-xl"
            exactActiveClass="bg-indigo-800 text-slate-200 font-bold"
          >
            <i class="pi pi-home mr-2"></i> Dashboard</RouterLink
          >
          <RouterLink
            to="/admin/categories"
            class="block bg-indigo-600 mb-3 p-2 rounded-xl"
            exactActiveClass="bg-indigo-800 text-slate-200 font-bold"
            ><i class="pi pi-folder mr-3"></i>Categories</RouterLink
          >
        </div>
      </div>
    </div>
    <div class="content p-2 grow">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isExpanded = ref(true)
</script>

<style lang="css" scoped></style>
