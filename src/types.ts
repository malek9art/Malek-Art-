export interface Project {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  contentAr: string;
  contentEn: string;
  image: string;
  videoUrl?: string;
  categoryAr: string;
  categoryEn: string;
  link?: string;
  /** Controls whether the project is shown in the public portfolio. */
  isVisible?: boolean;
  date: string;
  sortOrder: number;

  // ── Professional Product Showcase Fields ──
  /** Product type: 'system' | 'app' | 'platform' | 'website' | 'plugin' */
  productType?: 'system' | 'app' | 'platform' | 'website' | 'plugin';
  /** Technology stack tags (e.g. ['React', 'Node.js', 'Firebase']) */
  technologies?: string[];
  /** Key features list */
  featuresAr?: string[];
  featuresEn?: string[];
  /** Product status */
  status?: 'live' | 'beta' | 'coming-soon' | 'archived';
  /** Key metrics */
  metrics?: {
    users?: string;
    rating?: number;
    downloads?: string;
    uptime?: string;
  };
  /** Secondary/gallery images */
  gallery?: string[];
  /** Whether this is a featured/hero product */
  isFeatured?: boolean;
  /** Product accent color override */
  accentColor?: string;
}

export interface Service {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string; // Lucide icon name

  // ── Professional Service Showcase Fields ──
  /** Service category */
  categoryAr?: string;
  categoryEn?: string;
  /** Key deliverables / features */
  featuresAr?: string[];
  featuresEn?: string[];
  /** Tools and technologies used */
  technologies?: string[];
  /** Pricing tier indicator */
  pricingTier?: 'basic' | 'standard' | 'premium' | 'enterprise';
  /** Estimated delivery time */
  deliveryTimeAr?: string;
  deliveryTimeEn?: string;
  /** Service stats */
  stats?: {
    projectsCompleted?: string;
    satisfactionRate?: string;
    avgDeliveryDays?: string;
  };
  /** Custom accent color */
  accentColor?: string;
  /** Whether this is a popular/highlighted service */
  isPopular?: boolean;
  /** Service process steps */
  processAr?: string[];
  processEn?: string[];
}

export interface Skill {
  id: string;
  nameAr: string;
  nameEn: string;
  percentage: number;
  categoryAr: string;
  categoryEn: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

export interface Stat {
  id: string;
  value: string;
  labelAr: string;
  labelEn: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface Testimonial {
  id: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  commentAr: string;
  commentEn: string;
  avatar: string;
}

export interface SiteConfig {
  aboutTextAr: string;
  aboutTextEn: string;
  heroTextAr: string;
  heroTextEn: string;
  heroSubAr: string;
  heroSubEn: string;
  profileImg: string;
  logoImg?: string;
  heroBgImg?: string;
  nameAr?: string;
  nameEn?: string;
  professionAr?: string;
  professionEn?: string;
  logoTextAr?: string;
  logoTextEn?: string;
  accentColor?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialLinkedin?: string;
  socialGithub?: string;
  socialInstagram?: string;
  socialLinks?: SocialLink[];
  stat1Value?: string;
  stat1LabelAr?: string;
  stat1LabelEn?: string;
  stat2Value?: string;
  stat2LabelAr?: string;
  stat2LabelEn?: string;
  stat3Value?: string;
  stat3LabelAr?: string;
  stat3LabelEn?: string;
  aiCustomPromptAr?: string;
  aiCustomPromptEn?: string;
  resumePhone?: string;
  resumeEmail?: string;
  resumeLocation?: string;
  resumeExperienceAr?: string;
  resumeExperienceEn?: string;
  resumeEducationAr?: string;
  resumeEducationEn?: string;
  resumeSummaryAr?: string;
  resumeSummaryEn?: string;
  fontFamily?: string;
  customFontFamily?: string;
  customFontUrl?: string;
}

export interface ClientReview {
  id: string;
  name: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  status: 'pending' | 'approved';
}

export interface SmartDesignRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectIdea: string;
  basics: {
    serviceType: string;
    colorVibe: string;
    designStyle: string;
    features: string[];
  };
  aiConsultationApproach: string;
  status: 'pending' | 'processing' | 'completed';
  date: string;
  clientNotes?: string;
}

export interface AdminUser {
  email: string;
  passwordHash: string;
  isFirstLogin: boolean;
  createdAt: string;
}

export interface CustomFontWeight {
  src: string; // base64 data URL of the font file
  fmt: string; // 'woff2' | 'woff' | 'truetype' | 'opentype'
}

export interface CustomFontData {
  family: string;
  regular?: CustomFontWeight;
  medium?: CustomFontWeight;
  bold?: CustomFontWeight;
  uploadedAt?: string;
}
