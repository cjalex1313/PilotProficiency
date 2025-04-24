import { useBaseApi } from './baseApi'

export function useSkillApi() {
  const { baseApi } = useBaseApi()

  const getSkills = () => {
    return baseApi.get('/skill')
  }

  const getSkill = (id) => {
    return baseApi.get(`/skill/${id}`)
  }

  const createSkill = (skill) => {
    return baseApi.post('/skill', skill)
  }

  const updateSkill = (skill) => {
    return baseApi.put('/skill', skill)
  }

  const deleteSkill = (skillId) => {
    return baseApi.delete(`/skill/${skillId}`)
  }

  return { getSkills, getSkill, createSkill, updateSkill, deleteSkill }
}
