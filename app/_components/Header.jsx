"use client";

import { Plus, ChevronLeft, ChevronRight, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

const IMAGES = [
  "/building.png",
  "/building1.png",
  "/building2.png",
  "/building3.png",
  "/building4.png",
  "/building5.png",
  "/building6.png",
]

function Header() {
  const path = usePathname();
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration — only run active check on client
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 

  const go = useCallback((dir) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex(i =>
      dir === 'next'
        ? (i + 1) % IMAGES.length
        : (i - 1 + IMAGES.length) % IMAGES.length
    );
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  // Safe active check 
  const isActive = (href) => {
    if (!mounted) return false;
    const search = window.location.search;
    if (href === '/for-sale?type=Sell') return path === '/for-sale' && search.includes('Sell');
    if (href === '/for-sale?type=Rent') return path === '/for-sale' && search.includes('Rent');
    return false;
  };

  const navLinks = [
    { label: 'For Sale', href: '/for-sale?type=Sell' },
    { label: 'For Rent', href: '/for-sale?type=Rent' },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');

        /* BG TRANSITION */
        .bg-img {
          position: absolute; inset: 0; z-index: 1;
          transition: opacity 0.7s ease-in-out;
        }

        /* NAVBAR */
        .hdr-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; justify-content: center;
          padding: 0 24px;
        }
        .hdr-inner {
          width: 100%; max-width: 1320px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 28px;
          border-radius: 0 0 18px 18px;
          background: rgba(8,6,4,0.6);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.07);
          border-top: none;
          box-shadow: 0 8px 40px rgba(0,0,0,0.35);
          transition: padding 0.3s ease, background 0.3s ease;
        }
        .hdr-inner.scrolled {
          background: rgba(8,6,4,0.88);
          padding: 8px 28px;
        }

        /* LEFT */
        .hdr-left { display: flex; align-items: center; gap: 36px; }

        /* NAV LINKS */
        .hdr-links { display: flex; align-items: center; gap: 2px; }
        .hdr-link {
          position: relative; padding: 8px 16px; border-radius: 8px;
          font-family: 'Jost', sans-serif; font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.6); text-decoration: none;
          transition: all 0.22s ease; letter-spacing: 0.2px; white-space: nowrap;
        }
        .hdr-link:hover { color: #fff; background: rgba(255,255,255,0.07); }
        .hdr-link.active { color: #fff; background: rgba(212,175,55,0.13); }
        .hdr-link.active::after {
          content: ''; position: absolute; bottom: 5px; left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%; background: #d4af37;
        }

        /* RIGHT */
        .hdr-right { display: flex; align-items: center; gap: 10px; }

        .call-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 100px;
          background: transparent;
          border: 1.5px solid rgba(212,175,55,0.35);
          font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 500;
          color: rgba(212,175,55,0.85); text-decoration: none;
          transition: all 0.25s ease; white-space: nowrap;
        }
        .call-btn:hover {
          background: rgba(212,175,55,0.1);
          border-color: #d4af37; color: #d4af37;
          box-shadow: 0 0 20px rgba(212,175,55,0.15);
        }

        .post-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 20px; border-radius: 100px;
          background: linear-gradient(135deg, #c9906e, #b07050);
          border: none; cursor: pointer;
          font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 600;
          color: #fff; letter-spacing: 0.2px;
          box-shadow: 0 4px 16px rgba(201,144,110,0.3);
          transition: all 0.3s ease;
        }
        .post-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,144,110,0.45); }

        .login-btn {
          display: inline-flex; align-items: center;
          padding: 9px 20px; border-radius: 100px;
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.18); cursor: pointer;
          font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.75);
          transition: all 0.22s ease;
        }
        .login-btn:hover { border-color: rgba(255,255,255,0.45); color: #fff; background: rgba(255,255,255,0.05); }

        /* HERO TEXT */
        .hero-content {
          position: absolute; inset: 0; z-index: 10;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 0 24px;
          pointer-events: none;
        }
        .hero-eyebrow {
          font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 600;
          letter-spacing: 4px; text-transform: uppercase; color: #c9906e;
          margin-bottom: 18px; display: flex; align-items: center; gap: 14px;
        }
        .hero-eyebrow::before, .hero-eyebrow::after {
          content: ''; width: 28px; height: 1px; background: currentColor; opacity: 0.5;
        }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 5.5vw, 70px);
          font-weight: 700; color: #fff; line-height: 1.15;
          letter-spacing: -1px; margin-bottom: 18px;
          text-shadow: 0 2px 40px rgba(0,0,0,0.4);
        }
        .hero-title em { font-style: italic; color: #d4af37; }
        .hero-sub {
          font-family: 'Jost', sans-serif; font-size: 15px; font-weight: 300;
          color: rgba(255,255,255,0.55); max-width: 460px; line-height: 1.75;
        }

        /* OVERLAY */
        .hero-overlay {
          position: absolute; inset: 0; z-index: 4;
          background: linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.65) 100%);
        }

        /* ARROWS */
        .arrow-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          z-index: 20; width: 46px; height: 46px; border-radius: 50%;
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(255,255,255,0.8);
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .arrow-btn:hover {
          background: rgba(212,175,55,0.18);
          border-color: rgba(212,175,55,0.45);
          color: #fff;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        .arrow-left { left: 24px; }
        .arrow-right { right: 24px; }

        /* DOTS */
        .dots-row {
          position: absolute; bottom: 112px; left: 50%; transform: translateX(-50%);
          z-index: 20; display: flex; gap: 8px; align-items: center;
        }
        .dot {
          height: 3px; border-radius: 2px; cursor: pointer;
          background: rgba(255,255,255,0.3);
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .dot.active { background: #d4af37; width: 28px; }
        .dot:not(.active) { width: 8px; }
        .dot:not(.active):hover { background: rgba(255,255,255,0.6); }

        /* THUMBNAILS */
        .thumbs-bar {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 20;
          display: flex; gap: 8px; padding: 12px 20px;
          background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%);
        }
        .thumb {
          flex: 1; height: 70px; border-radius: 10px; overflow: hidden;
          cursor: pointer; opacity: 0.5;
          border: 2px solid transparent;
          transition: all 0.3s ease; position: relative;
        }
        .thumb.active { border-color: #d4af37; opacity: 1; }
        .thumb:not(.active):hover { opacity: 0.8; transform: translateY(-2px); }
      `}</style>

      {/* BACKGROUND IMAGES — stacked, fading */}
      {IMAGES.map((src, i) => (
        <div key={src} className="bg-img" style={{ opacity: i === activeIndex ? 1 : 0 }}>
          <Image src={src} alt="" fill sizes="100vw" className="object-cover object-center" priority={i === 0} />
        </div>
      ))}
      <div className="hero-overlay" />

      {/* NAVBAR */}
      <nav className="hdr-nav">
        <div className={`hdr-inner ${scrolled ? 'scrolled' : ''}`}>

          {/* LEFT: Logo + Links */}
          <div className="hdr-left">
            <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Image src="/logo.png" width={130} height={40} alt="Red Logo" style={{ height: 'auto', objectFit: 'contain' }} />
            </Link>
            <div className="hdr-links">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hdr-link ${isActive(link.href) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="hdr-right">
            

            {/* Post */}
            <button
              className="post-btn"
              onClick={() => { if (!isSignedIn) router.push('/sign-in'); else router.push('/add-new-listing'); }}
            >
              <Plus size={15} strokeWidth={2.5} />
              Post
            </button>

            {/* Login / User */}
            {!isSignedIn && (
              <SignInButton mode="modal">
                <button className="login-btn">Login</button>
              </SignInButton>
            )}
            {isSignedIn && <UserButton />}
          </div>
        </div>
      </nav>

      {/* HERO TEXT */}
      <div className="hero-content">
        <p className="hero-eyebrow">Premium Real Estate</p>
        <h1 className="hero-title">
          Find Your <em>Dream</em><br />Home Today
        </h1>
        <p className="hero-sub">
          Discover exceptional properties across India's most sought-after locations
        </p>
      </div>

      {/* ARROWS */}
      <button className="arrow-btn arrow-left" onClick={() => go('prev')}>
        <ChevronLeft size={20} strokeWidth={1.8} />
      </button>
      <button className="arrow-btn arrow-right" onClick={() => go('next')}>
        <ChevronRight size={20} strokeWidth={1.8} />
      </button>

      {/* DOTS */}
      <div className="dots-row">
        {IMAGES.map((_, i) => (
          <div key={i} className={`dot ${activeIndex === i ? 'active' : ''}`} onClick={() => setActiveIndex(i)} />
        ))}
      </div>

      {/* THUMBNAILS */}
      <div className="thumbs-bar">
        {IMAGES.map((src, i) => (
          <div key={i} className={`thumb ${activeIndex === i ? 'active' : ''}`} onClick={() => setActiveIndex(i)}>
            <Image src={src} alt={`thumb-${i}`} fill sizes="200px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Header;