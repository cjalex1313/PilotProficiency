import { CategoryDto } from './dtos/category/category.dto';
import { SkillDto } from './dtos/skill.dto';
import { Category } from './entities/category.entity';
import { Skill } from './entities/skill.entity';

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
