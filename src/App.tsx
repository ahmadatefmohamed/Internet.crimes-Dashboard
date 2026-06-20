/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  Printer, 
  Share2, 
  Download, 
  RotateCcw, 
  Copy, 
  Check, 
  Database, 
  TrendingUp, 
  Activity, 
  X,
  Plus,
  Trash2,
  Languages,
  LayoutGrid,
  FileCode,
  Sparkles,
  Search,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Calendar
} from "lucide-react";
import { INITIAL_SHEET_DATA } from "./data";
import { SheetRow, Month } from "./types";
import { computeMetrics, formatToArabicNumerals } from "./utils";
import { CODE_GS, INDEX_HTML } from "./gas_templates";
// @ts-ignore
// import html2pdf from "html2pdf.js";

const DEFAULT_GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1QBzi7aiZxiR71TnGE1nGIH0F6DTONFvJIC64FF4IUME/edit?gid=725534306#gid=725534306";
const OLD_DEFAULT_GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1vH_C5K8V7CezsX-jKjvep-G4WvP7m_kP-X4N8Uv7tM4/edit";

const getFacilityModalTitle = (name: string) => {
  if (name === "صيدلية") return "عدد الصيدليات المضبوطة";
  if (name === "مخزن") return "عدد المخازن المضبوطة";
  if (name === "عيادة") return "عدد العيادات المضبوطة";
  if (name === "مصنع") return "عدد المصانع المضبوطة";
  return name;
};

const getPlatformModalTitle = (name: string, label: string) => {
  if (name === "بدون" || label === "ميدانى" || label === "ميداني") return "ضبطيات ميدانية";
  return `ضبطيات منصة: ${label}`;
};

interface BentoDashboardPureStyleProps {
  mMetrics: any;
  title: string;
  subtitle: string;
  formatNum: (num: number, isCurrency?: boolean) => string;
  aspectMetadata: any;
  openModalForAspect?: (title: string, aspectKey: string, unit?: string) => void;
}

function BentoDashboardPureStyle({
  mMetrics,
  title,
  subtitle,
  formatNum,
  aspectMetadata,
  openModalForAspect
}: BentoDashboardPureStyleProps) {
  return (
    <div className="printable-dashboard-area bg-white text-[#171717] p-8 md:p-10 rounded-3xl relative flex flex-col justify-between w-full min-h-[297mm] print:h-[282mm] print:max-h-[282mm] print:min-h-[282mm] print:p-5 print:py-4 print:shadow-none print:rounded-none">
      <div className="flex-1 flex flex-col justify-between print:justify-start">
        {/* Header */}
        <div className="pb-4 print:pb-1.5 mb-6 print:mb-3 text-center border-b border-neutral-150">
          <h1 className="text-xl font-extrabold font-serif text-neutral-950">{title}</h1>
          <p className="text-xs text-neutral-500 mt-1 font-serif font-semibold">
            {subtitle}
          </p>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="bento-main-grid grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-5 print:gap-3.5 text-right items-stretch">
          
          {/* CARD 1: Total Seizure value in LE */}
          <div 
            onClick={() => openModalForAspect?.("إجمالي القيمة التقديرية للمضبوطات الدوائية", "اجمالى قيمة المضبوطات", "جنيه")}
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-300 bento-card cursor-pointer group hover:border-blue-600/30"
          >
            <div>
              <h3 className="text-sm font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">إجمالي قيمة المضبوطات المقدرة</h3>
            </div>
            <div className="mt-5 print:mt-2.5 flex items-baseline gap-1 bg-transparent">
              <span className="text-2xl font-extrabold text-[#171717] tracking-tight font-mono apple-num group-hover:text-blue-600 transition-colors">
                {formatNum(mMetrics.totalSeizuresValue, true)}
              </span>
              <span className="text-xs font-bold text-neutral-400 group-hover:text-blue-500 transition-colors">جنيه</span>
            </div>
          </div>

          {/* CARD 2: Total seizures counts */}
          <div 
            onClick={() => openModalForAspect?.("إجمالي عدد الضبطيات الرقمية لوحدة الرصد", "إجمالي الضبطيات", "ضبطية")}
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-300 bento-card cursor-pointer group hover:border-blue-600/30"
          >
            <div>
              <h3 className="text-sm font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">إجمالي عدد الضبطيات المنفذة</h3>
            </div>
            <div className="mt-5 print:mt-2.5 flex items-baseline gap-1 bg-transparent">
              <span className="text-3xl font-black text-[#171717] tracking-tight font-mono apple-num group-hover:text-blue-600 transition-colors">
                {formatNum(mMetrics.totalSeizures)}
              </span>
              <span className="text-xs font-bold text-neutral-400 group-hover:text-blue-500 transition-colors">ضبطية</span>
            </div>
          </div>

          {/* CARD 3: Facilities Target numbers */}
          <div className="border border-[#ECEEF2] bg-white rounded-2xl p-4 print:p-2.5 flex flex-col bento-card items-stretch justify-start md:row-span-2 print:row-span-2">
            <h3 className="text-xs font-extrabold text-neutral-800 font-serif text-center border-b border-neutral-100 pb-2 print:pb-1 mb-3 print:mb-1.5 shrink-0">نوع المؤسسة</h3>
            <div className="flex-1 flex flex-col justify-center py-1">
              <div className="grid grid-cols-2 gap-3 print:gap-1.5 mx-auto w-full max-w-[290px] font-serif">
                {mMetrics.facilities.map((fac: any) => {
                  const meta = aspectMetadata[fac.name] || { label: fac.name };
                  return (
                    <div 
                      key={fac.name}
                      onClick={() => openModalForAspect?.(getFacilityModalTitle(fac.name), fac.name)}
                      className="border border-[#ECEEF2] bg-neutral-50/25 hover:bg-neutral-50/10 rounded-2xl p-3.5 print:p-1.5 print:rounded-xl flex flex-col justify-center items-center text-center transition-all duration-300 cursor-pointer group hover:border-blue-600/30 aspect-[1.12/1] print:aspect-auto"
                    >
                      <span className="text-[11px] font-bold text-neutral-500 font-serif leading-tight group-hover:text-blue-500 transition-colors">{meta.label}</span>
                      <span className="text-xl font-black text-[#171717] font-mono apple-num mt-2 print:mt-1 group-hover:text-blue-600 transition-colors">
                        {formatNum(fac.count)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CARD 4: Inspector Performance */}
          <div className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col bento-card items-stretch justify-start md:row-span-2 print:row-span-2">
            <h3 className="text-xs font-extrabold text-neutral-800 font-serif border-b border-neutral-100 pb-2 print:pb-1 mb-3 print:mb-1.5 text-right">عدد الضبطيات الموثقة لكل مفتش</h3>
            <div className="flex-1 flex flex-col justify-center space-y-2.5 print:space-y-1">
              {mMetrics.inspectors.map((insp: any) => {
                const maxVal = Math.max(...mMetrics.inspectors.map((i: any) => i.count)) || 1;
                const percentage = (insp.count / maxVal) * 100;
                return (
                  <div 
                    key={insp.name} 
                    onClick={() => openModalForAspect?.(`ضبطيات المفتش الميداني: ${insp.name}`, insp.name)}
                    className="flex items-center justify-between gap-3 cursor-pointer group/item py-1 border-b border-neutral-50 last:border-none"
                  >
                    <div className="flex-1 flex flex-col gap-1 text-right">
                      <span className="font-bold text-neutral-600 font-serif group-hover/item:text-blue-600 text-[10px]">
                        {aspectMetadata[insp.name]?.label || insp.name}
                      </span>
                      <div className="w-full bg-[#F5F5F5] h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#555] h-1 rounded-full transition-all duration-700 ease-out group-hover/item:bg-blue-600" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center shrink-0 min-w-[42px] bg-neutral-50/70 border border-neutral-100 rounded-lg py-1 px-1">
                      <span className="font-bold text-[#171717] text-[11px] font-mono apple-num leading-none">{formatNum(insp.count)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CARD 5: Facebook */}
          <div 
            onClick={() => openModalForAspect?.("مخالفات الترويج عبر الفيسبوك", "فيسبوك")}
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-300 bento-card cursor-pointer group hover:border-blue-600/30"
          >
            <div>
              <h3 className="text-sm font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">بيع من خلال فيسبوك</h3>
            </div>
            <div className="mt-5 print:mt-2.5 flex items-baseline gap-1 bg-transparent">
              <span className="text-2xl font-extrabold text-[#171717] font-mono apple-num group-hover:text-blue-600 transition-colors">
                {formatNum(mMetrics.platforms.find((p: any) => p.name === "فيسبوك")?.count || 0)}
              </span>
              <span className="text-[10px] text-neutral-450">ضبطية</span>
            </div>
          </div>

          {/* CARD 6: Instashop */}
          <div 
            onClick={() => openModalForAspect?.("مخالفات التوصيل عبر تطبيق انستاشوب", "انستاشوب")}
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-300 bento-card cursor-pointer group hover:border-[#171717]/40"
          >
            <div>
              <h3 className="text-sm font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">بيع عبر تطبيق انستاشوب</h3>
            </div>
            <div className="mt-5 print:mt-2.5 flex items-baseline gap-1 bg-transparent">
              <span className="text-2xl font-extrabold text-[#171717] font-mono apple-num group-hover:text-blue-600 transition-colors">
                {formatNum(mMetrics.platforms.find((p: any) => p.name === "انستاشوب")?.count || 0)}
              </span>
              <span className="text-[10px] text-neutral-450">ضبطية</span>
            </div>
          </div>

          {/* CARD 7: Schedule Drugs */}
          <div 
            onClick={() => openModalForAspect?.("مخالفات الاتجار بالأدوية المخدرة والسموم", "أدوية جدول")}
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-300 bento-card cursor-pointer group hover:border-red-500/30"
          >
            <div>
              <h3 className="text-sm font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">أدوية الجدول (أول وثاث مخدرات)</h3>
            </div>
            <div className="mt-5 print:mt-2.5 flex items-baseline gap-1 bg-transparent">
              <span className="text-2xl font-extrabold text-[#171717] font-mono apple-num group-hover:text-red-650 transition-colors">
                {formatNum(mMetrics.adwiaJadwal)}
              </span>
              <span className="text-[10px] text-neutral-400">ضبطية</span>
            </div>
          </div>

          {/* CARD 8: Remaining platforms (Spans 2 columns on medium up screens to balance layout perfectly) */}
          <div className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 transition-all flex flex-col md:col-span-2 print:col-span-2 bento-card text-right">
            <h3 className="text-sm font-bold text-[#171717] font-serif border-b border-neutral-100 pb-2 print:pb-1 mb-3 print:mb-1.5">وسائل التواصل ومنصات العرض</h3>
            <div className="grid grid-cols-2 gap-x-5 print:gap-x-3.5 gap-y-2.5 print:gap-y-1 flex-1 content-center">
              {mMetrics.platforms.map((p: any) => {
                const meta = aspectMetadata[p.name] || { label: p.name };
                return (
                  <div 
                    key={p.name}
                    onClick={() => openModalForAspect?.(getPlatformModalTitle(p.name, meta.label), p.name)}
                    className="flex justify-between items-center py-1.5 border-b border-neutral-50 hover:bg-neutral-50/50 rounded px-1 transition-colors cursor-pointer group/item text-xs"
                  >
                    <span className="font-semibold text-neutral-500 font-serif group-hover/item:text-blue-600 transition-colors">{meta.label}</span>
                    <div className="flex items-center gap-1 font-mono apple-num">
                      <span className="font-bold text-[#171717] group-hover/item:text-blue-600 transition-colors">{formatNum(p.count)}</span>
                      <span className="text-[9px] text-neutral-400 font-serif">ضبطية</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CARD 9: Smuggled Drugs */}
          <div 
            onClick={() => openModalForAspect?.("أدوية مهربة وغير مسجلة بهيئة الدواء المصرية", "عرض الأدوية المهربة والغير مسجلة بهيئة الدواء المصرية")}
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-300 bento-card cursor-pointer group hover:border-amber-500/30"
          >
            <div>
              <h3 className="text-sm font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">أدوية مهربة وغير مسجلة بهيئة الدواء</h3>
            </div>
            <div className="mt-5 print:mt-2.5 flex items-baseline gap-1 bg-transparent">
              <span className="text-2xl font-extrabold text-[#171717] font-mono apple-num group-hover:text-blue-600 transition-colors">
                {formatNum(mMetrics.adwiaMoharaba)}
              </span>
              <span className="text-[10px] text-neutral-450">ضبطية</span>
            </div>
          </div>

          {/* CARD 10: Unknown Source Drugs */}
          <div 
            onClick={() => openModalForAspect?.("أدوية بدون فواتير رسمية مجهولة المصدر", "أدوية مجهولة المصدر")}
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-300 bento-card cursor-pointer group hover:border-purple-500/30"
          >
            <div>
              <h3 className="text-sm font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">عرض مستحضرات بدون فواتير رسمية</h3>
            </div>
            <div className="mt-5 print:mt-2.5 flex items-baseline gap-1 bg-transparent">
              <span className="text-2xl font-extrabold text-[#171717] font-mono apple-num group-hover:text-blue-600 transition-colors">
                {formatNum(mMetrics.adwiaMajhoula)}
              </span>
              <span className="text-[10px] text-neutral-450">ضبطية</span>
            </div>
          </div>

          {/* CARD 11: Price Violations */}
          <div 
            onClick={() => openModalForAspect?.("مخالفات البيع بأعلى من التسعيرة الجبرية المعتمدة", "عرض ادوية  أعلى من السعر الجبري")}
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-300 bento-card cursor-pointer group hover:border-indigo-550/30"
          >
            <div>
              <h3 className="text-sm font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">بيع بأعلى من السعر الجبرى</h3>
            </div>
            <div className="mt-5 print:mt-2.5 flex items-baseline gap-1 bg-transparent">
              <span className="text-2xl font-extrabold text-[#171717] font-mono apple-num group-hover:text-blue-600 transition-colors">
                {formatNum(mMetrics.mokhalafatSerJabri)}
              </span>
              <span className="text-[10px] text-neutral-450">ضبطية</span>
            </div>
          </div>

          {/* CARD 12: Unified purchase drugs */}
          <div 
            onClick={() => openModalForAspect?.("مستحضرات مسربة خاصة بهيئة الشراء الموحد", "عرض ادوية هيئة شراء موحد")}
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-300 bento-card cursor-pointer group hover:border-emerald-500/30"
          >
            <div>
              <h3 className="text-sm font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">بيع أدوية مخصصة لهيئة الشراء الموحد</h3>
            </div>
            <div className="mt-5 print:mt-2.5 flex items-baseline gap-1 bg-transparent">
              <span className="text-2xl font-extrabold text-[#171717] font-mono apple-num group-hover:text-blue-600 transition-colors">
                {formatNum(mMetrics.adwiaShiraMowahad)}
              </span>
              <span className="text-[10px] text-neutral-450">ضبطية</span>
            </div>
          </div>

          {/* CARD 13: Online app sales (Full Width Centered Card) */}
          <div 
            onClick={() => openModalForAspect?.("مخالفات البيع عبر التطبيقات الإلكترونية", "بيع عن طريق تطبيق الكتروني")}
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-2.5 transition-all md:col-span-3 print:col-span-3 flex flex-col items-center justify-center text-center bento-card cursor-pointer group hover:border-[#171717]/40"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-sm md:text-md font-bold font-serif text-[#171717] mb-2.5 print:mb-1 group-hover:text-blue-600 transition-colors">بيع عن طريق تطبيق الكترونى</h3>
              <div className="bg-[#FAFAFA]/70 border border-neutral-100 rounded-xl px-5 print:px-4 py-2.5 print:py-1.5 min-w-[250px] flex items-center justify-between gap-6 hover:bg-neutral-50 transition-colors text-xs">
                <span className="font-bold text-neutral-500 font-serif">إجمالي قضايا بيع التطبيقات</span>
                <div className="flex items-baseline gap-1 font-mono apple-num">
                  <span className="text-xl font-extrabold text-[#171717] tracking-tight group-hover:text-blue-600 transition-colors">
                    {formatNum(mMetrics.electronicAppSales)}
                  </span>
                  <span className="font-bold text-neutral-400 font-serif">ضبطية</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer info line */}
      <div className="text-center text-[10px] text-neutral-400 mt-5 print:mt-2 pt-3 print:pt-1 border-t border-neutral-100 font-serif apple-num font-bold">
        <span>تقرير وحدة جرائم الإنترنت - هيئة الدواء المصرية</span>
      </div>
    </div>
  );
}

const monthsRTL = [
  "يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

export default function App() {
  // --- STATE ---
  const [sheetData, setSheetData] = useState<SheetRow[]>(() => {
    const savedData = localStorage.getItem("cybercrime_sheet_data");
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        return INITIAL_SHEET_DATA;
      }
    }
    return INITIAL_SHEET_DATA;
  });

  // Dynamically computed list of all unique aspects from loaded sheet data
  const uniqueAspects = useMemo(() => {
    return Array.from(new Set(sheetData.map(r => r.aspect.trim()))) as string[];
  }, [sheetData]);
  const [selectedMonth, setSelectedMonth] = useState<string>("2026"); // "2026" is the year aggregate
  const [activeTab, setActiveTab] = useState<"dashboard" | "spreadsheet">("dashboard");
  const [isHindiNumerals, setIsHindiNumerals] = useState<boolean>(true);
  
  // Google Sheets Direct Connect States
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>(() => {
    const saved = localStorage.getItem("cybercrime_sheet_url");
    if (!saved || saved === OLD_DEFAULT_GOOGLE_SHEET_URL) {
      return DEFAULT_GOOGLE_SHEET_URL;
    }
    return saved;
  });
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem("cybercrime_last_synced") || null;
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Custom printing state to support multi-page A4 PDF printing of all 13 tabs!
  const [isPrintingAll, setIsPrintingAll] = useState<boolean>(false);

  // Check if we are in printable web page mode
  const [printParam] = useState<string | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("print");
  });

  // Automatically trigger PDF/printing prompt when loading a print tab
  useEffect(() => {
    if (printParam) {
      const originalTitle = document.title;
      const formattedTitle = printParam === "all"
        ? "التقرير_الإحصائي_السنوي_لوحدة_جرائم_الإنترنت_٢٠٢٦"
        : `تقرير_ضبطيات_جرائم_الإنترنت_شهر_${printParam}_٢٠٢٦`;
      document.title = formattedTitle;

      const timer = setTimeout(() => {
        window.print();
      }, 1000);

      return () => {
        clearTimeout(timer);
        document.title = originalTitle;
      };
    }
  }, [printParam]);
  
  // Dropdown States
  const [showPrintDropdown, setShowPrintDropdown] = useState<boolean>(false);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState<boolean>(false);
  
  // Custom Filter States for sheetData view dropdowns
  const [selectedFilterMonths, setSelectedFilterMonths] = useState<string[]>(["الكل"]);
  const [selectedFilterAspects, setSelectedFilterAspects] = useState<string[]>(["الكل"]);
  const [isMonthFilterOpen, setIsMonthFilterOpen] = useState<boolean>(false);
  const [isAspectFilterOpen, setIsAspectFilterOpen] = useState<boolean>(false);

  // Monitor printer finish or cancellation to clean up document body print flags
  useEffect(() => {
    const handleAfterPrint = () => {
      document.body.removeAttribute("data-print-modal");
      document.body.removeAttribute("data-print-spreadsheet");
    };
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  // Collapse dropdowns when clicking outside them
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close filters on click outside
      const monthContainer = document.getElementById("filter-months-dropdown-container");
      if (monthContainer && !monthContainer.contains(target)) {
        setIsMonthFilterOpen(false);
      }
      
      const aspectContainer = document.getElementById("filter-aspects-dropdown-container");
      if (aspectContainer && !aspectContainer.contains(target)) {
        setIsAspectFilterOpen(false);
      }
      
      // Close Print/Download dropdowns if clicked outside their parent container
      const printBtn = document.querySelector("button[title='طباعة التقرير']");
      if (printBtn && printBtn.parentElement && !printBtn.parentElement.contains(target)) {
        setShowPrintDropdown(false);
      }
      
      const downloadBtn = document.querySelector("button[title='تحميل كملف PDF']");
      if (downloadBtn && downloadBtn.parentElement && !downloadBtn.parentElement.contains(target)) {
        setShowDownloadDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Multi-select Toggle Handler for Months Filter
  const toggleMonthFilter = (month: string) => {
    const allMonthsAndTotal = [...monthsRTL, "إجمالي العام"];
    if (month === "الكل") {
      if (selectedFilterMonths.includes("الكل")) {
        setSelectedFilterMonths([]);
      } else {
        setSelectedFilterMonths(["الكل"]);
      }
    } else {
      let nextSelected = selectedFilterMonths.includes("الكل") 
        ? [...allMonthsAndTotal] 
        : [...selectedFilterMonths];
      
      if (nextSelected.includes(month)) {
        nextSelected = nextSelected.filter(m => m !== month);
      } else {
        nextSelected.push(month);
      }

      if (allMonthsAndTotal.every(m => nextSelected.includes(m))) {
        setSelectedFilterMonths(["الكل"]);
      } else if (nextSelected.length === 0) {
        setSelectedFilterMonths([]);
      } else {
        setSelectedFilterMonths(nextSelected.filter(m => m !== "الكل"));
      }
    }
  };

  // Multi-select Toggle Handler for Aspects Filter
  const toggleAspectFilter = (aspect: string) => {
    if (aspect === "الكل") {
      if (selectedFilterAspects.includes("الكل")) {
        setSelectedFilterAspects([]);
      } else {
        setSelectedFilterAspects(["الكل"]);
      }
    } else {
      let nextSelected = selectedFilterAspects.includes("الكل")
        ? [...uniqueAspects]
        : [...selectedFilterAspects];

      if (nextSelected.includes(aspect)) {
        nextSelected = nextSelected.filter(a => a !== aspect);
      } else {
        nextSelected.push(aspect);
      }

      if (uniqueAspects.every(a => nextSelected.includes(a))) {
        setSelectedFilterAspects(["الكل"]);
      } else if (nextSelected.length === 0) {
        setSelectedFilterAspects([]);
      } else {
        setSelectedFilterAspects(nextSelected.filter(a => a !== "الكل"));
      }
    }
  };

  // Filter Checks helper
  const isMonthActive = (m: string) => {
    if (selectedFilterMonths.includes("الكل")) return true;
    return selectedFilterMonths.includes(m);
  };

  const isAspectActive = (a: string) => {
    if (selectedFilterAspects.includes("الكل")) return true;
    return selectedFilterAspects.includes(a);
  };

  const getSpreadsheetSubtitle = () => {
    if (selectedFilterMonths.length === 0) {
      return "لا توجد أشهر محددة";
    }
    if (selectedFilterMonths.includes("الكل")) {
      return "لسنة ٢٠٢٦";
    }
    
    const hasTotal = selectedFilterMonths.includes("إجمالي العام");
    const monthsOnly = monthsRTL.filter(m => selectedFilterMonths.includes(m));
    
    if (monthsOnly.length === 12) {
      return hasTotal ? "لسنة ٢٠٢٦ مع الإجمالي" : "لسنة ٢٠٢٦";
    }
    if (monthsOnly.length === 0) {
      return "للإجمالي فقط";
    }
    if (monthsOnly.length === 1) {
      return `لشهر ${monthsOnly[0]} ٢٠٢٦`;
    }
    if (monthsOnly.length === 2) {
      return `لشهري ${monthsOnly[0]} و${monthsOnly[1]} ٢٠٢٦`;
    }
    return `لشهور ${monthsOnly.join(" و")} ٢٠٢٦`;
  };
  
  // Modal State for aggregated aspect chart click
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    aspectKey: string;
    unit: string;
  }>({
    isOpen: false,
    title: "",
    aspectKey: "",
    unit: "ضبطية"
  });

  // Spreadsheet Editor state
  const [editorSearch, setEditorSearch] = useState<string>("");
  const [newAspectName, setNewAspectName] = useState<string>("");
  const [newAspectCount, setNewAspectCount] = useState<number>(0);
  const [newAspectMonth, setNewAspectMonth] = useState<string>("يناير");

  // Copy feedback states
  const [copiedCodeGs, setCopiedCodeGs] = useState<boolean>(false);
  const [copiedIndexHtml, setCopiedIndexHtml] = useState<boolean>(false);

  // Helper mapping dictionary for nice aspect titles and visual colors
  const aspectMetadata: Record<string, { label: string; bg: string; text: string }> = {
    "د.وليد القاضى ": { label: "د.وليد القاضي", bg: "bg-neutral-100", text: "text-neutral-800" },
    "د.احمد حسن عبد الجواد ": { label: "د.أحمد حسن عبد الجواد", bg: "bg-neutral-100", text: "text-neutral-800" },
    "د.باسم محمد فوزي": { label: "د.باسم محمد فوزي", bg: "bg-neutral-100", text: "text-neutral-800" },
    "د.محمود غازي": { label: "د.محمود غازي", bg: "bg-neutral-100", text: "text-neutral-800" },
    "د.محمود خالد فؤاد ": { label: "د.محمود خالد فؤاد", bg: "bg-neutral-100", text: "text-neutral-800" },
    "انستاشوب": { label: "انستاشوب", bg: "bg-neutral-100", text: "text-neutral-900" },
    "فيسبوك": { label: "فيسبوك", bg: "bg-blue-50/70", text: "text-blue-600" },
    "انستاجرام": { label: "إنستغرام", bg: "bg-pink-50/70", text: "text-pink-600" },
    "واتساب": { label: "واتساب", bg: "bg-green-50/70", text: "text-green-600" },
    "موقع الكترونى": { label: "موقع إلكتروني", bg: "bg-indigo-50/70", text: "text-indigo-600" },
    "بدون": { label: "ميدانى", bg: "bg-neutral-100", text: "text-neutral-500" },
    "صيدلية": { label: "صيدلية", bg: "bg-teal-50", text: "text-teal-700" },
    "مخزن": { label: "مخزن", bg: "bg-orange-50", text: "text-orange-700" },
    "عيادة": { label: "عيادة", bg: "bg-sky-50", text: "text-sky-700" },
    "مصنع": { label: "مصنع", bg: "bg-purple-50", text: "text-purple-700" }
  };

  // --- ACTIONS ---
  
  // Compute localized metrics based on full data and active tab month selection
  const metrics = computeMetrics(sheetData, selectedMonth);

  // Re-format helper supporting local numeral state (Hindi numerals / Arabic numerals)
  const formatNum = (num: number, isCurrency = false) => {
    if (!isHindiNumerals) {
      if (isCurrency) {
        return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(num));
      }
      return Math.round(num).toLocaleString('en-US');
    }
    return formatToArabicNumerals(num, isCurrency);
  };

  // --- GOOGLE SHEETS LIVE SYNC ENGINE ---
  const parseCSV = (csvText: string): SheetRow[] => {
    const lines = csvText.split(/\r?\n/);
    const rows: SheetRow[] = [];
    
    // Google Sheets exported CSVs start with a header like `"Aspect","Count","Date"`
    // We skip the first row (headers)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Separate line values by comma while respecting quotes
      const columns: string[] = [];
      let currentVal = "";
      let insideQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          columns.push(currentVal.trim());
          currentVal = "";
        } else {
          currentVal += char;
        }
      }
      columns.push(currentVal.trim());
      
      if (columns.length >= 3) {
        const aspect = columns[0].replace(/^"|"$/g, "").trim();
        const rawCount = columns[1].replace(/^"|"$/g, "").trim();
        const count = parseFloat(rawCount.replace(/,/g, "")) || 0;
        const date = columns[2].replace(/^"|"$/g, "").trim();
        
        if (aspect && date) {
          rows.push({
            aspect,
            count,
            date
          });
        }
      }
    }
    return rows;
  };

  const handleSyncGoogleSheet = async (urlToSync: string) => {
    if (!urlToSync.trim()) {
      setSyncError("يرجى إدخال رابط جدول بيانات Google Sheet صحيح.");
      return;
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      // Extract Spreadsheet ID from Google Spreadsheet link
      const regMatch = urlToSync.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!regMatch || !regMatch[1]) {
        throw new Error("لم نتمكن من تحديد كود الملف (Spreadsheet ID) من الرابط المرفق. يرجى التأكد من نسخ رابط جدول بيانات جوجل (Google Sheets) بالكامل.");
      }

      const spreadsheetId = regMatch[1];
      // Fetch specifically tab/sheet named "Data"
      const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=Data`;

      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error("فشل الاتصال بجدول البيانات المرفق. يرجى التأكد من تعديل إعدادات المشاركة فى الشيت لتصبح 'أي شخص لديه الرابط' (Viewer/عارض).");
      }

      const csvText = await response.text();
      const parsedRows = parseCSV(csvText);

      if (parsedRows.length === 0) {
        throw new Error("تم الاتصال بنجاح ولكن لم يتم جلب أي بيانات تفصيلية. يرجى التأكد من تسمية الورقة (Tab) باسم 'Data' بدقة، وأنها تحتوي على الأعمدة الثلاثة ببيانات المفتشين والإجراءات.");
      }

      // Save to states and browser persistence
      setSheetData(parsedRows);
      setGoogleSheetUrl(urlToSync);
      
      const egyptianTime = new Date().toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit"
      }) + " - " + new Date().toLocaleDateString("ar-EG");
      
      setLastSyncTime(egyptianTime);
      setSyncError(null);

      localStorage.setItem("cybercrime_sheet_url", urlToSync);
      localStorage.setItem("cybercrime_sheet_data", JSON.stringify(parsedRows));
      localStorage.setItem("cybercrime_last_synced", egyptianTime);
    } catch (err: any) {
      console.error(err);
      setSyncError(err.message || "فشل تحميل البيانات التلقائية. يرجى مراجعة إعدادات مشاركة الرابط.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnectSheet = () => {
    if (confirm("هل تريد استعادة رابط Google Sheet الافتراضي المعتمد ومزامنته؟")) {
      localStorage.removeItem("cybercrime_sheet_url");
      localStorage.removeItem("cybercrime_sheet_data");
      localStorage.removeItem("cybercrime_last_synced");
      setGoogleSheetUrl(DEFAULT_GOOGLE_SHEET_URL);
      setLastSyncTime(null);
      setSyncError(null);
      handleSyncGoogleSheet(DEFAULT_GOOGLE_SHEET_URL);
    }
  };

  // Auto sync on mount if googleSheetUrl is stored or passed via URL query parameter
  useEffect(() => {
    const searchStr = window.location.search || (window.location.hash.includes("?") ? window.location.hash.substring(window.location.hash.indexOf("?")) : "");
    const params = new URLSearchParams(searchStr);
    const urlParam = params.get("sheet") || params.get("url") || params.get("sheetUrl");
    if (urlParam) {
      const decodedUrl = decodeURIComponent(urlParam);
      setGoogleSheetUrl(decodedUrl);
      handleSyncGoogleSheet(decodedUrl);
    } else {
      let savedUrl = localStorage.getItem("cybercrime_sheet_url");
      if (!savedUrl || savedUrl === OLD_DEFAULT_GOOGLE_SHEET_URL) {
        savedUrl = DEFAULT_GOOGLE_SHEET_URL;
      }
      if (savedUrl) {
        setGoogleSheetUrl(savedUrl);
        handleSyncGoogleSheet(savedUrl);
      }
    }
  }, []);

  // Reset edited data back to initial sample values
  const resetToSample = () => {
    if (confirm("هل تريد إعادة تعيين كافة البيانات إلى عينة البداية الأصلية؟ ستفقد جميع التعديلات المؤقتة.")) {
      setSheetData(INITIAL_SHEET_DATA);
    }
  };

  // Trigger A4 Document Printer
  const handlePrintCurrent = () => {
    setShowPrintDropdown(false);
    setShowDownloadDropdown(false);
    
    const printUrl = `${window.location.origin}${window.location.pathname}?print=${encodeURIComponent(selectedMonth)}`;
    const win = window.open(printUrl, "_blank");
    if (!win) {
      alert("خطأ: يرجى السماح بالنوافذ المنبثقة (Popups) لعرض صفحة التنزيل والطباعة.");
    }
  };

  // Trigger A4 Document Printer for spreadsheet table
  const handlePrintSpreadsheet = () => {
    setShowPrintDropdown(false);
    setShowDownloadDropdown(false);
    
    document.body.setAttribute("data-print-spreadsheet", "true");
    const originalTitle = document.title;
    document.title = "جدول_بيانات_ضبطيات_وحدة_جرائم_الإنترنت_٢٠٢٦";
    
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
      document.body.removeAttribute("data-print-spreadsheet");
    }, 50);
  };

  // Trigger 13-Page PDF document sequential generation inside standard browser printer!
  const handlePrintAllPages = () => {
    setShowPrintDropdown(false);
    setShowDownloadDropdown(false);
    setIsPrintingAll(true);
    const originalTitle = document.title;
    document.title = "التقرير_الإحصائي_السنوي_لوحدة_جرائم_الإنترنت_٢٠٢٦";
    // Give state updates time to render the hidden print block in the DOM before printing
    setTimeout(() => {
      window.print();
      setIsPrintingAll(false);
      document.title = originalTitle;
    }, 500);
  };

  // Trigger client-side PDF downloads or printable views on a dedicated tab/page
  const handleDownloadCurrent = () => {
    setShowPrintDropdown(false);
    setShowDownloadDropdown(false);
    
    const printUrl = `${window.location.origin}${window.location.pathname}?print=${encodeURIComponent(selectedMonth)}`;
    const win = window.open(printUrl, "_blank");
    if (!win) {
      alert("خطأ: يرجى السماح بالنوافذ المنبثقة (Popups) لعرض صفحة التنزيل والطباعة.");
    }
  };

  const handleDownloadAllPages = () => {
    setShowPrintDropdown(false);
    setShowDownloadDropdown(false);
    
    const printUrl = `${window.location.origin}${window.location.pathname}?print=all`;
    const win = window.open(printUrl, "_blank");
    if (!win) {
      alert("خطأ: يرجى السماح بالنوافذ المنبثقة (Popups) لعرض صفحة التنزيل والطباعة.");
    }
  };

  // Download Spreadsheet data dynamically as UTF-8 BOM CSV/excel file
  const handleDownloadExcel = () => {
    const activeMonths = monthsRTL.filter(m => isMonthActive(m));
    const showTotal = isMonthActive("إجمالي العام");
    
    let head = ["الجانب المقارن (Aspect)", ...activeMonths];
    if (showTotal) {
      head.push("إجمالي العام");
    }
    
    const rows = [head];
    
    const uniqueAspectsList = Array.from(new Set(sheetData.map(r => r.aspect.trim()))) as string[];
    const aggregatedRows = uniqueAspectsList.map((aspect: string) => {
      const monthlyValues: Record<string, number> = {};
      let total = 0;
      monthsRTL.forEach(m => {
        const match = sheetData.find(r => r.aspect.trim() === aspect && r.date.trim() === m);
        const val = match ? match.count : 0;
        monthlyValues[m] = val;
        total += val;
      });
      return {
        aspect,
        monthlyValues,
        total
      };
    });

    const filteredRows = aggregatedRows.filter(row => {
      const s = editorSearch.toLowerCase();
      const localizedLabel = (aspectMetadata[row.aspect]?.label || row.aspect).toLowerCase();
      const matchesSearch = row.aspect.toLowerCase().includes(s) || localizedLabel.includes(s);
      
      const matchesAspect = isAspectActive(row.aspect);
      return matchesSearch && matchesAspect;
    });

    filteredRows.forEach(row => {
      const rowData = [aspectMetadata[row.aspect]?.label || row.aspect];
      activeMonths.forEach(m => {
        rowData.push(String(row.monthlyValues[m] || 0));
      });
      if (showTotal) {
        rowData.push(String(row.total));
      }
      rows.push(rowData);
    });
    
    const csvContent = "\uFEFF" + rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `جدول_بيانات_ضبطيات_جرائم_الإنترنت_٢٠٢٦.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share Dashboard Links
  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("تم نسخ رابط لوحة معلومات جرائم الإنترنت التفاعلية إلى حافظتك! يمكنك مشاركته الآن.");
    }).catch(() => {
      alert(`الرابط التفاعلي للوحة البيانات: ${shareUrl}`);
    });
  };

  // Handle cell updates in our interactive table
  const handleCellChange = (index: number, newValue: string) => {
    const updated = [...sheetData];
    updated[index].count = parseFloat(newValue) || 0;
    setSheetData(updated);
  };

  // Add customized rows to spreadsheet simulator
  const handleAddNewRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAspectName.trim()) return;
    const newRow: SheetRow = {
      aspect: newAspectName,
      count: Number(newAspectCount) || 0,
      date: newAspectMonth
    };
    setSheetData([newRow, ...sheetData]);
    setNewAspectName("");
    setNewAspectCount(0);
    // Alert feedback
    const banner = document.getElementById("add-row-success-banner");
    if (banner) {
      banner.classList.remove("hidden");
      setTimeout(() => banner.classList.add("hidden"), 3000);
    }
  };

  // Handle deletion of raw rows in spreadsheet simulator
  const handleDeleteRow = (index: number) => {
    const updated = [...sheetData];
    updated.splice(index, 1);
    setSheetData(updated);
  };

  // Generate monthly distribution points for a specific aspect to render in the pop-up modal chart
  const getMonthlyDistributionForAspect = (aspectKey: string) => {
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

    const targetNorm = normalizeText(aspectKey);

    return monthsRTL.map(mName => {
      let sum = 0;
      sheetData.forEach(row => {
        if (row.date === mName) {
          let matches = false;
          const rawAspect = row.aspect || "";
          const norm = normalizeText(rawAspect);

          if (aspectKey === "أدوية جدول") {
            matches = (norm.includes("مخدر") || norm.includes("جدول اول") || norm.includes("جدول ثالث") || norm.includes("جدول"));
          } else if (aspectKey === "أدوية مجهولة المصدر" || aspectKey === "أدوية مجهولة") {
            matches = (norm.includes("مجهوله") || norm.includes("بدون فواتير") || norm.includes("مجهول المصدر") || norm.includes("فواتير رسميه"));
          } else if (aspectKey === "بيع عن طريق بيع إلكتروني" || aspectKey === "بيع عن طريق تطبيق الكتروني (instashop)" || aspectKey === "بيع عن طريق تطبيق الكتروني" || aspectKey === "بيع عن طريق تطبيق الكترونى") {
            matches = (norm.includes("تطبيق الكتروني") || norm.includes("تطبيق الكترونى") || norm.includes("instashop"));
          } else if (aspectKey === "عرض الأدوية المهربة والغير مسجلة بهيئة الدواء المصرية" || aspectKey === "أدوية مهربة") {
            matches = (norm.includes("مهربه") || norm.includes("غير مسجله") || norm.includes("مهرب"));
          } else if (aspectKey === "عرض ادوية  أعلى من السعر الجبري" || aspectKey === "أعلى من السعر الجبري" || aspectKey === "سعر جبري") {
            matches = (norm.includes("السعر الجبري") || norm.includes("سعر جبري") || norm.includes("اعلي من السعر"));
          } else if (aspectKey === "عرض ادوية هيئة شراء موحد" || aspectKey === "شراء موحد") {
            matches = (norm.includes("شراء موحد"));
          } else if (aspectKey === "اجمالى قيمة المضبوطات" || aspectKey === "إجمالي قيمة المضبوطات") {
            matches = (norm.includes("قيمه المضبوطات") || norm.includes("اجمالي قيمه") || norm.includes("القيمه التقديريه") || (norm.includes("مضبوطات") && norm.includes("قيمه")));
          } else if (aspectKey === "صيدلية" || aspectKey === "صيدليه") {
            matches = (norm === "صيدليه" || norm === "صيدلية" || norm.includes("صيدلي"));
          } else if (aspectKey === "مخزن") {
            matches = (norm === "مخزن" || norm.includes("مخزن"));
          } else if (aspectKey === "عيادة" || aspectKey === "عياده") {
            matches = (norm === "عياده" || norm === "عيادة" || norm.includes("عياد"));
          } else if (aspectKey === "مصنع") {
            matches = (norm === "مصنع" || norm.includes("مصنع"));
          } else if (aspectKey === "انستاشوب") {
            matches = (norm.includes("انستاشوب") || norm.includes("instashop"));
          } else if (aspectKey === "فيسبوك") {
            matches = (norm.includes("فيسبوك") || norm.includes("facebook") || norm.includes("فيس بوك"));
          } else if (aspectKey === "انستاجرام") {
            matches = (norm.includes("انستاجرام") || norm.includes("انستجرام") || norm.includes("instagram"));
          } else if (aspectKey === "واتساب") {
            matches = (norm.includes("واتساب") || norm.includes("whatsapp") || norm.includes("واتس اب") || norm.includes("واتس"));
          } else if (aspectKey === "موقع الكترونى" || aspectKey === "موقع الكتروني") {
            matches = (norm.includes("موقع الكتروني") || norm.includes("موقع الكترونى") || norm.includes("website") || norm.includes("موقع ويب"));
          } else if (aspectKey === "بدون") {
            matches = (norm.includes("بدون") || norm.includes("لا يوجد") || norm.includes("none"));
          } else if (aspectKey === "إجمالي الضبطيات" || aspectKey === "إجمالي عدد الضبطيات الرقمية لوحدة الرصد" || aspectKey === "totalSeizures") {
            matches = (
              norm.includes("وليد القاضي") || norm.includes("وليد القاضي ") || norm.includes("وليد القاضى") ||
              norm.includes("احمد حسن") || norm.includes("احمد حسن عبد الجواد") ||
              norm.includes("باسم محمد") || norm.includes("باسم فوزي") || norm.includes("باسم محمد فوزي") ||
              norm.includes("محمود غازي") || norm.includes("محمود غازي ") ||
              norm.includes("محمود خالد") || norm.includes("محمود خالد فؤاد")
            );
          } else {
            if (targetNorm.includes("وليد")) {
              matches = norm.includes("وليد");
            } else if (targetNorm.includes("احمد حسن")) {
              matches = norm.includes("احمد حسن");
            } else if (targetNorm.includes("باسم")) {
              matches = norm.includes("باسم");
            } else if (targetNorm.includes("محمود غازي")) {
              matches = norm.includes("محمود غازي");
            } else if (targetNorm.includes("خالد فؤاد") || targetNorm.includes("محمود خالد")) {
              matches = norm.includes("محمود خالد") || norm.includes("خالد فؤاد");
            } else {
              matches = (norm === targetNorm || norm.includes(targetNorm) || targetNorm.includes(norm));
            }
          }

          if (matches) {
            sum += Number(row.count) || 0;
          }
        }
      });
      return { month: mName, count: sum };
    });
  };

  // Open modal config
  const openModalForAspect = (title: string, aspectKey: string, unitStr = "ضبطية") => {
    setModalConfig({
      isOpen: true,
      title,
      aspectKey,
      unit: unitStr
    });
  };

  // Dedicated Print Current Modal Chart Only
  const handlePrintModal = () => {
    document.body.setAttribute("data-print-modal", "true");
    setTimeout(() => {
      window.print();
      document.body.removeAttribute("data-print-modal");
    }, 150);
  };

  // Generate specific dataset for active modal
  const activeModalDistribution = modalConfig.isOpen 
    ? getMonthlyDistributionForAspect(modalConfig.aspectKey)
    : [];

  const maxModalValue = activeModalDistribution.length > 0
    ? Math.max(...activeModalDistribution.map(o => o.count)) || 1
    : 1;

  const totalModalSum = activeModalDistribution.reduce((a, b) => a + b.count, 0);

  // Close print/download dropdowns when clicking outside
  useEffect(() => {
    const closeDropdowns = () => {
      setShowPrintDropdown(false);
      setShowDownloadDropdown(false);
    };
    window.addEventListener("click", closeDropdowns);
    return () => window.removeEventListener("click", closeDropdowns);
  }, []);

  // Render a clean standalone printable document if printParam query parameter is supplied
  if (printParam !== null) {
    const isPrintAll = printParam === "all";
    const printMonths = isPrintAll ? ["2026", ...monthsRTL] : [printParam];

    return (
      <div className="bg-white min-h-screen p-0 m-0 text-neutral-900" dir="rtl" style={{ backgroundColor: "#ffffff" }}>
        {/* Print controls bar, hidden under printing */}
        <div className="no-print print:hidden sticky top-0 bg-neutral-900 text-white p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-3 text-right z-50 font-serif">
          <div>
            <h3 className="text-sm font-bold text-emerald-400">
              📄 {isPrintAll ? "التقرير الرقمي السنوي الشامل لعام ٢٠٢٦" : `مستند إحصائيات شهر ${printParam} لعام ٢٠٢٦`} جاهز للطباعة أو التصدير
            </h3>
            <p className="text-[11px] text-neutral-300 mt-0.5">
              تم تنسيق التقارير لتلائم طباعة A4 العمودية تماماً وبجودة فائقة النقاء.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.print()} 
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 transition-colors font-bold text-xs rounded-xl shadow cursor-pointer text-white"
            >
              🖨️ طباعة وحفظ بتنسيق PDF
            </button>
            <button 
              onClick={() => window.close()} 
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-705 transition-colors font-bold text-xs text-neutral-300 rounded-xl cursor-pointer"
            >
              إغلاق الصفحة
            </button>
          </div>
        </div>

        {/* Dynamic tips banner - hidden when printing */}
        <div className="no-print print:hidden bg-emerald-50 border-b border-emerald-150 p-3.5 text-xs text-emerald-800 leading-relaxed text-right font-serif">
          💡 <strong>نصيحة للحفظ السليم كملف PDF بدون حشو أو هوامش:</strong> بعد الضغط على زر "طباعة" أو "حفظ" (أو انتظر نافذة محاورة الطباعة التلقائية)، قم بتغيير <strong>الوجهة (Destination)</strong> لتكون <strong>"حفظ بتنسيق PDF" (Save as PDF)</strong>، ثم انقر على خيار <strong>"المزيد من الإعدادات" (More settings)</strong> وتأكد من تفعيل خيار <strong>"رسومات الخلفية" (Background graphics)</strong> وتعطيل خيار <strong>"الرؤوس والتذييلات" (Headers and footers)</strong>.
        </div>

        {/* Printable cards map */}
        <div className="space-y-12 bg-white print:space-y-0 p-4 print:p-0">
          {printMonths.map((mName) => {
            const pageMetrics = computeMetrics(sheetData, mName);
            const subtitle = mName === "2026" 
              ? "لسنة ٢٠٢٦" 
              : `لشهر ${mName} ٢٠٢٦`;

            return (
              <div 
                key={mName} 
                className="page-break-container print-page-container print:page-break-after-always print:break-after-page"
                style={{
                  pageBreakAfter: "always",
                  breakAfter: "page",
                  backgroundColor: "#ffffff"
                }}
              >
                <div className="w-full h-full p-0 m-0">
                  <BentoDashboardPureStyle
                    mMetrics={pageMetrics}
                    title="تقرير وحدة جرائم الإنترنت"
                    subtitle={subtitle}
                    formatNum={formatNum}
                    aspectMetadata={aspectMetadata}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#171717] font-sans relative pb-16">
      
      {/* SUCCESS FLYER FEEDBACK */}
      <div id="add-row-success-banner" className="fixed top-4 right-4 bg-[#171717] text-white px-5 py-3 rounded-xl shadow-xl z-50 text-xs font-semibold flex items-center gap-2 hidden transition-all duration-300">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>تمت إضافة السطر بنجاح! تم تحديث لوحة المؤشرات تلقائياً وبشكل حي.</span>
      </div>

      {/* PRINT-ALL SEQUENTIAL FLOW CONTAINER (ONLY RENDERED DURING TRUE A4 PDF EXPORTS) */}
      {isPrintingAll && (
        <div className="fixed inset-0 z-50 bg-[#121214]/90 backdrop-blur-md overflow-y-auto p-4 md:p-12 flex flex-col items-center justify-start print:relative print:inset-auto print:bg-white print:p-0 print:overflow-visible text-right no-scrollbar no-print-overlay">
          <div className="my-auto w-full flex flex-col items-center print:contents">
            {/* Action Header bar inside the on-screen preview (Hides when printing) */}
            <div className="no-print w-full max-w-[210mm] bg-[#1a1a1e] border border-neutral-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl animate-scale-up">
            <div className="text-right">
              <h4 className="text-xs font-bold text-neutral-200">🔍 معاينة مستند الطباعة والتصدير والتشغيل (A4)</h4>
              <p className="text-[10px] text-neutral-450 mt-1">تقرير تجميعي معتمد مكون من ١٣ صفحة منسقة بدقة ومعدّة للحفظ بجودة PDF</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const originalTitle = document.title;
                  document.title = "التقرير_الإحصائي_السنوي_لوحدة_جرائم_الإنترنت_٢٠٢٦";
                  window.print();
                  document.title = originalTitle;
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-md active:scale-95"
              >
                <Printer className="w-3 h-3" />
                <span>طباعة التقرير</span>
              </button>
              <button
                onClick={() => {
                  const originalTitle = document.title;
                  document.title = "التقرير_الإحصائي_السنوي_لوحدة_جرائم_الإنترنت_٢٠٢٦";
                  window.print();
                  document.title = originalTitle;
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-md active:scale-95"
              >
                <Download className="w-3 h-3" />
                <span>حفظ PDF</span>
              </button>
              <button
                onClick={() => setIsPrintingAll(false)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-[11px] rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-neutral-700 animate-pulse-none"
              >
                <X className="w-3 h-3" />
                <span>إغلاق</span>
              </button>
            </div>
          </div>

          {/* Printable Pages Wrapper */}
          <div className="w-full max-w-[210mm] mx-auto flex flex-col gap-6 print:gap-0 print:py-0 print:max-w-none print:block">
            {["2026", ...monthsRTL].map((mName, pIdx) => {
              const pageMetrics = computeMetrics(sheetData, mName);
              return (
                <div 
                  key={mName} 
                  className="page-break-container print-page-container print:page-break-after-always print:break-after-page" 
                  style={{
                    pageBreakAfter: 'always',
                    breakAfter: 'page',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <div className="w-full h-full p-0 m-0">
                    <BentoDashboardPureStyle
                      mMetrics={pageMetrics}
                      title="تقرير وحدة جرائم الإنترنت"
                      subtitle={mName === "2026" ? "لسنة ٢٠٢٦" : `لشهر ${mName} ٢٠٢٦`}
                      formatNum={formatNum}
                      aspectMetadata={aspectMetadata}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* SINGLE PAGE PRISTINE PRINT ONLY CONTAINER */}
      {!isPrintingAll && (
        <div className="hidden print:block">
          <div 
            className="print-page-container" 
            style={{
              backgroundColor: "#ffffff"
            }}
          >
            <div className="w-full h-full p-0 m-0">
              <BentoDashboardPureStyle
                mMetrics={metrics}
                title="تقرير وحدة جرائم الإنترنت"
                subtitle={selectedMonth === "2026" ? "لسنة ٢٠٢٦" : `لشهر ${selectedMonth} ٢٠٢٦`}
                formatNum={formatNum}
                aspectMetadata={aspectMetadata}
              />
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY SPREADSHEET TABLE STRUCTURE */}
      <div className="print-spreadsheet-container hidden print:block bg-white text-[#171717] w-full min-h-0 print:py-4">
        <div className="pb-4 mb-6 text-center border-b border-neutral-200">
          <h1 className="text-xl font-extrabold font-serif text-neutral-950">جدول بيانات ضبطيات وحدة جرائم الانترنت</h1>
          <p className="text-xs text-neutral-500 mt-1 font-serif font-black">
            {getSpreadsheetSubtitle()}
          </p>
        </div>

        <div className="border border-neutral-300 rounded-none overflow-hidden bg-white">
          <table className="w-full text-right text-[10px] table-auto border-collapse">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-300 text-neutral-700 font-bold">
                <th className="px-3 py-2 text-right font-serif">الجانب المقارن</th>
                {monthsRTL.filter(m => isMonthActive(m)).map(m => (
                  <th key={m} className="px-1 py-2 text-center w-[6.5%] font-serif">{m}</th>
                ))}
                {isMonthActive("إجمالي العام") && (
                  <th className="px-2 py-2 text-center bg-neutral-205/40 border-r border-neutral-300 font-serif font-black">إجمالى</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {(() => {
                const aggregatedRows = uniqueAspects.map((aspect: string) => {
                  const monthlyValues: Record<string, number> = {};
                  let total = 0;
                  monthsRTL.forEach(m => {
                    const match = sheetData.find(r => r.aspect.trim() === aspect && r.date.trim() === m);
                    const val = match ? match.count : 0;
                    monthlyValues[m] = val;
                    if (isMonthActive(m)) {
                      total += val;
                    }
                  });
                  return {
                    aspect,
                    monthlyValues,
                    total
                  };
                });

                return aggregatedRows
                  .filter(row => isAspectActive(row.aspect))
                  .map((row) => (
                    <tr key={row.aspect} className="bg-white">
                      <td className="px-3 py-2 font-bold text-neutral-850 font-serif max-w-[150px] break-words">
                        {aspectMetadata[row.aspect]?.label || row.aspect}
                      </td>
                      {monthsRTL.filter(m => isMonthActive(m)).map(m => {
                        const val = row.monthlyValues[m] || 0;
                        return (
                          <td key={m} className={`px-1 py-1.5 text-center font-mono apple-num ${val === 0 ? "text-neutral-300 font-medium" : "font-semibold text-neutral-800"}`}>
                            {val > 0 ? formatNum(val, row.aspect.includes("قيمة")) : "٠"}
                          </td>
                        );
                      })}
                      {isMonthActive("إجمالي العام") && (
                        <td className="px-2 py-1.5 text-center font-mono apple-num font-black bg-neutral-50 border-r border-neutral-300 text-neutral-900">
                          {formatNum(row.total, row.aspect.includes("قيمة"))}
                        </td>
                      )}
                    </tr>
                  ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className={`max-w-[1280px] mx-auto px-4 pt-6 md:pt-10 transition-opacity duration-300 no-print ${isPrintingAll ? "opacity-0" : "opacity-100"}`}>
        
        {/* PREMIUM BRAND HEADER */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-6 border-b border-[#ECEEF2]">
          <div className="text-center md:text-right">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-[#171717] tracking-tight">تقرير وحدة جرائم الانترنت</h1>
            </div>
            <p className="text-xs text-neutral-400 mt-2 font-serif tracking-wide text-center md:text-right">
              {selectedMonth === "2026" ? "لسنة ٢٠٢٦" : `لشهر ${selectedMonth} ٢٠٢٦`}
            </p>
          </div>

          {/* MAIN MODAL NAV PILLS */}
          <div className="nav-tabs-container">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`tab-pill flex items-center gap-1.5 font-bold ${
                activeTab === "dashboard" ? "active" : ""
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>لوحة البيانات</span>
            </button>
            <button
              onClick={() => setActiveTab("spreadsheet")}
              className={`tab-pill flex items-center gap-1.5 font-bold ${
                activeTab === "spreadsheet" ? "active" : ""
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>جدول البيانات</span>
            </button>
          </div>

          {/* UTILITY BAR */}
          <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center">
            {/* Sync Live Button (Replacing numeral switch) */}
            <button
              onClick={() => {
                const activeUrl = googleSheetUrl || localStorage.getItem("cybercrime_sheet_url") || "";
                if (!activeUrl) {
                  const promptUrl = window.prompt("يرجى إدخال رابط جدول بيانات Google Sheet الخاص بكم للمزامنة الفورية:", "");
                  if (promptUrl) {
                    setGoogleSheetUrl(promptUrl);
                    handleSyncGoogleSheet(promptUrl);
                  }
                } else {
                  handleSyncGoogleSheet(activeUrl);
                }
              }}
              disabled={isSyncing}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center h-10 w-10 md:h-[42px] md:w-[42px] shrink-0 shadow-sm border border-transparent"
              title="مزامنة وجلب البيانات من Google Sheet"
              id="sync-toolbar-btn"
            >
              <RefreshCw className={`w-5 h-5 text-white ${isSyncing ? "animate-spin" : ""}`} />
            </button>

            {/* Print dropdown selector */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setShowPrintDropdown(!showPrintDropdown);
                  setShowDownloadDropdown(false);
                }}
                className="p-2.5 border border-[#ECEEF2] bg-white rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer text-[#171717] flex items-center justify-center h-10 w-10 md:h-[42px] md:w-[42px] shrink-0 shadow-sm"
                title="طباعة التقرير"
              >
                <Printer className="w-5 h-5 text-neutral-500 animate-pulse-none" />
              </button>
              
              {showPrintDropdown && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl border border-[#ECEEF2] bg-white shadow-lg py-1.5 z-40 text-right animate-scale-up">
                  {activeTab === "spreadsheet" && (
                    <button 
                      onClick={handlePrintSpreadsheet} 
                      className="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2 font-serif font-bold border-b border-neutral-100"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span>طباعة جدول البيانات</span>
                    </button>
                  )}
                  <button 
                    onClick={handlePrintCurrent} 
                    className="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2 font-serif font-bold"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span>طباعة الشهر الحالي فقط</span>
                  </button>
                  <button 
                    onClick={handlePrintAllPages} 
                    className="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2 font-serif font-bold"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>طباعة السنة كاملة (١٣ صفحة)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Download PDF button */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setShowDownloadDropdown(!showDownloadDropdown);
                  setShowPrintDropdown(false);
                }}
                className="p-2.5 border border-[#ECEEF2] bg-white rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer text-[#171717] flex items-center justify-center h-10 w-10 md:h-[42px] md:w-[42px] shrink-0 shadow-sm"
                title="تحميل كملف PDF"
              >
                <Download className="w-5 h-5 text-neutral-500" />
              </button>
              
              {showDownloadDropdown && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl border border-[#ECEEF2] bg-white shadow-lg py-1.5 z-40 text-right animate-scale-up">
                  {activeTab === "spreadsheet" && (
                    <>
                      <button 
                        onClick={handlePrintSpreadsheet} 
                        className="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2 font-serif font-bold"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>حفظ الجدول كملف PDF</span>
                      </button>
                      <button 
                        onClick={handleDownloadExcel} 
                        className="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2 font-serif font-bold border-b border-neutral-100"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <span>حفظ الجدول كملف excel</span>
                      </button>
                    </>
                  )}
                  <button 
                    onClick={handleDownloadCurrent} 
                    className="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2 font-serif font-bold"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>تحميل كملف PDF للشهر</span>
                  </button>
                  <button 
                    onClick={handleDownloadAllPages} 
                    className="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2 font-serif font-bold"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    <span>تحميل التقرير ١٣ صفحة</span>
                  </button>
                </div>
              )}
            </div>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2.5 border border-[#ECEEF2] bg-white rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer text-[#171717] flex items-center justify-center h-10 w-10 md:h-[42px] md:w-[42px] shrink-0 shadow-sm"
              title="مشاركة الرابط"
            >
              <Share2 className="w-5 h-5 text-neutral-500" />
            </button>
          </div>
        </header>

        {/* ACTIVE MODULE CONTAINER */}
        
        {/* TAB 1: THE BEAUTIFUL APPLE BENTO DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="animate-fade-in relative">
            
            {/* 13 PILLS MONTLY TAB SELECTOR */}
            <div className="mb-8 overflow-x-auto pb-2 relative flex md:justify-center no-print">
              <div className="nav-tabs-container min-w-max">
                
                {/* aggregates pill far-left (first in RTL) */}
                <button
                  onClick={() => setSelectedMonth("2026")}
                  className={`tab-pill ${selectedMonth === "2026" ? "active" : ""}`}
                >
                  إجمالى
                </button>

                {/* Monthly pills from Jan to Dec */}
                {monthsRTL.map(mName => (
                  <button
                    key={mName}
                    onClick={() => setSelectedMonth(mName)}
                    className={`tab-pill ${selectedMonth === mName ? "active" : ""}`}
                  >
                    {mName}
                  </button>
                ))}

              </div>
            </div>

            {/* DASHBOARD PRISTINE PRINTABLE Bento AREA */}
            <div className="printable-dashboard-area">
              


              {/* BENTO GRID LAYOUT */}
              <div className="grid grid-cols-1 md:grid-cols-3 md:grid-flow-row-dense gap-6">
                
                {/* CARD 1: Total Seizure value in LE (Uneven row / heights, spans 1 column) */}
                <div 
                  onClick={() => openModalForAspect("إجمالي القيمة التقديرية للمضبوطات الدوائية", "اجمالى قيمة المضبوطات", "جنيه")}
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-blue-600/30 ring-1 ring-transparent hover:ring-blue-100/50 hover:bg-neutral-50/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">إجمالي قيمة المضبوطات المقدرة</h3>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-extrabold text-[#171717] tracking-tight font-mono apple-num group-hover:text-blue-600 transition-colors">
                      {formatNum(metrics.totalSeizuresValue, true)}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-blue-500 transition-colors">جنيه مصرى</span>
                  </div>
                </div>

                {/* CARD 2: Total seizures counts (Grand KPI Hero Card, Spans 1 Col) */}
                <div 
                  onClick={() => openModalForAspect("إجمالي عدد الضبطيات الرقمية لوحدة الرصد", "إجمالي الضبطيات", "ضبطية")}
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-blue-600/30 ring-1 ring-transparent hover:ring-blue-100/50 hover:bg-neutral-50/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">إجمالي عدد الضبطيات المنفذة</h3>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-extrabold text-[#171717] tracking-tight font-mono apple-num group-hover:text-blue-600 transition-colors">
                      {formatNum(metrics.totalSeizures)}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-blue-500 transition-colors">ضبطية دوائية</span>
                  </div>
                </div>

                {/* CARD 7: Facilities Target numbers (Spans 2 Rows for a gorgeous vertical panel) */}
                <div className="border border-[#ECEEF2] bg-white rounded-2xl px-3 md:px-4 py-4 md:py-5 transition-all flex flex-col md:col-span-1 md:row-span-2 bento-card">
                  <div className="flex justify-center items-center text-center mb-3">
                    <h3 className="text-sm md:text-base font-bold text-[#171717] font-serif">نوع المؤسسة</h3>
                  </div>

                  <div className="flex-1 flex flex-col justify-center py-2">
                    <div className="grid grid-cols-2 gap-3.5 mx-auto w-full max-w-[280px] font-serif">
                      {metrics.facilities.map(fac => {
                        const meta = aspectMetadata[fac.name] || { label: fac.name, bg: "bg-neutral-50", text: "text-neutral-700" };
                        return (
                          <div 
                            key={fac.name}
                            onClick={() => openModalForAspect(getFacilityModalTitle(fac.name), fac.name)}
                            className="border border-[#ECEEF2] bg-neutral-50/30 hover:bg-neutral-50/10 rounded-2xl p-4 flex flex-col justify-center items-center text-center transition-all duration-300 cursor-pointer group hover:border-blue-600/30 ring-1 ring-transparent hover:ring-blue-100/30 aspect-[1.1/1]"
                          >
                            <span className="text-xs md:text-sm font-bold text-neutral-500 font-serif leading-tight mb-1 group-hover:text-blue-500 transition-colors">{meta.label}</span>
                            <span className="text-2xl md:text-3xl font-black text-[#171717] font-mono apple-num leading-none mt-2 group-hover:text-blue-600 transition-colors">
                              {formatNum(fac.count)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* CARD 3: Inspector Performance (Spans 2 Rows vertically to fit the puzzle perfectly) */}
                <div className="border border-[#ECEEF2] bg-white rounded-2xl p-4 md:p-5 transition-all flex flex-col md:col-span-1 md:row-span-2 bento-card">
                  <div className="text-right mb-3.5">
                    <h3 className="text-sm md:text-base font-bold text-[#171717] font-serif">عدد الضبطيات الموثقة لكل مفتش</h3>
                  </div>

                  <div className="flex-1 flex flex-col justify-center space-y-3 py-1">
                    {metrics.inspectors.map(insp => {
                      const maxVal = Math.max(...metrics.inspectors.map(i => i.count)) || 1;
                      const percentage = (insp.count / maxVal) * 100;
                      return (
                        <div 
                          key={insp.name} 
                          onClick={() => openModalForAspect(`ضبطيات المفتش الميداني: ${insp.name}`, insp.name)}
                          className="flex items-center justify-between gap-3.5 cursor-pointer group/item py-2 border-b border-neutral-50 last:border-none"
                        >
                          {/* Right Aspect & Bar */}
                          <div className="flex-1 flex flex-col gap-2">
                            <span className="font-bold text-neutral-600 font-serif group-hover/item:text-blue-600 transition-colors text-xs text-right">
                              {aspectMetadata[insp.name]?.label || insp.name}
                            </span>
                            <div className="w-full bg-[#F5F5F5] h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-[#555] h-1.5 rounded-full transition-all duration-700 ease-out group-hover/item:bg-blue-600" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Left Value Block */}
                          <div className="flex flex-col items-center justify-center shrink-0 min-w-[58px] text-center bg-neutral-50/70 border border-neutral-100 rounded-xl py-2 px-1.5 group-hover/item:bg-blue-50/30 group-hover/item:border-blue-100 transition-all">
                            <span className="font-bold text-[#171717] text-sm md:text-base font-mono apple-num leading-none group-hover/item:text-blue-600 transition-colors">
                              {formatNum(insp.count)}
                            </span>
                            <span className="text-[9px] text-neutral-450 font-serif leading-none mt-1 group-hover/item:text-blue-500 transition-colors">ضبطية</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CARD 4: Facebook aspect (Spans 1 Col, height is Row-span-1) */}
                <div 
                  onClick={() => openModalForAspect("مخالفات الترويج عبر الفيسبوك", "فيسبوك")}
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-blue-600/30 ring-1 ring-transparent hover:ring-blue-100/50 hover:bg-neutral-50/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">بيع من خلال فيسبوك</h3>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-extrabold text-[#171717] tracking-tight font-mono apple-num group-hover:text-blue-600 transition-colors">
                      {formatNum(metrics.platforms.find(p => p.name === "فيسبوك")?.count || 0)}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-blue-500 transition-colors">ضبطية</span>
                  </div>
                </div>

                {/* CARD 5: Instashop aspect value (Spans 1 Col, height is Row-span-1) */}
                <div 
                  onClick={() => openModalForAspect("مخالفات التوصيل عبر تطبيق انستاشوب", "انستاشوب")}
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-[#171717]/40 ring-1 ring-transparent hover:ring-neutral-200/50 hover:bg-neutral-50/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">بيع عبر تطبيق انستاشوب</h3>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-extrabold text-[#171717] tracking-tight font-mono apple-num group-hover:text-blue-600 transition-colors">
                      {formatNum(metrics.platforms.find(p => p.name === "انستاشوب")?.count || 0)}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-blue-500 transition-colors">ضبطية</span>
                  </div>
                </div>

                {/* CARD 8: Schedule Drugs */}
                <div 
                  onClick={() => openModalForAspect("مخالفات الاتجار بالأدوية المخدرة والسموم", "أدوية جدول")}
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-red-500/30 ring-1 ring-transparent hover:ring-red-100/50 hover:bg-neutral-50/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">أدوية الجدول (أول وثالث مخدرات)</h3>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-extrabold text-[#171717] tracking-tight font-mono apple-num group-hover:text-blue-600 transition-colors">
                      {formatNum(metrics.adwiaJadwal)}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-blue-500 transition-colors">ضبطية</span>
                  </div>
                </div>

                {/* CARD 6: Remaining platforms AND marketing sources, spans 2 columns, beautifully packed */}
                <div className="border border-[#ECEEF2] bg-white rounded-2xl p-6 transition-all flex flex-col md:col-span-2 md:row-span-1 bento-card">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-base font-bold text-[#171717] font-serif">وسائل التواصل ومنصات العرض</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
                    {metrics.platforms
                      .map(p => {
                        const meta = aspectMetadata[p.name] || { label: p.name, bg: "bg-neutral-100", text: "text-neutral-700" };
                        return (
                          <div 
                            key={p.name}
                            onClick={() => openModalForAspect(getPlatformModalTitle(p.name, meta.label), p.name)}
                            className="flex justify-between items-center py-2 border-b border-neutral-50 hover:bg-neutral-50/50 px-1 rounded transition-colors cursor-pointer group/item"
                          >
                            <span className="text-sm font-semibold text-neutral-600 font-serif group-hover/item:text-blue-600 transition-colors">{meta.label}</span>
                            <div className="flex items-center gap-1.5 font-mono apple-num">
                              <span className="font-bold text-[#171717] text-sm group-hover/item:text-blue-600 transition-colors">{formatNum(p.count)}</span>
                              <span className="text-[10px] text-neutral-450 font-serif group-hover/item:text-blue-500 transition-colors">ضبطية</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* CARD 9: Smuggled Drugs */}
                <div 
                  onClick={() => openModalForAspect("أدوية مهربة وغير مسجلة بهيئة الدواء المصرية", "عرض الأدوية المهربة والغير مسجلة بهيئة الدواء المصرية")}
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-amber-500/30 ring-1 ring-transparent hover:ring-amber-100/50 hover:bg-neutral-50/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">أدوية مهربة وغير مسجلة بهيئة الدواء</h3>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-extrabold text-[#171717] tracking-tight font-mono apple-num group-hover:text-blue-600 transition-colors">
                      {formatNum(metrics.adwiaMoharaba)}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-blue-500 transition-colors">ضبطية</span>
                  </div>
                </div>

                {/* CARD 10: Unknown Source Drugs */}
                <div 
                  onClick={() => openModalForAspect("أدوية بدون فواتير رسمية مجهولة المصدر", "أدوية مجهولة المصدر")}
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-purple-500/30 ring-1 ring-transparent hover:ring-purple-100/50 hover:bg-neutral-50/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">عرض مستحضرات بدون فواتير رسمية</h3>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-extrabold text-[#171717] tracking-tight font-mono apple-num group-hover:text-blue-600 transition-colors">
                      {formatNum(metrics.adwiaMajhoula)}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-blue-500 transition-colors">ضبطية</span>
                  </div>
                </div>

                {/* CARD 11: Compulsory price violation */}
                <div 
                  onClick={() => openModalForAspect("مخالفات البيع بأعلى من التسعيرة الجبرية المعتمدة", "عرض ادوية  أعلى من السعر الجبري")}
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-indigo-550/30 ring-1 ring-transparent hover:ring-indigo-100/50 hover:bg-neutral-50/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">بيع بأعلى من السعر الجبرى</h3>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-extrabold text-[#171717] tracking-tight font-mono apple-num group-hover:text-blue-600 transition-colors">
                      {formatNum(metrics.mokhalafatSerJabri)}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-blue-500 transition-colors">ضبطية</span>
                  </div>
                </div>

                {/* CARD 12: Unified purchase drugs */}
                <div 
                  onClick={() => openModalForAspect("مستحضرات مسربة خاصة بهيئة الشراء الموحد", "عرض ادوية هيئة شراء موحد")}
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-emerald-500/30 ring-1 ring-transparent hover:ring-emerald-100/50 hover:bg-neutral-50/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">بيع أدوية مخصصة لهيئة الشراء الموحد</h3>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-extrabold text-[#171717] tracking-tight font-mono apple-num group-hover:text-blue-600 transition-colors">
                      {formatNum(metrics.adwiaShiraMowahad)}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-blue-500 transition-colors">ضبطية</span>
                  </div>
                </div>

                {/* CARD 13: Online app sales (Full Width Centered Card) */}
                <div 
                  onClick={() => openModalForAspect("مخالفات البيع عبر التطبيقات الإلكترونية", "بيع عن طريق بيع إلكتروني")}
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 transition-all md:col-span-3 flex flex-col items-center justify-center text-center bento-card cursor-pointer group hover:border-[#171717]/40 hover:bg-neutral-50/10 ring-1 ring-transparent hover:ring-neutral-250/50"
                >
                  <div className="flex flex-col items-center">
                    <h3 className="text-base md:text-lg font-bold font-serif text-[#171717] mb-3 group-hover:text-blue-600 transition-colors">بيع عن طريق تطبيق الكترونى</h3>
                    <span className="text-xs font-bold text-neutral-500 font-serif">إجمالي قضايا بيع التطبيقات</span>
                    <div className="flex items-baseline gap-1 font-mono apple-num">
                      <span className="text-2xl md:text-3xl font-extrabold text-[#171717] tracking-tight group-hover:text-blue-600 transition-colors">
                        {formatNum(metrics.electronicAppSales)}
                      </span>
                      <span className="text-xs text-neutral-400 font-bold font-serif">ضبطية</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elegant printable page number for single-page dashboard print */}
              <div className="hidden print:block text-center text-xs text-neutral-400 mt-6 pt-3 border-t border-neutral-200/60 font-sans apple-num font-bold">
                <span>صفحة رقم {formatToArabicNumerals(1)}</span>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: INTERACTIVE DATA TABLE IN LIVE SHEETS STYLE */}
        {activeTab === "spreadsheet" && (
          <div className="animate-fade-in sheets-simulator space-y-6">
            
            {/* GOOGLE SHEETS LIVE SYNC COMPONENT CARD (THE LIVE ALTERNATIVE) */}
            <div className="bg-white border border-[#ECEEF2] rounded-2xl p-6 shadow-sm text-right">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-neutral-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="bg-green-50 text-green-700 border border-green-200/50 text-[10px] px-2 py-0.5 rounded-full font-bold">بديل مريح وبدون أكواد فنية</span>
                    <h2 className="text-md font-bold text-neutral-800 flex items-center gap-2">
                      <Database className="w-4 h-4 text-neutral-500" />
                      <span>الربط المباشر بجدول بيانات Google Sheet (بديل مريح لـ Apps Script)</span>
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    إذا واجهتك مشاكل أو تعقيدات في نشر الكود على Apps Script، يمكنك الآن استخدام هذه الطريقة الفورية السهلة! فقط قم بمشاركة ملف Google Sheet الخاص بكم ليكون <span className="font-bold text-[#171717]">"أي شخص لديه الرابط يمكنه العرض" (Viewer)</span>، ثم الصق رابط الشيت بالنعش أدناه وسيتكفل التطبيق بجلب وتحديث كافة المخططات والخدمات بثوانٍ وبشكل حي كامل!
                  </p>
                </div>
                
                {googleSheetUrl && (
                  <div className="bg-green-50/60 border border-green-200/50 rounded-xl px-4 py-2 flex items-center gap-2 text-xs text-green-800 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span>المزامنة التلقائية مفعلة</span>
                    <button
                      type="button"
                      onClick={handleDisconnectSheet}
                      className="text-red-600 hover:text-red-800 underline text-[10px] cursor-pointer mr-2 font-serif font-bold"
                    >
                      استعادة الرابط الافتراضي والمزامنة
                    </button>
                  </div>
                )}
              </div>

              {/* INPUT AND MANUAL SYNC ACTION BUTTONS */}
              <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="أدخل رابط Google Sheet المفتوح للمشاركة..."
                  value={googleSheetUrl}
                  onChange={(e) => setGoogleSheetUrl(e.target.value)}
                  className="flex-1 text-xs px-4 py-2.5 border border-[#ECEEF2] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#171717] text-right bg-neutral-50/50 w-full"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSyncGoogleSheet(googleSheetUrl)}
                    disabled={isSyncing}
                    className="bg-[#171717] text-white hover:bg-opacity-90 font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isSyncing ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>جاري المزامنة...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>مزامنة الان</span>
                      </>
                    )}
                  </button>
                  {lastSyncTime && (
                    <span className="text-[10px] text-neutral-400 font-mono">آخر مزامنة: {lastSyncTime}</span>
                  )}
                </div>
              </div>
              {syncError && (
                <div className="mt-3 text-xs text-red-500 font-semibold bg-red-50/50 border border-red-100 rounded-lg p-3">
                  ⚠️ {syncError}
                </div>
              )}
            </div>

            <div className="bg-white border border-[#ECEEF2] rounded-2xl p-6 shadow-sm no-print relative z-10 overflow-visible">
              
              {/* TOP EDITOR CONTROLS */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#ECEEF2]">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2 text-neutral-800">
                    <Database className="w-5 h-5 text-neutral-450" />
                    <span>جدول البيانات السنوي المجمع (Data Tab Summary)</span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    هنا يتم عرض كافة مؤشرات الرصد والضبط الميداني مجمعة في جدول مقارن شهري على مدار العام مع المجاميع تلقائياً.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search query in simulator */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="البحث عن جانب محدد..."
                      value={editorSearch}
                      onChange={(e) => setEditorSearch(e.target.value)}
                      className="text-xs px-8 py-2 border border-[#ECEEF2] rounded-xl bg-neutral-50 focus:bg-white focus:outline-none w-48 text-right font-medium text-neutral-800"
                    />
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-2.5" />
                  </div>

                  {/* Filter 1: Months Dropdown (Multi-select) */}
                  <div className="relative" id="filter-months-dropdown-container">
                    <button
                      onClick={() => {
                        setIsMonthFilterOpen(!isMonthFilterOpen);
                        setIsAspectFilterOpen(false);
                      }}
                      className="flex items-center gap-2 text-xs font-bold px-3.5 py-2.5 border border-[#ECEEF2] rounded-xl bg-white hover:bg-neutral-50 transition-colors shadow-sm cursor-pointer text-neutral-700 min-w-36 select-none"
                    >
                      <Calendar className="w-3.5 h-3.5 text-neutral-450" />
                      <span>الأشهر: </span>
                      <span className="text-blue-600 font-serif">
                        {selectedFilterMonths.length === 0
                          ? "لا شيء"
                          : selectedFilterMonths.includes("الكل")
                          ? "الكل (١٣)"
                          : selectedFilterMonths.length === 1
                          ? (selectedFilterMonths[0] === "إجمالي العام" ? "إجمالى" : selectedFilterMonths[0])
                          : `${selectedFilterMonths.length} أشهر`}
                      </span>
                    </button>
                    
                    {isMonthFilterOpen && (
                      <div className="absolute left-0 mt-1.5 w-56 rounded-xl border border-[#ECEEF2] bg-white shadow-lg py-1.5 z-50 text-right animate-scale-up max-h-80 overflow-y-auto">
                        <label 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleMonthFilter("الكل");
                          }}
                          className="flex items-center justify-between px-3 py-1.5 hover:bg-neutral-50 cursor-pointer select-none text-right font-serif font-bold text-xs text-neutral-700"
                        >
                          <input 
                            type="checkbox" 
                            checked={selectedFilterMonths.includes("الكل")} 
                            readOnly 
                            className="rounded text-blue-600 focus:ring-blue-500 h-3 w-3 cursor-pointer"
                          />
                          <span>الكل</span>
                        </label>
                        <div className="border-t border-[#ECEEF2] my-1"></div>
                        {[...monthsRTL, "إجمالي العام"].map(m => (
                          <label 
                            key={m}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleMonthFilter(m);
                            }}
                            className="flex items-center justify-between px-3 py-1.5 hover:bg-neutral-50 cursor-pointer select-none text-right font-serif font-medium text-xs text-neutral-700"
                          >
                            <input 
                              type="checkbox" 
                              checked={selectedFilterMonths.includes("الكل") || selectedFilterMonths.includes(m)} 
                              readOnly 
                              className="rounded text-blue-600 focus:ring-blue-500 h-3 w-3 cursor-pointer"
                            />
                            <span>{m === "إجمالي العام" ? "إجمالى" : m}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Filter 2: Aspects Dropdown (Multi-select) */}
                  <div className="relative" id="filter-aspects-dropdown-container">
                    <button
                      onClick={() => {
                        setIsAspectFilterOpen(!isAspectFilterOpen);
                        setIsMonthFilterOpen(false);
                      }}
                      className="flex items-center gap-2 text-xs font-bold px-3.5 py-2.5 border border-[#ECEEF2] rounded-xl bg-white hover:bg-neutral-50 transition-colors shadow-sm cursor-pointer text-neutral-700 min-w-40 select-none"
                    >
                      <Database className="w-3.5 h-3.5 text-[#059669]" />
                      <span>المؤشرات: </span>
                      <span className="text-emerald-600 font-serif truncate max-w-[120px]">
                        {selectedFilterAspects.length === 0
                          ? "لا شيء"
                          : selectedFilterAspects.includes("الكل")
                          ? "الكل"
                          : selectedFilterAspects.length === 1
                          ? (aspectMetadata[selectedFilterAspects[0]]?.label || selectedFilterAspects[0])
                          : `${selectedFilterAspects.length} مؤشر`}
                      </span>
                    </button>
                    
                    {isAspectFilterOpen && (
                      <div className="absolute left-0 mt-1.5 w-64 rounded-xl border border-[#ECEEF2] bg-white shadow-lg py-1.5 z-50 text-right animate-scale-up max-h-80 overflow-y-auto">
                        <label 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleAspectFilter("الكل");
                          }}
                          className="flex items-center justify-between px-3 py-1.5 hover:bg-neutral-50 cursor-pointer select-none text-right font-serif font-bold text-xs text-neutral-700"
                        >
                          <input 
                            type="checkbox" 
                            checked={selectedFilterAspects.includes("الكل")} 
                            readOnly 
                            className="rounded text-emerald-600 focus:ring-emerald-500 h-3 w-3 cursor-pointer"
                          />
                          <span>الكل</span>
                        </label>
                        <div className="border-t border-[#ECEEF2] my-1"></div>
                        {uniqueAspects.map(a => (
                          <label 
                            key={a}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleAspectFilter(a);
                            }}
                            className="flex items-center justify-between px-3 py-1.5 hover:bg-neutral-50 cursor-pointer select-none text-right font-serif font-medium text-xs text-neutral-700"
                          >
                            <input 
                              type="checkbox" 
                              checked={selectedFilterAspects.includes("الكل") || selectedFilterAspects.includes(a)} 
                              readOnly 
                              className="rounded text-emerald-600 focus:ring-emerald-500 h-3 w-3 cursor-pointer"
                            />
                            <span className="truncate max-w-[180px] text-right">{aspectMetadata[a]?.label || a}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* TABLE CONTAINER FOR AGGREGATED MONTHLY MATRIX */}
              <div className="overflow-x-auto border border-[#ECEEF2] rounded-xl bg-white">
                <table className="w-full text-right text-xs table-auto border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-150 text-neutral-500 font-bold">
                      <th className="px-3 py-3 font-serif text-right font-black">الجانب المقارن (Aspect)</th>
                      {monthsRTL.filter(m => isMonthActive(m)).map(m => (
                        <th key={m} className="px-1.5 py-3 text-center text-[10px] font-bold w-[6.5%] font-serif">{m}</th>
                      ))}
                      {isMonthActive("إجمالي العام") && (
                        <th className="px-3 py-3 text-center text-[11px] font-black font-serif bg-neutral-100/50 border-r border-[#ECEEF2] w-[9%]">إجمالى</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECEEF2]">
                    {(() => {
                      const aggregatedRows = uniqueAspects.map((aspect: string) => {
                        const monthlyValues: Record<string, number> = {};
                        let total = 0;
                        monthsRTL.forEach(m => {
                          const match = sheetData.find(r => r.aspect.trim() === aspect && r.date.trim() === m);
                          const val = match ? match.count : 0;
                          monthlyValues[m] = val;
                          if (isMonthActive(m)) {
                            total += val;
                          }
                        });
                        return {
                          aspect,
                          monthlyValues,
                          total
                        };
                      });

                      return aggregatedRows
                        .filter(row => {
                          // Filter with spreadsheet's search query and active aspect
                          if (!isAspectActive(row.aspect)) return false;
                          const s = editorSearch.toLowerCase();
                          const localizedLabel = (aspectMetadata[row.aspect]?.label || row.aspect).toLowerCase();
                          return row.aspect.toLowerCase().includes(s) || localizedLabel.includes(s);
                        })
                        .map((row) => (
                          <tr key={row.aspect} className="hover:bg-neutral-50/30 transition-colors">
                            <td className="px-3 py-2.5 font-bold text-neutral-800 font-serif max-w-[170px] break-words">
                              {aspectMetadata[row.aspect]?.label || row.aspect}
                            </td>
                            {monthsRTL.filter(m => isMonthActive(m)).map(m => {
                              const val = row.monthlyValues[m] || 0;
                              return (
                                <td key={m} className={`px-1.5 py-2.5 text-center font-mono apple-num ${val === 0 ? "text-neutral-300 font-medium" : "font-semibold text-neutral-750"}`}>
                                  {val > 0 ? formatNum(val, row.aspect.includes("قيمة")) : "٠"}
                                </td>
                              );
                            })}
                            {isMonthActive("إجمالي العام") && (
                              <td className="px-3 py-2.5 text-center font-mono apple-num font-black bg-neutral-100/30 border-r border-[#ECEEF2] text-neutral-900">
                                {formatNum(row.total, row.aspect.includes("قيمة"))}
                              </td>
                            )}
                          </tr>
                        ));
                    })()}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}



      </div>

      {/* FOOTER */}
      <footer className="mt-16 text-center text-xs text-[#9c9c9c] border-t border-[#ECEEF2] pt-6 flex justify-between items-center max-w-[1280px] mx-auto px-4 no-print">
        <span>تطبيق تقرير مكافحة جرائم الإنترنت</span>
        <div className="flex items-center gap-1 text-[11px] font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span>تصنيف الخادم: متصل وقابل للتطبيق المباشر</span>
        </div>
      </footer>


      {/* POP-UP CHART MODAL (ONLY TRIGGERED ON 2026 AGGREGATION CELL CLICKS) */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 text-right animate-fade-in print-modal-container">
          <div className="bg-white border border-[#ECEEF2] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative transition-transform duration-300 transform scale-100">
            
            {/* Close button */}
            <button 
              onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
              className="absolute top-4 left-4 p-2 rounded-full border border-[#ECEEF2] bg-[#FAFAFA] hover:bg-neutral-100 transition-colors cursor-pointer text-neutral-500"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal header details */}
            <div className="pb-4 border-b border-[#ECEEF2] mb-6">
              <span className="text-[10px] bg-neutral-100 text-[#171717] px-2.5 py-0.5 rounded-full font-bold">مخطط إحصائي زمني (١٢ شهراً)</span>
              <h3 className="text-xl font-bold font-serif text-[#171717] mt-2 leading-tight">
                {modalConfig.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">تطور حجم الضبطيات المنجزة عبر شهور السنة ٢٠٢٦</p>
            </div>

            {/* INTERACTIVE CUSTOM SVG/HTML COLUMN CHARTS */}
            <div className="relative w-full h-44 bg-[#FAFAFA] border border-[#ECEEF2] rounded-xl flex items-end justify-between px-4 pb-2 pt-6">
              {activeModalDistribution.map((point) => {
                const percentage = (point.count / maxModalValue) * 100;
                return (
                  <div key={point.month} className="flex-1 flex flex-col items-center group relative mx-0.5 md:mx-1 h-full justify-end">
                    
                    {/* Tooltip on hovering Column */}
                    <div className="absolute bottom-full mb-1 bg-[#171717] text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap font-mono">
                      {formatNum(point.count)} {modalConfig.unit}
                    </div>

                    {/* Dynamic Bar Element */}
                    <div 
                      className="w-2.5 md:w-4.5 bg-neutral-200 group-hover:bg-[#171717] print:bg-neutral-800 rounded-t-sm transition-all duration-700 ease-out"
                      style={{ height: `${percentage}%` }}
                    ></div>

                    {/* Value label under column */}
                    <span className="text-[7.5px] md:text-[9.5px] text-neutral-500 mt-1 font-bold font-mono whitespace-nowrap apple-num">
                      {formatNum(point.count, modalConfig.aspectKey.includes("قيمة"))}
                    </span>

                  </div>
                );
              })}
            </div>

            {/* All 12 Month indicators under columns */}
            <div className="flex justify-between px-4 text-[8px] md:text-[9.5px] font-black text-neutral-400 mt-2">
              {activeModalDistribution.map((point) => (
                <span key={point.month} className="flex-1 text-center font-serif truncate mx-0.5 md:mx-1">
                  {point.month}
                </span>
              ))}
            </div>

            {/* Statistics Summary */}
            <div className="mt-6 pt-4 border-t border-[#ECEEF2] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-neutral-500 font-medium">
                إجمالي الرقم المتراكم للعام: <span className="font-mono font-bold text-neutral-800">{formatNum(totalModalSum, modalConfig.unit === "جنيه")} {modalConfig.unit}</span>
              </span>
              <button 
                onClick={handlePrintModal}
                className="px-4 py-1.5 rounded-xl bg-[#171717] text-white text-xs font-semibold hover:bg-opacity-90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة مستند التحليل</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
