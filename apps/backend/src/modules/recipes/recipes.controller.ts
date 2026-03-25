import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('recipes')
@Controller('recipes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new recipe' })
  @ApiResponse({ status: 201, description: 'Recipe created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  create(@Request() req, @Body() dto: CreateRecipeDto) {
    return this.recipesService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get recipes with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Recipes retrieved' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'tags', required: false, type: [String] })
  @ApiQuery({ name: 'restrictions', required: false, type: [String] })
  @ApiQuery({ name: 'maxCalories', required: false, type: Number })
  @ApiQuery({ name: 'mealType', required: false, type: String })
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('tags') tags?: string,
    @Query('restrictions') restrictions?: string,
    @Query('maxCalories') maxCalories?: string,
    @Query('mealType') mealType?: string
  ) {
    let parsedTags: string[] | undefined;
    let parsedRestrictions: string[] | undefined;

    if (tags) {
      parsedTags = tags.split(',').map((t) => t.trim());
    }

    if (restrictions) {
      parsedRestrictions = restrictions.split(',').map((r) => r.trim());
    }

    return this.recipesService.findAll(
      req.user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      search,
      parsedTags,
      parsedRestrictions,
      maxCalories ? parseInt(maxCalories) : undefined,
      mealType
    );
  }

  @Get('tags/:tag')
  @ApiOperation({ summary: 'Find recipes by tags' })
  @ApiResponse({ status: 200, description: 'Recipes found' })
  findByTags(@Param('tag') tag: string) {
    return this.recipesService.findByTags([tag]);
  }

  @Get('quick')
  @ApiOperation({ summary: 'Get quick and easy recipes' })
  @ApiResponse({ status: 200, description: 'Quick recipes retrieved' })
  @ApiQuery({ name: 'maxPrepTime', required: false, type: Number })
  findQuickAndEasy(@Query('maxPrepTime') maxPrepTime?: string) {
    return this.recipesService.findQuickAndEasy(
      maxPrepTime ? parseInt(maxPrepTime) : 30
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a recipe by ID' })
  @ApiResponse({ status: 200, description: 'Recipe found' })
  @ApiResponse({ status: 404, description: 'Recipe not found' })
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a recipe' })
  @ApiResponse({ status: 200, description: 'Recipe updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Recipe not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRecipeDto,
    @Request() req
  ) {
    return this.recipesService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a recipe' })
  @ApiResponse({ status: 200, description: 'Recipe deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Recipe not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.recipesService.remove(id, req.user.id);
  }
}
