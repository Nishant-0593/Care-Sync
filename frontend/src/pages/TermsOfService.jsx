import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, ShieldCheck, CheckCircle2 } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-500 font-sans selection:bg-primary/30 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 dark:bg-violet-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-secondary/5 dark:bg-rose-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* Navigation / Header */}
        <div className="flex justify-between items-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-violet-400 transition-colors">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <Scale className="text-primary dark:text-violet-400" size={24} />
            <span className="text-xl font-black font-display bg-gradient-to-r from-primary to-indigo-600 dark:from-violet-400 dark:to-fuchsia-500 bg-clip-text text-transparent">CareSync</span>
          </div>
        </div>

        {/* Glassmorphic content wrapper */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-[2.5rem] shadow-2xl p-8 sm:p-12 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[5rem]" />
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-4 border-b border-slate-100 dark:border-slate-800/60 pb-6">
              <span className="inline-block px-3 py-1 rounded-xl bg-orange-100 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-wider">
                Legal Center
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white leading-tight">
                Terms of Service
              </h1>
              <p className="text-xs font-bold text-slate-450 dark:text-slate-500">
                Last updated: May 23, 2026
              </p>
            </div>

            <div className="space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-350">
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
                <p>
                  By creating an account, registering a childcare center, or utilizing any of the CareSync tracking feeds, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not access or use our applications.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. User Roles & Validation Keys</h2>
                <p>
                  To maintain strict child safety controls, CareSync limits classroom administration & teacher signup permissions through authorization security keys:
                </p>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-2 text-xs">
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p><strong>Administrators:</strong> Must provide the valid administrator sign-up key to unlock global center management dashboard profiles.</p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p><strong>Teachers/Educators:</strong> Must provide a staff invitation code provided by their center administrator during profile creation.</p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p><strong>Parents:</strong> Must be linked to active student records by verified admin or staff accounts to receive family feeds.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Acceptable Use Policy</h2>
                <p>
                  Users agree to upload accurate information regarding attendance status, nutritional menus, nap logs, and milestone logs. Sharing of abusive, inappropriate, or non-verified child media or logs inside messaging portals is strictly prohibited and constitutes immediate termination of the platform access.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Hosting & Blueprints</h2>
                <p>
                  CareSync and its related static services are compiled using static blueprints. Render environments represent active deployment instances. We make no warranty that servers are uninterrupted, but strive to guarantee maximum availability (99.9% uptime targets).
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
