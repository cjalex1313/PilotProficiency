import { CategoryDto } from './skills/dtos/category/category.dto';
import { PracticeLogDto } from './skills/dtos/category/practice-log.dto';
import { SkillDto } from './skills/dtos/skill.dto';
import { Category } from './skills/entities/category.entity';
import { PracticeLog } from './skills/entities/practice-log.entity';
import { Session, SessionSkill } from './skills/entities/session.entity';
import { Skill } from './skills/entities/skill.entity';
import { SessionSkillDto } from './skills/sessions/dtos/session-skill.dto';
import { SessionDto } from './skills/sessions/dtos/session.dto';

export function mapSkillToDto(skill: Skill): SkillDto {
  return {
    id: skill._id.toString(),
    name: skill.name,
    description: skill.description,
    instructions: skill.instructions,
    categoryId: skill.categoryId,
    category: skill.category ? mapCategoryToDto(skill.category) : null,
    relatedSkillIds: skill.relatedSkillIds,
    relatedSkills: skill.relatedSkills
      ? skill.relatedSkills.map((rs) => mapSkillToDto(rs))
      : null,
  };
}

export function mapCategoryToDto(category: Category): CategoryDto {
  return new CategoryDto(
    category._id.toString(),
    category.name,
    category.description,
  );
}

export function mapPracticeLogToDto(practiceLog: PracticeLog): PracticeLogDto {
  return {
    id: practiceLog._id.toString(),
    userId: practiceLog.userId.toString(),
    skillId: practiceLog.skillId.toString(),
    skill: practiceLog.skill ? mapSkillToDto(practiceLog.skill) : null,
    practiceDate: practiceLog.practiceDate,
    proficiency: practiceLog.proficiency,
    notes: practiceLog.notes,
  };
}

export function mapSessionSkillToDto(
  sessionSkill: SessionSkill,
): SessionSkillDto {
  return {
    skillId: sessionSkill.skillId.toString(),
    numberOfTrials: sessionSkill.numberOfTrials,
  };
}

export function mapSessiontoDto(session: Session): SessionDto {
  return {
    id: session._id.toString(),
    name: session.name,
    date: session.date,
    durationMinutes: session.durationMinutes,
    notes: session.notes,
    status: session.status,
    skills: session.skills
      ? session.skills.map((s) => mapSessionSkillToDto(s))
      : [],
  };
}
