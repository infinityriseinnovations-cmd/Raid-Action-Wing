import React, { useState } from 'react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="bg-[#0a192f] text-white py-12 px-4 lg:px-8 border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">
              Home
            </button>
            <span>/</span>
            <span className="text-red-400 font-bold">Contact Us</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight">
            Contact & State Headquarters
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
            The unit of Research, Analysis, Training & Investigation — RAWF Raid Action Wing Foundation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Contact Form */}
          <div className="lg:col-span-7 bg-white border-2 border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-headline font-bold text-lg text-slate-900 uppercase">
                Send Direct Message to Headquarters Desk
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                For administrative inquiries, media accreditation, or general public communication.
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98XXX XXXXX"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Subject / Wing Selection *
                    </label>
                    <select
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    >
                      <option value="">Select subject...</option>
                      <option>General Institutional Inquiry</option>
                      <option>Media & Press Accreditation</option>
                      <option>Whistleblower Protection Advisory</option>
                      <option>State Directorate Coordination</option>
                      <option>Legal Aid Collaboration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">
                    Your Message / Detailed Query *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0d47a1] hover:bg-blue-900 text-white font-bold uppercase rounded transition-colors cursor-pointer"
                >
                  Send Official Communication
                </button>
              </form>
            ) : (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-3">
                <span className="material-symbols-outlined text-3xl text-emerald-600">mark_email_read</span>
                <h4 className="font-headline font-bold text-slate-900 text-base">
                  Communication Dispatched
                </h4>
                <p className="text-xs text-slate-600">
                  Thank you, {name}. Your inquiry has been routed to the National Action Command Secretariat. We will respond via email within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                    setSubject('');
                  }}
                  className="px-4 py-2 bg-slate-800 text-white font-bold text-xs uppercase rounded cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>

          {/* Right Contact Info Details */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white border-2 border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h4 className="font-headline font-bold text-base text-slate-900 uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600">contact_phone</span>
                National Command Information
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Headquarters
                  </span>
                  <strong className="text-slate-900">National Action Command, New Delhi, India</strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    24/7 Toll-Free National Helpline
                  </span>
                  <a href="tel:18007292355" className="text-red-600 font-mono font-bold text-sm hover:underline">
                    1800-RAW-CELL (1800-729-2355)
                  </a>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Official Inquiries & Telemetry Desk
                  </span>
                  <span className="text-slate-900 font-mono font-semibold">
                    info@raidactionwing.in
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Statutory Trust Details
                  </span>
                  <span className="text-slate-600 font-mono">
                    IFA No. 760 under Indian Trusts Act 1882
                  </span>
                </div>
              </div>
            </div>

            {/* Regional Hubs */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-xs">
              <span className="font-bold text-slate-900 uppercase block font-headline">
                Key Territorial Directorates
              </span>
              <div className="space-y-2 text-slate-600">
                <div className="pb-1.5 border-b border-slate-200">
                  <strong className="text-slate-800 block">Maharashtra State Directorate</strong>
                  <span>Nariman Point / Fort, Mumbai, Maharashtra</span>
                </div>
                <div className="pb-1.5 border-b border-slate-200">
                  <strong className="text-slate-800 block">Gujarat State Directorate</strong>
                  <span>Sector 11, Gandhinagar / Paldi, Ahmedabad, Gujarat</span>
                </div>
                <div className="pb-1.5 border-b border-slate-200">
                  <strong className="text-slate-800 block">Uttar Pradesh State Directorate</strong>
                  <span>Gomti Nagar / Hazratganj, Lucknow, Uttar Pradesh</span>
                </div>
                <div>
                  <strong className="text-slate-800 block">Madhya Pradesh State Directorate</strong>
                  <span>Arera Colony, Bhopal, Madhya Pradesh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
