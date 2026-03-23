export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  heightCm?: number;
  weightKg?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  preferences: UserPreferences;
  isVerified: boolean;
  isEmailSubscribed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  units: {
    weight: 'kg' | 'lbs';
    height: 'cm' | 'ft_in';
    temperature: 'c' | 'f';
  };
}

export interface CreateUserDTO {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  heightCm?: number;
  weightKg?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  preferences?: Partial<UserPreferences>;
}
