<template>
  <div>
    <div class="text-3xl">Categories</div>
    <div class="mt-5">
      <div v-if="isLoading">Loading</div>
      <div v-else>
        <DataTable
          :value="categories"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          tableStyle="min-width: 50rem"
        >
          <template #header>
            <div class="flex flex-wrap items-center justify-end gap-2">
              <Button @click="openAddModal" icon="pi pi-plus" rounded raised />
            </div>
          </template>
          <template #empty>
            <div class="text-center p-3">No categories found. Please try adding some!</div>
          </template>
          <Column field="name" header="Name"></Column>
          <Column field="description" header="Description"></Column>
          <Column class="w-24 !text-end">
            <template #body="{ data }">
              <div class="flex">
                <Button
                  icon="pi pi-pencil"
                  @click="openEditModal(data)"
                  severity="primary"
                  rounded
                ></Button>
                <Button
                  icon="pi pi-trash"
                  @click="deleteCategory(data)"
                  severity="danger"
                  rounded
                ></Button>
              </div>
            </template>
          </Column>
        </DataTable>
        <AddEditCategoryModal
          v-if="showAddEditModal"
          :category="categoryToEdit"
          @closed="closeAddEditModal"
          @saved="savedAddEditModal"
        />
        <ConfirmDialog />
      </div>
    </div>
  </div>
</template>

<script setup>
import { DataTable, Column, Button, useConfirm, useToast, ConfirmDialog } from 'primevue'
import { useCategoryApi } from '@/api/categoryApi'
import { onMounted, ref } from 'vue'
import AddEditCategoryModal from '@/components/category/AddEditCategoryModal.vue'

const categoryApi = useCategoryApi()
const confirm = useConfirm()
const toast = useToast()

const isLoading = ref(true)
const showAddEditModal = ref(false)
const categories = ref([])
const categoryToEdit = ref(null)

onMounted(async () => {
  try {
    const categoriesResponse = await categoryApi.getCategories()
    categories.value = categoriesResponse
  } finally {
    isLoading.value = false
  }
})

const openEditModal = (data) => {
  categoryToEdit.value = {
    ...data,
  }
  showAddEditModal.value = true
}

const deleteCategory = (data) => {
  confirm.require({
    message: `Are you sure you want to delete ${data.name}?`,
    header: 'Delete category',
    icon: 'pi pi-trash',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: async () => {
      await categoryApi.deleteCategory(data.id)
      const indexToRemove = categories.value.findIndex((c) => c.id == data.id)
      if (indexToRemove >= 0) {
        categories.value.splice(indexToRemove, 1)
      }
      toast.add({
        severity: 'success',
        summary: 'Category deleted',
        detail: `${data.name} deleted`,
        life: 3000,
      })
    },
  })
}

const openAddModal = () => {
  categoryToEdit.value = {
    id: null,
    name: '',
    description: '',
  }
  showAddEditModal.value = true
}

const savedAddEditModal = async (category) => {
  showAddEditModal.value = false
  categoryToEdit.value = null
  if (!category.id) {
    const newCategory = await categoryApi.addCategory(category)
    categories.value.push(newCategory)
  } else {
    const editedCateogry = await categoryApi.updateCategory(category)
    const categoryInDisplay = categories.value.find((c) => c.id == editedCateogry.id)
    if (categoryInDisplay) {
      categoryInDisplay.name = editedCateogry.name
      categoryInDisplay.description = editedCateogry.description
    }
  }
}

const closeAddEditModal = () => {
  showAddEditModal.value = false
  categoryToEdit.value = null
}
</script>
