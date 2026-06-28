import { SheetRow, DashboardMetrics } from "./types";

/**
 * Formats standard numbers into Eastern Arabic (Hindi) numerals commonly used in Arabic texts.
 * Handles both plain numbers and currency layout with thousands separators.
 */
export function formatToArabicNumerals(num: number | string, isCurrency = false): string {
  if (num === undefined || num === null) return "٠";
  
  // Format with standard thousands separator
  const formattedString = isCurrency
    ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(Number(num)))
    : Math.round(Number(num)).toLocaleString('en-US');

  // Replace each digit with its Arabic-Indic equivalent
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return formattedString.replace(/[0-9]/g, (w) => arabicDigits[Number(w)]);
}

/**
 * Computes all bento cards and KPI parameters from the sheet rows for the active month or year aggregate.
 */
export function computeMetrics(data: SheetRow[], selectedMonth: string): DashboardMetrics {
  const isAggregate = selectedMonth === "2026" || selectedMonth === "عام ٢٠٢٦" || selectedMonth === "عام 2026";
  const filtered = isAggregate 
    ? data 
    : data.filter(row => row.date === selectedMonth);

  const normalizedRows = filtered.map((row) => {
    const rawAspect = row.aspect || "";
    return {
      count: Number(row.count) || 0,
      norm: rawAspect
        .trim()
        .replace(/[أإآٱ]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/\s+/g, " ")
        .toLowerCase(),
      rawAspect
    };
  });

  // Initialize values
  let totalSeizures = 0;
  let totalSeizuresValue = 0;
  let totalSeizuresFromAspect = 0;
  
  const inspectorsMap: Record<string, number> = {
    "د.وليد القاضى ": 0,
    "د.احمد حسن عبد الجواد ": 0,
    "د.باسم محمد فوزي": 0,
    "د.محمود غازي": 0,
    "د.محمود خالد فؤاد ": 0
  };

  const platformsMap: Record<string, number> = {
    "انستاشوب": 0,
    "فيسبوك": 0,
    "انستاجرام": 0,
    "واتساب": 0,
    "موقع الكترونى": 0,
    "بدون": 0
  };

  let adwiaJadwal = 0;
  let adwiaMoharaba = 0;
  let adwiaMajhoula = 0;
  let mokhalafatSerJabri = 0;
  let adwiaShiraMowahad = 0;
  let electronicAppSales = 0;

  const facilitiesMap: Record<string, number> = {
    "صيدلية": 0,
    "مخزن": 0,
    "عيادة": 0,
    "مصنع": 0
  };

  // Standard Arabic text normalization helper to handle letter variations (e/a/y/t)
  const normalizeText = (str: string): string => {
    if (!str) return "";
    return str
      .trim()
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/\s+/g, " ")
      .toLowerCase();
  };

  normalizedRows.forEach(({ rawAspect, norm, count }) => {
    const trimmedAspect = rawAspect.trim();

    // 1. Inspectors
    if (norm.includes("وليد القاضي") || norm.includes("وليد القاضي ") || norm.includes("وليد القاضى")) {
      inspectorsMap["د.وليد القاضى "] += count;
    } else if (norm.includes("احمد حسن") || norm.includes("احمد حسن عبد الجواد")) {
      inspectorsMap["د.احمد حسن عبد الجواد "] += count;
    } else if (norm.includes("باسم محمد") || norm.includes("باسم فوزي") || norm.includes("باسم محمد فوزي")) {
      inspectorsMap["د.باسم محمد فوزي"] += count;
    } else if (norm.includes("محمود غازي") || norm.includes("محمود غازي ")) {
      inspectorsMap["د.محمود غازي"] += count;
    } else if (norm.includes("محمود خالد") || norm.includes("محمود خالد فؤاد")) {
      inspectorsMap["د.محمود خالد فؤاد "] += count;
    }

    // 2. Platforms
    if (norm === "انستاشوب") {
      platformsMap["انستاشوب"] += count;
    } else if (norm === "فيسبوك") {
      platformsMap["فيسبوك"] += count;
    } else if (norm === "انستاجرام") {
      platformsMap["انستاجرام"] += count;
    } else if (norm === "واتساب") {
      platformsMap["واتساب"] += count;
    } else if (norm === "موقع الكتروني" || norm === "موقع الكترونى") {
      platformsMap["موقع الكترونى"] += count;
    } else if (norm === "ميداني") {
      platformsMap["بدون"] += count;
    }

    // 3. Adwia Jadwal (أدوية جدول)
    if (
      norm === "الاتجار بالادويه المخدره المدرجه جدول اول مخدرات" ||
      norm === "الاتجار بالادويه المخدره المدرجه جدول ثالث مخدرات"
    ) {
      adwiaJadwal += count;
    }

    // 4. Adwia Moharaba (أدوية مهربة)
     if (norm === "عرض الادويه المهربه والغير مسجله بهيئه الدواء المصريه") {
      adwiaMoharaba += count;
    }

    // 5. Adwia Majhoula (أدوية مجهولة المصدر)
    if (
      norm === "عرض ادويه بدون فواتير مجهوله المصدر" ||
      norm === "عرض كميات كبيره من الادويه بدون فواتير رسميه"
    ) {
      adwiaMajhoula += count;
    }

    // 6. Mokhalafat Ser Jabri (مخالفات سعر جبري)
    if (norm === "عرض ادويه اعلي من السعر الجبري") {
      mokhalafatSerJabri += count;
    }

    // 7. Adwia Shira Mowahad (أدوية شراء موحد)
    if (norm === "عرض ادويه هيئه شراء موحد") {
      adwiaShiraMowahad += count;
    }

    // 8. Electronic App Sales (بيع عن طريق تطبيق الكتروني)
     if (
      norm === "بيع عن طريق تطبيق الكتروني (instashop)" ||
      norm === "بيع عن طريق تطبيق الكتروني"
    ) {
      electronicAppSales += count;
    }

    // 9. Total Seizures Value (اجمالى قيمة المضبوطات)
    if (norm === "اجمالي قيمه المضبوطات") {
      totalSeizuresValue += count;
    }

    // 10. Facilities
    if (norm === "صيدليه" || norm === "صيدلية") {
      facilitiesMap["صيدلية"] += count;
    } else if (norm === "مخزن") {
      facilitiesMap["مخزن"] += count;
    } else if (norm === "عياده" || norm === "عيادة") {
      facilitiesMap["عيادة"] += count;
    } else if (norm === "مصنع") {
      facilitiesMap["مصنع"] += count;
    }

    // 11. Dedicated Total Seizures aspect (إجمالى عدد الضبطيات)
    if (norm === "اجمالي عدد الضبطيات") {
      totalSeizuresFromAspect += count;
    }
  });

  // Calculate totalSeizures: use the dedicated aspect if found/greater than 0, otherwise fallback to the sum of inspectors
  totalSeizures = totalSeizuresFromAspect > 0 ? totalSeizuresFromAspect : Object.values(inspectorsMap).reduce((a, b) => a + b, 0);

  const inspectors = Object.keys(inspectorsMap).map(name => ({
    name,
    count: inspectorsMap[name]
  }));

  const platforms = Object.keys(platformsMap).map(name => ({
    name,
    count: platformsMap[name]
  }));

  const facilities = Object.keys(facilitiesMap).map(name => ({
    name,
    count: facilitiesMap[name],
    unit: name === "صيدلية" ? "صيدلية" : name === "مخزن" ? "مخازن" : name === "عيادة" ? "عيادة" : "مصانع"
  }));

  return {
    totalSeizures,
    totalSeizuresValue,
    inspectors,
    platforms,
    adwiaJadwal,
    adwiaMoharaba,
    adwiaMajhoula,
    mokhalafatSerJabri,
    adwiaShiraMowahad,
    electronicAppSales,
    facilities
  };
}
