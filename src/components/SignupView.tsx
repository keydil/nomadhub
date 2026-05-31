/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
// import { motion } from 'motion/react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, Sparkles, Building, Store, ChevronRight } from 'lucide-react';

const bakeryBg = '/src/assets/images/luxurious_bakery_marble_counter_1779843206730.png';

interface SignupViewProps {
    onSignupSuccess: (email: string) => void;
    onSwitchToLogin: () => void;
}

export default function SignupView({ onSignupSuccess, onSwitchToLogin }: SignupViewProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [storeName, setStoreName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successToast, setSuccessToast] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            setErrorMessage('Please enter your email address');
            return;
        }
        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long');
            return;
        }
        if (!storeName.trim()) {
            setErrorMessage('Please enter your boutique/store name');
            return;
        }

        setLoading(true);
        setErrorMessage('');

        // Simulate high-fidelity creation sequence
        setTimeout(() => {
            setLoading(false);
            setSuccessToast(true);
            setTimeout(() => {
                onSignupSuccess(email);
            }, 1500);
        }, 1500);
    };

    const handleGoogleSignup = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onSignupSuccess('creative.founder@nomadhub.app');
        }, 1000);
    };

    return (
        <div className="flex min-h-screen w-full bg-white text-slate-800" id="signup-container">
            {/* LEFT SIDE: Interactive Signup Form (Form on Left for Signup to feel distinct yet completely unified) */}
            <div className="flex w-full flex-col justify-between px-6 py-12 md:w-1/2 md:px-12 lg:w-[45%] lg:px-20" id="signup-form-side">
                {/* Mobile top navigation/header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-100 sm:pb-0 sm:border-0" id="signup-mobile-nav">
                    <div className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 text-white">
                            <span className="font-mono text-sm font-bold">N</span>
                        </div>
                        <span className="text-sm font-bold tracking-tight text-slate-800">Nomad Hub</span>
                    </div>
                    <button
                        onClick={onSwitchToLogin}
                        className="text-xs font-semibold text-blue-900 hover:underline cursor-pointer sm:hidden"
                    >
                        Sign In
                    </button>
                </div>

                <div className="my-auto mx-auto w-full max-w-[420px] pt-8 sm:pt-0" id="signup-inner-card">
                    {/* Header with high-craft typography */}
                    <div className="mb-8" id="signup-header">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 mb-3 border border-amber-100">
                            <Sparkles className="h-3 w-3" />
                            <span>Launch your Luxury Brand</span>
                        </div>
                        <h1 className="font-sans text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                            Create your <br />
                            <span className="font-serif italic font-normal text-blue-900">Boutique Storefront</span>
                        </h1>
                        <p className="mt-2 text-[14px] text-slate-500 tracking-wide">
                            Enter your details below to establish your secure node.
                        </p>
                    </div>

                    {/* Premium Google Sign Up option */}
                    <div className="mb-6" id="google-sso-signup-container">
                        <button
                            onClick={handleGoogleSignup}
                            disabled={loading}
                            type="button"
                            className="metallic-btn flex w-full items-center justify-center gap-3 rounded-full py-3.5 px-6 text-[14px] font-medium text-slate-700 transition-all active:scale-[0.98] cursor-pointer"
                            id="google-signup-btn"
                        >
                            <svg viewBox="0 0 24 24" className="h-5 w-5" id="google-icon-svg-signup">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.1-.13-.19-.27-.27-.41-.12-.13-.23-.26-.28-.38z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                            </svg>
                            <span>Sign up with Google</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="mb-6 flex items-center justify-between" id="divider-signup-container">
                        <span className="h-[1px] w-full bg-slate-200" />
                        <span className="mx-4 shrink-0 text-[10px] font-semibold tracking-wider text-slate-400">
                            OR REGISTER WITH EMAIL
                        </span>
                        <span className="h-[1px] w-full bg-slate-200" />
                    </div>

                    {/* Form fields */}
                    <form onSubmit={handleSubmit} className="space-y-4" id="signup-credentials-form">
                        {errorMessage && (
                            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-100" id="signup-error-toast">
                                {errorMessage}
                            </div>
                        )}

                        {/* Store/Boutique Name */}
                        <div className="flex flex-col space-y-1.5" id="field-store-name">
                            <label htmlFor="store-name-input" className="text-xs font-semibold tracking-wide text-slate-600">
                                Store / Café Boutique Name
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <Store className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    id="store-name-input"
                                    type="text"
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-3.5 pr-4 pl-10 text-[14px] text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-blue-900 focus:bg-white focus:ring-1 focus:ring-blue-900/10"
                                    placeholder="e.g. Nomad Hub Flagship"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="flex flex-col space-y-1.5" id="field-signup-email">
                            <label htmlFor="signup-email-input" className="text-xs font-semibold tracking-wide text-slate-600">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    id="signup-email-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-3.5 pr-4 pl-10 text-[14px] text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-blue-900 focus:bg-white focus:ring-1 focus:ring-blue-900/10"
                                    placeholder="name@establishment.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col space-y-1.5" id="field-signup-password">
                            <label htmlFor="signup-password-input" className="text-xs font-semibold tracking-wide text-slate-600">
                                Password (min. 6 characters)
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <Lock className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    id="signup-password-input"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-3.5 pr-10 pl-10 text-[14px] text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-blue-900 focus:bg-white focus:ring-1 focus:ring-blue-900/10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                                    id="signup-password-visibility-toggle"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Glossary Blue Submit button */}
                        <div className="pt-3" id="signup-submit-container">
                            <button
                                type="submit"
                                disabled={loading}
                                className="glossy-blue-btn flex w-full items-center justify-center rounded-full py-4 px-6 text-[15px] font-semibold text-white transition-all active:scale-[0.98] shadow-md cursor-pointer relative overflow-hidden animate-pulse"
                                id="signup-submit-btn"
                                style={{ animationDuration: '4s' }}
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                        <span className="tracking-wide">Deploying Secure Node...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-1 justify-center w-full">
                                        <span>Create Elite Account</span>
                                        <ArrowRight className="h-4 w-4 ml-1 opacity-80" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Dynamic transition link */}
                <div className="mt-8 text-center text-xs text-slate-500" id="footer-signup">
                    <p>
                        Already have an account?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="font-bold text-blue-900 hover:underline cursor-pointer"
                            id="goto-login-btn"
                        >
                            Sign In to Store
                        </button>
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: Gorgeous Reversed Luxury Imagery & Glowing Atmospheric Overlay */}
            <div className="relative hidden w-1/2 overflow-hidden bg-zinc-950 md:flex lg:w-[55%]" id="signup-imagery-side">
                <img
                    src={bakeryBg}
                    alt="Nomad Hub Luxury Boutique Bakery Symmetrical"
                    className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-10000 hover:scale-105 scale-x-[-1]"
                    referrerPolicy="no-referrer"
                    id="bakery-bg-img-signup"
                />

                {/* Symmetrical elegant overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-tl from-slate-900/40 via-transparent to-amber-500/10 mix-blend-multiply" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-zinc-950/80 to-transparent" />

                {/* Decorative Constellations in inverse layout */}
                <svg className="absolute inset-0 h-full w-full opacity-60" id="cyber-mesh-vector-signup">
                    <defs>
                        <radialGradient id="mesh-glow-signup" cx="80%" cy="80%" r="50%">
                            <stop offset="0%" stopColor="#1e40af" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#mesh-glow-signup)" />

                    <g stroke="rgba(255,255,255,0.12)" strokeWidth="1">
                        <line x1="90%" y1="20%" x2="75%" y2="35%" />
                        <line x1="75%" y1="35%" x2="80%" y2="60%" />
                        <line x1="80%" y1="60%" x2="60%" y2="50%" />
                        <line x1="60%" y1="50%" x2="65%" y2="25%" />
                        <line x1="65%" y1="25%" x2="90%" y2="20%" />
                        <line x1="60%" y1="50%" x2="40%" y2="65%" />
                    </g>

                    <g fill="rgba(255,255,255,0.6)">
                        <circle cx="90%" cy="20%" r="1.5" />
                        <circle cx="75%" cy="35%" r="2" />
                        <circle cx="80%" cy="60%" r="1.5" />
                        <circle cx="60%" cy="50%" r="2" className="animate-pulse" />
                        <circle cx="65%" cy="25%" r="1.5" />
                        <circle cx="40%" cy="65%" r="2" />
                    </g>

                    <text x="50%" y="95%" className="font-mono text-[10px] tracking-wider fill-white/40 text-right">NODE: SECURE_SIGNUP_SYSTEM_02B</text>
                </svg>

                {/* Ambient branding signature */}
                <div className="absolute top-[8%] right-[8%] flex items-center space-x-3 text-white" id="brand-indicator-signup">
                    <div className="text-right">
                        <h4 className="text-sm font-medium tracking-wide">Nomad Hub Flagship</h4>
                        <p className="text-[11px] text-white/50">Paris • Jakarta • Tokyo</p>
                    </div>
                    <div className="rounded-full bg-white/10 p-2.5 backdrop-blur-md">
                        <Building className="h-5 w-5 text-amber-100" />
                    </div>
                </div>

                {/* Embedded value statement of Signup page */}
                <div className="absolute right-[8%] bottom-[10%] left-[8%] rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
                    <div className="flex items-center space-x-3 text-amber-150 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm overflow-hidden p-1 bg-gradient-to-b from-white to-slate-100">
                            <span className="font-mono text-xs font-black tracking-tighter text-blue-900 leading-none">N</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white uppercase tracking-wider">NomadHub Architecture</p>
                            <p className="text-[10px] text-amber-200/60">Instant digital deployment with zero waiting arrays.</p>
                        </div>
                    </div>
                    <p className="font-serif text-lg italic leading-relaxed text-amber-50/90 pr-4">
                        "We provide creative gastronomic elites with instantaneous tools to curate boutique customer journeys, manage elite menus, and track multi-channel pastry volume seamlessly."
                    </p>
                </div>
            </div>

            {/* Success notification popup */}
            {successToast && (
                <div className="fixed right-6 bottom-6 z-50 rounded-xl bg-slate-900 text-white shadow-2xl p-4 flex items-center space-x-3 text-xs w-72 animate-bounce">
                    <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div>
                        <p className="font-semibold text-slate-200">Boutique Account Created!</p>
                        <p className="text-slate-400">Loading your interactive elite console...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
