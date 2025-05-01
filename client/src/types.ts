export interface PlanItem {
  category: string;
  plan: string;
  budget: number;
  actual: number;
}

export interface MunicipalityFormData {
  muniCode: string;
  muniName: string;
  province: string;
  website: string;
  totalBudget: number;
  totalSpent: number;
  plans: PlanItem[];
}

export const CATEGORIES = [
  "ด้านบริหารทั่วไป",
  "ด้านบริการชุมชนและสังคม",
  "ด้านเศรษฐกิจ",
  "ด้านดำเนินงานอื่น",
] as const;

export type Category = (typeof CATEGORIES)[number];
