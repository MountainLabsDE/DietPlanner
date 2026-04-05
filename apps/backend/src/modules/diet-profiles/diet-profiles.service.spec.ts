import { Test, TestingModule } from '@nestjs/testing';
import { DietProfilesService } from './diet-profiles.service';
import { PrismaService } from '../../services/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const predefinedDiets = [
  {
    type: 'vegan',
    name: 'Vegan',
    description: 'Plant-based diet excluding all animal products',
    restrictions: ['meat', 'dairy', 'eggs', 'honey'],
    icon: '🌱',
    color: 'green',
  },
  {
    type: 'keto',
    name: 'Ketogenic',
    description: 'High-fat, low-carb diet',
    restrictions: ['grains', 'sugar', 'starchy-vegetables', 'most-fruits'],
    icon: '🥑',
    color: 'yellow',
  },
];

const predefinedRestrictions = [
  { id: 'gluten-free', name: 'Gluten-Free', icon: '🌾' },
  { id: 'dairy-free', name: 'Dairy-Free', icon: '🥛' },
  { id: 'nut-free', name: 'Nut-Free', icon: '🥜' },
  { id: 'soy-free', name: 'Soy-Free', icon: '🫘' },
];

describe('DietProfilesService', () => {
  let service: DietProfilesService;
  let prismaService: PrismaService;
  const mockUserId = 'user-1';

  const mockPrismaService = {
    dietProfile: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DietProfilesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DietProfilesService>(DietProfilesService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('getPredefinedDietTypes', () => {
    it('should return all predefined diet types', () => {
      const result = service.getPredefinedDietTypes();

      expect(result).toHaveLength(predefinedDiets.length);
      expect(result[0]).toHaveProperty('type');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('restrictions');
    });
  });

  describe('getPredefinedRestrictions', () => {
    it('should return all predefined restrictions', () => {
      const result = service.getPredefinedRestrictions();

      expect(result).toHaveLength(predefinedRestrictions.length);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('icon');
    });
  });

  describe('create', () => {
    it('should create a new diet profile', async () => {
      const createDto = {
        userId: mockUserId,
        name: 'My Custom Diet',
        type: 'custom',
        restrictions: { exclude: ['nuts', 'dairy'] },
        config: { calorieTarget: 2000, proteinPercentage: 30 },
      };

      const mockProfile = {
        id: 'profile-1',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue({ id: mockUserId });
      mockPrismaService.dietProfile.create.mockResolvedValue(mockProfile);

      const result = await service.create(createDto);

      expect(result).toHaveProperty('id', 'profile-1');
      expect(result.name).toBe(createDto.name);
      expect(mockPrismaService.dietProfile.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const createDto = {
        userId: 'invalid-user',
        name: 'My Diet',
        type: 'custom',
        restrictions: {},
        config: {},
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should create from predefined diet type', async () => {
      const predefinedCreateDto = {
        userId: mockUserId,
        predefinedType: 'vegan',
      };

      const mockProfile = {
        id: 'profile-1',
        userId: mockUserId,
        name: 'Vegan',
        type: 'vegan',
        restrictions: { exclude: ['meat', 'dairy', 'eggs', 'honey'] },
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue({ id: mockUserId });
      mockPrismaService.dietProfile.create.mockResolvedValue(mockProfile);

      const result = await service.createFromPredefined(predefinedCreateDto);

      expect(result.type).toBe('vegan');
      expect(result.restrictions).toHaveProperty('exclude');
    });
  });

  describe('findAll', () => {
    it('should return all diet profiles for a user', async () => {
      const mockProfiles = [
        {
          id: 'profile-1',
          userId: mockUserId,
          name: 'Vegan',
          type: 'vegan',
          restrictions: {},
          config: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.dietProfile.findMany.mockResolvedValue(mockProfiles);

      const result = await service.findAll(mockUserId);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Vegan');
      expect(mockPrismaService.dietProfile.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a diet profile by id', async () => {
      const mockProfile = {
        id: 'profile-1',
        userId: mockUserId,
        name: 'Vegan',
        type: 'vegan',
        restrictions: {},
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.dietProfile.findUnique.mockResolvedValue(mockProfile);

      const result = await service.findOne('profile-1', mockUserId);

      expect(result.id).toBe('profile-1');
      expect(mockPrismaService.dietProfile.findUnique).toHaveBeenCalledWith({
        where: { id: 'profile-1' },
      });
    });

    it('should throw NotFoundException if profile not found', async () => {
      mockPrismaService.dietProfile.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne('nonexistent', mockUserId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if profile does not belong to user', async () => {
      const mockProfile = {
        id: 'profile-1',
        userId: 'other-user',
        name: 'Vegan',
        type: 'vegan',
        restrictions: {},
        config: {},
      };

      mockPrismaService.dietProfile.findUnique.mockResolvedValue(mockProfile);

      await expect(
        service.findOne('profile-1', mockUserId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a diet profile', async () => {
      const updateDto = {
        name: 'Updated Name',
        config: { calorieTarget: 2500 },
      };

      const mockProfile = {
        id: 'profile-1',
        userId: mockUserId,
        name: 'Old Name',
        type: 'vegan',
        restrictions: {},
        config: { calorieTarget: 2000 },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.dietProfile.findUnique.mockResolvedValue(mockProfile);
      mockPrismaService.dietProfile.update.mockResolvedValue({
        ...mockProfile,
        ...updateDto,
      });

      const result = await service.update('profile-1', mockUserId, updateDto);

      expect(result.name).toBe('Updated Name');
      expect(mockPrismaService.dietProfile.update).toHaveBeenCalledWith({
        where: { id: 'profile-1' },
        data: updateDto,
      });
    });

    it('should throw NotFoundException if profile not found', async () => {
      mockPrismaService.dietProfile.findUnique.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', mockUserId, { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('combine', () => {
    it('should combine multiple diet profiles', async () => {
      const combineDto = {
        userId: mockUserId,
        profileIds: ['profile-1', 'profile-2'],
        name: 'Vegan Keto',
      };

      const mockProfile1 = {
        id: 'profile-1',
        userId: mockUserId,
        name: 'Vegan',
        type: 'vegan',
        restrictions: { exclude: ['meat', 'dairy'] },
        config: {},
      };

      const mockProfile2 = {
        id: 'profile-2',
        userId: mockUserId,
        name: 'Keto',
        type: 'keto',
        restrictions: { exclude: ['grains', 'sugar'] },
        config: {},
      };

      const combinedProfile = {
        id: 'combined-1',
        ...combineDto,
        type: 'custom',
        restrictions: {
          exclude: ['meat', 'dairy', 'grains', 'sugar'],
        },
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.dietProfile.findUnique
        .mockResolvedValueOnce(mockProfile1)
        .mockResolvedValueOnce(mockProfile2);
      mockPrismaService.dietProfile.create.mockResolvedValue(combinedProfile);

      const result = await service.combine(combineDto);

      expect(result.restrictions.exclude).toContain('meat');
      expect(result.restrictions.exclude).toContain('grains');
      expect(result.name).toBe('Vegan Keto');
    });

    it('should throw BadRequestException if any profile does not belong to user', async () => {
      const combineDto = {
        userId: mockUserId,
        profileIds: ['profile-1', 'profile-2'],
        name: 'Combined',
      };

      const mockProfile1 = {
        id: 'profile-1',
        userId: mockUserId,
        name: 'Vegan',
        type: 'vegan',
        restrictions: {},
        config: {},
      };

      const mockProfile2 = {
        id: 'profile-2',
        userId: 'other-user',
        name: 'Keto',
        type: 'keto',
        restrictions: {},
        config: {},
      };

      mockPrismaService.dietProfile.findUnique
        .mockResolvedValueOnce(mockProfile1)
        .mockResolvedValueOnce(mockProfile2);

      await expect(service.combine(combineDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a diet profile', async () => {
      const mockProfile = {
        id: 'profile-1',
        userId: mockUserId,
        name: 'Vegan',
        type: 'vegan',
        restrictions: {},
        config: {},
      };

      mockPrismaService.dietProfile.findUnique.mockResolvedValue(mockProfile);
      mockPrismaService.dietProfile.delete.mockResolvedValue(mockProfile);

      await service.delete('profile-1', mockUserId);

      expect(mockPrismaService.dietProfile.delete).toHaveBeenCalledWith({
        where: { id: 'profile-1' },
      });
    });

    it('should throw NotFoundException if profile not found', async () => {
      mockPrismaService.dietProfile.findUnique.mockResolvedValue(null);

      await expect(service.delete('nonexistent', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
