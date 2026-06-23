import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Calendar, Tag, Layers, X, Eye, ArrowUpLeft, ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface PortfolioProps {
  currentLang: 'ar' | 'en';
  projects: Project[];
  t: any;
}

export default function Portfolio({ currentLang, projects, t }: PortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const isRtl = currentLang === 'ar';

  const categories = [
    { id: 'all', labelAr: "كافة المشاريع", labelEn: "All Works" },
    { id: 'ui/ux', labelAr: "واجهات UI/UX", labelEn: "UI/UX Design" },
    { id: 'web', labelAr: "تطوير الويب", labelEn: "Web Dev" },
    { id: 'branding', labelAr: "الهويات البصرية", labelEn: "Branding" }
  ];

  // Helper matching filter logically
  const filteredProjects = projects.filter(project => {
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

  return (
    <section id="portfolio" className="relative py-24 sm:py-32 bg-[#040316] overflow-hidden">
      {/* Decorative Shimmers */}
      <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-indigo-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EA580C]/10 text-[#EA580C] mb-4 text-xs font-semibold uppercase tracking-wider border border-[#EA580C]/20"
          >
            <Layers className="w-4 h-4 text-[#EA580C]" />
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
                  ? 'bg-[#EA580C] text-white shadow-lg'
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {isRtl ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Bento/Broken Portfolio Grid */}
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
                  transition={{ duration: 0.4 }}
                  className={`${wrapperClass} relative overflow-hidden rounded-[32px] bg-white/5 border border-white/10 group shadow-xl cursor-pointer hover:border-[#EA580C]/40`}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040316] via-indigo-950/25 to-transparent transition-opacity duration-300"></div>

                  {/* Glowing Accent Border lines */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-[#EA580C]/20 rounded-[32px] transition-all duration-300 pointer-events-none"></div>

                  {/* Corner indicator button */}
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-[#040316]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg hover:bg-[#EA580C]">
                    <Eye className="w-5 h-5" />
                  </div>

                  {/* Explanatory Content Overlay */}
                  <div className={`absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col items-start text-start ${isRtl ? 'rtl' : 'ltr'}`}>
                    
                    {/* Badge Category */}
                    <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/25 rounded-md text-[10px] uppercase font-bold text-indigo-300 mb-3 tracking-wide flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>{isRtl ? project.categoryAr : project.categoryEn}</span>
                    </span>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-orange-400 transition-colors tracking-tight line-clamp-1 mb-2 font-sans">
                      {isRtl ? project.titleAr : project.titleEn}
                    </h3>

                    {/* Short Description */}
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2 max-w-xl">
                      {isRtl ? project.descriptionAr : project.descriptionEn}
                    </p>

                    {/* Metadata: Date and interactive helper */}
                    <div className="flex items-center gap-4 text-[11px] text-gray-400 font-mono">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-orange-400" />
                        <span>{project.date}</span>
                      </div>
                      
                      <button className="text-indigo-300 hover:text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs">
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

        {/* Detailed Modal Overlay */}
        <AnimatePresence>
          {activeProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              id="project-overlay-modal"
              className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative bg-[#1e1b4b]/95 border border-white/10 rounded-[32px] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl backdrop-blur-lg"
                onClick={(e) => e.stopPropagation()}
              >
                
                {/* Hero Showcase Image */}
                <div className="relative h-[240px] sm:h-[350px] w-full">
                  <img
                    src={activeProject.image}
                    referrerPolicy="no-referrer"
                    alt={isRtl ? activeProject.titleAr : activeProject.titleEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b] via-transparent to-black/30"></div>
                  
                  {/* Close button with text */}
                  <button
                    onClick={() => setActiveProject(null)}
                    id="modal-close-btn"
                    className="absolute top-4 right-4 z-25 px-4.5 py-2.5 rounded-full bg-black/70 hover:bg-[#EA580C] border border-white/10 flex items-center gap-2 text-white transition-all cursor-pointer shadow-lg text-xs font-bold uppercase tracking-wider"
                  >
                    <X className="w-4 h-4" />
                    <span>{isRtl ? "رجوع" : "Back"}</span>
                  </button>
                </div>

                {/* Modal Detail Body */}
                <div className={`p-6 sm:p-10 text-start ${isRtl ? 'rtl' : 'ltr'}`}>
                  
                  {/* Metadata line */}
                  <div className="flex flex-wrap items-center gap-3.5 sm:gap-6 text-xs text-gray-400 font-mono mb-6 pb-6 border-b border-white/10">
                    <span className="px-3 py-1 bg-[#EA580C]/15 border border-[#EA580C]/25 rounded-full text-[#EA580C] font-semibold flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-orange-400" />
                      <span>{isRtl ? activeProject.categoryAr : activeProject.categoryEn}</span>
                    </span>

                    <span className="flex items-center gap-1 text-white/70">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span>{t.projectDate} {activeProject.date}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3.5xl font-extrabold text-white font-sans tracking-tight mb-4">
                    {isRtl ? activeProject.titleAr : activeProject.titleEn}
                  </h3>

                  {/* Highlights paragraph */}
                  <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-6 font-medium italic">
                    {isRtl ? activeProject.descriptionAr : activeProject.descriptionEn}
                  </p>

                  {/* Rich Deep Content */}
                  <div className="text-white/70 text-xs sm:text-sm leading-relaxed space-y-4 mb-8">
                    <p>{isRtl ? activeProject.contentAr : activeProject.contentEn}</p>
                  </div>

                  {/* CTA Footer with Back Button and optional Live Link */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mt-4 border-t border-white/10">
                    <button
                      onClick={() => setActiveProject(null)}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                    >
                      {isRtl ? (
                        <>
                          <ArrowRight className="w-4 h-4" />
                          <span>رجوع للأعمال</span>
                        </>
                      ) : (
                        <>
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to Works</span>
                        </>
                      )}
                    </button>

                    {activeProject.link && (
                      <a
                        href={activeProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EA580C] hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{t.visitLive}</span>
                      </a>
                    )}
                  </div>

                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
