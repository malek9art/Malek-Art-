import { useState } from 'react';
import { Menu, X, Globe, Shield, LogOut, Home, User, Briefcase, FolderGit2, Sparkles, Mail, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../theme/useTheme';

interface NavbarProps {
  currentLang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (status: boolean) => void;
  t: any;
  config?: any;
}

export default function Navbar({
  currentLang,
  setLang,
  activeSection,
  setActiveSection,
  isAdminMode,
  setIsAdminMode,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  t,
  config,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();

  const navItems = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'about', label: t.navAbout, icon: User },
    { id: 'services', label: t.navServices, icon: Briefcase },
    { id: 'portfolio', label: t.navPortfolio, icon: FolderGit2 },
    { id: 'matchmaker', label: t.navMatchmaker, icon: Sparkles },
    { id: 'contact', label: t.navContact, icon: Mail },
  ];

  const toggleLanguage = () => {
    setLang(currentLang === 'ar' ? 'en' : 'ar');
  };

  const handleNavClick = (id: string) => {
    setIsAdminMode(false);
    setActiveSection(id);
    setIsOpen(false);
    
    // Use a slight timeout to let any mounting/closing animations settle
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -90; // Navbar height offset
        const yPos = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: yPos, behavior: 'smooth' });
      }
    }, 150);
  };

  const isRtl = currentLang === 'ar';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0, scale: 0.95 },
    show: { 
      y: 0, 
      opacity: 1, 
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      } 
    }
  };

  return (
    <nav className={`fixed top-4 left-4 right-4 z-50 backdrop-blur-xl bg-[#041024]/85 border border-white/10 transition-all duration-500 ease-out max-w-7xl mx-auto shadow-2xl px-2 overflow-hidden ${
      isOpen ? 'rounded-[24px]' : 'rounded-[24px] md:rounded-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')}>
            {config?.logoImg ? (
              <img
                src={config.logoImg}
                alt="Logo"
                className="w-9 h-9 object-contain bg-white/5 rounded-lg border border-white/10 p-0.5"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0A4EA4] to-accent flex items-center justify-center shadow-lg text-white font-bold text-lg font-mono">
                {(config?.logoTextEn || 'Malek')[0].toUpperCase()}
              </div>
            )}
            <span className="text-sm sm:text-base font-bold text-white tracking-widest uppercase font-sans">
              {config?.logoTextEn || 'MALEK LOGIC'}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <div className={`flex items-center ${isRtl ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  id={`nav-link-${item.id}`}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    activeSection === item.id && !isAdminMode
                      ? 'text-accent bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Separator */}
            <div className="h-4 w-[1px] bg-white/10 mx-2"></div>

            {/* Action Triggers */}
            <div className="flex items-center gap-2">
              {/* Theme Switcher (Day/Night) */}
              <button
                onClick={toggleTheme}
                id="theme-toggle-btn"
                className="px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-1.5 text-xs font-mono"
                title={theme === 'light' ? (isRtl ? 'التبديل للوضع الداكن' : 'Switch to Dark mode') : (isRtl ? 'التبديل للوضع النهاري' : 'Switch to Light mode')}
                aria-label="Toggle color theme"
              >
                {theme === 'light'
                  ? <Moon className="w-3.5 h-3.5 text-brand-accent" />
                  : <Sun className="w-3.5 h-3.5 text-brand-accent" />}
                <span>{theme === 'light' ? (isRtl ? 'داكن' : 'Dark') : (isRtl ? 'نهاري' : 'Light')}</span>
              </button>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                id="language-switch-btn"
                className="px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-1.5 text-xs font-mono"
                title={currentLang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
              >
                <Globe className="w-3.5 h-3.5 text-brand-accent" />
                <span>{currentLang === 'ar' ? 'EN' : 'عربي'}</span>
              </button>

               {/* Admin Button */}
              {isAdminMode ? (
                <button
                  onClick={() => {
                    setIsAdminMode(false);
                  }}
                  id="exit-admin-btn"
                  className="px-3.5 py-1.5 rounded-full bg-accent hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all duration-300 cursor-pointer shadow-lg"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.navAdminExit}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAdminMode(true);
                    setActiveSection('admin');
                  }}
                  id="admin-login-btn"
                  className="p-2 rounded-full text-gray-300 hover:text-accent hover:bg-white/5 transition-all duration-300 flex items-center justify-center cursor-pointer"
                  title={t.navAdmin}
                >
                  <Shield className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white transition-all duration-200 flex items-center gap-1 text-xs"
              aria-label="Toggle color theme"
            >
              {theme === 'light'
                ? <Moon className="w-3.5 h-3.5 text-brand-accent" />
                : <Sun className="w-3.5 h-3.5 text-brand-accent" />}
              <span>{theme === 'light' ? (isRtl ? 'داكن' : 'Dark') : (isRtl ? 'نهاري' : 'Light')}</span>
            </button>

            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white transition-all duration-200 flex items-center gap-1 text-xs"
            >
              <Globe className="w-3.5 h-3.5 text-brand-accent" />
              <span>{currentLang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 focus:outline-none transition-colors duration-200"
              aria-label="Toggle Menu"
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0, scale: isOpen ? 0.95 : 1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center justify-center animate-none"
              >
                {isOpen ? <X className="w-6 h-6 text-[#1C99ED]" /> : <Menu className="w-6 h-6 text-brand-accent" />}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Framer Motion slide-down */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-white/10 bg-[#081B36]/95 backdrop-blur-2xl"
          >
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="px-4 pt-3 pb-6 space-y-2 max-h-[70vh] overflow-y-auto"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id && !isAdminMode;
                return (
                  <motion.button
                    variants={itemVariants}
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? 'text-white bg-accent shadow-[0_4px_15px_var(--color-accent-dim)]'
                        : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-white/15 text-white'
                          : 'bg-white/5 text-gray-400 group-hover:text-white'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="tracking-wide">{item.label}</span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeDot"
                        className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#ffffff]"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                  </motion.button>
                );
              })}

              <div className="h-[1px] bg-white/10 my-3"></div>

              {/* Mobile CMS Tab */}
              {isAdminMode ? (
                <motion.button
                  variants={itemVariants}
                  onClick={() => {
                    setIsAdminMode(false);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 border border-accent/15 transition-all duration-300 hover:bg-accent/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-accent/10 text-accent">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="tracking-wide">{t.navAdminExit}</span>
                  </div>
                </motion.button>
              ) : (
                <motion.button
                  variants={itemVariants}
                  onClick={() => {
                    setIsAdminMode(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider text-gray-300 hover:text-accent hover:bg-accent/10 border border-transparent hover:border-accent/15 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/5 text-gray-400">
                      <Shield className="w-4 h-4" />
                    </div>
                    <span className="tracking-wide">{t.navAdmin}</span>
                  </div>
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
