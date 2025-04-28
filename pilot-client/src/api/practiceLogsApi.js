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

  const deletePracticeLog = (logId) => {
    return baseApi.delete(`/practice-logs/${logId}`)
  }

  const updatePracticeLog = (practiceLog) => {
    return baseApi.put('/practice-logs', practiceLog)
  }

  return { createPracticeLog, getSkillPracticeLogs, deletePracticeLog, updatePracticeLog }
}
