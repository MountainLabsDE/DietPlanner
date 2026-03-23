export enum DietProfileType {
  PREDEFINED = 'PREDEFINED',
  CUSTOM = 'CUSTOM',
  COMBINED = 'COMBINED',
}

export enum PredefinedDiet {
  VEGAN = 'VEGAN',
  VEGETARIAN = 'VEGETARIAN',
  KETO = 'KETO',
  PALEO = 'PALEO',
  MEDITERRANEAN = 'MEDITERRANEAN',
  LOW_CARB = 'LOW_CARB',
  HIGH_PROTEIN = 'HIGH_PROTEIN',
  GLUTEN_FREE = 'GLUTEN_FREE',
  DAIRY_FREE = 'DAIRY_FREE',
  RAW = 'RAW',
}

export interface DietProfile {
  id: string;
  userId?: string;
  type: DietProfileType;
  name: string;
  description?: string;
  restrictions?: string[];
  predefinedType?: PredefinedDiet;
  dailyCalorieTarget?: number;
  proteinPercentage?: number;
  carbsPercentage?: number;
  fatPercentage?: number;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDietProfileInput {
  type: DietProfileType;
  name: string;
  description?: string;
  restrictions?: string[];
  predefinedType?: PredefinedDiet;
  dailyCalorieTarget?: number;
  proteinPercentage?: number;
  carbsPercentage?: number;
  fatPercentage?: number;
  isFavorite?: boolean;
}

export interface UpdateDietProfileInput {
  name?: string;
  description?: string;
  restrictions?: string[];
  dailyCalorieTarget?: number;
  proteinPercentage?: number;
  carbsPercentage?: number;
  fatPercentage?: number;
  isFavorite?: boolean;
}

export interface DietProfileResponse {
  items: DietProfile[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const PROFILE_TYPE_OPTIONS = [
  { value: DietProfileType.PREDEFINED, label: 'Predefined', icon: '📋' },
  { value: DietProfileType.CUSTOM, label: 'Custom', icon: '⚙️' },
  { value: DietProfileType.COMBINED, label: 'Combined', icon: '🔗' },
] as const;

export const PREDEFINED_DIET_OPTIONS = [
  {
    value: PredefinedDiet.VEGAN,
    label: 'Vegan',
    description: 'Plant-based diet, no animal products',
    icon: '🌱',
    color: 'bg-green-500',
  },
  {
    value: PredefinedDiet.VEGETARIAN,
    label: 'Vegetarian',
    description: 'Plant-based with dairy and eggs',
    icon: '🥬',
    color: 'bg-green-600',
  },
  {
    value: PredefinedDiet.KETO,
    label: 'Keto',
    description: 'High fat, very low carb',
    icon: '🥑',
    color: 'bg-slate-600',
  },
  {
    value: PredefinedDiet.PALEO,
    label: 'Paleo',
    description: 'Whole foods, no grains or dairy',
    icon: '🍖',
    color: 'bg-orange-600',
  },
  {
    value: PredefinedDiet.MEDITERRANEAN,
    label: 'Mediterranean',
    description: 'Heart-healthy, focus on olive oil',
    icon: '🫒',
    color: 'bg-teal-600',
  },
  {
    value: PredefinedDiet.LOW_CARB,
    label: 'Low Carb',
    description: 'Reduced carbohydrates',
    icon: '🥜',
    color: 'bg-amber-600',
  },
  {
    value: PredefinedDiet.HIGH_PROTEIN,
    label: 'High Protein',
    description: 'Increased protein intake',
    icon: '💪',
    color: 'bg-red-600',
  },
  {
    value: PredefinedDiet.GLUTEN_FREE,
    label: 'Gluten-Free',
    description: 'No wheat, barley, rye',
    icon: '🌾',
    color: 'bg-yellow-600',
  },
  {
    value: PredefinedDiet.DAIRY_FREE,
    label: 'Dairy-Free',
    description: 'No dairy products',
    icon: '🥛',
    color: 'bg-slate-500',
  },
  {
    value: PredefinedDiet.RAW,
    label: 'Raw',
    description: 'Uncooked, unprocessed foods',
    icon: '🥕',
    color: 'bg-orange-500',
  },
] as const;

export const RESTRICTION_OPTIONS = [
  { value: 'gluten', label: 'Gluten', icon: '🌾' },
  { value: 'dairy', label: 'Dairy', icon: '🥛' },
  { value: 'nuts', label: 'Nuts', icon: '🥜' },
  { value: 'soy', label: 'Soy', icon: '🫘' },
  { value: 'eggs', label: 'Eggs', icon: '🥚' },
  { value: 'shellfish', label: 'Shellfish', icon: '🦐' },
  { value: 'fish', label: 'Fish', icon: '🐟' },
  { value: 'pork', label: 'Pork', icon: '🐷' },
  { value: 'beef', label: 'Beef', icon: '🥩' },
  { value: 'chicken', label: 'Chicken', icon: '🍗' },
  { value: 'sugar', label: 'Added Sugar', icon: '🍭' },
  { value: 'caffeine', label: 'Caffeine', icon: '☕' },
  { value: 'alcohol', label: 'Alcohol', icon: '🍷' },
  { value: 'nightshades', label: 'Nightshades', icon: '🍅' },
  { value: 'fodmap', label: 'FODMAP', icon: '🥗' },
] as const;

export const CALORIE_TARGET_OPTIONS = [
  { value: 1200, label: '1200 kcal', description: 'Weight loss' },
  { value: 1500, label: '1500 kcal', description: 'Moderate loss' },
  { value: 1800, label: '1800 kcal', description: 'Maintenance' },
  { value: 2000, label: '2000 kcal', description: 'Standard' },
  { value: 2500, label: '2500 kcal', description: 'Active lifestyle' },
  { value: 3000, label: '3000 kcal', description: 'High activity' },
] as const;

export const MACRO_COMBINATIONS = [
  {
    name: 'Balanced',
    protein: 30,
    carbs: 40,
    fat: 30,
    description: 'Well-rounded diet',
  },
  {
    name: 'Low Carb',
    protein: 40,
    carbs: 25,
    fat: 35,
    description: 'Reduced carbohydrates',
  },
  {
    name: 'High Protein',
    protein: 45,
    carbs: 35,
    fat: 20,
    description: 'Muscle building',
  },
  {
    name: ' ketogenic',
    protein: 25,
    carbs: 5,
    fat: 70,
    description: 'Keto diet',
  },
] as const;
