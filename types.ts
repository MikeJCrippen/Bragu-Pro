
export type OriginType = 'Single Origin' | 'Blend';

export type RoastType = 'Light' | 'Light-Medium' | 'Medium' | 'Medium-Dark' | 'Dark';

export interface Bean {
  id: string;
  roaster: string;
  name: string;
  originType: OriginType;
  roastType: RoastType;
  tastingNotes: string;
  createdAt: number;
}

export interface Shot {
  id: string;
  beanId: string;
  timestamp: number;
  dose: number; // grams
  yield: number; // grams (common espresso variable)
  time: number; // seconds
  grindSetting: string; // alphanumeric grind setting
  rating: number; // 1-10
  notes: string;
}

export type SortOption = 'rating' | 'recent';

export type ViewState = 
  | { type: 'bean-list' }
  | { type: 'add-bean' }
  | { type: 'bean-details'; beanId: string }
  | { type: 'add-shot'; beanId: string };
