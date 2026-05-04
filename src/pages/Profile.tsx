import { useState } from 'react'
import { User, SlidersHorizontal, Users, Phone, Shield, MessageSquare, Edit3, X, Save, Mail } from 'lucide-react'

const FACTORS = [
  { key: 'lighting', emoji: '💡', label: 'Street Lighting', initial: 80 },
  { key: 'foot',     emoji: '👣', label: 'Foot Traffic',    initial: 70 },
  { key: 'stores',   emoji: '🏪', label: 'Open Stores',     initial: 60 },
  { key: 'walk',     emoji: '🛤️', label: 'Walk Path',       initial: 50 },
  { key: 'visibility', emoji: '👁️', label: 'Visibility',    initial: 75 },
  { key: 'time',     emoji: '🌙', label: 'Time of Day',     initial: 65 },
] as const

const CONTACT_KEY = 'safestep:emergency_contact'
const PROFILE_KEY = 'safestep:user_profile'

type UserProfile = {
  name: string
  email: string
  sex: 'female' | 'male' | 'non-binary' | 'prefer-not-to-say' | 'self-describe' | ''
  sexCustom: string
}

export function ProfilePage() {
  // Factors
  const [factors, setFactors] = useState(() =>
    Object.fromEntries(FACTORS.map(f => [f.key, f.initial])) as Record<string, number>,
  )

  // Emergency Contact
  const [contact, setContact] = useState<{ name: string; phone: string } | null>(() => {
    const saved = localStorage.getItem(CONTACT_KEY)
    return saved ? JSON.parse(saved) : null
  })

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(PROFILE_KEY)
    return saved ? JSON.parse(saved) : { name: '', email: '', sex: '', sexCustom: '' }
  })

  const [isEditingContact, setIsEditingContact] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  
  const [tempContact, setTempContact] = useState({ name: '', phone: '' })
  const [tempProfile, setTempProfile] = useState<UserProfile>({ name: '', email: '', sex: '', sexCustom: '' })

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault()
    if (tempContact.name && tempContact.phone) {
      const newContact = { ...tempContact }
      setContact(newContact)
      localStorage.setItem(CONTACT_KEY, JSON.stringify(newContact))
      setIsEditingContact(false)
    }
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    const newProfile = { ...tempProfile }
    setProfile(newProfile)
    localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile))
    setIsEditingProfile(false)
  }

  const startEditingContact = () => {
    setTempContact(contact || { name: '', phone: '' })
    setIsEditingContact(true)
  }

  const startEditingProfile = () => {
    setTempProfile(profile)
    setIsEditingProfile(true)
  }

  const displayName = profile.name || 'SafeStep user'

  return (
    <div className="p-4 flex flex-col gap-4 pb-20 overflow-y-auto h-full">
      {/* User Identity Card */}
      <Card>
        <div className="flex flex-col items-center text-center py-3 relative">
          <button 
            onClick={startEditingProfile}
            className="absolute top-0 right-0 p-2 text-neutral-400 hover:text-brand-600 transition"
            title="Edit Profile"
          >
            <Edit3 size={18} />
          </button>
          
          <div className="w-16 h-16 rounded-full bg-brand-500 grid place-items-center text-white shadow-lg shadow-brand-500/20">
            <User size={28} />
          </div>
          <h2 className="font-bold mt-3 text-xl text-neutral-900 leading-tight">{displayName}</h2>
          <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mt-1">
            {profile.sex === 'self-describe' ? profile.sexCustom : (profile.sex || 'Member')}
          </p>
          
          {profile.email && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-500 bg-neutral-50 px-3 py-1 rounded-full border border-neutral-100">
              <Mail size={12} /> {profile.email}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <SectionHeader icon={Users} title="Emergency Contact" />
        <p className="text-sm text-neutral-500 mt-1">
          The person you call or share status with in an emergency.
        </p>
        
        {contact ? (
          <div className="mt-4 p-4 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white grid place-items-center text-brand-600 shadow-sm border border-brand-100">
                <Phone size={18} />
              </div>
              <div>
                <p className="font-bold text-brand-900">{contact.name}</p>
                <p className="text-xs text-brand-600 font-medium">{contact.phone}</p>
              </div>
            </div>
            <button 
              onClick={startEditingContact}
              className="text-xs font-bold text-brand-600 uppercase tracking-tight px-3 py-1 rounded-lg hover:bg-white transition"
            >
              Edit
            </button>
          </div>
        ) : (
          <button 
            onClick={startEditingContact}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-neutral-200 text-neutral-500 hover:border-brand-200 hover:text-brand-600 hover:bg-brand-50 transition-all font-medium"
          >
            + Add Emergency Contact
          </button>
        )}
      </Card>

      <Card>
        <SectionHeader icon={SlidersHorizontal} title="Safety Factor Priorities" />
        <p className="text-sm text-neutral-500 mt-1">
          Adjust how important each factor is for your route scoring.
        </p>
        <div className="mt-6 flex flex-col gap-5">
          {FACTORS.map(f => (
            <div key={f.key}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-neutral-700">{f.emoji} {f.label}</span>
                <span className="text-brand-600 font-bold tabular-nums">{factors[f.key]}%</span>
              </div>
              <input
                type="range" min={0} max={100}
                value={factors[f.key]}
                onChange={(e) => setFactors(s => ({ ...s, [f.key]: Number(e.target.value) }))}
                className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex gap-2">
          <Shield size={14} className="text-brand-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-neutral-500 leading-relaxed italic">
            Your preferences are used to weight the "Safe" vs "Fast" balance of the routing algorithm.
          </p>
        </div>
      </Card>

      <Card>
        <SectionHeader icon={MessageSquare} title="Help & Collaboration" />
        <p className="text-sm text-neutral-500 mt-1">
          Want to help us improve SafeStep? Have a suggestion?
        </p>
        <button 
          onClick={() => {
            const subject = encodeURIComponent('SafeStep feedback / collaboration')
            const body = encodeURIComponent('Hi SafeStep team,\n\nI would like to help improve the app.\n\nMy suggestion is: ')
            window.location.href = `mailto:safestep.information@gmail.com?subject=${subject}&body=${body}`
          }}
          className="mt-4 w-full py-3.5 rounded-2xl bg-neutral-900 text-white font-bold shadow-lg shadow-neutral-200 active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <Mail size={18} /> Contact SafeStep Team
        </button>
      </Card>

      <div className="px-2">
        <p className="text-[10px] text-neutral-400 leading-relaxed italic">
          Prototype note: your profile is saved locally on this device. In a future version, profiles may sync securely with your account.
        </p>
      </div>

      {/* User Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 sm:items-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold tracking-tight">Your Profile</h3>
              <button onClick={() => setIsEditingProfile(false)} className="w-8 h-8 rounded-full bg-neutral-100 grid place-items-center text-neutral-500">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Name</label>
                <input 
                  type="text" required value={tempProfile.name} onChange={e => setTempProfile(s => ({ ...s, name: e.target.value }))}
                  placeholder="e.g. Maria"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-100 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Email (Optional)</label>
                <input 
                  type="email" value={tempProfile.email} onChange={e => setTempProfile(s => ({ ...s, email: e.target.value }))}
                  placeholder="maria@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-100 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Sex (Optional)</label>
                <select 
                  value={tempProfile.sex} 
                  onChange={e => setTempProfile(s => ({ ...s, sex: e.target.value as any }))}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-100 text-sm outline-none focus:ring-2 focus:ring-brand-500 appearance-none"
                >
                  <option value="">Select option...</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                  <option value="self-describe">Self-describe</option>
                </select>
              </div>

              {tempProfile.sex === 'self-describe' && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Describe</label>
                  <input 
                    type="text" required value={tempProfile.sexCustom} onChange={e => setTempProfile(s => ({ ...s, sexCustom: e.target.value }))}
                    placeholder="How do you describe yourself?"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-100 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition mt-2 flex items-center justify-center gap-2"
              >
                <Save size={18} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Edit Modal */}
      {isEditingContact && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 sm:items-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold tracking-tight">Emergency Contact</h3>
              <button onClick={() => setIsEditingContact(false)} className="w-8 h-8 rounded-full bg-neutral-100 grid place-items-center text-neutral-500">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Name</label>
                <input 
                  type="text" 
                  value={tempContact.name}
                  onChange={e => setTempContact(s => ({ ...s, name: e.target.value }))}
                  placeholder="e.g. Mom"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-neutral-50 border border-neutral-100 focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={tempContact.phone}
                  onChange={e => setTempContact(s => ({ ...s, phone: e.target.value }))}
                  placeholder="e.g. +351 912 345 678"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-neutral-50 border border-neutral-100 focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition mt-2 flex items-center justify-center gap-2"
              >
                <Save size={18} /> Save Contact
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">{children}</div>
}
function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={18} className="text-brand-600" />
      <h2 className="font-semibold text-neutral-900">{title}</h2>
    </div>
  )
}


