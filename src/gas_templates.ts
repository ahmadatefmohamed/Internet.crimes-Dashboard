export const CODE_GS = `function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('تقرير وحدة جرائم الانترنت ٢٠٢٦')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Returns JSON-formatted data from the sheet named "Data"
 */
function getSheetData() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
    if (!sheet) {
      return { error: 'الصفحة المسماة "Data" غير موجودة في جدول البيانات!' };
    }
    
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return { error: 'لا توجد بيانات كافية في ورقة العمل "Data".' };
    }
    
    // Fetch columns A, B, and C
    var range = sheet.getRange(2, 1, lastRow - 1, 3);
    var values = range.getValues();
    
    var rawRows = [];
    for (var i = 0; i < values.length; i++) {
      var aspect = values[i][0];
      var count = values[i][1];
      var date = values[i][2];
      
      if (aspect && date) {
        rawRows.push({
          aspect: aspect.toString(),
          count: parseFloat(count) || 0,
          date: date.toString()
        });
      }
    }
    
    return { success: true, data: rawRows };
  } catch (e) {
    return { error: e.toString() };
  }
}
`;

export const INDEX_HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>تقرير وحدة جرائم الانترنت ٢٠٢٦</title>
  
  <!-- خطوط جوجل الاحترافية -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  
  <style>
    body {
      background-color: #FAFAFA;
      color: #171717;
      font-family: 'Cairo', sans-serif;
      min-height: 100vh;
      margin: 0;
      padding: 0;
    }
    h1, h2, h3, .font-amiri {
      font-family: 'Amiri', serif;
    }
    
    /* أرقام هندية جميلة وعريضة */
    .hindi-number {
      font-family: 'Cairo', 'Amiri', sans-serif;
      font-weight: 700;
    }

    /* تحسينات الطباعة لملف A4 */
    @media print {
      body {
        background-color: #FFFFFF !important;
        color: #000000 !important;
      }
      .no-print {
        display: none !important;
      }
      .printable-area {
        width: 210mm !important;
        max-width: 100% !important;
        background: white !important;
        padding: 0 !important;
        margin: 0 auto !important;
        box-shadow: none !important;
        border: none !important;
      }
      .bento-card {
        border: 1px solid #ECEEF2 !important;
        box-shadow: none !important;
        break-inside: avoid !important;
      }
      button, .tab-bar-container {
        display: none !important;
      }
    }

    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #ECEEF2;
      border-radius: 99px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #D8DBE0;
    }
  </style>
</head>
<body class="bg-[#FAFAFA] text-[#171717]">

  <!-- غلاف التحميل المبدئي -->
  <div id="loader" class="fixed inset-0 bg-[#FAFAFA] z-50 flex flex-col items-center justify-center transition-opacity duration-300">
    <div class="w-12 h-12 border-4 border-[#ECEEF2] border-t-[#171717] rounded-full animate-spin"></div>
    <span class="mt-4 font-medium text-sm text-neutral-500">جاري تحميل البيانات من ورقة Google Sheets...</span>
  </div>

  <div class="max-w-[1200px] mx-auto px-4 py-8 md:py-12 printable-area">
    
    <!-- الترويسة الرئيسية وأدوات التحكم -->
    <header class="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-6 border-b border-[#ECEEF2] no-print">
      <div class="text-center md:text-right w-full md:w-auto">
        <h1 class="text-2xl md:text-3xl font-extrabold font-serif text-[#171717] tracking-tight text-center md:text-right">تقرير وحدة جرائم الانترنت</h1>
        <p class="text-xs text-neutral-400 mt-2 font-serif tracking-wide text-center md:text-right">
          لسنة ٢٠٢٦
        </p>
        <p class="text-[10px] text-neutral-400 mt-1 font-mono text-center md:text-right" id="last-update-time"></p>
      </div>

      <!-- مجموعة الأزرار الجمالية بهوية آبل -->
      <div class="flex items-center gap-2 md:gap-3 flex-wrap justify-center shrink-0">
        <!-- تفعيل/إلغاء لغة الأرقام الهندية والإنجليزية -->
        <button onclick="toggleNumberMode()" class="border border-[#ECEEF2] bg-white rounded-xl hover:bg-neutral-50 text-[#171717] transition-all cursor-pointer font-bold text-xs md:text-sm px-3 h-10 flex items-center gap-1.5 shadow-sm shrink-0" title="تغيير نمط الأرقام المعروضة">
          <i data-lucide="languages" class="w-4 h-4 text-neutral-400"></i>
          <span id="number-toggle-label">EN</span>
        </button>

        <!-- زر الطباعة مع منسدلة خيارات -->
        <div class="relative inline-block text-left" id="print-dropdown-container">
          <button onclick="toggleDropdown('print-dropdown')" class="p-2.5 border border-[#ECEEF2] bg-white rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer text-[#171717] flex items-center justify-center h-10 w-10 shrink-0 shadow-sm" title="طباعة">
            <i data-lucide="printer" class="w-5 h-5 text-neutral-500"></i>
          </button>
          <div id="print-dropdown" class="hidden absolute left-0 mt-2 w-48 rounded-xl border border-[#ECEEF2] bg-white shadow-lg py-1 z-30 transition-all text-right font-serif font-bold">
            <button onclick="printPage('current')" class="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> طباعة الشهر الحالي فقط
            </button>
            <button onclick="printPage('all')" class="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> طباعة السنة كاملة (١٣ شهر)
            </button>
          </div>
        </div>

        <!-- زر التنزيل ملف PDF -->
        <div class="relative inline-block text-left" id="download-dropdown-container">
          <button onclick="toggleDropdown('download-dropdown')" class="p-2.5 border border-[#ECEEF2] bg-white rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer text-[#171717] flex items-center justify-center h-10 w-10 shrink-0 shadow-sm" title="تنزيل كملف PDF">
            <i data-lucide="download" class="w-5 h-5 text-neutral-500"></i>
          </button>
          <div id="download-dropdown" class="hidden absolute left-0 mt-2 w-48 rounded-xl border border-[#ECEEF2] bg-white shadow-lg py-1 z-30 transition-all text-right font-serif font-bold">
            <button onclick="printPage('current')" class="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> تحميل الصفحة الحالية (PDF)
            </button>
            <button onclick="printPage('all')" class="w-full text-right px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> تحميل التقرير الكامل (PDF)
            </button>
          </div>
        </div>

        <!-- زر المشاركة -->
        <button onclick="shareLink()" class="p-2.5 border border-[#ECEEF2] bg-white rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer text-[#171717] flex items-center justify-center h-10 w-10 shrink-0 shadow-sm" title="مشاركة الرابط">
          <i data-lucide="share-2" class="w-5 h-5 text-neutral-500"></i>
        </button>
      </div>
    </header>

    <!-- شريط تصفية الأشهر (١٣ تباً) -->
    <div class="mb-8 overflow-x-auto no-print pb-2 relative max-w-full">
      <div id="tabs-bar" class="flex items-center gap-2 md:gap-3 bg-neutral-100/50 p-1.5 rounded-xl border border-[#ECEEF2] min-w-max">
         <!-- سيتم توليد الأزرار تباعاً عبر جافاسكريبت لجعل 2026 على اليسار والشهور مرتبة من اليمين باتجاه اليسار -->
      </div>
    </div>

    <!-- ترويسة مخفية في الشاشة تظهر أثناء الطباعة لإعطاء عنوان رسمي -->
    <div class="hidden print:block text-center border-b-2 border-neutral-800 pb-4 mb-8">
      <h1 class="text-3xl font-bold font-amiri">جمهورية مصر العربية</h1>
      <h2 class="text-2xl font-bold font-amiri mt-1">تقرير لوحة معلومات وحدة جرائم الإنترنت</h2>
      <h3 class="text-lg font-medium mt-1" id="print-current-month-title"></h3>
    </div>

    <!-- شبكة البينتو Bento Grid لجميع الإحصائيات -->
    <main class="grid grid-cols-1 md:grid-cols-3 gap-6" id="bento-grid">
      
      <!-- الكارت ١: إجمالي قيمة المضبوطات (عريض صنف مالي) -->
      <div class="md:col-span-2 bg-white border border-[#ECEEF2] rounded-2xl p-6 relative overflow-hidden transition-all hover:scale-[1.01] hover:shadow-xs flex flex-col justify-between" id="card-total-value">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold tracking-wider text-neutral-400">إجمالي المبالغ المالية</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-600">القيمة المادية</span>
          </div>
          <h2 class="text-sm font-semibold text-neutral-400 mt-2">إجمالي قيمة المضبوطات</h2>
        </div>
        <div class="mt-6 flex items-baseline gap-2">
          <span class="text-4xl md:text-5xl font-mono text-[#171717] font-bold tracking-tight hindi-number" id="val-total-points">٠</span>
          <span class="text-sm font-semibold text-neutral-400">جنيه مصري</span>
        </div>
      </div>

      <!-- الكارت ٢: إجمالي عدد الضبطيات (الـ KPI البطل) -->
      <div class="bg-white border border-[#ECEEF2] rounded-2xl p-6 relative overflow-hidden transition-all hover:scale-[1.01] hover:shadow-xs flex flex-col justify-between" id="card-total-seizures">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold tracking-wider text-neutral-400">مؤشر الأداء الرئيسي</span>
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
          <h2 class="text-sm font-semibold text-neutral-400 mt-2">إجمالي عدد الضبطيات</h2>
        </div>
        <div class="mt-6 flex items-baseline gap-2">
          <span class="text-5xl md:text-6xl font-mono text-[#171717] font-bold tracking-tight hindi-number" id="val-total-seizures">٠</span>
          <span class="text-sm font-semibold text-neutral-400">ضبطية</span>
        </div>
      </div>

      <!-- الكارت ٣: عدد الضبطيات لكل مفتش -->
      <div class="bg-white border border-[#ECEEF2] rounded-2xl p-6 transition-all hover:scale-[1.01] flex flex-col md:col-span-2 overflow-hidden" id="card-inspectors">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-semibold tracking-wider text-neutral-400">كفاءة الفريق الميداني</span>
          <span class="text-xs text-neutral-400">مفتشي اللجنة الميدانية</span>
        </div>
        <h3 class="text-md font-bold font-amiri text-[#171717] mb-4 text-lg">عدد الضبطيات المنفذة لكل مفتش</h3>
        <div class="space-y-4 flex-1 flex flex-col justify-around" id="inspectors-list">
          <!-- سيتم بناؤه برمجياً -->
        </div>
      </div>

      <!-- الكارت ٤: انستاشوب (تفصيل ذو وصول عالي) -->
      <div class="bg-white border border-[#ECEEF2] rounded-2xl p-6 transition-all hover:scale-[1.01] hover:shadow-xs flex flex-col justify-between" id="card-instashop">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold tracking-wider text-[#171717]/80">المنصة الأوسع نشاطاً</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-[#171717]">instashop</span>
          </div>
          <h2 class="text-sm font-semibold text-neutral-400 mt-2">بيع موازي عبر انستاشوب</h2>
        </div>
        <div class="mt-6 flex items-baseline gap-2">
          <span class="text-4xl md:text-5xl font-mono text-[#171717] font-bold tracking-tight hindi-number" id="val-instashop">٠</span>
          <span class="text-sm font-semibold text-neutral-400">ضبطية</span>
        </div>
      </div>

      <!-- الكارت ٥: فيسبوك -->
      <div class="bg-white border border-[#ECEEF2] rounded-2xl p-6 transition-all hover:scale-[1.01] hover:shadow-xs flex flex-col justify-between" id="card-facebook">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold tracking-wider text-blue-600">شبكات التواصل الاجتماعي</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600">فيسبوك</span>
          </div>
          <h2 class="text-sm font-semibold text-neutral-400 mt-2">الاتجار غير المشروع عبر الفيسبوك</h2>
        </div>
        <div class="mt-6 flex items-baseline gap-2">
          <span class="text-4xl md:text-5xl font-mono text-blue-900 font-bold tracking-tight hindi-number" id="val-facebook">٠</span>
          <span class="text-sm font-semibold text-neutral-400">ضبطية</span>
        </div>
      </div>

      <!-- الكارت ٦: المصادر والتطبيقات الأخرى المنوعة -->
      <div class="bg-white border border-[#ECEEF2] rounded-2xl p-6 transition-all hover:scale-[1.01] flex flex-col" id="card-platforms">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-semibold tracking-wider text-neutral-400">توزع قنوات التسويق</span>
          <span class="text-[10px] uppercase font-mono text-neutral-400">قنوات رصد الويب</span>
        </div>
        <h3 class="text-md font-bold font-amiri text-[#171717] mb-4 text-lg">وسائل التواصل ومنصات العرض</h3>
        <div class="space-y-3.5 flex-1 flex flex-col justify-center" id="platforms-list">
          <!-- سيتم إنشاؤه برمجياً -->
        </div>
      </div>

      <!-- الكارت ٧: نوع المؤسسة -->
      <div class="border border-[#ECEEF2] bg-white rounded-2xl p-6 transition-all md:col-span-1 md:row-span-2 bento-card flex flex-col justify-between" id="card-facilities">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-base font-bold text-[#171717] font-serif">نوع المؤسسة</h3>
        </div>
        <div class="grid grid-cols-2 gap-3 mt-3 flex-1 justify-center" id="facilities-grid">
          <!-- سيتم بناؤه برمجياً -->
        </div>
      </div>

      <!-- الكارت ٨: أدوية جدول -->
      <div class="bg-white border border-[#ECEEF2] rounded-2xl p-6 transition-all hover:scale-[1.01] flex flex-col justify-between" id="card-adwia-jadwal">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold tracking-wider text-red-500">مخالفات المواد المخدرة</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-500">جدول أول وثالث</span>
          </div>
          <h2 class="text-sm font-semibold text-neutral-400 mt-2">قضايا أدوية الجدول المخالفة</h2>
        </div>
        <div class="mt-6 flex items-baseline gap-2">
          <span class="text-4xl md:text-5xl font-mono text-red-800 font-bold tracking-tight hindi-number" id="val-adwia-jadwal">٠</span>
          <span class="text-sm font-semibold text-neutral-400">ضبطية</span>
        </div>
      </div>

      <!-- الكارت ٩: أدوية مهربة -->
      <div class="bg-white border border-[#ECEEF2] rounded-2xl p-6 transition-all hover:scale-[1.01] flex flex-col justify-between" id="card-adwia-moharaba">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold tracking-wider text-amber-500">مخالفات التهريب والدواء</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-500">غير مسجلة</span>
          </div>
          <h2 class="text-sm font-semibold text-neutral-400 mt-2">أدوية مهربة وغير مسجلة بهيئة الدواء</h2>
        </div>
        <div class="mt-6 flex items-baseline gap-3">
          <span class="text-4xl md:text-5xl font-mono text-amber-800 font-bold tracking-tight hindi-number" id="val-adwia-moharaba">٠</span>
          <span class="text-sm font-semibold text-neutral-400">ضبطية</span>
        </div>
      </div>

      <!-- الكارت ١٠: أدوية مجهولة المصدر -->
      <div class="bg-white border border-[#ECEEF2] rounded-2xl p-6 transition-all hover:scale-[1.01] flex flex-col justify-between" id="card-adwia-majhoula">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold tracking-wider text-purple-500">دواء بدون هوية أوراق</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAFAFA] text-purple-600">بدون فواتير رسمية</span>
          </div>
          <h2 class="text-sm font-semibold text-neutral-400 mt-2">أدوية بدون فواتير مجهولة المصدر</h2>
        </div>
        <div class="mt-6 flex items-baseline gap-2">
          <span class="text-4xl md:text-5xl font-mono text-purple-950 font-bold tracking-tight hindi-number" id="val-adwia-majhoula">٠</span>
          <span class="text-sm font-semibold text-neutral-400">ضبطية</span>
        </div>
      </div>

      <!-- الكارت ١١: مخالفات سعر جبري -->
      <div class="bg-white border border-[#ECEEF2] rounded-2xl p-6 transition-all hover:scale-[1.01] flex flex-col justify-between" id="card-mokhalafat-ser-jabri">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold tracking-wider text-indigo-500">التسعير الإجباري للدواء</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-500">أعلى من التسعيرة</span>
          </div>
          <h2 class="text-sm font-semibold text-neutral-400 mt-2">عرض أدوية بسعر أعلى من الجبري</h2>
        </div>
        <div class="mt-6 flex items-baseline gap-2">
          <span class="text-4xl md:text-5xl font-mono text-indigo-950 font-bold tracking-tight hindi-number" id="val-mokhalafat-ser-jabri">٠</span>
          <span class="text-sm font-semibold text-neutral-400">ضبطية</span>
        </div>
      </div>

      <!-- الكارت ١٢: أدوية هيئة الشراء الموحد -->
      <div class="bg-white border border-[#ECEEF2] rounded-2xl p-6 transition-all hover:scale-[1.01] flex flex-col justify-between" id="card-adwia-shira-mowahad">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold tracking-wider text-emerald-500">ممتلكات الهيئات العامة</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAFAFA] text-emerald-600">هيئة الشراء الموحد</span>
          </div>
          <h2 class="text-sm font-semibold text-neutral-400 mt-2">تسريب وعرض دواء من الشراء الموحد</h2>
        </div>
        <div class="mt-6 flex items-baseline gap-2">
          <span class="text-4xl md:text-5xl font-mono text-emerald-950 font-bold tracking-tight hindi-number" id="val-adwia-shira-mowahad">٠</span>
          <span class="text-sm font-semibold text-neutral-400">ضبطية</span>
        </div>
      </div>

      <!-- الكارت ١٣: بيع عن طريق تطبيق الكترونى -->
      <div class="border border-[#ECEEF2] bg-white rounded-2xl p-6 transition-all md:col-span-3 flex flex-col items-center justify-center text-center bento-card" id="card-electronic-app-sales">
        <div class="flex flex-col items-center">
          <h3 class="text-base md:text-lg font-bold font-serif text-[#171717] mb-3">بيع عن طريق تطبيق الكترونى</h3>
          <div class="bg-[#FAFAFA]/70 border border-neutral-100 rounded-xl px-6 py-3 min-w-[265px] flex items-center justify-between gap-8 animate-fade-in">
            <span class="text-xs font-bold text-neutral-500 font-serif">إجمالي قضايا بيع التطبيقات</span>
            <div class="flex items-baseline gap-1 font-mono">
              <span class="text-2xl md:text-3xl font-extrabold text-[#171717] tracking-tight hindi-number" id="val-electronic-sales">٠</span>
              <span class="text-xs text-neutral-400 font-bold font-serif">ضبطية</span>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>

  <!-- صندوق حواري منبثق (Modal) لعرض توزيع الشهور عند الضغط على الكارت في الوضع التجميعي -->
  <div id="chart-modal" class="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs z-40 hidden flex items-center justify-center p-4">
    <div class="bg-white border border-[#ECEEF2] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative transition-transform duration-300 transform scale-95" id="modal-container">
      <button onclick="closeModal()" class="absolute top-4 left-4 p-2 rounded-full border border-[#ECEEF2] bg-[#FAFAFA] hover:bg-neutral-100 transition cursor-pointer">
        <i data-lucide="x" class="w-4 h-4 text-neutral-600"></i>
      </button>

      <div class="text-right pb-4 border-b border-[#ECEEF2] mb-6">
        <span class="text-[10px] bg-neutral-100 text-[#171717] px-2.5 py-0.5 rounded-full font-bold">رسم بياني تحليلي للفترة (١٢ شهراً)</span>
        <h3 class="text-xl font-bold font-amiri text-[#171717] mt-2" id="modal-chart-title">اسم المؤشر</h3>
        <p class="text-xs text-neutral-400 mt-1">تطور حجم الضبطيات المنجزة عبر شهور السنة ٢٠٢٦</p>
      </div>

      <!-- محاكي مخطط الأعمدة المبسط والأنيق بأسلوب آبل -->
      <div class="relative w-full h-44 bg-[#FAFAFA] border border-[#ECEEF2] rounded-xl flex items-end justify-between px-4 pb-2 pt-6" id="bars-chart-container">
        <!-- الأعمدة التحليلية سيتم توليدها برمجياً ليمثل كل شهر -->
      </div>
      
      <!-- تسميات الشهور تحت المخطط -->
      <div class="flex items-center justify-between px-4 text-[9px] font-medium text-neutral-400 mt-2 font-mono">
        <span>يناير</span>
        <span>مارس</span>
        <span>مايو</span>
        <span>يوليو</span>
        <span>سبتمبر</span>
        <span>نوفمبر</span>
        <span>ديسمبر</span>
      </div>

      <div class="mt-6 pt-4 border-t border-[#ECEEF2] flex items-center justify-between no-print">
        <span class="text-xs text-neutral-400" id="modal-total-count-lbl">إجمالي الضبطية عبر السنة لـ د.وليد:</span>
        <button onclick="window.print()" class="px-4 py-2 rounded-xl bg-[#171717] text-white text-xs font-semibold tracking-wide shadow-sm hover:bg-opacity-90 transition cursor-pointer flex items-center gap-2">
          <i data-lucide="printer" class="w-4 h-4"></i> طباعة الإحصائية الحالية
        </button>
      </div>
    </div>
  </div>

  <script>
    // متغيرات الحالة العالمية لتخزين البيانات والخيارات
    var RAW_DATA = [];
    var ACTIVE_MONTH = "2026"; // '2026' تمثل الإجمالي السنوي
    var CHINESE_NUMBER_MODE = true; // تعني الأرقام الهندية (١٢٣)؛ إذا كانت false تعرض الأرقام الإنجليزية (123)

    var MONTHS_RTL = [
      "يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];

    // خريطة تهيئة أسماء الجوانب المقارنة في الشيت
    var ASPECT_DISPLAY_NAMES = {
      // المفتشين
      "د.وليد القاضى ": { key: "د.وليد القاضى ", label: "د.وليد القاضي" },
      "د.احمد حسن عبد الجواد ": { key: "د.احمد حسن عبد الجواد ", label: "د.أحمد حسن عبد الجواد" },
      "د.باسم محمد فوزي": { key: "د.باسم محمد فوزي", label: "د.باسم محمد فوزي" },
      "د.محمود غازي": { key: "د.محمود غازي", label: "د.محمود غازي" },
      "د.محمود خالد فؤاد ": { key: "د.محمود خالد فؤاد ", label: "د.محمود خالد فؤاد" },
      
      // المنصات
      "انستاشوب": { key: "انستاشوب", label: "انستاشوب" },
      "فيسبوك": { key: "فيسبوك", label: "فيسبوك" },
      "انستاجرام": { key: "انستاجرام", label: "إنستغرام" },
      "واتساب": { key: "واتساب", label: "واتساب" },
      "موقع الكترونى": { key: "موقع الكترونى", label: "مواقع إلكترونية" },
      "بدون": { key: "بدون", label: "زيارات ميدانية بدون" },
      
      // المنشآت
      "صيدلية": { key: "صيدلية", label: "صيدليات" },
      "مخزن": { key: "مخزن", label: "مستودعات ومخازن" },
      "عيادة": { key: "عيادة", label: "عيادات طبية" },
      "مصنع": { key: "مصنع", label: "مصانع دواء" }
    };

    // عند تحميل الصفحة في محيط Apps Script
    window.addEventListener("DOMContentLoaded", function () {
      lucide.createIcons();
      fetchSheetData();
    });

    function showLoader(visible) {
      var loader = document.getElementById("loader");
      if (visible) {
        loader.classList.remove("opacity-0", "pointer-events-none");
      } else {
        loader.classList.add("opacity-0", "pointer-events-none");
      }
    }

    /**
     * وظيفة جلب البيانات الحية من خادم Google Sheets
     */
    function fetchSheetData() {
      showLoader(true);
      if (typeof google !== "undefined" && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler(onDataReceived)
          .withFailureHandler(onDataError)
          .getSheetData();
      } else {
        // إذا كنا نختبر تطبيق ويب محلياً (Fallback)
        simulateLocalData();
      }
    }

    function onDataReceived(response) {
      showLoader(false);
      if (response && response.success) {
        RAW_DATA = response.data;
        document.getElementById("last-update-time").innerText = "آخر تحديث تلقائي: " + new Date().toLocaleTimeString("ar-EG");
        buildTabs();
        updateDashboard();
      } else {
        alert("فشل جلب الملف: " + (response ? response.error : "خطأ غير معروف"));
      }
    }

    function onDataError(err) {
      showLoader(false);
      alert("حدث خطأ أثناء تحميل جدول البيانات: " + err.toString());
      simulateLocalData();
    }

    function simulateLocalData() {
      // محاكاة بيانات حية لأغراض العرض المستقل
      console.log("محاكاة وضع الويب المستقل...");
      RAW_DATA = generateSampleRows();
      document.getElementById("last-update-time").innerText = "محاكاة بيانات حية غير متصلة بالشيت";
      buildTabs();
      updateDashboard();
    }

    /**
     * دالة توليد بيانات افتراضية ممتازة متطابقة مع شكل الشيت لمساعدتهم بالتصفح الفوري
     */
    function generateSampleRows() {
      var sample = [];
      var months = MONTHS_RTL;
      
      for (var m = 0; m < months.length; m++) {
        var month = months[m];
        
        sample.push({ aspect: "د.وليد القاضى ", count: Math.floor(Math.random() * 8) + 8, date: month });
        sample.push({ aspect: "د.احمد حسن عبد الجواد ", count: Math.floor(Math.random() * 10) + 7, date: month });
        sample.push({ aspect: "د.باسم محمد فوزي", count: Math.floor(Math.random() * 9) + 6, date: month });
        sample.push({ aspect: "د.محمود غازي", count: Math.floor(Math.random() * 12) + 9, date: month });
        sample.push({ aspect: "د.محمود خالد فؤاد ", count: Math.floor(Math.random() * 7) + 5, date: month });
        
        sample.push({ aspect: "انستاشوب", count: Math.floor(Math.random() * 15) + 15, date: month });
        sample.push({ aspect: "فيسبوك", count: Math.floor(Math.random() * 12) + 10, date: month });
        sample.push({ aspect: "انستاجرام", count: Math.floor(Math.random() * 10) + 5, date: month });
        sample.push({ aspect: "واتساب", count: Math.floor(Math.random() * 8) + 4, date: month });
        sample.push({ aspect: "موقع الكترونى", count: Math.floor(Math.random() * 11) + 8, date: month });
        sample.push({ aspect: "بدون", count: Math.floor(Math.random() * 5) + 3, date: month });
        
        sample.push({ aspect: "الاتجار بألادوية المخدرة المدرجة جدول اول مخدرات", count: Math.floor(Math.random() * 5), date: month });
        sample.push({ aspect: "الاتجار بألادوية المخدرة المدرجة جدول ثالث مخدرات", count: Math.floor(Math.random() * 6), date: month });
        sample.push({ aspect: "عرض الأدوية المهربة والغير مسجلة بهيئة الدواء المصرية", count: Math.floor(Math.random() * 15) + 10, date: month });
        sample.push({ aspect: "عرض ادوية  بدون فواتير مجهولة المصدر", count: Math.floor(Math.random() * 12) + 5, date: month });
        sample.push({ aspect: "عرض كميات كبيرة من الادوية بدون فواتير رسمية", count: Math.floor(Math.random() * 10) + 5, date: month });
        sample.push({ aspect: "عرض ادوية  أعلى من السعر الجبري", count: Math.floor(Math.random() * 10), date: month });
        sample.push({ aspect: "عرض ادوية هيئة شراء موحد", count: Math.floor(Math.random() * 12) + 4, date: month });
        sample.push({ aspect: "بيع عن طريق تطبيق الكتروني (instashop)", count: Math.floor(Math.random() * 8) + 4, date: month });
        sample.push({ aspect: "بيع عن طريق تطبيق الكتروني", count: Math.floor(Math.random() * 10) + 6, date: month });
        
        sample.push({ aspect: "اجمالى قيمة المضبوطات", count: Math.floor(Math.random() * 800000) + 700000, date: month });
        
        sample.push({ aspect: "صيدلية", count: Math.floor(Math.random() * 20) + 15, date: month });
        sample.push({ aspect: "مخزن", count: Math.floor(Math.random() * 8) + 4, date: month });
        sample.push({ aspect: "عيادة", count: Math.floor(Math.random() * 6) + 3, date: month });
        sample.push({ aspect: "مصنع", count: Math.floor(Math.random() * 3) + 1, date: month });
      }
      return sample;
    }

    /**
     * دالة تحويل وتنسيق الأرقام
     */
    function formatNumber(num, isCurrency) {
      if (num === undefined || num === null) return "٠";
      
      var formatted = isCurrency
        ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(num))
        : Math.round(num).toLocaleString('en-US');
        
      if (!CHINESE_NUMBER_MODE) {
        return formatted;
      }
      
      var arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
      return formatted.replace(/[0-9]/g, function (w) {
        return arabicDigits[Number(w)];
      });
    }

    /**
     * بناء شريط التبويبات الثلاثة عشر
     */
    function buildTabs() {
      var tabsContainer = document.getElementById("tabs-bar");
      tabsContainer.innerHTML = "";
      
      // الترتيب باتجاه اليمين: يناير أولاً ثم الشهور تتسلسل، ثم "عام 2026" في أقصى اليسار
      // يناير على اليمين لأفضل تصفح RTL
      
      // إضافة زر الإجمالي العام في أقصى اليسار (سيكون الأول برمجياً)
      var aggregateTab = document.createElement("button");
      aggregateTab.type = "button";
      aggregateTab.className = "px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer " + 
        (ACTIVE_MONTH === "2026" ? "bg-white text-[#171717] shadow-xs" : "text-neutral-500 hover:text-[#171717]");
      aggregateTab.innerText = "إجمالى";
      aggregateTab.onclick = function() { selectMonth("2026"); };
      tabsContainer.appendChild(aggregateTab);
      
      // الشهور تصاعدياً من ديسمبر إلى يناير لتظهر يناير في اليمين وديسمبر في اليسار في الـ RTL
      var monthsReversed = MONTHS_RTL.slice().reverse();
      monthsReversed.forEach(function (mName) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer " + 
          (ACTIVE_MONTH === mName ? "bg-white text-[#171717] shadow-xs" : "text-neutral-500 hover:text-[#171717]");
        btn.innerText = mName;
        btn.onclick = function() { selectMonth(mName); };
        // نضيف لليسار للترتيب
        tabsContainer.insertBefore(btn, aggregateTab.nextSibling);
      });
    }

    function selectMonth(mName) {
      ACTIVE_MONTH = mName;
      buildTabs();
      updateDashboard();
    }

    /**
     * حساب وتحديث جميع المؤشرات بناء على الشهر المختار
     */
    function updateDashboard() {
      var filtered = ACTIVE_MONTH === "2026" 
        ? RAW_DATA 
        : RAW_DATA.filter(function (row) { return row.date === ACTIVE_MONTH; });

      document.getElementById("print-current-month-title").innerText = ACTIVE_MONTH === "2026" ? "التقرير التجميعي السنوي لعام ٢٠٢٦" : "تقرير أداء شهر " + ACTIVE_MONTH + " لعام ٢٠٢٦";

      // مجاميع المؤشرات الحسابية
      var totalVal = 0;
      var totalSeizures = 0;
      var inspectorsMap = { "د.وليد القاضى ": 0, "د.احمد حسن عبد الجواد ": 0, "د.باسم محمد فوزي": 0, "د.محمود غازي": 0, "د.محمود خالد فؤاد ": 0 };
      var platformsMap = { "انستاشوب": 0, "فيسبوك": 0, "انستاجرام": 0, "واتساب": 0, "موقع الكترونى": 0, "بدون": 0 };
      
      var adwiaJadwal = 0;
      var adwiaMoharaba = 0;
      var adwiaMajhoula = 0;
      var mokhalafatSerJabri = 0;
      var adwiaShiraMowahad = 0;
      var electronicAppSales = 0;

      var facilitiesMap = { "صيدلية": 0, "مخزن": 0, "عيادة": 0, "مصنع": 0 };

      filtered.forEach(function (row) {
        var aspect = row.aspect.trim();
        var count = Number(row.count) || 0;

        // مالي
        if (aspect === "اجمالى قيمة المضبوطات" || aspect === "إجمالي قيمة المضبوطات") {
          totalVal += count;
        }
        // مفتشين
        if (inspectorsMap.hasOwnProperty(row.aspect)) {
          inspectorsMap[row.aspect] += count;
        }
        // منصات
        if (platformsMap.hasOwnProperty(aspect)) {
          platformsMap[aspect] += count;
        }
        // أدوية جدول
        if (aspect === "الاتجار بألادوية المخدرة المدرجة جدول اول مخدرات" || aspect === "الاتجار بألادوية المخدرة المدرجة جدول ثالث مخدرات") {
          adwiaJadwal += count;
        }
        // أدوية مهربة
        if (aspect === "عرض الأدوية المهربة والغير مسجلة بهيئة الدواء المصرية") {
          adwiaMoharaba += count;
        }
        // مجهولة المصدر
        if (aspect === "عرض ادوية  بدون فواتير مجهولة المصدر" || aspect === "عرض ادوية بدون فواتير مجهولة المصدر" || aspect === "عرض كميات كبيرة من الادوية بدون فواتير رسمية") {
          adwiaMajhoula += count;
        }
        // مخالفات سعر جبري
        if (aspect === "عرض ادوية  أعلى من السعر الجبري" || aspect === "عرض ادوية أعلى من السعر الجبري") {
          mokhalafatSerJabri += count;
        }
        // شراء موحد
        if (aspect === "عرض ادوية هيئة شراء موحد") {
          adwiaShiraMowahad += count;
        }
        // بيع تطبيق الكتروني
        if (aspect === "بيع عن طريق تطبيق الكتروني (instashop)" || aspect === "بيع عن طريق تطبيق الكتروني") {
          electronicAppSales += count;
        }
        // منشآت
        if (facilitiesMap.hasOwnProperty(aspect)) {
          facilitiesMap[aspect] += count;
        }
      });

      // إجمالي عدد الضبطيات الموثقة لكل مفتش
      totalSeizures = Object.values(inspectorsMap).reduce(function (a, b) { return a + b; }, 0);

      // تغذية العناصر في الواجهات
      document.getElementById("val-total-points").innerText = formatNumber(totalVal, true);
      document.getElementById("val-total-seizures").innerText = formatNumber(totalSeizures, false);

      document.getElementById("val-instashop").innerText = formatNumber(platformsMap["انستاشوب"] || 0, false);
      document.getElementById("val-facebook").innerText = formatNumber(platformsMap["فيسبوك"] || 0, false);
      
      document.getElementById("val-adwia-jadwal").innerText = formatNumber(adwiaJadwal, false);
      document.getElementById("val-adwia-moharaba").innerText = formatNumber(adwiaMoharaba, false);
      document.getElementById("val-adwia-majhoula").innerText = formatNumber(adwiaMajhoula, false);
      document.getElementById("val-mokhalafat-ser-jabri").innerText = formatNumber(mokhalafatSerJabri, false);
      document.getElementById("val-adwia-shira-mowahad").innerText = formatNumber(adwiaShiraMowahad, false);
      document.getElementById("val-electronic-sales").innerText = formatNumber(electronicAppSales, false);

      // كروت قابلة للنقر لطلب التفصيل التحليلي فقط في وضع التجميع لـ 2026
      setupCardClickEvents({
        "card-total-value": { title: "إجمالي قيمة المضبوطات الحسابية", value: totalVal, aspectKey: "اجمالى قيمة المضبوطات" },
        "card-instashop": { title: "تطور ضبطيات انستاشوب الميدانية", value: platformsMap["انستاشوب"], aspectKey: "انستاشوب" },
        "card-facebook": { title: "تطور ضبطيات منصة فيسبوك", value: platformsMap["فيسبوك"], aspectKey: "فيسبوك" },
        "card-adwia-jadwal": { title: "أدوية جدول أول وثالث منشطة", value: adwiaJadwal, aspectKey: "أدوية جدول" },
        "card-adwia-moharaba": { title: "تطور الأدوية المهربة"، value: adwiaMoharaba, aspectKey: "عرض الأدوية المهربة والغير مسجلة بهيئة الدواء المصرية" },
        "card-adwia-majhoula": { title: "ضبطيات أدوية مجهولة المصدر", value: adwiaMajhoula, aspectKey: "عرض ادوية  بدون فواتير مجهولة المصدر" },
        "card-mokhalafat-ser-jabri": { title: "قضايا التسعير الجبري ومخالفاتها", value: mokhalafatSerJabri, aspectKey: "عرض ادوية  أعلى من السعر الجبري" },
        "card-adwia-shira-mowahad": { title: "ضبطيات هيئة الشراء الموحد", value: adwiaShiraMowahad, aspectKey: "عرض ادوية هيئة شراء موحد" }
      });

      // بناء قائمة المفتشين
      var inspectorsContainer = document.getElementById("inspectors-list");
      inspectorsContainer.innerHTML = "";
      var maxInspectorVal = Math.max.apply(null, Object.values(inspectorsMap)) || 1;
      
      Object.keys(inspectorsMap).forEach(function (name) {
        var val = inspectorsMap[name];
        var pct = (val / maxInspectorVal) * 100;
        
        var rawName = name.trim();
        var displayName = ASPECT_DISPLAY_NAMES[name] ? ASPECT_DISPLAY_NAMES[name].label : rawName;

        var rowDiv = document.createElement("div");
        rowDiv.className = "flex flex-col gap-1.5 cursor-pointer " + (ACTIVE_MONTH === "2026" ? "hover:translate-x-[-4px] transition-transform" : "");
        if (ACTIVE_MONTH === "2026") {
          rowDiv.onclick = function() { openChartModalForAspect(displayName, name, "مفتش"); };
        }

        rowDiv.innerHTML = 
          '<div class="flex items-center justify-between text-xs">' +
            '<span class="font-bold text-neutral-800">' + displayName + '</span>' +
            '<div class="flex items-baseline gap-1">' +
              '<span class="font-mono font-bold text-[#171717] hindi-number text-sm">' + formatNumber(val, false) + '</span>' +
              '<span class="text-[9px] text-neutral-400">ضبطية</span>' +
            '</div>' +
          '</div>' +
          '<div class="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">' +
            '<div class="bg-[#171717] h-full rounded-full transition-all duration-500" style="width: ' + pct + '%"></div>' +
          '</div>';
        inspectorsContainer.appendChild(rowDiv);
      });

      // بناء قائمة المنصات
      var platformsContainer = document.getElementById("platforms-list");
      platformsContainer.innerHTML = "";
      var maxPlatformVal = Math.max.apply(null, Object.values(platformsMap)) || 1;

      Object.keys(platformsMap).forEach(function (name) {
        var val = platformsMap[name];
        var pct = (val / maxPlatformVal) * 100;
        var displayName = ASPECT_DISPLAY_NAMES[name] ? ASPECT_DISPLAY_NAMES[name].label : name;

        var rowDiv = document.createElement("div");
        rowDiv.className = "flex items-center justify-between text-xs cursor-pointer " + (ACTIVE_MONTH === "2026" ? "hover:bg-neutral-50 p-1 rounded-md transition-all" : "");
        if (ACTIVE_MONTH === "2026") {
          rowDiv.onclick = function() { openChartModalForAspect(displayName, name, "منصة"); };
        }

        rowDiv.innerHTML = 
          '<div class="flex items-center gap-3 w-4/12">' +
            '<span class="font-semibold text-neutral-700 text-right shrink-0">' + displayName + '</span>' +
          '</div>' +
          '<div class="w-5/12 bg-neutral-100 h-1 rounded-full overflow-hidden mx-2">' +
            '<div class="bg-neutral-800 h-full rounded-full transition-all duration-400" style="width: ' + pct + '%"></div>' +
          '</div>' +
          '<div class="w-3/12 text-left font-mono font-bold text-neutral-800 text-xs hindi-number shrink-0">' +
            formatNumber(val, false) + ' <span class="text-[9px] text-neutral-400">ضب</span>' +
          '</div>';
        platformsContainer.appendChild(rowDiv);
      });

      // بناء شبكة المنشآت المستهدفة
      var facilitiesContainer = document.getElementById("facilities-grid");
      facilitiesContainer.innerHTML = "";
      
      Object.keys(facilitiesMap).forEach(function (name) {
        var val = facilitiesMap[name];
        var displayName = ASPECT_DISPLAY_NAMES[name] ? ASPECT_DISPLAY_NAMES[name].label : name;
        var unitLabel = name === "صيدلية" ? "صيدلية" : name === "مخزن" ? "مخزن" : name === "عيادة" ? "عيادة" : "مصنع";

        var gridDiv = document.createElement("div");
        gridDiv.className = "bg-neutral-50/70 border border-neutral-100 rounded-xl p-3 text-right flex flex-col justify-between h-[84px] cursor-pointer hover:bg-neutral-100 transition-all";
        if (ACTIVE_MONTH === "2026") {
          gridDiv.onclick = function() { openChartModalForAspect(displayName, name, "منشأة"); };
        }

        gridDiv.innerHTML = 
          '<span class="text-[10px] font-bold text-neutral-400">' + displayName + '</span>' +
          '<div class="mt-2 text-right">' +
            '<span class="text-xl font-bold font-mono text-neutral-800 block hindi-number">' + formatNumber(val, false) + '</span>' +
            '<span class="text-[9px] text-neutral-400 block -mt-1">' + unitLabel + ' مفحوصة</span>' +
          '</div>';
        facilitiesContainer.appendChild(gridDiv);
      });
    }

    /**
     * إعداد كروت البينتو كعناصر قابلة للنقر لعرض المخطط التفصيلي في وضع "الإجمالي فقط"
     */
    function setupCardClickEvents(cardConfigs) {
      Object.keys(cardConfigs).forEach(function (cardId) {
        var card = document.getElementById(cardId);
        if (!card) return;
        
        if (ACTIVE_MONTH === "2026") {
          card.classList.add("cursor-pointer", "hover:border-[#171717]/40", "ring-1", "ring-transparent", "hover:ring-neutral-200");
          card.onclick = function () {
            var conf = cardConfigs[cardId];
            openChartModalForAspect(conf.title, conf.aspectKey, "مؤشر");
          };
        } else {
          card.classList.remove("cursor-pointer", "hover:border-[#171717]/40", "ring-1", "ring-transparent", "hover:ring-neutral-200");
          card.onclick = null;
        }
      });
    }

    /**
     * فتح المودال وبناء شارت الأعمدة التحليلي الشهري لجانب معين
     */
    function openChartModalForAspect(title, aspectKey, type) {
      document.getElementById("modal-chart-title").innerText = title;
      var modal = document.getElementById("chart-modal");
      modal.classList.remove("hidden");
      setTimeout(function () {
        document.getElementById("modal-container").classList.remove("scale-95");
        document.getElementById("modal-container").classList.add("scale-100");
      }, 50);

      // حساب التوزيع الشهري (١٢ شهراً) لهذا الـ aspectKey
      var monthsDataValues = [];
      MONTHS_RTL.forEach(function (mName) {
        var sum = 0;
        RAW_DATA.forEach(function (row) {
          if (row.date === mName) {
            var matches = false;
            
            // تحقق من المطابقة الدقيقة أو التجميعية المماثلة لحساب المودال
            if (aspectKey === "أدوية جدول") {
              matches = (row.aspect.trim() === "الاتجار بألادوية المخدرة المدرجة جدول اول مخدرات" || row.aspect.trim() === "الاتجار بألادوية المخدرة المدرجة جدول ثالث مخدرات");
            } else if (aspectKey === "عرض ادوية  بدون فواتير مجهولة المصدر") {
              matches = (row.aspect.trim() === "عرض ادوية  بدون فواتير مجهولة المصدر" || row.aspect.trim() === "عرض ادوية بدون فواتير مجهولة المصدر" || row.aspect.trim() === "عرض كميات كبيرة من الادوية بدون فواتير رسمية");
            } else if (aspectKey === "بيع عن طريق بيع إلكتروني") {
              matches = (row.aspect.trim() === "بيع عن طريق تطبيق الكتروني (instashop)" || row.aspect.trim() === "بيع عن طريق تطبيق الكتروني");
            } else {
              matches = (row.aspect.trim() === aspectKey.trim());
            }

            if (matches) {
              sum += Number(row.count) || 0;
            }
          }
        });
        monthsDataValues.push({ month: mName, count: sum });
      });

      var maxCountTemp = Math.max.apply(null, monthsDataValues.map(function(o){return o.count;})) || 1;
      var totalSumTemp = monthsDataValues.reduce(function(a, b){return a + b.count;}, 0);

      document.getElementById("modal-total-count-lbl").innerText = "إجمالي الرقم المجمع خلال السنة: " + formatNumber(totalSumTemp, aspectKey.indexOf("قيمة") !== -1) + " (من أصل 12 شهراً)";

      // بناء المخطط الشريطي التحليلي
      var chartContainer = document.getElementById("bars-chart-container");
      chartContainer.innerHTML = "";

      monthsDataValues.forEach(function (o) {
        var pct = (o.count / maxCountTemp) * 100;
        
        var barCol = document.createElement("div");
        barCol.className = "flex-1 flex flex-col items-center group/bar relative mx-0.5 md:mx-1 h-full justify-end";
        
        barCol.innerHTML = 
          '<!-- بالون التلميح عند التحويم -->' +
          '<div class="absolute bottom-full mb-1 bg-[#171717] text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap font-mono hindi-number">' +
            formatNumber(o.count, false) +
          '</div>' +
          '<!-- شريط العمود آبل -->' +
          '<div class="w-2 md:w-3.5 bg-neutral-200 group-hover/bar:bg-[#171717] rounded-t-sm transition-all duration-700 ease-out" style="height: ' + pct + '%"></div>' +
          '<!-- الحرف الأول من اسم الشهر تلميحياً -->' +
          '<span class="text-[8px] text-neutral-400 mt-1 font-bold">' + o.month.substring(0, 3) + '</span>';
        
        chartContainer.appendChild(barCol);
      });
    }

    function closeModal() {
      document.getElementById("modal-container").classList.add("scale-95");
      document.getElementById("modal-container").classList.remove("scale-100");
      setTimeout(function () {
        document.getElementById("chart-modal").classList.add("hidden");
      }, 200);
    }

    function toggleNumberMode() {
      CHINESE_NUMBER_MODE = !CHINESE_NUMBER_MODE;
      var lbl = document.getElementById("number-toggle-label");
      lbl.innerText = CHINESE_NUMBER_MODE ? "ترجمة الأرقام (١٢٣)" : "ترجمة الأرقام (123)";
      updateDashboard();
    }

    function toggleDropdown(dropdownId) {
      var drop = document.getElementById(dropdownId);
      if (drop.classList.contains("hidden")) {
        // إغلاق أي منسدلة أخرى أولاً
        document.getElementById("print-dropdown").classList.add("hidden");
        document.getElementById("download-dropdown").classList.add("hidden");
        drop.classList.remove("hidden");
      } else {
        drop.classList.add("hidden");
      }
    }

    // إغلاق منسدلات الأزرار عند الضغط في أي مكان خارجي
    window.addEventListener("click", function (e) {
      if (!document.getElementById("print-dropdown-container").contains(e.target)) {
        document.getElementById("print-dropdown").classList.add("hidden");
      }
      if (!document.getElementById("download-dropdown-container").contains(e.target)) {
        document.getElementById("download-dropdown").classList.add("hidden");
      }
    });

    function shareLink() {
      var dummyUrl = window.location.href;
      navigator.clipboard.writeText(dummyUrl).then(function() {
        alert("تم نسخ رابط لوحة البيانات التفاعلية بنجاح إلى الحافظة!");
      }, function() {
        alert("مسار الرابط الإلكتروني لوحدة جرائم الإنترنت: " + dummyUrl);
      });
    }

    function printPage(mode) {
      if (mode === "current") {
        window.print();
      } else {
        // طباعة السنة كاملة: نقوم بإصدار أمر محاكاة لطباعة الـ 13 شهراً متتالية عن طريق إخبار المتصفح بإتاحة ذلك
        alert("لبدء طباعة أو حفظ السنة كاملة بتنسيق PDF (13 صفحة متتالية)، يرجى تحديد وضع الطباعة لصفحات الشيت أو تصديرها من جدول بيانات Google Sheets مباشرة لتكامل رسمي.");
        window.print();
      }
    }
  </script>
</body>
</html>
`;
