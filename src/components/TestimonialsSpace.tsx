import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, User, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { ClientReview } from '../types';

interface TestimonialsSpaceProps {
  currentLang: 'ar' | 'en';
  reviews: ClientReview[];
  onAddReview: (newReview: ClientReview) => void;
}

export default function TestimonialsSpace({ currentLang, reviews, onAddReview }: TestimonialsSpaceProps) {
  const isRtl = currentLang === 'ar';
  
  // Form states
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const approvedReviews = reviews.filter(rev => rev.status === 'approved');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !comment.trim()) {
      setErrorMsg(isRtl ? 'يرجى كتابة الاسم ورأيك بوضوح.' : 'Please enter both your name and review text.');
      return;
    }

    const newReview: ClientReview = {
      id: 'rev-' + Date.now().toString(),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      status: 'pending' // Review must be approved by the admin in CMS before appearing on lander
    };

    onAddReview(newReview);
    setIsSubmitted(true);
    
    // Clear inputs
    setName('');
    setRating(5);
    setComment('');
    
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5500);
  };

  return (
    <section id="feedback-space" className="relative py-24 sm:py-32 bg-gradient-to-b from-[#081B36] to-[#041024] overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/2 left-10 w-80 h-80 bg-[#1C99ED]/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-primary/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-hover/10 text-brand-accent mb-4 text-xs font-semibold uppercase tracking-wider border border-brand-accent/20 font-sans"
          >
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span>{isRtl ? "قسم قضاء العملاء" : "Clients Lounge & Feedback"}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight"
          >
            {isRtl ? "شراكات النجاح وآراء عملائنا الكرام" : "Voices Of Collaboration & Success"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 text-white/70 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
          >
            {isRtl 
              ? "نصنع أعمالاً استثنائية بدقة متناهية، ونعتز برأي كل عميل شاركنا مسيرة الابتكار الرقمي."
              : "Every project built is a milestone of high quality and pure dedication. We treasure our client feedback."
            }
          </motion.p>
        </div>

        {/* Dynamic Interactive Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
          
          {/* Approved Testimonials Feed (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-start">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-accent animate-pulse" />
              <span>{isRtl ? "آراء معتمدة وموثقة" : "Approved Client Testimonials"} ({approvedReviews.length})</span>
            </h3>

            {approvedReviews.length === 0 ? (
              <div className="p-8 rounded-[24px] bg-white/5 border border-white/5 text-center text-white/50 text-xs sm:text-sm">
                {isRtl 
                  ? "لا توجد آراء معتمدة حالياً. بادر بكتابة أول تقييم عطر لهذا الموقع!" 
                  : "No approved testimonials are live yet. Be the first to express your experience!"
                }
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {approvedReviews.map((rev, idx) => (
                    <motion.div
                      key={rev.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05, duration: 0.5 }}
                      className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group shadow-xl hover:border-brand-accent/20 transition-all"
                    >
                      {/* Ambient shine inside review card */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-accent/10 to-transparent rounded-bl-3xl"></div>
                      
                      {/* Upper Info Row */}
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-white font-sans">{rev.name}</h4>
                          <span className="text-[10px] text-white/40 block mt-0.5 font-mono">{rev.date}</span>
                        </div>
                        {/* Star rate stars */}
                        <div className="flex gap-0.5 text-warning shrink-0 bg-warning/10 px-2 py-1 rounded-full border border-warning/15">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-warning text-warning' : 'text-slate-600'}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review Comment text */}
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal whitespace-pre-line text-justify">
                        {rev.comment}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Interactive feedback submit form (5 Columns) */}
          <div className="lg:col-span-12 xl:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 sm:p-10 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-brand-primary/10 rounded-br-3xl pointer-events-none filter blur-2xl"></div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 text-start flex items-center gap-2">
                <Star className="w-5 h-5 text-brand-accent animate-spin" style={{ animationDuration: '4s' }} />
                <span>{isRtl ? "شاركنا تقييمك ورأيك" : "Drop Your Own Rating"}</span>
              </h3>
              <p className="text-xs text-white/60 mb-6 text-start">
                {isRtl 
                  ? "رأيك كشريك نجاح يمنحنا الشغف والهمة للتطور وتقديم حلول ويب استثنائية." 
                  : "Your rating helps us keep the engineering bar exceptionally high and delightful."
                }
              </p>

              <form onSubmit={handleSubmit} className="space-y-5 text-start font-sans">
                {/* Name */}
                <div>
                  <label htmlFor="clientreview-name" className="block text-xs uppercase tracking-wider font-semibold text-white/80 mb-2">
                    {isRtl ? "اسمك الكريم أو شركتك" : "Your Name / Organization"} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      id="clientreview-name"
                      type="text"
                      dir="auto"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isRtl ? "أ. محمد عبد الله" : "e.g., Sarah Jenkins"}
                      className={`w-full text-xs sm:text-sm rounded-xl bg-black/40 border border-white/10 ${isRtl ? 'pr-3.5 pl-10' : 'pl-10 pr-3.5'} py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all`}
                    />
                  </div>
                </div>

                {/* Star selection */}
                <div>
                  <span className="block text-xs uppercase tracking-wider font-semibold text-white/80 mb-2">
                    {isRtl ? "تقييمك من خمس نجوم" : "Your Star Rating"}
                  </span>
                  
                  <div className="flex items-center gap-2 bg-black/30 w-fit p-2.5 rounded-2xl border border-white/5">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const starValue = i + 1;
                      const isLit = hoverRating !== null ? starValue <= hoverRating : starValue <= rating;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star 
                            className={`w-6 h-6 transition-colors duration-150 ${
                              isLit ? 'fill-warning text-warning shadow-md drop-shadow-[0_0_8px_rgba(28,153,237,0.5)]' : 'text-slate-600'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-mono font-bold text-warning ml-2 select-none">
                      ({rating}/5)
                    </span>
                  </div>
                </div>

                {/* Feedback Comment Details */}
                <div>
                  <label htmlFor="clientreview-comments" className="block text-xs uppercase tracking-wider font-semibold text-white/80 mb-2">
                    {isRtl ? "تفاصيل رأيك وتجربتك" : "Your Detailed Review"} *
                  </label>
                  <textarea
                    id="clientreview-comments"
                    rows={4}
                    dir="auto"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={isRtl ? "اكتب تفاصيل تجربتك، جودة العمل، الدعم الفني، إلخ..." : "Express your collaboration experiences..."}
                    className="w-full text-xs sm:text-sm rounded-xl bg-black/40 border border-white/10 p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all leading-relaxed"
                  />
                </div>

                {/* Submitting Alert feedback */}
                <AnimatePresence mode="wait">
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3.5 rounded-xl bg-green-500/15 border border-green-500/20 text-green-400 text-xs text-start flex gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-[11px] mb-0.5">
                          {isRtl ? "تم إرسال التقييم بنجاح!" : "Review submitted successfully!"}
                        </span>
                        <span className="text-[10px] text-green-300 block">
                          {isRtl 
                            ? "شكراً جزيلاً لرأيك الكريم. سيظهر التقييم ضمن لوحة الشرف فور موافقة المدير من لوحة التحكم."
                            : "Your evaluation is saved and will go live once verified by the administrator."
                          }
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-semibold text-start"
                    >
                      {errorMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button trigger */}
                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-all shadow-xl hover:opacity-95 cursor-pointer active:scale-99"
                >
                  <Send className="w-4 h-4 text-brand-accent animate-pulse" />
                  <span>{isRtl ? "إرسال تقييمك الآن" : "Submit Review"}</span>
                </button>
              </form>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
