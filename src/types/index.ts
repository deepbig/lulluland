export enum PageName {
  LANDING = '',
  SIGIN = '',
  EFFORT_TRACKER = 'Effort Tracker',
  FINANCE_TRACKER = 'Finance Tracker',
  GROUP = 'Group Dashboard',
  PROFILE = 'Profile',
}

export type UserData = {
  uid: string;
  displayName: string;
  username: string;
  email: string;
  photoURL: string;
  gender: 'male' | 'female' | 'other' | null;
  age: number;
  levelOfExperience: number;
  peerRating: number;
  categories: string[];
  groups: string[];
  summaries: SummaryData[];
  disabled: string[];
  removed: string[];
  title: string;
  bio: string;
};

export interface SummaryData {
  totalPractices: number;
  totalDurations: number;
}

export interface ActivityData {
  id: string;
  category: string;
  date: any;
  duration: number;
  note: string;
}

export interface ActivityAddFormData {
  category: string;
  date: string;
  duration: number;
  note: string;
  uid: string;
}

export interface CategoryData {
  category: string;
  subcategories: string[];
};

export interface PerformanceData {
  id: string;
  category: string;
  subcategory: string;
  date: any;
  note: string;
  performance: number;
}

export interface PerformanceAddFormData {
  uid: string;
  category: string;
  subcategory: string;
  date: any;
  note: string;
  performance: number;
}

export interface PerformanceChartData {
  time: string;
  count?: number;
}

export interface SnackbarData {
  open: boolean;
  severity: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    guideline: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    guideline?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    guideline: true;
  }
}
