import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../auth/authContext';

interface AdminLoginProps {
  currentLang: 'ar' | 'en';
  setIsLoggedIn: (status: boolean) => void;
}

export default function AdminLogin({ currentLang, setIsLoggedIn }: AdminLoginProps) {
  const isRtl = currentLang === 'ar';
  const { login: authLogin, logout: authLogout } = useAuth();

  const [adminEmail, setAdminEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [loginStep, setLoginStep] = useState<'email' | 'enterPassword'>('email');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailKey = adminEmail.toLowerCase().trim();
    if (!emailKey) return;
    setIsVerifying(true);
    setPassError('');
    try {
      const designatedAdmin = (import.meta.env.VITE_ADMIN_EMAIL || "malikalwesabi@gmail.com").toLowerCase().trim();
      if (emailKey !== designatedAdmin && emailKey !== 'admin@malek.art' && emailKey !== 'admin@malek') {
        setPassError(isRtl ? 'البريد الإلكتروني المدخل غير مخصص للمسؤول.' : 'The entered email is not designated as administrator.');
        return;
      }
      setLoginStep('enterPassword');
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !adminEmail.trim()) return;
    setIsVerifying(true);
    setPassError('');
    try {
      const result = await authLogin(adminEmail.trim(), password);
      if (result.success) {
        if (result.user?.role !== 'admin') {
          setPassError(isRtl
            ? 'تم التحقق بنجاح ولكن الحساب لا يملك دور مسؤول (Admin Role) في قاعدة البيانات.'
            : 'Authenticated successfully, but account lacks Admin Role in database.');
          await authLogout();
          return;
        }
        setIsLoggedIn(true);
        setPassError('');
      } else {
        setPassError(isRtl
          ? `تعذر الدخول بـ Firebase Auth: ${result.error || 'تأكد من وجود البريد في Firebase Authentication وإدخال كلمة المرور الصحيحة.'}`
          : (result.error || 'Firebase Authentication failed. Verify user exists in Firebase Auth console and password is correct.'));
      }
    } catch {
      setPassError(isRtl ? 'حدث خطأ أثناء إجراء المصادقة عبر Firebase.' : 'An error occurred contacting Firebase Auth.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section className="min-h-[100svh] py-16 sm:py-24 lg:py-32 flex items-center justify-center bg-[#041024] text-center px-3 sm:px-4 relative overflow-y-auto">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-accent/10 rounded-full filter blur-xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-hover/5 rounded-full filter blur-xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl sm:rounded-[32px] p-5 sm:p-10 backdrop-blur-lg shadow-2xl relative my-4 sm:my-8"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#1C99ED]/10 flex items-center justify-center border border-[#1C99ED]/20 text-[#1C99ED] mx-auto mb-6 shadow-inner animate-pulse">
          <Key className="w-6 h-6" />
        </div>

        <AnimatePresence mode="wait">
          {loginStep === 'email' && (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2 font-sans tracking-tight uppercase">
                {isRtl ? "تسجيل دخول المسؤول" : "Administrator Portal Login"}
              </h3>
              <p className="text-xs text-white/60 mb-8 max-w-xs mx-auto leading-relaxed">
                {isRtl
                  ? "الرجاء إدخال البريد الإلكتروني المصادق عليه في قاعدة البيانات للتحقق والوصول للوحة التحكم."
                  : "Please enter your authenticated administrator email from the database to log in."}
              </p>

              <form onSubmit={handleVerifyEmail} className={`space-y-5 ${isRtl ? 'rtl' : 'ltr'}`}>
                <div className="text-start">
                  <label htmlFor="admin-email" className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">
                    {isRtl ? "البريد الإلكتروني للمسؤول" : "Administrator Email Address"}
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder={isRtl ? "أدخل بريد المسؤول" : "Enter admin email"}
                    className="w-full text-sm rounded-2xl bg-black/40 border border-white/10 p-4 text-white text-center focus:outline-none focus:border-[#1C99ED]"
                    required
                    disabled={isVerifying}
                    autoComplete="email"
                  />
                </div>

                {passError && (
                  <p className="text-xs font-bold text-red-400 flex items-center gap-1.5 justify-center">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{passError}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#0A4EA4] to-[#1C99ED] text-xs font-bold uppercase tracking-wider text-white transition-all shadow-lg hover:opacity-90 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isVerifying && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  <span>{isRtl ? "التحقق والاستمرار" : "Verify & Continue"}</span>
                </button>
              </form>
            </motion.div>
          )}

          {loginStep === 'enterPassword' && (
            <motion.div
              key="enter-password-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2 font-sans tracking-tight uppercase">
                {isRtl ? "إدخال كلمة المرور" : "Submit Password"}
              </h3>
              <p className="text-xs text-white/60 mb-8 max-w-xs mx-auto leading-relaxed">
                {isRtl
                  ? `مرحباً بالمسؤول. الرجاء إدخال كلمة المرور المعتمدة للوصول الكامل للوحة التحكم.`
                  : `Welcome Admin. Please enter your safe password to unlock modifications.`}
              </p>

              <form onSubmit={handlePasswordLogin} className={`space-y-5 ${isRtl ? 'rtl' : 'ltr'}`}>
                <div className="text-start">
                  <label htmlFor="admin-vault-pwd" className="block text-xs uppercase tracking-wider font-semibold text-white mb-2">
                    {isRtl ? "كلمة المرور" : "Password"}
                  </label>
                  <div className="relative">
                    <input
                      id="admin-vault-pwd"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-sm rounded-2xl bg-black/40 border border-white/10 p-4 text-white text-center focus:outline-none focus:border-[#1C99ED]"
                      required
                      disabled={isVerifying}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors cursor-pointer p-1"
                      style={{ [isRtl ? 'left' : 'right']: '12px' }}
                      tabIndex={-1}
                      aria-label={showPassword ? (isRtl ? "إخفاء كلمة المرور" : "Hide password") : (isRtl ? "إظهار كلمة المرور" : "Show password")}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {passError && (
                  <p className="text-xs font-bold text-red-400 flex items-center gap-1.5 justify-center">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{passError}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#0A4EA4] to-[#1C99ED] text-xs font-bold uppercase tracking-wider text-white transition-all shadow-lg hover:opacity-90 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isVerifying && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  <span>{isRtl ? "تسجيل الدخول" : "Log In"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setLoginStep('email'); setPassError(''); }}
                  className="w-full text-xs text-white/50 hover:text-white transition-colors py-1 cursor-pointer underline"
                >
                  {isRtl ? "رجوع لتغيير البريد الإلكتروني" : "Back to Change Email"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
