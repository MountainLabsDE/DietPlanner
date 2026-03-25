import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateRecipeDto) {
    const { prepTimeMinutes, cookTimeMinutes, difficultyLevel, ...rest } = dto;

    return this.prisma.recipe.create({
      data: {
        ...rest,
        prepTime: dto.prepTimeMinutes,
        cookTime: dto.cookTimeMinutes,
        difficulty: dto.difficultyLevel?.toString(),
        ingredients: dto.ingredients as any,
        instructions: dto.preparationSteps as any,
        nutrition: dto.nutrition as any,
        authorId: userId,
      },
    });
  }

  async findAll(
    userId?: string,
    page: number = 1,
    limit: number = 20,
    search?: string,
    tags?: string[],
    restrictions?: string[],
    maxCalories?: number,
    mealType?: string
  ) {
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    if (restrictions && restrictions.length > 0) {
      const restrictionsArray = Array.isArray(restrictions)
        ? restrictions
        : restrictions;
      where.restrictions = {
        hasSome: restrictionsArray,
      };
    }

    if (maxCalories) {
      where.nutrition = {
        path: ['calories'],
        lte: maxCalories,
      };
    }

    if (mealType) {
      where.mealType = mealType;
    }

    const [items, total] = await Promise.all([
      this.prisma.recipe.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.recipe.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    return recipe;
  }

  async update(id: string, userId: string, dto: UpdateRecipeDto) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    if (recipe.authorId !== userId) {
      throw new ForbiddenException('You can only update your own recipes');
    }

    return this.prisma.recipe.update({
      where: { id },
      data: {
        ...dto,
        ingredients: dto.ingredients ? (dto.ingredients as any) : undefined,
        instructions: dto.preparationSteps ? (dto.preparationSteps as any) : undefined,
        nutrition: dto.nutrition ? (dto.nutrition as any) : undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    if (!recipe.authorId || recipe.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own recipes');
    }

    await this.prisma.recipe.delete({
      where: { id },
    });

    return { message: 'Recipe deleted successfully' };
  }

  async findByTags(tags: string[]) {
    return this.findAll(
      undefined,
      1,
      100,
      undefined,
      tags
    );
  }

  async findQuickAndEasy(maxPrepTime: number = 30) {
    return this.findAll(
      undefined,
      1,
      20
    );
  }
}
