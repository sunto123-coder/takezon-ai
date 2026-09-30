import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { submitContactMessage } from '../services/firebaseService';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  MessageSquare,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';

export const ContactPageView: React.FC = () => {
  const { settings, addToast, goBack, navigateTo } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'Product Inquiry',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      addToast('Please fill in all required fields.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'General Inquiry',
        category: formData.category,
        message: formData.message.trim(),
      });

      setSubmitted(true);
      addToast('Message received! Our USA support team will reply within 24 hours.', 'success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'Product Inquiry',
        message: '',
      });
    } catch (err: any) {
      addToast('Error sending message: ' + (err.message || 'Please try again.'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Navigation Row */}
      <div className="mb-6 flex items-center justify-between">
        <button 
          type="button"
          onClick={goBack}
          className="group inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-950 text-xs font-bold border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
          title="Return to previous view (ফিরে যান)"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-indigo-600" />
          <span>Back to Store (ফিরে যান)</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          Home Storefront
        </button>
      </div>

      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>TakeZon Concierge Support</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-950 tracking-tight">
          Get in Touch with Our Team
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          Have an inquiry about an affiliate deal, brand partnership, product recommendation, or technical question? We are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Information & Hours (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            <h2 className="font-heading font-black text-xl sm:text-2xl text-white mb-2">
              USA Operations Headquarters
            </h2>
            <p className="text-xs text-slate-300 mb-8 leading-relaxed">
              TakeZon is managed by curated product researchers and affiliate editors headquartered in Austin, Texas.
            </p>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400 shrink-0 border border-slate-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Headquarters</span>
                  <span className="font-semibold text-white leading-snug">
                    {settings.contactAddress || '100 Congress Avenue, Suite 2100, Austin, TX 78701'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 shrink-0 border border-slate-700">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Email Inquiries</span>
                  <a href={`mailto:${settings.contactEmail || 'contact@takezon.com'}`} className="font-semibold text-white hover:text-amber-400 transition-colors">
                    {settings.contactEmail || 'contact@takezon.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 shrink-0 border border-slate-700">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Toll-Free Support Line</span>
                  <span className="font-semibold text-white">
                    {settings.contactPhone || '+1 (800) 825-3966'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-slate-800 text-purple-400 shrink-0 border border-slate-700">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Operating Hours</span>
                  <span className="font-semibold text-white block">
                    Mon - Fri: 8:00 AM – 7:00 PM EST
                  </span>
                  <span className="text-xs text-slate-400">
                    Sat: 9:00 AM – 3:00 PM EST
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Average response time: &lt; 4 hours during business days</span>
            </div>
          </div>

          {/* Quick FAQ info box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Affiliate & Partnership Note</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you an authorized US brand or retailer looking to showcase your new smart gadget, camera accessories, or fitness gear on TakeZon? Select <span className="font-bold text-slate-800">"Brand / Merchant Partnership"</span> in the category dropdown below.
            </p>
          </div>
        </div>

        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-2xl text-slate-950">
                  Message Dispatched Successfully!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for contacting TakeZon. Your transmission has been logged into our secure Firebase system. An editor or support representative will reach out to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-heading font-black text-xl text-slate-950 mb-4">
                  Send Us a Direct Message
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Michael Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. michael@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm focus:outline-hidden bg-white cursor-pointer"
                    >
                      <option value="Product Inquiry">Product Inquiry / Deal Check</option>
                      <option value="Brand / Merchant Partnership">Brand / Merchant Partnership</option>
                      <option value="Affiliate / CPA Program">Affiliate / CPA Program</option>
                      <option value="Report Broken Link / Outdated Deal">Report Broken Link / Outdated Deal</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Inquiring about Samsung TV offer"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Detailed Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide details about your question, brand, or deal inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm focus:outline-hidden resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Sending to Firebase...</span>
                    ) : (
                      <>
                        <span>Submit Secure Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2.5">
                    Submissions are stored securely in Cloud Firestore and monitored by authorized admins.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
