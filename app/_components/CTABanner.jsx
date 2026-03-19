'use client';
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

function CTABanner() {
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) return;
    setSubmitting(true);
    const { error } = await supabase.from('Enquiry').insert([{
      name: form.name,
      phone: form.phone,
      email: form.email,
      message: 'Home buying journey enquiry',
    }]);
    if (!error) { setSubmitted(true); setForm({ name: '', phone: '', email: '' }); }
    setSubmitting(false);
  };

  return (
    <div style={{
      position: 'relative', borderRadius: '24px', overflow: 'hidden',
      display: 'grid', gridTemplateColumns: '1fr 1.7fr',
      background: '#0a0a0a', marginTop: '72px', minHeight: '190px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Jost:wght@400;500;600&display=swap');
        .cta-label { font-family:'Jost',sans-serif; font-size:12px; font-weight:600; color:#fff; letter-spacing:0.3px; margin-bottom:6px; display:block; }
        .cta-wrap { display:flex; align-items:center; background:rgba(255,255,255,0.97); border-radius:10px; height:46px; padding:0 14px; gap:8px; }
        .cta-prefix { font-family:'Jost',sans-serif; font-size:13px; font-weight:500; color:#c9906e; border-right:1.5px solid #ddd; padding-right:8px; white-space:nowrap; }
        .cta-inp { border:none; background:transparent; font-family:'Jost',sans-serif; font-size:13px; color:#333; outline:none; width:100%; }
        .cta-inp::placeholder { color:#bbb; }
        .cta-arrow { width:48px; height:48px; border-radius:50%; background:#c9906e; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; align-self:flex-end; transition:all 0.25s ease; box-shadow:0 4px 16px rgba(201,144,110,0.45); }
        .cta-arrow:hover { background:#b07050; transform:scale(1.06); }
        .cta-arrow:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
      `}</style>

      {/* LEFT — dark bg + topo texture + building photo + title */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Topographic texture */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image src="/cta-bg.png" alt="" fill style={{ objectFit: 'cover', opacity: 0.55 }} />
        </div>
        {/* Building image — bottom right, clipped */}
        <div style={{ position: 'absolute', right: '-10px', bottom: 0, width: '70%', height: '90%' }}>
          <Image src="/cta-building.png" alt="Property" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(130deg, #0a0a0a 25%, transparent 65%)' }} />
        </div>
        {/* Title */}
        <div style={{ position: 'relative', zIndex: 2, padding: '44px 36px', height: '100%', display: 'flex', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: '26px', fontWeight: 700, color: '#fff', lineHeight: 1.3, letterSpacing: '-0.2px' }}>
            Start your home buying<br />
            journey <em style={{ fontStyle: 'italic', color: '#c9906e' }}>Now!</em>
          </h2>
        </div>
      </div>

      {/* RIGHT — form */}
      <div style={{ background: 'rgba(5,5,5,0.9)', borderLeft: '1px solid rgba(255,255,255,0.06)', padding: '36px 40px', display: 'flex', alignItems: 'center' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <p style={{ fontSize: '32px', marginBottom: '10px' }}>✅</p>
            <p style={{ fontFamily: 'Playfair Display,serif', fontSize: '18px', color: '#fff' }}>We'll be in touch <em style={{ color: '#c9906e' }}>soon!</em></p>
            <p style={{ fontFamily: 'Jost,sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>Our team will reach out within 24 hours.</p>
            <button onClick={() => setSubmitted(false)} style={{ marginTop: '16px', fontFamily: 'Jost,sans-serif', fontSize: '12px', color: '#c9906e', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Send another →</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', width: '100%' }}>

            {/* Full Name */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span className="cta-label">Full Name</span>
              <div className="cta-wrap">
                <input className="cta-inp" placeholder="Enter Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
            </div>

            {/* Phone */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span className="cta-label">Phone Number</span>
              <div className="cta-wrap">
                <span className="cta-prefix">+91</span>
                <input className="cta-inp" placeholder="Enter Phone Number" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required />
              </div>
            </div>

            {/* Email */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span className="cta-label">Email</span>
              <div className="cta-wrap">
                <input className="cta-inp" placeholder="Enter Email ID" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
            </div>

            {/* Arrow submit */}
            <button type="submit" className="cta-arrow" disabled={submitting}>
              {submitting
                ? <span style={{ color: '#fff', fontSize: '14px' }}>•••</span>
                : <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 9h16M9.5 1.5L17 9l-7.5 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              }
            </button>

          </form>
        )}
      </div>
    </div>
  );
}

export default CTABanner;