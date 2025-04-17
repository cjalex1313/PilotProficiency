<template>
  <div class="min-h-screen flex">
    <div
      class="side-bar bg-indigo-500 text-slate-300 p-2"
      :class="{ 'w-56': isExpanded, 'w-16': !isExpanded }"
      @click="isExpanded = !isExpanded"
    >
      <div v-if="isExpanded" class="mt-6">
        <div class="text-3xl text-center">Admin Portal</div>
      </div>
    </div>
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue'

const isExpanded = ref(true)
</script>
