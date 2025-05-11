import { IsMongoId, IsNotEmpty, Min } from 'class-validator';

export class SessionSkillDto {
  @IsNotEmpty()
  @IsMongoId()
  skillId: string;
  @IsNotEmpty()
  @Min(1)
  numberOfTrials: number;
}
