
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ChevronLeft } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30 selection:text-indigo-900">
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Lock size={20} strokeWidth={3} />
            </div>
            <span className="font-extrabold tracking-tight text-lg text-slate-900">MARGINS<span className="text-indigo-600">PRO</span></span>
          </div>
          <button onClick={() => navigate('/')} className="text-sm font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1">
            <ChevronLeft size={16} />
            Back to Home
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-12">Last updated: January 18, 2026</p>

        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600">
          <h3>1. Information We Collect</h3>
          <p>
            <strong>Account Data:</strong> Name, email, and billing address.<br/>
            <strong>Business Data:</strong> Product costs, recipes, sales volume, and pricing configurations.<br/>
            <strong>Usage Data:</strong> Application interactions and feature usage logs.
          </p>

          <h3>2. How We Use Your Data</h3>
          <p>
            We use your data to:
            <ul className="list-disc pl-5">
               <li>Calculate accurate margins and HPP.</li>
               <li>Process subscription payments via Midtrans.</li>
               <li>Improve algorithm accuracy.</li>
               <li>Send critical system updates.</li>
            </ul>
          </p>

          <h3>3. Data Storage & Security</h3>
          <p>MarginsPro uses enterprise-grade encryption for database storage. We partner with Midtrans for payment processing, meaning your credit card details never touch our servers.</p>

          <h3>4. Third-Party Sharing</h3>
          <p>We do not share your private business logic (recipes, costs) with anyone. Aggregated, anonymized data may be used for "Market Benchmark" features, but never traceable to your specific entity.</p>

          <h3>5. Cookies</h3>
          <p>We use local storage and cookies to maintain your login session and preferences.</p>

          <h3>6. Your Rights</h3>
          <p>You have the right to request a full export of your data (JSON format) or permanent deletion of your account at any time.</p>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-500 text-sm">Questions? Contact privacy@margins.pro</p>
        </div>
      </main>
    </div>
  );
};
