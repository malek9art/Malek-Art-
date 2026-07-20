import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Code, Palette, Trophy, Terminal, Laptop, ShieldCheck, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Stat, SiteConfig } from '../types';

interface HeroProps {
  currentLang: 'ar' | 'en';
  config: SiteConfig;
  stats: Stat[];
  onCtaClick: (sectionId: string) => void;
  t: any;
}

export default function Hero({ currentLang, config, stats, onCtaClick, t }: HeroProps) {
  const isRtl = currentLang === 'ar';
  const [wordIdx, setWordIdx] = useState(0);

  // Dynamic greeting words for the high-end text fade-slider
  const greetingWords = isRtl 
    ? ["تطوير واجهات ذكية", "تجارب رقمية استثنائية", "هندسة برمجية متكاملة", "تصاميم تعبيرية ساحرة"]
    : ["Smart Interfaces", "Exceptional User Experience", "Solid Software Architectures", "Stunning Aesthetic Concepts"];

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % greetingWords.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [greetingWords.length]);

  return (
    <section 
      id="home" 
      className="relative min-h-[110vh] pt-32 pb-20 flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-[#1E1B4B] via-[#0d0a27] to-[#040212]"
    >
      {/* Visual Ambient Background Shaders/Glows */}
      {config.heroBgImg ? (
        <div className="absolute inset-0 w-full h-full opacity-40 pointer-events-none z-0">
          <img
            src={config.heroBgImg}
            alt="Hero Backdrop"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E1B4B]/70 via-[#0d0a27]/90 to-[#040212]"></div>
        </div>
      ) : (
        <div className="absolute top-0 left-0 w-full h-full opacity-25 pointer-events-none">
          <div className="absolute top-[-100px] left-[-100px] w-[700px] h-[700px] bg-[#4F46E5] rounded-full filter blur-[130px] opacity-40"></div>
          <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-[#EA580C] rounded-full filter blur-[130px] opacity-30"></div>
        </div>
      )}

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      {/* Futuristic visual star dots particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden font-mono text-[10px] text-indigo-500/10 hidden lg:block select-none">
        <span className="absolute top-1/4 left-10">01001101 01000001 01001100 01000101 01001011</span>
        <span className="absolute top-1/3 right-12">ART & TECH SYNERGY CODE_</span>
        <span className="absolute bottom-1/4 left-20">LATENCY: 12MS // STABLE_SYS</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Core Content Grid for Spectacular Dual Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center justify-center min-h-[70vh]">
          
          {/* Left / Main text block column (7 columns) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-start space-y-6">
            
            {/* Intro Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 shadow-xl backdrop-blur-md select-none"
            >
              <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="font-mono tracking-widest text-[9px] sm:text-[10px] uppercase text-white/90">
                {t.heroTitlePrefix} <span className="text-orange-500 font-extrabold">{t.heroTitleName}</span>
              </span>
            </motion.div>

            {/* Main Creative Title */}
            <div className="w-full space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.15] sm:leading-[1.1] tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
              >
                {config.heroTextAr && isRtl ? config.heroTextAr : config.heroTextEn}
              </motion.h1>

              {/* Seamless Dynamic Word Change Box (Perfect fit without jumping layout) */}
              <div className="h-14 sm:h-16 flex items-center justify-center lg:justify-start overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIdx}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 bg-clip-text text-transparent inline-block pb-1"
                  >
                    🚀 {greetingWords[wordIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Subtitle / Context description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-white/70 text-sm sm:text-base max-w-2xl leading-relaxed text-justify lg:text-start"
            >
              {config.heroSubAr && isRtl ? config.heroSubAr : config.heroSubEn}
            </motion.p>

            {/* Direct Interaction CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start w-full sm:w-auto pt-2"
            >
              <button
                type="button"
                onClick={() => onCtaClick('portfolio')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] cursor-pointer group"
              >
                <span>{t.heroCtaWork}</span>
                {isRtl ? (
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                )}
              </button>

              <button
                type="button"
                onClick={() => onCtaClick('contact')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-all duration-300 backdrop-blur-sm active:scale-[0.98] cursor-pointer"
              >
                <span>{t.heroCtaContact}</span>
              </button>
            </motion.div>

          </div>

          {/* Right / Interactive Workspace Console Column (5 columns) */}
          <div className="lg:col-span-5 flex justify-center items-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative w-full max-w-sm sm:max-w-md p-6 rounded-[36px] bg-gradient-to-b from-white/10 to-white/5 border border-white/15 backdrop-blur-xl shadow-2xl overflow-hidden group font-sans"
            >
              {/* Outer light sheen indicator overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-orange-500/5 opacity-80 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>

              {/* Mock Window Terminal Top Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 select-none">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-mono text-white/50 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                  <Terminal className="w-3 h-3 text-orange-500 animate-pulse" />
                  <span>m_ahmed.sh</span>
                </div>
              </div>

              {/* Developer Profile card view */}
              <div className="space-y-4 text-start">
                
                {/* Avatar with Live Connection badge */}
                <div className="flex items-center gap-4">
                  {config.profileImg ? (
                    <div className="relative shrink-0">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-orange-500 to-indigo-600 opacity-60 blur-md group-hover:opacity-100 transition-opacity"></div>
                      <img
                        src={config.profileImg}
                        referrerPolicy="no-referrer"
                        alt="Malek"
                        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/20 shadow-md"
                      />
                      {/* Live availability indicator */}
                      <span className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
                      </span>
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-orange-500 flex items-center justify-center font-bold text-xl text-white border border-white/20 shadow-lg">
                      M
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#EA580C] bg-[#EA580C]/10 px-2.5 py-0.5 rounded-full inline-block">
                      {isRtl ? "متاح للتوظيف" : "Available for Projects"}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                      {isRtl ? (config.nameAr || "المهندس مالك لوجيك") : (config.nameEn || "Malek Ahmed")}
                    </h3>
                    <p className="text-xs text-white/60 font-medium">
                      {isRtl ? (config.professionAr || "مطور ومصمّم واجهات تفاعلية") : (config.professionEn || "UI/UX & Web Developer")}
                    </p>
                  </div>
                </div>

                {/* Simulated Interactive code output block */}
                <div className="p-3 bg-black/45 rounded-2xl border border-white/5 font-mono text-[10px] sm:text-xs text-indigo-200/90 leading-relaxed space-y-1 select-all relative">
                  <span className="absolute top-2 right-2 flex items-center gap-1 text-[8px] bg-white/5 px-2 py-0.5 rounded border border-white/5 text-emerald-400">
                    <Laptop className="w-2.5 h-2.5" />
                    <span>JS Engine v18</span>
                  </span>
                  <div className="text-white/40">// Developer active parameters</div>
                  <div><span className="text-orange-400">const</span> <span className="text-white">skills</span> = [<span className="text-emerald-300">"React"</span>, <span className="text-emerald-300">"TS"</span>, <span className="text-emerald-300">"UX"</span>];</div>
                  <div><span className="text-orange-400">const</span> <span className="text-white">hub</span> = <span className="text-amber-300">"Riyadh, KSA"</span>;</div>
                  <div><span className="text-indigo-400">export default</span> <span className="text-[#EA580C]">CraftingArts</span>;</div>
                </div>

                {/* Soft tags highlights */}
                <div className="space-y-2">
                  <span className="text-[10px] text-white/40 block font-mono select-none">
                    {isRtl ? "محاور التخصص الرقمي:" : "Specialty Areas:"}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { icon: <Cpu className="w-3 h-3 text-orange-500" />, label: isRtl ? "ذكاء اصطناعي" : "AI Services" },
                      { icon: <Laptop className="w-3 h-3 text-indigo-400" />, label: isRtl ? "تطوير ويب" : "Web Architect" },
                      { icon: <ShieldCheck className="w-3 h-3 text-emerald-400" />, label: isRtl ? "نظام موثق" : "Secure Apps" }
                    ].map((badge, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-white text-[10px] font-semibold transition-all select-none"
                      >
                        {badge.icon}
                        <span>{badge.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>

        {/* Bento Stats Highlight Grid at Bottom (Enhanced Grid) */}
        <div className="w-full max-w-5xl mx-auto mt-16 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {stats.map((stat, idx) => {
              // Custom icons for standard statistics indices
              const icons = [
                <Code className="w-6 h-6 text-[#818CF8]" key="ico-code" />,
                <Palette className="w-6 h-6 text-[#EA580C]" key="ico-palette" />,
                <Trophy className="w-6 h-6 text-yellow-500" key="ico-trophy" />
              ];

              return (
                <div
                  key={stat.id}
                  id={`stat-card-${stat.id}`}
                  className="relative overflow-hidden group p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-xl hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center select-none"
                >
                  {/* Soft highlight radial backdrop hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  {/* Decorative Icon Wrapper */}
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {icons[idx] || <Sparkles className="w-6 h-6 text-indigo-400" />}
                  </div>

                  {/* Quantitative Value with digital glow */}
                  <span className="text-4xl sm:text-5xl font-black font-mono text-white mb-2 tracking-tight">
                    {stat.value}
                  </span>
                  
                  {/* Category label */}
                  <span className="text-xs font-semibold text-white/70 max-w-[170px] uppercase tracking-wider">
                    {isRtl ? stat.labelAr : stat.labelEn}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>

      </div>

      {/* Hero Bottom Bounce Indicator */}
      <div 
        onClick={() => onCtaClick('about')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer text-gray-500 hover:text-white transition-colors duration-300 animate-bounce hidden sm:block z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>

    </section>
  );
}
