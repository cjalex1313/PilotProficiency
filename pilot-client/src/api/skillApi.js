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

  const getUserTrackedSkills = () => {
    return baseApi.get('/skill/tracked-skills')
  }

  const trackSkill = (skillId) => {
    return baseApi.patch(`/skill/tracked-skills/track/${skillId}`)
  }

  const untrackSkill = (skillId) => {
    return baseApi.patch(`/skill/tracked-skills/untrack/${skillId}`)
  }

  return {
    getSkills,
    getSkill,
    createSkill,
    updateSkill,
    deleteSkill,
    getUserTrackedSkills,
    trackSkill,
    untrackSkill,
  }
}
