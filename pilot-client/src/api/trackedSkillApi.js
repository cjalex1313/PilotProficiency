import { useBaseApi } from './baseApi'

export function useTrackedSkillsApi() {
  const { baseApi } = useBaseApi()

  const getUserTrackedSkills = () => {
    return baseApi.get('/tracked-skills')
  }

  const getUserTrackedSkillsFull = () => {
    return baseApi.get('/tracked-skills/full')
  }

  const trackSkill = (skillId) => {
    return baseApi.patch(`/tracked-skills/track/${skillId}`)
  }

  const untrackSkill = (skillId) => {
    return baseApi.patch(`/tracked-skills/untrack/${skillId}`)
  }

  return {
    getUserTrackedSkills,
    trackSkill,
    untrackSkill,
    getUserTrackedSkillsFull,
  }
}
