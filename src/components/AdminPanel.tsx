import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Grid, Layout, Layers, FileText, Trash2, Edit3, Plus, CheckCircle, LogOut, FileCode, Mail, Trash, Sparkles, Brain, Star, CheckCheck, Eye, EyeOff } from 'lucide-react';
import { Project, Service, ContactMessage, SiteConfig, SocialLink, SmartDesignRequest, Skill, ClientReview, CustomFontData } from '../types';
import { saveCustomFontDB, clearCustomFontDB } from '../lib/dbService';
import { compressImage, ImageValidationError } from '../lib/imageCompress';
import { FONT_OPTIONS, CUSTOM_FONT_ID, applyFont, getFontById, injectCustomFontFaces, fontFormat, readFileAsDataUrl } from '../lib/fonts';
import { useAuth } from '../auth/authContext';
import AdminLogin from './admin/AdminLogin';
import ConfirmationModal, { ConfirmModalType } from './admin/ConfirmationModal';
import AdminAnalytics from './admin/AdminAnalytics';

interface AdminPanelProps {
  currentLang: 'ar' | 'en';
  projects: Project[];
  setProjects: (value: React.SetStateAction<Project[]>) => Promise<boolean>;
  services: Service[];
  setServices: (value: React.SetStateAction<Service[]>) => Promise<boolean>;
  skills: Skill[];
  setSkills: (value: React.SetStateAction<Skill[]>) => Promise<boolean>;
  reviews: ClientReview[];
  setReviews: (value: React.SetStateAction<ClientReview[]>) => Promise<boolean>;
  config: SiteConfig;
  setConfig: (value: React.SetStateAction<SiteConfig>) => Promise<boolean>;
  messages: ContactMessage[];
  setMessages: (value: React.SetStateAction<ContactMessage[]>) => Promise<boolean>;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  t: any;
}

export default function AdminPanel({
  currentLang,
  projects,
  setProjects,
  services,
  setServices,
  skills,
  setSkills,
  reviews,
  setReviews,
  config,
  setConfig,
  messages,
  setMessages,
  isLoggedIn,
  setIsLoggedIn,
  t,
}: AdminPanelProps) {
  const [passError, setPassError] = useState('');
  
  // Custom Skills Fields & Actions
  const [newSkillNameAr, setNewSkillNameAr] = useState('');
  const [newSkillNameEn, setNewSkillNameEn] = useState('');
  const [newSkillCategoryAr, setNewSkillCategoryAr] = useState('تطوير واجهات');
  const [newSkillCategoryEn, setNewSkillCategoryEn] = useState('Frontend');
  const [newSkillPercentage, setNewSkillPercentage] = useState(80);

  // Resume CMS Setup states (lazy loaded from config prop)
  const [resPhone, setResPhone] = useState(config.resumePhone || '+966 50 000 0000');
  const [resEmail, setResEmail] = useState(config.resumeEmail || 'malikalwesabi@gmail.com');
  const [resLoc, setResLoc] = useState(config.resumeLocation || 'الرياض، المملكة العربية السعودية');
  const [resSumAr, setResSumAr] = useState(config.resumeSummaryAr || config.aboutTextAr || '');
  const [resSumEn, setResSumEn] = useState(config.resumeSummaryEn || config.aboutTextEn || '');
  const [resExpAr, setResExpAr] = useState(config.resumeExperienceAr || '');
  const [resExpEn, setResExpEn] = useState(config.resumeExperienceEn || '');
  const [resEduAr, setResEduAr] = useState(config.resumeEducationAr || '');
  const [resEduEn, setResEduEn] = useState(config.resumeEducationEn || '');

  React.useEffect(() => {
    if (config) {
      setResPhone(config.resumePhone || '+966 50 000 0000');
      setResEmail(config.resumeEmail || 'malikalwesabi@gmail.com');
      setResLoc(config.resumeLocation || 'الرياض، المملكة العربية السعودية');
      setResSumAr(config.resumeSummaryAr || config.aboutTextAr || '');
      setResSumEn(config.resumeSummaryEn || config.aboutTextEn || '');
      setResExpAr(config.resumeExperienceAr || '');
      setResExpEn(config.resumeExperienceEn || '');
      setResEduAr(config.resumeEducationAr || '');
      setResEduEn(config.resumeEducationEn || '');
    }
  }, [config]);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillNameAr.trim() || !newSkillNameEn.trim()) return;

    const newSkill: Skill = {
      id: 'sk-' + Date.now().toString(),
      nameAr: newSkillNameAr.trim(),
      nameEn: newSkillNameEn.trim(),
      percentage: Number(newSkillPercentage),
      categoryAr: newSkillCategoryAr.trim(),
      categoryEn: newSkillCategoryEn.trim()
    };

    const updated = [...skills, newSkill];
    const cloudOk = await setSkills(updated);
    localStorage.setItem('malek_skills', JSON.stringify(updated));

    setNewSkillNameAr('');
    setNewSkillNameEn('');

    if (!cloudOk) {
      showSyncError();
      return;
    }
    setSavedConfirmModal({
      isOpen: true,
      title: isRtl ? "تمت إضافة المهارة" : "Skill Successfully Registered",
      message: isRtl ? "تم إدراج المهارة الجديدة في الموقع وترسانة السيرة الذاتية." : "New skill dynamic sync in active layouts and resume arrays.",
      type: 'project_added'
    });
  };

  const handleDeleteSkill = async (id: string) => {
    const updated = skills.filter(sk => sk.id !== id);
    const cloudOk = await setSkills(updated);
    localStorage.setItem('malek_skills', JSON.stringify(updated));
    if (!cloudOk) showSyncError();
  };

  const handleUpdateSkillPercentage = async (id: string, newPct: number) => {
    const pct = Math.min(100, Math.max(0, Number(newPct)));
    const updated = skills.map(sk => sk.id === id ? { ...sk, percentage: pct } : sk);
    const cloudOk = await setSkills(updated);
    localStorage.setItem('malek_skills', JSON.stringify(updated));
    if (!cloudOk) showSyncError();
  };

  // Client reviews approval & deletion actions
  const handleToggleReviewStatus = async (id: string) => {
    const updated = reviews.map(rev => {
      if (rev.id === id) {
        return { ...rev, status: rev.status === 'approved' ? 'pending' : 'approved' };
      }
      return rev;
    });
    const cloudOk = await setReviews(updated);
    localStorage.setItem('malek_client_reviews', JSON.stringify(updated));
    if (!cloudOk) showSyncError();
  };

  const handleDeleteReview = async (id: string) => {
    const updated = reviews.filter(rev => rev.id !== id);
    const cloudOk = await setReviews(updated);
    localStorage.setItem('malek_client_reviews', JSON.stringify(updated));
    if (!cloudOk) showSyncError();
  };

  const handleSaveResumeSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedConfig: SiteConfig = {
      ...config,
      resumePhone: resPhone,
      resumeEmail: resEmail,
      resumeLocation: resLoc,
      resumeSummaryAr: resSumAr,
      resumeSummaryEn: resSumEn,
      resumeExperienceAr: resExpAr,
      resumeExperienceEn: resExpEn,
      resumeEducationAr: resEduAr,
      resumeEducationEn: resEduEn
    };
    const cloudOk = await setConfig(updatedConfig);
    localStorage.setItem('malek_config', JSON.stringify(updatedConfig));
    if (!cloudOk) {
      showSyncError();
      return;
    }

    setSavedConfirmModal({
      isOpen: true,
      title: isRtl ? "تم تحديث السيرة الذاتية" : "Resume Settings Live",
      message: isRtl ? "تم حفظ كامل الحقول ومزامنتها سحابياً وفي ملف التصدير وقالب الطباعة PDF." : "All fields synced to the cloud, into physical PDF and print templates.",
      type: 'config_saved'
    });
  };

  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'skills' | 'reviews' | 'resume' | 'text' | 'messages' | 'ai' | 'analytics' | 'requests'>('projects');
  const [activeTextSubTab, setActiveTextSubTab] = useState<'identity' | 'hero' | 'media' | 'social' | 'stats'>('identity');
  
  // Custom design requests state & sync effect
  const [designRequests, setDesignRequests] = useState<SmartDesignRequest[]>([]);
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('malek_design_requests');
      if (saved) {
        setDesignRequests(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed loading requests in admin panel:", err);
    }
  }, [activeTab]);
  const [savedConfirmModal, setSavedConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'project_added' | 'project_updated' | 'service_updated' | 'config_saved' | 'deleted' | 'info' | 'sync_error';
  } | null>(null);

  // Form Management states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreatingService, setIsCreatingService] = useState(false);

  // New Project Fields State
  const [pTitleAr, setPTitleAr] = useState('');
  const [pTitleEn, setPTitleEn] = useState('');
  const [pDescAr, setPDescAr] = useState('');
  const [pDescEn, setPDescEn] = useState('');
  const [pContAr, setPContAr] = useState('');
  const [pContEn, setPContEn] = useState('');
  const [pImage, setPImage] = useState('');
  const [pCatAr, setPCatAr] = useState('UI/UX');
  const [pCatEn, setPCatEn] = useState('UI/UX');
  const [pLink, setPLink] = useState('');
  const [pDate, setPDate] = useState('2026-06');
  const [pOrder, setPOrder] = useState(1);
  const [pIsVisible, setPIsVisible] = useState(true);

  // ── Professional Product Showcase Fields ──
  const [pProductType, setPProductType] = useState<Project['productType']>('system');
  const [pTechnologies, setPTechnologies] = useState('');
  const [pFeaturesAr, setPFeaturesAr] = useState('');
  const [pFeaturesEn, setPFeaturesEn] = useState('');
  const [pStatus, setPStatus] = useState<Project['status']>('live');
  const [pIsFeatured, setPIsFeatured] = useState(false);
  const [pAccentColor, setPAccentColor] = useState('#1C99ED');
  const [pMetricsUsers, setPMetricsUsers] = useState('');
  const [pMetricsRating, setPMetricsRating] = useState('');
  const [pMetricsDownloads, setPMetricsDownloads] = useState('');
  const [pMetricsUptime, setPMetricsUptime] = useState('');

  // Edit Service Fields State
  const [sTitleAr, setSTitleAr] = useState('');
  const [sTitleEn, setSTitleEn] = useState('');
  const [sDescAr, setSDescAr] = useState('');
  const [sDescEn, setSDescEn] = useState('');
  const [sIcon, setSIcon] = useState('');

  // ── Professional Service Showcase Fields ──
  const [sCategoryAr, setSCategoryAr] = useState('');
  const [sCategoryEn, setSCategoryEn] = useState('');
  const [sFeaturesAr, setSFeaturesAr] = useState('');
  const [sFeaturesEn, setSFeaturesEn] = useState('');
  const [sTechnologies, setSTechnologies] = useState('');
  const [sPricingTier, setSPricingTier] = useState<Service['pricingTier']>('standard');
  const [sDeliveryTimeAr, setSDeliveryTimeAr] = useState('');
  const [sDeliveryTimeEn, setSDeliveryTimeEn] = useState('');
  const [sIsPopular, setSIsPopular] = useState(false);
  const [sAccentColor, setSAccentColor] = useState('#1C99ED');
  const [sStatsProjects, setSStatsProjects] = useState('');
  const [sStatsSatisfaction, setSStatsSatisfaction] = useState('');
  const [sStatsDeliveryDays, setSStatsDeliveryDays] = useState('');
  const [sProcessAr, setSProcessAr] = useState('');
  const [sProcessEn, setSProcessEn] = useState('');

  // Edit Config Fields State
  const [cAboutAr, setCAboutAr] = useState(config.aboutTextAr || '');
  const [cAboutEn, setCAboutEn] = useState(config.aboutTextEn || '');
  const [cHeroAr, setCHeroAr] = useState(config.heroTextAr || '');
  const [cHeroEn, setCHeroEn] = useState(config.heroTextEn || '');
  const [cSubAr, setCSubAr] = useState(config.heroSubAr || '');
  const [cSubEn, setCSubEn] = useState(config.heroSubEn || '');
  const [cProfile, setCProfile] = useState(config.profileImg || '');
  const [cLogoImg, setCLogoImg] = useState(config.logoImg || '');
  const [cHeroBgImg, setCHeroBgImg] = useState(config.heroBgImg || '');

  // Dynamic branding fields
  const [cNameAr, setCNameAr] = useState(config.nameAr || '');
  const [cNameEn, setCNameEn] = useState(config.nameEn || '');
  const [cProfessionAr, setCProfessionAr] = useState(config.professionAr || '');
  const [cProfessionEn, setCProfessionEn] = useState(config.professionEn || '');
  const [cLogoAr, setCLogoAr] = useState(config.logoTextAr || '');
  const [cLogoEn, setCLogoEn] = useState(config.logoTextEn || '');
  const [cAccent, setCAccent] = useState(config.accentColor || '#1C99ED');

  // Global typography selector state
  const [cFont, setCFont] = useState(config.fontFamily || 'thmanyah-sans');
  const [cCustomFamily, setCCustomFamily] = useState(config.customFontFamily || '');
  const [cCustomUrl, setCCustomUrl] = useState(config.customFontUrl || '');

  // Custom font file upload state (Regular / Medium / Bold)
  const [cfRegular, setCfRegular] = useState<File | null>(null);
  const [cfMedium, setCfMedium] = useState<File | null>(null);
  const [cfBold, setCfBold] = useState<File | null>(null);
  const [customFontStatus, setCustomFontStatus] = useState<string>('');
  const [cfUploading, setCfUploading] = useState(false);

  // Custom Social links
  const [cSocFB, setCSocFB] = useState(config.socialFacebook || '');
  const [cSocTW, setCSocTW] = useState(config.socialTwitter || '');
  const [cSocLN, setCSocLN] = useState(config.socialLinkedin || '');
  const [cSocGH, setCSocGH] = useState(config.socialGithub || '');
  const [cSocIG, setCSocIG] = useState(config.socialInstagram || '');
  const [cSocialLinks, setCSocialLinks] = useState<SocialLink[]>(
    config.socialLinks || [
      { id: '1', platform: 'GitHub', url: config.socialGithub || 'https://github.com/malekart' },
      { id: '2', platform: 'LinkedIn', url: config.socialLinkedin || 'https://linkedin.com/in/malekart' },
      { id: '3', platform: 'Twitter/X', url: config.socialTwitter || 'https://twitter.com/malekart' },
      { id: '4', platform: 'Instagram', url: config.socialInstagram || 'https://instagram.com/malekart' }
    ]
  );
  const [newPlatform, setNewPlatform] = useState('GitHub');
  const [newUrl, setNewUrl] = useState('');

  // Custom Achievement stats
  const [cStat1Value, setCStat1Value] = useState(config.stat1Value || '');
  const [cStat1LabelAr, setCStat1LabelAr] = useState(config.stat1LabelAr || '');
  const [cStat1LabelEn, setCStat1LabelEn] = useState(config.stat1LabelEn || '');
  const [cStat2Value, setCStat2Value] = useState(config.stat2Value || '');
  const [cStat2LabelAr, setCStat2LabelAr] = useState(config.stat2LabelAr || '');
  const [cStat2LabelEn, setCStat2LabelEn] = useState(config.stat2LabelEn || '');
  const [cStat3Value, setCStat3Value] = useState(config.stat3Value || '');
  const [cStat3LabelAr, setCStat3LabelAr] = useState(config.stat3LabelAr || '');
  const [cStat3LabelEn, setCStat3LabelEn] = useState(config.stat3LabelEn || '');

  // Custom AI instructions
  const [cAIPromptAr, setcAIPromptAr] = useState(config.aiCustomPromptAr || '');
  const [cAIPromptEn, setcAIPromptEn] = useState(config.aiCustomPromptEn || '');

  // AI Formulator states
  const [projAiKeywords, setProjAiKeywords] = useState('');
  const [servAiKeywords, setServAiKeywords] = useState('');
  const [isAiFormulating, setIsAiFormulating] = useState(false);
  const [aiFormulateError, setAiFormulateError] = useState('');

  const handleAiFormulate = async (type: 'project' | 'service') => {
    setIsAiFormulating(true);
    setAiFormulateError('');

    try {
      const keywordsVal = type === 'project' ? projAiKeywords : servAiKeywords;
      const titleVal = type === 'project' ? (pTitleAr || pTitleEn) : (sTitleAr || sTitleEn);
      const descVal = type === 'project' ? (pDescAr || pDescEn) : (sDescAr || sDescEn);

      const response = await fetch('/api/ai-formulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          title: titleVal,
          description: descVal,
          keywords: keywordsVal,
        }),
      });

      if (!response.ok) {
        throw new Error(isRtl ? 'فشلت المعالجة الذكية للبيانات. تأكد من اتصال إنترنت صالح.' : 'Smart data processing failed. Ensure valid connection.');
      }

      const data = await response.json();

      if (type === 'project') {
        setPTitleAr(data.titleAr || '');
        setPTitleEn(data.titleEn || '');
        setPDescAr(data.descriptionAr || '');
        setPDescEn(data.descriptionEn || '');
        setPContAr(data.contentAr || '');
        setPContEn(data.contentEn || '');
        setPCatAr(data.categoryAr || 'UI/UX');
        setPCatEn(data.categoryEn || 'UI/UX');
        if (data.date) setPDate(data.date);
        
        // Suggest general premium placeholder image if currently empty
        if (!pImage) {
          setPImage("https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop");
        }
      } else {
        setSTitleAr(data.titleAr || '');
        setSTitleEn(data.titleEn || '');
        setSDescAr(data.descriptionAr || '');
        setSDescEn(data.descriptionEn || '');
        if (data.icon) setSIcon(data.icon);
      }

      showFeedback(isRtl ? "💡 تم صياغة وتحديث البيانات بنجاح! راجع الحقول أدناه وعدلها بحرية قبل الحفظ." : "💡 Content formulated successfully! View the fields below and edit freely before saving.");
    } catch (err: any) {
      console.error(err);
      setAiFormulateError(err.message || (isRtl ? 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي' : 'An error occurred during AI connection'));
    } finally {
      setIsAiFormulating(false);
    }
  };

  // Sync state hooks with incoming config props dynamically
  React.useEffect(() => {
    if (config) {
      setCAboutAr(config.aboutTextAr || '');
      setCAboutEn(config.aboutTextEn || '');
      setCHeroAr(config.heroTextAr || '');
      setCHeroEn(config.heroTextEn || '');
      setCSubAr(config.heroSubAr || '');
      setCSubEn(config.heroSubEn || '');
      setCProfile(config.profileImg || '');
      setCLogoImg(config.logoImg || '');
      setCHeroBgImg(config.heroBgImg || '');

      setCNameAr(config.nameAr || '');
      setCNameEn(config.nameEn || '');
      setCProfessionAr(config.professionAr || '');
      setCProfessionEn(config.professionEn || '');
      setCLogoAr(config.logoTextAr || '');
      setCLogoEn(config.logoTextEn || '');
      setCAccent(config.accentColor || '#1C99ED');
      setCFont(config.fontFamily || 'thmanyah-sans');
      setCCustomFamily(config.customFontFamily || '');
      setCCustomUrl(config.customFontUrl || '');

      setCSocFB(config.socialFacebook || '');
      setCSocTW(config.socialTwitter || '');
      setCSocLN(config.socialLinkedin || '');
      setCSocGH(config.socialGithub || '');
      setCSocIG(config.socialInstagram || '');

      setCStat1Value(config.stat1Value || '');
      setCStat1LabelAr(config.stat1LabelAr || '');
      setCStat1LabelEn(config.stat1LabelEn || '');
      setCStat2Value(config.stat2Value || '');
      setCStat2LabelAr(config.stat2LabelAr || '');
      setCStat2LabelEn(config.stat2LabelEn || '');
      setCStat3Value(config.stat3Value || '');
      setCStat3LabelAr(config.stat3LabelAr || '');
      setCStat3LabelEn(config.stat3LabelEn || '');

      setcAIPromptAr(config.aiCustomPromptAr || '');
      setcAIPromptEn(config.aiCustomPromptEn || '');
    }
  }, [config]);

  // Load any previously uploaded custom font from local storage on mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('malek_custom_font');
      if (saved) {
        const data = JSON.parse(saved);
        if (data?.family) {
          setCustomFontStatus(data.family);
          injectCustomFontFaces(data);
        }
      }
    } catch {}
  }, []);

  // Live font preview while editing; restores the saved font on unmount.
  useEffect(() => {
    applyFont({ fontFamily: cFont, customFontFamily: cCustomFamily });
    return () =>
      applyFont({
        fontFamily: config.fontFamily,
        customFontFamily: config.customFontFamily,
      });
  }, [cFont, cCustomFamily]);

  const [feedback, setFeedback] = useState('');
  const isRtl = currentLang === 'ar';

  const { user: authUser, isAuthenticated, login: authLogin, logout: authLogout } = useAuth();

  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated, setIsLoggedIn]);

  const handleLogout = async () => {
    await authLogout();
    setIsLoggedIn(false);
  };

  // Upload custom font files (Regular/Medium/Bold) from the admin panel and apply site-wide.
  const handleUploadCustomFont = async () => {
    if (!cCustomFamily.trim()) {
      showFeedback(isRtl ? '⚠ الرجاء إدخال اسم عائلة الخط أولًا.' : '⚠ Please enter a font family name first.');
      return;
    }
    if (!cfRegular && !cfMedium && !cfBold) {
      showFeedback(isRtl ? '⚠ اختر ملف خط واحد على الأقل (يُفضّل Regular).' : '⚠ Pick at least one font file (Regular preferred).');
      return;
    }
    setCfUploading(true);
    try {
      const build = async (f: File | null) =>
        f ? { src: await readFileAsDataUrl(f), fmt: fontFormat(f.name) } : undefined;
      const data: CustomFontData = {
        family: cCustomFamily.trim(),
        regular: await build(cfRegular),
        medium: await build(cfMedium),
        bold: await build(cfBold),
        uploadedAt: new Date().toISOString(),
      };
      await saveCustomFontDB(data);
      localStorage.setItem('malek_custom_font', JSON.stringify(data));
      injectCustomFontFaces(data);
      applyFont({ fontFamily: CUSTOM_FONT_ID, customFontFamily: data.family });
      setCustomFontStatus(data.family);
      setConfig({ ...config, fontFamily: CUSTOM_FONT_ID, customFontFamily: data.family } as SiteConfig);
      setCFont(CUSTOM_FONT_ID);
      setCfRegular(null);
      setCfMedium(null);
      setCfBold(null);
      showFeedback(isRtl ? `✓ تم رفع الخط «${data.family}» وتطبيقه على كامل الموقع` : `✓ Font "${data.family}" uploaded & applied site-wide`);
    } catch (e: any) {
      console.error('Custom font upload error:', e);
      showFeedback(isRtl ? '⚠ تعذّر رفع الخط. تأكد من الاتصال وحجم الملف (أقل من ~400KB).' : '⚠ Failed to upload the font. Check connection and file size (< ~400KB).');
    } finally {
      setCfUploading(false);
    }
  };

  const handleRemoveCustomFont = async () => {
    if (!window.confirm(isRtl ? 'حذف الخط المرفوع والعودة للخط الافتراضي؟' : 'Remove the uploaded font and revert to default?')) return;
    try {
      await clearCustomFontDB();
      localStorage.removeItem('malek_custom_font');
      injectCustomFontFaces(null);
      setCustomFontStatus('');
      setConfig({ ...config, fontFamily: 'thmanyah-sans', customFontFamily: '' } as SiteConfig);
      setCFont('thmanyah-sans');
      showFeedback(isRtl ? '✓ تم حذف الخط المرفوع' : '✓ Uploaded font removed');
    } catch (e: any) {
      showFeedback(isRtl ? '⚠ تعذّر حذف الخط' : '⚠ Failed to remove font');
    }
  };

  const showFeedback = (text: string) => {
    setFeedback(text);
    setTimeout(() => setFeedback(''), 3500);
  };

  // Honest "cloud sync failed" dialog: data is kept locally on THIS device only,
  // so the user is never misled by a fake success message while other devices
  // keep showing the old/default content.
  const showSyncError = () => {
    setSavedConfirmModal({
      isOpen: true,
      title: isRtl ? "فشلت المزامنة مع السحابة!" : "Cloud Sync Failed!",
      message: isRtl
        ? "تم حفظ التعديل على هذا الجهاز فقط، ولن يظهر على الأجهزة الأخرى. تحقق من: 1) نشر قواعد أمان Firestore الصحيحة، 2) تسجيل دخولك بحساب المسؤول، 3) اتصال الإنترنت — ثم أعد الحفظ."
        : "The change was saved on THIS device only and will NOT appear on other devices. Please check: 1) Firestore security rules are published, 2) you are signed in as admin, 3) internet connection — then save again.",
      type: 'sync_error'
    });
  };

  // CRUD PROJECT: Save Add or Edit
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build product-specific fields
    const productFields = {
      productType: pProductType,
      technologies: pTechnologies.split(',').map(s => s.trim()).filter(Boolean),
      featuresAr: pFeaturesAr.split('\n').map(s => s.trim()).filter(Boolean),
      featuresEn: pFeaturesEn.split('\n').map(s => s.trim()).filter(Boolean),
      status: pStatus,
      isFeatured: pIsFeatured,
      accentColor: pAccentColor,
      metrics: {
        users: pMetricsUsers || undefined,
        rating: pMetricsRating ? parseFloat(pMetricsRating) : undefined,
        downloads: pMetricsDownloads || undefined,
        uptime: pMetricsUptime || undefined,
      },
    };
    
    if (editingProject) {
      // Edit mode
      const updated = projects.map(p => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            titleAr: pTitleAr,
            titleEn: pTitleEn,
            descriptionAr: pDescAr,
            descriptionEn: pDescEn,
            contentAr: pContAr,
            contentEn: pContEn,
            image: pImage,
            categoryAr: pCatAr,
            categoryEn: pCatEn,
            link: pLink,
            isVisible: pIsVisible,
            date: pDate,
            sortOrder: Number(pOrder),
            ...productFields,
          };
        }
        return p;
      });
      const cloudOk = await setProjects(updated);
      localStorage.setItem('malek_projects', JSON.stringify(updated));
      if (!cloudOk) {
        showSyncError();
        closeProjectUI();
        return;
      }
      setSavedConfirmModal({
        isOpen: true,
        title: isRtl ? "تعديل مشروع" : "Project Updated",
        message: isRtl ? `تم بنجاح تعديل وتحديث بيانات مشروع "${pTitleAr || pTitleEn}" في المعرض!` : `Project "${pTitleEn || pTitleAr}" parameters updated successfully!`,
        type: 'project_updated'
      });
    } else {
      // Add mode
      const newProj: Project = {
        id: Date.now().toString(),
        titleAr: pTitleAr,
        titleEn: pTitleEn,
        descriptionAr: pDescAr,
        descriptionEn: pDescEn,
        contentAr: pContAr,
        contentEn: pContEn,
        image: pImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
        categoryAr: pCatAr,
        categoryEn: pCatEn,
        link: pLink,
        isVisible: pIsVisible,
        date: pDate,
        sortOrder: Number(pOrder),
        ...productFields,
      };
      const updated = [...projects, newProj];
      const cloudOk = await setProjects(updated);
      localStorage.setItem('malek_projects', JSON.stringify(updated));
      if (!cloudOk) {
        showSyncError();
        closeProjectUI();
        return;
      }
      setSavedConfirmModal({
        isOpen: true,
        title: isRtl ? "إضافة مشروع جديد" : "New Project Added",
        message: isRtl ? `تم بنجاح صياغة وإدراج مشروعك الجديد "${pTitleAr || pTitleEn}" في المعرض العام للأعمال!` : `New project "${pTitleEn || pTitleAr}" has been compiled and added into the roster!`,
        type: 'project_added'
      });
    }

    closeProjectUI();
  };

  const startEditProject = (p: Project) => {
    setEditingProject(p);
    setIsAddingProject(false);
    setProjAiKeywords('');
    setAiFormulateError('');
    
    setPTitleAr(p.titleAr);
    setPTitleEn(p.titleEn);
    setPDescAr(p.descriptionAr);
    setPDescEn(p.descriptionEn);
    setPContAr(p.contentAr);
    setPContEn(p.contentEn);
    setPImage(p.image);
    setPCatAr(p.categoryAr);
    setPCatEn(p.categoryEn);
    setPLink(p.link || '');
    setPDate(p.date);
    setPOrder(p.sortOrder);
    setPIsVisible(p.isVisible !== false);

    // Professional Product Showcase Fields
    setPProductType(p.productType || 'system');
    setPTechnologies((p.technologies || []).join(', '));
    setPFeaturesAr((p.featuresAr || []).join('\n'));
    setPFeaturesEn((p.featuresEn || []).join('\n'));
    setPStatus(p.status || 'live');
    setPIsFeatured(p.isFeatured || false);
    setPAccentColor(p.accentColor || '#1C99ED');
    setPMetricsUsers(p.metrics?.users || '');
    setPMetricsRating(p.metrics?.rating?.toString() || '');
    setPMetricsDownloads(p.metrics?.downloads || '');
    setPMetricsUptime(p.metrics?.uptime || '');
  };

  const startAddProject = () => {
    setEditingProject(null);
    setIsAddingProject(true);
    setProjAiKeywords('');
    setAiFormulateError('');
    
    setPTitleAr('');
    setPTitleEn('');
    setPDescAr('');
    setPDescEn('');
    setPContAr('');
    setPContEn('');
    setPImage('');
    setPCatAr('UI/UX');
    setPCatEn('UI/UX');
    setPLink('');
    setPDate('2026-06');
    setPOrder(projects.length + 1);
    setPIsVisible(true);

    // Professional Product Showcase Fields
    setPProductType('system');
    setPTechnologies('');
    setPFeaturesAr('');
    setPFeaturesEn('');
    setPStatus('live');
    setPIsFeatured(false);
    setPAccentColor('#1C99ED');
    setPMetricsUsers('');
    setPMetricsRating('');
    setPMetricsDownloads('');
    setPMetricsUptime('');
  };

  const closeProjectUI = () => {
    setEditingProject(null);
    setIsAddingProject(false);
    setProjAiKeywords('');
    setAiFormulateError('');
  };

  const handleToggleProjectVisibility = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    const updated = projects.map(p => p.id === id ? { ...p, isVisible: p.isVisible === false } : p);
    const cloudOk = await setProjects(updated);
    localStorage.setItem('malek_projects', JSON.stringify(updated));
    if (!cloudOk) {
      showSyncError();
      return;
    }
    showFeedback(isRtl
      ? (project.isVisible === false ? '✓ تم إظهار المشروع في المعرض العام' : '✓ تم إخفاء المشروع من المعرض العام')
      : (project.isVisible === false ? '✓ Project is now visible in the public portfolio' : '✓ Project hidden from the public portfolio'));
  };

  const handleDeleteProject = async (id: string) => {
    const proj = projects.find(p => p.id === id);
    const title = proj ? (isRtl ? proj.titleAr : proj.titleEn) : '';
    if (window.confirm(t.adminDeleteConfirm)) {
      const updated = projects.filter(p => p.id !== id);
      const cloudOk = await setProjects(updated);
      localStorage.setItem('malek_projects', JSON.stringify(updated));
      if (!cloudOk) {
        showSyncError();
        return;
      }
      setSavedConfirmModal({
        isOpen: true,
        title: isRtl ? "حذف مشروع" : "Project Removed",
        message: isRtl ? `تم حذف مشروع "${title}" وإزالته نهائياً من قائمة أعمالك.` : `Project "${title}" has been permanently excluded from your records.`,
        type: 'deleted'
      });
    }
  };

  // CRUD SERVICE: Save Edit or Create
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build professional service fields
    const serviceFields = {
      categoryAr: sCategoryAr || undefined,
      categoryEn: sCategoryEn || undefined,
      featuresAr: sFeaturesAr.split('\n').map(s => s.trim()).filter(Boolean),
      featuresEn: sFeaturesEn.split('\n').map(s => s.trim()).filter(Boolean),
      technologies: sTechnologies.split(',').map(s => s.trim()).filter(Boolean),
      pricingTier: sPricingTier,
      deliveryTimeAr: sDeliveryTimeAr || undefined,
      deliveryTimeEn: sDeliveryTimeEn || undefined,
      isPopular: sIsPopular,
      accentColor: sAccentColor,
      stats: {
        projectsCompleted: sStatsProjects || undefined,
        satisfactionRate: sStatsSatisfaction || undefined,
        avgDeliveryDays: sStatsDeliveryDays || undefined,
      },
      processAr: sProcessAr.split('\n').map(s => s.trim()).filter(Boolean),
      processEn: sProcessEn.split('\n').map(s => s.trim()).filter(Boolean),
    };

    if (isCreatingService) {
      const newService: Service = {
        id: 'service-' + Date.now(),
        titleAr: sTitleAr,
        titleEn: sTitleEn,
        descriptionAr: sDescAr,
        descriptionEn: sDescEn,
        icon: sIcon || 'Layers',
        ...serviceFields,
      };
      
      const updated = [...services, newService];
      const cloudOk = await setServices(updated);
      localStorage.setItem('malek_services', JSON.stringify(updated));
      setIsCreatingService(false);
      if (!cloudOk) {
        showSyncError();
        return;
      }
      
      // Reset fields
      setSTitleAr('');
      setSTitleEn('');
      setSDescAr('');
      setSDescEn('');
      setSIcon('');
      setSCategoryAr('');
      setSCategoryEn('');
      setSFeaturesAr('');
      setSFeaturesEn('');
      setSTechnologies('');
      setSPricingTier('standard');
      setSDeliveryTimeAr('');
      setSDeliveryTimeEn('');
      setSIsPopular(false);
      setSAccentColor('#1C99ED');
      setSStatsProjects('');
      setSStatsSatisfaction('');
      setSStatsDeliveryDays('');
      setSProcessAr('');
      setSProcessEn('');
      
      setSavedConfirmModal({
        isOpen: true,
        title: isRtl ? "إضافة خدمة جديدة" : "Service Created",
        message: isRtl ? `تم بنجاح إنشاء ميزة الخدمة "${sTitleAr || sTitleEn}" وإضافتها لقائمة نظامك الرقمي!` : `New service "${sTitleEn || sTitleAr}" has been created and indexed!`,
        type: 'service_updated'
      });
      return;
    }

    if (!editingService) return;

    const updated = services.map(s => {
      if (s.id === editingService.id) {
        return {
          ...s,
          titleAr: sTitleAr,
          titleEn: sTitleEn,
          descriptionAr: sDescAr,
          descriptionEn: sDescEn,
          icon: sIcon,
          ...serviceFields,
        };
      }
      return s;
    });

      const cloudOk = await setServices(updated);
      localStorage.setItem('malek_services', JSON.stringify(updated));
      setEditingService(null);
      if (!cloudOk) {
        showSyncError();
        return;
      }
      setSavedConfirmModal({
        isOpen: true,
        title: isRtl ? "تعديل الخدمة" : "Service Updated",
      message: isRtl ? `تم بنجاح تحديث مواصفات وتفاصيل خدمة "${sTitleAr || sTitleEn}" وتعميمها على واجهات العرض!` : `Service "${sTitleEn || sTitleAr}" features have been successfully saved into live system!`,
      type: 'service_updated'
    });
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (window.confirm(isRtl ? `هل أنت متأكد من رغبتك في حذف وإزالة خدمة "${name}" نهائياً من العرض؟` : `Are you sure you want to permanently delete "${name}" from your services list?`)) {
      const updated = services.filter(s => s.id !== id);
      const cloudOk = await setServices(updated);
      localStorage.setItem('malek_services', JSON.stringify(updated));
      if (!cloudOk) {
        showSyncError();
        return;
      }
      setSavedConfirmModal({
        isOpen: true,
        title: isRtl ? "حذف خدمة" : "Service Deleted",
        message: isRtl ? `تمت إزالة ميزة الخدمة "${name}" نهائياً بنجاح.` : `Service "${name}" has been permanently deleted from records.`,
        type: 'deleted'
      });
    }
  };

  const startEditService = (s: Service) => {
    setIsCreatingService(false);
    setEditingService(s);
    setSTitleAr(s.titleAr);
    setSTitleEn(s.titleEn);
    setSDescAr(s.descriptionAr);
    setSDescEn(s.descriptionEn);
    setSIcon(s.icon);

    // Professional Service Showcase Fields
    setSCategoryAr(s.categoryAr || '');
    setSCategoryEn(s.categoryEn || '');
    setSFeaturesAr((s.featuresAr || []).join('\n'));
    setSFeaturesEn((s.featuresEn || []).join('\n'));
    setSTechnologies((s.technologies || []).join(', '));
    setSPricingTier(s.pricingTier || 'standard');
    setSDeliveryTimeAr(s.deliveryTimeAr || '');
    setSDeliveryTimeEn(s.deliveryTimeEn || '');
    setSIsPopular(s.isPopular || false);
    setSAccentColor(s.accentColor || '#1C99ED');
    setSStatsProjects(s.stats?.projectsCompleted || '');
    setSStatsSatisfaction(s.stats?.satisfactionRate || '');
    setSStatsDeliveryDays(s.stats?.avgDeliveryDays || '');
    setSProcessAr((s.processAr || []).join('\n'));
    setSProcessEn((s.processEn || []).join('\n'));
  };

  // CRUD CONFIG: Save global text and advanced dynamic specifications
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteConfig = {
      ...config,
      aboutTextAr: cAboutAr,
      aboutTextEn: cAboutEn,
      heroTextAr: cHeroAr,
      heroTextEn: cHeroEn,
      heroSubAr: cSubAr,
      heroSubEn: cSubEn,
      profileImg: cProfile,
      logoImg: cLogoImg,
      heroBgImg: cHeroBgImg,
      nameAr: cNameAr,
      nameEn: cNameEn,
      professionAr: cProfessionAr,
      professionEn: cProfessionEn,
      logoTextAr: cLogoAr,
      logoTextEn: cLogoEn,
      accentColor: cAccent,
      socialFacebook: cSocFB,
      socialTwitter: cSocTW,
      socialLinkedin: cSocLN,
      socialGithub: cSocGH,
      socialInstagram: cSocIG,
      socialLinks: cSocialLinks,
      stat1Value: cStat1Value,
      stat1LabelAr: cStat1LabelAr,
      stat1LabelEn: cStat1LabelEn,
      stat2Value: cStat2Value,
      stat2LabelAr: cStat2LabelAr,
      stat2LabelEn: cStat2LabelEn,
      stat3Value: cStat3Value,
      stat3LabelAr: cStat3LabelAr,
      stat3LabelEn: cStat3LabelEn,
      aiCustomPromptAr: cAIPromptAr,
      aiCustomPromptEn: cAIPromptEn,
      fontFamily: cFont,
      customFontFamily: cCustomFamily,
      customFontUrl: cCustomUrl,
    };
    // Persist locally AND to the cloud; the confirmation reflects the REAL sync result.
    const cloudOk = await setConfig(updated);
    localStorage.setItem('malek_config', JSON.stringify(updated));
    if (!cloudOk) {
      showSyncError();
      return;
    }
    setSavedConfirmModal({
      isOpen: true,
      title: isRtl ? "تحديث الهوية والإعدادات" : "Configurations Saved",
      message: isRtl 
        ? "تم حفظ ومزامنة نصوص الموقع، الألوان، الأصول البصرية، نسب الإنجاز والمعلومات الشخصية مع السحابة بنجاح — ستظهر الآن على جميع الأجهزة!" 
        : "Brand details, colors, custom backdrops, social matrices and milestones synced to the cloud — now visible on all devices!",
      type: 'config_saved'
    });
  };

  // CRUD MESSAGES: Delete message entries
  const handleDeleteMessage = async (id: string) => {
    const msg = messages.find(m => m.id === id);
    const sender = msg ? msg.name : '';
    const updated = messages.filter(m => m.id !== id);
    const cloudOk = await setMessages(updated);
    localStorage.setItem('malek_messages', JSON.stringify(updated));
    if (!cloudOk) {
      showSyncError();
      return;
    }
    setSavedConfirmModal({
      isOpen: true,
      title: isRtl ? "حذف رسالة العميل" : "Lead Deleted",
      message: isRtl ? `تم بنجاح حذف رسالة العميل "${sender}" من صندوق بريد الوارد.` : `Message entry from Client "${sender}" was successfully deleted from records.`,
      type: 'deleted'
    });
  };

  // Show login screen if not authenticated
  if (!isLoggedIn) {
    return <AdminLogin currentLang={currentLang} setIsLoggedIn={setIsLoggedIn} />;
  }

  // Dashboard CMS workspace UI
  return (
    <section className="min-h-screen pt-32 pb-24 bg-[#041024] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-start">
        
        {/* Workspace Title header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-6 mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Shield className="w-7 h-7 text-[#1C99ED] animate-pulse" />
              <span>{t.adminWelcome}</span>
            </h2>
            <p className="text-xs text-white/60 mt-1 max-w-lg leading-relaxed">
              {isRtl ? "يمكنك إضافة وتعديل وحذف مشاريع معرض الأعمال، الخدمات، وتعديل نصوص الصفحة الرئيسية والمنبثقات وتتبع بريد العملاء الفوري" : "Add, Edit, Update, or Delete any sections displayed inside your web portal. Submissions and inputs instantly reflected into interface."}
            </p>
          </div>

          {/* Quick exit button */}
          <button
            onClick={handleLogout}
            id="admin-exit-vault"
            className="px-4 py-2 text-xs font-semibold border border-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#1C99ED]" />
            <span>{isRtl ? "قفل الجلسة" : "Lock Database Session"}</span>
          </button>
        </div>

        {/* Global Action Feedbacks */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold flex items-center gap-2.5"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{feedback}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Selection Bar Dashboard */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-8">
          {[
            { id: 'projects', label: t.adminTabProjects, icon: <Layout className="w-4.5 h-4.5" /> },
            { id: 'services', label: t.adminTabServices, icon: <Layers className="w-4.5 h-4.5" /> },
            { id: 'skills', label: isRtl ? "إدارة المهارات" : "Skills Armory", icon: <Brain className="w-4.5 h-4.5 text-brand-accent" /> },
            { id: 'reviews', label: isRtl ? `المراجعات (${reviews.length})` : `Client Reviews (${reviews.length})`, icon: <Star className="w-4.5 h-4.5 text-warning" /> },
            { id: 'resume', label: isRtl ? "مكونات السيرة الذاتية" : "Resume PDF Fields", icon: <FileText className="w-4.5 h-4.5 text-warning" /> },
            { id: 'text', label: isRtl ? "الهوية والألوان والإنجازات" : "Branding & Stats", icon: <FileText className="w-4.5 h-4.5" /> },
            { id: 'requests', label: isRtl ? `طلبـات التصميـم (${designRequests.length})` : `Design Requests (${designRequests.length})`, icon: <Sparkles className="w-4.5 h-4.5 text-warning animate-pulse" /> },
            { id: 'ai', label: isRtl ? "تخصيص مساعد الذكاء" : "AI Customizer", icon: <Grid className="w-4.5 h-4.5" /> },
            { id: 'analytics', label: isRtl ? "تحليلات متقدمة" : "Advanced Analytics", icon: <FileCode className="w-4.5 h-4.5" /> },
            { id: 'messages', label: `${t.adminTabMessages} (${messages.length})`, icon: <Mail className="w-4.5 h-4.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full flex items-center gap-2 cursor-pointer transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-accent text-white shadow-lg'
                  : 'bg-white/5 text-gray-300 hover:text-white border border-white/10'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ==================== TAB 1 DETAILS: PROJECTS ==================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            
            {/* Catalog subheader with Add actions */}
            {!isAddingProject && !editingProject && (
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-white/80 font-bold text-sm sm:text-base">
                  {isRtl ? `دليل المشاريع المتوفرة (${projects.length})` : `Projects list (${projects.length})`}
                </span>
                <button
                  onClick={startAddProject}
                  id="admin-add-new-project-btn"
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-[#1C99ED] hover:bg-brand-accent text-white flex items-center gap-1.5 shadow cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.adminAddProject}</span>
                </button>
              </div>
            )}

            {/* Editing / Creating Project UI Workspace Panel */}
            {(isAddingProject || editingProject) && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 sm:p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg"
              >
                <h3 className="text-lg font-bold text-white mb-6 pb-2 border-b border-white/10">
                  {editingProject ? t.adminEditProject : t.adminAddProject}
                </h3>

                <form onSubmit={handleSaveProject} className="space-y-6">
                  
                  {/* AI INTEGRATION FORMULATOR TOOL */}
                  <div className="p-5 rounded-[24px] bg-brand-accent/10 border border-brand-accent/20 space-y-3 text-start">
                    <div className="flex items-center gap-2 text-brand-accent">
                      <Sparkles className="w-5 h-5 text-[#1C99ED] animate-pulse" />
                      <span className="text-xs uppercase tracking-wider font-bold font-mono">
                        {isRtl ? "المعالج الذكي وصائغ النصوص التلقائي بالذكاء الاصطناعي" : "AI CONTENT FORMULATOR & ASSISTANT"}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      {isRtl
                        ? "اكتب فكرة سريعة أو كلمات رئيسية عن المشروع باللغة العربية أو الإنجليزية (أو دع الحقول فارغة ليقوم بصياغة مشروع مبهر عشوائي). سيقوم الذكاء الاصطناعي بتوليد العناوين، الأوصاف، التفاصيل العميقة والترجمة الكاملة تلقائياً للغتين، ويمكنك تعديلها بحرية بعدها!"
                        : "Type a brief idea or keywords (e.g., 'Coffee e-commerce store with dynamic animations'). The AI will draft fully conceptualized titles, summaries, specifications, and translation indexes in both English and Arabic. Modify any draft result before saving."}
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={projAiKeywords}
                        onChange={(e) => setProjAiKeywords(e.target.value)}
                        placeholder={isRtl ? "مثال: منصة عقارية حديثة بخرائط وشاشات واضحة..." : "e.g., A minimalist fragrance storefront with smooth transitions..."}
                        className="flex-1 text-xs rounded-xl bg-black/40 border border-white/10 p-2.5 text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAiFormulate('project')}
                        disabled={isAiFormulating}
                        className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl bg-brand-primary hover:bg-brand-primary text-white flex items-center gap-1.5 shadow transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
                      >
                        {isAiFormulating ? (
                          <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        <span>{isRtl ? "معالجة وصياغة" : "Formulate"}</span>
                      </button>
                    </div>
                    {aiFormulateError && (
                      <div className="text-[10px] text-red-400 font-medium font-mono">
                        ⚠ {aiFormulateError}
                      </div>
                    )}
                  </div>

                  {/* Dual titles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminProjTitleAr} *</label>
                      <input
                        type="text"
                        value={pTitleAr}
                        onChange={(e) => setPTitleAr(e.target.value)}
                        className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminProjTitleEn} *</label>
                      <input
                        type="text"
                        value={pTitleEn}
                        onChange={(e) => setPTitleEn(e.target.value)}
                        className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Dual Descriptions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminProjDescAr} *</label>
                      <textarea
                        rows={2}
                        value={pDescAr}
                        onChange={(e) => setPDescAr(e.target.value)}
                        className="w-full text-xs rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminProjDescEn} *</label>
                      <textarea
                        rows={2}
                        value={pDescEn}
                        onChange={(e) => setPDescEn(e.target.value)}
                        className="w-full text-xs rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Dual Contents (Long detail overs) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminProjContAr} *</label>
                      <textarea
                        rows={5}
                        value={pContAr}
                        onChange={(e) => setPContAr(e.target.value)}
                        className="w-full text-xs rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminProjContEn} *</label>
                      <textarea
                        rows={5}
                        value={pContEn}
                        onChange={(e) => setPContEn(e.target.value)}
                        className="w-full text-xs rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Image link, Category options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white">{t.adminProjImage} *</label>
                      <input
                        type="url"
                        value={pImage}
                        onChange={(e) => setPImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                        required
                      />
                      <div className="border border-dashed border-white/15 hover:border-brand-accent rounded-2xl bg-black/10 p-3 text-center cursor-pointer transition-all relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const input = e.target;
                            const file = input.files?.[0];
                            if (!file) return;
                            (async () => {
                              try {
                                const { dataUrl, bytes } = await compressImage(file);
                                setPImage(dataUrl);
                                const kb = Math.round(bytes / 1024);
                                showFeedback(isRtl
                                  ? `✓ تم ضغط وتحديث صورة المشروع بنجاح (${kb}KB مضغوط)`
                                  : `✓ Project image compressed & updated (${kb}KB)`);
                              } catch (err: any) {
                                const msg = err instanceof ImageValidationError
                                  ? err.message
                                  : (isRtl ? 'تعذّر معالجة الصورة، جرّب صورة أخرى.' : 'Could not process the image, try another.');
                                showFeedback(`⚠ ${msg}`);
                              } finally {
                                input.value = '';
                              }
                            })();
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-[11px] text-white/70">
                          <p className="font-bold text-brand-accent mb-0.5">{isRtl ? "أو اضغط هنا لرفع صورة من جهازك" : "Or click here to upload an image from your device"}</p>
                          <p className="text-[9px] text-white/40">Base64 encoded directly to database (max 2MB recommended)</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminProjDate} *</label>
                      <input
                        type="text"
                        value={pDate}
                        onChange={(e) => setPDate(e.target.value)}
                        placeholder="2026-06"
                        className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Categories translations / URL direct links */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminProjCatAr} *</label>
                      <input
                        type="text"
                        value={pCatAr}
                        onChange={(e) => setPCatAr(e.target.value)}
                        className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminProjCatEn} *</label>
                      <input
                        type="text"
                        value={pCatEn}
                        onChange={(e) => setPCatEn(e.target.value)}
                        className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminProjLink}</label>
                      <input
                        type="url"
                        value={pLink}
                        onChange={(e) => setPLink(e.target.value)}
                        placeholder="https://..."
                        className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminProjOrder}</label>
                      <input
                        type="number"
                        value={pOrder}
                        onChange={(e) => setPOrder(Number(e.target.value))}
                        className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Public visibility control */}
                  <label className="flex items-center gap-3 w-fit rounded-2xl border border-white/10 bg-white/5 px-4 py-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={pIsVisible}
                      onChange={(e) => setPIsVisible(e.target.checked)}
                      className="sr-only peer"
                    />
                    <span className="w-10 h-6 rounded-full bg-white/15 peer-checked:bg-brand-accent relative transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4 rtl:peer-checked:after:-translate-x-4" />
                    <span className="flex items-center gap-2 text-xs font-bold text-white">
                      {pIsVisible ? <Eye className="w-4 h-4 text-brand-accent" /> : <EyeOff className="w-4 h-4 text-white/50" />}
                      {pIsVisible ? (isRtl ? 'إظهار المشروع في المعرض' : 'Show project in portfolio') : (isRtl ? 'إخفاء المشروع من المعرض' : 'Hide project from portfolio')}
                    </span>
                  </label>

                  {/* ── Professional Product Showcase Fields ── */}
                  <div className="p-5 rounded-[24px] bg-brand-accent/5 border border-brand-accent/10 space-y-5">
                    <h4 className="text-xs font-bold text-[#1C99ED] uppercase tracking-widest font-mono flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      {isRtl ? 'خصائص المنتج الاحترافية' : 'Professional Product Showcase Fields'}
                    </h4>

                    {/* Product Type, Status, Accent Color, Featured */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'نوع المنتج' : 'Product Type'}</label>
                        <select value={pProductType || 'system'} onChange={(e) => setPProductType(e.target.value as any)} className="w-full text-xs rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none">
                          <option value="system">{isRtl ? 'نظام (System)' : 'System'}</option>
                          <option value="app">{isRtl ? 'تطبيق (App)' : 'Application'}</option>
                          <option value="platform">{isRtl ? 'منصة (Platform)' : 'Platform'}</option>
                          <option value="website">{isRtl ? 'موقع ويب (Website)' : 'Website'}</option>
                          <option value="plugin">{isRtl ? 'إضافة (Plugin)' : 'Plugin'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'حالة المنتج' : 'Product Status'}</label>
                        <select value={pStatus || 'live'} onChange={(e) => setPStatus(e.target.value as any)} className="w-full text-xs rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none">
                          <option value="live">{isRtl ? 'مباشر (Live)' : 'Live'}</option>
                          <option value="beta">{isRtl ? 'تجريبي (Beta)' : 'Beta'}</option>
                          <option value="coming-soon">{isRtl ? 'قريباً (Coming Soon)' : 'Coming Soon'}</option>
                          <option value="archived">{isRtl ? 'مؤرشف (Archived)' : 'Archived'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'لون مميز للمنتج' : 'Accent Color'}</label>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={pAccentColor || '#1C99ED'} onChange={(e) => setPAccentColor(e.target.value)} className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 p-1 cursor-pointer" />
                          <input type="text" value={pAccentColor || '#1C99ED'} onChange={(e) => setPAccentColor(e.target.value)} className="flex-1 text-xs rounded-xl bg-black/40 border border-white/10 p-2.5 text-white font-mono focus:outline-none" />
                        </div>
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 w-fit rounded-xl border border-white/10 bg-white/5 px-4 py-3 cursor-pointer select-none">
                          <input type="checkbox" checked={pIsFeatured} onChange={(e) => setPIsFeatured(e.target.checked)} className="sr-only peer" />
                          <span className="w-9 h-5 rounded-full bg-white/15 peer-checked:bg-yellow-500 relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
                          <span className="text-xs font-bold text-white flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-400" />
                            {isRtl ? 'منتج مميز' : 'Featured'}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'التقنيات المستخدمة (مفصولة بفاصلة)' : 'Technologies (comma-separated)'}</label>
                      <input
                        type="text"
                        value={pTechnologies}
                        onChange={(e) => setPTechnologies(e.target.value)}
                        placeholder="React, Node.js, Firebase, Tailwind"
                        className="w-full text-xs sm:text-sm rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none font-mono"
                      />
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'الميزات الرئيسية (بالعربية - سطر لكل ميزة)' : 'Key Features (Arabic - one per line)'}</label>
                        <textarea rows={3} value={pFeaturesAr} onChange={(e) => setPFeaturesAr(e.target.value)} placeholder={isRtl ? 'ميزة أولى\nميزة ثانية\nميزة ثالثة' : 'Feature 1\nFeature 2\nFeature 3'} className="w-full text-xs rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'الميزات الرئيسية (بالإنجليزية - سطر لكل ميزة)' : 'Key Features (English - one per line)'}</label>
                        <textarea rows={3} value={pFeaturesEn} onChange={(e) => setPFeaturesEn(e.target.value)} placeholder="Feature 1\nFeature 2\nFeature 3" className="w-full text-xs rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none" />
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/70 mb-1.5">{isRtl ? 'المستخدمين' : 'Users'}</label>
                        <input type="text" value={pMetricsUsers} onChange={(e) => setPMetricsUsers(e.target.value)} placeholder="10K+" className="w-full text-xs rounded-lg bg-black/40 border border-white/10 p-2.5 text-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/70 mb-1.5">{isRtl ? 'التقييم' : 'Rating'}</label>
                        <input type="text" value={pMetricsRating} onChange={(e) => setPMetricsRating(e.target.value)} placeholder="4.8" className="w-full text-xs rounded-lg bg-black/40 border border-white/10 p-2.5 text-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/70 mb-1.5">{isRtl ? 'التحميلات' : 'Downloads'}</label>
                        <input type="text" value={pMetricsDownloads} onChange={(e) => setPMetricsDownloads(e.target.value)} placeholder="5K+" className="w-full text-xs rounded-lg bg-black/40 border border-white/10 p-2.5 text-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/70 mb-1.5">{isRtl ? 'وقت التشغيل' : 'Uptime'}</label>
                        <input type="text" value={pMetricsUptime} onChange={(e) => setPMetricsUptime(e.target.value)} placeholder="99.9%" className="w-full text-xs rounded-lg bg-black/40 border border-white/10 p-2.5 text-white focus:outline-none" />
                      </div>
                    </div>
                  </div>

                  {/* Buttons save / cancel */}
                  <div className="flex flex-wrap gap-3 pt-4 justify-end">
                    <button
                      type="button"
                      onClick={closeProjectUI}
                      className="px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-gray-300 font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      {t.adminCancel}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-full bg-[#1C99ED] hover:bg-brand-accent text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md"
                    >
                      {t.adminSave}
                    </button>
                  </div>

                </form>
              </motion.div>
            )}

            {/* List Catalog Table */}
            {!isAddingProject && !editingProject && (
              <div className="overflow-x-auto rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-md">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-[10px] uppercase bg-[#12233D]/40 text-white/90 border-b border-white/10 tracking-widest font-mono">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-center">Image</th>
                      <th scope="col" className="px-6 py-4">{isRtl ? "اسم المشروع" : "Project Title"}</th>
                      <th scope="col" className="px-6 py-4">Category</th>
                      <th scope="col" className="px-6 py-4">Sort</th>
                      <th scope="col" className="px-6 py-4 text-center">{isRtl ? 'الظهور' : 'Visibility'}</th>
                      <th scope="col" className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {projects.map((p) => (
                      <tr key={p.id} className="bg-transparent hover:bg-white/5 transition-all">
                        <td className="px-6 py-3 flex justify-center">
                          <img
                            src={p.image}
                            referrerPolicy="no-referrer"
                            alt={p.titleEn}
                            className="w-14 h-10 object-cover rounded-lg border border-white/10"
                          />
                        </td>
                        <td className="px-6 py-3 font-semibold text-white">
                          <div className="text-sm font-bold">{isRtl ? p.titleAr : p.titleEn}</div>
                          <div className="text-[10px] text-white/50 font-mono mt-0.5">{p.date}</div>
                        </td>
                        <td className="px-6 py-3 text-xs text-brand-accent font-semibold font-mono uppercase tracking-wider">
                          {isRtl ? p.categoryAr : p.categoryEn}
                        </td>
                        <td className="px-6 py-3 font-mono text-xs text-[#1C99ED] font-semibold">
                          {p.sortOrder}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleProjectVisibility(p.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${p.isVisible === false ? 'bg-white/10 text-white/50 hover:bg-brand-accent/15 hover:text-brand-accent' : 'bg-brand-accent/15 text-brand-accent hover:bg-brand-accent hover:text-white'}`}
                            title={p.isVisible === false ? (isRtl ? 'إظهار المشروع' : 'Show project') : (isRtl ? 'إخفاء المشروع' : 'Hide project')}
                          >
                            {p.isVisible === false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{p.isVisible === false ? (isRtl ? 'مخفي' : 'Hidden') : (isRtl ? 'ظاهر' : 'Visible')}</span>
                          </button>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <div className="flex gap-2.5 justify-center items-center">
                            
                            {/* edit trigger */}
                            <button
                              type="button"
                              onClick={() => startEditProject(p)}
                              className="p-2 rounded-xl bg-[#1C99ED]/10 text-[#1C99ED] hover:text-white hover:bg-[#1C99ED] transition-colors cursor-pointer"
                              title={t.adminEditProject}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* delete project */}
                            <button
                              type="button"
                              onClick={() => handleDeleteProject(p.id)}
                              className="p-2 rounded-xl bg-red-500/15 text-red-400 hover:text-white hover:bg-red-500 transition-colors cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* ==================== TAB 2 DETAILS: SERVICES ==================== */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            
            {(editingService || isCreatingService) ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 sm:p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg"
              >
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#1C99ED]" />
                  <span>{isCreatingService ? (isRtl ? "إضافة خدمة رقمية جديدة" : "Add New Digital Service") : (isRtl ? "تعديل الخدمة الرقمية" : "Configure Service")}</span>
                </h3>

                <form onSubmit={handleSaveService} className="space-y-6">
                  
                  {/* AI INTEGRATION FORMULATOR TOOL FOR SERVICE */}
                  <div className="p-5 rounded-[24px] bg-brand-accent/10 border border-brand-accent/20 space-y-3 text-start">
                    <div className="flex items-center gap-2 text-brand-accent">
                      <Sparkles className="w-5 h-5 text-[#1C99ED] animate-pulse" />
                      <span className="text-xs uppercase tracking-wider font-bold font-mono">
                        {isRtl ? "الصياغة والترجمة الذكية للخدمة بالذكاء الاصطناعي" : "AI SERVICE CO-PILOT CONFIGURATOR"}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      {isRtl
                        ? "اكتب مهارة أو موضوعاً وسيقوم المعالج بصياغة تفاصيل الخدمة ووصفها باللغتين العربية والإنجليزية واختيار الأيقونة الأنسب لها تلقائياً!"
                        : "Type a topic or tech keyword and the system will draft professional bilingual descriptions and auto-select matching icon structures!"}
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={servAiKeywords}
                        onChange={(e) => setServAiKeywords(e.target.value)}
                        placeholder={isRtl ? "مثال: مبرمج Full Stack، خبير ألعاب، تصميم بصري..." : "e.g., Full Stack Dev, Game asset creator, Motion expert..."}
                        className="flex-1 text-xs rounded-xl bg-black/40 border border-white/10 p-2.5 text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAiFormulate('service')}
                        disabled={isAiFormulating}
                        className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl bg-brand-primary hover:bg-brand-primary text-white flex items-center gap-1.5 shadow transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
                      >
                        {isAiFormulating ? (
                          <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        <span>{isRtl ? "صياغة البيانات" : "Process Service"}</span>
                      </button>
                    </div>
                    {aiFormulateError && (
                      <div className="text-[10px] text-red-400 font-medium font-mono">
                        ⚠ {aiFormulateError}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminServTitleAr}</label>
                      <input
                        type="text"
                        value={sTitleAr}
                        onChange={(e) => setSTitleAr(e.target.value)}
                        className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminServTitleEn}</label>
                      <input
                        type="text"
                        value={sTitleEn}
                        onChange={(e) => setSTitleEn(e.target.value)}
                        className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminServDescAr}</label>
                      <textarea
                        rows={3}
                        value={sDescAr}
                        onChange={(e) => setSDescAr(e.target.value)}
                        className="w-full text-xs rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminServDescEn}</label>
                      <textarea
                        rows={3}
                        value={sDescEn}
                        onChange={(e) => setSDescEn(e.target.value)}
                        className="w-full text-xs rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminServIcon} (Layout, Layers, Code, Sparkles, Database, Shield, Server)</label>
                    <input
                      type="text"
                      value={sIcon}
                      onChange={(e) => setSIcon(e.target.value)}
                      className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                      required
                    />
                  </div>

                  {/* ── Professional Service Showcase Fields ── */}
                  <div className="p-5 rounded-[24px] bg-brand-accent/5 border border-brand-accent/10 space-y-5">
                    <h4 className="text-xs font-bold text-[#1C99ED] uppercase tracking-widest font-mono flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      {isRtl ? 'خصائص الخدمة الاحترافية' : 'Professional Service Showcase Fields'}
                    </h4>

                    {/* Category, Pricing, Delivery, Popular, Accent */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'التصنيف بالعربية' : 'Category (Arabic)'}</label>
                        <input type="text" value={sCategoryAr} onChange={(e) => setSCategoryAr(e.target.value)} placeholder="تصميم، تطوير، استشارات..." className="w-full text-xs rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'التصنيف بالإنجليزية' : 'Category (English)'}</label>
                        <input type="text" value={sCategoryEn} onChange={(e) => setSCategoryEn(e.target.value)} placeholder="Design, Development, Consulting" className="w-full text-xs rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'فئة الخدمة' : 'Pricing Tier'}</label>
                        <select value={sPricingTier || 'standard'} onChange={(e) => setSPricingTier(e.target.value as any)} className="w-full text-xs rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none">
                          <option value="basic">{isRtl ? 'أساسي (Basic)' : 'Basic'}</option>
                          <option value="standard">{isRtl ? 'قياسي (Standard)' : 'Standard'}</option>
                          <option value="premium">{isRtl ? 'متقدم (Premium)' : 'Premium'}</option>
                          <option value="enterprise">{isRtl ? 'مؤسسي (Enterprise)' : 'Enterprise'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'مدة التسليم بالعربية' : 'Delivery Time (Arabic)'}</label>
                        <input type="text" value={sDeliveryTimeAr} onChange={(e) => setSDeliveryTimeAr(e.target.value)} placeholder="2-4 أسابيع" className="w-full text-xs rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'مدة التسليم بالإنجليزية' : 'Delivery Time (English)'}</label>
                        <input type="text" value={sDeliveryTimeEn} onChange={(e) => setSDeliveryTimeEn(e.target.value)} placeholder="2-4 weeks" className="w-full text-xs rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'لون مميز' : 'Accent Color'}</label>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={sAccentColor || '#1C99ED'} onChange={(e) => setSAccentColor(e.target.value)} className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 p-1 cursor-pointer" />
                          <input type="text" value={sAccentColor || '#1C99ED'} onChange={(e) => setSAccentColor(e.target.value)} className="flex-1 text-xs rounded-xl bg-black/40 border border-white/10 p-2.5 text-white font-mono focus:outline-none" />
                        </div>
                      </div>
                    </div>

                    {/* Popular toggle */}
                    <label className="flex items-center gap-2 w-fit rounded-xl border border-white/10 bg-white/5 px-4 py-3 cursor-pointer select-none">
                      <input type="checkbox" checked={sIsPopular} onChange={(e) => setSIsPopular(e.target.checked)} className="sr-only peer" />
                      <span className="w-9 h-5 rounded-full bg-white/15 peer-checked:bg-yellow-500 relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400" />
                        {isRtl ? 'خدمة مميزة' : 'Popular Service'}
                      </span>
                    </label>

                    {/* Technologies */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'الأدوات والتقنيات (مفصولة بفاصلة)' : 'Technologies (comma-separated)'}</label>
                      <input type="text" value={sTechnologies} onChange={(e) => setSTechnologies(e.target.value)} placeholder="Figma, React, Adobe XD, Tailwind" className="w-full text-xs rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none font-mono" />
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'المخرجات والdelivrables (بالعربية - سطر لكل ميزة)' : 'Deliverables (Arabic - one per line)'}</label>
                        <textarea rows={3} value={sFeaturesAr} onChange={(e) => setSFeaturesAr(e.target.value)} placeholder={isRtl ? 'مخرج أول\nمخرج ثاني\nمخرج ثالث' : 'Deliverable 1\nDeliverable 2\nDeliverable 3'} className="w-full text-xs rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'المخرجات والdelivrables (بالإنجليزية - سطر لكل ميزة)' : 'Deliverables (English - one per line)'}</label>
                        <textarea rows={3} value={sFeaturesEn} onChange={(e) => setSFeaturesEn(e.target.value)} placeholder="Deliverable 1\nDeliverable 2\nDeliverable 3" className="w-full text-xs rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none" />
                      </div>
                    </div>

                    {/* Process Steps */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'مراحل العمل (بالعربية - سطر لكل مرحلة)' : 'Work Process (Arabic - one per line)'}</label>
                        <textarea rows={3} value={sProcessAr} onChange={(e) => setSProcessAr(e.target.value)} placeholder={isRtl ? 'مرحلة أولى\nمرحلة ثانية\nمرحلة ثالثة' : 'Step 1\nStep 2\nStep 3'} className="w-full text-xs rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? 'مراحل العمل (بالإنجليزية - سطر لكل مرحلة)' : 'Work Process (English - one per line)'}</label>
                        <textarea rows={3} value={sProcessEn} onChange={(e) => setSProcessEn(e.target.value)} placeholder="Step 1\nStep 2\nStep 3" className="w-full text-xs rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none" />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/70 mb-1.5">{isRtl ? 'مشاريع مكتملة' : 'Projects Completed'}</label>
                        <input type="text" value={sStatsProjects} onChange={(e) => setSStatsProjects(e.target.value)} placeholder="35+" className="w-full text-xs rounded-lg bg-black/40 border border-white/10 p-2.5 text-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/70 mb-1.5">{isRtl ? 'نسبة الرضا' : 'Satisfaction Rate'}</label>
                        <input type="text" value={sStatsSatisfaction} onChange={(e) => setSStatsSatisfaction(e.target.value)} placeholder="98%" className="w-full text-xs rounded-lg bg-black/40 border border-white/10 p-2.5 text-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/70 mb-1.5">{isRtl ? 'أيام التسليم' : 'Avg Delivery Days'}</label>
                        <input type="text" value={sStatsDeliveryDays} onChange={(e) => setSStatsDeliveryDays(e.target.value)} placeholder="18" className="w-full text-xs rounded-lg bg-black/40 border border-white/10 p-2.5 text-white focus:outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingService(null);
                        setIsCreatingService(false);
                        setSTitleAr('');
                        setSTitleEn('');
                        setSDescAr('');
                        setSDescEn('');
                        setSIcon('');
                      }}
                      className="px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-gray-300 font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      {t.adminCancel}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-full bg-[#1C99ED] hover:bg-brand-accent text-white font-bold text-xs uppercase tracking-wider shadow cursor-pointer"
                    >
                      {isCreatingService ? (isRtl ? "إنشاء الخدمة" : "Create Service") : t.adminSave}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5 border border-white/10 p-5 rounded-[24px] gap-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-white">
                      {isRtl ? "الخدمات المتاحة حالياً" : "Bilingual Digital Services Map"}
                    </h4>
                    <p className="text-[11px] text-white/50 mt-1">
                      {isRtl ? "تعديل محتويات الخدمات المعروضة على الصفحة الرئيسية أو تسجيل خدمة تفاعلية إضافية." : "Directly manipulate individual service features on public landing section."}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSTitleAr('');
                      setSTitleEn('');
                      setSDescAr('');
                      setSDescEn('');
                      setSIcon('Layers');
                      setSCategoryAr('');
                      setSCategoryEn('');
                      setSFeaturesAr('');
                      setSFeaturesEn('');
                      setSTechnologies('');
                      setSPricingTier('standard');
                      setSDeliveryTimeAr('');
                      setSDeliveryTimeEn('');
                      setSIsPopular(false);
                      setSAccentColor('#1C99ED');
                      setSStatsProjects('');
                      setSStatsSatisfaction('');
                      setSStatsDeliveryDays('');
                      setSProcessAr('');
                      setSProcessEn('');
                      setIsCreatingService(true);
                    }}
                    className="px-4.5 py-2.5 bg-accent hover:opacity-95 text-xs font-bold text-white rounded-full flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-97 select-none"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isRtl ? "أضف خدمة جديدة" : "Add Service"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((item) => (
                    <div key={item.id} className="p-8 rounded-[32px] bg-white/5 border border-white/10 flex flex-col justify-between backdrop-blur-md">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] uppercase font-mono tracking-widest text-[#1C99ED] font-bold block">
                            Icon: {item.icon}
                          </span>
                          <button
                            onClick={() => handleDeleteService(item.id, isRtl ? item.titleAr : item.titleEn)}
                            className="text-white/40 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                            title={isRtl ? "حذف الخدمة" : "Delete Service"}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="text-base font-bold text-white mb-2">
                          {isRtl ? item.titleAr : item.titleEn}
                        </h4>
                        <p className="text-xs text-white/70 leading-relaxed mb-4 line-clamp-2">
                          {isRtl ? item.descriptionAr : item.descriptionEn}
                        </p>
                      </div>

                      <button
                        onClick={() => startEditService(item)}
                        className="mt-4 px-4 py-2 w-fit rounded-full bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isRtl ? "تعديل الخدمة" : "Edit Service"}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================== TAB 3 DETAILS: TEXT CONFIG ==================== */}
        {activeTab === 'text' && (
          <form onSubmit={handleSaveConfig} className="space-y-6 bg-white/5 p-6 sm:p-8 rounded-[32px] border border-white/10 backdrop-blur-lg">
            
            {/* Header with Categorized Sub-tabs */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-white/10 pb-5 mb-8 gap-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono flex items-center gap-2">
                  <Layout className="w-4.5 h-4.5 text-[#1C99ED]" />
                  <span>{isRtl ? "الهوية ومظهر ومكونات الموقع" : "Brand Identity & Site Appearance"}</span>
                </h3>
                <p className="text-[11px] text-white/55 mt-1 leading-relaxed">
                  {isRtl ? "تم تنظيم العناصر في أربعة أقسام فرعية لتعديل كامل خصائص الموقع بسلاسة فائقة" : "Configuration fields separated into clean sub-sections to easily scale branding nodes."}
                </p>
              </div>

              {/* Sub-tab list navigation */}
              <div className="flex flex-wrap gap-1 bg-black/40 p-1 rounded-2xl border border-white/5 self-stretch lg:self-auto">
                {[
                  { id: 'identity', label: isRtl ? "بيانات التعريف الأساسية" : "Core Identity" },
                  { id: 'hero', label: isRtl ? "نصوص الهيرو وبمن نحن" : "Hero & About" },
                  { id: 'media', label: isRtl ? "صورة البروفايل والشعارات والوسائط" : "Media Assets" },
                  { id: 'social', label: isRtl ? "بوابات التواصل" : "Social Portals" },
                  { id: 'stats', label: isRtl ? "إحصائيات الإنجاز" : "Milestones" },
                ].map((sTab) => (
                  <button
                    key={sTab.id}
                    type="button"
                    onClick={() => setActiveTextSubTab(sTab.id as any)}
                    className={`flex-1 lg:flex-none px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                      activeTextSubTab === sTab.id
                        ? 'bg-[#1C99ED] text-white shadow-md'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {sTab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtab Content Panels utilizing elegant container blocks */}
            <AnimatePresence mode="wait">
              {/* SUBTAB 1: CORE IDENTITY */}
              {activeTextSubTab === 'identity' && (
                <motion.div
                  key="subtab-identity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-black/20 p-5 rounded-[24px] border border-white/5">
                    <h4 className="text-xs font-bold text-accent font-mono uppercase tracking-widest mb-4">
                      {isRtl ? "بيانات التعريف البصرية والشعار والمسمى المهني" : "Primary Brand Logo & Signature Identifiers"}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">اسم الشعار بالعربية (Logo Text Ar) *</label>
                        <input
                          type="text"
                          value={cLogoAr}
                          onChange={(e) => setCLogoAr(e.target.value)}
                          className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">اسم الشعار بالإنجليزية (Logo Text En) *</label>
                        <input
                          type="text"
                          value={cLogoEn}
                          onChange={(e) => setCLogoEn(e.target.value)}
                          className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">لون السمة الرئيسي (Accent Color) *</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={cAccent}
                            onChange={(e) => setCAccent(e.target.value)}
                            className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 p-1 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={cAccent}
                            onChange={(e) => setCAccent(e.target.value)}
                            className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white font-mono uppercase focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-white/5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">الاسم العربي الأول والأخير (Name Ar) *</label>
                        <input
                          type="text"
                          value={cNameAr}
                          onChange={(e) => setCNameAr(e.target.value)}
                          className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">الاسم بالإنجليزية (Name En) *</label>
                        <input
                          type="text"
                          value={cNameEn}
                          onChange={(e) => setCNameEn(e.target.value)}
                          className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">المهنة والمجال بالعربية (Profession Ar) *</label>
                        <input
                          type="text"
                          value={cProfessionAr}
                          onChange={(e) => setCProfessionAr(e.target.value)}
                          className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">المهنة بالإنجليزية (Profession En) *</label>
                        <input
                          type="text"
                          value={cProfessionEn}
                          onChange={(e) => setCProfessionEn(e.target.value)}
                          className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* GLOBAL TYPOGRAPHY / FONT FAMILY SELECTOR */}
                    <div className="mt-6 pt-4 border-t border-white/5">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">
                        {isRtl ? 'نوع الخط العام للموقع (Typography)' : 'Global Website Font (Typography)'}
                      </label>
                      <select
                        value={cFont}
                        onChange={(e) => setCFont(e.target.value)}
                        className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none focus:border-[#1C99ED]"
                      >
                        {FONT_OPTIONS.map((f) => (
                          <option key={f.id} value={f.id}>
                            {isRtl ? f.labelAr : f.labelEn}
                          </option>
                        ))}
                      </select>
                      <p
                        className="mt-2 text-base text-white/70"
                        style={{ fontFamily: getFontById(cFont).family }}
                      >
                        {isRtl ? 'معاينة الخط: ' : 'Preview: '}
                        <span className="font-bold">{getFontById(cFont).preview}</span>
                      </p>
                      <p className="text-[10px] text-white/40 mt-1.5 leading-relaxed">
                        {isRtl
                          ? 'التبديل يُطبَّق فورًا على كامل الواجهة (معاينة حيّة) ويُحفظ عند الضغط على «حفظ التغييرات».'
                          : 'Switching previews instantly across the whole site and persists when you press Save.'}
                      </p>

                      {cFont === CUSTOM_FONT_ID && (
                        <div className="mt-4 p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-white/80 mb-1.5">
                              {isRtl ? 'اسم عائلة الخط (Font Family)' : 'Font Family Name'}
                            </label>
                            <input
                              type="text"
                              value={cCustomFamily}
                              onChange={(e) => setCCustomFamily(e.target.value)}
                              placeholder="Thmanyah Serif Text"
                              className="w-full text-xs rounded-xl bg-black/40 border border-white/10 p-2.5 text-white focus:outline-none font-mono"
                            />
                          </div>
                          <p className="text-[10px] text-white/40 leading-relaxed">
                            {isRtl
                              ? 'ارفع ملفات الخط لكل وزن (الأفضل woff2). الحد الأقصى ~400KB لكل ملف لضمان قبول قاعدة البيانات.'
                              : 'Upload a font file per weight (woff2 preferred). Max ~400KB each to stay within the database limit.'}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] font-semibold text-white/60 mb-1">Regular (400)</label>
                              <input
                                type="file"
                                accept=".woff2,.woff,.ttf,.otf"
                                onChange={(e) => setCfRegular(e.target.files?.[0] || null)}
                                className="w-full text-[10px] text-white/70 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-[#1C99ED] file:text-white file:cursor-pointer cursor-pointer"
                              />
                              {cfRegular && <span className="text-[9px] text-emerald-400 block mt-1 truncate">{cfRegular.name}</span>}
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-white/60 mb-1">Medium (500)</label>
                              <input
                                type="file"
                                accept=".woff2,.woff,.ttf,.otf"
                                onChange={(e) => setCfMedium(e.target.files?.[0] || null)}
                                className="w-full text-[10px] text-white/70 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-[#1C99ED] file:text-white file:cursor-pointer cursor-pointer"
                              />
                              {cfMedium && <span className="text-[9px] text-emerald-400 block mt-1 truncate">{cfMedium.name}</span>}
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-white/60 mb-1">Bold (700)</label>
                              <input
                                type="file"
                                accept=".woff2,.woff,.ttf,.otf"
                                onChange={(e) => setCfBold(e.target.files?.[0] || null)}
                                className="w-full text-[10px] text-white/70 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-[#1C99ED] file:text-white file:cursor-pointer cursor-pointer"
                              />
                              {cfBold && <span className="text-[9px] text-emerald-400 block mt-1 truncate">{cfBold.name}</span>}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <button
                              type="button"
                              onClick={handleUploadCustomFont}
                              disabled={cfUploading}
                              className="px-4 py-2 rounded-full bg-[#1C99ED] hover:bg-brand-accent text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {cfUploading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                              <span>{isRtl ? 'رفع وتطبيق الخط' : 'Upload & Apply'}</span>
                            </button>
                            {customFontStatus && (
                              <button
                                type="button"
                                onClick={handleRemoveCustomFont}
                                className="px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all"
                              >
                                {isRtl ? 'حذف الخط المرفوع' : 'Remove uploaded font'}
                              </button>
                            )}
                          </div>
                          {customFontStatus && (
                            <p className="text-[10px] text-emerald-400">
                              {isRtl ? `✓ الخط الحالي المرفوع والمُطبَّق: ${customFontStatus}` : `✓ Currently uploaded & active: ${customFontStatus}`}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SUBTAB 2: HERO & NARRATIVE ABOUT */}
              {activeTextSubTab === 'hero' && (
                <motion.div
                  key="subtab-hero"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-black/20 p-5 rounded-[24px] border border-white/5 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-accent font-mono uppercase tracking-widest mb-4">
                        {isRtl ? "نصوص وتحية قسم الصدر (Hero Header Headlines)" : "Hero Header Greetings & Prominent Headlines"}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminContHeroAr} *</label>
                          <input
                            type="text"
                            value={cHeroAr}
                            onChange={(e) => setCHeroAr(e.target.value)}
                            className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminContHeroEn} *</label>
                          <input
                            type="text"
                            value={cHeroEn}
                            onChange={(e) => setCHeroEn(e.target.value)}
                            className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? "الوصف الفرعي لقسم الصدر Ar & En" : "Hero Subtitles & Secondary Descriptions"}</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] text-white/50 mb-1">{t.adminContHeroSubAr} *</label>
                          <textarea
                            rows={3}
                            value={cSubAr}
                            onChange={(e) => setCSubAr(e.target.value)}
                            className="w-full text-xs rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none leading-relaxed"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/50 mb-1">{t.adminContHeroSubEn} *</label>
                          <textarea
                            rows={3}
                            value={cSubEn}
                            onChange={(e) => setCSubEn(e.target.value)}
                            className="w-full text-xs rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none leading-relaxed"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <h4 className="text-xs font-bold text-brand-accent font-mono uppercase tracking-widest mb-4">
                        {isRtl ? "السرد التعريفي وقصة المسيرة (About Narrative)" : "Detailed Biographical Biography (About Text)"}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminContAboutAr} *</label>
                          <textarea
                            rows={5}
                            value={cAboutAr}
                            onChange={(e) => setCAboutAr(e.target.value)}
                            className="w-full text-xs rounded-2xl bg-black/40 border border-white/10 p-4 text-white focus:outline-none leading-relaxed"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{t.adminContAboutEn} *</label>
                          <textarea
                            rows={5}
                            value={cAboutEn}
                            onChange={(e) => setCAboutEn(e.target.value)}
                            className="w-full text-xs rounded-2xl bg-black/40 border border-white/10 p-4 text-white focus:outline-none leading-relaxed"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SUBTAB 3: MEDIA ASSETS */}
              {activeTextSubTab === 'media' && (
                <motion.div
                  key="subtab-media"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-black/20 p-5 rounded-[24px] border border-white/5 space-y-6">
                    <h4 className="text-xs font-bold text-accent font-mono uppercase tracking-widest">
                      {isRtl ? "أصول الوسائط وتحميل ملفات الصور المباشرة" : "Digital Brand Assets & Vector Backdrops"}
                    </h4>

                    {/* 1. PERSONAL PROFILE PICTURE */}
                    <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-4">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white">
                        {isRtl ? "صورة الملف الشخصي (Profile Image File / Link)" : "Profile Image (Web URL or device upload) *"}
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <input
                            type="url"
                            value={cProfile}
                            onChange={(e) => setCProfile(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none font-mono"
                          />
                          
                          {/* Profile Local Uploader */}
                          <div className="border border-dashed border-white/15 hover:border-brand-accent rounded-2xl bg-black/20 p-4 text-center cursor-pointer transition-all relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const input = e.target;
                                const file = input.files?.[0];
                                if (!file) return;
                                (async () => {
                                  try {
                                    const { dataUrl, bytes } = await compressImage(file, { maxDim: 600, quality: 0.8 });
                                    setCProfile(dataUrl);
                                    const kb = Math.round(bytes / 1024);
                                    showFeedback(isRtl
                                      ? `✓ تم ضغط وتحديث صورة البروفايل (${kb}KB مضغوط)`
                                      : `✓ Profile image compressed & updated (${kb}KB)`);
                                  } catch (err: any) {
                                    const msg = err instanceof ImageValidationError
                                      ? err.message
                                      : (isRtl ? 'تعذّر معالجة الصورة، جرّب صورة أخرى.' : 'Could not process the image, try another.');
                                    showFeedback(`⚠ ${msg}`);
                                  } finally {
                                    input.value = '';
                                  }
                                })();
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="text-[11px] text-white/70">
                              <p className="font-bold text-accent mb-0.5">{isRtl ? "اضغط لتحميل صورة للبروفايل من جهازك" : "Click here to upload profile pic file"}</p>
                              <p className="text-[9px] text-white/40">Highly recommended: square Portrait ratio (max 3MB)</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex h-full items-center justify-center bg-black/35 rounded-2xl p-4 border border-white/5 min-h-[120px]">
                          {cProfile ? (
                            <div className="text-center">
                              <img
                                src={cProfile}
                                alt="Profile preview"
                                className="w-16 h-16 object-cover rounded-full border border-white/10 mx-auto"
                                onError={(e) => {
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop";
                                }}
                              />
                              <span className="text-[9px] text-white/50 block font-mono mt-2 truncate max-w-[180px] mx-auto">{cProfile.slice(0, 35)}...</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-white/30 font-mono">{isRtl ? "لا توجد صورة بروفايل حالياً" : "No pre-existing profile asset"}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Logo & Hero sections uploaders row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* 2. LOGO IMAGE UPLOADER */}
                      <div className="space-y-3 bg-black/20 p-5 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center">
                          <label className="block text-xs uppercase tracking-wider font-semibold text-white">
                            {isRtl ? "تحميل صورة الشعار (Logo Brand Image)" : "Logo Brand Image"}
                          </label>
                          {cLogoImg && (
                            <button
                              type="button"
                              onClick={() => setCLogoImg('')}
                              className="text-[10px] text-red-400 hover:text-red-300 transition-colors font-mono uppercase font-bold"
                            >
                              {isRtl ? "إلغاء الصورة" : "Clear logo"}
                            </button>
                          )}
                        </div>
                        <input
                          type="url"
                          value={cLogoImg}
                          onChange={(e) => setCLogoImg(e.target.value)}
                          placeholder="https://example.com/logo.png"
                          className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none font-mono"
                        />
                        <div className="border border-dashed border-white/15 hover:border-brand-accent rounded-2xl bg-black/10 p-4 text-center cursor-pointer transition-all relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const input = e.target;
                              const file = input.files?.[0];
                              if (!file) return;
                              (async () => {
                                try {
                                  const { dataUrl, bytes } = await compressImage(file, { maxDim: 500, quality: 0.85 });
                                  setCLogoImg(dataUrl);
                                  const kb = Math.round(bytes / 1024);
                                  showFeedback(isRtl
                                    ? `✓ تم ضغط وتحديث شعار العلامة (${kb}KB مضغوط)`
                                    : `✓ Brand logo compressed & updated (${kb}KB)`);
                                } catch (err: any) {
                                  const msg = err instanceof ImageValidationError
                                    ? err.message
                                    : (isRtl ? 'تعذّر معالجة الصورة، جرّب صورة أخرى.' : 'Could not process the image, try another.');
                                  showFeedback(`⚠ ${msg}`);
                                } finally {
                                  input.value = '';
                                }
                              })();
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="text-[11px] text-white/70">
                            <p className="font-bold text-brand-accent mb-0.5">{isRtl ? "اسحب أو اضغط لتحميل صورة الشعار" : "Drag or click to upload logo file"}</p>
                            <p className="text-[9px] text-white/40">Recommended: square SVG, transparent PNG</p>
                          </div>
                        </div>

                        {/* Logo Image Preview Panel */}
                        <div className="flex items-center justify-center p-3 bg-black/35 rounded-xl border border-white/5 min-h-[64px]">
                          {cLogoImg ? (
                            <div className="text-center flex items-center gap-3">
                              <img
                                src={cLogoImg}
                                alt="Brand Logo preview"
                                className="h-8 w-auto object-contain bg-white/10 rounded-lg p-1 border border-white/10"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <span className="text-[9px] text-white/50 font-mono truncate max-w-[130px]">{cLogoImg.slice(0, 30)}...</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-white/30 font-mono">{isRtl ? "يتم استخدام الشعار النصي الافتراضي حالياً" : "Currently fallback monogram text"}</span>
                          )}
                        </div>
                      </div>

                      {/* 3. HERO BACKGROUND BACKDROP */}
                      <div className="space-y-3 bg-black/20 p-5 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center">
                          <label className="block text-xs uppercase tracking-wider font-semibold text-white">
                            {isRtl ? "خلفية قسم الهيرو (Hero Section Banner)" : "Hero Section Backdrop Image"}
                          </label>
                          {cHeroBgImg && (
                            <button
                              type="button"
                              onClick={() => setCHeroBgImg('')}
                              className="text-[10px] text-red-400 hover:text-red-300 transition-colors font-mono uppercase font-bold"
                            >
                              {isRtl ? "إلغاء الخلفية" : "Clear backdrop"}
                            </button>
                          )}
                        </div>
                        <input
                          type="url"
                          value={cHeroBgImg}
                          onChange={(e) => setCHeroBgImg(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full text-xs sm:text-sm rounded-2xl bg-black/40 border border-white/10 p-3.5 text-white focus:outline-none font-mono"
                        />
                        <div className="border border-dashed border-white/15 hover:border-brand-accent rounded-2xl bg-black/10 p-4 text-center cursor-pointer transition-all relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const input = e.target;
                              const file = input.files?.[0];
                              if (!file) return;
                              (async () => {
                                try {
                                  const { dataUrl, bytes } = await compressImage(file, { maxDim: 1920, quality: 0.7 });
                                  setCHeroBgImg(dataUrl);
                                  const kb = Math.round(bytes / 1024);
                                  showFeedback(isRtl
                                    ? `✓ تم ضغط وتحديث خلفية الهيرو (${kb}KB مضغوط)`
                                    : `✓ Hero background compressed & updated (${kb}KB)`);
                                } catch (err: any) {
                                  const msg = err instanceof ImageValidationError
                                    ? err.message
                                    : (isRtl ? 'تعذّر معالجة الصورة، جرّب صورة أخرى.' : 'Could not process the image, try another.');
                                  showFeedback(`⚠ ${msg}`);
                                } finally {
                                  input.value = '';
                                }
                              })();
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="text-[11px] text-white/70">
                            <p className="font-bold text-brand-accent mb-0.5">{isRtl ? "اسحب أو اضغط لتحميل خلفية الهيرو" : "Drag or click to upload Hero section image"}</p>
                            <p className="text-[9px] text-white/40">Clean abstract backgrounds (max 5MB)</p>
                          </div>
                        </div>

                        {/* Hero background backdrop preview */}
                        <div className="flex items-center justify-center p-2 bg-black/35 rounded-xl border border-white/5 min-h-[64px]">
                          {cHeroBgImg ? (
                            <div className="relative w-full h-10 rounded-lg overflow-hidden border border-white/10 group">
                              <img
                                src={cHeroBgImg}
                                alt="Hero background preview"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-[9px] text-white font-mono truncate p-2">{cHeroBgImg.slice(0, 30)}...</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-white/30 font-mono">{isRtl ? "تدرجات لونية هجينة افتراضية" : "Fallback default ambient shaders"}</span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}

              {/* SUBTAB 4: SOCIAL PORTALS */}
              {activeTextSubTab === 'social' && (
                <motion.div
                  key="subtab-social"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-start"
                >
                  <div className="bg-black/20 p-5 rounded-[24px] border border-white/5 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-accent font-mono uppercase tracking-widest mb-1">
                        {isRtl ? "روابط التواصل الاجتماعي الذكية" : "Dynamic Social Media & Professional Integrations"}
                      </h4>
                      <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                        {isRtl
                          ? "اختر نوع الحساب من القائمة ثم أدخل رابط الحساب للاستفادة الكاملة من أزرار الهيدر والفوتر والاتصال."
                          : "Select the professional network from the list, insert URL below, and build your social profile matrix instantly."}
                      </p>
                    </div>

                    {/* NEW LINK INTAKE form */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-[11px] font-semibold text-white/80 mb-2 font-sans">
                          {isRtl ? "نوع الشبكة / الحساب" : "Account / Platform Type"}
                        </label>
                        <select
                          value={newPlatform}
                          onChange={(e) => setNewPlatform(e.target.value)}
                          className="w-full text-xs rounded-xl bg-black/60 border border-white/10 p-3 text-white focus:outline-none"
                        >
                          <option value="GitHub">GitHub</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Twitter/X">Twitter/X</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Instagram">Instagram</option>
                          <option value="YouTube">YouTube</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Website">Website Portfolio</option>
                          <option value="Snapchat">Snapchat</option>
                          <option value="TikTok">TikTok</option>
                        </select>
                      </div>

                      <div className="md:col-span-2 flex gap-3 items-end">
                        <div className="flex-1">
                          <label className="block text-[11px] font-semibold text-white/80 mb-2 font-sans">
                            {isRtl ? "رابط الحساب الإلكتروني المباشر" : "Direct Profile URL Link"}
                          </label>
                          <input
                            type="url"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            placeholder="https://example.com/username"
                            className="w-full text-xs rounded-xl bg-black/60 border border-white/10 p-3 text-white focus:outline-none font-mono"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (!newUrl.trim()) return;
                            const newLinkItem: SocialLink = {
                              id: String(Date.now()),
                              platform: newPlatform,
                              url: newUrl.trim()
                            };
                            const updatedLinks = [...cSocialLinks, newLinkItem];
                            setCSocialLinks(updatedLinks);
                            setNewUrl('');

                            // Also sync legacy properties for backward compatibility
                            if (newPlatform === 'GitHub') setCSocGH(newUrl.trim());
                            if (newPlatform === 'LinkedIn') setCSocLN(newUrl.trim());
                            if (newPlatform === 'Twitter/X') setCSocTW(newUrl.trim());
                            if (newPlatform === 'Facebook') setCSocFB(newUrl.trim());
                            if (newPlatform === 'Instagram') setCSocIG(newUrl.trim());
                            
                            showFeedback(isRtl ? `تمت إضافة رابط ${newPlatform} بنجاح!` : `${newPlatform} link registered! Remember to save.`);
                          }}
                          className="px-5 py-3 rounded-xl bg-accent hover:opacity-95 text-xs text-white font-bold whitespace-nowrap cursor-pointer transition-all shadow-md font-sans"
                        >
                          {isRtl ? "إضافة الرابط" : "Add Link"}
                        </button>
                      </div>
                    </div>

                    {/* ACTIVE SOCIAL LINKS GRID LIST */}
                    <div className="space-y-3 pt-2">
                      <h5 className="text-[10px] font-bold text-white/60 uppercase tracking-wider font-mono">
                        {isRtl ? "قائمة الروابط النشطة الحالية" : "Active Dynamic Connections"}
                      </h5>

                      {cSocialLinks.length === 0 ? (
                        <div className="p-6 text-center rounded-2xl bg-black/10 border border-white/5 text-xs text-white/40 font-sans">
                          {isRtl ? "لم يتم ربط أي شبكة أو حساب بعد" : "No social profiles registered yet. Configure above."}
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {cSocialLinks.map((link) => (
                            <div
                              key={link.id}
                              className="flex items-center justify-between p-3.5 rounded-xl bg-black/35 border border-white/5 hover:border-white/10 transition-all text-start"
                            >
                              <div className="flex-1 min-w-0 pr-3 flex items-center gap-2">
                                <span className="text-[10px] font-bold text-brand-accent font-mono inline-block px-2 py-0.5 rounded bg-brand-accent/10 border border-brand-accent/10">
                                  {link.platform}
                                </span>
                                <input
                                  type="text"
                                  value={link.url}
                                  onChange={(e) => {
                                    const updatedVal = e.target.value;
                                    const updated = cSocialLinks.map(lnk => lnk.id === link.id ? { ...lnk, url: updatedVal } : lnk);
                                    setCSocialLinks(updated);

                                    // legacy sync
                                    if (link.platform === 'GitHub') setCSocGH(updatedVal);
                                    if (link.platform === 'LinkedIn') setCSocLN(updatedVal);
                                    if (link.platform === 'Twitter/X') setCSocTW(updatedVal);
                                    if (link.platform === 'Facebook') setCSocFB(updatedVal);
                                    if (link.platform === 'Instagram') setCSocIG(updatedVal);
                                  }}
                                  className="text-xs text-white bg-transparent outline-none focus:border-b focus:border-white/10 w-full font-mono py-1"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = cSocialLinks.filter(lnk => lnk.id !== link.id);
                                  setCSocialLinks(updated);

                                  // legacy sync clear if matching
                                  if (link.platform === 'GitHub') setCSocGH('');
                                  if (link.platform === 'LinkedIn') setCSocLN('');
                                  if (link.platform === 'Twitter/X') setCSocTW('');
                                  if (link.platform === 'Facebook') setCSocFB('');
                                  if (link.platform === 'Instagram') setCSocIG('');

                                  showFeedback(isRtl ? `تم حذف رابط ${link.platform}` : `Deleted ${link.platform} profile portal.`);
                                }}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500 transition-colors cursor-pointer"
                                title={isRtl ? "إزالة الحساب" : "Remove account Link"}
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SUBTAB 5: MILESTONES / STATISTICS */}
              {activeTextSubTab === 'stats' && (
                <motion.div
                  key="subtab-stats"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-black/20 p-5 rounded-[24px] border border-white/5 space-y-6">
                    <h4 className="text-xs font-bold text-accent font-mono uppercase tracking-widest">
                      {isRtl ? "ترس أرقام وإنجازات مسار الـ CMS" : "Visual Portfolio Stat Metrics & Achievement Counters"}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Stat 1 */}
                      <div className="bg-black/25 p-5 rounded-2xl border border-white/5 space-y-3">
                        <span className="text-[10px] text-white/50 block font-mono">STATISTIC NODE 1</span>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/80 mb-1">الرقم / القيمة (Value)</label>
                          <input type="text" value={cStat1Value} onChange={(e) => setCStat1Value(e.target.value)} className="w-full text-xs rounded-xl bg-black/40 border border-white/15 p-2 text-white font-mono" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/80 mb-1">العنوان بالعربية (Label Ar)</label>
                          <input type="text" value={cStat1LabelAr} onChange={(e) => setCStat1LabelAr(e.target.value)} className="w-full text-xs rounded-xl bg-black/40 border border-white/15 p-2 text-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/80 mb-1">العنوان بالإنجليزية (Label En)</label>
                          <input type="text" value={cStat1LabelEn} onChange={(e) => setCStat1LabelEn(e.target.value)} className="w-full text-xs rounded-xl bg-black/40 border border-white/15 p-2 text-white" />
                        </div>
                      </div>

                      {/* Stat 2 */}
                      <div className="bg-black/25 p-5 rounded-2xl border border-white/5 space-y-3">
                        <span className="text-[10px] text-white/50 block font-mono">STATISTIC NODE 2</span>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/80 mb-1">الرقم / القيمة (Value)</label>
                          <input type="text" value={cStat2Value} onChange={(e) => setCStat2Value(e.target.value)} className="w-full text-xs rounded-xl bg-black/40 border border-white/15 p-2 text-white font-mono" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/80 mb-1">العنوان بالعربية (Label Ar)</label>
                          <input type="text" value={cStat2LabelAr} onChange={(e) => setCStat2LabelAr(e.target.value)} className="w-full text-xs rounded-xl bg-black/40 border border-white/15 p-2 text-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/80 mb-1">العنوان بالإنجليزية (Label En)</label>
                          <input type="text" value={cStat2LabelEn} onChange={(e) => setCStat2LabelEn(e.target.value)} className="w-full text-xs rounded-xl bg-black/40 border border-white/15 p-2 text-white" />
                        </div>
                      </div>

                      {/* Stat 3 */}
                      <div className="bg-black/25 p-5 rounded-2xl border border-white/5 space-y-3">
                        <span className="text-[10px] text-white/50 block font-mono">STATISTIC NODE 3</span>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/80 mb-1">الرقم / القيمة (Value)</label>
                          <input type="text" value={cStat3Value} onChange={(e) => setCStat3Value(e.target.value)} className="w-full text-xs rounded-xl bg-black/40 border border-white/15 p-2 text-white font-mono" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/80 mb-1">العنوان بالعربية (Label Ar)</label>
                          <input type="text" value={cStat3LabelAr} onChange={(e) => setCStat3LabelAr(e.target.value)} className="w-full text-xs rounded-xl bg-black/40 border border-white/15 p-2 text-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/80 mb-1">العنوان بالإنجليزية (Label En)</label>
                          <input type="text" value={cStat3LabelEn} onChange={(e) => setCStat3LabelEn(e.target.value)} className="w-full text-xs rounded-xl bg-black/40 border border-white/15 p-2 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* General submit actions pinned neatly inside text configuration layout */}
            <div className="flex justify-end pt-5 border-t border-white/10 gap-3">
              <button
                type="submit"
                id="admin-save-config-btn"
                className="px-6 py-2.5 rounded-full bg-accent hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md select-none flex items-center gap-1.5 transition-all active:scale-98"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{t.adminSave}</span>
              </button>
            </div>

          </form>
        )}

        {/* ==================== TAB 5 DETAILS: INTELLIGENT AI PLANNING ADVISOR ==================== */}
        {activeTab === 'ai' && (
          <form onSubmit={handleSaveConfig} className="space-y-6 bg-white/5 p-6 sm:p-8 rounded-[32px] border border-white/10 backdrop-blur-lg text-start">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono border-b border-white/10 pb-3">
              {isRtl ? "إدارة مستشار التخطيط ومطابقة المشاريع الذكي" : "Configure Intelligent AI Matchmaker Advisor"}
            </h3>
            
            <p className="text-xs text-white/60 leading-relaxed mb-4">
              {isRtl ? "هنا يمكنك تحديد الإرشادات والنطاق والسياق الذي يتبعه مستشار التخطيط البرمجي الذكي عند الرد على العملاء لترتيب مشاريعهم حسب اهتماماتك الفنية والجمالية." : "Define custom prompt instructions, active matching behaviors or standard starting orientations that direct the interactive AI planning advisor."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? "توجيهات فكر المستشار بالعربية" : "Advisor System Persona (Arabic)"}</label>
                <textarea
                  rows={4}
                  value={cAIPromptAr}
                  onChange={(e) => setcAIPromptAr(e.target.value)}
                  className="w-full text-xs rounded-2xl bg-black/40 border border-white/10 p-4 text-white focus:outline-none lg:leading-relaxed font-sans"
                  placeholder="نظام مستشار التخطيط الذكي - نشط وجاهز للتحليل الفوري..."
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">{isRtl ? "توجيهات فكر المستشار بالإنجليزية" : "Advisor System Persona (English)"}</label>
                <textarea
                  rows={4}
                  value={cAIPromptEn}
                  onChange={(e) => setcAIPromptEn(e.target.value)}
                  className="w-full text-xs rounded-2xl bg-black/40 border border-white/10 p-4 text-white focus:outline-none lg:leading-relaxed font-sans"
                  placeholder="Intelligent Project Advisor - Active, responsive..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-accent hover:opacity-90 font-bold text-white text-xs uppercase tracking-wider cursor-pointer shadow-md"
              >
                {t.adminSave}
              </button>
            </div>
          </form>
        )}

        {/* ==================== TAB: ANALYTICS (extracted component with real data) ==================== */}
        {activeTab === 'analytics' && (
          <AdminAnalytics
            messages={messages}
            projects={projects}
            services={services}
            skills={skills}
            reviews={reviews}
            isRtl={isRtl}
          />
        )}

        {/* ==================== TAB 4 DETAILS: CONTACT INBOX MESSAGES ==================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            
            {messages.length === 0 ? (
              <div className="p-12 text-center rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-md">
                <Mail className="w-10 h-10 text-white/40 mx-auto mb-4" />
                <h4 className="text-white/80 font-bold text-sm sm:text-base">{t.adminNoMessages}</h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.map((m) => (
                  <div key={m.id} className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md relative flex flex-col justify-between">
                    
                    <div>
                      {/* Message header */}
                      <div className="flex justify-between items-start gap-2 mb-4 pb-4 border-b border-white/10">
                        <div>
                          <span className="text-sm font-bold text-white">{m.name}</span>
                          <span className="text-[10px] text-white/50 block font-mono mt-0.5">{m.email}</span>
                        </div>
                        <span className="text-[10px] text-white/40 font-mono text-end">{m.date}</span>
                      </div>

                      {/* Subject */}
                      <div className="text-xs bg-[#1C99ED]/10 px-3 py-1.5 rounded-full border border-[#1C99ED]/20 text-[#1C99ED] mb-3 font-semibold uppercase tracking-wider w-fit">
                        {t.adminMsgSubject} <span className="text-white">{m.subject}</span>
                      </div>

                      {/* Message Body details */}
                      <p className="text-xs text-white/80 leading-relaxed font-sans mt-2 mb-6">
                        {m.message}
                      </p>
                    </div>

                    {/* Delete entry trigger */}
                    <button
                      onClick={() => handleDeleteMessage(m.id)}
                      className="px-4 py-2 w-fit rounded-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer select-none border border-red-500/20"
                    >
                      <Trash className="w-3.5 h-3.5" />
                      <span>{m.id === 'system-seed' ? (isRtl ? "تهيئة" : "Reset Seed") : t.adminDeleteMsg}</span>
                    </button>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ==================== TAB 5 DETAILS: SMART INTENTIONAL PLANNING ADVISOR REQUESTS ==================== */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-6 rounded-[24px] border border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-sans">
                  <Sparkles className="w-5 h-5 text-warning animate-pulse" />
                  <span>{isRtl ? "إدارة طلبات مستشار التخطيط الذكي" : "Smart Design Requests Registry"}</span>
                </h3>
                <p className="text-xs text-white/50 mt-1 leading-relaxed font-sans">
                  {isRtl
                    ? "تلقي ومعالجة طلبات التصميم المُرسلة من العملاء متضمنة كافة الأساسيات المطلوبة وتقرير الذكاء الاصطناعي الاستشاري."
                    : "Review, manage, and process design ideas submitted interactively by clients together with computed AI advices."}
                </p>
              </div>

              {/* Seed or Clear all requests utility */}
              {designRequests.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(isRtl ? "هل أنت متأكد من مسح جميع طلبات التخطيط الذكية المودعة؟" : "Are you sure you want to purge all stored smart design requests?")) {
                      localStorage.setItem('malek_design_requests', JSON.stringify([]));
                      setDesignRequests([]);
                      setSavedConfirmModal({
                        isOpen: true,
                        title: isRtl ? "تم تفريغ السجل" : "Registry Purged",
                        message: isRtl ? "تم مسح كافة طلبات التخطيط الذكية من الذاكرة المحلية بنجاح." : "All smart planning requests have been cleared from local state.",
                        type: "deleted"
                      });
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-full cursor-pointer transition-all flex items-center gap-1 font-sans"
                >
                  <Trash className="w-3.5 h-3.5" />
                  <span>{isRtl ? "تفريغ السجل بالكامل" : "Purge All Requests"}</span>
                </button>
              )}
            </div>

            {designRequests.length === 0 ? (
              <div className="p-12 text-center rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-md">
                <Brain className="w-10 h-10 text-white/30 mx-auto mb-4 animate-bounce" />
                <h4 className="text-white/80 font-bold text-sm sm:text-base font-sans">
                  {isRtl ? "سجل طلبات التخطيط الذكية فارغ حالياً" : "No Smart Design Requests Register"}
                </h4>
                <p className="text-xs text-white/50 max-w-sm mx-auto mt-2 leading-relaxed font-sans">
                  {isRtl
                    ? "عندما يقوم العملاء بملء نموذج مستشار التخطيط الذكي والموافقة عليه في الصفحة الرئيسية، سيتم إدراج طلباتهم الرقمية هنا فوراً."
                    : "Requests with chosen styling choices and target scopes will render here in real-time once verified by clients."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {designRequests.map((req) => (
                  <div key={req.id} className="p-6 sm:p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden transition-all hover:border-white/20">
                    
                    {/* Corner ID and Status indicator */}
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-6 pb-4 border-b border-white/10">
                      <div>
                        <span className="text-xs bg-brand-accent/20 text-brand-accent font-mono font-bold px-3 py-1 rounded-full border border-brand-accent/30">
                          {req.id}
                        </span>
                        <span className="text-[10px] text-white/40 font-mono ml-2">
                          {req.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 font-sans">
                        <span className={`text-[10px] uppercase font-mono font-bold px-3 py-1 rounded-full ${
                          req.status === 'processed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-warning/20 text-warning border border-warning/30'
                        }`}>
                          {req.status === 'processed'
                            ? (isRtl ? "مكتمل ومعالج ✓" : "Processed ✓")
                            : (isRtl ? "قيد الانتظار ⏱" : "Pending Action ⏱")}
                        </span>

                        {/* Status Toggle Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = designRequests.map((r) => {
                              if (r.id === req.id) {
                                return { ...r, status: r.status === 'processed' ? 'pending' : 'processed' };
                              }
                              return r;
                            });
                            localStorage.setItem('malek_design_requests', JSON.stringify(updated));
                            setDesignRequests(updated);
                            setSavedConfirmModal({
                              isOpen: true,
                              title: isRtl ? "تم تحديث حالة الطلب" : "Request Status Updated",
                              message: isRtl 
                                ? `تم تحديث حالة الطلب الرقمي ${req.id} بنجاح إلى المعالجة المنشودة.` 
                                : `Visual planning request ${req.id} has been successfully updated.`,
                              type: "config_saved"
                            });
                          }}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all border ${
                            req.status === 'processed'
                              ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                              : 'bg-emerald-500 hover:opacity-95 text-white border-emerald-600'
                          }`}
                        >
                          {req.status === 'processed' ? (isRtl ? "إعادة فتح الطلب" : "Re-open Request") : (isRtl ? "إكمال ومعالجة الآن" : "Mark as Processed")}
                        </button>
                      </div>
                    </div>

                    {/* Left/Right grid containing client details & design basics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-start mb-6 font-sans">
                      
                      {/* Client Bio & Core Request details */}
                      <div className="space-y-3 bg-black/20 p-5 rounded-2xl border border-white/5">
                        <h4 className="text-xs font-bold text-accent uppercase tracking-wider">
                          {isRtl ? "بيانات التواصل الشخصية" : "Client Contact Bio"}
                        </h4>
                        
                        <div className="space-y-1.5 text-xs font-sans">
                          <div>
                            <span className="text-white/40">{isRtl ? "اسم العميل: " : "Client Name: "}</span>
                            <span className="text-white font-bold">{req.clientName}</span>
                          </div>
                          <div>
                            <span className="text-white/40">{isRtl ? "البريد الإلكتروني: " : "Email Address: "}</span>
                            <a href={`mailto:${req.clientEmail}`} className="text-brand-accent hover:underline font-mono">{req.clientEmail}</a>
                          </div>
                          <div>
                            <span className="text-white/40">{isRtl ? "رقم الهاتف / واتساب: " : "Phone / WhatsApp: "}</span>
                            <a href={`tel:${req.clientPhone}`} className="text-emerald-400 hover:underline font-mono">{req.clientPhone}</a>
                          </div>
                        </div>

                        {req.clientNotes && (
                          <div className="pt-2 border-t border-white/5 font-sans">
                            <span className="text-white/40 text-[10px] block mb-1">{isRtl ? "ملاحظات إضافية من العميل:" : "Client Instructions Notes:"}</span>
                            <p className="text-xs text-white/80 italic leading-relaxed">"{req.clientNotes}"</p>
                          </div>
                        )}
                      </div>

                      {/* Design Styling & Hardware Choices */}
                      <div className="space-y-3 bg-black/20 p-5 rounded-2xl border border-white/5">
                        <h4 className="text-xs font-bold text-accent uppercase tracking-wider font-sans">
                          {isRtl ? "الخيارات والأساسيات التصميمية المنتقاة" : "Selected Design Basics"}
                        </h4>

                        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                          <div className="bg-navy-900/20 border border-brand-accent/15 p-2 rounded-xl">
                            <span className="text-white/40 block mb-1 font-sans">{isRtl ? "نوع الخدمة" : "Service"}</span>
                            <span className="text-white font-semibold capitalize font-mono text-[9px] truncate block">
                              {req.basics?.serviceType?.replace('_', ' ') || "N/A"}
                            </span>
                          </div>

                          <div className="bg-navy-900/20 border border-brand-accent/15 p-2 rounded-xl">
                            <span className="text-white/40 block mb-1 font-sans">{isRtl ? "الطابع اللوني" : "Color"}</span>
                            <span className="text-white font-semibold capitalize font-mono text-[9px] truncate block">
                              {req.basics?.colorVibe?.replace('_', ' ') || "N/A"}
                            </span>
                          </div>

                          <div className="bg-navy-900/20 border border-brand-accent/15 p-2 rounded-xl">
                            <span className="text-white/40 block mb-1 font-sans">{isRtl ? "الأسلوب الفني" : "Aesthetic"}</span>
                            <span className="text-white font-semibold capitalize font-mono text-[9px] truncate block">
                              {req.basics?.designStyle?.replace('_', ' ') || "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Desired features list */}
                        {req.basics?.features && req.basics.features.length > 0 && (
                          <div className="pt-2">
                            <span className="text-white/40 text-[10px] block mb-1.5 font-sans">{isRtl ? "الميزات المطلوبة للتنفيذ:" : "Selected Features Matrix:"}</span>
                            <div className="flex flex-wrap gap-1.5 font-mono text-[9px]">
                              {req.basics.features.map((feat: string, idx: number) => (
                                <span key={idx} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-gray-300">
                                  {feat}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Row with initial project description submitted by client */}
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-start mb-4">
                      <span className="text-white/40 text-[10px] block mb-1 font-sans">{isRtl ? "وصف المشروع الأساسي الفكرة المبتدئة:" : "Core User Ideas Context Input:"}</span>
                      <p className="text-xs text-white leading-relaxed font-sans">{req.projectIdea}</p>
                    </div>

                    {/* Collapsible/Readable AI Advisor Recommendation Content */}
                    <div className="bg-brand-accent/5 p-5 rounded-2xl border border-brand-accent/20 text-start sm:p-6 mb-4">
                      <h5 className="text-[11px] font-bold text-[#1C99ED] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>{isRtl ? "توصية مستشار التخطيط الذكي (تقرير الذكاء الاصطناعي)" : "AI Planning Consultation Sheet Proposal:"}</span>
                      </h5>
                      <div className="text-xs text-white/95 leading-relaxed font-sans max-h-52 overflow-y-auto whitespace-pre-wrap pr-2">
                        {req.aiConsultationApproach || (isRtl ? "تقرير فارغ" : "Empty sheet description")}
                      </div>
                    </div>

                    {/* Delete dynamic request trigger */}
                    <div className="text-end font-sans">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(isRtl ? `هل أنت متأكد من مسح طلب ${req.clientName} بشكل نهائي من السجل؟` : `Delete ${req.clientName}'s plan request permanently?`)) {
                            const updated = designRequests.filter((r) => r.id !== req.id);
                            localStorage.setItem('malek_design_requests', JSON.stringify(updated));
                            setDesignRequests(updated);
                            setSavedConfirmModal({
                              isOpen: true,
                              title: isRtl ? "تم حذف الطلب" : "Request Deleted",
                              message: isRtl ? `تمت إزالة طلب العميل ${req.clientName} بنجاح.` : `Client dataset has been erased from storage.`,
                              type: "deleted"
                            });
                          }
                        }}
                        className="px-4 py-2 rounded-full text-xs font-bold text-red-500 hover:text-white bg-red-400/10 hover:bg-red-500 hover:bg-opacity-95 cursor-pointer transition-all border border-red-500/20 inline-flex items-center gap-1"
                      >
                        <Trash className="w-3.5 h-3.5" />
                        <span>{isRtl ? "مسح وحذف للطلب" : "Delete Proposal File"}</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: SKILLS MANAGEMENT PANEL ==================== */}
        {activeTab === 'skills' && (
          <div className="space-y-8 text-start font-sans">
            <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center p-6 bg-white/5 border border-white/10 rounded-3xl">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-brand-accent" />
                  <span>{isRtl ? "ترسانة وإدارة المهارات الإبداعية" : "Dynamic Skills Portfolio CMS"}</span>
                </h3>
                <p className="text-xs text-white/50 mt-1">
                  {isRtl 
                    ? "أضف مهارات جديدة، تحكم بنسب المعرفة المئوية، وسيتم تحديثها تلقائياً على واجهة الموقع والسيرة الذاتية PDF المصدرة."
                    : "Add new skills, adjust proficiency values in real-time, and auto-sync inside resume template exports."
                  }
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form to add a new skill (5 Columns) */}
              <div className="lg:col-span-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                <h4 className="text-sm font-bold text-white mb-4 border-b border-white/10 pb-2">
                  {isRtl ? "إضافة مهارة جديدة" : "Enroll New Skill"}
                </h4>
                <form onSubmit={handleAddSkill} className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="block text-[11px] font-semibold text-white/80 mb-1.5">
                      {isRtl ? "اسم المهارة بالعربية" : "Skill Name (Arabic)"} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSkillNameAr}
                      onChange={(e) => setNewSkillNameAr(e.target.value)}
                      placeholder="مثال: واجهات ريأكت التفاعلية"
                      className="w-full rounded-xl bg-black/40 border border-white/10 p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#1C99ED]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-white/80 mb-1.5">
                      {isRtl ? "اسم المهارة بالإنجليزية" : "Skill Name (English)"} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSkillNameEn}
                      onChange={(e) => setNewSkillNameEn(e.target.value)}
                      placeholder="e.g., React & Typescript Hooks"
                      className="w-full rounded-xl bg-black/40 border border-white/10 p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#1C99ED]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-white/80 mb-1.5">
                      {isRtl ? "التصنيف بالعربية" : "Skill Category (Arabic)"}
                    </label>
                    <input
                      type="text"
                      value={newSkillCategoryAr}
                      onChange={(e) => setNewSkillCategoryAr(e.target.value)}
                      placeholder="تطوير واجهات، تجربة مستخدم، إلخ..."
                      className="w-full rounded-xl bg-black/40 border border-white/10 p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#1C99ED]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-white/80 mb-1.5">
                      {isRtl ? "التصنيف بالإنجليزية" : "Skill Category (English)"}
                    </label>
                    <input
                      type="text"
                      value={newSkillCategoryEn}
                      onChange={(e) => setNewSkillCategoryEn(e.target.value)}
                      placeholder="e.g., Frontend, Design Systems, etc."
                      className="w-full rounded-xl bg-black/40 border border-white/10 p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#1C99ED]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[11px] font-semibold text-white/80">
                        {isRtl ? "النسبة المئوية للمهارة" : "Proficiency Percentage"}
                      </label>
                      <span className="font-mono text-xs font-bold text-accent">{newSkillPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={newSkillPercentage}
                      onChange={(e) => setNewSkillPercentage(Number(e.target.value))}
                      className="w-full accent-brand-accent cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-full bg-accent text-white font-bold text-xs uppercase cursor-pointer hover:opacity-90 transition-all shadow-md mt-2 flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isRtl ? "إضافة المهارة للترسانة" : "Register Skill"}</span>
                  </button>
                </form>
              </div>

              {/* Grid list of current skills with slider editors (8 Columns) */}
              <div className="lg:col-span-8 p-6 bg-white/5 rounded-3xl border border-white/10">
                <h4 className="text-sm font-bold text-white mb-4 border-b border-white/10 pb-2 flex justify-between">
                  <span>{isRtl ? "المهارات الحالية والتحكم بنسبها" : "Active Arsenal & Value Editors"}</span>
                  <span className="text-[11px] font-mono text-white/40 font-normal">Total: {skills.length}</span>
                </h4>

                {skills.length === 0 ? (
                  <div className="p-8 text-center text-white/40 text-xs">
                    {isRtl ? "لا توجد مهارات مسجلة حالياً." : "No registered skills present."}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {skills.map((sk) => (
                      <div key={sk.id} className="p-4 rounded-2xl bg-black/30 border border-white/5 flex flex-col justify-between gap-3">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {isRtl ? sk.nameAr : sk.nameEn}
                            </span>
                            <span className="text-[10px] text-white/45 block mt-0.5">
                              {isRtl ? sk.categoryAr : sk.categoryEn}
                            </span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(isRtl ? `هل أنت متأكد من مسح وإزالة المهارة "${sk.nameAr}"؟` : `Erase skill "${sk.nameEn}" permanently?`)) {
                                handleDeleteSkill(sk.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all cursor-pointer"
                            title={isRtl ? "حذف المهارة" : "Cleanse Skill"}
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Interactive dynamic slider control */}
                        <div className="space-y-1 mt-1">
                          <div className="flex justify-between items-center text-[10px] text-emerald-400 font-mono">
                            <span>{isRtl ? "تعديل النسبة:" : "Edit Value:"}</span>
                            <span className="font-bold">{sk.percentage}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={sk.percentage}
                            onChange={(e) => handleUpdateSkillPercentage(sk.id, Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: CLIENT REVIEWS APPROVAL PAGE ==================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 text-start font-sans">
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-warning animate-pulse" />
                  <span>{isRtl ? "إدارة واعتماد تقييمات قضاء العملاء" : "Clients Lounge / Feedback CMS"}</span>
                </h3>
                <p className="text-xs text-white/50 mt-1">
                  {isRtl 
                    ? "التقييمات الجديدة تصل بحالة 'معلق'. وافق على التقييمات المناسبة لكي تظهر على واجهة الموقع فوراً."
                    : "Moderate client feedback. Approved ratings are instantly promoted onto the index page."
                  }
                </p>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-white/10 bg-white/5">
                <Star className="w-10 h-10 text-white/30 mx-auto mb-4" />
                <h4 className="text-white/80 font-bold text-sm">{isRtl ? "لا توجد تقييمات مودعة حالياً." : "No client ratings received yet."}</h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md relative flex flex-col justify-between">
                    <div>
                      {/* Name Card */}
                      <div className="flex justify-between items-start gap-2 mb-3 pb-3 border-b border-white/5">
                        <div>
                          <span className="text-sm font-bold text-white block">{rev.name}</span>
                          <span className="text-[10px] text-white/40 block font-mono">{rev.date}</span>
                        </div>
                        {/* Rating stars */}
                        <div className="flex gap-0.5 text-warning bg-warning/10 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          {rev.rating}/5
                        </div>
                      </div>

                      <p className="text-xs text-white/80 leading-relaxed italic mb-6">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="flex gap-2.5 pt-2 border-t border-white/5 text-xs font-bold">
                      {/* Toggle status approval */}
                      <button
                        onClick={() => handleToggleReviewStatus(rev.id)}
                        className={`flex-1 py-1.5 rounded-full tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          rev.status === 'approved' 
                            ? 'bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-white' 
                            : 'bg-warning/15 text-warning border border-warning/30 hover:bg-warning hover:text-white'
                        }`}
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>{rev.status === 'approved' ? (isRtl ? "مقبول - إلغاء" : "Approved") : (isRtl ? "قبول ونشر" : "Approve")}</span>
                      </button>

                      {/* Delete review */}
                      <button
                        onClick={() => {
                          if (window.confirm(isRtl ? "هل أنت متأكد من مسح هذا التقييم نهائياً؟" : "Erase review permanently?")) {
                            handleDeleteReview(rev.id);
                          }
                        }}
                        className="p-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                        title={isRtl ? "حذف نهائي" : "Purge permanently"}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: RESUME DOWNLOAD DATA SETUP ==================== */}
        {activeTab === 'resume' && (
          <div className="space-y-6 text-start font-sans">
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-warning" />
                <span>{isRtl ? "إدارة حقول السيرة الذاتية الاحترافية PDF" : "Professional Resume PDF CMS Content"}</span>
              </h3>
              <p className="text-xs text-white/50 mt-1">
                {isRtl 
                  ? "قم بصياغة المسار المهني والمؤهلات العلمية وسيقوم الموقع ببناء ملف PDF فوري للمستخدم مستوحى من هوية الموقع وصورتك الشخصية."
                  : "Draft your career experiences, contact info and education fields dynamically synced to physical PDF layouts."
                }
              </p>
            </div>

            <form onSubmit={handleSaveResumeSetup} className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6 font-sans">
              {/* Contact parameters row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-2">{isRtl ? "رقم الجوال للسيرة" : "Resume Phone Number"}</label>
                  <input
                    type="text"
                    required
                    value={resPhone}
                    onChange={(e) => setResPhone(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-warning"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-2">{isRtl ? "البريد الإلكتروني للسيرة" : "Resume Email"}</label>
                  <input
                    type="email"
                    required
                    value={resEmail}
                    onChange={(e) => setResEmail(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-warning"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-2">{isRtl ? "الموقع الجغرافي" : "Resume Location Address"}</label>
                  <input
                    type="text"
                    required
                    value={resLoc}
                    onChange={(e) => setResLoc(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-warning"
                  />
                </div>
              </div>

              {/* Summary Block row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-2">{isRtl ? "الملخص الفني أو التمهيدي (بالعربية)" : "Resume Brief Summary (Arabic)"}</label>
                  <textarea
                    rows={4}
                    value={resSumAr}
                    onChange={(e) => setResSumAr(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-warning leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-2">{isRtl ? "الملخص الفني أو التمهيدي (بالإنجليزية)" : "Resume Brief Summary (English)"}</label>
                  <textarea
                    rows={4}
                    value={resSumEn}
                    onChange={(e) => setResSumEn(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-warning leading-relaxed"
                  />
                </div>
              </div>

              {/* Experience Paragraphs with HTML structure option */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-white/80">{isRtl ? "المسار المهني والخبرات (بالعربية)" : "Professional Career Experience (Arabic)"}</label>
                    <span className="text-[10px] text-white/40">Multi-line supported</span>
                  </div>
                  <textarea
                    rows={8}
                    required
                    value={resExpAr}
                    onChange={(e) => setResExpAr(e.target.value)}
                    placeholder="اكتوب خبراتك بالترتيب التنازلي التواريخ..."
                    className="w-full text-xs sm:text-sm rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-warning leading-relaxed"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-white/80">{isRtl ? "المسار المهني والخبرات (بالإنجليزية)" : "Professional Career Experience (English)"}</label>
                    <span className="text-[10px] text-white/40 font-mono">Multi-line supported</span>
                  </div>
                  <textarea
                    rows={8}
                    required
                    value={resExpEn}
                    onChange={(e) => setResExpEn(e.target.value)}
                    placeholder="Write your career achievements chronologically..."
                    className="w-full text-xs sm:text-sm rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-warning leading-relaxed"
                  />
                </div>
              </div>

              {/* Education block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-2">{isRtl ? "المؤهلات التعليمية والدراسة (بالعربية)" : "Education History (Arabic)"}</label>
                  <textarea
                    rows={4}
                    required
                    value={resEduAr}
                    onChange={(e) => setResEduAr(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-warning leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-2">{isRtl ? "المؤهلات التعليمية والدراسة (بالإنجليزية)" : "Education History (English)"}</label>
                  <textarea
                    rows={4}
                    required
                    value={resEduEn}
                    onChange={(e) => setResEduEn(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-warning leading-relaxed"
                  />
                </div>
              </div>

              {/* Save Resume setups */}
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-warning to-brand-accent text-white font-bold text-xs uppercase cursor-pointer hover:opacity-95 shadow-lg select-none"
              >
                {isRtl ? "حفظ وتثبيت محتوى السيرة الذاتية" : "Update & Propagate Resume Content live"}
              </button>
            </form>
          </div>
        )}

        {/* ==================== CONFIRMATION MODAL (extracted component) ==================== */}
        {savedConfirmModal && (
          <ConfirmationModal
            isOpen={savedConfirmModal.isOpen}
            title={savedConfirmModal.title}
            message={savedConfirmModal.message}
            type={savedConfirmModal.type}
            onClose={() => setSavedConfirmModal(null)}
            isRtl={isRtl}
          />
        )}

      </div>
    </section>
  );
}
