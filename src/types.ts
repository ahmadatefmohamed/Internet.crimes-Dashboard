export enum Month {
  JANUARY = "يناير",
  FEBRUARY = "فبراير",
  MARCH = "مارس",
  APRIL = "ابريل",
  MAY = "مايو",
  JUNE = "يونيو",
  JULY = "يوليو",
  AUGUST = "أغسطس",
  SEPTEMBER = "سبتمبر",
  OCTOBER = "أكتوبر",
  NOVEMBER = "نوفمبر",
  DECEMBER = "ديسمبر"
}

export interface SheetRow {
  aspect: string;
  count: number;
  date: string; // The month in Arabic, e.g. "يناير"
}

export interface InspectorStat {
  name: string;
  count: number;
}

export interface PlatformStat {
  name: string;
  count: number;
}

export interface FacilityStat {
  name: string;
  count: number;
  unit: string;
}

export interface DashboardMetrics {
  totalSeizures: number; // اجمالي عدد الضبطيات
  totalSeizuresValue: number; // اجمالي قيمة المضبوطات
  inspectors: InspectorStat[]; // عدد الضبطيات لكل مفتش
  platforms: PlatformStat[]; // انستاشوب، فيسبوك، انستاجرام، إلخ
  adwiaJadwal: number; // أدوية جدول
  adwiaMoharaba: number; // أدوية مهربة
  adwiaMajhoula: number; // أدوية مجهولة المصدر
  mokhalafatSerJabri: number; // مخالفات سعر جبري
  adwiaShiraMowahad: number; // أدوية شراء موحد
  electronicAppSales: number; // بيع عن طريق تطبيق الكتروني
  facilities: FacilityStat[]; // صيدلية، مخزن، عيادة، مصنع
}
