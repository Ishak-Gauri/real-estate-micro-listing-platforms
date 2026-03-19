'use client';
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation'; 

function AddNewListing() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    listingType: 'Sell',
    Property_type: [],
    bedroom: '',
    bathroom: '',
    builtIn: '',
    parking: '',
    lotSize: '',
    area: '',
    price: '',
    hoa: '',
    description: '',
  });

  const supabase = createClient();
  const router = useRouter();
  const propertyTypes = ['Flat', 'Apartment', 'Villa', 'House', 'Plot', 'Commercial'];

  const fetchLocations = async (value) => {
    setQuery(value);
    if (!value) { setResults([]); return; }
    try {
      setLoading(true);
      const res = await fetch(`/api/location?q=${encodeURIComponent(value)}`);
      const text = await res.text();
      if (!text) { setResults([]); return; }
      const data = JSON.parse(text);
      if (Array.isArray(data)) setResults(data);
      else setResults([]);
    } catch { setResults([]); }
    finally { setLoading(false); }
  };

  const handleSelect = (place) => {
    setQuery(place.label);
    setResults([]);
    setSelectedLocation({
      address: place.label,
      coordinates: { lat: place.lat, lon: place.lon },
      city: place.structured_formatting.secondary_text.split(',')[0].trim(),
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const togglePropertyType = (type) => {
    setForm(prev => ({
      ...prev,
      Property_type: prev.Property_type.includes(type)
        ? prev.Property_type.filter(t => t !== type)
        : [...prev.Property_type, type],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewUrls(files.map(f => URL.createObjectURL(f)));
  };

  const uploadImages = async () => {
    const urls = [];
    for (const file of images) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (error) { console.error('Upload error:', error.message); continue; }
      const { data: urlData } = supabase.storage.from('listing-images').getPublicUrl(fileName);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (publish = false) => {
    if (!selectedLocation) { alert('Please select an address'); return; }
    try {
      setSaving(true);
      setUploading(true);
      const imageUrls = images.length > 0 ? await uploadImages() : [];
      setUploading(false);

      const { data, error } = await supabase.from('Listing').insert([{
        address: selectedLocation.address,
        coordinates: selectedLocation.coordinates,
        city: selectedLocation.city,
        listingType: form.listingType,
        Property_type: form.Property_type,
        bedroom: form.bedroom ? parseInt(form.bedroom) : null,
        bathroom: form.bathroom ? parseInt(form.bathroom) : null,
        builtIn: form.builtIn,
        parking: form.parking ? parseInt(form.parking) : null,
        lotSize: form.lotSize ? parseFloat(form.lotSize) : null,
        area: form.area ? parseFloat(form.area) : null,
        price: form.price ? parseFloat(form.price) : null,
        hoa: form.hoa ? parseFloat(form.hoa) : null,
        description: form.description,
        images: imageUrls,
        active: publish,
      }]).select();

      if (error) { 
        alert('Error: ' + error.message); 
      } else {
        if (publish) {
          router.push('/for-sale');  // ✅ redirect on publish
        } else {
          alert('✅ Saved as Draft!');
        }
      }
      
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const steps = ['Location', 'Details', 'Photos & Publish'];

  return (
    <div style={{ background: '#09090f', minHeight: '100vh', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }

        .form-input {
          width: 100%;
          padding: 14px 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }
        .form-input:focus {
          border-color: rgba(212,175,55,0.7);
          background: rgba(212,175,55,0.05);
          box-shadow: 0 0 20px rgba(212,175,55,0.1);
        }
        .form-input::placeholder { color: rgba(255,255,255,0.25); }

        .form-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(212,175,55,0.8);
          margin-bottom: 8px;
          display: block;
        }

        .type-btn {
          padding: 10px 20px;
          border-radius: 50px;
          border: 1px solid rgba(212,175,55,0.25);
          background: transparent;
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .type-btn:hover { border-color: rgba(212,175,55,0.6); color: #d4af37; }
        .type-btn.active {
          background: rgba(212,175,55,0.15);
          border-color: #d4af37;
          color: #d4af37;
          box-shadow: 0 0 15px rgba(212,175,55,0.2);
        }

        .radio-btn {
          position: relative;
          padding: 14px 24px;
          border-radius: 12px;
          border: 1px solid rgba(212,175,55,0.2);
          background: transparent;
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
          text-align: center;
        }
        .radio-btn.active {
          background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05));
          border-color: #d4af37;
          color: #d4af37;
          box-shadow: 0 0 20px rgba(212,175,55,0.15);
        }

        .gold-btn {
          padding: 14px 32px;
          background: linear-gradient(135deg, #d4af37, #f0d060, #d4af37);
          background-size: 200% 100%;
          border: none;
          border-radius: 10px;
          color: #09090f;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
        }
        .gold-btn:hover {
          background-position: right center;
          box-shadow: 0 10px 30px rgba(212,175,55,0.4);
          transform: translateY(-2px);
        }
        .gold-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .outline-btn {
          padding: 14px 32px;
          background: transparent;
          border: 1px solid rgba(212,175,55,0.4);
          border-radius: 10px;
          color: #d4af37;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .outline-btn:hover {
          background: rgba(212,175,55,0.08);
          border-color: #d4af37;
        }
        .outline-btn:disabled { opacity: 0.5; }

        .step-indicator {
          display: flex;
          align-items: center;
          gap: 0;
        }
        .step-dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }
        .step-line {
          flex: 1;
          height: 1px;
          background: rgba(212,175,55,0.2);
          transition: background 0.3s ease;
        }
        .step-line.done { background: rgba(212,175,55,0.6); }

        .autocomplete-item {
          padding: 14px 18px;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .autocomplete-item:hover { background: rgba(212,175,55,0.08); }
        .autocomplete-item:last-child { border-bottom: none; }

        .photo-upload-area {
          border: 2px dashed rgba(212,175,55,0.3);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .photo-upload-area:hover {
          border-color: rgba(212,175,55,0.7);
          background: rgba(212,175,55,0.04);
        }

        .fade-in { animation: fadeIn 0.4s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '40px',
        borderBottom: '1px solid rgba(212,175,55,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <p style={{ fontFamily: 'DM Sans', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#d4af37', marginBottom: '6px' }}>
            List Your Property
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '36px', fontWeight: 300, color: '#fff' }}>
            Add New <span style={{ fontStyle: 'italic', color: '#d4af37' }}>Listing</span>
          </h1>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, minWidth: '280px' }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ textAlign: 'center' }}>
                <div className="step-dot" style={{
                  background: step > i + 1 ? '#d4af37' : step === i + 1 ? 'rgba(212,175,55,0.2)' : 'transparent',
                  border: step === i + 1 ? '2px solid #d4af37' : step > i + 1 ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  color: step === i + 1 ? '#d4af37' : step > i + 1 ? '#09090f' : 'rgba(255,255,255,0.3)',
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <p style={{ fontFamily: 'DM Sans', fontSize: '10px', color: step === i + 1 ? '#d4af37' : 'rgba(255,255,255,0.3)', marginTop: '4px', whiteSpace: 'nowrap' }}>{s}</p>
              </div>
              {i < steps.length - 1 && <div className={`step-line ${step > i + 1 ? 'done' : ''}`} style={{ margin: '0 8px', marginBottom: '16px' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 40px' }}>

        {/* STEP 1: Location */}
        {step === 1 && (
          <div className="fade-in">
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '28px', fontWeight: 400, color: '#fff', marginBottom: '8px' }}>
              Where is the <span style={{ fontStyle: 'italic', color: '#d4af37' }}>property?</span>
            </h2>
            <p style={{ fontFamily: 'DM Sans', fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '40px' }}>
              Start by searching for the exact address
            </p>

            <div style={{ marginBottom: '32px' }}>
              <label className="form-label">Property Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={query}
                  onChange={e => fetchLocations(e.target.value)}
                  placeholder="Search for address, city, locality..."
                  className="form-input"
                  style={{ paddingLeft: '46px' }}
                />
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>📍</span>
              </div>
              {loading && (
                <p style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'rgba(212,175,55,0.6)', marginTop: '8px' }}>Searching...</p>
              )}
              {results.length > 0 && (
                <div style={{ background: '#111118', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', marginTop: '8px', overflow: 'hidden' }}>
                  {results.slice(0, 5).map((place, i) => (
                    <div key={`${place.place_id}-${i}`} className="autocomplete-item" onClick={() => handleSelect(place)}>
                      <p style={{ fontFamily: 'DM Sans', fontSize: '14px', color: '#fff', marginBottom: '2px' }}>{place.structured_formatting.main_text}</p>
                      <p style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{place.structured_formatting.secondary_text}</p>
                    </div>
                  ))}
                </div>
              )}
              {selectedLocation && (
                <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px' }}>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: '#d4af37', marginBottom: '4px' }}>✅ Location Selected</p>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{selectedLocation.address}</p>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                    lat: {selectedLocation.coordinates.lat} · lon: {selectedLocation.coordinates.lon}
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label className="form-label">Listing Type</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['Sell', 'Rent'].map(type => (
                  <button key={type} className={`radio-btn ${form.listingType === type ? 'active' : ''}`} onClick={() => setForm(p => ({ ...p, listingType: type }))}>
                    {type === 'Sell' ? '🏷 Sell' : '🔑 Rent'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Property Type</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {propertyTypes.map(type => (
                  <button key={type} className={`type-btn ${form.Property_type.includes(type) ? 'active' : ''}`} onClick={() => togglePropertyType(type)}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '48px' }}>
              <button className="gold-btn" onClick={() => setStep(2)}>
                Continue to Details →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Property Details */}
        {step === 2 && (
          <div className="fade-in">
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '28px', fontWeight: 400, color: '#fff', marginBottom: '8px' }}>
              Property <span style={{ fontStyle: 'italic', color: '#d4af37' }}>Details</span>
            </h2>
            <p style={{ fontFamily: 'DM Sans', fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '40px' }}>
              Tell us more about the property features
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
              {[
                { label: 'Bedrooms', name: 'bedroom', placeholder: 'e.g. 3', type: 'number', icon: '🛏' },
                { label: 'Bathrooms', name: 'bathroom', placeholder: 'e.g. 2', type: 'number', icon: '🚿' },
                { label: 'Parking', name: 'parking', placeholder: 'e.g. 2', type: 'number', icon: '🚗' },
                { label: 'Built In (Year)', name: 'builtIn', placeholder: 'e.g. 2020', type: 'text', icon: '🏗' },
                { label: 'Lot Size (Sq.ft)', name: 'lotSize', placeholder: 'e.g. 1200', type: 'number', icon: '📏' },
                { label: 'Area (Sq.ft)', name: 'area', placeholder: 'e.g. 1500', type: 'number', icon: '📐' },
              ].map(field => (
                <div key={field.name}>
                  <label className="form-label">{field.icon} {field.label}</label>
                  <input type={field.type} name={field.name} value={form[field.name]} onChange={handleFormChange} placeholder={field.placeholder} className="form-input" />
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label className="form-label">💰 {form.listingType === 'Rent' ? 'Monthly Rent (₹)' : 'Selling Price (₹)'}</label>
                <input type="number" name="price" value={form.price} onChange={handleFormChange} placeholder="e.g. 8500000" className="form-input" />
              </div>
              <div>
                <label className="form-label">🏢 HOA / Maintenance (₹/mo)</label>
                <input type="number" name="hoa" value={form.hoa} onChange={handleFormChange} placeholder="e.g. 5000" className="form-input" />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">📝 Description</label>
              <textarea name="description" value={form.description} onChange={handleFormChange} rows={5} placeholder="Describe the property — highlights, neighborhood, amenities..." className="form-input" style={{ resize: 'vertical', lineHeight: '1.6' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
              <button className="outline-btn" onClick={() => setStep(1)}>← Back</button>
              <button className="gold-btn" onClick={() => setStep(3)}>Continue to Photos →</button>
            </div>
          </div>
        )}

        {/* STEP 3: Photos & Publish */}
        {step === 3 && (
          <div className="fade-in">
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '28px', fontWeight: 400, color: '#fff', marginBottom: '8px' }}>
              Upload <span style={{ fontStyle: 'italic', color: '#d4af37' }}>Photos</span>
            </h2>
            <p style={{ fontFamily: 'DM Sans', fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '40px' }}>
              High quality photos increase visibility by 3x
            </p>

            <label className="photo-upload-area" htmlFor="photo-input">
              <input id="photo-input" type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>📸</p>
              <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '22px', color: '#fff', marginBottom: '8px' }}>Drop photos here</p>
              <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>or click to browse · JPG, PNG, WEBP supported</p>
              {previewUrls.length > 0 && (
                <p style={{ marginTop: '12px', fontFamily: 'DM Sans', fontSize: '13px', color: '#d4af37' }}>
                  ✅ {previewUrls.length} photo{previewUrls.length > 1 ? 's' : ''} selected
                </p>
              )}
            </label>

            {previewUrls.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px' }}>
                {previewUrls.map((url, i) => (
                  <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', height: '120px', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <img src={url} alt={`preview-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}

            {/* Summary Card */}
            <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '16px' }}>
              <p style={{ fontFamily: 'DM Sans', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#d4af37', marginBottom: '16px' }}>Summary</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Address', value: selectedLocation?.address?.split(',')[0] },
                  { label: 'City', value: selectedLocation?.city },
                  { label: 'Type', value: `${form.listingType} · ${form.Property_type.join(', ')}` },
                  { label: 'Price', value: form.price ? `₹${parseInt(form.price).toLocaleString('en-IN')}` : '—' },
                  { label: 'Bedrooms', value: form.bedroom || '—' },
                  { label: 'Area', value: form.area ? `${form.area} sq.ft` : '—' },
                ].map(item => (
                  <div key={item.label}>
                    <p style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>{item.label}</p>
                    <p style={{ fontFamily: 'DM Sans', fontSize: '14px', color: '#fff' }}>{item.value || '—'}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', gap: '12px' }}>
              <button className="outline-btn" onClick={() => setStep(2)}>← Back</button>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="outline-btn" onClick={() => handleSubmit(false)} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                <button className="gold-btn" onClick={() => handleSubmit(true)} disabled={saving}>
                  {uploading ? '⏳ Uploading...' : saving ? '⏳ Publishing...' : '🚀 Publish Listing'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddNewListing;