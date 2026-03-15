import { Link } from '@inertiajs/react';

const PUROKS = ['1','2','3','4','5','6','7','8'];

export default function ResidentForm({ form, onSubmit, submitLabel = 'Save', isEdit = false }) {
  const { data, setData, processing, errors } = form;

  const F = ({ label, children, error, full = false }) => (
    <div style={{ gridColumn: full ? '1/-1' : undefined }}>
      <label className="bims-label">{label}</label>
      {children}
      {error && <p className="bims-error">{error}</p>}
    </div>
  );

  const Section = ({ icon, title, children }) => (
    <div className="bims-card">
      <div className="bims-card-title"><span>{icon}</span> {title}</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'18px 24px' }}>
        {children}
      </div>
    </div>
  );

  return (
    <form onSubmit={onSubmit}>

      {/* Personal Info */}
      <Section icon="👤" title="Personal Information">
        <F label="Last Name *" error={errors.last_name}>
          <input value={data.last_name} onChange={e=>setData('last_name',e.target.value)}
            className="bims-input" placeholder="De la Cruz" required />
        </F>
        <F label="First Name *" error={errors.first_name}>
          <input value={data.first_name} onChange={e=>setData('first_name',e.target.value)}
            className="bims-input" placeholder="Juan" required />
        </F>
        <F label="Middle Name" error={errors.middle_name}>
          <input value={data.middle_name} onChange={e=>setData('middle_name',e.target.value)}
            className="bims-input" placeholder="Santos" />
        </F>
        <F label="Suffix" error={errors.suffix}>
          <select value={data.suffix} onChange={e=>setData('suffix',e.target.value)} className="bims-input">
            <option value="">None</option>
            <option>Jr.</option><option>Sr.</option>
            <option>II</option><option>III</option><option>IV</option>
          </select>
        </F>
        <F label="Date of Birth *" error={errors.birthdate}>
          <input type="date" value={data.birthdate} onChange={e=>setData('birthdate',e.target.value)}
            className="bims-input" required />
        </F>
        <F label="Sex *" error={errors.gender}>
          <select value={data.gender} onChange={e=>setData('gender',e.target.value)} className="bims-input" required>
            <option value="">Select</option>
            <option>Male</option><option>Female</option>
          </select>
        </F>
        <F label="Civil Status *" error={errors.civil_status}>
          <select value={data.civil_status} onChange={e=>setData('civil_status',e.target.value)} className="bims-input" required>
            <option value="">Select</option>
            <option>Single</option><option>Married</option>
            <option>Widowed</option><option>Separated</option><option>Annulled</option>
          </select>
        </F>
        <F label="Blood Type" error={errors.blood_type}>
          <select value={data.blood_type||''} onChange={e=>setData('blood_type',e.target.value)} className="bims-input">
            <option value="">Unknown</option>
            <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
          </select>
        </F>
        <F label="Nationality">
          <input value={data.nationality} onChange={e=>setData('nationality',e.target.value)}
            className="bims-input" />
        </F>
        <F label="Religion">
          <input value={data.religion||''} onChange={e=>setData('religion',e.target.value)}
            className="bims-input" placeholder="e.g. Roman Catholic" />
        </F>
        <F label="Educational Attainment">
          <select value={data.educational_attainment||''} onChange={e=>setData('educational_attainment',e.target.value)} className="bims-input">
            <option value="">Select</option>
            <option>No Formal Education</option>
            <option>Elementary Level</option><option>Elementary Graduate</option>
            <option>High School Level</option><option>High School Graduate</option>
            <option>Vocational / Tech-Voc</option>
            <option>College Level</option><option>College Graduate</option>
            <option>Post Graduate</option>
          </select>
        </F>
        <F label="Occupation">
          <input value={data.occupation||''} onChange={e=>setData('occupation',e.target.value)}
            className="bims-input" placeholder="e.g. Farmer, Teacher" />
        </F>
      </Section>

      {/* Contact & Address */}
      <Section icon="📍" title="Contact & Address">
        <F label="Contact Number" error={errors.contact_number}>
          <input value={data.contact_number||''} onChange={e=>setData('contact_number',e.target.value)}
            className="bims-input" placeholder="09XXXXXXXXX" />
        </F>
        <F label="Email Address" error={errors.email}>
          <input type="email" value={data.email||''} onChange={e=>setData('email',e.target.value)}
            className="bims-input" placeholder="juan@example.com" />
        </F>
        <F label="Purok" error={errors.purok}>
          <select value={data.purok||''} onChange={e=>setData('purok',e.target.value)} className="bims-input">
            <option value="">Select Purok</option>
            {PUROKS.map(p=><option key={p} value={`Purok ${p}`}>Purok {p}</option>)}
          </select>
        </F>
        <F label="Street / Sitio" error={errors.street}>
          <input value={data.street||''} onChange={e=>setData('street',e.target.value)}
            className="bims-input" placeholder="Street or Sitio name" />
        </F>
        <F label="Complete Address *" error={errors.address} full>
          <textarea value={data.address||''} onChange={e=>setData('address',e.target.value)}
            className="bims-input" rows={2} required
            placeholder="House No., Street, Purok, Barangay" />
        </F>
      </Section>

      {/* Classification */}
      <div className="bims-card">
        <div className="bims-card-title"><span>🏷️</span> Classification / Special Groups</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14 }}>
          {[
            { key:'is_voter',          label:'Registered Voter',       icon:'🗳️' },
            { key:'is_senior_citizen', label:'Senior Citizen (60+)',   icon:'🧓' },
            { key:'is_pwd',            label:'Person with Disability', icon:'♿' },
            { key:'is_4ps',            label:'4Ps Beneficiary',        icon:'🏠' },
          ].map(({ key, label, icon }) => (
            <label key={key} style={{
              display:'flex', alignItems:'center', gap:12, padding:'14px 16px',
              background: data[key] ? '#e8f2fc' : '#fafdff',
              border: `1.5px solid ${data[key] ? '#2e7fc1' : '#d4e1ec'}`,
              borderRadius:8, cursor:'pointer', transition:'all .15s',
            }}>
              <input type="checkbox" checked={!!data[key]} onChange={e=>setData(key,e.target.checked)}
                style={{ width:16, height:16, accentColor:'#2e7fc1' }} />
              <span style={{ fontSize:'1.1rem' }}>{icon}</span>
              <span style={{ fontSize:'.88rem', fontWeight:600, color:'#0d2137' }}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:12, marginTop:8 }}>
        <button type="submit" disabled={processing} className="bims-btn-primary">
          {processing ? '⏳ Saving...' : `💾 ${submitLabel}`}
        </button>
        <Link href="/residents" className="bims-btn-outline">Cancel</Link>
      </div>
    </form>
  );
}