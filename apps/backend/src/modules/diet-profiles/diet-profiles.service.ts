import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreateDietProfileDto, PredefinedDiet, DietProfileType } from './dto/create-diet-profile.dto';
import { UpdateDietProfileDto } from './dto/update-diet-profile.dto';

@Injectable()
export class DietProfilesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateDietProfileDto) {
    let predefinedData = {};
    if (dto.type === DietProfileType.PREDEFINED && dto.predefinedType) {
      predefinedData = this.getPredefinedDietData(dto.predefinedType);
    }

    const { type, name, description, restrictions, ...rest } = dto;

    return this.prisma.dietProfile.create({
      data: {
        userId,
        type,
        name,
        description,
        predefinedType: dto.predefinedType,
        restrictions,
        config: predefinedData,
        ...rest,
      },
    });
  }

  async findAll(userId?: string, predefinedOnly = false) {
    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (predefinedOnly) {
      where.type = DietProfileType.PREDEFINED;
    }

    return this.prisma.dietProfile.findMany({
      where,
      include: {
        _count: {
          select: { mealPlans: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId?: string) {
    const profile = await this.prisma.dietProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        mealPlans: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(`Diet profile with ID ${id} not found`);
    }

    if (userId && profile.userId !== userId && !profile.isFavorite) {
      throw new ForbiddenException('Access denied');
    }

    return profile;
  }

  async update(id: string, userId: string, dto: UpdateDietProfileDto) {
    const profile = await this.prisma.dietProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(`Diet profile with ID ${id} not found`);
    }

    if (profile.userId !== userId) {
      throw new ForbiddenException('You can only update your own profiles');
    }

    return this.prisma.dietProfile.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const profile = await this.prisma.dietProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(`Diet profile with ID ${id} not found`);
    }

    if (profile.userId !== userId) {
      throw new ForbiddenException('You can only delete your own profiles');
    }

    await this.prisma.dietProfile.delete({
      where: { id },
    });

    return { message: 'Diet profile deleted successfully' };
  }

  async combineProfiles(
    userId: string,
    name: string,
    profileIds: string[]
  ) {
    if (profileIds.length < 2) {
      throw new Error('At least 2 profiles required for combination');
    }

    const profiles = await this.prisma.dietProfile.findMany({
      where: {
        id: { in: profileIds },
      },
    });

    if (profiles.length !== profileIds.length) {
      throw new NotFoundException('One or more profiles not found');
    }

    const allRestrictions = new Set<string>();
    let totalCalorieTarget = 0;
    let avgProtein = 0;
    let avgCarbs = 0;
    let avgFat = 0;

    profiles.forEach((profile) => {
      if (profile.restrictions && Array.isArray(profile.restrictions)) {
        const restrictions = profile.restrictions as string[];
        restrictions.forEach((r) => allRestrictions.add(r));
      }

      if (profile.dailyCalorieTarget) {
        totalCalorieTarget += profile.dailyCalorieTarget;
      }

      if (profile.proteinPercentage) {
        avgProtein += profile.proteinPercentage;
      }
      if (profile.carbsPercentage) {
        avgCarbs += profile.carbsPercentage;
      }
      if (profile.fatPercentage) {
        avgFat += profile.fatPercentage;
      }
    });

    return this.prisma.dietProfile.create({
      data: {
        userId,
        type: DietProfileType.COMBINED,
        name,
        restrictions: Array.from(allRestrictions),
        dailyCalorieTarget: Math.round(totalCalorieTarget / profiles.length),
        proteinPercentage: Math.round(avgProtein / profiles.length),
        carbsPercentage: Math.round(avgCarbs / profiles.length),
        fatPercentage: Math.round(avgFat / profiles.length),
        config: {
          sourceProfileIds: profileIds,
        },
      },
    });
  }

  private getPredefinedDietData(type: PredefinedDiet) {
    const predefinedDiets = {
      [PredefinedDiet.VEGAN]: {
        restrictions: ['no_meat', 'no_dairy', 'no_eggs', 'no_honey'],
        proteinPercentage: 15,
        carbsPercentage: 60,
        fatPercentage: 25,
      },
      [PredefinedDiet.VEGETARIAN]: {
        restrictions: ['no_meat', 'no_fish'],
        proteinPercentage: 20,
        carbsPercentage: 55,
        fatPercentage: 25,
      },
      [PredefinedDiet.KETO]: {
        restrictions: ['low_carb'],
        proteinPercentage: 25,
        carbsPercentage: 5,
        fatPercentage: 70,
      },
      [PredefinedDiet.PALEO]: {
        restrictions: ['no_grains', 'no_dairy', 'no_legumes', 'no_processed_foods'],
        proteinPercentage: 25,
        carbsPercentage: 40,
        fatPercentage: 35,
      },
      [PredefinedDiet.MEDITERRANEAN]: {
        restrictions: [],
        proteinPercentage: 18,
        carbsPercentage: 45,
        fatPercentage: 37,
      },
      [PredefinedDiet.LOW_CARB]: {
        restrictions: ['low_carb'],
        proteinPercentage: 25,
        carbsPercentage: 25,
        fatPercentage: 50,
      },
      [PredefinedDiet.HIGH_PROTEIN]: {
        restrictions: [],
        proteinPercentage: 35,
        carbsPercentage: 40,
        fatPercentage: 25,
      },
      [PredefinedDiet.GLUTEN_FREE]: {
        restrictions: ['no_gluten'],
        proteinPercentage: 20,
        carbsPercentage: 55,
        fatPercentage: 25,
      },
      [PredefinedDiet.DAIRY_FREE]: {
        restrictions: ['no_dairy'],
        proteinPercentage: 20,
        carbsPercentage: 55,
        fatPercentage: 25,
      },
      [PredefinedDiet.RAW]: {
        restrictions: ['no_cooked_foods', 'no_processed_foods'],
        proteinPercentage: 15,
        carbsPercentage: 60,
        fatPercentage: 25,
      },
    };

    return predefinedDiets[type] || {};
  }
}
