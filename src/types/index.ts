export enum PageName {
  LANDING = '',
  SIGIN = '',
  EFFORT_TRACKER = 'Effort Tracker',
  FINANCE_TRACKER = 'Finance Tracker',
  GROUP = 'Group Dashboard',
  PROFILE = "Profile",
}

export interface ActivityData {
  id?: string;
  category: string;
  date: any;
  level: number;
  note: string;
  values: number;
};

export type CategoryData = {
  category?: string;
  subcategories?: string[];
} | null;

export interface PerformanceData {
  id?: string;
  category: string;
  subcategory: string;
  date: any;
  note: string;
  values: number;
};

export interface PerformanceChartData {
  time: string;
  count?: number;
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