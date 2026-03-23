export type DietRestriction =
  | 'vegan'
  | 'vegetarian'
  | 'keto'
  | 'paleo'
  | 'mediterranean'
  | 'low_fodmap'
  | 'gluten_free'
  | 'dairy_free'
  | 'nut_free'
  | 'custom';

export type DietProfileType = 'predefined' | 'custom' | 'combined';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Cuisine =
  | 'american'
  | 'italian'
  | 'mexican'
  | 'chinese'
  | 'japanese'
  | 'indian'
  | 'thai'
  | 'french'
  | 'greek'
  | 'spanish'
  | 'middle_eastern'
  | 'other';

export type FileType = 'json' | 'pdf' | 'csv';

export type ExportFormat = FileType;

export type MacroType = 'protein' | 'carbs' | 'fats' | 'fiber';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';
