import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Sparkles, User, Brain, Heart } from 'lucide-react';
import { Skill, SiteConfig } from '../types';
import ResumePDFModal from './ResumePDFModal';

interface AboutProps {
  currentLang: 'ar' | 'en';
  config: SiteConfig;
  skills: Skill[];
  t: any;
}

export default function About({ currentLang, config, skills, t }: AboutProps) {
  const isRtl = currentLang === 'ar';
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-[#0a0724] overflow-hidden">
      {/* Glow Ambient Bulbs */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-orange-600/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-600/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent mb-4 text-xs font-semibold uppercase tracking-wider border border-accent/20 font-sans"
          >
            <User className="w-4 h-4 text-accent" />
            <span>{t.aboutSecTitle}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            {isRtl ? "قصة إبداع خلف كل كود" : "A Story of Artistic Engineering"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 text-white/70 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
          >
            {t.aboutSubtitle}
          </motion.p>
        </div>

        {/* Layout Grid: Left text/photo, Right Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Main Visual Profile / Bio (5 columns) */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            
            {/* Elegant Polaroid Glass Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group mx-auto lg:mx-0 max-w-sm sm:max-w-md w-full"
            >
              {/* Decorative Indigo Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-[#EA580C] rounded-[32px] filter blur-md opacity-30 group-hover:opacity-50 transition-all duration-500 scale-102"></div>
              
              <div className="relative overflow-hidden rounded-[32px] bg-white/5 border border-white/10 p-4 backdrop-blur-lg shadow-2xl">
                <img
                  src={config.profileImg || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"}
                  referrerPolicy="no-referrer"
                  alt="Malek Profile Portrait"
                  className="w-full h-[320px] sm:h-[400px] object-cover rounded-2xl shadow-lg border border-white/10 transition-all duration-700"
                />
                
                {/* Visual Glass Tag */}
                <div className="absolute bottom-8 left-8 right-8 p-4 rounded-xl backdrop-blur-lg bg-indigo-950/80 border border-white/10 flex items-center justify-between text-start shadow-xl">
                  <div>
                    <h4 className="text-sm font-bold text-white font-sans">{isRtl ? (config.nameAr || "المهندس مالك أحمد") : (config.nameEn || "Malek Ahmed")}</h4>
                    <p className="text-[11px] text-gray-300 mt-0.5">{isRtl ? (config.professionAr || "مصمم ومطور تفاعلي") : (config.professionEn || "UI/UX & Web Dev Artist")}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center border border-accent/15">
                    <Brain className="w-4.5 h-4.5 text-accent" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Structured Biography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="flex flex-col text-start"
            >
              <h3 className="text-xl sm:text-2xl font-bold font-sans text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent animate-pulse" />
                <span>{isRtl ? "الفلسفة والنهج الإبداعي" : "Creative Philosophy & Approach"}</span>
              </h3>
              
              <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6">
                {currentLang === 'ar' ? config.aboutTextAr : config.aboutTextEn}
              </p>

              {/* Action Buttons: Resume Download */}
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setIsResumeOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider border border-orange-500/20 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>{t.downloadCv}</span>
                </button>
              </div>
            </motion.div>

          </div>

          {/* Interactive Skill bars (6 columns) */}
          <div className="lg:col-span-6 flex flex-col gap-8 text-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="p-8 sm:p-10 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-xl"
            >
              <h3 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4 uppercase tracking-wider text-xs">
                <Sparkles className="w-5 h-5 text-[#818CF8]" />
                <span>{t.aboutSkillsTitle}</span>
              </h3>

              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={skill.id} className="group" id={`about-skill-${skill.id}`}>
                    <div className="flex justify-between items-center text-xs sm:text-sm font-semibold mb-2 uppercase tracking-wide">
                      <span className="text-white/80 group-hover:text-white transition-colors">
                        {isRtl ? skill.nameAr : skill.nameEn}
                      </span>
                      <span className="text-accent font-black font-mono">
                        {skill.percentage}%
                      </span>
                    </div>

                    {/* Glowing Bar frame */}
                    <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 relative p-[1px]">
                      {/* Interactive internal bar with glow */}
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-accent group-hover:from-indigo-400 group-hover:to-accent transition-all relative"
                      >
                        {/* Shimmer pulse inside the progress */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full animate-pulse pointer-events-none"></div>
                      </motion.div>
                    </div>

                    <p className="text-[10px] text-white/50 mt-1.5 uppercase tracking-widest font-mono font-bold">
                      {isRtl ? skill.categoryAr : skill.categoryEn}
                    </p>
                  </div>
                ))}
              </div>

            </motion.div>
          </div>

        </div>

      </div>

      <ResumePDFModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        currentLang={currentLang}
        config={config}
        skills={skills}
      />
    </section>
  );
}
