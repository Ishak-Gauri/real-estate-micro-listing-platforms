'use client';
import React, { useState } from 'react';
import Link from 'next/link';

function FooterSection() {
  const [showCallForm, setShowCallForm] = useState(false);
  const [callForm, setCallForm] = useState({ name: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleCallRequest = async (e) => {
    e.preventDefault();
    // Save to supabase or send email here
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowCallForm(false); setCallForm({ name: '', phone: '' }); }, 3000);
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", marginTop: '0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');

        /* HERO BANNER */
        .footer-hero {
          position: relative; width: 100%; height: 380px; overflow: hidden;
          border-radius: 20px;
        }
        .footer-hero-img {
          width: 100%; height: 100%; object-fit: cover; object-position: center 30%;
          display: block;
        }
        .footer-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%);
        }
        .footer-hero-content {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 32px;
        }
        .footer-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 3.5vw, 40px);
          font-weight: 700; color: rgba(255,255,255,0.85);
          text-align: center; line-height: 1.3;
          letter-spacing: 2px; text-transform: uppercase;
        }
        .footer-hero-title strong { color: #fff; display: block; font-size: clamp(26px, 4vw, 46px); }

        /* REQUEST CALL BUTTON */
        .request-call-btn {
          width: 148px; height: 148px; border-radius: 50%;
          background: linear-gradient(135deg, #c9906e, #b07050);
          border: none; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 4px; position: relative;
          box-shadow: 0 8px 32px rgba(201,144,110,0.5), 0 0 0 2px rgba(255,255,255,0.1);
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          text-decoration: none;
        }
        .request-call-btn::before {
          content: ''; position: absolute;
          inset: -6px; border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.25);
          animation: ringPulse 2.5s ease-in-out infinite;
        }
        .request-call-btn::after {
          content: ''; position: absolute;
          inset: -14px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          animation: ringPulse 2.5s ease-in-out 0.5s infinite;
        }
        .request-call-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 16px 48px rgba(201,144,110,0.65), 0 0 0 2px rgba(255,255,255,0.2);
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 0.2; }
        }
        .request-call-text {
          font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 600;
          color: #fff; letter-spacing: 1.5px; text-transform: uppercase;
          text-align: center; line-height: 1.4; position: relative; z-index: 1;
        }

        /* CALL MODAL */
        .call-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px); z-index: 100;
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        .call-modal {
          background: #fff; border-radius: 20px; padding: 40px;
          width: 420px; max-width: 90vw; position: relative;
          box-shadow: 0 24px 80px rgba(0,0,0,0.2);
          animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .modal-close {
          position: absolute; top: 16px; right: 16px;
          width: 32px; height: 32px; border-radius: 50%;
          background: #f5f4f0; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; color: #666; transition: all 0.2s ease;
        }
        .modal-close:hover { background: #e8e0d0; color: #333; }

        .modal-input {
          width: 100%; padding: 13px 16px;
          border: 1.5px solid #e8e0d0; border-radius: 10px;
          font-family: 'Jost', sans-serif; font-size: 14px; color: #333;
          outline: none; transition: border-color 0.2s ease; background: #fefcf8;
        }
        .modal-input:focus { border-color: #c9906e; box-shadow: 0 0 0 3px rgba(201,144,110,0.1); }
        .modal-input::placeholder { color: #bbb; }

        .modal-submit {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #c9906e, #b07050);
          border: none; border-radius: 10px; cursor: pointer;
          font-family: 'Jost', sans-serif; font-size: 14px; font-weight: 600;
          color: #fff; letter-spacing: 0.3px;
          box-shadow: 0 4px 16px rgba(201,144,110,0.4);
          transition: all 0.25s ease;
        }
        .modal-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,144,110,0.5); }

        /* MID SECTION */
        .mid-section {
          display: flex; align-items: center; justify-content: space-between;
          padding: 36px 0; border-bottom: 1px solid #e8e0d0;
        }
        .mid-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 700; color: #16140f; line-height: 1.2;
        }
        .download-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 13px 28px; border-radius: 100px;
          background: linear-gradient(135deg, #c9906e, #b07050);
          border: none; cursor: pointer;
          font-family: 'Jost', sans-serif; font-size: 14px; font-weight: 500;
          color: #fff; text-decoration: none; white-space: nowrap;
          box-shadow: 0 4px 16px rgba(201,144,110,0.35);
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .download-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(201,144,110,0.5); }

        /* FOOTER GRID */
        .footer-grid {
          display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 48px; padding: 52px 0 40px;
        }
        .footer-col-title {
          font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase; color: #9a7c3f;
          margin-bottom: 20px;
        }
        .footer-link {
          display: block; font-family: 'Jost', sans-serif; font-size: 14px;
          color: #6b5e4e; text-decoration: none; margin-bottom: 12px;
          transition: color 0.2s ease;
        }
        .footer-link:hover { color: #16140f; }
        .footer-desc {
          font-family: 'Jost', sans-serif; font-size: 14px; color: #8a7060;
          line-height: 1.8; margin-bottom: 24px;
        }

        /* SOCIAL ICONS */
        .social-row { display: flex; gap: 12px; }
        .social-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1.5px solid #e8e0d0; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s ease; text-decoration: none;
          color: #6b5e4e; font-size: 14px;
        }
        .social-btn:hover { border-color: #c9906e; color: #c9906e; transform: translateY(-2px); }

        /* LOGO TEXT */
        .logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 700; color: #16140f;
          letter-spacing: -1px; margin-bottom: 16px;
          display: flex; align-items: center; gap: 2px;
        }
        .logo-dot { color: #c9906e; }

        /* COPYRIGHT */
        .copyright-bar {
          background: linear-gradient(135deg, #c9906e, #b07050);
          padding: 16px 40px; text-align: center; margin: 0 -40px;
          font-family: 'Jost', sans-serif; font-size: 13px; color: rgba(255,255,255,0.85);
        }
      `}</style>

      {/* HERO BANNER */}
      <div className="footer-hero">
        <img src="/hero-aerial.png" alt="Luxury properties" className="footer-hero-img" />
        <div className="footer-hero-overlay" />
        <div className="footer-hero-content">
          <h2 className="footer-hero-title">
            A New Era For The City,
            <strong>A New Chapter In Your Life.</strong>
          </h2>
          <button className="request-call-btn" onClick={() => setShowCallForm(true)}>
            <span className="request-call-text">Request<br />A Call</span>
          </button>
        </div>
      </div>

      {/* CALL REQUEST MODAL */}
      {showCallForm && (
        <div className="call-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowCallForm(false); }}>
          <div className="call-modal">
            <button className="modal-close" onClick={() => setShowCallForm(false)}>✕</button>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#c9906e,#b07050)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>✓</div>
                <p style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 700, color: '#16140f', marginBottom: 8 }}>Call Requested!</p>
                <p style={{ fontFamily: 'Jost,sans-serif', fontSize: 14, color: '#8a7060' }}>Our agent will call you within 24 hours.</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ width: 36, height: 3, background: 'linear-gradient(90deg,#c9906e,#b07050)', borderRadius: 2, marginBottom: 16 }} />
                  <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 26, fontWeight: 700, color: '#16140f', marginBottom: 6 }}>Request a Call</h3>
                  <p style={{ fontFamily: 'Jost,sans-serif', fontSize: 14, color: '#8a7060' }}>Our agent will reach out within 24 hours</p>
                </div>
                <form onSubmit={handleCallRequest} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontFamily: 'Jost,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9a7c3f', display: 'block', marginBottom: 6 }}>Your Name</label>
                    <input className="modal-input" placeholder="Enter your full name" value={callForm.name} onChange={e => setCallForm(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Jost,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9a7c3f', display: 'block', marginBottom: 6 }}>Phone Number</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', background: '#f5f4f0', border: '1.5px solid #e8e0d0', borderRadius: 10, fontFamily: 'Jost,sans-serif', fontSize: 14, fontWeight: 600, color: '#c9906e', whiteSpace: 'nowrap' }}>+91</div>
                      <input className="modal-input" placeholder="Enter phone number" type="tel" value={callForm.phone} onChange={e => setCallForm(p => ({ ...p, phone: e.target.value }))} required />
                    </div>
                  </div>
                  <button type="submit" className="modal-submit" style={{ marginTop: 8 }}>
                    Request Callback →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* MID SECTION */}
      <div className="mid-section">
        <h3 className="mid-title">
          Find A New Home<br />On The Go
        </h3>
        <a href="#" className="download-btn">
          Download Free Brochure
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1v10M3 9l5 5 5-5M1 14h14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      {/* FOOTER LINKS GRID */}
      <div className="footer-grid">
        {/* Brand */}
        <div>
          <div className="logo-text">
            Red<span className="logo-dot">.</span>
          </div>
          <p className="footer-desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dictum aliquet accumsan porta lectus ridiculus in mattis.
          </p>
          <div className="social-row">
            {[
              { icon: '𝕏', label: 'Twitter' },
              { icon: 'f', label: 'Facebook' },
              { icon: '◎', label: 'Instagram' },
              { icon: '⌥', label: 'Github' },
            ].map(s => (
              <a key={s.label} href="#" className="social-btn" aria-label={s.label}>{s.icon}</a>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <p className="footer-col-title">Company</p>
          {['Services', 'About', 'Property Valuation', 'Career'].map(l => (
            <Link key={l} href="#" className="footer-link">{l}</Link>
          ))}
        </div>

        {/* Help */}
        <div>
          <p className="footer-col-title">Help</p>
          {['Customer Support', 'Delivery Details', 'Terms & Conditions', 'Privacy Policy'].map(l => (
            <Link key={l} href="#" className="footer-link">{l}</Link>
          ))}
        </div>

        {/* Resources */}
        <div>
          <p className="footer-col-title">Resources</p>
          {['Meet our Founders', 'Articles', 'Testimonials', 'Contact Us'].map(l => (
            <Link key={l} href="#" className="footer-link">{l}</Link>
          ))}
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="copyright-bar">
        Copyright ©Red. All Rights Reserved {new Date().getFullYear()}
      </div>
    </div>
  );
}

export default FooterSection;