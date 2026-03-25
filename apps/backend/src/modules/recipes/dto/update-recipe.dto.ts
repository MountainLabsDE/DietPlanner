import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateRecipeDto } from './create-recipe.dto';

export class UpdateRecipeDto extends PartialType(
  OmitType(CreateRecipeDto, ['images'])
) {
  images?: string[];
}
