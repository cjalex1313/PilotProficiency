import { useBaseApi } from './baseApi'

export function useSkillApi() {
  const { baseApi } = useBaseApi()

  const getSkills = () => {
    return baseApi.get('/skill')
  }

  return { getSkills }
}
