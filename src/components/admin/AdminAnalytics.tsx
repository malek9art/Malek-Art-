import { motion } from 'motion/react';
import { Mail, FolderOpen, Briefcase, TrendingUp, Star, MessageSquare } from 'lucide-react';
import { ContactMessage, Project, Service, Skill, ClientReview } from '../../types';

interface AdminAnalyticsProps {
  messages: ContactMessage[];
  projects: Project[];
  services: Service[];
  skills: Skill[];
  reviews: ClientReview[];
  isRtl: boolean;
}

export default function AdminAnalytics({ messages, projects, services, skills, reviews, isRtl }: AdminAnalyticsProps) {
  // Calculate real stats
  const totalMessages = messages.length;
  const totalProjects = projects.length;
  const totalServices = services.length;
  const totalSkills = skills.length;
  const approvedReviews = reviews.filter(r => r.status === 'approved').length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;

  // Calculate messages from last 7 days
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentMessages = messages.filter(m => {
    const msgDate = new Date(m.date);
    return msgDate >= sevenDaysAgo;
  });
  const messageGrowthRate = totalMessages > 0 
    ? Math.round((recentMessages.length / totalMessages) * 100) 
    : 0;

  // Service demand calculation (based on project categories)
  const categoryCount: Record<string, number> = {};
  projects.forEach(p => {
    const cat = isRtl ? p.categoryAr : p.categoryEn;
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  const sortedCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const maxCount = sortedCategories[0]?.[1] || 1;

  // Messages per day for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
    const dayStr = date.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' });
    const count = messages.filter(m => {
      const msgDate = new Date(m.date);
      return msgDate.toDateString() === date.toDateString();
    }).length;
    return { day: dayStr, count };
  });
  const maxDailyMsgs = Math.max(...last7Days.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-start">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-[10px] text-white/50 block font-mono uppercase">{isRtl ? "إجمالي الرسائل" : "TOTAL MESSAGES"}</span>
          </div>
          <span className="text-3xl font-black text-white block">{totalMessages}</span>
          {recentMessages.length > 0 && (
            <span className="text-xs text-green-400 mt-1 block font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {isRtl ? `${recentMessages.length} رسالة في آخر 7 أيام` : `${recentMessages.length} messages in last 7 days`}
            </span>
          )}
        </div>

        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-start">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#EA580C]/10 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-[#EA580C]" />
            </div>
            <span className="text-[10px] text-white/50 block font-mono uppercase">{isRtl ? "المشاريع النشطة" : "ACTIVE PROJECTS"}</span>
          </div>
          <span className="text-3xl font-black text-[#EA580C] block">{totalProjects}</span>
          <span className="text-xs text-white/50 block mt-1">
            {isRtl ? `${totalServices} خدمة متاحة` : `${totalServices} services available`}
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-start">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-[10px] text-white/50 block font-mono uppercase">{isRtl ? "التقييمات" : "REVIEWS"}</span>
          </div>
          <span className="text-3xl font-black text-indigo-400 block">{reviews.length}</span>
          <span className="text-xs text-white/50 block mt-1">
            {isRtl 
              ? `${approvedReviews} معتمدة • ${pendingReviews} معلقة` 
              : `${approvedReviews} approved • ${pendingReviews} pending`}
          </span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Categories Distribution */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md text-start">
          <h4 className="text-sm font-bold text-white mb-6 font-mono uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#EA580C]" />
            {isRtl ? "توزيع المشاريع حسب التصنيف" : "Project Categories Distribution"}
          </h4>

          {sortedCategories.length === 0 ? (
            <p className="text-xs text-white/40 text-center py-8">
              {isRtl ? "لا توجد مشاريع بعد" : "No projects yet"}
            </p>
          ) : (
            <div className="space-y-5">
              {sortedCategories.map(([cat, count], idx) => {
                const percent = Math.round((count / maxCount) * 100);
                const colors = ['bg-[#EA580C]', 'bg-[#818CF8]', 'bg-emerald-500', 'bg-pink-500'];
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs text-white/80 font-medium">
                      <span className="truncate max-w-[60%]">{cat}</span>
                      <span className="font-mono text-white/60">{count} {isRtl ? 'مشروع' : 'projects'} ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 }}
                        className={`h-full rounded-full ${colors[idx % colors.length]}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Messages Trend - Last 7 Days */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md text-start flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white mb-2 font-mono uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              {isRtl ? "حركة الرسائل (آخر 7 أيام)" : "Message Activity (Last 7 Days)"}
            </h4>
            <p className="text-xs text-white/50 leading-relaxed mb-4">
              {isRtl ? "تتبع نشاط الرسائل الواردة خلال الأسبوع الماضي" : "Tracking incoming message activity over the past week"}
            </p>
          </div>

          {totalMessages === 0 ? (
            <p className="text-xs text-white/40 text-center py-8">
              {isRtl ? "لا توجد رسائل بعد" : "No messages yet"}
            </p>
          ) : (
            <div className="h-32 flex items-end gap-3 pt-6 border-b border-white/5 pb-2 font-mono text-[9px] text-white/45">
              {last7Days.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                  <div className="text-[10px] text-[#EA580C] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.count}
                  </div>
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="w-full rounded-t-md origin-bottom transition-colors"
                    style={{
                      height: `${Math.max((day.count / maxDailyMsgs) * 100, 4)}%`,
                      background: day.count > 0 
                        ? `linear-gradient(to top, rgba(234,88,12,0.4), rgba(234,88,12,${0.4 + (day.count / maxDailyMsgs) * 0.6}))` 
                        : 'rgba(255,255,255,0.05)'
                    }}
                  />
                  <span className="text-[8px] sm:text-[9px] text-white/40">{day.day}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Skills Summary */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-start">
          <h4 className="text-sm font-bold text-white mb-4 font-mono uppercase tracking-wider">
            {isRtl ? "ملخص المهارات" : "Skills Summary"}
          </h4>
          {skills.length === 0 ? (
            <p className="text-xs text-white/40 text-center py-4">
              {isRtl ? "لا توجد مهارات مسجلة" : "No skills registered"}
            </p>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/60">
                <span>{isRtl ? "إجمالي المهارات" : "Total Skills"}</span>
                <span className="font-bold text-white">{totalSkills}</span>
              </div>
              <div className="flex justify-between text-xs text-white/60">
                <span>{isRtl ? "متوسط الإتقان" : "Average Proficiency"}</span>
                <span className="font-bold text-[#EA580C]">
                  {Math.round(skills.reduce((acc, s) => acc + s.percentage, 0) / skills.length)}%
                </span>
              </div>
              <div className="flex justify-between text-xs text-white/60">
                <span>{isRtl ? "أعلى مهارة" : "Top Skill"}</span>
                <span className="font-bold text-green-400 truncate max-w-[60%]">
                  {isRtl 
                    ? skills.reduce((a, b) => a.percentage > b.percentage ? a : b).nameAr
                    : skills.reduce((a, b) => a.percentage > b.percentage ? a : b).nameEn}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Info */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-start">
          <h4 className="text-sm font-bold text-white mb-4 font-mono uppercase tracking-wider">
            {isRtl ? "معلومات سريعة" : "Quick Info"}
          </h4>
          <div className="space-y-2 text-xs text-white/60">
            <div className="flex justify-between">
              <span>{isRtl ? "آخر رسالة" : "Latest Message"}</span>
              <span className="font-mono text-white/80">
                {messages.length > 0 
                  ? new Date(messages[0].date).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })
                  : isRtl ? 'لا يوجد' : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{isRtl ? "معدل الرد" : "Response Rate"}</span>
              <span className="font-bold text-green-400">—</span>
            </div>
            <div className="flex justify-between">
              <span>{isRtl ? "حالة المزامنة" : "Sync Status"}</span>
              <span className="font-bold text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                {isRtl ? "نشط" : "Active"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
