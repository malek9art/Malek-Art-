import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export type ConfirmModalType = 'project_added' | 'project_updated' | 'service_updated' | 'config_saved' | 'deleted' | 'info' | 'sync_error';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: ConfirmModalType;
  onClose: () => void;
  isRtl: boolean;
}

export default function ConfirmationModal({ isOpen, title, message, type, onClose, isRtl }: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-md overflow-hidden bg-[#0C274E] border border-white/10 rounded-[32px] shadow-2xl p-6 sm:p-8 relative text-center"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#1C99ED]/20 blur-3xl rounded-full -z-10" />

            {type === 'sync_error' ? (
              <div className="mx-auto w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-5 animate-pulse">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
            ) : (
              <div className="mx-auto w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-5 animate-pulse">
                <CheckCircle className="w-7 h-7 text-green-400" />
              </div>
            )}

            <h3 className="text-base sm:text-lg font-extrabold text-white mb-2">{title}</h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-5">{message}</p>

            <div className="bg-black/35 rounded-2xl p-4 mb-5 border border-white/5 text-[10px] text-white/50 text-start leading-relaxed font-mono">
              {isRtl ? (
                <div>
                  <p className="font-sans font-bold text-[#1C99ED] mb-1">تفاصيل العملية:</p>
                  <p>● نوع التعديل: {
                    type === 'project_added' ? 'إضافة مشروع جديد للمعرض' :
                    type === 'project_updated' ? 'تعديل وحفظ بيانات مشروع قائمة الذخيرة' :
                    type === 'service_updated' ? 'تعديل وحفظ ميزات خدمة العرض' :
                    type === 'config_saved' ? 'تعديل هوية وألوان الإنجاز البصرية الفورية' :
                    type === 'deleted' ? 'إزالة وحذف نهائي من قاعدة البيانات' :
                    type === 'sync_error' ? 'فشل اتصال بقاعدة البيانات السحابية' : 'عملية تعديل بيانات النظام'
                  }</p>
                  <p className="mt-1">● حالة العملية: {
                    type === 'sync_error'
                      ? 'فشلت المزامنة السحابية — محفوظ محلياً فقط (LOCAL ONLY)'
                      : 'ناجحة ومُزامنة مع قاعدة البيانات السحابية (Firestore Cloud Verified)'
                  }</p>
                </div>
              ) : (
                <div>
                  <p className="font-sans font-bold text-[#1C99ED] mb-1">OPERATION METRICS:</p>
                  <p>● Event Node Type: {type.toUpperCase()}</p>
                  <p className="mt-1">● Status Code: {
                    type === 'sync_error'
                      ? 'CLOUD_SYNC_FAILED (Persisted Locally Only)'
                      : 'CLOUD_SYNCED_SUCCESSFULLY (Firestore Verified)'
                  }</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-full bg-[#1C99ED] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-98 select-none"
            >
              {isRtl ? "موافق، فهمت" : "Acknowledge & Dismiss"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
