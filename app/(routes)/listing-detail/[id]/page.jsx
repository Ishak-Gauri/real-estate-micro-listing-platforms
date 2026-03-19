'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';

function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [enquiry, setEnquiry] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchListing = async () => {
      const { data, error } = await supabase.from('Listing').select('*').eq('id', id).single();
      if (!error) setListing(data);
      setLoading(false);
    };
    fetchListing();
  }, [id]);

  const handleEnquiry = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendError('');
    try {
      // Save to Supabase
      await supabase.from('Enquiry').insert([{
        listing_id: parseInt(id),
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        message: enquiry.message || `I'm interested in this property`,
      }]);

      // Send email via Resend
      const res = await fetch('/api/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          message: enquiry.message || `I'm interested in: ${listing?.address}`,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSent(true);
      setEnquiry({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setSendError('Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(212,175,55,0.2)', borderTopColor: '#d4af37', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontFamily: 'Jost,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Loading property...</p>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!listing) return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>Property not found</p>
    </div>
  );

  const images = listing.images?.length > 0 ? listing.images : null;
  const fallbackBg = 'linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)';

  const formatPrice = (price) => {
    if (!price) return '—';
    if (price >= 10000000) return `₹${(price/10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price/100000).toFixed(0)} L`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const stats = [
    listing.bedroom && { icon: <BedIcon />, value: listing.bedroom, label: 'BEDROOMS' },
    listing.bathroom && { icon: <BathIcon />, value: listing.bathroom, label: 'BATHROOMS' },
    listing.parking && { icon: <ParkingIcon />, value: listing.parking, label: 'PARKING' },
    listing.area && { icon: <AreaIcon />, value: `${listing.area} ft²`, label: 'AREA' },
  ].filter(Boolean);

  const details = [
    listing.listingType && { label: 'LISTING TYPE', value: listing.listingType },
    listing.Property_type?.[0] && { label: 'PROPERTY TYPE', value: listing.Property_type.join(', ') },
    listing.builtIn && { label: 'BUILT IN', value: listing.builtIn },
    listing.lotSize && { label: 'LOT SIZE', value: `${listing.lotSize} sq.ft` },
    listing.hoa && { label: 'HOA / MONTH', value: formatPrice(listing.hoa) },
    listing.city && { label: 'CITY', value: listing.city },
  ].filter(Boolean);

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold: #d4af37;
          --gold2: #c9906e;
          --ink: #0d0d0d;
          --card: #161616;
          --card2: #1a1a1a;
          --border: rgba(255,255,255,0.07);
          --muted: rgba(255,255,255,0.4);
        }

        /* NAV */
        .detail-nav {
          padding: 20px 48px;
          display: flex; align-items: center; gap: 20px;
          border-bottom: 1px solid var(--border);
          background: rgba(13,13,13,0.95);
          backdrop-filter: blur(12px);
          position: sticky; top: 0; z-index: 50;
        }
        .back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 18px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.12);
          background: transparent; color: rgba(255,255,255,0.7);
          font-family: 'Jost',sans-serif; font-size: 13px; font-weight: 500;
          text-decoration: none; transition: all 0.2s ease; cursor: pointer;
        }
        .back-btn:hover { border-color: var(--gold); color: var(--gold); }
        .nav-divider { width: 1px; height: 20px; background: var(--border); }
        .nav-breadcrumb { font-family: 'Jost',sans-serif; font-size: 13px; color: var(--muted); }

        /* LAYOUT */
        .detail-layout {
          max-width: 1320px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 400px;
          gap: 40px; padding: 40px 48px 80px;
          align-items: start;
        }

        /* IMAGE */
        .img-main {
          border-radius: 16px; overflow: hidden; height: 440px;
          margin-bottom: 14px; position: relative;
        }
        .img-main img { width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.5s ease; }
        .img-main:hover img { transform: scale(1.03); }
        .img-placeholder { width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:72px; }

        .img-thumbs { display:flex;gap:10px;overflow-x:auto;padding-bottom:4px; }
        .thumb {
          flex-shrink:0;width:96px;height:68px;border-radius:10px;overflow:hidden;cursor:pointer;
          border:2px solid transparent;transition:border-color 0.2s ease;
        }
        .thumb.active { border-color:var(--gold); }
        .thumb img { width:100%;height:100%;object-fit:cover;display:block; }

        /* PROPERTY INFO */
        .prop-badges { display:flex;align-items:center;gap:10px;margin-bottom:16px; }
        .badge-rent { padding:5px 14px;border-radius:20px;background:rgba(99,102,241,0.2);border:1px solid rgba(99,102,241,0.4);color:#a5b4fc;font-family:'Jost',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.3px; }
        .badge-sell { padding:5px 14px;border-radius:20px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#6ee7b7;font-family:'Jost',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.3px; }
        .badge-type { font-family:'Jost',sans-serif;font-size:13px;color:var(--muted); }

        .prop-title { font-family:'Playfair Display',serif;font-size:clamp(28px,3vw,40px);font-weight:500;color:#fff;line-height:1.2;margin-bottom:10px; }
        .prop-address { display:flex;align-items:center;gap:6px;font-family:'Jost',sans-serif;font-size:14px;color:var(--muted);margin-bottom:16px; }
        .addr-dot { width:6px;height:6px;border-radius:50%;background:var(--gold2);flex-shrink:0; }

        .gold-rule { width:44px;height:2px;background:linear-gradient(90deg,var(--gold),transparent);margin-bottom:20px; }

        .prop-price { font-family:'Playfair Display',serif;font-size:clamp(32px,4vw,48px);font-weight:700;color:var(--gold);line-height:1;margin-bottom:32px; }
        .price-suffix { font-family:'Jost',sans-serif;font-size:16px;font-weight:400;color:var(--muted);margin-left:6px; }

        /* STATS GRID */
        .stats-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:32px; }
        .stat-box {
          background:var(--card);border:1px solid var(--border);border-radius:12px;
          padding:20px 16px;text-align:center;
          transition:border-color 0.2s ease;
        }
        .stat-box:hover { border-color:rgba(212,175,55,0.3); }
        .stat-icon { display:flex;align-items:center;justify-content:center;margin-bottom:12px;height:36px; }
        .stat-val { font-family:'Playfair Display',serif;font-size:22px;font-weight:600;color:#fff;margin-bottom:4px; }
        .stat-lbl { font-family:'Jost',sans-serif;font-size:10px;font-weight:600;letter-spacing:2px;color:var(--muted); }

        /* DESCRIPTION */
        .section-title { font-family:'Playfair Display',serif;font-size:22px;font-weight:500;color:#fff;margin-bottom:14px; }
        .prop-desc { font-family:'Jost',sans-serif;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.8; }

        /* DETAILS TABLE */
        .details-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:32px; }
        .detail-box { background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 16px; }
        .detail-lbl { font-family:'Jost',sans-serif;font-size:10px;font-weight:600;letter-spacing:2px;color:var(--muted);margin-bottom:5px; }
        .detail-val { font-family:'Jost',sans-serif;font-size:14px;font-weight:500;color:#fff; }

        /* MAP */
        .map-wrap { border-radius:14px;overflow:hidden;border:1px solid var(--border);height:300px;margin-bottom:12px; }
        .map-wrap iframe { width:100%;height:100%;border:none;filter:invert(0.88) hue-rotate(180deg) saturate(0.6); }
        .gmaps-btn {
          display:inline-flex;align-items:center;gap:8px;
          padding:10px 20px;border-radius:8px;
          border:1px solid rgba(212,175,55,0.35);background:rgba(212,175,55,0.06);
          color:var(--gold);font-family:'Jost',sans-serif;font-size:13px;font-weight:500;
          text-decoration:none;transition:all 0.2s ease;
        }
        .gmaps-btn:hover { background:rgba(212,175,55,0.12);border-color:var(--gold); }

        /* ENQUIRY CARD */
        .enquiry-card {
          background:var(--card);border:1px solid var(--border);
          border-radius:16px;padding:32px;
          position:sticky;top:88px;
        }
        .eq-eyebrow { font-family:'Jost',sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);margin-bottom:6px; }
        .eq-title { font-family:'Playfair Display',serif;font-size:28px;font-weight:500;color:#fff;margin-bottom:4px; }
        .eq-rule { width:40px;height:2px;background:linear-gradient(90deg,var(--gold),transparent);margin-bottom:24px; }

        .eq-field {
          width:100%;padding:14px 16px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:10px;
          font-family:'Jost',sans-serif;font-size:14px;color:#fff;
          outline:none;transition:all 0.25s ease;
          display:flex;align-items:center;gap:10px;
        }
        .eq-field:focus { border-color:rgba(212,175,55,0.5);background:rgba(212,175,55,0.05);box-shadow:0 0 0 3px rgba(212,175,55,0.08); }
        .eq-field::placeholder { color:rgba(255,255,255,0.25); }

        .eq-submit {
          width:100%;padding:16px;
          background:linear-gradient(135deg,#d4af37,#b8960c);
          border:none;border-radius:10px;cursor:pointer;
          font-family:'Jost',sans-serif;font-size:15px;font-weight:600;
          color:#0d0d0d;letter-spacing:0.3px;
          display:flex;align-items:center;justify-content:center;gap:10px;
          transition:all 0.3s ease;
          box-shadow:0 4px 20px rgba(212,175,55,0.25);
        }
        .eq-submit:hover { transform:translateY(-2px);box-shadow:0 8px 32px rgba(212,175,55,0.35); }
        .eq-submit:disabled { opacity:0.5;cursor:not-allowed;transform:none; }

        .eq-prop-card { margin-top:24px;padding-top:24px;border-top:1px solid var(--border); }
        .eq-prop-lbl { font-family:'Jost',sans-serif;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:8px; }
        .eq-prop-name { font-family:'Playfair Display',serif;font-size:17px;color:#fff;margin-bottom:4px; }
        .eq-prop-price { font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:var(--gold); }

        .spinning { animation:spin 1s linear infinite; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .fade-in { animation:fi 0.5s ease both; }
        @keyframes fi { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* NAV */}
      <div className="detail-nav">
        <Link href="/for-sale" className="back-btn">
          ← Back to Listings
        </Link>
        <div className="nav-divider" />
        <span className="nav-breadcrumb">{listing.city} · {listing.Property_type?.[0]}</span>
      </div>

      <div className="detail-layout">
        {/* LEFT COLUMN */}
        <div className="fade-in">

          {/* IMAGE GALLERY */}
          <div className="img-main">
            {images
              ? <img src={images[activeImage]} alt={listing.address} />
              : <div className="img-placeholder" style={{ background: fallbackBg }}>🏠</div>
            }
          </div>
          {images?.length > 1 && (
            <div className="img-thumbs">
              {images.map((img, i) => (
                <div key={i} className={`thumb ${activeImage === i ? 'active' : ''}`} onClick={() => setActiveImage(i)}>
                  <img src={img} alt={`thumb-${i}`} />
                </div>
              ))}
            </div>
          )}

          {/* PROPERTY HEADER */}
          <div style={{ marginTop: 32 }}>
            <div className="prop-badges">
              <span className={listing.listingType === 'Rent' ? 'badge-rent' : 'badge-sell'}>
                For {listing.listingType}
              </span>
              {listing.Property_type?.map(t => (
                <span key={t} className="badge-type">· {t}</span>
              ))}
            </div>
            <h1 className="prop-title">{listing.address?.split(',')[0]}</h1>
            <div className="prop-address">
              <div className="addr-dot" />
              <span>{listing.address}</span>
            </div>
            <div className="gold-rule" />
            <div className="prop-price">
              {formatPrice(listing.price)}
              {listing.listingType === 'Rent' && <span className="price-suffix">/ month</span>}
            </div>
          </div>

          {/* STATS */}
          {stats.length > 0 && (
            <div className="stats-grid">
              {stats.map((s, i) => (
                <div key={i} className="stat-box">
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-val">{s.value}</div>
                  <div className="stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* DESCRIPTION */}
          {listing.description && (
            <div style={{ marginBottom: 32 }}>
              <h3 className="section-title">About this Property</h3>
              <p className="prop-desc">{listing.description}</p>
            </div>
          )}

          {/* DETAILS */}
          {details.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h3 className="section-title">Property Details</h3>
              <div className="details-grid">
                {details.map(d => (
                  <div key={d.label} className="detail-box">
                    <div className="detail-lbl">{d.label}</div>
                    <div className="detail-val">{d.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MAP */}
          {listing.coordinates && (
            <div>
              <h3 className="section-title">📍 Location on Map</h3>
              <div className="map-wrap">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${listing.coordinates.lon-0.015},${listing.coordinates.lat-0.015},${listing.coordinates.lon+0.015},${listing.coordinates.lat+0.015}&layer=mapnik&marker=${listing.coordinates.lat},${listing.coordinates.lon}`}
                />
              </div>
              <a href={`https://www.google.com/maps?q=${listing.coordinates.lat},${listing.coordinates.lon}`} target="_blank" rel="noopener noreferrer" className="gmaps-btn">
                🗺 Open in Google Maps →
              </a>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — ENQUIRY */}
        <div>
          <div className="enquiry-card">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#d4af37,#b8960c)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, color: '#0d0d0d', fontWeight: 700 }}>✓</div>
                <p style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
                  Enquiry <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Sent!</em>
                </p>
                <p style={{ fontFamily: 'Jost,sans-serif', fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
                  We'll get back to you shortly.
                </p>
                <button onClick={() => setSent(false)} style={{ fontFamily: 'Jost,sans-serif', fontSize: 12, color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Send another →
                </button>
              </div>
            ) : (
              <>
                <p className="eq-eyebrow">Interested?</p>
                <h3 className="eq-title">Send Enquiry</h3>
                <div className="eq-rule" />

                <form onSubmit={handleEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Name */}
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}><PersonIcon /></span>
                    <input
                      className="eq-field"
                      style={{ paddingLeft: 42 }}
                      placeholder="Your Full Name"
                      value={enquiry.name}
                      onChange={e => setEnquiry(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  {/* Email */}
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}><EmailIcon /></span>
                    <input
                      className="eq-field"
                      style={{ paddingLeft: 42 }}
                      placeholder="Email Address"
                      type="email"
                      value={enquiry.email}
                      onChange={e => setEnquiry(p => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  {/* Phone */}
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}><PhoneIcon /></span>
                    <input
                      className="eq-field"
                      style={{ paddingLeft: 42 }}
                      placeholder="Phone Number"
                      type="tel"
                      value={enquiry.phone}
                      onChange={e => setEnquiry(p => ({ ...p, phone: e.target.value }))}
                      required
                    />
                  </div>
                  {/* Message */}
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: 16, fontSize: 16 }}><MsgIcon /></span>
                    <textarea
                      className="eq-field"
                      style={{ paddingLeft: 42, resize: 'none', minHeight: 110, alignItems: 'flex-start', paddingTop: 14 }}
                      placeholder="I'm interested in this property..."
                      value={enquiry.message}
                      onChange={e => setEnquiry(p => ({ ...p, message: e.target.value }))}
                    />
                  </div>

                  {sendError && (
                    <p style={{ fontFamily: 'Jost,sans-serif', fontSize: 12, color: '#ff6b6b' }}>⚠ {sendError}</p>
                  )}

                  <button type="submit" className="eq-submit" disabled={sending} style={{ marginTop: 4 }}>
                    {sending ? (
                      <>
                        <svg className="spinning" width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="3"/>
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="#0d0d0d" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <><span>✉</span> Send Enquiry</>
                    )}
                  </button>
                  <p style={{ fontFamily: 'Jost,sans-serif', fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>Your information is kept private</p>
                </form>

                {/* Property Summary */}
                <div className="eq-prop-card">
                  <p className="eq-prop-lbl">Property</p>
                  <p className="eq-prop-name">{listing.address?.split(',')[0]}</p>
                  <p className="eq-prop-price">
                    {formatPrice(listing.price)}
                    {listing.listingType === 'Rent' && <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--muted)', marginLeft: 4 }}>/mo</span>}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SVG ICONS (custom, no emoji) ──
function BedIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="18" width="24" height="8" rx="2" stroke="#d4af37" strokeWidth="1.5"/>
      <path d="M4 18v-6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v6" stroke="#d4af37" strokeWidth="1.5"/>
      <rect x="8" y="13" width="6" height="5" rx="1" stroke="#d4af37" strokeWidth="1.2"/>
      <rect x="18" y="13" width="6" height="5" rx="1" stroke="#d4af37" strokeWidth="1.2"/>
      <path d="M4 26v2M28 26v2" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function BathIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M8 14V8a4 4 0 0 1 8 0v2" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="4" y="14" width="24" height="8" rx="4" stroke="#d4af37" strokeWidth="1.5"/>
      <path d="M8 22v4M24 22v4" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 26h4M20 26h4" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function ParkingIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="8" width="24" height="16" rx="3" stroke="#d4af37" strokeWidth="1.5"/>
      <path d="M10 20v-8h6a4 4 0 0 1 0 8h-6" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 16h6" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function AreaIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M6 26L26 6" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 6h4M6 6v4" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M26 26h-4M26 26v-4" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="6" y="6" width="20" height="20" rx="2" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="3 3"/>
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="rgba(255,255,255,0.3)" strokeWidth="1.3"/>
      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.3"/>
      <path d="M2 5l6 4 6-4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 2h3l1.5 3.5-2 1.5a8 8 0 0 0 3.5 3.5l1.5-2L14 10v3a1 1 0 0 1-1 1A11 11 0 0 1 2 3a1 1 0 0 1 1-1z" stroke="rgba(255,255,255,0.3)" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  );
}
function MsgIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M14 10a1 1 0 0 1-1 1H5l-3 3V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7z" stroke="rgba(255,255,255,0.3)" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  );
}

export default ListingDetail;