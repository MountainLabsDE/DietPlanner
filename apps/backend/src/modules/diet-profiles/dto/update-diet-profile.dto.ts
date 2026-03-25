import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateDietProfileDto } from './create-diet-profile.dto';

export class UpdateDietProfileDto extends PartialType(
  OmitType(CreateDietProfileDto, ['type'] as const)
) {}
