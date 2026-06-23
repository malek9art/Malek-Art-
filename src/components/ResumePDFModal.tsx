import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Phone, Mail, MapPin, Globe, Sparkles, User, GraduationCap, Briefcase, Award } from 'lucide-react';
import { Skill, SiteConfig } from '../types';

interface ResumePDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: 'ar' | 'en';
  config: SiteConfig;
  skills: Skill[];
}

export default function ResumePDFModal({ isOpen, onClose, currentLang, config, skills }: ResumePDFModalProps) {
  const [resumeLang, setResumeLang] = useState<'ar' | 'en'>(currentLang);
  const [templateStyle, setTemplateStyle] = useState<'modern' | 'ats'>('modern');
  const isRtl = resumeLang === 'ar';

  const handlePrint = () => {
    const printContents = document.getElementById('printable-resume-node')?.innerHTML;
    if (!printContents) return;

    const originalTitle = document.title;
    document.title = isRtl 
      ? `السيرة_الذاتية_${config.nameAr?.replace(/\s+/g, '_') || 'مالك'}` 
      : `Resume_${config.nameEn?.replace(/\s+/g, '_') || 'Malek'}`;

    // Simple robust print overlay mechanism that guarantees perfect DPI & CSS vectors
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${document.title}</title>
            <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <script src="https://cdn.tailwindcss.com"></script>
            <script>
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      accent: '#ea580c',
                    },
                    fontFamily: {
                      sans: "${isRtl ? 'IBM Plex Sans Arabic' : 'IBM Plex Sans'}, -apple-system, BlinkMacSystemFont, sans-serif"
                    }
                  }
                }
              }
            </script>
            <style>
              body {
                background-color: white;
                color: #111827;
                padding: 40px;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              @page {
                size: A4;
                margin: 20mm;
              }
              @media print {
                body {
                  padding: 0;
                  margin: 0;
                }
                .no-print {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body dir="${isRtl ? 'rtl' : 'ltr'}">
            <div class="max-w-4xl mx-auto p-4 bg-white">
              ${printContents}
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
    
    document.title = originalTitle;
  };

  if (!isOpen) return null;

  // Group skills by category for ATS text rendering
  const skillsByCategory = skills.reduce((acc, skill) => {
    const cat = isRtl ? (skill.categoryAr || 'عام') : (skill.categoryEn || 'General');
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-[#0e0c28] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]"
        >
          {/* Top Panel Actions */}
          <div className="p-6 border-b border-white/10 bg-white/5 flex flex-col gap-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-orange-500 flex items-center justify-center">
                  <Printer className="w-5 h-5 text-white" />
                </div>
                <div className="text-start">
                  <h3 className="text-base font-bold text-white font-sans">
                    {currentLang === 'ar' ? 'معاينة السيرة الذاتية المهنية' : 'Professional Resume Viewer'}
                  </h3>
                  <p className="text-[11px] text-white/50">
                    {currentLang === 'ar' ? 'استخراج ذكي متزامن للطباعة بصيغة PDF عالية الجودة' : 'Dynamic synced builder supporting modern and classic models'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 font-sans">
                {/* Language Switch */}
                <div className="bg-black/40 p-1 rounded-full border border-white/10 flex text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setResumeLang('ar')}
                    className={`px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                      resumeLang === 'ar' ? 'bg-orange-500 text-white shadow-md' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    العربية
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeLang('en')}
                    className={`px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                      resumeLang === 'en' ? 'bg-orange-500 text-white shadow-md' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                </div>

                {/* Print button */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-lg flex items-center gap-1.5 hover:scale-102 active:scale-98"
                >
                  <Printer className="w-4 h-4" />
                  <span>{currentLang === 'ar' ? 'تصدير وحفظ PDF' : 'Print / Save PDF'}</span>
                </button>

                {/* Close modal */}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Template layout switcher sub-bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 font-sans">
              <span className="text-xs text-white/70 font-semibold">
                {currentLang === 'ar' ? 'نمط وقالب الواجهة:' : 'Select Template Style:'}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTemplateStyle('modern')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer border transition-all ${
                    templateStyle === 'modern'
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🎨 {currentLang === 'ar' ? 'تصميم جمالي عصري' : 'Arts Aesthetic'}
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateStyle('ats')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer border transition-all ${
                    templateStyle === 'ats'
                      ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🚀 {currentLang === 'ar' ? 'نظام ATS متوافق' : 'ATS-Optimized'}
                </button>
              </div>
            </div>
          </div>

          {/* Core scrollable review background wrapper */}
          <div className="p-8 overflow-y-auto flex-1 bg-white select-text text-gray-900 border-x border-white/5" dir={isRtl ? "rtl" : "ltr"}>
            
            <div id="printable-resume-node" className="w-full text-start text-slate-800 font-sans">
              {templateStyle === 'modern' ? (
                /* ==================== STYLE: MODERN ARTISTIC ==================== */
                <div className="space-y-8">
                  {/* Decorative Banner/Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                      {config.profileImg && (
                        <div className="relative group shrink-0">
                          <img
                            src={config.profileImg}
                            referrerPolicy="no-referrer"
                            alt="Avatar"
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-orange-500/20 shadow-md"
                          />
                          <div className="absolute inset-0 rounded-2xl border border-black/5"></div>
                        </div>
                      )}
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                          {isRtl ? (config.nameAr || "المهندس مالك أحمد") : (config.nameEn || "Malek Ahmed")}
                        </h1>
                        <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider mt-1.5">
                          {isRtl ? (config.professionAr || "مصمم ومطور تفاعلي") : (config.professionEn || "UI/UX & Web Dev Artist")}
                        </p>
                      </div>
                    </div>

                    {/* Contact Elements */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 w-full md:w-auto shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span className="font-mono">{config.resumePhone || "+966 50 000 0000"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span className="font-mono">{config.resumeEmail || "malikalwesabi@gmail.com"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:col-span-2">
                        <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span>{config.resumeLocation || "الرياض، المملكة العربية السعودية"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Splitting */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Main (8 columns) */}
                    <div className="lg:col-span-7 space-y-6">
                      {/* Summary Block */}
                      <div className="space-y-2">
                        <h3 className="text-sm uppercase tracking-wider font-extrabold text-slate-900 border-b-2 border-orange-500 pb-1 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-orange-600" />
                          <span>{isRtl ? "الملخص المهني" : "Professional Summary"}</span>
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line text-justify">
                          {isRtl ? (config.resumeSummaryAr || config.aboutTextAr) : (config.resumeSummaryEn || config.aboutTextEn)}
                        </p>
                      </div>

                      {/* Experience Block */}
                      <div className="space-y-2">
                        <h3 className="text-sm uppercase tracking-wider font-extrabold text-slate-900 border-b-2 border-orange-500 pb-1 flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-orange-600" />
                          <span>{isRtl ? "الخبرات والمسار المهني" : "Career Milestones & Experience"}</span>
                        </h3>
                        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pl-1 antialiased space-y-1">
                          {isRtl ? config.resumeExperienceAr : config.resumeExperienceEn}
                        </div>
                      </div>

                      {/* Education Block */}
                      <div className="space-y-2">
                        <h3 className="text-sm uppercase tracking-wider font-extrabold text-slate-900 border-b-2 border-orange-500 pb-1 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-orange-600" />
                          <span>{isRtl ? "المؤهلات العلمية والدراسة" : "Specialized Education & Credentials"}</span>
                        </h3>
                        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pl-1 space-y-1">
                          {isRtl ? config.resumeEducationAr : config.resumeEducationEn}
                        </div>
                      </div>
                    </div>

                    {/* Right Info (5 columns) */}
                    <div className="lg:col-span-5 space-y-6 bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
                      {/* Digital links */}
                      <div>
                        <h3 className="text-xs uppercase tracking-wider font-bold text-slate-800 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-orange-600" />
                          <span>{isRtl ? "قنوات التواصل الرقمية" : "Digital Channels"}</span>
                        </h3>
                        <div className="space-y-2.5 text-xs text-slate-600 select-all">
                          {config.socialGithub && (
                            <div className="flex justify-between items-center bg-white px-3 py-1.5 rounded-lg border border-slate-100">
                              <span className="font-semibold text-slate-500 text-[10px]">GitHub</span>
                              <span className="text-orange-600 font-mono font-medium text-[10px] truncate max-w-[140px]">
                                {config.socialGithub.replace('https://', '')}
                              </span>
                            </div>
                          )}
                          {config.socialLinkedin && (
                            <div className="flex justify-between items-center bg-white px-3 py-1.5 rounded-lg border border-slate-100">
                              <span className="font-semibold text-slate-500 text-[10px]">LinkedIn</span>
                              <span className="text-orange-600 font-mono font-medium text-[10px] truncate max-w-[140px]">
                                {config.socialLinkedin.replace('https://', '')}
                              </span>
                            </div>
                          )}
                          {config.socialTwitter && (
                            <div className="flex justify-between items-center bg-white px-3 py-1.5 rounded-lg border border-slate-100">
                              <span className="font-semibold text-slate-500 text-[10px]">Twitter/X</span>
                              <span className="text-orange-600 font-mono font-medium text-[10px] truncate max-w-[140px]">
                                {config.socialTwitter.replace('https://', '')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Hard skill list with progress sliders */}
                      <div>
                        <h3 className="text-xs uppercase tracking-wider font-bold text-slate-800 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-orange-600" />
                          <span>{isRtl ? "ترسانة المهارات الإبداعية" : "Expertise & Tech Stack"}</span>
                        </h3>
                        <div className="space-y-3.5">
                          {skills.slice(0, 8).map((skill) => (
                            <div key={skill.id}>
                              <div className="flex justify-between items-center text-[11px] mb-1 font-semibold">
                                <span className="text-slate-700">{isRtl ? skill.nameAr : skill.nameEn}</span>
                                <span className="text-orange-600 font-mono text-[10px]">{skill.percentage}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-orange-600 rounded-full"
                                  style={{ width: `${skill.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sync disclaimer */}
                      <div className="pt-4 border-t border-slate-200 text-center text-[9px] text-slate-400">
                        {isRtl 
                          ? "تم تصدير هذه الوثيقة آلياً من ملف الإدارة النشط."
                          : "Automatically outputted from local production CMS parameters."
                        }
                      </div>

                    </div>
                  </div>
                </div>
              ) : (
                /* ==================== STYLE: ATS COMPATIBLE (SINGLE COLUMN) ==================== */
                <div className="space-y-6 text-slate-950 font-sans" style={{ fontSize: '12px' }}>
                  {/* ATS strictly uses basic margins & highly readable single column */}
                  
                  {/* Header without photos to avoid bias parsing issues */}
                  <div className="text-center space-y-2 pb-4 border-b border-gray-300">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                      {isRtl ? (config.nameAr || "المهندس مالك أحمد") : (config.nameEn || "Malek Ahmed")}
                    </h1>
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#111827]">
                      {isRtl ? (config.professionAr || "مصمم ومطور تفاعلي") : (config.professionEn || "UI/UX & Web Dev Artist")}
                    </p>
                    
                    {/* Inline lists of contact details (no icons) for fast parsers */}
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-slate-700 font-sans">
                      <div>
                        {isRtl ? 'الهاتف: ' : 'Phone: '} 
                        <span className="font-mono">{config.resumePhone || "+966 50 000 0000"}</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div>
                        {isRtl ? 'البريد: ' : 'Email: '} 
                        <span className="font-mono">{config.resumeEmail || "malikalwesabi@gmail.com"}</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div>
                        {isRtl ? 'الموقع: ' : 'Location: '} 
                        <span>{config.resumeLocation || "الرياض، المملكة العربية السعودية"}</span>
                      </div>
                    </div>

                    {/* Links row */}
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-slate-600 font-mono mt-1 pt-1 border-t border-dashed border-gray-200">
                      {config.socialGithub && (
                        <span>GitHub: {config.socialGithub.replace('https://', '')}</span>
                      )}
                      {config.socialLinkedin && (
                        <span>LinkedIn: {config.socialLinkedin.replace('https://', '')}</span>
                      )}
                    </div>
                  </div>

                  {/* Summary Block */}
                  <div className="space-y-1.5">
                    <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 border-b border-gray-400 pb-0.5 uppercase tracking-wide">
                      {isRtl ? "الملخص المهني والتمهيدي" : "Professional Summary"}
                    </h2>
                    <p className="text-xs text-slate-800 leading-relaxed text-justify whitespace-pre-line">
                      {isRtl ? (config.resumeSummaryAr || config.aboutTextAr) : (config.resumeSummaryEn || config.aboutTextEn)}
                    </p>
                  </div>

                  {/* Experience Section */}
                  <div className="space-y-1.5">
                    <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 border-b border-gray-400 pb-0.5 uppercase tracking-wide">
                      {isRtl ? "الخبرات والمسار المهني" : "Professional Experience"}
                    </h2>
                    <div className="text-xs text-slate-800 leading-relaxed space-y-2 whitespace-pre-line text-justify pl-1">
                      {isRtl ? config.resumeExperienceAr : config.resumeExperienceEn}
                    </div>
                  </div>

                  {/* Education Section */}
                  <div className="space-y-1.5">
                    <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 border-b border-gray-400 pb-0.5 uppercase tracking-wide">
                      {isRtl ? "المؤهلات العلمية والدراسة" : "Education & Credentials"}
                    </h2>
                    <div className="text-xs text-slate-800 leading-relaxed space-y-2 whitespace-pre-line pl-1">
                      {isRtl ? config.resumeEducationAr : config.resumeEducationEn}
                    </div>
                  </div>

                  {/* Skills Section formatted as text comma-groups for keyword parsers */}
                  <div className="space-y-1.5">
                    <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 border-b border-gray-400 pb-0.5 uppercase tracking-wide">
                      {isRtl ? "المهارات والترسانة التقنية" : "Skills & Technologies inventory"}
                    </h2>
                    <div className="space-y-1.5 pt-1.5">
                      {Object.entries(skillsByCategory).map(([catName, skList]) => (
                        <div key={catName} className="text-xs text-slate-800 flex flex-wrap gap-1 leading-relaxed">
                          <strong className="text-slate-900">{catName}:</strong>
                          <span>
                            {skList.map(s => `${isRtl ? s.nameAr : s.nameEn} (${s.percentage}%)`).join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clear print page coordinates */}
                  <div className="pt-4 mt-4 border-t border-gray-200 text-[10px] text-center text-slate-500">
                    {isRtl 
                      ? "وثيقة سيرة ذاتية مفهرسة لنظام معالجة طلبات التوظيف ومطابقة للمقاييس العالمية."
                      : "ATS-vetted resume format. Completely sanitized of tables, images, and non-standard symbols."
                    }
                  </div>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
