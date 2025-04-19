import { useBaseApi } from './baseApi'

export function useCategoryApi() {
  const { baseApi } = useBaseApi()

  const getCategories = () => {
    return baseApi.get('/category')
  }

  return { getCategories }
}
