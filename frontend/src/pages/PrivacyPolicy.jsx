import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
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
            <Shield className="text-primary dark:text-violet-400" size={24} />
            <span className="text-xl font-black font-display bg-gradient-to-r from-primary to-indigo-600 dark:from-violet-400 dark:to-fuchsia-500 bg-clip-text text-transparent">CareSync</span>
          </div>
        </div>

        {/* Glassmorphic content wrapper */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-[2.5rem] shadow-2xl p-8 sm:p-12 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[5rem]" />
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-4 border-b border-slate-100 dark:border-slate-800/60 pb-6">
              <span className="inline-block px-3 py-1 rounded-xl bg-primary/10 text-primary dark:text-violet-400 text-xs font-black uppercase tracking-wider">
                Legal Center
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white leading-tight">
                Privacy Policy
              </h1>
              <p className="text-xs font-bold text-slate-450 dark:text-slate-500">
                Last updated: May 23, 2026
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 py-4">
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <Eye size={20} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Transparency</h3>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 font-medium">We outline exactly what data is collected and why.</p>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <Lock size={20} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Security</h3>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 font-medium">Enterprise grade encryption to protect kid & family data.</p>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3">
                  <FileText size={20} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Compliance</h3>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 font-medium">Adhering strictly to child protection & privacy standards.</p>
              </div>
            </div>

            <div className="space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-350">
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
                <p>
                  CareSync provides a platform to connect families and early childhood educators. To perform this, we collect:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 font-medium text-xs">
                  <li><strong>Account Information:</strong> Name, email address, password, phone number, and profile details.</li>
                  <li><strong>Child Information:</strong> Child's first and last name, date of birth, gender, allergy list, medical records, and photos uploaded by authorized teachers.</li>
                  <li><strong>Messaging & Log Details:</strong> Communication logs, photos/media shared in chats, activity feeds (meal charts, nap schedules, check-in sheets).</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. How We Use Your Data</h2>
                <p>
                  We process data to deliver, optimize, and protect our platform:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 font-medium text-xs">
                  <li>To provide real-time classroom ratio logging and activity updates for parents.</li>
                  <li>To facilitate messaging boards and instant chat between parents and preschool staff.</li>
                  <li>To strictly secure database verification and prevent unauthorized signups via special administrative key validation.</li>
                  <li>We do not sell, rent, or lease your personal data or child photos to third-party advertisers.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Security Measures</h2>
                <p>
                  All database tables (MongoDB and PostgreSQL notices) run under secure, authenticated SSL networks. Critical user passwords are encrypted using strong bcrypt hashing. Communication lines through Socket.io web sockets use secure endpoints, preventing MITM interception.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Your Control & Access</h2>
                <p>
                  Families retain complete ownership over their child's data. Parents and legal guardians can request profile deletions or historical records at any time. Center administrators have direct workspace rights to manage and remove classroom rosters instantly.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
