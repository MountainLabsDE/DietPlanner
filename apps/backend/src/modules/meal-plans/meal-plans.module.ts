import { Module } from '@nestjs/common';
import { MealPlansController } from './meal-plans.controller';
import { MealPlansService } from './meal-plans.service';
import { PrismaService } from '../../services/prisma.service';

@Module({
  controllers: [MealPlansController],
  providers: [MealPlansService, PrismaService],
  exports: [MealPlansService],
})
export class MealPlansModule {}
