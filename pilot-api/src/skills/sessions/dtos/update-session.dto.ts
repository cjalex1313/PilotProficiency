import { IsNotEmpty, IsMongoId } from 'class-validator';
import { CreateSessionDto } from './create-session.dto';

export class UpdateSessionDto extends CreateSessionDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
