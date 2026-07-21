import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Github, Linkedin, Twitter, MessageSquare, Send, CheckCircle2, ShieldAlert, Facebook, Instagram, Youtube, MessageCircle, Globe } from 'lucide-react';
import { ContactMessage, SocialLink } from '../types';

interface ContactProps {
  currentLang: 'ar' | 'en';
  onNewMessage: (msg: ContactMessage) => void;
  t: any;
  config: any;
}

export default function Contact({ currentLang, onNewMessage, t, config }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('ui');
  const [message, setMessage] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const isRtl = currentLang === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Core validation guard
    if (!name.trim() || !email.trim() || !message.trim() || !email.includes('@')) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
      return;
    }

    setStatus('sending');

    // Simulate sending network latency
    setTimeout(() => {
      const subjectMap: Record<string, string> = {
        ui: currentLang === 'ar' ? "تصميم واجهة مستخدم UI/UX" : "UI/UX Interface Design",
        dev: currentLang === 'ar' ? "تطوير موقع ويب" : "Web Development",
        branding: currentLang === 'ar' ? "هوية بصرية كاملة" : "Complete Branding",
        consult: currentLang === 'ar' ? "استشارة رقمية" : "Digital Consultation",
        other: currentLang === 'ar' ? "موضوع آخر" : "Other Conversation"
      };

      const newMsg: ContactMessage = {
        id: Date.now().toString(),
        name,
        email,
        subject: subjectMap[subject] || subject,
        message,
        date: new Date().toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      // Call state modifier
      onNewMessage(newMsg);

      // Flush form inputs
      setName('');
      setEmail('');
      setSubject('ui');
      setMessage('');
      setStatus('success');

      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('git')) return <Github className="w-4.5 h-4.5 sm:w-5 sm:h-5 flex-shrink-0" />;
    if (p.includes('link')) return <Linkedin className="w-4.5 h-4.5 sm:w-5 sm:h-5 flex-shrink-0" />;
    if (p.includes('twit') || p.includes('x')) return <Twitter className="w-4.5 h-4.5 flex-shrink-0" />;
    if (p.includes('face')) return <Facebook className="w-4.5 h-4.5 flex-shrink-0" />;
    if (p.includes('inst')) return <Instagram className="w-4.5 h-4.5 flex-shrink-0" />;
    if (p.includes('yout')) return <Youtube className="w-4.5 h-4.5 flex-shrink-0" />;
    if (p.includes('whats') || p.includes('phone') || p.includes('call')) return <MessageCircle className="w-4.5 h-4.5 flex-shrink-0" />;
    return <Globe className="w-4.5 h-4.5 flex-shrink-0" />;
  };

  const getSocialColor = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('git')) return 'hover:text-white hover:bg-black/80 hover:border-black/80';
    if (p.includes('link')) return 'hover:text-white hover:bg-indigo-600 hover:border-indigo-600';
    if (p.includes('twit') || p.includes('x')) return 'hover:text-white hover:bg-sky-500 hover:border-sky-500';
    if (p.includes('face')) return 'hover:text-white hover:bg-blue-600 hover:border-blue-600';
    if (p.includes('inst')) return 'hover:text-white hover:bg-pink-600 hover:border-pink-600';
    if (p.includes('yout')) return 'hover:text-white hover:bg-red-600 hover:border-red-600';
    if (p.includes('whats')) return 'hover:text-white hover:bg-green-600 hover:border-green-600';
    return 'hover:text-white hover:bg-[#EA580C] hover:border-[#EA580C]';
  };

  const socialLinks = config?.socialLinks && config.socialLinks.length > 0
    ? config.socialLinks.map((item: SocialLink) => ({
        name: item.platform,
        url: item.url,
        icon: getSocialIcon(item.platform),
        color: getSocialColor(item.platform)
      }))
    : [
        ...(config?.socialGithub ? [{ name: 'Github', url: config.socialGithub, icon: <Github className="w-4.5 h-4.5 sm:w-5 sm:h-5" />, color: 'hover:text-white hover:bg-black/85' }] : []),
        ...(config?.socialLinkedin ? [{ name: 'LinkedIn', url: config.socialLinkedin, icon: <Linkedin className="w-4.5 h-4.5 sm:w-5 sm:h-5" />, color: 'hover:text-white hover:bg-indigo-600' }] : []),
        ...(config?.socialTwitter ? [{ name: 'Twitter/X', url: config.socialTwitter, icon: <Twitter className="w-4.5 h-4.5" />, color: 'hover:text-[#ea580c] hover:bg-white/5' }] : []),
        ...(config?.socialFacebook ? [{ name: 'Facebook', url: config.socialFacebook, icon: <Facebook className="w-4.5 h-4.5" />, color: 'hover:text-blue-500 hover:bg-white/5' }] : []),
        ...(config?.socialInstagram ? [{ name: 'Instagram', url: config.socialInstagram, icon: <Instagram className="w-4.5 h-4.5" />, color: 'hover:text-pink-500 hover:bg-white/5' }] : [])
      ];

  if (socialLinks.length === 0) {
    socialLinks.push(
      { name: 'Github', url: 'https://github.com/malekart', icon: <Github className="w-4.5 h-4.5 sm:w-5 sm:h-5" />, color: 'hover:text-white hover:bg-black/80' },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/malekart', icon: <Linkedin className="w-4.5 h-4.5 sm:w-5 sm:h-5" />, color: 'hover:text-white hover:bg-indigo-600' }
    );
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-[#0a0724] overflow-hidden">
      {/* Decorative Blur lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-indigo-600/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EA580C]/10 text-[#EA580C] mb-4 text-xs font-semibold uppercase tracking-wider border border-[#EA580C]/20"
          >
            <MessageSquare className="w-4 h-4 text-[#EA580C]" />
            <span>{t.navContact}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            {t.contactSecTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 text-white/70 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
          >
            {t.contactSubtitle}
          </motion.p>
        </div>

        {/* Form and info split Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
          
          {/* Direct Address / Social highlights (5 columns) */}
          <div className="lg:col-span-5 space-y-8 text-start">
            <motion.div
              initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg"
            >
              <h3 className="text-xl font-bold text-white mb-6">
                {isRtl ? "تواصل مباشر" : "Direct Channels"}
              </h3>

              <div className="space-y-6">
                
                {/* Email address Link - Icon Only as requested */}
                <div className="flex flex-col gap-4">
                  <span className="text-xs text-white/60 font-medium">
                    {isRtl ? "اضغط على أيقونة البريد للتواصل الفوري السريع:" : "Click the email icon to send a direct message:"}
                  </span>
                  <div className="flex items-center gap-4">
                    <a
                      href={`mailto:${config?.resumeEmail || 'malikalwesabi@gmail.com'}`}
                      className="w-14 h-14 rounded-2xl bg-[#EA580C]/10 hover:bg-[#EA580C] text-[#EA580C] hover:text-white flex items-center justify-center border border-[#EA580C]/30 transition-all hover:scale-105 active:scale-95 shadow-lg group cursor-pointer"
                      title={isRtl ? "راسلني بالبريد الإلكتروني" : "Direct Email Channel"}
                    >
                      <Mail className="w-7 h-7 transition-all group-hover:scale-110 group-hover:rotate-6" />
                    </a>

                    {/* Simulated Speed */}
                    <div className="flex-1 flex gap-3 items-center px-4 py-3.5 rounded-2xl bg-white/5 border border-white/5">
                      <MessageSquare className="w-4.5 h-4.5 text-[#818CF8]" />
                      <span className="text-xs text-gray-300 font-semibold">
                        {isRtl ? "رد نشط خلال أقل من 12 ساعة" : "Response in less than 12h"}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Social Channels panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg"
            >
              <h3 className="text-base font-bold text-white mb-4 uppercase tracking-wider font-mono">
                {t.socialLinksTitle}
              </h3>
              
              <div className="flex gap-4.5">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-gray-300 transition-all border border-white/10 shadow-md active:scale-90 ${item.color} hover:bg-[#EA580C] hover:text-white hover:border-[#EA580C]`}
                    title={item.name}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Contact Input Form (7 columns) */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 sm:p-10 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-xl"
            >
              <form onSubmit={handleSubmit} className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`}>
                
                {/* Dual row for Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Name field */}
                  <div className="text-start">
                    <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">
                      {t.contactName} *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs sm:text-sm rounded-2xl bg-[#1e1b4b]/60 border border-white/10 p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all"
                      required
                    />
                  </div>

                  {/* Email field */}
                  <div className="text-start">
                    <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">
                      {t.contactEmail} *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs sm:text-sm rounded-2xl bg-[#1e1b4b]/60 border border-white/10 p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all"
                      required
                    />
                  </div>

                </div>

                {/* Dropdown subject Selection */}
                <div className="text-start">
                  <label htmlFor="contact-subject" className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">
                    {t.contactSubject}
                  </label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-2xl bg-[#1e1b4b] border border-white/10 p-3.5 text-gray-300 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all cursor-pointer"
                  >
                    <option value="ui">{t.contactSubjectUi}</option>
                    <option value="dev">{t.contactSubjectDev}</option>
                    <option value="branding">{t.contactSubjectBranding}</option>
                    <option value="consult">{t.contactSubjectConsult}</option>
                    <option value="other">{t.contactSubjectOther}</option>
                  </select>
                </div>

                {/* Details text area */}
                <div className="text-start">
                  <label htmlFor="contact-msg-details" className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">
                    {t.contactMessage} *
                  </label>
                  <textarea
                    id="contact-msg-details"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-2xl bg-[#1e1b4b]/60 border border-white/10 p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all leading-relaxed"
                    required
                  />
                </div>

                {/* Submitting alerts feedback */}
                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-2xl bg-green-500/15 border border-green-500/20 text-green-400 text-xs sm:text-sm text-start flex gap-2.5"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                      <span>{t.contactSuccess}</span>
                    </motion.div>
                  )}

                  {status === 'error' && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm text-start flex gap-2.5"
                    >
                      <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                      <span>{t.contactError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button trigger */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  id="contact-form-submit-btn"
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#ea580c] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-all shadow-xl hover:opacity-90 cursor-pointer active:scale-99 select-none"
                >
                  {status === 'sending' ? (
                    <div className="flex items-center gap-2">
                       <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                      <span>{t.contactSending}</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-orange-200 animate-pulse" />
                      <span>{t.contactSubmitBtn}</span>
                    </>
                  )}
                </button>

              </form>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
