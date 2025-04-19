<template>
  <div>
    <div class="text-3xl">Categories</div>
    <div class="mt-5">
      <div v-if="isLoading">Loading</div>
      <div v-else>
        <DataTable :value="categories" tableStyle="min-width: 50rem">
          <template #header>
            <div class="flex flex-wrap items-center justify-end gap-2">
              <Button icon="pi pi-plus" rounded raised />
            </div>
          </template>
          <Column field="name" header="Name"></Column>
          <Column field="description" header="Description"></Column>
          <Column class="w-24 !text-end">
            <template #body="{ data }">
              <div class="flex">
                <Button
                  icon="pi pi-pencil"
                  @click="categoryClicked(data)"
                  severity="primary"
                  rounded
                ></Button>
                <Button
                  icon="pi pi-trash"
                  @click="categoryClicked(data)"
                  severity="danger"
                  rounded
                ></Button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DataTable, Column, Button } from 'primevue'
import { useCategoryApi } from '@/api/categoryApi'
import { onMounted, ref } from 'vue'

const categoryApi = useCategoryApi()

const isLoading = ref(true)
const categories = ref([])

onMounted(async () => {
  try {
    const categoriesResponse = await categoryApi.getCategories()
    categories.value = categoriesResponse
  } finally {
    isLoading.value = false
  }
})

const categoryClicked = (data) => {
  console.log(data.name)
}
</script>
