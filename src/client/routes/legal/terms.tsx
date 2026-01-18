
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30 selection:text-indigo-900">
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Shield size={20} strokeWidth={3} />
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
        <h1 className="text-4xl font-black tracking-tight mb-2">Terms of Service</h1>
        <p className="text-slate-500 mb-12">Last updated: January 18, 2026</p>

        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600">
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing and using MarginsPro ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, strictly do not use the Service.</p>

          <h3>2. SaaS License</h3>
          <p>MarginsPro grants you a limited, non-exclusive, non-transferable license to use the financing and margin calculation software for your business operations. This license is contingent upon valid subscription payment.</p>

          <h3>3. Data Privacy & Security</h3>
          <p>We take data security seriously. Your financial data is encrypted and stored securely. We do not sell your proprietary pricing strategies to third parties. See our Privacy Policy for details.</p>

          <h3>4. Payment Terms</h3>
          <p>
            <strong>Subscription:</strong> Services are billed on a monthly or annual basis. 
            <strong>Refunds:</strong> We offer a 7-day money-back guarantee for new annual subscriptions. Monthly subscriptions are non-refundable but can be cancelled at any time.
          </p>

          <h3>5. Disclaimer of Warranties</h3>
          <p>The Service is provided "AS IS". While we strive for accuracy in our HPP and Margin algorithms, you acknowledge that financial decisions are your sole responsibility. MarginsPro is not a certified financial advisor.</p>

          <h3>6. Termination</h3>
          <p>We reserve the right to terminate accounts that abuse the API, attempt to reverse-engineer the algorithms, or violate these terms.</p>

          <h3>7. Governing Law</h3>
          <p>These terms are governed by the laws of the Republic of Indonesia.</p>

        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-500 text-sm">&copy; 2026 PT Koneksi Jaringan Indonesia. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
};
