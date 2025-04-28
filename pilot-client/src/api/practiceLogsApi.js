import { useBaseApi } from './baseApi'

export function usePracticeLogsApi() {
  const { baseApi } = useBaseApi()

  const createPracticeLog = (practiceLog) => {
    return baseApi.post('/practice-logs', {
      skillId: practiceLog.skillId,
      practiceDate: practiceLog.practiceDate,
      proficiency: practiceLog.proficiency,
      notes: practiceLog.notes,
    })
  }

  const getSkillPracticeLogs = (skillid) => {
    return baseApi.get(`/practice-logs/skill/${skillid}`)
  }

  return { createPracticeLog, getSkillPracticeLogs }
}
