import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';
import { CreateMealEntryDto, CreateDailyTrackingDto } from './dto/create-meal-entry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tracking')
@ApiBearerAuth()
@Controller('tracking')
@UseGuards(JwtAuthGuard)
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('today')
  @ApiOperation({ summary: 'Get today's daily tracking' })
  @ApiResponse({ status: 200, description: 'Returns today's tracking or empty defaults' })
  async getTodayTracking(@Request() req: any) {
    return this.trackingService.getTodayTracking(req.user.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get tracking history' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to look back (default 30)' })
  @ApiResponse({ status: 200, description: 'Returns tracking history' })
  async getHistory(@Request() req: any, @Query('days') days?: string) {
    return this.trackingService.getTrackingHistory(req.user.id, days ? parseInt(days, 10) : 30);
  }

  @Get(':date')
  @ApiOperation({ summary: 'Get tracking for a specific date' })
  @ApiResponse({ status: 200, description: 'Returns tracking for the given date' })
  async getTrackingByDate(@Request() req: any, @Param('date') date: string) {
    return this.trackingService.getTrackingByDate(req.user.id, date);
  }

  @Post('init')
  @ApiOperation({ summary: 'Initialize daily tracking for a date' })
  @ApiResponse({ status: 201, description: 'Returns the created or existing tracking' })
  async initTracking(@Request() req: any, @Body() dto: CreateDailyTrackingDto) {
    return this.trackingService.initTracking(req.user.id, dto);
  }

  @Post('meals')
  @ApiOperation({ summary: 'Add a meal to today's tracking' })
  @ApiResponse({ status: 201, description: 'Returns updated tracking with new meal' })
  async addMeal(@Request() req: any, @Body() dto: CreateMealEntryDto) {
    return this.trackingService.addMeal(req.user.id, dto);
  }

  @Delete('meals/:mealId')
  @ApiOperation({ summary: 'Delete a meal from today's tracking' })
  @ApiResponse({ status: 200, description: 'Returns updated tracking without the meal' })
  async deleteMeal(@Request() req: any, @Param('mealId') mealId: string) {
    return this.trackingService.deleteMeal(req.user.id, mealId);
  }
}
