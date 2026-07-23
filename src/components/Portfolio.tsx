import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ExternalLink, Calendar, Tag, Layers, X, Eye, ArrowUpLeft, ArrowUpRight,
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Maximize2, Minimize2,
  BookOpen, Monitor, Smartphone, Globe, Puzzle, Box, Star, Users, Download,
  Clock, Zap, CheckCircle2, Code2, ArrowRightLeft, Sparkles
} from 'lucide-react';
import { Project } from '../types';

interface PortfolioProps {
  currentLang: 'ar' | 'en';
  projects: Project[];
  t: any;
}

/* ─────────────────── helpers ─────────────────── */

const productTypeConfig: Record<string, { icon: typeof Monitor; labelAr: string; labelEn: string; color: string }> = {
  system:   { icon: Monitor,    labelAr: 'نظام',     labelEn: 'System',    color: '#6366f1' },
  app:      { icon: Smartphone, labelAr: 'تطبيق',    labelEn: 'App',       color: '#8b5cf6' },
  platform: { icon: Globe,      labelAr: 'منصة',     labelEn: 'Platform',  color: '#f59e0b' },
  website:  { icon: Globe,      labelAr: 'موقع ويب', labelEn: 'Website',   color: '#10b981' },
  plugin:   { icon: Puzzle,     labelAr: 'إضافة',    labelEn: 'Plugin',    color: '#ec4899' },
};

const statusConfig: Record<string, { labelAr: string; labelEn: string; color: string; bg: string }> = {
  live:        { labelAr: 'مباشر',       labelEn: 'Live',        color: '#17c964', bg: 'rgba(23,201,100,0.12)' },
  beta:        { labelAr: 'تجريبي',      labelEn: 'Beta',        color: '#f5a524', bg: 'rgba(245,165,36,0.12)' },
  'coming-soon': { labelAr: 'قريباً',    labelEn: 'Coming Soon', color: '#1c99ed', bg: 'rgba(28,153,237,0.12)' },
  archived:    { labelAr: 'مؤرشف',       labelEn: 'Archived',    color: '#8fa7c2', bg: 'rgba(143,167,194,0.12)' },
};

function getTypeIcon(type?: string) {
  return productTypeConfig[type || 'website']?.icon || Globe;
}

function getTypeLabel(type: string | undefined, isRtl: boolean) {
  const cfg = productTypeConfig[type || 'website'];
  return isRtl ? cfg.labelAr : cfg.labelEn;
}

function getStatusInfo(status: string | undefined, isRtl: boolean) {
  const cfg = statusConfig[status || 'live'];
  return { label: isRtl ? cfg.labelAr : cfg.labelEn, color: cfg.color, bg: cfg.bg };
}

/* ─────────────────── Component ─────────────────── */

export default function Portfolio({ currentLang, projects, t }: PortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isImgExpanded, setIsImgExpanded] = useState<boolean>(false);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number>(0);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const isRtl = currentLang === 'ar';

  /* ── Enhanced categories with product types ── */
  const categories = [
    { id: 'all',      labelAr: 'جميع المنتجات',    labelEn: 'All Products',  icon: Layers },
    { id: 'system',   labelAr: 'الأنظمة',           labelEn: 'Systems',       icon: Monitor },
    { id: 'app',      labelAr: 'التطبيقات',         labelEn: 'Applications',  icon: Smartphone },
    { id: 'platform', labelAr: 'المنصات',           labelEn: 'Platforms',     icon: Globe },
    { id: 'web',      labelAr: 'تطوير الويب',       labelEn: 'Web Dev',       icon: Code2 },
    { id: 'design',   labelAr: 'التصميم',           labelEn: 'Design',        icon: Sparkles },
  ];

  const visibleProjects = projects.filter(project => project.isVisible !== false);

  const filteredProjects = visibleProjects.filter(project => {
    if (selectedCategory === 'all') return true;

    if (selectedCategory === 'system') return project.productType === 'system';
    if (selectedCategory === 'app') return project.productType === 'app';
    if (selectedCategory === 'platform') return project.productType === 'platform';
    if (selectedCategory === 'web') {
      const catEn = (project.categoryEn || '').toLowerCase();
      const catAr = (project.categoryAr || '').toLowerCase();
      return project.productType === 'website' || catEn.includes('web') || catEn.includes('dev') || catAr.includes('تطوير') || catAr.includes('برمج');
    }
    if (selectedCategory === 'design') {
      const catEn = (project.categoryEn || '').toLowerCase();
      const catAr = (project.categoryAr || '').toLowerCase();
      return catEn.includes('ui') || catEn.includes('ux') || catEn.includes('design') || catEn.includes('brand') || catAr.includes('واجه') || catAr.includes('تصميم') || catAr.includes('علام');
    }
    return true;
  });

  /* Featured products */
  const featuredProjects = visibleProjects.filter(p => p.isFeatured);

  const activeIndex = activeProject ? filteredProjects.findIndex(p => p.id === activeProject.id) : -1;

  const handlePrevProject = () => {
    if (filteredProjects.length === 0) return;
    const prevIdx = (activeIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setActiveProject(filteredProjects[prevIdx]);
    setActiveGalleryIdx(0);
  };

  const handleNextProject = () => {
    if (filteredProjects.length === 0) return;
    const nextIdx = (activeIndex + 1) % filteredProjects.length;
    setActiveProject(filteredProjects[nextIdx]);
    setActiveGalleryIdx(0);
  };

  /* Body scroll lock */
  useEffect(() => {
    if (activeProject) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [activeProject]);

  /* Keyboard navigation */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeProject) return;
      if (e.key === 'Escape') {
        setActiveProject(null);
        setIsImgExpanded(false);
      } else if (e.key === 'ArrowLeft') {
        if (isRtl) handleNextProject(); else handlePrevProject();
      } else if (e.key === 'ArrowRight') {
        if (isRtl) handlePrevProject(); else handleNextProject();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProject, filteredProjects, isRtl, activeIndex]);

  /* Reset gallery index when project changes */
  useEffect(() => {
    setActiveGalleryIdx(0);
  }, [activeProject]);

  /* ─────────── Featured Product Hero ─────────── */
  const renderFeaturedHero = () => {
    if (featuredProjects.length === 0) return null;
    const featured = featuredProjects[0];
    const TypeIcon = getTypeIcon(featured.productType);
    const statusInfo = getStatusInfo(featured.status, isRtl);

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mb-16 sm:mb-20 group cursor-pointer"
        onClick={() => setActiveProject(featured)}
      >
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-white/5 via-white/[0.03] to-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
          {/* Background image with heavy overlay */}
          <div className="absolute inset-0">
            <img
              src={featured.image}
              referrerPolicy="no-referrer"
              alt={isRtl ? featured.titleAr : featured.titleEn}
              className="w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#041024] via-[#041024]/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#041024] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 p-8 sm:p-12 lg:p-16">
            {/* Left: Text content */}
            <div className="flex-1 space-y-6 text-center lg:text-start">
              {/* Featured badge */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C99ED]/15 text-[#1C99ED] text-[10px] font-bold uppercase tracking-widest border border-[#1C99ED]/25">
                  <Sparkles className="w-3 h-3" />
                  {isRtl ? 'منتج مميز' : 'Featured Product'}
                </span>
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: statusInfo.color }} />
                  {statusInfo.label}
                </span>
              </div>

              {/* Product type badge */}
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${productTypeConfig[featured.productType || 'website'].color}20` }}>
                  <TypeIcon className="w-4 h-4" style={{ color: productTypeConfig[featured.productType || 'website'].color }} />
                </span>
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                  {getTypeLabel(featured.productType, isRtl)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {isRtl ? featured.titleAr : featured.titleEn}
              </h3>

              {/* Description */}
              <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-2xl">
                {isRtl ? featured.descriptionAr : featured.descriptionEn}
              </p>

              {/* Technologies */}
              {featured.technologies && featured.technologies.length > 0 && (
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  {featured.technologies.slice(0, 6).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/70 hover:bg-white/10 hover:text-white transition-all"
                    >
                      {tech}
                    </span>
                  ))}
                  {featured.technologies.length > 6 && (
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/50">
                      +{featured.technologies.length - 6}
                    </span>
                  )}
                </div>
              )}

              {/* Metrics */}
              {featured.metrics && (
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6">
                  {featured.metrics.users && (
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Users className="w-4 h-4 text-[#1C99ED]" />
                      <span className="text-sm font-bold text-white">{featured.metrics.users}</span>
                      <span className="text-[10px] uppercase tracking-wider">{isRtl ? 'مستخدم' : 'Users'}</span>
                    </div>
                  )}
                  {featured.metrics.rating && (
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-white">{featured.metrics.rating}</span>
                      <span className="text-[10px] uppercase tracking-wider">{isRtl ? 'تقييم' : 'Rating'}</span>
                    </div>
                  )}
                  {featured.metrics.uptime && (
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-bold text-white">{featured.metrics.uptime}</span>
                      <span className="text-[10px] uppercase tracking-wider">{isRtl ? 'وقت التشغيل' : 'Uptime'}</span>
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-hover to-brand-accent text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-accent/20 group-hover:shadow-brand-accent/30 transition-all">
                  {isRtl ? 'استكشف المنتج' : 'Explore Product'}
                  {isRtl ? <ArrowUpLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </span>
              </div>
            </div>

            {/* Right: Preview image card */}
            <div className="relative w-full lg:w-[45%] shrink-0">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/3]">
                <img
                  src={featured.image}
                  referrerPolicy="no-referrer"
                  alt={isRtl ? featured.titleAr : featured.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041024]/60 to-transparent" />
                {/* Gallery preview dots */}
                {featured.gallery && featured.gallery.length > 0 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {[featured.image, ...featured.gallery].slice(0, 4).map((_, idx) => (
                      <span key={idx} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#1C99ED] w-5' : 'bg-white/30'}`} />
                    ))}
                  </div>
                )}
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-brand-accent/5 rounded-3xl blur-2xl -z-10 group-hover:bg-brand-accent/10 transition-all duration-500" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  /* ─────────── Product Card Component ─────────── */
  const ProductCard = ({ project, idx }: { project: Project; idx: number }) => {
    const TypeIcon = getTypeIcon(project.productType);
    const statusInfo = getStatusInfo(project.status, isRtl);
    const accent = project.accentColor || '#1C99ED';
    const isLarge = idx === 0 || idx === 3;
    const isHovered = hoveredCardId === project.id;

    return (
      <motion.div
        key={project.id}
        id={`project-card-${project.id}`}
        layout
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.4, delay: idx * 0.05 }}
        className={`${isLarge ? 'md:col-span-2 col-span-1' : 'col-span-1'} relative overflow-hidden rounded-[28px] bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-white/[0.06] border border-white/10 group shadow-xl cursor-pointer hover:border-white/20 hover:shadow-2xl transition-all duration-500`}
        style={{ '--card-accent': accent } as React.CSSProperties}
        onMouseEnter={() => setHoveredCardId(project.id)}
        onMouseLeave={() => setHoveredCardId(null)}
        onClick={() => setActiveProject(project)}
      >
        {/* ── Image section ── */}
        <div className={`relative overflow-hidden ${isLarge ? 'h-[220px] sm:h-[280px]' : 'h-[200px] sm:h-[240px]'}`}>
          <img
            src={project.image}
            referrerPolicy="no-referrer"
            alt={isRtl ? project.titleAr : project.titleEn}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#041024] via-[#041024]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041024]/30 to-transparent" />

          {/* Top badges row */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
            {/* Product type badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#041024]/70 backdrop-blur-md border border-white/10 text-white">
              <TypeIcon className="w-3.5 h-3.5" style={{ color: accent }} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{getTypeLabel(project.productType, isRtl)}</span>
            </div>

            {/* Status badge */}
            <span
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md border"
              style={{ backgroundColor: statusInfo.bg, color: statusInfo.color, borderColor: `${statusInfo.color}30` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: statusInfo.color }} />
              {statusInfo.label}
            </span>
          </div>

          {/* View button - bottom right */}
          <div className={`absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-[#041024]/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all duration-300 shadow-lg ${isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'} hover:bg-[#1C99ED]`}>
            <Eye className="w-4.5 h-4.5" />
          </div>

          {/* Quick metrics overlay */}
          {project.metrics && (
            <div className={`absolute bottom-4 left-4 flex items-center gap-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              {project.metrics.users && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#041024]/70 backdrop-blur-md border border-white/10 text-[10px] text-white/80">
                  <Users className="w-3 h-3 text-[#1C99ED]" />
                  {project.metrics.users}
                </span>
              )}
              {project.metrics.rating && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#041024]/70 backdrop-blur-md border border-white/10 text-[10px] text-white/80">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {project.metrics.rating}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Content section ── */}
        <div className="p-5 sm:p-6 space-y-3.5">
          {/* Category & Date */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wide border"
              style={{ backgroundColor: `${accent}15`, color: accent, borderColor: `${accent}25` }}>
              <Tag className="w-3 h-3" />
              <span>{isRtl ? project.categoryAr : project.categoryEn}</span>
            </span>
            <span className="flex items-center gap-1 text-[10px] text-white/40 font-mono">
              <Calendar className="w-3 h-3" />
              {project.date}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-[#1C99ED] transition-colors tracking-tight line-clamp-2 leading-snug">
            {isRtl ? project.titleAr : project.titleEn}
          </h3>

          {/* Description */}
          <p className="text-white/50 text-xs sm:text-sm leading-relaxed line-clamp-2">
            {isRtl ? project.descriptionAr : project.descriptionEn}
          </p>

          {/* Technology tags */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, isLarge ? 6 : 4).map((tech, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-mono text-white/50 hover:bg-white/10 hover:text-white/70 transition-all">
                  {tech}
                </span>
              ))}
              {project.technologies.length > (isLarge ? 6 : 4) && (
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-mono text-white/35">
                  +{project.technologies.length - (isLarge ? 6 : 4)}
                </span>
              )}
            </div>
          )}

          {/* Features preview & action */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            {/* Features count */}
            {((project.featuresAr && project.featuresAr.length > 0) || (project.featuresEn && project.featuresEn.length > 0)) && (
              <span className="flex items-center gap-1 text-[10px] text-white/40">
                <CheckCircle2 className="w-3 h-3" style={{ color: accent }} />
                {isRtl
                  ? `${project.featuresAr?.length || 0} ميزة`
                  : `${project.featuresEn?.length || 0} features`}
              </span>
            )}

            {/* Action button */}
            <button className="flex items-center gap-1.5 text-xs font-bold text-[#1C99ED] hover:text-white transition-colors cursor-pointer">
              <span>{isRtl ? 'التفاصيل' : 'Details'}</span>
              {isRtl ? <ArrowUpLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Hover glow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[28px]"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${accent}08 0%, transparent 70%)`
          }}
        />
      </motion.div>
    );
  };

  /* ─────────── Detail Modal ─────────── */
  const renderDetailModal = () => {
    if (!activeProject) return null;
    const TypeIcon = getTypeIcon(activeProject.productType);
    const statusInfo = getStatusInfo(activeProject.status, isRtl);
    const accent = activeProject.accentColor || '#1C99ED';
    const allImages = [activeProject.image, ...(activeProject.gallery || [])];
    const currentImage = allImages[activeGalleryIdx] || activeProject.image;
    const features = isRtl ? (activeProject.featuresAr || []) : (activeProject.featuresEn || []);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        id="project-overlay-modal"
        className="fixed inset-0 z-[60] bg-[#030B1A]/98 backdrop-blur-xl flex flex-col overflow-hidden"
        onClick={() => { setActiveProject(null); setIsImgExpanded(false); }}
      >
        {/* ── Top navigation bar ── */}
        <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5 bg-[#030B1A]/50 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}20` }}>
              <TypeIcon className="w-4 h-4" style={{ color: accent }} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white line-clamp-1">{isRtl ? activeProject.titleAr : activeProject.titleEn}</h4>
              <span className="text-[10px] text-white/40 font-mono">{getTypeLabel(activeProject.productType, isRtl)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Image counter */}
            {allImages.length > 1 && (
              <span className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-white/50">
                {activeGalleryIdx + 1} / {allImages.length}
              </span>
            )}
            <button
              onClick={() => setIsImgExpanded(!isImgExpanded)}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#1C99ED] text-white flex items-center justify-center border border-white/10 hover:border-transparent transition-all cursor-pointer"
            >
              {isImgExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => { setActiveProject(null); setIsImgExpanded(false); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">{isRtl ? 'إغلاق' : 'Close'}</span>
            </button>
          </div>
        </div>

        {/* ── Main content area ── */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden" onClick={(e) => e.stopPropagation()}>

          {/* Left: Image viewer */}
          <div className={`relative flex-1 flex items-center justify-center bg-[#041024] p-4 sm:p-6 transition-all duration-500 ${isImgExpanded ? 'w-full' : 'md:w-[60%]'}`}>
            {/* Main image */}
            <div className="w-full h-full flex items-center justify-center max-w-5xl max-h-[80vh]">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={`${activeProject.id}-${activeGalleryIdx}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  src={currentImage}
                  referrerPolicy="no-referrer"
                  alt={isRtl ? activeProject.titleAr : activeProject.titleEn}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/5 select-none"
                />
              </AnimatePresence>
            </div>

            {/* Gallery navigation arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveGalleryIdx((prev) => (prev - 1 + allImages.length) % allImages.length)}
                  className={`absolute ${isRtl ? 'right-3 sm:right-5' : 'left-3 sm:left-5'} w-10 h-10 rounded-full bg-white/5 hover:bg-[#1C99ED]/80 text-white flex items-center justify-center backdrop-blur-md border border-white/10 hover:border-transparent transition-all cursor-pointer shadow-lg`}
                >
                  {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setActiveGalleryIdx((prev) => (prev + 1) % allImages.length)}
                  className={`absolute ${isRtl ? 'left-3 sm:left-5' : 'right-3 sm:right-5'} w-10 h-10 rounded-full bg-white/5 hover:bg-[#1C99ED]/80 text-white flex items-center justify-center backdrop-blur-md border border-white/10 hover:border-transparent transition-all cursor-pointer shadow-lg`}
                >
                  {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
              </>
            )}

            {/* Project carousel arrows */}
            {filteredProjects.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <button
                  onClick={handlePrevProject}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#1C99ED]/60 text-white/60 hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
                  title={isRtl ? 'المشروع السابق' : 'Previous project'}
                >
                  {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                </button>
                <span className="px-3 py-1 rounded-full bg-black/60 border border-white/5 text-[10px] font-mono text-white/50">
                  {activeIndex + 1} / {filteredProjects.length}
                </span>
                <button
                  onClick={handleNextProject}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#1C99ED]/60 text-white/60 hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
                  title={isRtl ? 'المشروع التالي' : 'Next project'}
                >
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Gallery thumbnails */}
            {!isImgExpanded && allImages.length > 1 && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveGalleryIdx(idx)}
                    className={`w-12 h-9 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${idx === activeGalleryIdx ? 'border-[#1C99ED] scale-110' : 'border-white/10 opacity-50 hover:opacity-80'}`}
                  >
                    <img src={img} referrerPolicy="no-referrer" alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Detail panel */}
          {!isImgExpanded && (
            <motion.div
              initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtl ? -30 : 30 }}
              transition={{ duration: 0.4 }}
              className={`w-full md:w-[40%] lg:w-[35%] h-[45vh] md:h-full bg-[#081B36] border-t md:border-t-0 ${isRtl ? 'md:border-r' : 'md:border-l'} border-white/10 flex flex-col overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`}
            >
              <div className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-6">

                {/* Status + Type + Date */}
                <div className="flex flex-wrap items-center gap-2.5 pb-4 border-b border-white/5">
                  <span
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: statusInfo.color }} />
                    {statusInfo.label}
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-white/60">
                    <TypeIcon className="w-3 h-3" style={{ color: accent }} />
                    {getTypeLabel(activeProject.productType, isRtl)}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-white/40 font-mono">
                    <Calendar className="w-3 h-3" />
                    {activeProject.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                  {isRtl ? activeProject.titleAr : activeProject.titleEn}
                </h3>

                {/* Description */}
                <p className="text-white/60 text-xs sm:text-sm leading-relaxed border-r-2 sm:border-l-0 sm:border-r-0 sm:border-t-2 border-[#1C99ED] pr-3 sm:pr-0 pt-2"
                  style={{ borderColor: accent }}>
                  {isRtl ? activeProject.descriptionAr : activeProject.descriptionEn}
                </p>

                {/* Metrics */}
                {activeProject.metrics && (
                  <div className="grid grid-cols-2 gap-3">
                    {activeProject.metrics.users && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Users className="w-3.5 h-3.5" style={{ color: accent }} />
                          <span className="text-[10px] text-white/40 uppercase tracking-wider">{isRtl ? 'المستخدمين' : 'Users'}</span>
                        </div>
                        <span className="text-lg font-extrabold text-white">{activeProject.metrics.users}</span>
                      </div>
                    )}
                    {activeProject.metrics.rating && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-[10px] text-white/40 uppercase tracking-wider">{isRtl ? 'التقييم' : 'Rating'}</span>
                        </div>
                        <span className="text-lg font-extrabold text-white">{activeProject.metrics.rating}/5</span>
                      </div>
                    )}
                    {activeProject.metrics.uptime && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] text-white/40 uppercase tracking-wider">{isRtl ? 'التشغيل' : 'Uptime'}</span>
                        </div>
                        <span className="text-lg font-extrabold text-white">{activeProject.metrics.uptime}</span>
                      </div>
                    )}
                    {activeProject.metrics.downloads && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Download className="w-3.5 h-3.5" style={{ color: accent }} />
                          <span className="text-[10px] text-white/40 uppercase tracking-wider">{isRtl ? 'التحميلات' : 'Downloads'}</span>
                        </div>
                        <span className="text-lg font-extrabold text-white">{activeProject.metrics.downloads}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Technologies */}
                {activeProject.technologies && activeProject.technologies.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5" style={{ color: accent }} />
                      {isRtl ? 'التقنيات المستخدمة' : 'Tech Stack'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.technologies.map((tech, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono text-white/70 hover:bg-white/10 hover:text-white transition-all">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                {features.length > 0 && (
                  <div className="flex-1 min-h-0">
                    <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: accent }} />
                      {isRtl ? 'الميزات الرئيسية' : 'Key Features'}
                    </h4>
                    <div className="space-y-2">
                      {features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-white/60">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: accent }} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed content */}
                {((isRtl && activeProject.contentAr?.trim()) || (!isRtl && activeProject.contentEn?.trim())) && (
                  <div className="pt-4 border-t border-white/5">
                    <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" style={{ color: accent }} />
                      {isRtl ? 'الوصف التفصيلي' : 'Detailed Overview'}
                    </h4>
                    <p className="text-xs text-white/50 leading-relaxed whitespace-pre-line">
                      {isRtl ? activeProject.contentAr : activeProject.contentEn}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div className="shrink-0 p-5 border-t border-white/5 space-y-3">
                {activeProject.link && (
                  <a
                    href={activeProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer text-center active:scale-[0.98]"
                    style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{t.visitLive}</span>
                  </a>
                )}
                <button
                  onClick={() => { setActiveProject(null); setIsImgExpanded(false); }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                >
                  {isRtl ? 'العودة للمعرض' : 'Back to Gallery'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  /* ─────────── Stats Bar ─────────── */
  const renderStatsBar = () => {
    const totalProducts = visibleProjects.length;
    const liveProducts = visibleProjects.filter(p => p.status === 'live').length;
    const totalUsers = visibleProjects.reduce((sum, p) => {
      const u = p.metrics?.users;
      if (!u) return sum;
      const num = parseFloat(u.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
    const avgRating = visibleProjects.filter(p => p.metrics?.rating).reduce((sum, p, _, arr) => sum + (p.metrics?.rating || 0) / arr.length, 0);

    const stats = [
      { value: totalProducts, labelAr: 'منتج', labelEn: 'Products', icon: Layers, color: '#1C99ED' },
      { value: liveProducts, labelAr: 'مباشر', labelEn: 'Live', icon: Zap, color: '#17c964' },
      { value: `${totalUsers > 1000 ? Math.round(totalUsers / 1000) + 'K+' : totalUsers + '+'}`, labelAr: 'مستخدم نشط', labelEn: 'Active Users', icon: Users, color: '#8b5cf6' },
      { value: avgRating.toFixed(1), labelAr: 'متوسط التقييم', labelEn: 'Avg Rating', icon: Star, color: '#f5a524' },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 sm:mb-16"
      >
        {stats.map((stat, idx) => {
          const IconComp = stat.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}15` }}>
                <IconComp className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-white block leading-none">{stat.value}</span>
                <span className="text-[10px] text-white/40 uppercase tracking-wider">{isRtl ? stat.labelAr : stat.labelEn}</span>
              </div>
            </div>
          );
        })}
      </motion.div>
    );
  };

  /* ─────────── Main Render ─────────── */
  return (
    <section id="portfolio" className="relative py-24 sm:py-32 bg-[#041024] overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-brand-accent/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-brand-primary/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1C99ED]/10 text-[#1C99ED] mb-4 text-xs font-semibold uppercase tracking-widest border border-[#1C99ED]/20"
          >
            <Layers className="w-4 h-4 text-[#1C99ED]" />
            <span>{isRtl ? 'معرض المنتجات' : 'Product Showcase'}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            {isRtl ? 'منتجات رقمية مبنية بشغف وهندسة متقنة' : 'Digital Products Built with Passion & Precision'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 text-white/50 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
          >
            {isRtl
              ? 'استكشف مجموعتنا من الأنظمة والتطبيقات والمنصات الرقمية المتكاملة المصممة بأعلى معايير الجودة والأداء.'
              : 'Explore our collection of integrated digital systems, applications, and platforms designed to the highest standards of quality and performance.'}
          </motion.p>
        </div>

        {/* Stats Bar */}
        {renderStatsBar()}

        {/* Featured Product Hero */}
        {renderFeaturedHero()}

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12 sm:mb-16 max-w-3xl mx-auto">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer ${selectedCategory === cat.id
                    ? 'bg-[#1C99ED] text-white shadow-lg shadow-[#1C99ED]/20'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20'
                  }`}
              >
                <CatIcon className="w-3.5 h-3.5" />
                <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-lg font-bold text-white/70 mb-2">
              {isRtl ? 'لا توجد منتجات في هذا التصنيف' : 'No Products in This Category'}
            </h3>
            <p className="text-sm text-white/50 max-w-sm mx-auto">
              {isRtl
                ? 'جرّب تصنيفاً مختلفاً أو عد لعرض جميع المنتجات.'
                : 'Try a different category or go back to view all products.'}
            </p>
          </div>
        )}

        {/* Product Grid */}
        {filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects
                .filter(p => !p.isFeatured || selectedCategory !== 'all')
                .map((project, idx) => (
                  <ProductCard key={project.id} project={project} idx={idx} />
                ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {activeProject && renderDetailModal()}
      </AnimatePresence>
    </section>
  );
}
