import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin, Twitter, ArrowUp } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import AIMatchmaker from './components/AIMatchmaker';
import Contact from './components/Contact';
import TestimonialsSpace from './components/TestimonialsSpace';
import AdminPanel from './components/AdminPanel';

import {
  DEFAULT_PROJECTS,
  DEFAULT_SERVICES,
  DEFAULT_SKILLS,
  DEFAULT_STATS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_CONFIG,
  TRANSLATIONS,
} from './data';
import { Project, Service, Skill, ContactMessage, SiteConfig, ClientReview } from './types';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    const cached = localStorage.getItem('malek_lang');
    return (cached === 'ar' || cached === 'en') ? cached : 'ar';
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Core CMS state lists managed on client-side with persistent Local Storage mirroring
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>([]);

  // 1. First-run Seeder & Local Storage Hydrator
  useEffect(() => {
    // Projects hydrate
    const localProj = localStorage.getItem('malek_projects');
    if (localProj) {
      try {
        setProjects(JSON.parse(localProj));
      } catch (e) {
        setProjects(DEFAULT_PROJECTS);
      }
    } else {
      setProjects(DEFAULT_PROJECTS);
      localStorage.setItem('malek_projects', JSON.stringify(DEFAULT_PROJECTS));
    }

    // Services hydrate
    const localServ = localStorage.getItem('malek_services');
    if (localServ) {
      try {
        setServices(JSON.parse(localServ));
      } catch (e) {
        setServices(DEFAULT_SERVICES);
      }
    } else {
      setServices(DEFAULT_SERVICES);
      localStorage.setItem('malek_services', JSON.stringify(DEFAULT_SERVICES));
    }

    // Skills hydrate
    const localSkills = localStorage.getItem('malek_skills');
    if (localSkills) {
      try {
        setSkills(JSON.parse(localSkills));
      } catch (e) {
        setSkills(DEFAULT_SKILLS);
      }
    } else {
      setSkills(DEFAULT_SKILLS);
      localStorage.setItem('malek_skills', JSON.stringify(DEFAULT_SKILLS));
    }

    // Reviews hydrate
    const localReviews = localStorage.getItem('malek_client_reviews');
    if (localReviews) {
      try {
        setReviews(JSON.parse(localReviews));
      } catch (e) {
        const preseeded: ClientReview[] = [
          {
            id: "rev-1",
            name: "عبد الله الغامدي - تكنو ريد",
            rating: 5,
            comment: "عمل رائع ومتقن للغاية من المهندس مالك! استطاع ترجمة أفكارنا وصنع لنا موقعاً بهوية ومظهر فني ترك انطباعاً مذهلاً لدى جميع شركائنا وعملائنا.",
            date: "2026-05-18",
            status: 'approved'
          },
          {
            id: "rev-2",
            name: "Sarah Johnson - Healthy Vitality",
            rating: 5,
            comment: "Outstanding professionalism in designing our mobile UI layouts. Malek operates fast, responds quickly, and brought invaluable UX feedback.",
            date: "2026-06-02",
            status: 'approved'
          }
        ];
        setReviews(preseeded);
        localStorage.setItem('malek_client_reviews', JSON.stringify(preseeded));
      }
    } else {
      const preseeded: ClientReview[] = [
        {
          id: "rev-1",
          name: "عبد الله الغامدي - تكنو ريد",
          rating: 5,
          comment: "عمل رائع ومتقن للغاية من المهندس مالك! استطاع ترجمة أفكارنا وصنع لنا موقعاً بهوية ومظهر فني ترك انطباعاً مذهلاً لدى جميع شركائنا وعملائنا.",
          date: "2026-05-18",
          status: 'approved'
        },
        {
          id: "rev-2",
          name: "Sarah Johnson - Healthy Vitality",
          rating: 5,
          comment: "Outstanding professionalism in designing our mobile UI layouts. Malek operates fast, responds quickly, and brought invaluable UX feedback.",
          date: "2026-06-02",
          status: 'approved'
        }
      ];
      setReviews(preseeded);
      localStorage.setItem('malek_client_reviews', JSON.stringify(preseeded));
    }

    // Config hydrate
    const localConf = localStorage.getItem('malek_config');
    if (localConf) {
      try {
        setConfig(JSON.parse(localConf));
      } catch (e) {
        setConfig(DEFAULT_CONFIG);
      }
    } else {
      setConfig(DEFAULT_CONFIG);
      localStorage.setItem('malek_config', JSON.stringify(DEFAULT_CONFIG));
    }

    // Messages hydrate
    const localMsg = localStorage.getItem('malek_messages');
    if (localMsg) {
      try {
        setMessages(JSON.parse(localMsg));
      } catch (e) {
        setMessages([]);
      }
    } else {
      setMessages([]);
      localStorage.setItem('malek_messages', JSON.stringify([]));
    }
  }, []);

  // 2. RTL direction toggler based on primitive lang value
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('malek_lang', lang);
  }, [lang]);

  // Handle active navigation highlighting on scroll triggers
  useEffect(() => {
    if (isAdminMode) return;

    const sections = ['home', 'about', 'services', 'portfolio', 'matchmaker', 'contact'];
    
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminMode]);

  const handleNewMessage = (msg: ContactMessage) => {
    const updated = [msg, ...messages];
    setMessages(updated);
    localStorage.setItem('malek_messages', JSON.stringify(updated));
  };

  const handleNewReview = (newRev: ClientReview) => {
    const updated = [newRev, ...reviews];
    setReviews(updated);
    localStorage.setItem('malek_client_reviews', JSON.stringify(updated));
  };

  const currentTranslations = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  return (
    <div className={`relative min-h-screen bg-[#07051b] text-white selection:bg-orange-600 selection:text-white ${isRtl ? 'font-sans' : 'font-sans'}`}>
      
      {/* Subtle Animated Grid Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern animate-grid-slow opacity-30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#07051b_85%)] opacity-90"></div>
      </div>

      {/* 1. Navbar */}
      <Navbar
        currentLang={lang}
        setLang={setLang}
        activeSection={activeTab}
        setActiveSection={setActiveTab}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
        t={currentTranslations}
        config={config}
      />

      {/* 2. Main Page Layout Wrapper */}
      <AnimatePresence mode="wait">
        {isAdminMode ? (
          
          /* Admin portal view wrapper */
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <AdminPanel
              currentLang={lang}
              projects={projects}
              setProjects={setProjects}
              services={services}
              setServices={setServices}
              skills={skills}
              setSkills={setSkills}
              reviews={reviews}
              setReviews={setReviews}
              config={config}
              setConfig={setConfig}
              messages={messages}
              setMessages={setMessages}
              isLoggedIn={isAdminLoggedIn}
              setIsLoggedIn={setIsAdminLoggedIn}
              t={currentTranslations}
            />
          </motion.div>
        ) : (
          
          /* Showcase regular landing sections */
          <motion.div
            key="showcase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Sections */}
            {(() => {
              const liveStats = [
                {
                  id: '1',
                  value: config.stat1Value || '+50',
                  labelAr: config.stat1LabelAr || 'مشروع مكتمل',
                  labelEn: config.stat1LabelEn || 'Completed Projects'
                },
                {
                  id: '2',
                  value: config.stat2Value || '+5',
                  labelAr: config.stat2LabelAr || 'سنوات الخبرة الإبداعية',
                  labelEn: config.stat2LabelEn || 'Years of Experience'
                },
                {
                  id: '3',
                  value: config.stat3Value || '100%',
                  labelAr: config.stat3LabelAr || 'رضا العملاء والشغف',
                  labelEn: config.stat3LabelEn || 'Client Satisfaction'
                }
              ];
              return (
                <Hero
                  currentLang={lang}
                  config={config}
                  stats={liveStats}
                  onCtaClick={(secId) => {
                    setActiveTab(secId);
                    const elem = document.getElementById(secId);
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  t={currentTranslations}
                />
              );
            })()}

            <About
              currentLang={lang}
              config={config}
              skills={skills}
              t={currentTranslations}
            />

            <Services
              currentLang={lang}
              services={services}
              t={currentTranslations}
            />

            <Portfolio
              currentLang={lang}
              projects={projects}
              t={currentTranslations}
            />

            <AIMatchmaker
              currentLang={lang}
              projects={projects}
              config={config}
              t={currentTranslations}
            />

            <TestimonialsSpace
              currentLang={lang}
              reviews={reviews}
              onAddReview={handleNewReview}
            />

            <Contact
              currentLang={lang}
              config={config}
              onNewMessage={handleNewMessage}
              t={currentTranslations}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Global Footer */}
      <footer className="bg-[#040212] border-t border-indigo-500/10 pt-16 pb-8 relative z-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-indigo-500/5 text-start">
            
            {/* Logo and brief info */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                {config?.logoImg ? (
                  <img
                    src={config.logoImg}
                    alt="Logo"
                    className="w-10 h-10 object-contain bg-white/5 rounded-xl border border-white/10 p-0.5"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-orange-500 flex items-center justify-center font-mono font-bold text-base text-white shadow-lg">
                    {(config?.logoTextEn || 'Malek')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-lg font-extrabold tracking-widest uppercase bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  {config?.logoTextAr && isRtl ? config.logoTextAr : (config?.logoTextEn || 'MALEK ART')}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                {isRtl 
                  ? (config?.professionAr || "مطور ومصمّم واجهات تفاعلية وخبير تجربة مستخدم.") 
                  : (config?.professionEn || "Interactive UI/UX Developer & Web Art Specialist.")
                }
              </p>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-sm">
                {isRtl 
                  ? "قم بالمزج بين قوة الذكاء الاصطناعي والإبداع البصري لتشييد مشاريع وحلول رقمية فريدة ومؤثرة."
                  : "Bridging the gap between artificial intelligence, aesthetics and advanced frontend tech stacks to build unique solutions."
                }
              </p>
            </div>

            {/* Quick Navigation Links */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-orange-500">
                {isRtl ? "وصول سريع" : "Quick Access"}
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-gray-400">
                {[
                  { id: 'home', label: isRtl ? "الرئيسية" : "Home" },
                  { id: 'about', label: isRtl ? "عن مالك" : "About Me" },
                  { id: 'services', label: isRtl ? "الخدمات" : "Services" },
                  { id: 'portfolio', label: isRtl ? "معرض الأعمال" : "Portfolio" },
                  { id: 'matchmaker', label: isRtl ? "مستشار التصميم الذكي" : "AI Consultant" },
                  { id: 'contact', label: isRtl ? "اتصل بي" : "Contact Me" }
                ].map((linkItem) => (
                  <button
                    key={linkItem.id}
                    onClick={() => {
                      const element = document.getElementById(linkItem.id);
                      if (element) {
                        const yOffset = -90;
                        const yPos = element.getBoundingClientRect().top + window.scrollY + yOffset;
                        window.scrollTo({ top: yPos, behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-start flex items-center gap-1 group"
                  >
                    <span className="text-orange-500/0 group-hover:text-orange-500 transition-all duration-300">
                      {isRtl ? "←" : "→"}
                    </span>
                    <span>{linkItem.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Social channels / Contact channels */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-indigo-400">
                {isRtl ? "القنوات والشبكات" : "Connected Networks"}
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {config?.socialGithub && (
                  <a
                    href={config.socialGithub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-orange-500/30 hover:scale-105 active:scale-95 transition-all w-9 h-9 flex items-center justify-center cursor-pointer"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4 shrink-0" />
                  </a>
                )}
                {config?.socialLinkedin && (
                  <a
                    href={config.socialLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-orange-500/30 hover:scale-105 active:scale-95 transition-all w-9 h-9 flex items-center justify-center cursor-pointer"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4 shrink-0" />
                  </a>
                )}
                {config?.socialTwitter && (
                  <a
                    href={config.socialTwitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-orange-500/30 hover:scale-105 active:scale-95 transition-all w-9 h-9 flex items-center justify-center cursor-pointer"
                    title="Twitter/X"
                  >
                    <Twitter className="w-4 h-4 shrink-0" />
                  </a>
                )}
              </div>
              <div className="space-y-1 text-[11px] text-gray-500">
                <p>{isRtl ? "الموقع الجغرافي النشط:" : "Current hub:"}</p>
                <p className="text-gray-400">{config?.resumeLocation || "الرياض، المملكة العربية السعودية"}</p>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 text-center sm:text-start">
            
            {/* Copyright rights */}
            <p className="text-xs text-gray-400 font-medium font-medium">
              {isRtl ? currentTranslations.footerRights : currentTranslations.footerRightsEn}
            </p>

            {/* Back to top button */}
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-gray-400 hover:text-white text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer max-w-max select-none shadow-md"
            >
              <span>{isRtl ? "العودة للأعلى" : "Back to top"}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>
      </footer>

    </div>
  );
}
