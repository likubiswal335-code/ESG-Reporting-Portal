/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Shield,
  Users,
  FileText,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Background image paths generated
const DAM_IMAGE = '/src/assets/images/hydro_dam_infrastructure_1790970471851.jpg';
const HIGHWAY_IMAGE = '/src/assets/images/highway_viaduct_infrastructure_1790970483066.jpg';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, error, clearError } = useAuth();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientValidation, setClientValidation] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setClientValidation(null);

    const trimmedUser = userId.trim();
    if (!trimmedUser) {
      setClientValidation('Please enter your Management User ID.');
      return;
    }

    if (!password) {
      setClientValidation('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(trimmedUser, password);
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      // Error is caught and set by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedError = clientValidation || error;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#f0f7fd] text-slate-800 font-sans select-none">
      {/* ------------------------------------------------------------- */}
      {/* ATMOSPHERIC BACKGROUND WITH REAL INFRASTRUCTURE IMAGERY       */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Sky Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f4f9fd] via-[#eaf4fc] to-[#e4f0fa]" />

        {/* Left: Hydroelectric Dam Infrastructure Image */}
        <div className="hidden md:block absolute -left-12 top-0 bottom-0 w-[42vw] max-w-[620px] overflow-hidden opacity-90">
          <img
            src={DAM_IMAGE}
            alt="MEIL Hydroelectric Dam Infrastructure"
            className="w-full h-full object-cover object-center filter saturate-105"
            loading="eager"
          />
          {/* Seamless Soft Fade Mask towards Center & Top */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f0f7fd]/40 to-[#f0f7fd]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f4f9fd]/60 via-transparent to-[#e4f0fa]/80" />
        </div>

        {/* Right: Modern Elevated Highway Viaduct Infrastructure Image */}
        <div className="hidden md:block absolute -right-12 top-0 bottom-0 w-[42vw] max-w-[620px] overflow-hidden opacity-90">
          <img
            src={HIGHWAY_IMAGE}
            alt="MEIL Highway Viaduct Infrastructure"
            className="w-full h-full object-cover object-center filter saturate-105"
            loading="eager"
          />
          {/* Seamless Soft Fade Mask towards Center & Top */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#f0f7fd]/40 to-[#f0f7fd]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f4f9fd]/60 via-transparent to-[#e4f0fa]/80" />
        </div>

        {/* Radiant Soft Blue Luminous Glow in Center for Authentication Card */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-gradient-radial from-white via-white/90 to-transparent blur-2xl opacity-95" />

        {/* Dynamic Gentle Wave Curves across Header & Lower Screen */}
        <svg
          className="absolute top-0 left-0 w-full h-48 opacity-40 text-sky-200"
          viewBox="0 0 1440 220"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 C360,180 720,20 1440,110 L1440,0 L0,0 Z"
            fill="currentColor"
          />
        </svg>

        <svg
          className="absolute bottom-0 left-0 w-full h-48 opacity-30 text-sky-200"
          viewBox="0 0 1440 220"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,120 C480,40 960,190 1440,80 L1440,220 L0,220 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER SECTION                                            */}
      {/* ------------------------------------------------------------- */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-4 sm:pt-6">
        {/* Top-Right Confidentiality Notice */}
        <div className="flex justify-end">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold tracking-wider text-slate-600 uppercase">
            <Lock size={13} className="text-slate-500" />
            <span>CONFIDENTIAL</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">INTERNAL USE ONLY</span>
          </div>
        </div>

        {/* Center Brand Lockup */}
        <div className="flex flex-col items-center justify-center text-center mt-2 sm:mt-3">
          {/* MEIL Official Logo: Red Geometric Emblem + Navy 'meil' */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {/* Precise Vector MEIL Red Square Emblem with Gear & M */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-md bg-[#e1251b] flex items-center justify-center p-1.5 shadow-sm">
              <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                {/* Outer White M Shape */}
                <path
                  d="M6 34 L6 8 L14 8 L20 18 L26 8 L34 8 L34 34 L27 34 L27 18 L21.5 26 L18.5 26 L13 18 L13 34 Z"
                  fill="white"
                />
                {/* Central Gear Cog */}
                <circle cx="20" cy="23" r="3.5" fill="#e1251b" />
                <path
                  d="M19 18h2v2h-2z M19 26h2v2h-2z M15 22h2v2h-2z M23 22h2v2h-2z"
                  fill="white"
                />
              </svg>
            </div>
            {/* Bold Navy 'meil' Typography */}
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0a2342] lowercase font-sans">
              meil
            </span>
          </div>

          {/* Corporate Name */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold tracking-tight text-[#0f284c] text-balance">
            Megha Engineering &amp; Infrastructures Limited
          </h1>

          {/* Subtitle */}
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.22em] text-[#4f6f92] uppercase mt-1">
            BUILDING A SUSTAINABLE TOMORROW
          </p>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* CENTER AUTHENTICATION CARD                                    */}
      {/* ------------------------------------------------------------- */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:py-8">
        <div className="w-full max-w-[480px] bg-white/95 backdrop-blur-md rounded-3xl border border-sky-100 shadow-2xl shadow-sky-900/10 p-6 sm:p-9 transition-all">
          {/* Top Shield Emblem with Radiant Concentric Halo */}
          <div className="flex flex-col items-center mb-5">
            <div className="relative flex items-center justify-center w-20 h-20">
              {/* Concentric Halo Rings */}
              <div className="absolute inset-0 rounded-full bg-sky-100/60 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-sky-100/90" />
              <div className="absolute inset-3.5 rounded-full bg-gradient-to-b from-sky-200 to-sky-100" />

              {/* Blue Shield Icon */}
              <div className="relative z-10 w-12 h-14 bg-gradient-to-b from-[#0284c7] to-[#0369a1] rounded-b-2xl rounded-t-sm flex items-center justify-center shadow-md">
                <Lock size={20} className="text-white" />
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0f284c] text-center mt-3">
              Management Access Only
            </h2>
            <p className="text-xs text-slate-500 text-center mt-1 max-w-xs leading-relaxed">
              This portal is restricted to authorized Management and Administrators only.
            </p>
          </div>

          {/* Inline Error Banner */}
          {displayedError && (
            <div className="mb-4 p-3 bg-red-50/90 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-in fade-in duration-200">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{displayedError}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User ID Field */}
            <div>
              <label htmlFor="userId" className="sr-only">
                User ID
              </label>
              <div className="relative flex items-center">
                <User
                  size={18}
                  className="absolute left-3.5 text-[#0284c7] pointer-events-none"
                />
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    if (clientValidation) setClientValidation(null);
                  }}
                  placeholder="User ID"
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3 bg-[#f2f8fc] border border-[#d2e4f3] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock
                  size={18}
                  className="absolute left-3.5 text-[#0284c7] pointer-events-none"
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (clientValidation) setClientValidation(null);
                  }}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3 bg-[#f2f8fc] border border-[#d2e4f3] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Primary Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0284c7] via-[#0072ce] to-[#005da6] hover:from-[#0369a1] hover:to-[#004e8c] text-white text-sm font-semibold rounded-xl shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <div className="w-5 h-5 rounded-full border border-white/80 flex items-center justify-center ml-1">
                    <ArrowRight size={12} className="text-white" />
                  </div>
                </>
              )}
            </button>
          </form>

          {/* Subtle Shield Checkmark */}
          <div className="flex justify-center mt-3 mb-4">
            <ShieldCheck size={18} className="text-sky-500/70" />
          </div>

          {/* Security Warning Box */}
          <div className="p-3.5 bg-[#fff3f3] border border-[#fecdd3] rounded-xl flex items-start gap-2.5">
            <div className="w-6 h-6 rounded bg-[#dc2626] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Lock size={12} />
            </div>
            <div className="text-[11px] leading-relaxed">
              <span className="font-bold text-[#b91c1c] block text-xs">
                Unauthorized Access Prohibited
              </span>
              <p className="text-[#991b1b] mt-0.5 text-[11px] font-normal">
                This system is for authorized MEIL Management personnel only. Any unauthorized
                attempt to access, use or modify this system is strictly prohibited and may be
                subject to disciplinary and legal action.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM SECURITY INDICATORS (4-COLUMN ROW)                     */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-300/60 text-center">
          {/* Indicator 1 */}
          <div className="flex flex-col items-center justify-center px-3 py-1">
            <ShieldCheck size={22} className="text-[#0284c7] mb-1.5" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wider text-slate-800 uppercase">
              SECURE ACCESS
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
              END-TO-END ENCRYPTION
            </span>
          </div>

          {/* Indicator 2 */}
          <div className="flex flex-col items-center justify-center px-3 py-1">
            <Users size={22} className="text-[#0284c7] mb-1.5" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wider text-slate-800 uppercase">
              MANAGEMENT USE ONLY
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
              RESTRICTED AUTHORIZATION
            </span>
          </div>

          {/* Indicator 3 */}
          <div className="flex flex-col items-center justify-center px-3 py-1">
            <FileText size={22} className="text-[#0284c7] mb-1.5" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wider text-slate-800 uppercase">
              ACTIVITY MONITORING
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
              ALL LOGIN ATTEMPTS ARE LOGGED
            </span>
          </div>

          {/* Indicator 4 */}
          <div className="flex flex-col items-center justify-center px-3 py-1">
            <Shield size={22} className="text-[#0284c7] mb-1.5" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wider text-slate-800 uppercase">
              DATA PROTECTION
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
              CONFIDENTIAL INFORMATION
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER                                                        */}
      {/* ------------------------------------------------------------- */}
      <footer className="relative z-10 w-full px-6 py-3.5 border-t border-slate-200/60 bg-white/40 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="w-full sm:w-auto text-center sm:text-left">
          {/* Centered copyright matching reference image */}
          <span className="font-medium text-slate-600 sm:ml-auto">
            &copy; 2025 Megha Engineering &amp; Infrastructures Limited. All Rights Reserved.
          </span>
        </div>

        <div className="text-slate-400 font-mono text-[10px] text-center sm:text-right">
          Version 1.0 <span className="text-slate-300">|</span> Internal
        </div>
      </footer>
    </div>
  );
};
