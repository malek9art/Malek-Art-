import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import {
  Sparkles, CheckCircle2, Clock, Star, ArrowUpLeft, ArrowUpRight,
  ChevronDown, ChevronUp, Zap, Target, TrendingUp, X, ExternalLink
} from 'lucide-react';
import { Service } from '../types';

interface ServicesProps {
  currentLang: 'ar' | 'en';
  services: Service[];
  t: any;
}

/* ─────────────────── helpers ─────────────────── */

const pricingConfig: Record<string, { labelAr: string; labelEn: string; color: string; bg: string }> = {
  basic:      { labelAr: 'أساسي',    labelEn: 'Basic',      color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  standard:   { labelAr: 'قياسي',    labelEn: 'Standard',   color: '#1C99ED', bg: 'rgba(28,153,237,0.12)' },
  premium:    { labelAr: 'متقدم',    labelEn: 'Premium',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  enterprise: { labelAr: 'مؤسسي',    labelEn: 'Enterprise', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
};

function getPricingInfo(tier: string | undefined, isRtl: boolean) {
  const cfg = pricingConfig[tier || 'standard'];
  return { label: isRtl ? cfg.labelAr : cfg.labelEn, color: cfg.color, bg: cfg.bg };
}

/* ─────────────────── Component ─────────────────── */

export default function Services({ currentLang, services, t }: ServicesProps) {
  const isRtl = currentLang === 'ar';
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [detailService, setDetailService] = useState<Service | null>(null);

  /* Separate popular services for highlight */
  const popularServices = services.filter(s => s.isPopular);
  const allServices = services;

  /* Toggle expanded features */
  const toggleExpand = (id: string) => {
    setExpandedService(expandedService === id ? null : id);
  };

  /* ─────────── Service Detail Modal ─────────── */
  const renderDetailModal = () => {
    if (!detailService) return null;
    const IconComponent = (LucideIcons as any)[detailService.icon] || LucideIcons.Layers;
    const pricingInfo = getPricingInfo(detailService.pricingTier, isRtl);
    const accent = detailService.accentColor || '#1C99ED';
    const features = isRtl ? (detailService.featuresAr || []) : (detailService.featuresEn || []);
    const process = isRtl ? (detailService.processAr || []) : (detailService.processEn || []);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-[#030B1A]/98 backdrop-blur-xl flex flex-col overflow-hidden"
        onClick={() => setDetailService(null)}
      >
        {/* Top bar */}
        <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5 bg-[#030B1A]/50 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}20` }}>
              <IconComponent className="w-5 h-5" style={{ color: accent }} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{isRtl ? detailService.titleAr : detailService.titleEn}</h4>
              <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: pricingInfo.color }}>{pricingInfo.label}</span>
            </div>
          </div>
          <button
            onClick={() => setDetailService(null)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">{isRtl ? 'إغلاق' : 'Close'}</span>
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            
            {/* Hero header */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center" style={{ backgroundColor: `${accent}15`, border: `1px solid ${accent}25` }}>
                <IconComponent className="w-10 h-10" style={{ color: accent }} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{isRtl ? detailService.titleAr : detailService.titleEn}</h2>
              <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                {isRtl ? detailService.descriptionAr : detailService.descriptionEn}
              </p>
            </div>

            {/* Stats row */}
            {detailService.stats && (
              <div className="grid grid-cols-3 gap-4">
                {detailService.stats.projectsCompleted && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <Target className="w-5 h-5 mx-auto mb-2" style={{ color: accent }} />
                    <span className="text-xl font-extrabold text-white block">{detailService.stats.projectsCompleted}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">{isRtl ? 'مشروع مكتمل' : 'Completed'}</span>
                  </div>
                )}
                {detailService.stats.satisfactionRate && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <Star className="w-5 h-5 mx-auto mb-2 text-yellow-400 fill-yellow-400" />
                    <span className="text-xl font-extrabold text-white block">{detailService.stats.satisfactionRate}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">{isRtl ? 'نسبة الرضا' : 'Satisfaction'}</span>
                  </div>
                )}
                {detailService.stats.avgDeliveryDays && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <Clock className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
                    <span className="text-xl font-extrabold text-white block">{detailService.stats.avgDeliveryDays} {isRtl ? 'يوم' : 'days'}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">{isRtl ? 'متوسط التسليم' : 'Avg Delivery'}</span>
                  </div>
                )}
              </div>
            )}

            {/* Deliverables / Features */}
            {features.length > 0 && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: accent }} />
                  {isRtl ? 'المخرجات والdelivrables' : 'Key Deliverables'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-white/70">
                      <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: accent }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Process Steps */}
            {process.length > 0 && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" style={{ color: accent }} />
                  {isRtl ? 'مراحل العمل' : 'Work Process'}
                </h4>
                <div className="space-y-4">
                  {process.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ backgroundColor: accent }}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <span className="text-sm text-white/80">{step}</span>
                        {idx < process.length - 1 && (
                          <div className="w-px h-4 bg-white/10 ml-[-16px] mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            {detailService.technologies && detailService.technologies.length > 0 && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <LucideIcons.Code2 className="w-4 h-4" style={{ color: accent }} />
                  {isRtl ? 'الأدوات والتقنيات' : 'Tools & Technologies'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {detailService.technologies.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-mono text-white/70 hover:bg-white/10 hover:text-white transition-all">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery & Pricing info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {detailService.deliveryTimeAr && (
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}15` }}>
                    <Clock className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block">{isRtl ? 'مدة التسليم' : 'Delivery Time'}</span>
                    <span className="text-lg font-bold text-white">{isRtl ? detailService.deliveryTimeAr : detailService.deliveryTimeEn}</span>
                  </div>
                </div>
              )}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${pricingInfo.bg}` }}>
                  <Zap className="w-6 h-6" style={{ color: pricingInfo.color }} />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block">{isRtl ? 'فئة الخدمة' : 'Service Tier'}</span>
                  <span className="text-lg font-bold" style={{ color: pricingInfo.color }}>{pricingInfo.label}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    );
  };

  /* ─────────── Service Card ─────────── */
  const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
    const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Layers;
    const pricingInfo = getPricingInfo(service.pricingTier, isRtl);
    const accent = service.accentColor || '#1C99ED';
    const features = isRtl ? (service.featuresAr || []) : (service.featuresEn || []);
    const isExpanded = expandedService === service.id;
    const showFeatures = service.featuresAr && service.featuresAr.length > 0;

    return (
      <motion.div
        key={service.id}
        id={`service-card-${service.id}`}
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08, duration: 0.5 }}
        className="group relative overflow-hidden rounded-[28px] bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-white/[0.06] border border-white/10 backdrop-blur-lg hover:border-white/20 shadow-xl transition-all duration-500 flex flex-col"
      >
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${accent}, ${accent}66)` }} />

        <div className="p-6 sm:p-7 flex flex-col flex-1">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                style={{ backgroundColor: `${accent}15`, border: `1px solid ${accent}25` }}
              >
                <IconComponent className="w-5.5 h-5.5" style={{ color: accent }} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-[#1C99ED] transition-colors leading-tight">
                  {isRtl ? service.titleAr : service.titleEn}
                </h3>
                {service.categoryAr && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                    {isRtl ? service.categoryAr : service.categoryEn}
                  </span>
                )}
              </div>
            </div>

            {/* Popular badge */}
            {service.isPopular && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-[9px] font-bold uppercase tracking-wider border border-yellow-500/20 shrink-0">
                <Star className="w-3 h-3 fill-yellow-400" />
                {isRtl ? 'مميزة' : 'Popular'}
              </span>
            )}
          </div>

          {/* Pricing & Delivery row */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: pricingInfo.bg, color: pricingInfo.color }}
            >
              <Zap className="w-3 h-3" />
              {pricingInfo.label}
            </span>
            {service.deliveryTimeAr && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-[10px] text-white/50 border border-white/5">
                <Clock className="w-3 h-3" />
                {isRtl ? service.deliveryTimeAr : service.deliveryTimeEn}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-white/50 text-xs sm:text-sm leading-relaxed mb-4 group-hover:text-white/70 transition-colors">
            {isRtl ? service.descriptionAr : service.descriptionEn}
          </p>

          {/* Stats mini row */}
          {service.stats && (
            <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-white/5">
              {service.stats.projectsCompleted && (
                <span className="flex items-center gap-1 text-[10px] text-white/40">
                  <Target className="w-3 h-3" style={{ color: accent }} />
                  <span className="font-bold text-white/70">{service.stats.projectsCompleted}</span>
                  {isRtl ? 'مشروع' : 'projects'}
                </span>
              )}
              {service.stats.satisfactionRate && (
                <span className="flex items-center gap-1 text-[10px] text-white/40">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-white/70">{service.stats.satisfactionRate}</span>
                  {isRtl ? 'رضا' : 'satisfaction'}
                </span>
              )}
            </div>
          )}

          {/* Technologies preview */}
          {service.technologies && service.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {service.technologies.slice(0, 4).map((tech, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-mono text-white/40">
                  {tech}
                </span>
              ))}
              {service.technologies.length > 4 && (
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-mono text-white/30">
                  +{service.technologies.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Expandable features */}
          {showFeatures && (
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="space-y-2 pt-3 border-t border-white/5">
                    {features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-white/60">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: accent }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Spacer to push footer down */}
          <div className="flex-1" />

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
            {showFeatures && (
              <button
                onClick={() => toggleExpand(service.id)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-white/40 hover:text-white/70 transition-colors cursor-pointer"
              >
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{isExpanded ? (isRtl ? 'إخفاء الميزات' : 'Hide Features') : (isRtl ? `${features.length} ميزة` : `${features.length} Features`)}</span>
              </button>
            )}

            <button
              onClick={() => setDetailService(service)}
              className="flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ml-auto"
              style={{ color: accent }}
            >
              <span>{isRtl ? 'التفاصيل' : 'Details'}</span>
              {isRtl ? <ArrowUpLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[28px]"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent}08 0%, transparent 70%)` }}
        />
      </motion.div>
    );
  };

  /* ─────────── Main Render ─────────── */
  return (
    <section id="services" className="relative py-24 sm:py-32 bg-gradient-to-b from-[#081B36] to-[#041024] overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-brand-primary/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] bg-brand-hover/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1C99ED]/10 text-[#1C99ED] mb-4 text-xs font-semibold uppercase tracking-widest border border-[#1C99ED]/20"
          >
            <Sparkles className="w-4 h-4 text-[#1C99ED]" />
            <span>{isRtl ? 'خدمات رقمية متكاملة' : 'Digital Services Suite'}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            {isRtl ? 'خدمات متميزة لمشاريع رقمية طموحة' : 'Premium Services for Visionary Digital Projects'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 text-white/50 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
          >
            {isRtl
              ? 'حلول رقمية شاملة من الاستشارة والتصميم إلى التطوير والإطلاق، مدعومة بأحدث التقنيات وأفضل الممارسات العالمية.'
              : 'End-to-end digital solutions from consulting and design to development and launch, powered by cutting-edge technologies and global best practices.'}
          </motion.p>
        </div>

        {/* Services Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16"
        >
          {[
            { value: services.length, labelAr: 'خدمة متاحة', labelEn: 'Services', icon: Sparkles, color: '#1C99ED' },
            { value: services.filter(s => s.isPopular).length, labelAr: 'خدمة مميزة', labelEn: 'Popular', icon: Star, color: '#f59e0b' },
            { value: services.reduce((sum, s) => sum + parseInt(s.stats?.projectsCompleted || '0'), 0) + '+', labelAr: 'مشروع مكتمل', labelEn: 'Projects Done', icon: Target, color: '#10b981' },
            { value: '98%+', labelAr: 'نسبة الرضا', labelEn: 'Satisfaction', icon: TrendingUp, color: '#8b5cf6' },
          ].map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}15` }}>
                  <StatIcon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-extrabold text-white block leading-none">{stat.value}</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">{isRtl ? stat.labelAr : stat.labelEn}</span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Empty state */}
        {services.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-lg font-bold text-white/70 mb-2">
              {isRtl ? 'لا توجد خدمات حالياً' : 'No Services Yet'}
            </h3>
            <p className="text-sm text-white/50 max-w-sm mx-auto">
              {isRtl ? 'لم يتم إضافة أي خدمات بعد. ستظهر هنا قريباً!' : 'No services have been added yet. Check back soon!'}
            </p>
          </div>
        )}

        {/* Services Grid */}
        {services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {allServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailService && renderDetailModal()}
      </AnimatePresence>
    </section>
  );
}
