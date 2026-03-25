import { Module } from '@nestjs/common';
import { DietProfilesController } from './diet-profiles.controller';
import { DietProfilesService } from './diet-profiles.service';
import { PrismaService } from '../../services/prisma.service';

@Module({
  controllers: [DietProfilesController],
  providers: [DietProfilesService, PrismaService],
  exports: [DietProfilesService],
})
export class DietProfilesModule {}
