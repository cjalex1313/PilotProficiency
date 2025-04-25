<script setup>
import { RouterView, useRoute } from 'vue-router'
import NavBar from '@/components/common/NavBar.vue'

const route = useRoute()
</script>

<template>
  <div>
    <NavBar />
    <RouterView :key="route.fullPath" />
  </div>
</template>
