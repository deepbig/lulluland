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