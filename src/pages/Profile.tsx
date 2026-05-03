import { useState } from 'react'
import { User, SlidersHorizontal, Users, Phone, Shield, MessageSquare } from 'lucide-react'

const FACTORS = [
  { key: 'lighting', emoji: '💡', label: 'Street Lighting', initial: 80 },
  { key: 'foot',     emoji: '👣', label: 'Foot Traffic',    initial: 70 },
  { key: 'stores',   emoji: '🏪', label: 'Open Stores',     initial: 60 },
  { key: 'walk',     emoji: '🛤️', label: 'Walk Path',       initial: 50 },
  { key: 'visibility', emoji: '👁️', label: 'Visibility',    initial: 75 },
  { key: 'time',     emoji: '🌙', label: 'Time of Day',     initial: 65 },
] as const

const CONTACT_KEY = 'safestep:emergency_contact'

export function ProfilePage() {
  const [factors, setFactors] = useState(() =>
    Object.fromEntries(FACTORS.map(f => [f.key, f.initial])) as Record<string, number>,
  )

  const [contact, setContact] = useState<{ name: string; phone: string } | null>(() => {
    const saved = localStorage.getItem(CONTACT_KEY)
    return saved ? JSON.parse(saved) : null
  })

  const [isEditingContact, setIsEditingContact] = useState(false)
  const [tempContact, setTempContact] = useState({ name: '', phone: '' })

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault()
    if (tempContact.name && tempContact.phone) {
      const newContact = { ...tempContact }
      setContact(newContact)
      localStorage.setItem(CONTACT_KEY, JSON.stringify(newContact))
      setIsEditingContact(false)
    }
  }

  const startEditing = () => {
    setTempContact(contact || { name: '', phone: '' })
    setIsEditingContact(true)
  }

  return (
    <div className="p-4 flex flex-col gap-4 pb-20">
      <Card>
        <div className="flex flex-col items-center text-center py-3">
          <div className="w-16 h-16 rounded-full bg-brand-500 grid place-items-center text-white">
            <User size={28} />
          </div>
          <h2 className="font-bold mt-2 text-lg">Sarah Johnson</h2>
          <p className="text-xs text-neutral-500">SafeStep member since 2025</p>
        </div>
      </Card>

      <Card>
        <SectionHeader icon={Users} title="Emergency Contact" />
        <p className="text-sm text-neutral-500 mt-1">
          This contact will be used for SOS alerts and check-ins.
        </p>
        
        {contact ? (
          <div className="mt-4 p-4 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white grid place-items-center text-brand-600 shadow-sm">
                <Phone size={18} />
              </div>
              <div>
                <p className="font-bold text-brand-900">{contact.name}</p>
                <p className="text-xs text-brand-600 font-medium">{contact.phone}</p>
              </div>
            </div>
            <button 
              onClick={startEditing}
              className="text-xs font-bold text-brand-600 uppercase tracking-tight"
            >
              Edit
            </button>
          </div>
        ) : (
          <button 
            onClick={startEditing}
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
                <span className="font-medium">{f.emoji} {f.label}</span>
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
        <SectionHeader icon={MessageSquare} title="Help & Feedback" />
        <p className="text-sm text-neutral-500 mt-1">
          Tell us how we can improve SafeStep Lisbon.
        </p>
        <button 
          onClick={() => window.location.href = 'mailto:hello@safestep.io?subject=Feedback'}
          className="mt-4 w-full py-3.5 rounded-2xl bg-neutral-900 text-white font-bold shadow-lg shadow-neutral-200 active:scale-[0.98] transition"
        >
          Send Feedback
        </button>
      </Card>

      {/* Contact Edit Modal */}
      {isEditingContact && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 sm:items-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <h3 className="text-xl font-bold mb-6">Emergency Contact</h3>
            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Name</label>
                <input 
                  type="text" 
                  value={tempContact.name}
                  onChange={e => setTempContact(s => ({ ...s, name: e.target.value }))}
                  placeholder="e.g. Mom"
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={tempContact.phone}
                  onChange={e => setTempContact(s => ({ ...s, phone: e.target.value }))}
                  placeholder="e.g. +351 912 345 678"
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditingContact(false)}
                  className="py-3.5 rounded-2xl border-2 border-neutral-100 font-bold text-neutral-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="py-3.5 rounded-2xl bg-brand-600 text-white font-bold shadow-lg shadow-brand-500/20"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-neutral-200 bg-white p-4">{children}</div>
}
function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={18} className="text-brand-600" />
      <h2 className="font-semibold">{title}</h2>
    </div>
  )
}

