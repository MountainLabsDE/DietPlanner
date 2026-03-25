import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DietProfilesService } from './diet-profiles.service';
import { CreateDietProfileDto } from './dto/create-diet-profile.dto';
import { UpdateDietProfileDto } from './dto/update-diet-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('diet-profiles')
@Controller('diet-profiles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DietProfilesController {
  constructor(private readonly dietProfilesService: DietProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new diet profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully' })
  create(@Request() req, @Body() dto: CreateDietProfileDto) {
    return this.dietProfilesService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all diet profiles' })
  @ApiResponse({ status: 200, description: 'Profiles retrieved' })
  findAll(@Request() req, @Query('predefinedOnly') predefinedOnly?: string) {
    return this.dietProfilesService.findAll(
      req.user.id,
      predefinedOnly === 'true'
    );
  }

  @Get('predefined')
  @ApiOperation({ summary: 'Get all predefined diet profiles' })
  @ApiResponse({ status: 200, description: 'Predefined profiles retrieved' })
  getPredefinedProfiles() {
    return this.dietProfilesService.findAll(undefined, true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a diet profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile found' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.dietProfilesService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a diet profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDietProfileDto,
    @Request() req
  ) {
    return this.dietProfilesService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a diet profile' })
  @ApiResponse({ status: 200, description: 'Profile deleted successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.dietProfilesService.remove(id, req.user.id);
  }

  @Post('combine')
  @ApiOperation({ summary: 'Combine multiple diet profiles into one' })
  @ApiResponse({ status: 201, description: 'Combined profile created' })
  @ApiResponse({ status: 400, description: 'Invalid combination request' })
  combineProfiles(
    @Request() req,
    @Body()
    body: {
      name: string;
      profileIds: string[];
    }
  ) {
    return this.dietProfilesService.combineProfiles(
      req.user.id,
      body.name,
      body.profileIds
    );
  }
}
