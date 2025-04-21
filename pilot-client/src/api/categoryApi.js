import { useBaseApi } from './baseApi'

export function useCategoryApi() {
  const { baseApi } = useBaseApi()

  const getCategories = () => {
    return baseApi.get('/category')
  }

  const addCategory = (category) => {
    return baseApi.post('/category', category)
  }

  const updateCategory = (category) => {
    return baseApi.put('/category', category)
  }

  const deleteCategory = (categoryId) => {
    return baseApi.delete(`/category/${categoryId}`)
  }

  return { getCategories, addCategory, updateCategory, deleteCategory }
}
