import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../services/prisma.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      const hashedPassword = await argon2.hash(registerDto.password);
      const mockUser = {
        id: '1',
        email: registerDto.email,
        passwordHash: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user).toHaveProperty('email', registerDto.email);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: registerDto.email,
          passwordHash: expect.any(String),
        }),
      });
    });

    it('should throw BadRequestException if email already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should hash the password before storing', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockUser = {
        id: '1',
        email: registerDto.email,
        passwordHash: 'hashed-password',
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockImplementation(async (data) => {
        const { passwordHash, ...rest } = data.data;
        return {
          ...mockUser,
          passwordHash,
        };
      });

      await service.register(registerDto);

      const createCall = mockPrismaService.user.create.mock.calls[0][0];
      const storedPassword = createCall.data.passwordHash;

      expect(await argon2.verify(storedPassword, registerDto.password)).toBe(
        true,
      );
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const hashedPassword = await argon2.hash(loginDto.password);
      const mockUser = {
        id: '1',
        email: loginDto.email,
        passwordHash: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user).toHaveProperty('email', loginDto.email);
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      const hashedPassword = await argon2.hash('Password123!');
      const mockUser = {
        id: '1',
        email: loginDto.email,
        passwordHash: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user without password when valid', async () => {
      const userId = '1';
      const hashedPassword = await argon2.hash('Password123!');
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        passwordHash: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser(userId);

      expect(result).toHaveProperty('id', userId);
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('should return null for invalid user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser('invalid-id');

      expect(result).toBeNull();
    });
  });
});
