/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback, useDeferredValue } from "react";
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
  Link,
  FileCode,
  Sparkles,
  Search,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Calendar,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "motion/react";
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

const BentoDashboardPureStyle = React.memo(function BentoDashboardPureStyle({
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
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-200 ease-out bento-card cursor-pointer group hover:border-blue-600/30"
          >
            <div>
              <h3 className="text-sm font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">إجمالي قيمة المضبوطات المقدرة</h3>
            </div>
            <div className="mt-5 print:mt-2.5 flex items-baseline gap-1 bg-transparent overflow-hidden flex-wrap">
              <span className="text-2xl font-extrabold text-[#171717] tracking-tight font-mono apple-num group-hover:text-blue-600 transition-colors">
                {formatNum(mMetrics.totalSeizuresValue, true)}
              </span>
              <span className="text-xs font-bold text-neutral-400 group-hover:text-blue-500 transition-colors">جنيه</span>
            </div>
          </div>

          {/* CARD 2: Total seizures counts */}
          <div 
            onClick={() => openModalForAspect?.("إجمالي عدد الضبطيات الرقمية لوحدة الرصد", "إجمالي الضبطيات", "ضبطية")}
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-200 ease-out bento-card cursor-pointer group hover:border-blue-600/30"
          >
            <div>
              <h3 className="text-sm font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">إجمالي عدد الضبطيات المنفذة</h3>
            </div>
            <div className="mt-5 print:mt-2.5 flex items-baseline gap-1 bg-transparent overflow-hidden flex-wrap">
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold print:text-3xl print:font-black text-[#171717] tracking-tight font-mono apple-num group-hover:text-blue-600 transition-colors">
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
                      className="border border-[#ECEEF2] bg-neutral-50/25 hover:bg-neutral-50/10 rounded-2xl p-3.5 print:p-1.5 print:rounded-xl flex flex-col justify-center items-center text-center transition-all duration-200 ease-out cursor-pointer group hover:border-blue-600/30 aspect-[1.12/1] print:aspect-auto"
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
              {(() => {
                const maxVal = Math.max(...mMetrics.inspectors.map((i: any) => i.count)) || 1;
                return mMetrics.inspectors.map((insp: any) => {
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
                        <div className="w-full bg-[#F5F5F5] h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#555] h-1.5 rounded-full transition-all duration-700 ease-out group-hover/item:bg-blue-600" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center shrink-0 min-w-[42px] bg-neutral-50/70 border border-neutral-100 rounded-lg py-1 px-1">
                        <span className="font-bold text-[#171717] text-[11px] font-mono apple-num leading-none">{formatNum(insp.count)}</span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* CARD 5: Facebook */}
          <div 
            onClick={() => openModalForAspect?.("مخالفات الترويج عبر الفيسبوك", "فيسبوك")}
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-200 ease-out bento-card cursor-pointer group hover:border-blue-600/30"
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
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-200 ease-out bento-card cursor-pointer group hover:border-[#171717]/40"
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
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-200 ease-out bento-card cursor-pointer group hover:border-red-500/30"
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
          <div className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 transition-all duration-200 ease-out flex flex-col md:col-span-2 print:col-span-2 bento-card text-right">
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
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-200 ease-out bento-card cursor-pointer group hover:border-amber-500/30"
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
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-200 ease-out bento-card cursor-pointer group hover:border-purple-500/30"
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
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-200 ease-out bento-card cursor-pointer group hover:border-indigo-550/30"
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
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-3 flex flex-col justify-between transition-all duration-200 ease-out bento-card cursor-pointer group hover:border-emerald-500/30"
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
            className="border border-[#ECEEF2] bg-white rounded-2xl p-5 print:p-2.5 transition-all duration-200 ease-out md:col-span-3 print:col-span-3 flex flex-col items-center justify-center text-center bento-card cursor-pointer group hover:border-[#171717]/40"
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
});

const monthsRTL = [
  "يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

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
  "مصنع": { label: "مصنع", bg: "bg-purple-50", text: "text-purple-700" },
  "إجمالى عدد الضبطيات": { label: "إجمالي عدد الضبطيات المنفذة", bg: "bg-blue-50/70", text: "text-blue-700" },
  "إجمالي عدد الضبطيات": { label: "إجمالي عدد الضبطيات المنفذة", bg: "bg-blue-50/70", text: "text-blue-700" }
};

// Premium Apple-Style Animated Icon Components
interface IconProps {
  className?: string;
}

const PrinterIcon = ({ isPrinting, className }: IconProps & { isPrinting: boolean }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Top paper stack - slides downward into the printer and fades back in using GPU-accelerated translation */}
      <motion.rect 
        x="6" 
        y="2" 
        width="12" 
        height="7" 
        rx="0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={isPrinting ? { y: [0, 7, 0], opacity: [1, 0, 1] } : { y: 0, opacity: 1 }}
        transition={isPrinting ? {
          y: { duration: 0.6, times: [0, 0.6, 1], ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.6, times: [0, 0.5, 1], ease: "easeInOut" }
        } : { duration: 0.2 }}
      />
      {/* Printer body */}
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      {/* Bottom printed paper emerging from the bottom using GPU-accelerated translation */}
      <motion.rect 
        x="6" 
        y="14" 
        width="12" 
        height="8" 
        rx="0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={isPrinting ? { y: [0, 4, 0] } : { y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
};

const DownloadIcon = ({ isDownloading, className }: IconProps & { isDownloading: boolean }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Base bracket */}
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      {/* Arrow group translating downward gently with no bounce */}
      <motion.g
        animate={isDownloading ? { y: [0, 3, 0], opacity: [1, 0.8, 1] } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </motion.g>
    </svg>
  );
};

const ShareIcon = ({ isSharing, className }: IconProps & { isSharing: boolean }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Connection Line 2 - connects Left-Center (6, 12) to Top-Right (18, 5) */}
      <motion.line 
        x1={6} 
        y1={12} 
        x2={18} 
        y2={5} 
        animate={isSharing ? { 
          strokeWidth: [1.8, 2.8, 1.8],
          opacity: [0.7, 1, 0.7] 
        } : { 
          strokeWidth: 1.8,
          opacity: 0.7 
        }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Connection Line 1 - connects Left-Center (6, 12) to Bottom-Right (18, 19) */}
      <motion.line 
        x1={6} 
        y1={12} 
        x2={18} 
        y2={19} 
        animate={isSharing ? { 
          strokeWidth: [1.8, 2.8, 1.8],
          opacity: [0.7, 1, 0.7] 
        } : { 
          strokeWidth: 1.8,
          opacity: 0.7 
        }}
        transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
      />
      
      {/* Node 1: Center-Left (cx=6, cy=12) - The Pulse Origin */}
      <motion.circle 
        cx={6} 
        cy={12} 
        r={3} 
        className="fill-white group-hover:fill-[#f5f5f7] group-active:fill-[#e8e8ed] transition-colors duration-[140ms]"
        animate={isSharing ? { 
          scale: [1, 1.15, 1]
        } : { 
          scale: 1
        }}
        style={{ transformOrigin: "6px 12px" }}
        transition={{ duration: 0.5, delay: 0, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Node 2: Top-Right (cx=18, cy=5) - Staggered Pulsing */}
      <motion.circle 
        cx={18} 
        cy={5} 
        r={3} 
        className="fill-white group-hover:fill-[#f5f5f7] group-active:fill-[#e8e8ed] transition-colors duration-[140ms]"
        animate={isSharing ? { 
          scale: [1, 1.15, 1]
        } : { 
          scale: 1
        }}
        style={{ transformOrigin: "18px 5px" }}
        transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Node 3: Bottom-Right (cx=18, cy=19) - Staggered Pulsing */}
      <motion.circle 
        cx={18} 
        cy={19} 
        r={3} 
        className="fill-white group-hover:fill-[#f5f5f7] group-active:fill-[#e8e8ed] transition-colors duration-[140ms]"
        animate={isSharing ? { 
          scale: [1, 1.15, 1]
        } : { 
          scale: 1
        }}
        style={{ transformOrigin: "18px 19px" }}
        transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
};

const SyncIconComponent = ({ isSyncing }: { isSyncing: boolean }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (isSyncing) {
      controls.start({
        rotate: [0, 360],
        transition: { 
          duration: 1.2, // Slightly slower, highly fluid
          ease: [0.16, 1, 0.3, 1] // Native Apple-style ease-out with extreme ease at the end
        }
      });
    }
  }, [isSyncing, controls]);

  return (
    <motion.div 
      animate={controls} 
      initial={{ rotate: 0 }} 
      className="flex items-center justify-center w-5 h-5 flex-none shrink-0"
      style={{ transformOrigin: "center" }}
    >
      <RefreshCw className="w-5 h-5 text-white flex-none shrink-0" />
    </motion.div>
  );
};

const whiteButtonVariants = {
  initial: { opacity: 0, scale: 0.96, y: 6, filter: "blur(4px)" },
  settled: (delay: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 2px rgba(15,23,42,.02), 0 .5px 1px rgba(15,23,42,.02)",
    transition: { duration: 0.48, delay, ease: [0.16, 1, 0.3, 1] }
  }),
  hover: {
    y: -1.4,
    scale: 1.008,
    backgroundColor: "#FCFCFD",
    boxShadow: "0 5px 10px rgba(15,23,42,0.07), 0 2px 4px rgba(15,23,42,0.03), 0 0 0 0.5px rgba(228, 228, 228, 0.02)",
    transition: { type: "spring", stiffness: 950, damping: 40, mass: 0.38 }
  },
  tap: {
    y: 0,
    scale: 0.975,
    backgroundColor: "#F5F5F7",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03), 0 1px 1px rgba(0, 0, 0, 0.01), 0 0 0 0.5px rgba(0, 0, 0, 0.03)",
    transition: { type: "spring", stiffness: 1500, damping: 44, mass: 0.30 }
  }
};

const syncButtonVariants = {
  initial: { opacity: 0, scale: 0.96, y: 6, filter: "blur(4px)" },
  settled: (delay: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    backgroundColor: "#006FDB",
    boxShadow: "0 1px 2px rgba(0, 113, 227, 0.1)",
    transition: { duration: 0.48, delay, ease: [0.16, 1, 0.3, 1] }
  }),
  hover: {
    y: -2,
    scale: 1.01,
    backgroundColor: "#007AFF",
    boxShadow: "0 7px 18px rgba(15,23,42,0.065), 0 2px 5px rgba(15,23,42,0.025)",
    transition: { type: "spring", stiffness: 950, damping: 40, mass: 0.38 }
  },
  tap: {
    y: 0,
    scale: 0.975,
    backgroundColor: "#006FE0",
    boxShadow: "0 1px 3px rgba(0,113,227,0.10), inset 0 1px 0 rgba(255,255,255,0.10)",
    transition: { type: "spring", stiffness: 1500, damping: 44, mass: 0.30 }
  }
};

const toolbarButtonMotionStyle = {
  transformOrigin: "center center" as const,
  transform: "translateZ(0)",
  willChange: "transform, box-shadow, background-color",
  backfaceVisibility: "hidden" as const
};

const toolbarIconMotionStyle = {
  transformOrigin: "center center" as const,
  x: 0,
  y: 0
};

const toolbarInteractionTransition = {
  duration: 0.08,
  ease: [0.22, 1, 0.36, 1] as const
};

const dashboardEntranceVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.985, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] }
  }
};

const tabBarEntranceVariants = {
  hidden: { opacity: 0, y: -12, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const topNavTabsVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045, delayChildren: 0.02 }
  }
};

const topNavTabVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }
};

const monthTabsRowVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.02 }
  }
};

const monthTabVariant = {
  hidden: { opacity: 0, y: 8, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }
};

const dashboardContentVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.985, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
  }
};

const dashboardGridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045, delayChildren: 0.03 }
  }
};

const dashboardCardVariant = {
  hidden: { opacity: 0, y: 10, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
};

const spreadsheetContentVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

const spreadsheetSectionVariant = {
  hidden: { opacity: 0, y: 10, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
};

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

  const sheetDataLookup = useMemo(() => {
    const lookup = new Map<string, Map<string, SheetRow>>();
    sheetData.forEach((row) => {
      const aspect = row.aspect.trim();
      const date = row.date.trim();
      if (!lookup.has(aspect)) {
        lookup.set(aspect, new Map<string, SheetRow>());
      }
      const aspectLookup = lookup.get(aspect)!;
      if (!aspectLookup.has(date)) {
        aspectLookup.set(date, row);
      }
    });
    return lookup;
  }, [sheetData]);
  const [selectedMonth, setSelectedMonth] = useState<string>("2026"); // "2026" is the year aggregate
  const [activeTab, setActiveTab] = useState<"dashboard" | "spreadsheet">("dashboard");
  const [isHindiNumerals, setIsHindiNumerals] = useState<boolean>(true);
  
  // Google Sheets Direct Connect States
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>(
  DEFAULT_GOOGLE_SHEET_URL
);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem("cybercrime_last_synced") || null;
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isInitialAutoSyncing, setIsInitialAutoSyncing] = useState<boolean>(false);
  const [hasInitialAutoSyncCompleted, setHasInitialAutoSyncCompleted] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isSyncSectionExpanded, setIsSyncSectionExpanded] = useState<boolean>(false);
  const autoSyncAttemptedRef = useRef(false);

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
  
  // Custom states for toolbar button animations & toast feedback
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  // Keep the shell visible immediately, then transition the entrance in a controlled way to avoid flash/jitter.
  const [isToolbarReady, setIsToolbarReady] = useState<boolean>(true);
  const [isDashboardReady, setIsDashboardReady] = useState<boolean>(true);
  const initialReadyRef = useRef(false);
  useLayoutEffect(() => {
    if (initialReadyRef.current) return;
    initialReadyRef.current = true;
    const frame = window.requestAnimationFrame(() => {
      setIsToolbarReady(true);
      setIsDashboardReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Auto-dismiss share toast notification after 1.8 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [showToast]);
  
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
  const toggleMonthFilter = useCallback((month: string) => {
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
  }, [selectedFilterMonths]);

  // Multi-select Toggle Handler for Aspects Filter
  const toggleAspectFilter = useCallback((aspect: string) => {
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
  }, [selectedFilterAspects, uniqueAspects]);

  // Filter Checks helper
  const isMonthActive = useCallback((m: string) => {
    if (selectedFilterMonths.includes("الكل")) return true;
    return selectedFilterMonths.includes(m);
  }, [selectedFilterMonths]);

  const isAspectActive = useCallback((a: string) => {
    if (selectedFilterAspects.includes("الكل")) return true;
    return selectedFilterAspects.includes(a);
  }, [selectedFilterAspects]);

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
  const deferredEditorSearch = useDeferredValue(editorSearch);
  const [newAspectName, setNewAspectName] = useState<string>("");
  const [newAspectCount, setNewAspectCount] = useState<number>(0);
  const [newAspectMonth, setNewAspectMonth] = useState<string>("يناير");

  // Copy feedback states
  const [copiedCodeGs, setCopiedCodeGs] = useState<boolean>(false);
  const [copiedIndexHtml, setCopiedIndexHtml] = useState<boolean>(false);

  // --- ACTIONS ---
  
  // Pre-calculate/memoize metrics for all months (and the 2026 year summary) to avoid heavy re-computations on every single render.
  const memoizedMetricsByMonth = useMemo(() => {
    const cache: Record<string, any> = {};
    cache["2026"] = computeMetrics(sheetData, "2026");
    monthsRTL.forEach(m => {
      cache[m] = computeMetrics(sheetData, m);
    });
    return cache;
  }, [sheetData]);

  // Compute localized metrics based on full data and active tab month selection
  const metrics = useMemo(() => {
    return memoizedMetricsByMonth[selectedMonth] || memoizedMetricsByMonth["2026"];
  }, [memoizedMetricsByMonth, selectedMonth]);

  // Pre-calculate/memoize the aggregated rows for the spreadsheet view.
  const memoizedAggregatedRows = useMemo(() => {
    return uniqueAspects.map((aspect: string) => {
      const monthlyValues: Record<string, number> = {};
      let totalAllYear = 0;
      monthsRTL.forEach(m => {
        const match = sheetDataLookup.get(aspect)?.get(m);
        const val = match ? match.count : 0;
        monthlyValues[m] = val;
        totalAllYear += val;
      });
      return {
        aspect,
        monthlyValues,
        totalAllYear
      };
    });
  }, [sheetDataLookup, uniqueAspects]);

  // Pre-calculate active totals based on selectedFilterMonths.
  const activeAggregatedRows = useMemo(() => {
    return memoizedAggregatedRows.map(row => {
      let total = 0;
      monthsRTL.forEach(m => {
        if (isMonthActive(m)) {
          total += row.monthlyValues[m] || 0;
        }
      });
      return {
        ...row,
        total
      };
    });
  }, [memoizedAggregatedRows, selectedFilterMonths, isMonthActive]);

  // Pre-calculate active months list & total visibility to avoid repeated filtering during table rendering
  const activeMonthsList = useMemo(() => {
    return monthsRTL.filter(m => isMonthActive(m));
  }, [selectedFilterMonths, isMonthActive]);

  const showTotalColumn = useMemo(() => {
    return isMonthActive("إجمالي العام");
  }, [selectedFilterMonths, isMonthActive]);

  // Re-format helper supporting local numeral state (Hindi numerals / Arabic numerals)
  const formatNum = useCallback((num: number, isCurrency = false) => {
    if (!isHindiNumerals) {
      if (isCurrency) {
        return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(num));
      }
      return Math.round(num).toLocaleString('en-US');
    }
    return formatToArabicNumerals(num, isCurrency);
  }, [isHindiNumerals]);

  // Format million values to 1 decimal place with a comma, supporting local numeral state
  const formatMillionValue = useCallback((num: number) => {
    const valInMillions = num / 1000000;
    const roundedStr = valInMillions.toFixed(1);
    const formattedWithComma = roundedStr.replace(".", ",");
    if (!isHindiNumerals) {
      return formattedWithComma;
    }
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return formattedWithComma.replace(/[0-9]/g, (w) => arabicDigits[Number(w)]);
  }, [isHindiNumerals]);

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

  const handleSyncGoogleSheet = async (urlToSync: string, options?: { isInitialAutoSync?: boolean }) => {
    const isInitialAutoSync = options?.isInitialAutoSync ?? false;

    if (!urlToSync.trim()) {
      setSyncError("يرجى إدخال رابط جدول بيانات Google Sheet صحيح.");
      return;
    }

    if (isInitialAutoSync) {
      setIsInitialAutoSyncing(true);
    } else {
      setIsSyncing(true);
    }
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

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 18000);

      const response = await fetch(csvUrl, {
        cache: "no-store",
        headers: { Accept: "text/csv" },
        signal: controller.signal
      });
      if (!response.ok) {
        throw new Error("فشل الاتصال بجدول البيانات المرفق. يرجى التأكد من تعديل إعدادات المشاركة فى الشيت لتصبح 'أي شخص لديه الرابط' (Viewer/عارض).");
      }

      const csvText = await response.text();
      const parsedRows = parseCSV(csvText);

      if (parsedRows.length === 0) {
        throw new Error("تم الاتصال بنجاح ولكن لم يتم جلب أي بيانات تفصيلية. يرجى التأكد من تسمية الورقة (Tab) باسم 'Data' بدقة، وأنها تحتوي على الأعمدة الثلاثة ببيانات المفتشين والإجراءات.");
      }

      const hasSameData = sheetData.length === parsedRows.length && sheetData.every((row, index) => {
        const nextRow = parsedRows[index];
        return nextRow && row.aspect === nextRow.aspect && row.count === nextRow.count && row.date === nextRow.date;
      });

      // Save to states and browser persistence only when the data truly changes.
      if (!hasSameData) {
        setSheetData(parsedRows);
      }
      setGoogleSheetUrl(urlToSync);
      
      const egyptianTime = new Date().toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit"
      }) + " - " + new Date().toLocaleDateString("ar-EG");
      
      setLastSyncTime(egyptianTime);
      setSyncError(null);

      localStorage.setItem("cybercrime_sheet_data", JSON.stringify(parsedRows));
      localStorage.setItem("cybercrime_last_synced", egyptianTime);
    } catch (err: any) {
      console.error(err);
      if (err?.name === "AbortError") {
        setSyncError("تجاوزت عملية المزامنة الوقت المسموح به. يرجى المحاولة مرة أخرى أو التحقق من سرعة الاتصال.");
      } else {
        setSyncError(err.message || "فشل تحميل البيانات التلقائية. يرجى مراجعة إعدادات مشاركة الرابط.");
      }
    } finally {
      if (isInitialAutoSync) {
        setIsInitialAutoSyncing(false);
        setHasInitialAutoSyncCompleted(true);
      } else {
        setIsSyncing(false);
      }
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

  // Auto sync once on mount after the app has painted, so the first load stays lightweight and responsive.
  useEffect(() => {
    if (autoSyncAttemptedRef.current) return;
    autoSyncAttemptedRef.current = true;

    const normalizedUrl = DEFAULT_GOOGLE_SHEET_URL;

setGoogleSheetUrl(normalizedUrl);

const runInitialSync = () => {
  handleSyncGoogleSheet(normalizedUrl, { isInitialAutoSync: true });
};

    let idleHandle: number | undefined;
    const frameId = window.requestAnimationFrame(() => {
      idleHandle = typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(runInitialSync, { timeout: 800 })
        : window.setTimeout(runInitialSync, 140);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      if (typeof idleHandle === "number") {
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleHandle);
        } else {
          window.clearTimeout(idleHandle);
        }
      }
    };
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
  const handleShare = useCallback(() => {
    setIsSharing(true);
    setTimeout(() => setIsSharing(false), 800);

    const shareUrl = window.location.href;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShowToast(true);
      }).catch(() => {
        // Fallback fallback
        fallbackCopyText(shareUrl);
      });
    } else {
      fallbackCopyText(shareUrl);
    }
  }, []);

  const fallbackCopyText = (text: string) => {
    try {
      const tempInput = document.createElement("input");
      tempInput.value = text;
      // Ensure it is not visible but can be selected
      tempInput.style.position = "fixed";
      tempInput.style.opacity = "0";
      document.body.appendChild(tempInput);
      tempInput.select();
      tempInput.setSelectionRange(0, 99999); // For mobile devices
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
    setShowToast(true);
  };

  // Handle cell updates in our interactive table
  const handleCellChange = useCallback((index: number, newValue: string) => {
    const updated = [...sheetData];
    updated[index].count = parseFloat(newValue) || 0;
    setSheetData(updated);
  }, [sheetData]);

  // Add customized rows to spreadsheet simulator
  const handleAddNewRow = useCallback((e: React.FormEvent) => {
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
  }, [sheetData, newAspectName, newAspectCount, newAspectMonth]);

  // Handle deletion of raw rows in spreadsheet simulator
  const handleDeleteRow = useCallback((index: number) => {
    const updated = [...sheetData];
    updated.splice(index, 1);
    setSheetData(updated);
  }, [sheetData]);

  // Generate monthly distribution points for a specific aspect to render in the pop-up modal chart
  const getMonthlyDistributionForAspect = useCallback((aspectKey: string) => {
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
    const hasDedicatedTotalSeizures = sheetData.some(r => normalizeText(r.aspect) === "اجمالي عدد الضبطيات");
    const rowsByMonth = new Map<string, SheetRow[]>();

    sheetData.forEach((row) => {
      const month = row.date.trim();
      if (!rowsByMonth.has(month)) {
        rowsByMonth.set(month, []);
      }
      rowsByMonth.get(month)!.push(row);
    });

    return monthsRTL.map(mName => {
      let sum = 0;
      const rowsForMonth = rowsByMonth.get(mName) || [];
      rowsForMonth.forEach((row) => {
        let matches = false;
        const rawAspect = row.aspect || "";
        const norm = normalizeText(rawAspect);

          if (aspectKey === "أدوية جدول") {
            matches = (norm === "الاتجار بالادويه المخدره المدرجه جدول اول مخدرات" || norm === "الاتجار بالادويه المخدره المدرجه جدول ثالث مخدرات");
          } else if (aspectKey === "أدوية مجهولة المصدر" || aspectKey === "أدوية مجهولة") {
            matches = (norm === "عرض ادويه بدون فواتير مجهوله المصدر" || norm === "عرض كميات كبيره من الادويه بدون فواتير رسميه");
          } else if (aspectKey === "بيع عن طريق بيع إلكتروني" || aspectKey === "بيع عن طريق تطبيق الكتروني (instashop)" || aspectKey === "بيع عن طريق تطبيق الكتروني" || aspectKey === "بيع عن طريق تطبيق الكترonى") {
            matches = (norm === "بيع عن طريق تطبيق الكتروني (instashop)" || norm === "بيع عن طريق تطبيق الكتروني");
          } else if (aspectKey === "عرض الأدوية المهربة والغير مسجلة بهيئة الدواء المصرية" || aspectKey === "أدوية مهربة") {
            matches = (norm === "عرض الادويه المهربه والغير مسجله بهيئه الدواء المصريه");
          } else if (aspectKey === "عرض ادوية  أعلى من السعر الجبري" || aspectKey === "أعلى من السعر الجبري" || aspectKey === "سعر جبري") {
            matches = (norm === "عرض ادويه اعلي من السعر الجبري");
          } else if (aspectKey === "عرض ادوية هيئة شراء موحد" || aspectKey === "شراء موحد") {
            matches = (norm === "عرض ادويه هيئه شراء موحد");
          } else if (aspectKey === "اجمالى قيمة المضبوطات" || aspectKey === "إجمالي قيمة المضبوطات") {
            matches = (norm === "اجمالي قيمه المضبوطات");
          } else if (aspectKey === "صيدلية" || aspectKey === "صيدليه") {
            matches = (norm === "صيدليه");
          } else if (aspectKey === "مخزن") {
            matches = (norm === "مخزن");
          } else if (aspectKey === "عيادة" || aspectKey === "عياده") {
            matches = (norm === "عياده");
          } else if (aspectKey === "مصنع") {
            matches = (norm === "مصنع");
          } else if (aspectKey === "انستاشوب") {
            matches = (norm === "انستاشوب" || norm === "instashop");
          } else if (aspectKey === "فيسبوك") {
            matches = (norm === "فيسبوك" || norm === "facebook" || norm === "فيس بوك");
          } else if (aspectKey === "انستاجرام") {
            matches = (norm === "انستاجرام" || norm === "انستجرام" || norm === "instagram");
          } else if (aspectKey === "واتساب") {
            matches = (norm === "واتساب" || norm === "whatsapp" || norm === "واتس اب" || norm === "واتس");
          } else if (aspectKey === "موقع الكترونى" || aspectKey === "موقع الكتروني") {
            matches = (norm === "موقع الكتروني" || norm === "موقع الكترونى" || norm === "website" || norm === "موقع ويب");
          } else if (aspectKey === "بدون") {
            matches = (norm === "ميداني");
          } else if (aspectKey === "إجمالي الضبطيات" || aspectKey === "إجمالي عدد الضبطيات الرقمية لوحدة الرصد" || aspectKey === "totalSeizures") {
            if (hasDedicatedTotalSeizures) {
              matches = (norm === "اجمالي عدد الضبطيات");
            } else {
              matches = (
                norm.includes("وليد القاضي") || norm.includes("وليد القاضي ") || norm.includes("وليد القاضى") ||
                norm.includes("احمد حسن") || norm.includes("احمد حسن عبد الجواد") ||
                norm.includes("باسم محمد") || norm.includes("باسم فوزي") || norm.includes("باسم محمد فوزي") ||
                norm.includes("محمود غازي") || norm.includes("محمود غازي ") ||
                norm.includes("محمود خالد") || norm.includes("محمود خالد فؤاد")
              );
            }
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
      });
      return { month: mName, count: sum };
    });
  }, [sheetData]);

  // Open modal config
  const openModalForAspect = useCallback((title: string, aspectKey: string, unitStr = "ضبطية") => {
    setModalConfig({
      isOpen: true,
      title,
      aspectKey,
      unit: unitStr
    });
  }, []);

  // Dedicated Print Current Modal Chart Only
  const handlePrintModal = useCallback(() => {
    document.body.setAttribute("data-print-modal", "true");
    setTimeout(() => {
      window.print();
      document.body.removeAttribute("data-print-modal");
    }, 150);
  }, []);

  // Generate specific dataset for active modal (memoized for performance)
  const activeModalDistribution = useMemo(() => {
    return modalConfig.isOpen 
      ? getMonthlyDistributionForAspect(modalConfig.aspectKey)
      : [];
  }, [sheetData, modalConfig.isOpen, modalConfig.aspectKey]);

  const maxModalValue = useMemo(() => {
    return activeModalDistribution.length > 0
      ? Math.max(...activeModalDistribution.map(o => o.count)) || 1
      : 1;
  }, [activeModalDistribution]);

  const totalModalSum = useMemo(() => {
    return activeModalDistribution.reduce((a, b) => a + b.count, 0);
  }, [activeModalDistribution]);

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
            const pageMetrics = memoizedMetricsByMonth[mName] || memoizedMetricsByMonth["2026"];
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
              const pageMetrics = memoizedMetricsByMonth[mName] || memoizedMetricsByMonth["2026"];
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
                {activeMonthsList.map(m => (
                  <th key={m} className="px-1 py-2 text-center w-[6.5%] font-serif">{m}</th>
                ))}
                {showTotalColumn && (
                  <th className="px-2 py-2 text-center bg-neutral-205/40 border-r border-neutral-300 font-serif font-black">إجمالى</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {activeAggregatedRows
                .filter(row => isAspectActive(row.aspect))
                .map((row) => (
                  <tr key={row.aspect} className="bg-white">
                    <td className="px-3 py-2 font-bold text-neutral-850 font-serif max-w-[150px] break-words">
                      {aspectMetadata[row.aspect]?.label || row.aspect}
                    </td>
                    {activeMonthsList.map(m => {
                      const val = row.monthlyValues[m] || 0;
                      return (
                        <td key={m} className={`px-1 py-1.5 text-center font-mono apple-num ${val === 0 ? "text-neutral-300 font-medium" : "font-semibold text-neutral-800"}`}>
                          {val > 0 ? formatNum(val, row.aspect.includes("قيمة")) : "٠"}
                        </td>
                      );
                    })}
                    {showTotalColumn && (
                      <td className="px-2 py-1.5 text-center font-mono apple-num font-black bg-neutral-50 border-r border-neutral-300 text-neutral-900">
                        {formatNum(row.total, row.aspect.includes("قيمة"))}
                      </td>
                    )}
                  </tr>
                ))}
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
          <motion.div
            initial="hidden"
            animate={isDashboardReady ? "visible" : "hidden"}
            variants={topNavTabsVariants}
            className="nav-tabs-container"
          >
            <motion.button
              variants={topNavTabVariants}
              onClick={() => setActiveTab("dashboard")}
              className={`tab-pill flex items-center gap-1.5 font-bold ${
                activeTab === "dashboard" ? "active" : ""
              }`}
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-3.5 h-3.5"
              >
                <rect x="3" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" />
              </svg>
              <span>لوحة البيانات</span>
            </motion.button>
            <motion.button
              variants={topNavTabVariants}
              onClick={() => setActiveTab("spreadsheet")}
              className={`tab-pill flex items-center gap-1.5 font-bold ${
                activeTab === "spreadsheet" ? "active" : ""
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>جدول البيانات</span>
            </motion.button>
          </motion.div>

          {/* UTILITY BAR */}
          <motion.div
            initial="hidden"
            animate={isDashboardReady ? "visible" : "hidden"}
            variants={tabBarEntranceVariants}
            className="flex items-center gap-2 md:gap-3 flex-wrap justify-center"
          >
            {/* Sync Live Button (Replacing numeral switch) */}
            <div className="relative aspect-square w-10 h-10 md:w-[42px] md:h-[42px] shrink-0 flex-none" id="sync-toolbar-wrapper">
              <motion.button
                onClick={() => {
                  const activeUrl = googleSheetUrl || "";
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
                disabled={isSyncing || isInitialAutoSyncing}
                variants={syncButtonVariants}
                custom={0}
                initial="initial"
                animate={isToolbarReady ? "settled" : "initial"}
                whileHover="hover"
                whileTap="tap"
                className="relative isolate overflow-hidden p-2.5 text-white rounded-xl cursor-pointer flex items-center justify-center h-full w-full border border-transparent outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1 select-none shrink-0 flex-none"
                title={isInitialAutoSyncing ? "جارٍ التحديث الأولي للبيانات" : "مزامنة وجلب البيانات من Google Sheet"}
                id="sync-toolbar-btn"
                style={toolbarButtonMotionStyle}
              >
                <motion.div
                  className="relative flex items-center justify-center w-5 h-5 shrink-0"
                  initial={toolbarIconMotionStyle}
                  whileHover={{ y: -0.28, x: 0 }}
                  whileTap={{ y: -0.16, x: 0, scale: 0.97 }}
                  transition={toolbarInteractionTransition}
                >
                  <SyncIconComponent isSyncing={isSyncing || isInitialAutoSyncing} />
                </motion.div>
                <motion.span
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  whileTap={{ opacity: 1 }}
                  transition={{ duration: 0.14 }}
                  style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)"
                  }}
                />
              </motion.button>
            </div>

            {/* Print dropdown selector */}
            <div className="relative aspect-square w-10 h-10 md:w-[42px] md:h-[42px] shrink-0 flex-none" onClick={(e) => e.stopPropagation()} id="print-toolbar-wrapper">
              <motion.button
                onClick={() => {
                  setShowPrintDropdown(!showPrintDropdown);
                  setShowDownloadDropdown(false);
                  setIsPrinting(true);
                  setTimeout(() => setIsPrinting(false), 600);
                }}
                variants={whiteButtonVariants}
                custom={0.12}
                initial="initial"
                animate={isToolbarReady ? "settled" : "initial"}
                whileHover="hover"
                whileTap="tap"
                className="group relative overflow-hidden p-2.5 rounded-xl border-[0.5px] border-[#ECEEF2]/70 bg-white text-[#171717] flex items-center justify-center h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1 select-none cursor-pointer shrink-0 flex-none"
                title="طباعة التقرير"
                style={toolbarButtonMotionStyle}
              >
                <motion.div
                  className="relative flex items-center justify-center w-5 h-5 shrink-0"
                  initial={toolbarIconMotionStyle}
                  whileHover={{ y: -0.28, x: 0 }}
                  whileTap={{ y: -0.16, x: 0, scale: 0.97 }}
                  transition={toolbarInteractionTransition}
                >
                  <PrinterIcon isPrinting={isPrinting} className="w-5 h-5 text-neutral-500 group-hover:text-neutral-800 transition-colors duration-150 ease-out shrink-0 flex-none" />
                </motion.div>
                <motion.span
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  whileTap={{ opacity: 1 }}
                  transition={{ duration: 0.14 }}
                  style={{
                    background: "radial-gradient(circle, rgba(0,0,0,0.035) 0%, transparent 70%)"
                  }}
                />
              </motion.button>
              
              {showPrintDropdown && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max rounded-xl border border-[#ECEEF2] bg-white shadow-lg py-1.5 z-40 text-right animate-scale-up">
                  {activeTab === "spreadsheet" && (
                    <button 
                      onClick={handlePrintSpreadsheet} 
                      className="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2 font-serif font-bold border-b border-neutral-100 whitespace-nowrap"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span>طباعة جدول البيانات</span>
                    </button>
                  )}
                  <button 
                    onClick={handlePrintCurrent} 
                    className="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2 font-serif font-bold whitespace-nowrap"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span>طباعة الشهر الحالي فقط</span>
                  </button>
                  <button 
                    onClick={handlePrintAllPages} 
                    className="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2 font-serif font-bold whitespace-nowrap"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>طباعة السنة كاملة (١٣ صفحة)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Download PDF button */}
            <div className="relative aspect-square w-10 h-10 md:w-[42px] md:h-[42px] shrink-0 flex-none" onClick={(e) => e.stopPropagation()} id="download-toolbar-wrapper">
              <motion.button
                onClick={() => {
                  setShowDownloadDropdown(!showDownloadDropdown);
                  setShowPrintDropdown(false);
                  setIsDownloading(true);
                  setTimeout(() => setIsDownloading(false), 600);
                }}
                variants={whiteButtonVariants}
                custom={0.24}
                initial="initial"
                animate={isToolbarReady ? "settled" : "initial"}
                whileHover="hover"
                whileTap="tap"
                className="group relative overflow-hidden p-2.5 rounded-xl border-[0.5px] border-[#ECEEF2]/70 bg-white text-[#171717] flex items-center justify-center h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1 select-none cursor-pointer shrink-0 flex-none"
                title="تحميل كملف PDF"
                style={toolbarButtonMotionStyle}
              >
                <motion.div
                  className="relative flex items-center justify-center w-5 h-5 shrink-0"
                  initial={toolbarIconMotionStyle}
                  whileHover={{ y: -0.28, x: 0 }}
                  whileTap={{ y: -0.16, x: 0, scale: 0.97 }}
                  transition={toolbarInteractionTransition}
                >
                  <DownloadIcon isDownloading={isDownloading} className="w-5 h-5 text-neutral-500 group-hover:text-neutral-800 transition-colors duration-150 ease-out shrink-0 flex-none" />
                </motion.div>
                <motion.span
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  whileTap={{ opacity: 1 }}
                  transition={{ duration: 0.14 }}
                  style={{
                    background: "radial-gradient(circle, rgba(0,0,0,0.035) 0%, transparent 70%)"
                  }}
                />
              </motion.button>
              
              {showDownloadDropdown && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max rounded-xl border border-[#ECEEF2] bg-white shadow-lg py-1.5 z-40 text-right animate-scale-up">
                  {activeTab === "spreadsheet" && (
                    <>
                      <button 
                        onClick={handlePrintSpreadsheet} 
                        className="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2 font-serif font-bold whitespace-nowrap"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>حفظ الجدول كملف PDF</span>
                      </button>
                      <button 
                        onClick={handleDownloadExcel} 
                        className="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2 font-serif font-bold border-b border-neutral-100 whitespace-nowrap"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <span>حفظ الجدول كملف excel</span>
                      </button>
                    </>
                  )}
                  <button 
                    onClick={handleDownloadCurrent} 
                    className="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2 font-serif font-bold whitespace-nowrap"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>تحميل كملف PDF للشهر</span>
                  </button>
                  <button 
                    onClick={handleDownloadAllPages} 
                    className="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2 font-serif font-bold whitespace-nowrap"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    <span>تحميل التقرير ١٣ صفحة</span>
                  </button>
                </div>
              )}
            </div>

            {/* Share button */}
            <div className="relative aspect-square w-10 h-10 md:w-[42px] md:h-[42px] shrink-0 flex-none" id="share-toolbar-wrapper">
              <motion.button
                onClick={handleShare}
                variants={whiteButtonVariants}
                custom={0.36}
                initial="initial"
                animate={isToolbarReady ? "settled" : "initial"}
                whileHover="hover"
                whileTap="tap"
                className="group relative overflow-hidden p-2.5 rounded-xl border-[0.5px] border-[#ECEEF2]/70 bg-white text-[#171717] flex items-center justify-center h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1 select-none cursor-pointer shrink-0 flex-none"
                title="مشاركة الرابط"
                style={toolbarButtonMotionStyle}
              >
                <motion.div
                  className="relative flex items-center justify-center w-5 h-5 shrink-0"
                  initial={toolbarIconMotionStyle}
                  whileHover={{ y: -0.28, x: 0 }}
                  whileTap={{ y: -0.16, x: 0, scale: 0.97 }}
                  transition={toolbarInteractionTransition}
                >
                  <ShareIcon isSharing={isSharing} className="w-5 h-5 text-neutral-500 group-hover:text-neutral-800 transition-colors duration-150 ease-out shrink-0 flex-none" />
                </motion.div>
                <motion.span
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  whileTap={{ opacity: 1 }}
                  transition={{ duration: 0.14 }}
                  style={{
                    background: "radial-gradient(circle, rgba(0,0,0,0.035) 0%, transparent 70%)"
                  }}
                />
              </motion.button>
            </div>
          </motion.div>
        </header>

        {/* ACTIVE MODULE CONTAINER */}
        
        {/* TAB 1: THE BEAUTIFUL APPLE BENTO DASHBOARD */}
        <motion.div
          initial="hidden"
          animate={activeTab === "dashboard" ? (isDashboardReady ? "visible" : "hidden") : "hidden"}
          exit="hidden"
          variants={dashboardContentVariants}
          className={`relative ${activeTab === "dashboard" ? "" : "hidden"}`}
        >
            
            {/* 13 PILLS MONTLY TAB SELECTOR */}
            <motion.div
              initial="hidden"
              animate={activeTab === "dashboard" ? "visible" : "hidden"}
              variants={monthTabsRowVariants}
              className="mb-8 overflow-x-auto pb-2 relative flex md:justify-center no-print"
            >
              <div className="nav-tabs-container min-w-max">
                
                {/* aggregates pill far-left (first in RTL) */}
                <motion.button
                  variants={monthTabVariant}
                  onClick={() => setSelectedMonth("2026")}
                  className={`tab-pill ${selectedMonth === "2026" ? "active" : ""}`}
                >
                  إجمالى
                </motion.button>

                {/* Monthly pills from Jan to Dec */}
                {monthsRTL.map(mName => (
                  <motion.button
                    key={mName}
                    variants={monthTabVariant}
                    onClick={() => setSelectedMonth(mName)}
                    className={`tab-pill ${selectedMonth === mName ? "active" : ""}`}
                  >
                    {mName}
                  </motion.button>
                ))}

              </div>
            </motion.div>

            {/* DASHBOARD PRISTINE PRINTABLE Bento AREA */}
            <div className="printable-dashboard-area">
              


              {/* BENTO GRID LAYOUT */}
              <motion.div
                initial="hidden"
                animate={activeTab === "dashboard" ? "visible" : "hidden"}
                variants={dashboardGridVariants}
                className="grid grid-cols-1 md:grid-cols-3 md:grid-flow-row-dense gap-6"
              >
                
                {/* CARD 1: Total Seizure value in LE (Uneven row / heights, spans 1 column) */}
                <div 
                  onClick={() => openModalForAspect("إجمالي القيمة التقديرية للمضبوطات الدوائية", "اجمالى قيمة المضبوطات", "جنيه")}
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 ease-out md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-[#E5E7EB] ring-1 ring-transparent hover:ring-blue-100/50 hover:bg-neutral-50/10 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">إجمالي قيمة المضبوطات المقدرة</h3>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2 overflow-hidden flex-wrap">
                    <span className="text-3xl md:text-4xl font-extrabold print:text-3xl print:font-black text-[#171717] tracking-tight font-mono apple-num group-hover:text-blue-600 transition-colors">
                      {formatNum(metrics.totalSeizuresValue, true)}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-blue-500 transition-colors">جنيه مصرى</span>
                  </div>
                </div>

                {/* CARD 2: Total seizures counts (Grand KPI Hero Card, Spans 1 Col) */}
                <div 
                  onClick={() => openModalForAspect("إجمالي عدد الضبطيات الرقمية لوحدة الرصد", "إجمالي الضبطيات", "ضبطية")}
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 ease-out md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-blue-600/30 ring-1 ring-transparent hover:ring-blue-100/50 hover:bg-neutral-50/10 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-neutral-500 font-serif group-hover:text-blue-600 transition-colors">إجمالي عدد الضبطيات المنفذة</h3>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2 overflow-hidden flex-wrap">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold print:text-3xl print:font-black text-[#171717] tracking-tight font-mono apple-num group-hover:text-blue-600 transition-colors">
                      {formatNum(metrics.totalSeizures)}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-blue-500 transition-colors">ضبطية دوائية</span>
                  </div>
                </div>

                {/* CARD 7: Facilities Target numbers (Spans 2 Rows for a gorgeous vertical panel) */}
                <motion.div variants={dashboardCardVariant} className="border border-[#ECEEF2] bg-white rounded-2xl px-3 md:px-4 py-4 md:py-5 transition-all duration-200 ease-out flex flex-col md:col-span-1 md:row-span-2 bento-card hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
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
                            className="border border-[#ECEEF2] bg-neutral-50/30 hover:bg-neutral-50/10 rounded-2xl p-4 flex flex-col justify-center items-center text-center transition-all duration-200 ease-out cursor-pointer group hover:border-blue-600/30 ring-1 ring-transparent hover:ring-blue-100/30 aspect-[1.1/1]"
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
                </motion.div>

                {/* CARD 3: Inspector Performance (Spans 2 Rows vertically to fit the puzzle perfectly) */}
                <motion.div variants={dashboardCardVariant} className="border border-[#ECEEF2] bg-white rounded-2xl p-4 md:p-5 transition-all duration-200 ease-out flex flex-col md:col-span-1 md:row-span-2 bento-card hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
                  <div className="text-right mb-3.5">
                    <h3 className="text-sm md:text-base font-bold text-[#171717] font-serif">عدد الضبطيات الموثقة لكل مفتش</h3>
                  </div>

                  <div className="flex-1 flex flex-col justify-center space-y-3 py-1">
                    {(() => {
                      const maxVal = Math.max(...metrics.inspectors.map(i => i.count)) || 1;
                      return metrics.inspectors.map(insp => {
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
                      });
                    })()}
                  </div>
                </motion.div>

                {/* CARD 4: Facebook aspect (Spans 1 Col, height is Row-span-1) */}
                <div 
                  onClick={() => openModalForAspect("مخالفات الترويج عبر الفيسبوك", "فيسبوك")}
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 ease-out md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-blue-600/30 ring-1 ring-transparent hover:ring-blue-100/50 hover:bg-neutral-50/10 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
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
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 ease-out md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-[#171717]/40 ring-1 ring-transparent hover:ring-neutral-200/50 hover:bg-neutral-50/10 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
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
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 ease-out md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-red-500/30 ring-1 ring-transparent hover:ring-red-100/50 hover:bg-neutral-50/10 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
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
                <motion.div variants={dashboardCardVariant} className="border border-[#ECEEF2] bg-white rounded-2xl p-6 transition-all duration-200 ease-out flex flex-col md:col-span-2 md:row-span-1 bento-card hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
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
                </motion.div>

                {/* CARD 9: Smuggled Drugs */}
                <div 
                  onClick={() => openModalForAspect("أدوية مهربة وغير مسجلة بهيئة الدواء المصرية", "عرض الأدوية المهربة والغير مسجلة بهيئة الدواء المصرية")}
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 ease-out md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-amber-500/30 ring-1 ring-transparent hover:ring-amber-100/50 hover:bg-neutral-50/10 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
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
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 ease-out md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-purple-500/30 ring-1 ring-transparent hover:ring-purple-100/50 hover:bg-neutral-50/10 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
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
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 ease-out md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-indigo-550/30 ring-1 ring-transparent hover:ring-indigo-100/50 hover:bg-neutral-50/10 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
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
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 ease-out md:col-span-1 md:row-span-1 bento-card cursor-pointer group hover:border-emerald-500/30 ring-1 ring-transparent hover:ring-emerald-100/50 hover:bg-neutral-50/10 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
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
                  className="border border-[#ECEEF2] bg-white rounded-2xl p-6 transition-all duration-200 ease-out md:col-span-3 flex flex-col items-center justify-center text-center bento-card cursor-pointer group hover:border-[#171717]/40 hover:bg-neutral-50/10 ring-1 ring-transparent hover:ring-neutral-250/50 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
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
              </motion.div>

              {/* Elegant printable page number for single-page dashboard print */}
              <div className="hidden print:block text-center text-xs text-neutral-400 mt-6 pt-3 border-t border-neutral-200/60 font-sans apple-num font-bold">
                <span>صفحة رقم {formatToArabicNumerals(1)}</span>
              </div>

            </div>

          </motion.div>

        {/* TAB 2: INTERACTIVE DATA TABLE IN LIVE SHEETS STYLE */}
        <motion.div
          initial="hidden"
          animate={activeTab === "spreadsheet" ? "visible" : "hidden"}
          variants={spreadsheetContentVariants}
          className={`animate-fade-in sheets-simulator space-y-6 ${activeTab === "spreadsheet" ? "" : "hidden"}`}
        >
            
            {/* GOOGLE SHEETS LIVE SYNC COMPONENT CARD (THE LIVE ALTERNATIVE) */}
            <motion.div variants={spreadsheetSectionVariant} className="bg-white border border-[#ECEEF2] rounded-2xl p-6 shadow-sm text-right">
              {/* Clickable Header for collapsing/expanding */}
              <div 
                onClick={() => setIsSyncSectionExpanded(!isSyncSectionExpanded)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <Link className="w-4 h-4 text-neutral-500" />
                  <h2 className="text-md font-bold text-neutral-800">
                    الربط المباشر بجدول بيانات Google Sheet
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {!isSyncSectionExpanded && googleSheetUrl && (
                    <div className="bg-green-50/60 border border-green-200/50 rounded-xl px-3 py-1 flex items-center gap-2 text-[10px] md:text-xs text-green-800 font-bold">
                      <span className={`w-1.5 h-1.5 rounded-full ${isInitialAutoSyncing ? "bg-amber-500 animate-pulse" : "bg-green-500"}`}></span>
                      <span>{isInitialAutoSyncing ? "جارٍ التحديث الأولي" : "المزامنة مفعلة"}</span>
                      {lastSyncTime && (
                        <span className="text-green-950 font-serif mr-1 border-r border-green-200/60 pr-1">
                          آخر مزامنة: {lastSyncTime}
                        </span>
                      )}
                    </div>
                  )}
                  {isSyncSectionExpanded ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500 transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 transition-transform duration-300" />
                  )}
                </div>
              </div>

              {/* Collapsible Content */}
              {isSyncSectionExpanded && (
                <div className="mt-5 pt-5 border-t border-neutral-100 animate-fade-in space-y-5">
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    قم بإدخال رابط ملف Google Sheets وتأكد من إتاحة الملف للعرض عبر الرابط عن طريق ضبط إعدادات المشاركة على <span className="font-bold text-[#171717]">"Anyone with the link" </span> ، ثم اضغط «مزامنة» لاستيراد البيانات وتحديث جميع المؤشرات!
                  </p>

                  {googleSheetUrl && (
                    <div className="bg-green-50/60 border border-green-200/50 rounded-xl px-4 py-2 flex items-center gap-2 text-xs text-green-800 font-bold w-fit">
                      <span className={`w-1.5 h-1.5 rounded-full ${isInitialAutoSyncing ? "bg-amber-500 animate-pulse" : "bg-green-500"}`}></span>
                      <span>{isInitialAutoSyncing ? "جارٍ تحديث البيانات أول مرة" : "المزامنة التلقائية مفعلة"}</span>
                      {lastSyncTime && (
                        <span className="text-green-950 font-serif mr-2 font-bold select-none border-r border-green-200/60 pr-2">
                          آخر مزامنة: {lastSyncTime}
                        </span>
                      )}
                    </div>
                  )}

                  {/* INPUT AND MANUAL SYNC ACTION BUTTONS */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
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
                        disabled={isSyncing || isInitialAutoSyncing}
                        className="bg-[#171717] text-white hover:bg-opacity-90 font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
                        title={isInitialAutoSyncing ? "جارٍ تحديث البيانات أول مرة..." : "مزامنة وجلب أحدث البيانات"}
                      >
                        {isSyncing || isInitialAutoSyncing ? (
                          <>
                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            <span>{isInitialAutoSyncing ? "جارٍ التحديث الأولي..." : "جاري المزامنة..."}</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>مزامنة الان</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  {syncError && (
                    <div className="mt-3 text-xs text-red-500 font-semibold bg-red-50/50 border border-red-100 rounded-lg p-3">
                      ⚠️ {syncError}
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            <motion.div variants={spreadsheetSectionVariant} className="bg-white border border-[#ECEEF2] rounded-2xl p-6 shadow-sm no-print relative z-10 overflow-visible">
              
              {/* TOP EDITOR CONTROLS */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#ECEEF2]">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2 text-neutral-800">
                    <Database className="w-5 h-5 text-neutral-450" />
                    <span>جدول البيانات السنوي المجمع</span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    يعرض الجدول جميع مؤشرات الرصد والضبط الميداني ضمن عرض شهرى مقارن على مدار العام مع حساب الإجمالى.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                  {/* Search query in simulator */}
                  <div className="relative w-full sm:w-48">
                    <input
                      type="text"
                      placeholder="البحث عن جانب محدد..."
                      value={editorSearch}
                      onChange={(e) => setEditorSearch(e.target.value)}
                      className="text-xs px-8 py-2 border border-[#ECEEF2] rounded-xl bg-neutral-50 focus:bg-white focus:outline-none w-full text-right font-medium text-neutral-800"
                    />
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-2.5" />
                  </div>

                  {/* Filter 1: Months Dropdown (Multi-select) */}
                  <div className="relative w-full sm:w-auto" id="filter-months-dropdown-container">
                    <motion.button
                      variants={whiteButtonVariants}
                      initial="settled"
                      animate="settled"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => {
                        setIsMonthFilterOpen(!isMonthFilterOpen);
                        setIsAspectFilterOpen(false);
                      }}
                      className="flex items-center justify-between sm:justify-start gap-2 text-xs font-bold px-3.5 py-2.5 border-[0.5px] border-[#ECEEF2]/70 rounded-xl bg-white cursor-pointer text-neutral-700 w-full sm:min-w-36 select-none outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1"
                      style={{ transformOrigin: "center" }}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-neutral-450" />
                        <span>الأشهر: </span>
                      </div>
                      <span className="text-blue-600 font-serif">
                        {selectedFilterMonths.length === 0
                          ? "لا شيء"
                          : selectedFilterMonths.includes("الكل")
                          ? "الكل (١٣)"
                          : selectedFilterMonths.length === 1
                          ? (selectedFilterMonths[0] === "إجمالي العام" ? "إجمالى" : selectedFilterMonths[0])
                          : `${selectedFilterMonths.length} أشهر`}
                      </span>
                    </motion.button>
                    
                    {isMonthFilterOpen && (
                      <div className="absolute left-0 right-0 sm:right-auto mt-1.5 w-auto sm:w-56 rounded-xl border border-[#ECEEF2] bg-white shadow-lg py-1.5 z-50 text-right animate-scale-up max-h-80 overflow-y-auto">
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
                  <div className="relative w-full sm:w-auto" id="filter-aspects-dropdown-container">
                    <motion.button
                      variants={whiteButtonVariants}
                      initial="settled"
                      animate="settled"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => {
                        setIsAspectFilterOpen(!isAspectFilterOpen);
                        setIsMonthFilterOpen(false);
                      }}
                      className="flex items-center justify-between sm:justify-start gap-2 text-xs font-bold px-3.5 py-2.5 border-[0.5px] border-[#ECEEF2]/70 rounded-xl bg-white cursor-pointer text-neutral-700 w-full sm:min-w-40 select-none outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1"
                      style={{ transformOrigin: "center" }}
                    >
                      <div className="flex items-center gap-2">
                        <Database className="w-3.5 h-3.5 text-[#059669]" />
                        <span>المؤشرات: </span>
                      </div>
                      <span className="text-emerald-600 font-serif truncate max-w-[120px] sm:max-w-none">
                        {selectedFilterAspects.length === 0
                          ? "لا شيء"
                          : selectedFilterAspects.includes("الكل")
                          ? "الكل"
                          : selectedFilterAspects.length === 1
                          ? (aspectMetadata[selectedFilterAspects[0]]?.label || selectedFilterAspects[0])
                          : `${selectedFilterAspects.length} مؤشر`}
                      </span>
                    </motion.button>
                    
                    {isAspectFilterOpen && (
                      <div className="absolute left-0 right-0 sm:right-auto mt-1.5 w-auto sm:w-64 rounded-xl border border-[#ECEEF2] bg-white shadow-lg py-1.5 z-50 text-right animate-scale-up max-h-80 overflow-y-auto">
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
                      {activeMonthsList.map(m => (
                        <th key={m} className="px-1.5 py-3 text-center text-[10px] font-bold w-[6.5%] font-serif">{m}</th>
                      ))}
                      {showTotalColumn && (
                        <th className="px-3 py-3 text-center text-[11px] font-black font-serif bg-neutral-100/50 border-r border-[#ECEEF2] w-[9%]">إجمالى</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECEEF2]">
                    {activeAggregatedRows
                      .filter(row => {
                        // Filter with spreadsheet's search query and active aspect
                        if (!isAspectActive(row.aspect)) return false;
                        const s = deferredEditorSearch.toLowerCase();
                        const localizedLabel = (aspectMetadata[row.aspect]?.label || row.aspect).toLowerCase();
                        return row.aspect.toLowerCase().includes(s) || localizedLabel.includes(s);
                      })
                      .map((row) => (
                        <tr key={row.aspect} className="hover:bg-neutral-50/30 transition-colors">
                          <td className="px-3 py-2.5 font-bold text-neutral-800 font-serif max-w-[170px] break-words">
                            {aspectMetadata[row.aspect]?.label || row.aspect}
                          </td>
                          {activeMonthsList.map(m => {
                            const val = row.monthlyValues[m] || 0;
                            return (
                              <td key={m} className={`px-1.5 py-2.5 text-center font-mono apple-num ${val === 0 ? "text-neutral-300 font-medium" : "font-semibold text-neutral-750"}`}>
                                {val > 0 ? formatNum(val, row.aspect.includes("قيمة")) : "٠"}
                              </td>
                            );
                          })}
                          {showTotalColumn && (
                            <td className="px-3 py-2.5 text-center font-mono apple-num font-black bg-neutral-100/30 border-r border-[#ECEEF2] text-neutral-900">
                              {formatNum(row.total, row.aspect.includes("قيمة"))}
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

          </motion.div>

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
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalConfig({ ...modalConfig, isOpen: false });
            }
          }}
          className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 text-right animate-fade-in print-modal-container cursor-pointer"
        >
          <div className="bg-white border border-[#ECEEF2] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative transition-transform duration-300 transform scale-100 cursor-default">
            
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
            <div className="relative w-full h-44 bg-[#FAFAFA] border border-[#ECEEF2] rounded-xl flex items-end justify-between px-4 pb-2 pt-6 chart-bars-container">
              {modalConfig.aspectKey === "اجمالى قيمة المضبوطات" && (
                <div className="absolute top-2 left-3 text-[10px] font-extrabold text-neutral-450 bg-neutral-100/80 border border-neutral-200/50 px-2 py-0.5 rounded-md font-serif z-10 select-none">
                  مليون
                </div>
              )}
              {activeModalDistribution.map((point) => {
                const percentage = (point.count / maxModalValue) * 100;
                return (
                  <div key={point.month} className="flex-1 flex flex-col items-center group relative mx-0.5 md:mx-1 h-full justify-end">
                    
                    {/* Tooltip on hovering Column */}
                    <div className="absolute bottom-full mb-1 bg-[#171717] text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap font-mono">
                      {formatNum(point.count)} {modalConfig.unit}
                    </div>

                    {/* Dynamic Bar Element */}
                    <motion.div 
                      className="w-2.5 md:w-4.5 bg-neutral-200 group-hover:bg-[#171717] print:bg-neutral-800 rounded-t-sm chart-bar origin-bottom"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ 
                        type: "spring", 
                        damping: 18, 
                        stiffness: 65, 
                        mass: 1 
                      }}
                      style={{ height: `${percentage}%` }}
                    />

                    {/* Value label under column */}
                    <span className="text-[7.5px] md:text-[9.5px] text-neutral-500 mt-1 font-bold font-mono whitespace-nowrap apple-num chart-value-label">
                      {modalConfig.aspectKey === "اجمالى قيمة المضبوطات"
                        ? formatMillionValue(point.count)
                        : formatNum(point.count, modalConfig.aspectKey.includes("قيمة"))
                      }
                    </span>

                  </div>
                );
              })}
            </div>

            {/* All 12 Month indicators under columns */}
            <div className="flex justify-between px-4 text-[8px] md:text-[9.5px] font-black text-neutral-400 mt-2 chart-month-labels-container">
              {activeModalDistribution.map((point) => (
                <span key={point.month} className="flex-1 text-center font-serif truncate mx-0.5 md:mx-1 chart-month-label">
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

      {/* Apple-Style Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 bg-white/90 backdrop-blur-md border border-[#ECEEF2] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] pointer-events-none select-none font-sans text-right"
            dir="rtl"
          >
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-neutral-800">تم نسخ الرابط</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
