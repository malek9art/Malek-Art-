import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Calendar, Tag, Layers, X, Eye, ArrowUpLeft, ArrowUpRight, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Maximize2, Minimize2, BookOpen } from 'lucide-react';
import { Project } from '../types';

interface PortfolioProps {
  currentLang: 'ar' | 'en';
  projects: Project[];
  t: any;
}

export default function Portfolio({ currentLang, projects, t }: PortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isImgExpanded, setIsImgExpanded] = useState<boolean>(false);

  const isRtl = currentLang === 'ar';

  const categories = [
    { id: 'all', labelAr: "كافة المشاريع", labelEn: "All Works" },
    { id: 'ui/ux', labelAr: "واجهات UI/UX", labelEn: "UI/UX Design" },
    { id: 'web', labelAr: "تطوير الويب", labelEn: "Web Dev" },
    { id: 'branding', labelAr: "الهويات البصرية", labelEn: "Branding" }
  ];

  // Helper matching filter logically
  // Projects are visible by default for backwards compatibility with older records.
  const visibleProjects = projects.filter(project => project.isVisible !== false);

  const filteredProjects = visibleProjects.filter(project => {
    if (selectedCategory === 'all') return true;
    
    const catEn = project.categoryEn.toLowerCase();
    const catAr = project.categoryAr.toLowerCase();
    const filterId = selectedCategory.toLowerCase();
    
    if (filterId === 'ui/ux') {
      return catEn.includes('ui') || catAr.includes('واجه');
    }
    if (filterId === 'web') {
      return catEn.includes('web') || catEn.includes('dev') || catAr.includes('تطوير') || catAr.includes('برمج');
    }
    if (filterId === 'branding') {
      return catEn.includes('brand') || catAr.includes('علام');
    }
    
    return catEn.includes(filterId) || catAr.includes(filterId);
  });

  const activeIndex = activeProject ? filteredProjects.findIndex(p => p.id === activeProject.id) : -1;

  const handlePrevProject = () => {
    if (filteredProjects.length === 0) return;
    const prevIdx = (activeIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setActiveProject(filteredProjects[prevIdx]);
  };

  const handleNextProject = () => {
    if (filteredProjects.length === 0) return;
    const nextIdx = (activeIndex + 1) % filteredProjects.length;
    setActiveProject(filteredProjects[nextIdx]);
  };

  // Body scroll lock when lightbox is open — prevents background page from scrolling
  useEffect(() => {
    if (activeProject) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [activeProject]);

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

  return (
    <section id="portfolio" className="relative py-24 sm:py-32 bg-[#041024] overflow-hidden">
      {/* Decorative Shimmers */}
      <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-brand-accent/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1C99ED]/10 text-[#1C99ED] mb-4 text-xs font-semibold uppercase tracking-wider border border-[#1C99ED]/20"
          >
            <Layers className="w-4 h-4 text-[#1C99ED]" />
            <span>{t.navPortfolio}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            {isRtl ? "مشاريع صُنعت بشغف وإتقان" : "Stellar Works Gallery"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 text-white/60 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
          >
            {t.portfolioSubtitle}
          </motion.p>
        </div>

        {/* Categories Tab Bar Switcher */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12 sm:mb-16 max-w-md mx-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4.5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#1C99ED] text-white shadow-lg'
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {isRtl ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Empty state when no projects exist */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-lg font-bold text-white/70 mb-2">
              {isRtl ? "لا توجد مشاريع حالياً" : "No Projects Yet"}
            </h3>
            <p className="text-sm text-white/50 max-w-sm mx-auto">
              {isRtl
                ? "لم يتم إضافة أي مشاريع بعد. ستظهر هنا قريباً!"
                : "No projects have been added yet. Check back soon!"}
            </p>
          </div>
        )}

        {/* Bento/Broken Portfolio Grid */}
        {filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => {
              // Bento layout: some items span across 2 columns for a sleek asymmetric design
              const isLarge = idx === 0 || idx === 3;
              const wrapperClass = isLarge 
                ? "md:col-span-2 col-span-1 h-[320px] sm:h-[400px]" 
                : "col-span-1 h-[320px] sm:h-[400px]";

              return (
                <motion.div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className={`${wrapperClass} relative overflow-hidden rounded-[32px] bg-white/5 border border-white/10 group shadow-xl cursor-pointer hover:border-[#1C99ED]/40 hover:shadow-2xl hover:shadow-[#1C99ED]/10 transition-all duration-300`}
                  onClick={() => setActiveProject(project)}
                >
                  {/* Background Showcase Image */}
                  <img
                    src={project.image}
                    referrerPolicy="no-referrer"
                    alt={isRtl ? project.titleAr : project.titleEn}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    loading="lazy"
                  />

                  {/* Deep Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041024] via-navy-900/25 to-transparent transition-opacity duration-300"></div>

                  {/* Glowing Accent Border lines */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-[#1C99ED]/20 rounded-[32px] transition-all duration-300 pointer-events-none"></div>

                  {/* Corner indicator button — always visible for touch devices */}
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-[#041024]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white sm:scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg hover:bg-[#1C99ED]">
                    <Eye className="w-5 h-5" />
                  </div>

                  {/* Explanatory Content Overlay */}
                  <div className={`absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col items-start text-start ${isRtl ? 'rtl' : 'ltr'}`}>
                    
                    {/* Badge Category */}
                    <span className="px-3 py-1 bg-brand-accent/20 border border-brand-accent/25 rounded-md text-[10px] uppercase font-bold text-brand-accent mb-3 tracking-wide flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>{isRtl ? project.categoryAr : project.categoryEn}</span>
                    </span>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-brand-accent transition-colors tracking-tight line-clamp-1 mb-2 font-sans">
                      {isRtl ? project.titleAr : project.titleEn}
                    </h3>

                    {/* Short Description */}
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2 max-w-xl">
                      {isRtl ? project.descriptionAr : project.descriptionEn}
                    </p>

                    {/* Detailed content hint — shown only when rich content exists */}
                    {((isRtl && project.contentAr && project.contentAr.trim()) || (!isRtl && project.contentEn && project.contentEn.trim())) && (
                      <div className="flex items-center gap-1.5 mb-3 text-[10px] sm:text-[11px] text-brand-accent font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <BookOpen className="w-3 h-3" />
                        <span>{isRtl ? "يوجد وصف تفصيلي — اضغط للعرض" : "Detailed description available — tap to view"}</span>
                      </div>
                    )}

                    {/* Metadata: Date and interactive helper */}
                    <div className="flex items-center gap-4 text-[11px] text-gray-400 font-mono">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-accent" />
                        <span>{project.date}</span>
                      </div>
                      
                      <button className="text-brand-accent hover:text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs">
                        <span>{t.viewProject}</span>
                        {isRtl ? <ArrowUpLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        )}

        {/* Detailed Full-Screen Lightbox Modal Overlay */}
        <AnimatePresence>
          {activeProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              id="project-overlay-modal"
              className="fixed inset-0 z-[60] bg-[#030B1A]/98 backdrop-blur-xl flex flex-col md:flex-row overflow-hidden"
              onClick={() => {
                setActiveProject(null);
                setIsImgExpanded(false);
              }}
            >
              {/* Left / Right Carousel Buttons & Main Media Container */}
              <div 
                className={`relative flex-1 flex items-center justify-center bg-[#041024] p-4 transition-all duration-500 ${
                  isImgExpanded ? 'w-full md:w-full' : 'w-full md:w-2/3 lg:w-[70%]'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Floating Top Bar (Controls) */}
                <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-4 pointer-events-none">
                  {/* Toggle Expand / Fullscreen button */}
                  <button
                    onClick={() => setIsImgExpanded(!isImgExpanded)}
                    title={isImgExpanded ? (isRtl ? "عرض التفاصيل" : "Show Details") : (isRtl ? "توسيع الصورة" : "Expand Image")}
                    className="pointer-events-auto w-10 h-10 rounded-full bg-white/10 hover:bg-[#1C99ED] text-white flex items-center justify-center backdrop-blur-md border border-white/10 hover:border-transparent transition-all cursor-pointer shadow-lg"
                  >
                    {isImgExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>

                  {/* Close button */}
                  <button
                    onClick={() => {
                      setActiveProject(null);
                      setIsImgExpanded(false);
                    }}
                    className="pointer-events-auto px-4 py-2 rounded-full bg-white/10 hover:bg-[#1C99ED] text-white flex items-center gap-1.5 backdrop-blur-md border border-white/10 hover:border-transparent transition-all cursor-pointer shadow-lg text-xs font-bold"
                  >
                    <X className="w-4 h-4" />
                    <span>{isRtl ? "إغلاق" : "Close"}</span>
                  </button>
                </div>

                {/* Main high-resolution responsive Image Viewer with motion.img */}
                <div className="w-full h-full flex items-center justify-center max-w-5xl max-h-[85vh] sm:max-h-[90vh]">
                  <AnimatePresence mode="popLayout">
                    <motion.img
                      key={activeProject.id}
                      initial={{ opacity: 0, scale: 0.95, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: -20 }}
                      transition={{ duration: 0.3 }}
                      src={activeProject.image}
                      referrerPolicy="no-referrer"
                      alt={isRtl ? activeProject.titleAr : activeProject.titleEn}
                      className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/5 select-none"
                    />
                  </AnimatePresence>
                </div>

                {/* Floating Navigation Controls (Previous and Next arrows) */}
                {filteredProjects.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevProject}
                      className={`absolute ${isRtl ? 'right-4 sm:right-6' : 'left-4 sm:left-6'} w-12 h-12 rounded-full bg-white/5 hover:bg-[#1C99ED]/80 text-white flex items-center justify-center backdrop-blur-md border border-white/10 hover:border-transparent transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95`}
                      title={isRtl ? "السابق" : "Previous"}
                    >
                      {isRtl ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                    </button>
                    <button
                      onClick={handleNextProject}
                      className={`absolute ${isRtl ? 'left-4 sm:left-6' : 'right-4 sm:right-6'} w-12 h-12 rounded-full bg-white/5 hover:bg-[#1C99ED]/80 text-white flex items-center justify-center backdrop-blur-md border border-white/10 hover:border-transparent transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95`}
                      title={isRtl ? "التالي" : "Next"}
                    >
                      {isRtl ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </button>
                  </>
                )}

                {/* Image counter indicator at the bottom */}
                {filteredProjects.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 border border-white/5 backdrop-blur-sm text-[11px] font-mono text-white/60 tracking-wider">
                    {activeIndex + 1} / {filteredProjects.length}
                  </div>
                )}
              </div>

              {/* Sidebar Detail Info Panel (collapsible based on isImgExpanded state) */}
              {!isImgExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`w-full md:w-1/3 lg:w-[30%] h-[52vh] md:h-full bg-[#081B36] border-t md:border-t-0 md:border-l border-white/10 flex flex-col max-h-none overflow-hidden ${
                    isRtl ? 'md:border-r md:border-l-0 border-white/10 text-right rtl' : 'text-left ltr'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 sm:p-8 flex flex-col h-full overflow-y-auto overscroll-contain">
                    {/* Category and Date Tag line */}
                    <div className="flex flex-wrap items-center gap-3 text-xs mb-6 pb-4 border-b border-white/5">
                      <span className="px-3 py-1 bg-[#1C99ED]/10 border border-[#1C99ED]/20 rounded-md text-[#1C99ED] font-semibold flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-brand-accent" />
                        <span>{isRtl ? activeProject.categoryAr : activeProject.categoryEn}</span>
                      </span>

                      <span className="flex items-center gap-1.5 text-white/50 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-white/40" />
                        <span>{activeProject.date}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-4 font-sans leading-snug">
                      {isRtl ? activeProject.titleAr : activeProject.titleEn}
                    </h3>

                    {/* Short description with highlighted styling */}
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 italic border-l-2 border-[#1C99ED] pl-3 py-0.5">
                      {isRtl ? activeProject.descriptionAr : activeProject.descriptionEn}
                    </p>

                    {/* Expandable Rich content text block — only shown when content exists */}
                    {((isRtl && activeProject.contentAr && activeProject.contentAr.trim()) || (!isRtl && activeProject.contentEn && activeProject.contentEn.trim())) && (
                      <div className="text-white/60 text-xs sm:text-sm leading-relaxed space-y-4 mb-6 flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1">
                        <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider border-b border-white/10 pb-2 mb-3 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-brand-accent" />
                          <span>{isRtl ? "الوصف التفصيلي" : "Detailed Overview"}</span>
                        </h4>
                        <div className="whitespace-pre-line">
                          {isRtl ? activeProject.contentAr : activeProject.contentEn}
                        </div>
                      </div>
                    )}
                    {(!((isRtl && activeProject.contentAr && activeProject.contentAr.trim()) || (!isRtl && activeProject.contentEn && activeProject.contentEn.trim()))) && (
                      <div className="flex-grow" />
                    )}

                    {/* Actions and Footer buttons */}
                    <div className="pt-5 mt-4 shrink-0 border-t border-white/5 bg-[#081B36] flex flex-col gap-3">
                      {activeProject.link && (
                        <a
                          href={activeProject.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1C99ED] hover:bg-brand-accent text-white text-xs font-bold uppercase tracking-wider shadow-lg active:scale-98 transition-all cursor-pointer text-center"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>{t.visitLive}</span>
                        </a>
                      )}

                      <button
                        onClick={() => {
                          setActiveProject(null);
                          setIsImgExpanded(false);
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                      >
                        {isRtl ? "العودة للمعرض" : "Back to Gallery"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
