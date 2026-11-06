"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export const adminAccessCopy: Record<Locale, { title: string; lead: string; username: string; password: string; enter: string; entering: string; invalid: string; limited: string; unavailable: string; show: string; hide: string; back: string; signout: string; private: string }> = {
  ru: { title: "Панель CarTime", lead: "Заявки, поездки и контакты в одном рабочем пространстве.", username: "Логин", password: "Пароль", enter: "Войти в панель", entering: "Проверяем…", invalid: "Неверный логин или пароль.", limited: "Слишком много попыток. Попробуйте через 15 минут.", unavailable: "Вход временно недоступен. Попробуйте позже.", show: "Показать пароль", hide: "Скрыть пароль", back: "На сайт", signout: "Выйти", private: "Закрытый доступ · CarTime Operations" },
  az: { title: "CarTime paneli", lead: "Sorğular, səfərlər və əlaqələr bir iş yerində.", username: "İstifadəçi adı", password: "Şifrə", enter: "Panelə daxil ol", entering: "Yoxlanılır…", invalid: "İstifadəçi adı və ya şifrə yanlışdır.", limited: "Çox sayda cəhd. 15 dəqiqədən sonra yenidən yoxlayın.", unavailable: "Giriş müvəqqəti mümkün deyil.", show: "Şifrəni göstər", hide: "Şifrəni gizlət", back: "Sayta qayıt", signout: "Çıxış", private: "Məhdud giriş · CarTime Operations" },
  en: { title: "CarTime workspace", lead: "Requests, trips and contacts in one place.", username: "Username", password: "Password", enter: "Sign in", entering: "Checking…", invalid: "Incorrect username or password.", limited: "Too many attempts. Try again in 15 minutes.", unavailable: "Sign-in is temporarily unavailable.", show: "Show password", hide: "Hide password", back: "Back to site", signout: "Sign out", private: "Private access · CarTime Operations" },
  de: { title: "CarTime Verwaltung", lead: "Anfragen, Fahrten und Kontakte an einem Ort.", username: "Benutzername", password: "Passwort", enter: "Anmelden", entering: "Wird geprüft…", invalid: "Benutzername oder Passwort falsch.", limited: "Zu viele Versuche. Bitte in 15 Minuten erneut versuchen.", unavailable: "Anmeldung derzeit nicht verfügbar.", show: "Passwort anzeigen", hide: "Passwort verbergen", back: "Zur Website", signout: "Abmelden", private: "Privater Zugang · CarTime Operations" },
  zh: { title: "CarTime 管理面板", lead: "在同一处管理订单、行程和联系人。", username: "用户名", password: "密码", enter: "登录", entering: "正在验证…", invalid: "用户名或密码错误。", limited: "尝试次数过多，请 15 分钟后再试。", unavailable: "暂时无法登录。", show: "显示密码", hide: "隐藏密码", back: "返回网站", signout: "退出登录", private: "私人访问 · CarTime Operations" },
  ko: { title: "CarTime 관리자", lead: "예약 요청과 일정, 연락처를 한곳에서 관리하세요.", username: "사용자 이름", password: "비밀번호", enter: "로그인", entering: "확인 중…", invalid: "사용자 이름 또는 비밀번호가 올바르지 않습니다.", limited: "시도가 너무 많습니다. 15분 후 다시 시도하세요.", unavailable: "현재 로그인할 수 없습니다.", show: "비밀번호 표시", hide: "비밀번호 숨기기", back: "사이트로 돌아가기", signout: "로그아웃", private: "비공개 접근 · CarTime Operations" },
  fr: { title: "Espace CarTime", lead: "Demandes, trajets et contacts au même endroit.", username: "Identifiant", password: "Mot de passe", enter: "Se connecter", entering: "Vérification…", invalid: "Identifiant ou mot de passe incorrect.", limited: "Trop de tentatives. Réessayez dans 15 minutes.", unavailable: "Connexion temporairement indisponible.", show: "Afficher le mot de passe", hide: "Masquer le mot de passe", back: "Retour au site", signout: "Se déconnecter", private: "Accès privé · CarTime Operations" },
  ar: { title: "لوحة إدارة CarTime", lead: "الطلبات والرحلات وجهات الاتصال في مكان واحد.", username: "اسم المستخدم", password: "كلمة المرور", enter: "تسجيل الدخول", entering: "جارٍ التحقق…", invalid: "اسم المستخدم أو كلمة المرور غير صحيحة.", limited: "محاولات كثيرة. حاول مجدداً بعد 15 دقيقة.", unavailable: "تسجيل الدخول غير متاح حالياً.", show: "إظهار كلمة المرور", hide: "إخفاء كلمة المرور", back: "العودة إلى الموقع", signout: "تسجيل الخروج", private: "وصول خاص · CarTime Operations" },
};

export default function AdminLogin({ locale }: { locale: Locale }) {
  const t = adminAccessCopy[locale];
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ username, password }) });
      if (response.ok) { window.location.reload(); return; }
      setError(response.status === 429 ? t.limited : response.status === 401 ? t.invalid : t.unavailable);
    } catch { setError(t.unavailable); }
    finally { setBusy(false); }
  }

  return <main className="admin-login-page"><div className="admin-login-glow" aria-hidden="true" /><a className="admin-login-back" href={`/${locale}`}>{t.back} <ArrowRight size={16} /></a><div className="admin-login-card"><div className="admin-login-brand"><img src="/assets/logo-dark.webp" alt="CarTime" /><span><ShieldCheck size={16} />{t.private}</span></div><div className="admin-login-icon"><LockKeyhole size={27} /></div><h1>{t.title}</h1><p>{t.lead}</p><form onSubmit={submit}><label htmlFor="admin-username">{t.username}</label><input id="admin-username" name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required maxLength={80} /><label htmlFor="admin-password">{t.password}</label><div className="admin-password-field"><input id="admin-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required maxLength={128} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? t.hide : t.show}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div>{error && <span className="admin-login-error" role="alert">{error}</span>}<button className="admin-login-submit" type="submit" disabled={busy}>{busy ? t.entering : t.enter}<ArrowRight size={18} /></button></form></div></main>;
}
