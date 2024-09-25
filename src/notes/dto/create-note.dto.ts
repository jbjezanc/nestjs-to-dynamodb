import { IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  content: string;
}
