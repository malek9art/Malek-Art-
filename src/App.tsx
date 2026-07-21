import React, { useState, useEffect, SetStateAction } from 'react';
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
  getProjectsDB, saveProjectDB, deleteProjectDB,
  getServicesDB, saveServiceDB, deleteServiceDB,
  getSkillsDB, saveSkillDB, deleteSkillDB,
  getReviewsDB, saveReviewDB, deleteReviewDB,
  getConfigDB, saveConfigDB,
  getCustomFontDB,
  getMessagesDB, saveMessageDB, deleteMessageDB,
  seedDefaultAdminUser,
  subscribeConfig,
  subscribeProjects,
  subscribeServices,
  subscribeSkills,
  subscribeReviews,
  subscribeMessages,
  subscribeCustomFont
} from './lib/dbService';
import { applyFont, injectCustomFontFaces, CUSTOM_FONT_ID } from './lib/fonts';

import {
  DEFAULT_PROJECTS,
  DEFAULT_SERVICES,
  DEFAULT_SKILLS,
  DEFAULT_STATS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_CONFIG,
  TRANSLATIONS,
} from './data';
import { Project, Service, Skill, ContactMessage, SiteConfig, ClientReview, CustomFontData } from './types';

import { useAuth } from './auth/authContext';

export default function App() {
  const { isAuthenticated } = useAuth();
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    const cached = localStorage.getItem('malek_lang');
    return (cached === 'ar' || cached === 'en') ? cached : 'ar';
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsAdminLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  // Core CMS state lists managed on client-side with persistent Local Storage mirroring
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [customFontData, setCustomFontData] = useState<CustomFontData | null>(null);

  // 1. First-run Seeder & Local Storage Hydrator & Firestore Cloud Sync
  useEffect(() => {
    // Instant local load to guarantee snappy speed
    const localProj = localStorage.getItem('malek_projects');
    if (localProj) {
      try { setProjects(JSON.parse(localProj)); } catch (e) {}
    } else {
      setProjects(DEFAULT_PROJECTS);
    }

    const localServ = localStorage.getItem('malek_services');
    if (localServ) {
      try { setServices(JSON.parse(localServ)); } catch (e) {}
    } else {
      setServices(DEFAULT_SERVICES);
    }

    const localSkills = localStorage.getItem('malek_skills');
    if (localSkills) {
      try { setSkills(JSON.parse(localSkills)); } catch (e) {}
    } else {
      setSkills(DEFAULT_SKILLS);
    }

    const defaultReviews: ClientReview[] = [
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

    const localReviews = localStorage.getItem('malek_client_reviews');
    if (localReviews) {
      try { setReviews(JSON.parse(localReviews)); } catch (e) {}
    } else {
      setReviews(defaultReviews);
    }

    const localConf = localStorage.getItem('malek_config');
    if (localConf) {
      try { setConfig(JSON.parse(localConf)); } catch (e) {}
    } else {
      setConfig(DEFAULT_CONFIG);
    }

    const localMsg = localStorage.getItem('malek_messages');
    if (localMsg) {
      try { setMessages(JSON.parse(localMsg)); } catch (e) {}
    }

    // Background seeder to ensure default values exist in Firestore on first-run.
    const seedDatabase = async () => {
      // Firestore rules restrict writes to authenticated admins. Skip seeding for
      // anonymous visitors entirely — otherwise every visitor generates a burst of
      // permission-denied write errors (and this is why the panel must be logged-in
      // to publish anything).
      if (!isAuthenticated) return;
      try {
        // 1. Seed Config if missing
        const cloudConfig = await getConfigDB();
        if (!cloudConfig) {
          await saveConfigDB(DEFAULT_CONFIG);
        }

        // 2. Seed Projects if missing
        const cloudProj = await getProjectsDB();
        if (!cloudProj || cloudProj.length === 0) {
          for (const proj of DEFAULT_PROJECTS) {
            await saveProjectDB(proj);
          }
        }

        // 3. Seed Services if missing
        const cloudServ = await getServicesDB();
        if (!cloudServ || cloudServ.length === 0) {
          for (const serv of DEFAULT_SERVICES) {
            await saveServiceDB(serv);
          }
        }

        // 4. Seed Skills if missing
        const cloudSkills = await getSkillsDB();
        if (!cloudSkills || cloudSkills.length === 0) {
          for (const sk of DEFAULT_SKILLS) {
            await saveSkillDB(sk);
          }
        }

        // 5. Seed Reviews if missing
        const cloudReviews = await getReviewsDB();
        if (!cloudReviews || cloudReviews.length === 0) {
          for (const rev of defaultReviews) {
            await saveReviewDB(rev);
          }
        }

        // 6. Seed Default Admin
        await seedDefaultAdminUser('malikalwesabi@gmail.com');
      } catch (err) {
        console.warn("[Seeding Notice] Database seeding warning:", err);
      }
    };

    seedDatabase();

    // Set up real-time subscription listeners to sync updates instantly to all devices
    const unsubConfig = subscribeConfig((cloudConfig) => {
      if (cloudConfig) {
        setConfig(cloudConfig);
        localStorage.setItem('malek_config', JSON.stringify(cloudConfig));
      }
    });

    const unsubProjects = subscribeProjects((cloudProj) => {
      if (cloudProj) {
        setProjects(cloudProj);
        localStorage.setItem('malek_projects', JSON.stringify(cloudProj));
      }
    });

    const unsubServices = subscribeServices((cloudServ) => {
      if (cloudServ) {
        setServices(cloudServ);
        localStorage.setItem('malek_services', JSON.stringify(cloudServ));
      }
    });

    const unsubSkills = subscribeSkills((cloudSkills) => {
      if (cloudSkills) {
        setSkills(cloudSkills);
        localStorage.setItem('malek_skills', JSON.stringify(cloudSkills));
      }
    });

    const unsubReviews = subscribeReviews((cloudReviews) => {
      if (cloudReviews) {
        setReviews(cloudReviews);
        localStorage.setItem('malek_client_reviews', JSON.stringify(cloudReviews));
      }
    });

    const unsubMessages = subscribeMessages((cloudMsg) => {
      if (cloudMsg) {
        setMessages(cloudMsg);
        localStorage.setItem('malek_messages', JSON.stringify(cloudMsg));
      }
    });

    // Cleanup subscription listeners on component unmount.
    // Re-runs when auth state changes so that an admin login triggers the one-time
    // first-run seeding (writes require auth per Firestore rules).
    return () => {
      unsubConfig();
      unsubProjects();
      unsubServices();
      unsubSkills();
      unsubReviews();
      unsubMessages();
    };
  }, [isAuthenticated]);

  // Wrapper handlers that update local state instantly, then PERSIST to cloud Firestore.
  // They await the cloud write and return `Promise<boolean>` so callers (e.g. AdminPanel)
  // can show the user the REAL sync result instead of a fake "saved" confirmation.
  // (Previously the cloud sync ran in a fire-and-forget IIFE whose only error handling
  // was console.error — writes could be rejected by Firestore rules while the UI still
  // showed a success message, which made cross-device sync appear broken.)
  const handleSetProjects = async (newProjects: React.SetStateAction<Project[]>): Promise<boolean> => {
    const updated = typeof newProjects === 'function' 
      ? (newProjects as (prev: Project[]) => Project[])(projects) 
      : newProjects;
    
    setProjects(updated);
    localStorage.setItem('malek_projects', JSON.stringify(updated));

    try {
      const deleted = projects.filter(p => !updated.some((u: Project) => u.id === p.id));
      for (const p of deleted) {
        await deleteProjectDB(p.id);
      }
      for (const p of updated) {
        await saveProjectDB(p);
      }
      return true;
    } catch (err) {
      console.error("Firebase sync error on projects:", err);
      return false;
    }
  };

  const handleSetServices = async (newServices: React.SetStateAction<Service[]>): Promise<boolean> => {
    const updated = typeof newServices === 'function' 
      ? (newServices as (prev: Service[]) => Service[])(services) 
      : newServices;
    
    setServices(updated);
    localStorage.setItem('malek_services', JSON.stringify(updated));

    try {
      const deleted = services.filter(s => !updated.some((u: Service) => u.id === s.id));
      for (const s of deleted) {
        await deleteServiceDB(s.id);
      }
      for (const s of updated) {
        await saveServiceDB(s);
      }
      return true;
    } catch (err) {
      console.error("Firebase sync error on services:", err);
      return false;
    }
  };

  const handleSetSkills = async (newSkills: React.SetStateAction<Skill[]>): Promise<boolean> => {
    const updated = typeof newSkills === 'function' 
      ? (newSkills as (prev: Skill[]) => Skill[])(skills) 
      : newSkills;
    
    setSkills(updated);
    localStorage.setItem('malek_skills', JSON.stringify(updated));

    try {
      const deleted = skills.filter(s => !updated.some((u: Skill) => u.id === s.id));
      for (const s of deleted) {
        await deleteSkillDB(s.id);
      }
      for (const s of updated) {
        await saveSkillDB(s);
      }
      return true;
    } catch (err) {
      console.error("Firebase sync error on skills:", err);
      return false;
    }
  };

  const handleSetReviews = async (newReviews: React.SetStateAction<ClientReview[]>): Promise<boolean> => {
    const updated = typeof newReviews === 'function' 
      ? (newReviews as (prev: ClientReview[]) => ClientReview[])(reviews) 
      : newReviews;
    
    setReviews(updated);
    localStorage.setItem('malek_client_reviews', JSON.stringify(updated));

    try {
      const deleted = reviews.filter(r => !updated.some((u: ClientReview) => u.id === r.id));
      for (const r of deleted) {
        await deleteReviewDB(r.id);
      }
      for (const r of updated) {
        await saveReviewDB(r);
      }
      return true;
    } catch (err) {
      console.error("Firebase sync error on reviews:", err);
      return false;
    }
  };

  const handleSetConfig = async (newConfig: React.SetStateAction<SiteConfig>): Promise<boolean> => {
    const updated = typeof newConfig === 'function' 
      ? (newConfig as (prev: SiteConfig) => SiteConfig)(config) 
      : newConfig;
    
    setConfig(updated);
    localStorage.setItem('malek_config', JSON.stringify(updated));

    try {
      await saveConfigDB(updated);
      return true;
    } catch (err) {
      console.error("Firebase sync error on config:", err);
      return false;
    }
  };

  const handleSetMessages = async (newMessages: React.SetStateAction<ContactMessage[]>): Promise<boolean> => {
    const updated = typeof newMessages === 'function' 
      ? (newMessages as (prev: ContactMessage[]) => ContactMessage[])(messages)
      : newMessages;
    
    setMessages(updated);
    localStorage.setItem('malek_messages', JSON.stringify(updated));

    try {
      const deleted = messages.filter(m => !updated.some((u: ContactMessage) => u.id === m.id));
      for (const m of deleted) {
        await deleteMessageDB(m.id);
      }
      for (const m of updated) {
        await saveMessageDB(m);
      }
      return true;
    } catch (err) {
      console.error("Firebase sync error on messages:", err);
      return false;
    }
  };

  // 2. RTL direction toggler based on primitive lang value
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('malek_lang', lang);
  }, [lang]);

  // Load the admin-uploaded custom font (instant from local, then cloud + live).
  useEffect(() => {
    try {
      const saved = localStorage.getItem('malek_custom_font');
      if (saved) {
        const parsed = JSON.parse(saved) as CustomFontData;
        setCustomFontData(parsed);
        injectCustomFontFaces(parsed);
      }
    } catch {}
    getCustomFontDB()
      .then((d) => {
        if (d && d.family) {
          setCustomFontData(d);
          localStorage.setItem('malek_custom_font', JSON.stringify(d));
          injectCustomFontFaces(d);
        }
      })
      .catch(() => {});
    const unsub = subscribeCustomFont((d) => {
      const data = d && d.family ? d : null;
      setCustomFontData(data);
      if (data) localStorage.setItem('malek_custom_font', JSON.stringify(data));
      else localStorage.removeItem('malek_custom_font');
      injectCustomFontFaces(data);
    });
    return () => unsub();
  }, []);

  // Apply the selected global font family (with on-demand Google Fonts injection).
  useEffect(() => {
    const customName =
      config.fontFamily === CUSTOM_FONT_ID
        ? customFontData?.family || config.customFontFamily || ''
        : config.customFontFamily || '';
    applyFont({ fontFamily: config.fontFamily, customFontFamily: customName });
  }, [config.fontFamily, config.customFontFamily, customFontData]);

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
    // Save to Firestore in background (public create is allowed by the rules)
    saveMessageDB(msg).catch(e => console.error("Error saving new message to Firebase:", e));
  };

  const handleNewReview = (newRev: ClientReview) => {
    const updated = [newRev, ...reviews];
    setReviews(updated);
    localStorage.setItem('malek_client_reviews', JSON.stringify(updated));
    // Save to Firestore in background (public create is allowed by the rules)
    saveReviewDB(newRev).catch(e => console.error("Error saving new review to Firebase:", e));
  };

  const currentTranslations = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  return (
    <div className={`relative min-h-screen bg-[#07051b] text-white selection:bg-orange-600 selection:text-white ${isRtl ? 'font-sans' : 'font-sans'}`}>
      
      {/* Subtle Animated Grid Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern animate-grid-slow opacity-30"></div>
        <div className="absolute inset-0 bg-vignette opacity-90"></div>
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
              setProjects={handleSetProjects}
              services={services}
              setServices={handleSetServices}
              skills={skills}
              setSkills={handleSetSkills}
              reviews={reviews}
              setReviews={handleSetReviews}
              config={config}
              setConfig={handleSetConfig}
              messages={messages}
              setMessages={handleSetMessages}
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
                <span className="text-lg font-extrabold tracking-widest uppercase brand-gradient">
                  {(config?.logoTextEn || 'MALEK LOGIC')}
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
                {(() => {
                  // Build a unified list of social links, preferring the socialLinks array
                  // and falling back to individual config properties.
                  const items: { platform: string; url: string; Icon: typeof Github }[] = [];
                  if (config?.socialLinks && config.socialLinks.length > 0) {
                    const iconMap: Record<string, typeof Github> = {};
                    // Dynamically map platform names to icons
                    config.socialLinks.forEach((sl) => {
                      const p = sl.platform.toLowerCase();
                      if (!sl.url || !sl.url.trim()) return; // skip empty URLs
                      if (p.includes('git')) iconMap[sl.id] = Github;
                      else if (p.includes('link')) iconMap[sl.id] = Linkedin;
                      else iconMap[sl.id] = Twitter;
                      items.push({ platform: sl.platform, url: sl.url, Icon: iconMap[sl.id] });
                    });
                  } else {
                    if (config?.socialGithub) items.push({ platform: 'GitHub', url: config.socialGithub, Icon: Github });
                    if (config?.socialLinkedin) items.push({ platform: 'LinkedIn', url: config.socialLinkedin, Icon: Linkedin });
                    if (config?.socialTwitter) items.push({ platform: 'Twitter', url: config.socialTwitter, Icon: Twitter });
                  }
                  return items.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-orange-500/30 hover:scale-105 active:scale-95 transition-all w-9 h-9 flex items-center justify-center cursor-pointer"
                      title={item.platform}
                    >
                      <item.Icon className="w-4 h-4 shrink-0" />
                    </a>
                  ));
                })()}
              </div>
              <div className="space-y-1 text-[11px] text-gray-500">
                <p>{isRtl ? "الموقع الجغرافي النشط:" : "Current hub:"}</p>
                <p className="text-gray-400">{config?.resumeLocation || (isRtl ? "الرياض، المملكة العربية السعودية" : "Riyadh, KSA")}</p>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 text-center sm:text-start">
            
            {/* Copyright rights */}
            <p className="text-xs text-gray-400 font-medium">
              {currentTranslations.footerRights}
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
