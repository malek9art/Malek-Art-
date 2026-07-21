import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Service } from '../types';

interface ServicesProps {
  currentLang: 'ar' | 'en';
  services: Service[];
  t: any;
}

export default function Services({ currentLang, services, t }: ServicesProps) {
  const isRtl = currentLang === 'ar';

  return (
    <section id="services" className="relative py-24 sm:py-32 bg-gradient-to-b from-[#0a0724] to-[#040316] overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] bg-orange-600/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EA580C]/10 text-[#EA580C] mb-4 text-xs font-semibold uppercase tracking-wider border border-[#EA580C]/20"
          >
            <LucideIcons.Sparkles className="w-4 h-4 text-[#EA580C]" />
            <span>{t.navServices}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            {isRtl ? "خدمات متميزة للمشاريع الطموحة" : "Dynamic Services for Visionary Tech"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 text-white/70 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
          >
            {t.servicesSubtitle}
          </motion.p>
        </div>

        {/* Empty state when no services exist */}
        {services.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <LucideIcons.Sparkles className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-lg font-bold text-white/70 mb-2">
              {isRtl ? "لا توجد خدمات حالياً" : "No Services Yet"}
            </h3>
            <p className="text-sm text-white/50 max-w-sm mx-auto">
              {isRtl
                ? "لم يتم إضافة أي خدمات بعد. ستظهر هنا قريباً!"
                : "No services have been added yet. Check back soon!"}
            </p>
          </div>
        )}

        {/* Bento/Broken Grid of Services */}
        {services.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {services.map((service, index) => {
            // Resolve Lucide components dynamically based on icon key string
            const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Layers;

            return (
              <motion.div
                key={service.id}
                id={`service-card-${service.id}`}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg hover:border-white/20 shadow-xl transition-all duration-300 flex flex-col items-start text-start"
              >
                {/* Visual Accent Hover Radial Background */}
                <div className="absolute inset-0 bg-radial-gradient(ellipse_at_center,rgba(79,70,229,0.06)_0%,transparent_70%) opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Glowing Corner Indicator */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-500/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Service Icon Box */}
                <div className="w-14 h-14 rounded-2xl bg-[#1e1b4b]/85 border border-white/10 text-[#EA580C] flex items-center justify-center mb-6 shadow-inner group-hover:bg-[#EA580C] group-hover:text-white group-hover:border-[#EA580C] group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(234,88,12,0.4)] transition-all duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors duration-300 font-sans">
                  {isRtl ? service.titleAr : service.titleEn}
                </h3>

                {/* Description */}
                <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-6 group-hover:text-white/80 transition-colors">
                  {isRtl ? service.descriptionAr : service.descriptionEn}
                </p>

                {/* Aesthetic Detail Dots */}
                <div className="mt-auto flex gap-1.5 opacity-50">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span className="w-4 h-1.5 rounded-full bg-[#EA580C] transition-all duration-300 group-hover:w-8"></span>
                </div>

              </motion.div>
            );
          })}
        </div>
        )}

      </div>
    </section>
  );
}
