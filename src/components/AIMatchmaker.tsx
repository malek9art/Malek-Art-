import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, Brain, Send, ShieldAlert, Award, FileText, CheckCircle } from 'lucide-react';
import { Project, SiteConfig } from '../types';

interface AIMatchmakerProps {
  currentLang: 'ar' | 'en';
  projects: Project[];
  config: SiteConfig;
  t: any;
}

export default function AIMatchmaker({ currentLang, projects, config, t }: AIMatchmakerProps) {
  const [idea, setIdea] = useState('');
  const [budget, setBudget] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ matchedProjectId: string; approach: string; warning?: string } | null>(null);
  const [error, setError] = useState('');

  // Selected design basics states
  const [serviceType, setServiceType] = useState('landing_page');
  const [colorVibe, setColorVibe] = useState('dark_purple');
  const [designStyle, setDesignStyle] = useState('minimalist');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['bilingual', 'seo', 'motion']);

  // Client Metadata Intake states
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [agreeConsent, setAgreeConsent] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [requestSending, setRequestSending] = useState(false);

  const isRtl = currentLang === 'ar';

  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) {
      setError(t.aiNoInput);
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);
    setIsRequestSent(false);

    try {
      const response = await fetch('/api/matchmaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          budget,
          language: currentLang,
          projects,
          aiCustomPromptAr: config?.aiCustomPromptAr || '',
          aiCustomPromptEn: config?.aiCustomPromptEn || '',
          basics: {
            serviceType,
            colorVibe,
            designStyle,
            features: selectedFeatures
          }
        })
      });

      if (!response.ok) {
        throw new Error('Server network check failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(t.aiError);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim() || !agreeConsent) {
      return;
    }

    setRequestSending(true);

    const newRequest = {
      id: "SD-" + Math.floor(1000 + Math.random() * 9000),
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      projectIdea: idea,
      basics: {
        serviceType,
        colorVibe,
        designStyle,
        features: selectedFeatures
      },
      aiConsultationApproach: result?.approach || '',
      status: 'pending',
      date: new Date().toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      clientNotes: clientNotes.trim()
    };

    try {
      const existingStr = localStorage.getItem('malek_design_requests');
      const existingList = existingStr ? JSON.parse(existingStr) : [];
      existingList.unshift(newRequest);
      localStorage.setItem('malek_design_requests', JSON.stringify(existingList));

      setIsRequestSent(true);
    } catch (err) {
      console.error("Failed to commit smart design request:", err);
    } finally {
      setRequestSending(false);
    }
  };

  // Find the recommended matched project based on API response
  const matchedProject = result ? projects.find(p => p.id === result.matchedProjectId) : null;

  // Custom parser rendering markdown style safely in premium layout
  const renderApproachContent = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('###')) {
        return (
          <h4 key={idx} className="text-lg sm:text-xl font-bold font-sans text-orange-400 mt-6 mb-3 flex items-center gap-1.5 border-b border-indigo-500/10 pb-1.5">
            <CheckCircle className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>{trimmed.replace(/###/g, '').trim()}</span>
          </h4>
        );
      }
      if (trimmed.startsWith('##')) {
        return (
          <h3 key={idx} className="text-xl sm:text-2xl font-black font-sans text-white mt-8 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-orange-500 shrink-0" />
            <span>{trimmed.replace(/##/g, '').trim()}</span>
          </h3>
        );
      }
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        const cleanContent = trimmed.replace(/^[\*\-]\s*/, '').trim();
        // Check for bold notation inside bullet item
        const parts = cleanContent.split('**');
        return (
          <li key={idx} className="list-none flex items-start gap-2.5 text-xs sm:text-sm text-gray-300 mb-2.5 leading-relaxed pl-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0"></span>
            <span>
              {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-semibold">{p}</strong> : p)}
            </span>
          </li>
        );
      }
      if (trimmed.startsWith('1.') || trimmed.startsWith('2.') || trimmed.startsWith('3.') || trimmed.startsWith('4.')) {
        const cleanContent = trimmed.replace(/^\d+\.\s*/, '').trim();
        const parts = cleanContent.split('**');
        return (
          <div key={idx} className="flex gap-3 text-xs sm:text-sm text-gray-300 mb-3.5 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="font-mono text-orange-400 font-bold shrink-0">{trimmed.match(/^\d+/)?.[0]}.</span>
            <span>
              {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-semibold">{p}</strong> : p)}
            </span>
          </div>
        );
      }
      
      // Plain text formatting
      if (!trimmed) return <div key={idx} className="h-2"></div>;
      
      const parts = trimmed.split('**');
      return (
        <p key={idx} className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-3">
          {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-semibold">{p}</strong> : p)}
        </p>
      );
    });
  };

  return (
    <section id="matchmaker" className="relative py-24 sm:py-32 bg-gradient-to-b from-[#040316] to-[#0a0724] overflow-hidden">
      {/* Decorative Shading */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EA580C]/10 text-[#EA580C] mb-4 text-xs font-semibold uppercase tracking-wider border border-[#EA580C]/20"
          >
            <Brain className="w-4 h-4 text-[#EA580C]" />
            <span>{t.navMatchmaker}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            {t.aiSecTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 text-white/70 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed"
          >
            {t.aiSubtitle}
          </motion.p>
        </div>

        {/* Input Formulation Form card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="p-6 sm:p-10 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl relative overflow-hidden"
        >
          {/* Internal Shimmer decoration */}
          <div className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

          <form onSubmit={handleAnalyze} className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`}>
            
            {/* DESIGN BASICS SELECTOR GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
              {/* Service Type */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/90 mb-2">
                  {isRtl ? "۱. نوع التصميم المرغوب" : "1. Desired Service Type"}
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full text-xs rounded-xl bg-black/60 border border-white/10 p-3 text-white focus:outline-none focus:border-[#EA580C] font-semibold cursor-pointer"
                >
                  <option value="landing_page">{isRtl ? "صفحة هبوط إعلانية" : "Promotional Landing Page"}</option>
                  <option value="ecommerce">{isRtl ? "متجر تجارة إلكتروني متكامل" : "E-Commerce Store"}</option>
                  <option value="dashboard">{isRtl ? "لوحة تحكم ونظام مخصص" : "Custom System / Dashboard"}</option>
                  <option value="branding">{isRtl ? "تصميم شعار وهوية بصرية" : "Logo & Brand Identity"}</option>
                  <option value="mobile_app">{isRtl ? "نموذج تطبيق جوال ذكي" : "Mobile App Prototype"}</option>
                </select>
              </div>

              {/* Color Vibe */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/90 mb-2">
                  {isRtl ? "۲. الطابع اللوني والمظهر" : "2. Preferred Color Palette"}
                </label>
                <select
                  value={colorVibe}
                  onChange={(e) => setColorVibe(e.target.value)}
                  className="w-full text-xs rounded-xl bg-black/60 border border-white/10 p-3 text-white focus:outline-none focus:border-[#EA580C] font-semibold cursor-pointer"
                >
                  <option value="dark_purple">{isRtl ? "مظهر كوني داكن (بنفسجي/برتقالي)" : "Cosmic Neon Dark (Purple/Orange)"}</option>
                  <option value="minimal_light">{isRtl ? "تصميم سويسري أبيض ناصع" : "Pure Swiss Off-white"}</option>
                  <option value="botanical">{isRtl ? "ألوان ترابية هادئة (أخضر/بيج)" : "Organic Botanical (Forest/Beige)"}</option>
                  <option value="corporate">{isRtl ? "أزرق شركة وقور ومحترف" : "Corporate Executive Deep Blue"}</option>
                </select>
              </div>

              {/* Design Style */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/90 mb-2">
                  {isRtl ? "۳. التوجه الفني والجمالي" : "3. Artistic Aesthetic"}
                </label>
                <select
                  value={designStyle}
                  onChange={(e) => setDesignStyle(e.target.value)}
                  className="w-full text-xs rounded-xl bg-black/60 border border-white/10 p-3 text-white focus:outline-none focus:border-[#EA580C] font-semibold cursor-pointer"
                >
                  <option value="minimalist">{isRtl ? "مبسط جداً ويركز على المحتوى" : "Pure Minimalist"}</option>
                  <option value="cyber">{isRtl ? "مستقبلي سايبربانك مبهر" : "Futuristic Cyberpunk"}</option>
                  <option value="classy">{isRtl ? "كلاسيكي Serif فخم" : "Classy elegant Serif"}</option>
                  <option value="brutalist">{isRtl ? "عالي التباين وثقيل الأبعاد" : "High Contrast Brutalist"}</option>
                </select>
              </div>
            </div>

            {/* Features checkboxes list */}
            <div className="text-start">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/90 mb-2.5">
                {isRtl ? "٤. حدد الميزات والخصائص المطلوبة في التصميم:" : "4. Desired Functional Implementations:"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'bilingual', labelAr: 'دعم العربية والإنجليزية', labelEn: 'Bilingual Support (AR/EN)' },
                  { id: 'seo', labelAr: 'تهيئة السيو SEO ومحركات البحث', labelEn: 'SEO and speed optimized' },
                  { id: 'motion', labelAr: 'تأثيرات حركية فائقة التجاوب', labelEn: 'Immersive Scroll Motion' },
                  { id: 'dark_mode', labelAr: 'دعم الوضع الداكن التلقائي', labelEn: 'Auto Dark Mode Support' },
                  { id: 'auth', labelAr: 'بوابة تسجيل مستخدمين آمنة', labelEn: 'Secure User Portal Auth' },
                  { id: 'notifications', labelAr: 'إشعارات حية وتنبيهات فورية', labelEn: 'Real-time Push Alerts' },
                ].map((feat) => {
                  const isChecked = selectedFeatures.includes(feat.id);
                  return (
                    <button
                      key={feat.id}
                      type="button"
                      onClick={() => toggleFeature(feat.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs text-start cursor-pointer transition-all duration-300 ${
                        isChecked
                          ? 'bg-indigo-600/15 border-[#EA580C]/40 text-white font-semibold'
                          : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-black/45'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                        isChecked ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-white/20'
                      }`}>
                        {isChecked && "✓"}
                      </span>
                      <span className="truncate">{isRtl ? feat.labelAr : feat.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Project Idea Input */}
            <div className="text-start pt-2">
              <label htmlFor="ai-project-idea" className="block text-[11px] uppercase tracking-wider font-semibold text-white mb-2">
                {isRtl ? "٥. اكتب فكرة مشروعك أو تفاصيل إضافية تريدها من المستشار الذكي:" : "5. Write down your product idea details or add special requests:"}
              </label>
              <textarea
                id="ai-project-idea"
                rows={4}
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder={t.aiPlaceholder}
                className="w-full text-xs rounded-2xl bg-black/40 border border-white/5 p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all leading-relaxed"
              />
            </div>

            {/* Budget options and trigger */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
              <div className="text-start">
                <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-1.5">
                  {t.aiBudgetText}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'low', label: t.aiBudgetLow },
                    { id: 'medium', label: t.aiBudgetMid },
                    { id: 'high', label: t.aiBudgetHigh }
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setBudget(lvl.id)}
                      className={`py-2 px-1 text-[11px] sm:text-xs font-semibold rounded-full border transition-all duration-300 cursor-pointer ${
                        budget === lvl.id
                          ? 'bg-[#EA580C] border-[#EA580C] text-white font-bold'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Trigger */}
              <div className="md:text-end text-center pt-2 md:pt-0">
                <button
                  type="submit"
                  disabled={loading}
                  id="ai-consult-submit-btn"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#ea580c] hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-orange-500/10 cursor-pointer select-none transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  <span>{t.aiSubmitBtn}</span>
                </button>
              </div>
            </div>

            {/* Error boundary feedback */}
            {error && (
              <p className="text-sm font-semibold text-red-400 text-center mt-4">
                {error}
              </p>
            )}

          </form>

        </motion.div>

        {/* Dynamic Analysis Loading and Results container */}
        <div className="mt-8 transition-all duration-500">
          <AnimatePresence mode="wait">
            
            {/* Loading stage */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 sm:p-12 text-center flex flex-col items-center justify-center bg-indigo-950/15 border border-indigo-500/5 rounded-3xl backdrop-blur-sm"
              >
                {/* Immersive Orbiting Spawns */}
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin"></div>
                  <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-orange-500 animate-ping"></div>
                </div>
                <h4 className="text-white font-bold mb-2 font-sans text-sm sm:text-base animate-pulse">
                  {t.aiAnalyzing}
                </h4>
                <p className="text-xs text-gray-400 max-w-sm font-mono mt-1">
                  Connecting to 'models/gemini-3.5-flash' on the server...
                </p>
              </motion.div>
            )}

            {/* Completed results overlay */}
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Fallback Warning Box */}
                {result.warning && (
                  <div className="flex gap-2.5 p-4 rounded-2xl bg-[#EA580C]/10 border border-[#EA580C]/20 text-[#EA580C] text-xs text-start">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <span>{result.warning}</span>
                  </div>
                )}

                {/* Main analytical report Card */}
                <div className={`p-8 sm:p-10 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl text-start ${isRtl ? 'rtl' : 'ltr'}`}>
                  
                  {/* Decorative badge header */}
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EA580C]/10 border border-[#EA580C]/20 w-fit text-[10px] font-mono font-bold text-[#EA580C] mb-6 uppercase tracking-wider">
                    <Award className="w-4 h-4 text-[#EA580C] animate-pulse" />
                    <span>Gemini AI Consultation Sheet</span>
                  </div>

                  <div className="space-y-4 text-white/90">
                    {renderApproachContent(result.approach)}
                  </div>

                </div>

                {/* Matching Portfolio Showcase Link */}
                {matchedProject && (
                  <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-[#1e1b4b] to-black/40 border border-white/10 text-start ${isRtl ? 'rtl' : 'ltr'}`}
                  >
                    <h4 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-4 font-mono flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-yellow-500 animate-spin" style={{ animationDuration: '4s' }} />
                      <span>{t.aiMatchesHeader}</span>
                    </h4>

                    {/* Integrated Horizontal link item */}
                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                      <img
                        src={matchedProject.image}
                        referrerPolicy="no-referrer"
                        alt={isRtl ? matchedProject.titleAr : matchedProject.titleEn}
                        className="w-full sm:w-40 h-24 object-cover rounded-2xl border border-white/5"
                      />
                      <div className="flex-1 w-full">
                        <span className="text-[10px] bg-[#EA580C]/15 border border-[#EA580C]/25 px-2.5 py-0.5 rounded-full text-[#EA580C] font-semibold uppercase tracking-wider font-mono">
                          {isRtl ? matchedProject.categoryAr : matchedProject.categoryEn}
                        </span>
                        
                        <h3 className="text-lg sm:text-xl font-bold text-white mt-2 mb-1">
                          {isRtl ? matchedProject.titleAr : matchedProject.titleEn}
                        </h3>
                        
                        <p className="text-xs text-gray-400 leading-relaxed mb-3">
                          {isRtl ? matchedProject.descriptionAr : matchedProject.descriptionEn}
                        </p>
                        
                        {/* Direct Anchor trigger */}
                        <a
                          href="#portfolio"
                          className="text-xs text-orange-400 hover:text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer w-fit"
                          onClick={() => {
                            // Find and trigger element details
                            const element = document.getElementById(`project-card-${matchedProject.id}`);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                              setTimeout(() => element.click(), 500);
                            }
                          }}
                        >
                          <span>{t.viewProject}</span>
                          {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                        </a>
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* 5. Client Metadata Intake Phase & Confirmation */}
                <div className={`p-8 sm:p-10 rounded-[32px] bg-gradient-to-br from-[#0e0c24] to-[#060413] border border-white/10 shadow-2xl text-start ${isRtl ? 'rtl' : 'ltr'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#EA580C]/10 flex items-center justify-center text-accent">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                        {isRtl ? "✍️ تعبئة البيانات والموافقة على تصميم الخدمة" : "✍️ Contact Verification & Submission"}
                      </h3>
                      <p className="text-[11px] text-white/50 font-sans">
                        {isRtl
                          ? "أدخل بياناتك للتواصل واستكمال الإبداع لتسليم المشروع للمطور ممتلئاً بكافة اختياراتك."
                          : "Verify your contact details to submit this planning report and choices to the developer."}
                      </p>
                    </div>
                  </div>

                  {isRequestSent ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3"
                    >
                      <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                      <h4 className="text-sm font-bold text-white font-sans">
                        {isRtl ? "تم إرسال طلبك بنجاح للمطور!" : "Design Request Submitted Successfully!"}
                      </h4>
                      <p className="text-xs text-white/75 leading-relaxed max-w-lg mx-auto font-sans">
                        {isRtl
                          ? "تم تسجيل خيارات التصميم والبيانات الشخصية وتقرير الذكاء الاصطناعي بنجاح في قاعدة بيانات لوحة التحكم. سيتواصل معك مالك أرت وفريق التطوير قريباً لمباشرة معالجة طلبك!"
                          : "Your custom visual assets, design preferences, and contact details have been registered into the developer's console queue. Malek Art team will follow up within 24 hours!"}
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmitProposal} className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1.5 font-sans">
                            {isRtl ? "الاسم الكامل" : "Full Name"}
                          </label>
                          <input
                            type="text"
                            required
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder={isRtl ? "مثال: عبد الله بن حمد" : "e.g., Jane Done"}
                            className="w-full text-xs rounded-xl bg-black/50 border border-white/10 p-3.5 text-white focus:outline-none focus:border-[#EA580C]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1.5 font-sans">
                            {isRtl ? "البريد الإلكتروني المباشر" : "Direct Email"}
                          </label>
                          <input
                            type="email"
                            required
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            placeholder="username@example.com"
                            className="w-full text-xs rounded-xl bg-black/50 border border-white/10 p-3.5 text-white focus:outline-none focus:border-[#EA580C]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1.5 font-sans">
                            {isRtl ? "رقم الهاتف / الواتساب للتواصل" : "WhatsApp or Mobile Phone"}
                          </label>
                          <input
                            type="tel"
                            required
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            placeholder="+966 ..."
                            className="w-full text-xs rounded-xl bg-black/50 border border-white/10 p-3.5 text-white focus:outline-none focus:border-[#EA580C] text-start font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1.5 font-sans">
                          {isRtl ? "ملاحظات وتوجيهات خاصة إضافية (اختياري)" : "Additional Special Instructions (Optional)"}
                        </label>
                        <textarea
                          rows={2}
                          value={clientNotes}
                          onChange={(e) => setClientNotes(e.target.value)}
                          placeholder={isRtl ? "أضف أي تفاصيل تود من المطور الالتزام بها أثناء المراجعة..." : "Any extra guidelines or constraints..."}
                          className="w-full text-xs rounded-xl bg-black/50 border border-white/10 p-3.5 text-white focus:outline-none focus:border-[#EA580C]"
                        />
                      </div>

                      {/* Consent checkbox */}
                      <div className="flex items-start gap-2.5 bg-black/25 p-3.5 rounded-xl border border-white/5 text-start">
                        <input
                          id="consent-checkbox"
                          type="checkbox"
                          required
                          checked={agreeConsent}
                          onChange={(e) => setAgreeConsent(e.target.checked)}
                          className="mt-1 accent-[#EA580C] cursor-pointer"
                        />
                        <label htmlFor="consent-checkbox" className="text-[11px] text-white/80 cursor-pointer selection:bg-transparent leading-relaxed font-sans">
                          {isRtl
                            ? "أوافق على استكمال معالجة طلب التصميم بواسطة المطور وأقر بدقة الخيارات المحسوبة أعلاه وأفوض فريق العمل للبدء بالخطوات الفنية مع تواصلهم الهاتفي أو الإلكتروني."
                            : "I authorize submitting this design proposal, preferred options, and report to the developer console, agreeing that team will follow up directly."}
                        </label>
                      </div>

                      <div className="text-end pt-2">
                        <button
                          type="submit"
                          disabled={requestSending || !agreeConsent}
                          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-600 hover:opacity-95 text-xs text-white font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/10 cursor-pointer transition-all disabled:opacity-40 font-sans"
                        >
                          {requestSending ? (isRtl ? "جاري تسجيل طلبك..." : "Registering...") : (isRtl ? "موافق وإرسال طلب التصميم للمطور ✓" : "Confirm & Submit Proposal ✓")}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
