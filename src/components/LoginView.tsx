/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, Sparkles, Building } from 'lucide-react';

const bakeryBg = '/luxurious_bakery_marble_counter_1779843206730.png';
const glassLogo = '/nomad_hub_glass_logo_1779845101592.png'; // Assuming it might be there or not used

interface LoginViewProps {
    onLoginSuccess: (email: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
    const [email, setEmail] = useState('owner@nomadhub.app');
    const [password, setPassword] = useState('************');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            setErrorMessage('Please enter your email address');
            return;
        }
        setLoading(true);
        setErrorMessage('');

        // Simulate high-fidelity authentic secure dashboard check sequence
        setTimeout(() => {
            setLoading(false);
            onLoginSuccess(email);
        }, 1200);
    };

    const handleGoogleLogin = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onLoginSuccess('executive.elite@nomadhub.app');
        }, 1000);
    };

    return (
        <div className="flex min-h-screen w-full bg-white text-slate-800" id="login-container">
            {/* LEFT SIDE: Luxury Bakery Background & Tech Overlay Mesh */}
            <div className="relative hidden w-1/2 overflow-hidden bg-zinc-950 md:flex lg:w-[55%]">
                <img
                    src={bakeryBg}
                    alt="Nomad Hub Luxury Boutique Bakery"
                    className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-10000 hover:scale-105"
                    referrerPolicy="no-referrer"
                    id="bakery-bg-img"
                />

                {/* Modern Blue & Amber Gradient overlays to match branding */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-transparent to-amber-500/10 mix-blend-multiply" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-zinc-950/80 to-transparent" />

                {/* Constellation Golden & Cyber Mesh Overlays */}
                <svg className="absolute inset-0 h-full w-full opacity-65" id="cyber-mesh-vector">
                    <defs>
                        <radialGradient id="mesh-glow" cx="20%" cy="80%" r="50%">
                            <stop offset="0%" stopColor="#1e40af" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#mesh-glow)" />

                    {/* Futuristic subtle nodes matching the user's overlay dots */}
                    <g stroke="rgba(255,255,255,0.12)" strokeWidth="1">
                        <line x1="10%" y1="20%" x2="25%" y2="35%" />
                        <line x1="25%" y1="35%" x2="20%" y2="60%" />
                        <line x1="20%" y1="60%" x2="40%" y2="50%" />
                        <line x1="40%" y1="50%" x2="35%" y2="25%" />
                        <line x1="35%" y1="25%" x2="10%" y2="20%" />

                        {/* Additional secondary clusters */}
                        <line x1="40%" y1="50%" x2="60%" y2="65%" />
                        <line x1="60%" y1="65%" x2="55%" y2="85%" />
                        <line x1="55%" y1="85%" x2="35%" y2="78%" />
                        <line x1="35%" y1="78%" x2="20%" y2="60%" />

                        {/* Glowing lines in bottom portion */}
                        <line x1="55%" y1="85%" x2="80%" y2="90%" stroke="rgba(30,64,175,0.2)" strokeWidth="1.5" />
                        <line x1="80%" y1="90%" x2="95%" y2="70%" stroke="rgba(30,64,175,0.2)" strokeWidth="1.5" />
                    </g>

                    {/* Dots on nodes */}
                    <g fill="rgba(255,255,255,0.6)">
                        <circle cx="10%" cy="20%" r="1.5" />
                        <circle cx="25%" cy="35%" r="2" className="animate-pulse" />
                        <circle cx="20%" cy="60%" r="1.5" />
                        <circle cx="40%" cy="50%" r="2" />
                        <circle cx="35%" cy="25%" r="1.5" />
                        <circle cx="60%" cy="65%" r="2" />
                        <circle cx="55%" cy="85%" r="2.5" className="animate-ping" style={{ animationDuration: '3s' }} />
                        <circle cx="35%" cy="78%" r="1.5" />
                        <circle cx="80%" cy="90%" r="2" />
                    </g>

                    {/* Light label marking coordinates */}
                    <text x="5%" y="95%" className="font-mono text-[10px] tracking-wider fill-white/40">SYSOP: NOMAD_HUB_SECURE_NODE_1A</text>
                </svg>

                {/* Ambient branding indicator */}
                <div className="absolute top-[8%] left-[8%] flex items-center space-x-3 text-white">
                    <div className="rounded-full bg-white/10 p-2.5 backdrop-blur-md">
                        <Building className="h-5 w-5 text-amber-100" />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium tracking-wide">Nomad Hub Flagship</h4>
                        <p className="text-[11px] text-white/50">Paris • Jakarta • Tokyo</p>
                    </div>
                </div>

                {/* Rich atmospheric testimonial overlay */}
                <div className="absolute right-[8%] bottom-[10%] left-[8%] rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
                    <p className="font-serif text-lg italic leading-relaxed text-amber-50/90">
                        "We wanted to build something that was visually striking, extremely minimalist, and operated like structured elite clockwork."
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-white">Nomad Hub Elite Group</p>
                            <p className="text-[10px] text-amber-200/60">Creative Gastronomy & Boutique Cafés</p>
                        </div>
                        <div className="text-[11px] font-mono text-white/40">EST. 2024</div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Interactive Login Interface */}
            <div className="flex w-full flex-col justify-between px-6 py-12 md:w-1/2 md:px-12 lg:w-[45%] lg:px-20" id="login-form-side">
                {/* Empty placeholder to push the content exactly centered vertically */}
                <div className="hidden h-8 sm:block" />

                <div className="my-auto mx-auto w-full max-w-[420px]" id="login-inner-card">
                    {/* Brand Logo with metallic look and glow ring */}
                    <div className="mb-8 flex justify-center" id="logo-wrapper">
                        <div className="glow-ring relative flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                            {/* Inner metallic reflection rings */}
                            <div className="absolute inset-0.5 rounded-full border border-slate-100/50 bg-gradient-to-b from-slate-50 to-slate-100/20" />

                            {/* Iconic "N" Brand Mark mirroring reference image exactly */}
                            <svg viewBox="0 0 100 100" className="relative h-10 w-10 text-blue-900" id="brand-n-logo">
                                <path
                                    d="M25 75 L25 25 L45 25 L75 75 L75 25"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="11"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle cx="21" cy="25" r="5.5" fill="currentColor" />
                                <circle cx="79" cy="75" r="5.5" fill="currentColor" />
                            </svg>
                        </div>
                    </div>

                    {/* Heading with exquisite Serifs */}
                    <div className="mb-6 text-center" id="welcome-header">
                        <h1 className="font-sans text-3xl font-semibold tracking-tight text-slate-800">
                            Welcome back <span className="font-serif italic font-medium text-slate-900">Elite</span>
                        </h1>
                        <p className="mt-2 text-[14px] text-slate-500 tracking-wide">
                            Enter your credentials to access your dashboard.
                        </p>
                    </div>

                    {/* Google SSO button mirroring metallic gradient */}
                    <div className="mb-6" id="google-sso-container">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            type="button"
                            className="metallic-btn flex w-full items-center justify-center gap-3 rounded-full py-3.5 px-6 text-[14px] font-medium text-slate-700 transition-all active:scale-[0.98] cursor-pointer"
                            id="google-login-btn"
                        >
                            {/* Google G Logo in vectors */}
                            <svg viewBox="0 0 24 24" className="h-5 w-5" id="google-icon-svg">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.1-.13-.19-.27-.27-.41-.12-.13-.23-.26-.28-.38z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span>Continue with Google</span>
                        </button>
                    </div>

                    {/* Elegant Section Separator */}
                    <div className="mb-6 flex items-center justify-between" id="divider-container">
                        <span className="h-[1px] w-full bg-slate-200" />
                        <span className="mx-4 shrink-0 text-[10px] font-semibold tracking-wider text-slate-400">
                            OR CONTINUE WITH EMAIL
                        </span>
                        <span className="h-[1px] w-full bg-slate-200" />
                    </div>

                    {/* Credentials Action Form */}
                    <form onSubmit={handleSubmit} className="space-y-4" id="credentials-form">
                        {errorMessage && (
                            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-100" id="login-error-toast">
                                {errorMessage}
                            </div>
                        )}

                        {/* Email Field container */}
                        <div className="flex flex-col space-y-1.5" id="field-email">
                            <label htmlFor="email-input" className="text-xs font-semibold tracking-wide text-slate-600">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    id="email-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-3.5 pr-4 pl-10 text-[14px] text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-blue-900 focus:bg-white focus:ring-1 focus:ring-blue-900/10"
                                    placeholder="owner@nomadhub.app"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field container */}
                        <div className="flex flex-col space-y-1.5" id="field-password">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password-input" className="text-xs font-semibold tracking-wide text-slate-600">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowNotification(true)}
                                    className="text-xs font-semibold text-blue-900/80 hover:text-blue-900 hover:underline cursor-pointer"
                                    id="forgot-password-link"
                                >
                                    Forgot?
                                </button>
                            </div>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <Lock className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    id="password-input"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-3.5 pr-10 pl-10 text-[14px] text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-blue-900 focus:bg-white focus:ring-1 focus:ring-blue-900/10"
                                    placeholder="Password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                                    id="password-visibility-toggle"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Shiny glossy blue button mirroring referenceExactly */}
                        <div className="pt-2" id="submit-container">
                            <button
                                type="submit"
                                disabled={loading}
                                className="glossy-blue-btn flex w-full items-center justify-center rounded-full py-4 px-6 text-[15px] font-semibold text-white transition-all active:scale-[0.98] shadow-md cursor-pointer relative overflow-hidden"
                                id="sign-in-btn"
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                        <span className="tracking-wide">Verifying credentials...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-1 justify-center w-full">
                                        <span>Sign In</span>
                                        <ArrowRight className="h-4 w-4 ml-1 opacity-80" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Quick Access Helper Trigger widgets for elite review */}
                    <div className="mt-5 rounded-lg border border-amber-100 bg-amber-50/40 p-3 text-center text-xs text-amber-800" id="quick-tip">
                        <span className="font-semibold">Elite Access Code Loaded</span>. Simply click <strong>Sign In</strong> or <strong>Google</strong> to bypass security and launch the workspace.
                    </div>
                </div>

                {/* Create Store and Footer information */}
                <div className="mt-8 text-center text-xs text-slate-500" id="footer-login">
                    <p>
                        Don't have an account yet?{' '}
                        <button
                            onClick={() => {
                                setEmail('guest@nomadhub.app');
                                setPassword('guestpass');
                                setErrorMessage('Guest credentials filled. Click "Sign In" to proceed!');
                            }}
                            className="font-semibold text-blue-900 hover:underline cursor-pointer"
                            id="create-store-link"
                        >
                            Create a store
                        </button>
                    </p>
                </div>

                {/* Temporary popups */}
                {showNotification && (
                    <div className="fixed right-6 bottom-6 z-50 rounded-xl bg-slate-900 text-white shadow-xl p-4 flex items-center space-x-3 text-xs w-72 animate-bounce">
                        <Sparkles className="h-4 w-4 text-yellow-400 shrink-0" />
                        <div>
                            <p className="font-semibold text-slate-200">System Bypass Active</p>
                            <p className="text-slate-400">Credential checks are set to allow safe bypass. Just click Sign In!</p>
                        </div>
                        <button onClick={() => setShowNotification(false)} className="text-white hover:text-slate-300 font-bold px-1 pl-2">×</button>
                    </div>
                )}
            </div>
        </div>
    );
}
