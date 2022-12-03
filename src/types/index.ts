export enum PageName {
  LANDING = '',
  SIGIN = '',
  EFFORT_TRACKER = 'Effort Tracker',
  FINANCE_TRACKER = 'Finance Tracker',
  GROUP = 'Group Dashboard',
  PROFILE = 'Profile',
}

export enum AssetTypes {
  CASH = 'Cash',
  FIXED_INCOME = 'Fixed Income',
  REAL_ASSET = 'Real Asset',
  EQUITY = 'Equity',
}

export enum ExpenseTypes {
  HOUSING = 'Housing', // mortgage or rent, household repairs, property taxes
  TRANSPORTATION = 'Transportation', // car payment, car warranty, gas, tires, maintenance, parking fees, repairs, registration and DMV fees
  FOOD = 'Food', // Groceries, Restaurants, Pet food
  UTILITY = 'Utility', // Electricity, water, garbage, phones, cable, internet
  CLOTHING = 'Clothing', // clothing, shoes
  HEALTHCARE = 'Medical/Healthcare', // primary care, dental care, specialty care, urgent care, medications, medical devices
  INSURANCE = 'Insurance', // Health insurance, homeowner's or renter's insurance, home warranty or protection plan, auto insurance, life insurance, disability insurance
  SUPPLY = 'Household Item/Supply', // Toiletries, laundary detergent, dishwasher detergent, cleaning supplies, tools
  PERSONAL = 'Personal', // Gym memberships, haircuts, salon services, cosmetics, babysitter, subscriptions
  DEBT = 'Debt', // Personal loans, student loans, credit cards
  RETIREMENT = 'Retirement', // Financial planning, investing
  EDUCATION = 'Education', // Children's college, your college, school supplies, books
  SAVING = 'Saving', // Emergency fund, big purchases(matress or laptop), other savings
  GIFT_DONATION = 'Gift/Donation', // Birthday, anniversary, wedding, chrismas, special occation, charities
  ENTERTAINMENT = 'Entertainment', // Alcohol and/or bars, Games, Movies, Concerts, Vacations, Subscriptions (Netflix, Amazon, etc.)
  TAX = 'Tax', // tax return
  ETC = 'etc',
}

export enum IncomeTypes {
  SALARY = 'Salary',
  COMMISSION = 'Commission',
  INTEREST = 'Interest',
  SELLING = 'Selling',
  INVESTMENT = 'Investment',
  DIVIDEND = 'Dividend',
  GIFT = 'Gift',
  ETC = 'etc',
}

export enum StockCountryTypes {
  USA = 'USA',
  KOR = 'KOR',
}

export enum StockTypes {
  ETF = 'etf',
  STOCK = 'stock',
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
  categories: CategoryData[]; // this should change to object
  groups: string[];
  disabled: string[];
  removed: string[];
  title: string;
  bio: string;
};

export type CategoryData = {
  category: string;
  color: number; // index of color index. TODO: change to color code or name by user input.
};

export interface ActivitySummaryData {
  category: string;
  yearly: ActivitySummaryYearlyData[];
}

export interface ActivitySummaryYearlyData {
  year: number;
  counts: number;
  durations: number;
  bestPractice: number;
  monthly: ActivitySummaryMonthlyData[];
}

export interface ActivitySummaryMonthlyData {
  month: number;
  counts: number;
  durations: number;
  bestPractice: number;
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

export interface PerformanceCategoryData {
  category: string;
  subcategories: string[];
}

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
  desc: string;
  count?: number;
}

// monthly asset summary data type
export interface AssetData {
  id: string;
  date: any;
  assets: SubAssetData;
  stocks: StockData[];
  incomes: IncomeExpensesData[];
  expenses: IncomeExpensesData[];
}

export interface IncomeExpensesData {
  date: any;
  description: string;
  category: string;
  amount: number;
}

export interface SubAssetData {
  [AssetTypes.CASH]: number;
  [AssetTypes.FIXED_INCOME]: number;
  [AssetTypes.REAL_ASSET]: number;
  [AssetTypes.EQUITY]: number;
}

export interface StockData {
  symbol: string;
  companyName: string;
  buyPrice: number;
  currentPrice: number;
  shares: number;
  country: string;
  type: string;
  currency: number;
}

export interface StockTag {
  symbol: string;
  label: string;
  country: StockCountryTypes.KOR | StockCountryTypes.USA;
  type: StockTypes.ETF | StockTypes.STOCK;
}

export interface StockHistoryData {
  id: string;
  date: any;
  symbol: string;
  companyName: string;
  buyPrice: number;
  sellPrice: number;
  shares: number;
  country: string;
  currency: number;
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
