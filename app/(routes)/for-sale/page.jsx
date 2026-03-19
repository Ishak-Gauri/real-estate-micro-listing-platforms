'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const cities = [
  { name: 'Noida',       image: '/city-images/Rectangle 12148-1.png' },
  { name: 'Ghaziabad',   image: '/city-images/Rectangle 12149.png' },
  { name: 'Delhi NCR',   image: '/city-images/Rectangle 12150.png' },
  { name: 'Lucknow',     image: '/city-images/Rectangle 12151.png' },
  { name: 'Indirapuram', image: '/city-images/Rectangle 12152.png' },
  { name: 'Varanasi',    image: '/city-images/Rectangle 12153.png' },
  { name: 'Prayagraj',   image: '/city-images/Rectangle 12154.png' },
  { name: 'Uttarakhand', image: '/city-images/Rectangle 12155.png' },
  { name: 'Punjab',      image: '/city-images/Rectangle 12156.png' },
];

const fallbackGradients = [
  'linear-gradient(160deg,#0f2027,#203a43,#2c5364)',
  'linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)',
  'linear-gradient(160deg,#1b1b2f,#2b2d42,#3d405b)',
  'linear-gradient(160deg,#0d1b2a,#1b2838,#1f3a5f)',
  'linear-gradient(160deg,#141414,#2d2d2d,#1a1a2e)',
  'linear-gradient(160deg,#0f0c29,#302b63,#24243e)',
];

const ITEMS_PER_PAGE = 6;

// ── CTA BANNER ──
function CTABanner() {
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) return;
    setSubmitting(true);
    setError('');
    try {
      await supabase.from('Enquiry').insert([{
        name: form.name, phone: form.phone, email: form.email,
        message: 'Home buying journey enquiry',
      }]);
      const res = await fetch('/api/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email, message: 'Home buying journey enquiry' }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSubmitted(true);
      setForm({ name: '', phone: '', email: '' });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ borderRadius: '24px', overflow: 'hidden', marginTop: '72px', display: 'grid', gridTemplateColumns: '420px 1fr', minHeight: '200px', position: 'relative', background: 'linear-gradient(135deg, #1a0f05 0%, #2d1a08 40%, #1a0f05 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
      <style>{`
        .cta-glow { position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 60% 80% at 15% 50%, rgba(201,144,110,0.18) 0%, transparent 70%); }
        .cta-grid { position:absolute;inset:0;pointer-events:none;overflow:hidden;opacity:0.06;background-image:linear-gradient(rgba(201,144,110,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(201,144,110,0.8) 1px,transparent 1px);background-size:40px 40px; }
        @keyframes floatDot { 0%,100%{transform:translateY(0);opacity:0.6} 50%{transform:translateY(-8px);opacity:1} }
        .cta-field-outer { display:flex;flex-direction:column;gap:6px;flex:1; }
        .cta-field-label { font-family:'Jost',sans-serif;font-size:12px;font-weight:600;color:rgba(255,255,255,0.75);letter-spacing:0.5px;transition:color 0.2s ease; }
        .cta-field-label.focused { color:#e8a87c; }
        .cta-field-box { display:flex;align-items:center;background:rgba(255,255,255,0.07);border:1.5px solid rgba(255,255,255,0.1);border-radius:12px;height:50px;padding:0 16px;gap:10px;transition:all 0.25s ease;backdrop-filter:blur(8px); }
        .cta-field-box.focused { border-color:#e8a87c;background:rgba(232,168,124,0.08);box-shadow:0 0 0 3px rgba(232,168,124,0.12); }
        .cta-prefix { font-family:'Jost',sans-serif;font-size:13px;font-weight:600;color:#e8a87c;border-right:1.5px solid rgba(255,255,255,0.15);padding-right:10px;white-space:nowrap;flex-shrink:0; }
        .cta-inp { border:none;background:transparent;font-family:'Jost',sans-serif;font-size:14px;color:#fff;outline:none;width:100%; }
        .cta-inp::placeholder { color:rgba(255,255,255,0.3); }
        .cta-submit { width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#e8a87c,#c9704e);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;align-self:flex-end;box-shadow:0 6px 20px rgba(201,112,78,0.5);transition:all 0.3s cubic-bezier(0.16,1,0.3,1);position:relative;overflow:hidden; }
        .cta-submit:hover { transform:scale(1.08) translateY(-2px);box-shadow:0 10px 28px rgba(201,112,78,0.6); }
        .cta-submit:disabled { opacity:0.5;cursor:not-allowed;transform:none; }
        .spinning { animation:spin 1s linear infinite; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
      <div className="cta-glow" />
      <div className="cta-grid" />
      {[{top:'20%',left:'8%',size:6,delay:'0s'},{top:'65%',left:'25%',size:4,delay:'0.8s'},{top:'35%',left:'40%',size:3,delay:'1.4s'}].map((d,i) => (
        <div key={i} style={{ position:'absolute',top:d.top,left:d.left,width:d.size,height:d.size,borderRadius:'50%',background:'#e8a87c',opacity:0.5,animation:`floatDot 3s ease-in-out ${d.delay} infinite`,pointerEvents:'none' }} />
      ))}
      <div style={{ position:'relative',zIndex:2,padding:'44px 40px',display:'flex',flexDirection:'column',justifyContent:'center',borderRight:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width:'36px',height:'3px',background:'linear-gradient(90deg,#e8a87c,#c9704e)',borderRadius:'2px',marginBottom:'20px' }} />
        <h2 style={{ fontFamily:'Playfair Display,serif',fontSize:'32px',fontWeight:700,color:'#fff',lineHeight:1.25,margin:0 }}>
          Start your home<br />buying journey{' '}
          <em style={{ fontStyle:'italic',fontWeight:700,background:'linear-gradient(135deg,#e8a87c,#c9704e)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text' }}>Now!</em>
        </h2>
        <p style={{ fontFamily:'Jost,sans-serif',fontSize:'13px',color:'rgba(255,255,255,0.45)',marginTop:'14px',lineHeight:1.6 }}>Our agents will reach out within 24 hours</p>
      </div>
      <div style={{ position:'relative',zIndex:2,padding:'40px 44px',display:'flex',alignItems:'center' }}>
        {submitted ? (
          <div style={{ textAlign:'center',width:'100%' }}>
            <div style={{ width:64,height:64,borderRadius:'50%',background:'linear-gradient(135deg,#e8a87c,#c9704e)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:28,boxShadow:'0 8px 24px rgba(201,112,78,0.4)' }}>✓</div>
            <p style={{ fontFamily:'Playfair Display,serif',fontSize:22,fontWeight:600,color:'#fff',marginBottom:8 }}>Details <em style={{ fontStyle:'italic',color:'#e8a87c' }}>Received!</em></p>
            <p style={{ fontFamily:'Jost,sans-serif',fontSize:13,color:'rgba(255,255,255,0.45)' }}>We've sent a confirmation to gauriishak17@gmail.com</p>
            <button onClick={() => setSubmitted(false)} style={{ marginTop:16,fontFamily:'Jost,sans-serif',fontSize:12,color:'#e8a87c',background:'none',border:'none',cursor:'pointer',textDecoration:'underline' }}>Submit another →</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:'flex',alignItems:'flex-end',gap:16,width:'100%' }}>
            <div className="cta-field-outer">
              <label className={`cta-field-label ${focused==='name'?'focused':''}`}>Full Name</label>
              <div className={`cta-field-box ${focused==='name'?'focused':''}`}>
                <input className="cta-inp" placeholder="Enter Full Name" value={form.name} onFocus={()=>setFocused('name')} onBlur={()=>setFocused('')} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required />
              </div>
            </div>
            <div className="cta-field-outer">
              <label className={`cta-field-label ${focused==='phone'?'focused':''}`}>Phone Number</label>
              <div className={`cta-field-box ${focused==='phone'?'focused':''}`}>
                <span className="cta-prefix">+91</span>
                <input className="cta-inp" placeholder="Enter Phone Number" type="tel" value={form.phone} onFocus={()=>setFocused('phone')} onBlur={()=>setFocused('')} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} required />
              </div>
            </div>
            <div className="cta-field-outer">
              <label className={`cta-field-label ${focused==='email'?'focused':''}`}>Email</label>
              <div className={`cta-field-box ${focused==='email'?'focused':''}`}>
                <input className="cta-inp" placeholder="Enter Email ID" type="email" value={form.email} onFocus={()=>setFocused('email')} onBlur={()=>setFocused('')} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required />
              </div>
            </div>
            <button type="submit" className="cta-submit" disabled={submitting}>
              {submitting ? (
                <svg className="spinning" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 9h16M9.5 1.5L17 9l-7.5 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </button>
          </form>
        )}
        {error && <p style={{ position:'absolute',bottom:14,left:44,fontFamily:'Jost,sans-serif',fontSize:12,color:'#ff6b6b' }}>⚠ {error}</p>}
      </div>
    </div>
  );
}

// ── FOOTER SECTION ──
function FooterSection() {
  const [showCallForm, setShowCallForm] = useState(false);
  const [callForm, setCallForm] = useState({ name: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleCallRequest = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowCallForm(false); setCallForm({ name: '', phone: '' }); }, 3000);
  };

  return (
    <div style={{ fontFamily:"'Jost',sans-serif", marginTop: 0 }}>
      <style>{`
        .footer-hero { position:relative;width:100%;height:380px;overflow:hidden;border-radius:20px;margin-top:72px; }
        .footer-hero img { width:100%;height:100%;object-fit:cover;object-position:center 30%;display:block; }
        .fh-overlay { position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.35) 0%,rgba(0,0,0,0.55) 100%); }
        .fh-content { position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px; }
        .fh-title { font-family:'Playfair Display',serif;font-size:clamp(20px,3vw,38px);font-weight:700;color:rgba(255,255,255,0.85);text-align:center;line-height:1.3;letter-spacing:2px;text-transform:uppercase; }
        .fh-title strong { color:#fff;display:block;font-size:clamp(24px,4vw,44px); }
        .rcb { width:140px;height:140px;border-radius:50%;background:linear-gradient(135deg,#c9906e,#b07050);border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;position:relative;box-shadow:0 8px 32px rgba(201,144,110,0.5);transition:all 0.4s cubic-bezier(0.16,1,0.3,1); }
        .rcb::before { content:'';position:absolute;inset:-6px;border-radius:50%;border:1.5px solid rgba(255,255,255,0.25);animation:rp 2.5s ease-in-out infinite; }
        .rcb::after { content:'';position:absolute;inset:-14px;border-radius:50%;border:1px solid rgba(255,255,255,0.1);animation:rp 2.5s ease-in-out 0.5s infinite; }
        .rcb:hover { transform:scale(1.08);box-shadow:0 16px 48px rgba(201,144,110,0.65); }
        @keyframes rp { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.08);opacity:0.2} }
        .rcb-txt { font-family:'Jost',sans-serif;font-size:13px;font-weight:600;color:#fff;letter-spacing:1.5px;text-transform:uppercase;text-align:center;line-height:1.4;position:relative;z-index:1; }
        .cm-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease; }
        .cm-box { background:#fff;border-radius:20px;padding:40px;width:420px;max-width:90vw;position:relative;box-shadow:0 24px 80px rgba(0,0,0,0.2);animation:slideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .cm-close { position:absolute;top:16px;right:16px;width:32px;height:32px;border-radius:50%;background:#f5f4f0;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;color:#666;transition:all 0.2s ease; }
        .cm-close:hover { background:#e8e0d0;color:#333; }
        .cm-inp { width:100%;padding:13px 16px;border:1.5px solid #e8e0d0;border-radius:10px;font-family:'Jost',sans-serif;font-size:14px;color:#333;outline:none;transition:border-color 0.2s ease;background:#fefcf8; }
        .cm-inp:focus { border-color:#c9906e;box-shadow:0 0 0 3px rgba(201,144,110,0.1); }
        .cm-inp::placeholder { color:#bbb; }
        .cm-submit { width:100%;padding:14px;background:linear-gradient(135deg,#c9906e,#b07050);border:none;border-radius:10px;cursor:pointer;font-family:'Jost',sans-serif;font-size:14px;font-weight:600;color:#fff;box-shadow:0 4px 16px rgba(201,144,110,0.4);transition:all 0.25s ease; }
        .cm-submit:hover { transform:translateY(-2px);box-shadow:0 8px 24px rgba(201,144,110,0.5); }
        .mid-sec { display:flex;align-items:center;justify-content:space-between;padding:36px 0;border-bottom:1px solid #e8e0d0;margin-top:48px; }
        .mid-ttl { font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:#16140f;line-height:1.2; }
        .dl-btn { display:inline-flex;align-items:center;gap:10px;padding:13px 28px;border-radius:100px;background:linear-gradient(135deg,#c9906e,#b07050);border:none;cursor:pointer;font-family:'Jost',sans-serif;font-size:14px;font-weight:500;color:#fff;text-decoration:none;box-shadow:0 4px 16px rgba(201,144,110,0.35);transition:all 0.3s ease; }
        .dl-btn:hover { transform:translateY(-3px);box-shadow:0 10px 28px rgba(201,144,110,0.5); }
        .fg { display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:48px;padding:52px 0 40px; }
        .fc-ttl { font-family:'Jost',sans-serif;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#9a7c3f;margin-bottom:20px; }
        .fl { display:block;font-family:'Jost',sans-serif;font-size:14px;color:#6b5e4e;text-decoration:none;margin-bottom:12px;transition:color 0.2s ease; }
        .fl:hover { color:#16140f; }
        .fd { font-family:'Jost',sans-serif;font-size:14px;color:#8a7060;line-height:1.8;margin-bottom:24px; }
        .sr { display:flex;gap:12px; }
        .sb { width:36px;height:36px;border-radius:50%;border:1.5px solid #e8e0d0;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s ease;text-decoration:none;color:#6b5e4e;font-size:14px; }
        .sb:hover { border-color:#c9906e;color:#c9906e;transform:translateY(-2px); }
        .logo-t { font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:#16140f;letter-spacing:-1px;margin-bottom:16px;display:flex;align-items:center;gap:2px; }
        .logo-d { color:#c9906e; }
        .cpbar { background:linear-gradient(135deg,#c9906e,#b07050);padding:16px 40px;text-align:center;margin:0 -40px;font-family:'Jost',sans-serif;font-size:13px;color:rgba(255,255,255,0.85); }
      `}</style>

      <div className="footer-hero">
        <img src="/hero-aerial.png" alt="Luxury properties" />
        <div className="fh-overlay" />
        <div className="fh-content">
          <h2 className="fh-title">
            A New Era For The City,
            <strong>A New Chapter In Your Life.</strong>
          </h2>
          <button className="rcb" onClick={() => setShowCallForm(true)}>
            <span className="rcb-txt">Request<br />A Call</span>
          </button>
        </div>
      </div>

      {showCallForm && (
        <div className="cm-overlay" onClick={e => { if (e.target === e.currentTarget) setShowCallForm(false); }}>
          <div className="cm-box">
            <button className="cm-close" onClick={() => setShowCallForm(false)}>✕</button>
            {submitted ? (
              <div style={{ textAlign:'center',padding:'20px 0' }}>
                <div style={{ width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg,#c9906e,#b07050)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:24,color:'#fff' }}>✓</div>
                <p style={{ fontFamily:'Playfair Display,serif',fontSize:22,fontWeight:700,color:'#16140f',marginBottom:8 }}>Call Requested!</p>
                <p style={{ fontFamily:'Jost,sans-serif',fontSize:14,color:'#8a7060' }}>Our agent will call you within 24 hours.</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom:24 }}>
                  <div style={{ width:36,height:3,background:'linear-gradient(90deg,#c9906e,#b07050)',borderRadius:2,marginBottom:16 }} />
                  <h3 style={{ fontFamily:'Playfair Display,serif',fontSize:26,fontWeight:700,color:'#16140f',marginBottom:6 }}>Request a Call</h3>
                  <p style={{ fontFamily:'Jost,sans-serif',fontSize:14,color:'#8a7060' }}>Our agent will reach out within 24 hours</p>
                </div>
                <form onSubmit={handleCallRequest} style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div>
                    <label style={{ fontFamily:'Jost,sans-serif',fontSize:11,fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',color:'#9a7c3f',display:'block',marginBottom:6 }}>Your Name</label>
                    <input className="cm-inp" placeholder="Enter your full name" value={callForm.name} onChange={e=>setCallForm(p=>({...p,name:e.target.value}))} required />
                  </div>
                  <div>
                    <label style={{ fontFamily:'Jost,sans-serif',fontSize:11,fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',color:'#9a7c3f',display:'block',marginBottom:6 }}>Phone Number</label>
                    <div style={{ display:'flex',gap:8 }}>
                      <div style={{ display:'flex',alignItems:'center',padding:'0 12px',background:'#f5f4f0',border:'1.5px solid #e8e0d0',borderRadius:10,fontFamily:'Jost,sans-serif',fontSize:14,fontWeight:600,color:'#c9906e' }}>+91</div>
                      <input className="cm-inp" placeholder="Enter phone number" type="tel" value={callForm.phone} onChange={e=>setCallForm(p=>({...p,phone:e.target.value}))} required />
                    </div>
                  </div>
                  <button type="submit" className="cm-submit" style={{ marginTop:8 }}>Request Callback →</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <div className="mid-sec">
        <h3 className="mid-ttl">Find A New Home<br />On The Go</h3>
        <a href="#" className="dl-btn">
          Download Free Brochure
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v10M3 9l5 5 5-5M1 14h14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
      </div>

      <div className="fg">
        <div>
          <div className="logo-t">Red<span className="logo-d">.</span></div>
          <p className="fd">Your trusted partner in finding the perfect home. We connect buyers, sellers and renters across India's top cities.</p>
          <div className="sr">
            {[{icon:'𝕏',label:'Twitter'},{icon:'f',label:'Facebook'},{icon:'◎',label:'Instagram'},{icon:'⌥',label:'Github'}].map(s => (
              <a key={s.label} href="#" className="sb" aria-label={s.label}>{s.icon}</a>
            ))}
          </div>
        </div>
        <div>
          <p className="fc-ttl">Company</p>
          {['Services','About','Property Valuation','Career'].map(l => <a key={l} href="#" className="fl">{l}</a>)}
        </div>
        <div>
          <p className="fc-ttl">Help</p>
          {['Customer Support','Delivery Details','Terms & Conditions','Privacy Policy'].map(l => <a key={l} href="#" className="fl">{l}</a>)}
        </div>
        <div>
          <p className="fc-ttl">Resources</p>
          {['Meet our Founders','Articles','Testimonials','Contact Us'].map(l => <a key={l} href="#" className="fl">{l}</a>)}
        </div>
      </div>

      <div className="cpbar">Copyright ©Red. All Rights Reserved {new Date().getFullYear()}</div>
    </div>
  );
}

// ── MAIN PAGE ──
function ForSale() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityListings, setCityListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allLoading, setAllLoading] = useState(true);
  const [filter, setFilter] = useState(typeParam || 'All');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [page, setPage] = useState(1);
  const supabase = createClient();

  useEffect(() => { setFilter(typeParam || 'All'); }, [typeParam]);
  useEffect(() => { fetchAll(); setPage(1); if (selectedCity) fetchByCity(selectedCity); }, [filter]);

  const fetchAll = async () => {
    setAllLoading(true);
    let q = supabase.from('Listing').select('*').eq('active', true).limit(50);
    if (filter !== 'All') q = q.eq('listingType', filter);
    const { data } = await q;
    setAllListings(data || []);
    setAllLoading(false);
  };

  const fetchByCity = async (city) => {
    setSelectedCity(city);
    setLoading(true);
    let q = supabase.from('Listing').select('*').eq('city', city).eq('active', true);
    if (filter !== 'All') q = q.eq('listingType', filter);
    const { data } = await q;
    setCityListings(data || []);
    setLoading(false);
    setTimeout(() => document.getElementById('city-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const totalPages = Math.ceil(allListings.length / ITEMS_PER_PAGE);
  const paginatedListings = allListings.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div style={{ background: '#f5f4f0', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box;margin:0;padding:0; }
        :root { --cream:#f5f4f0;--ink:#16140f;--gold:#9a7c3f;--gold-light:#c9a84c;--warm-white:#fefcf8;--muted:#8a8070;--border:rgba(154,124,63,0.18);--card-shadow:0 1px 3px rgba(22,20,15,0.06),0 8px 24px rgba(22,20,15,0.08);--card-shadow-hover:0 2px 6px rgba(22,20,15,0.08),0 20px 48px rgba(22,20,15,0.14); }
        .city-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:18px; }
        .city-card { position:relative;border-radius:14px;overflow:hidden;height:128px;cursor:pointer;transition:transform 0.4s cubic-bezier(0.16,1,0.3,1),box-shadow 0.4s ease;box-shadow:0 2px 12px rgba(22,20,15,0.12); }
        .city-card:hover { transform:translateY(-4px);box-shadow:0 12px 36px rgba(22,20,15,0.2); }
        .city-card.active { outline:2.5px solid var(--gold);outline-offset:2px;transform:translateY(-4px); }
        .city-card img { width:100%;height:100%;object-fit:cover;transition:transform 0.6s ease;display:block; }
        .city-card:hover img { transform:scale(1.06); }
        .city-overlay { position:absolute;inset:0;background:linear-gradient(105deg,rgba(22,14,4,0.78) 0%,rgba(22,14,4,0.3) 60%,transparent 100%);display:flex;align-items:center;padding:0 24px; }
        .city-label { font-family:'Playfair Display',serif;font-size:21px;font-weight:500;color:#fff;text-shadow:0 1px 12px rgba(0,0,0,0.6); }
        .prop-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:24px; }
        @media(max-width:1000px){ .prop-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:640px){ .prop-grid { grid-template-columns:1fr; } }
        .prop-card { background:var(--warm-white);border-radius:14px;overflow:hidden;border:1px solid rgba(22,20,15,0.07);box-shadow:var(--card-shadow);transition:transform 0.4s cubic-bezier(0.16,1,0.3,1),box-shadow 0.4s ease;display:flex;flex-direction:column; }
        .prop-card:hover { transform:translateY(-6px);box-shadow:var(--card-shadow-hover); }
        .card-img-wrap { position:relative;height:200px;overflow:hidden;flex-shrink:0;background:#1a1a2e; }
        .card-img-wrap img { width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.5s ease; }
        .prop-card:hover .card-img-wrap img { transform:scale(1.05); }
        .card-placeholder { width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px; }
        .card-badges { position:absolute;top:12px;left:12px;display:flex;gap:6px; }
        .badge { padding:4px 10px;border-radius:6px;font-family:'Jost',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;backdrop-filter:blur(10px); }
        .badge-sell { background:rgba(16,185,129,0.2);border:1px solid rgba(16,185,129,0.4);color:#d4fae8; }
        .badge-rent { background:rgba(99,102,241,0.2);border:1px solid rgba(99,102,241,0.4);color:#e0e7ff; }
        .badge-type { background:rgba(22,20,15,0.45);border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.9); }
        .card-save { position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.9);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;color:#666;transition:all 0.2s ease;box-shadow:0 2px 8px rgba(0,0,0,0.12); }
        .card-save:hover { color:#e53e3e;transform:scale(1.1); }
        .card-body { padding:18px 20px;display:flex;flex-direction:column;flex:1; }
        .card-loc { display:flex;align-items:center;gap:5px;margin-bottom:5px; }
        .card-loc-dot { width:5px;height:5px;border-radius:50%;background:var(--gold);flex-shrink:0; }
        .card-loc-text { font-family:'Jost',sans-serif;font-size:11px;font-weight:500;color:var(--muted); }
        .card-title { font-family:'Jost',sans-serif;font-size:14px;font-weight:500;color:var(--ink);line-height:1.4;margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
        .card-subtitle { font-family:'Jost',sans-serif;font-size:12px;color:var(--muted);margin-bottom:14px; }
        .card-divider { height:1px;background:linear-gradient(90deg,var(--gold-light),transparent);opacity:0.3;margin-bottom:14px; }
        .card-action-row { display:flex;align-items:center;gap:8px;margin-top:auto; }
        .card-action { display:flex;align-items:center;border-radius:100px;overflow:hidden;border:1px solid #e5e5e5;flex:1;text-decoration:none; }
        .card-action-label { padding:9px 14px;background:#16140f;color:#fff;font-family:'Jost',sans-serif;font-weight:500;font-size:12px;white-space:nowrap;flex-shrink:0; }
        .card-action-price { padding:9px 12px;background:#c9906e;color:#fff;font-family:'Jost',sans-serif;font-weight:600;font-size:12px;white-space:nowrap; }
        .card-arrow { width:32px;height:32px;border-radius:50%;background:#16140f;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;text-decoration:none;transition:background 0.2s ease; }
        .card-arrow:hover { background:var(--gold); }
        .filters-btn { display:inline-flex;align-items:center;gap:10px;padding:10px 22px;border-radius:100px;background:#fff;border:1.5px solid #e5e5e5;font-family:'Jost',sans-serif;font-size:14px;font-weight:500;color:#1a1a1a;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.06);transition:all 0.2s ease; }
        .filters-btn:hover { border-color:var(--gold); }
        .filters-btn.open { border-color:var(--gold);background:rgba(154,124,63,0.04); }
        .filter-panel { background:#fff;border-radius:14px;border:1px solid rgba(0,0,0,0.08);box-shadow:0 8px 40px rgba(0,0,0,0.1);padding:24px;margin-bottom:28px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px; }
        .filter-group label { font-family:'Jost',sans-serif;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:10px; }
        .filter-chips { display:flex;flex-wrap:wrap;gap:8px; }
        .chip { padding:6px 14px;border-radius:100px;font-family:'Jost',sans-serif;font-size:12px;font-weight:500;cursor:pointer;border:1px solid #e5e5e5;background:#f9f9f9;color:#555;transition:all 0.2s ease; }
        .chip:hover { border-color:var(--gold);color:var(--gold); }
        .chip.active { background:var(--ink);color:#fff;border-color:var(--ink); }
        .eyebrow { font-family:'Jost',sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);margin-bottom:6px; }
        .section-heading { font-family:'Playfair Display',serif;font-size:clamp(26px,3vw,40px);font-weight:400;color:var(--ink);line-height:1.15; }
        .section-heading em { font-style:italic;color:var(--gold); }
        .rule { width:36px;height:2px;background:var(--gold-light);margin-top:10px;opacity:0.6; }
        .pagination { display:flex;align-items:center;justify-content:center;gap:6px;margin-top:48px; }
        .page-btn { width:38px;height:38px;border-radius:50%;border:1px solid #e5e5e5;background:#fff;font-family:'Jost',sans-serif;font-size:13px;font-weight:500;color:#555;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease; }
        .page-btn:hover { border-color:var(--gold);color:var(--gold); }
        .page-btn.active { background:var(--ink);color:#fff;border-color:var(--ink); }
        .page-btn:disabled { opacity:0.3;cursor:not-allowed; }
        .shimmer { background:linear-gradient(90deg,#ebe9e2 25%,#dedad2 50%,#ebe9e2 75%);background-size:200% 100%;animation:sh 1.5s infinite;border-radius:14px; }
        @keyframes sh { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .fade-up { animation:fu 0.45s ease both; }
        @keyframes fu { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .count-tag { display:inline-flex;align-items:center;padding:4px 12px;border-radius:100px;background:rgba(154,124,63,0.1);border:1px solid var(--border);font-family:'Jost',sans-serif;font-size:12px;font-weight:500;color:var(--gold); }
        .clear-btn { background:none;border:none;cursor:pointer;font-family:'Jost',sans-serif;font-size:12px;color:var(--muted);padding:4px 8px;border-radius:4px;transition:color 0.2s; }
        .clear-btn:hover { color:var(--ink); }
        .empty-state { text-align:center;padding:64px 20px; }
        .empty-state p { font-family:'Playfair Display',serif;font-size:17px;color:var(--muted);margin-top:10px;font-style:italic; }
      `}</style>

      <div style={{ background:'#fff',borderBottom:'1px solid rgba(22,20,15,0.08)',padding:'60px 40px 48px',textAlign:'center' }}>
        <p className="eyebrow">Discover Properties</p>
        <h1 className="section-heading">
          {filter==='Sell' ? <>Homes <em>For Sale</em></> : filter==='Rent' ? <>Homes <em>For Rent</em></> : <>Find Your <em>Dream Home</em></>}
        </h1>
        <div className="rule" style={{ margin:'12px auto 0' }} />
      </div>

      <div style={{ maxWidth:'1280px',margin:'0 auto',padding:'48px 40px 80px' }}>

        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'16px' }}>
          <div>
            <p className="eyebrow">Our Regions</p>
            <h2 className="section-heading" style={{ fontSize:'28px' }}>Browse by <em>City</em></h2>
          </div>
          {selectedCity && <button className="clear-btn" onClick={() => setSelectedCity(null)}>Clear ✕</button>}
        </div>
        <div className="city-grid" style={{ marginBottom:'64px' }}>
          {cities.map(city => (
            <div key={city.name} className={`city-card ${selectedCity===city.name?'active':''}`} onClick={() => fetchByCity(city.name)}>
              <img src={city.image} alt={city.name} />
              <div className="city-overlay"><span className="city-label">{city.name}</span></div>
            </div>
          ))}
        </div>

        {selectedCity && (
          <div id="city-results" style={{ marginBottom:'64px' }} className="fade-up">
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'24px',paddingBottom:'16px',borderBottom:'1px solid rgba(22,20,15,0.08)' }}>
              <div>
                <p className="eyebrow">📍 {selectedCity}</p>
                <h2 className="section-heading" style={{ fontSize:'26px' }}>Properties in <em>{selectedCity}</em></h2>
              </div>
              <div style={{ display:'flex',gap:'10px',alignItems:'center' }}>
                {!loading && <span className="count-tag">{cityListings.length} {cityListings.length===1?'property':'properties'}</span>}
                <button className="clear-btn" onClick={() => setSelectedCity(null)}>Clear ✕</button>
              </div>
            </div>
            {loading ? (
              <div className="prop-grid">{[1,2,3].map(i => <div key={i} className="shimmer" style={{ height:'340px' }} />)}</div>
            ) : cityListings.length === 0 ? (
              <div className="empty-state"><span style={{ fontSize:'40px' }}>🏚</span><p>No properties found in {selectedCity}</p></div>
            ) : (
              <div className="prop-grid">{cityListings.map((l,i) => <PropertyCard key={l.id} listing={l} index={i} />)}</div>
            )}
          </div>
        )}

        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px' }}>
          <div>
            <p className="eyebrow">Featured Properties</p>
            <h2 className="section-heading" style={{ fontSize:'32px' }}>Curated <em>Especially</em> For You</h2>
          </div>
          <button className={`filters-btn ${showFilterPanel?'open':''}`} onClick={() => setShowFilterPanel(p => !p)}>
            Filters
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="6" cy="7" r="2" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="14" cy="13" r="2" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="2" y1="7" x2="4" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="8" y1="7" x2="18" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="2" y1="13" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="16" y1="13" x2="18" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {showFilterPanel && (
          <div className="filter-panel fade-up">
            <div className="filter-group">
              <label>Listing Type</label>
              <div className="filter-chips">
                {[{k:'All',l:'All'},{k:'Sell',l:'For Sale'},{k:'Rent',l:'For Rent'}].map(f => (
                  <button key={f.k} className={`chip ${filter===f.k?'active':''}`} onClick={() => { setFilter(f.k); setPage(1); }}>{f.l}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Property Type</label>
              <div className="filter-chips">
                {['Flat','Apartment','Villa','House','Plot'].map(t => <button key={t} className="chip">{t}</button>)}
              </div>
            </div>
            <div className="filter-group">
              <label>Bedrooms</label>
              <div className="filter-chips">
                {['1','2','3','4','5+'].map(b => <button key={b} className="chip">{b} BHK</button>)}
              </div>
            </div>
          </div>
        )}

        {allLoading ? (
          <div className="prop-grid">{[1,2,3,4,5,6].map(i => <div key={i} className="shimmer" style={{ height:'340px' }} />)}</div>
        ) : allListings.length === 0 ? (
          <div className="empty-state"><span style={{ fontSize:'40px' }}>🏠</span><p>No listings available</p></div>
        ) : (
          <>
            <div className="prop-grid">
              {paginatedListings.map((l,i) => <PropertyCard key={l.id} listing={l} index={i} />)}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}>←</button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(n => (
                  <button key={n} className={`page-btn ${page===n?'active':''}`} onClick={() => setPage(n)}>{String(n).padStart(2,'0')}</button>
                ))}
                <button className="page-btn" onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>→</button>
              </div>
            )}
          </>
        )}

        <CTABanner />
        <FooterSection />

      </div>
    </div>
  );
}

function PropertyCard({ listing, index }) {
  const hasImage = listing.images?.length > 0;
  const bg = fallbackGradients[index % fallbackGradients.length];
  const formatPrice = (price) => {
    if (!price) return '—';
    if (price >= 10000000) return `₹${(price/10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price/100000).toFixed(0)} L`;
    return `₹${price.toLocaleString('en-IN')}`;
  };
  return (
    <div className="prop-card fade-up" style={{ animationDelay:`${index*0.05}s` }}>
      <div className="card-img-wrap">
        {hasImage ? <img src={listing.images[0]} alt={listing.address} /> : <div className="card-placeholder" style={{ background:bg }}>🏠</div>}
        <div className="card-badges">
          <span className={`badge ${listing.listingType==='Rent'?'badge-rent':'badge-sell'}`}>{listing.listingType==='Rent'?'For Rent':'For Sale'}</span>
          {listing.Property_type?.[0] && <span className="badge badge-type">{listing.Property_type[0]}</span>}
        </div>
        <button className="card-save">♡</button>
      </div>
      <div className="card-body">
        <div className="card-loc"><div className="card-loc-dot" /><span className="card-loc-text">{listing.city||'India'}</span></div>
        <p className="card-title">{listing.bedroom&&`${listing.bedroom} BHK `}{listing.Property_type?.[0]&&`${listing.Property_type[0]} `}{listing.listingType==='Rent'?'for Rent':'for Buy'} in {listing.address?.split(',')[0]}</p>
        <p className="card-subtitle">{listing.address?.split(',').slice(0,2).join(',')}</p>
        <div className="card-divider" />
        <div className="card-action-row">
          <Link href={`/listing-detail/${listing.id}`} className="card-action">
            <span className="card-action-label">View Property Details</span>
            <span className="card-action-price">{formatPrice(listing.price)}{listing.listingType==='Rent'&&<span style={{ fontWeight:400,opacity:0.8 }}>/mo</span>}</span>
          </Link>
          <Link href={`/listing-detail/${listing.id}`} className="card-arrow">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7.5 1.5L13 7l-5.5 5.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── THE ONLY CHANGE: wrap ForSale in Suspense ──
function ForSaleWrapper() {
  return (
    <Suspense fallback={<div style={{ minHeight:'100vh', background:'#f5f4f0' }} />}>
      <ForSale />
    </Suspense>
  );
}

export default ForSaleWrapper;