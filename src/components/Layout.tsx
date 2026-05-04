import { Outlet, useLocation, useNavigate, Link } from 'react-router'
import { useEffect, useState } from 'react'
import { Siren, Phone, X, User as UserIcon, AlertTriangle, MessageSquareShare, Navigation, Mail, Save } from 'lucide-react'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { DesktopShell } from './DesktopShell'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { cn } from '@/lib/cn'

const ONBOARDING_KEY = 'safestep:onboarded'
const CONTACT_KEY = 'safestep:emergency_contact'
const PROFILE_KEY = 'safestep:user_profile'
const FEEDBACK_KEY = 'safestep:local_feedback'

/**
 * Branches between two shells based on viewport.
 * Mobile: phone-frame stack (header + Outlet + bottom nav)
 * Desktop: sidebar + full-bleed main
 */
export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [contact, setContact] = useState<{ name: string; phone: string } | null>(null)

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY) && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true })
    }
  }, [location.pathname, navigate])

  // Issue 1: Show profile setup on first app visit (after onboarding)
  useEffect(() => {
    const hasOnboarded = localStorage.getItem(ONBOARDING_KEY)
    const hasProfile = localStorage.getItem(PROFILE_KEY)
    const hasDismissedSetup = sessionStorage.getItem('safestep:setup_dismissed')

    if (hasOnboarded && !hasProfile && !hasDismissedSetup && location.pathname !== '/onboarding') {
      setIsProfileModalOpen(true)
    }
  }, [location.pathname])

  // Sync contact when emergency modal opens
  useEffect(() => {
    if (isEmergencyOpen) {
      const saved = localStorage.getItem(CONTACT_KEY)
      setContact(saved ? JSON.parse(saved) : null)
    }
  }, [isEmergencyOpen])

  if (isDesktop) return (
    <>
      <DesktopShell onFeedback={() => setIsFeedbackOpen(true)} />
      {isFeedbackOpen && <FeedbackModal onClose={() => setIsFeedbackOpen(false)} />}
      {isProfileModalOpen && <ProfileSetupModal onClose={() => {
        setIsProfileModalOpen(false)
        sessionStorage.setItem('safestep:setup_dismissed', 'true')
      }} />}
    </>
  )

  const isMapPage = location.pathname === '/map'
  const isWalkPage = location.pathname === '/walk'
  const showSOS = location.pathname !== '/onboarding'

  return (
    <div className="phone-frame flex flex-col h-svh bg-surface overflow-hidden relative">
      <Header onFeedback={() => setIsFeedbackOpen(true)} />
      <main className="flex-1 overflow-y-auto relative">
        <Outlet />
        
        {/* Global SOS Button (Mobile) */}
        {showSOS && (
          <button
            onClick={() => setIsEmergencyOpen(true)}
            className={cn(
              "fixed left-4 z-40 w-14 h-14 rounded-full bg-risk text-white grid place-items-center shadow-lg shadow-red-500/40 active:scale-90 transition-transform",
              (isMapPage || isWalkPage) ? "bottom-24" : "bottom-20"
            )}
            aria-label="Emergency SOS"
          >
            <Siren size={28} className="animate-pulse" />
          </button>
        )}

        {/* Global Feedback Button (Mobile Floating) */}
        {showSOS && (
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className={cn(
              "fixed right-4 z-40 w-12 h-12 rounded-full bg-neutral-900 text-white grid place-items-center shadow-lg shadow-black/20 active:scale-90 transition-transform",
              (isMapPage || isWalkPage) ? "bottom-24" : "bottom-20"
            )}
            aria-label="Give Feedback"
            title="Give Feedback"
          >
            <MessageSquareShare size={20} />
          </button>
        )}
      </main>
      <BottomNav />

      {/* Feedback Modal */}
      {isFeedbackOpen && (
        <FeedbackModal onClose={() => setIsFeedbackOpen(false)} />
      )}

      {/* Profile Setup Modal (First visit) */}
      {isProfileModalOpen && (
        <ProfileSetupModal onClose={() => {
          setIsProfileModalOpen(false)
          sessionStorage.setItem('safestep:setup_dismissed', 'true')
        }} />
      )}

      {/* Emergency Modal */}
      {isEmergencyOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-md p-4 sm:items-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 grid place-items-center font-bold">
                  <AlertTriangle size={24} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Emergency</h2>
              </div>
              <button 
                onClick={() => setIsEmergencyOpen(false)}
                className="w-10 h-10 rounded-full bg-neutral-100 grid place-items-center text-neutral-500 hover:bg-neutral-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <a 
                href="tel:112"
                className="flex items-center justify-between p-5 rounded-2xl bg-risk text-white shadow-lg shadow-red-500/20 active:scale-[0.98] transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 grid place-items-center">
                    <Phone size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xl leading-none">Call 112</p>
                    <p className="text-red-100 text-sm mt-1">Police & Emergency</p>
                  </div>
                </div>
              </a>

              {contact ? (
                <a 
                  href={`tel:${contact.phone}`}
                  className="flex items-center justify-between p-5 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/20 active:scale-[0.98] transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 grid place-items-center">
                      <UserIcon size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-xl leading-none">Call {contact.name}</p>
                      <p className="text-brand-100 text-sm mt-1">Emergency Contact</p>
                    </div>
                  </div>
                </a>
              ) : (
                <Link 
                  to="/profile" 
                  onClick={() => setIsEmergencyOpen(false)}
                  className="flex items-center justify-between p-5 rounded-2xl border-2 border-dashed border-neutral-200 text-neutral-500 hover:border-brand-200 hover:text-brand-600 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neutral-50 grid place-items-center">
                      <UserIcon size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg leading-none">Add Emergency Contact</p>
                      <p className="text-xs mt-1 text-neutral-400">Set this up in your Profile</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            <p className="text-center text-xs text-neutral-400 mt-8 leading-relaxed italic border-t border-neutral-100 pt-4">
              SafeStep is a prototype. In a real emergency, always call local authorities immediately.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState(() => {
    const profileRaw = localStorage.getItem(PROFILE_KEY)
    const profile = profileRaw ? JSON.parse(profileRaw) : null
    return {
      name: profile?.name || '',
      email: profile?.email || '',
      confused: '',
      useful: '',
      nightUse: 'maybe' as 'yes' | 'maybe' | 'no',
      comments: ''
    }
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const existingRaw = localStorage.getItem(FEEDBACK_KEY)
    const existing = existingRaw ? JSON.parse(existingRaw) : []
    const newFeedback = { ...form, id: Date.now(), created_at: new Date().toISOString() }
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify([newFeedback, ...existing]))
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/60 backdrop-blur-md p-4 sm:items-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 grid place-items-center">
              <MessageSquareShare size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Give feedback</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-neutral-100 grid place-items-center text-neutral-500 hover:bg-neutral-200 transition">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full grid place-items-center mx-auto">
              <Navigation size={32} />
            </div>
            <h3 className="text-lg font-bold">Thank you!</h3>
            <p className="text-sm text-neutral-600 leading-relaxed px-4">
              Your feedback was saved on this device for the prototype.
            </p>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg active:scale-[0.98] transition"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Name</label>
                <input 
                  type="text" required value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Email (Optional)</label>
                <input 
                  type="email" value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">What confused you?</label>
              <textarea 
                required value={form.confused} onChange={e => setForm(s => ({ ...s, confused: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-sm outline-none focus:ring-2 focus:ring-brand-500 min-h-[60px]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">What felt useful?</label>
              <textarea 
                required value={form.useful} onChange={e => setForm(s => ({ ...s, useful: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-sm outline-none focus:ring-2 focus:ring-brand-500 min-h-[60px]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Would you use this at night?</label>
              <div className="grid grid-cols-3 gap-2">
                {(['yes', 'maybe', 'no'] as const).map(val => (
                  <button
                    key={val} type="button"
                    onClick={() => setForm(s => ({ ...s, nightUse: val }))}
                    className={cn(
                      "py-2 rounded-xl border text-xs font-bold capitalize transition-all",
                      form.nightUse === val ? "bg-brand-500 border-brand-500 text-white shadow-sm" : "bg-neutral-50 border-neutral-100 text-neutral-600"
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Any other comments?</label>
              <textarea 
                value={form.comments} onChange={e => setForm(s => ({ ...s, comments: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-sm outline-none focus:ring-2 focus:ring-brand-500 min-h-[60px]"
              />
            </div>

            <p className="text-[10px] text-neutral-400 leading-relaxed italic border-t border-neutral-100 pt-3">
              Prototype note: feedback and reports are saved locally on this device. In the next version, they will be synced to the SafeStep database.
            </p>

            <div className="pt-2 space-y-3">
              <button 
                type="submit"
                className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition"
              >
                Submit Feedback
              </button>
              <button 
                type="button"
                onClick={() => {
                  const subject = encodeURIComponent('SafeStep feedback / collaboration')
                  const body = encodeURIComponent('Hi SafeStep team,\n\nI would like to help improve the app.\n\nMy suggestion is: ')
                  window.location.href = `mailto:safestep.information@gmail.com?subject=${subject}&body=${body}`
                }}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 transition"
              >
                <Mail size={14} /> Want to help us improve? Contact us
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function ProfileSetupModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    sex: '' as any,
    sexCustom: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem(PROFILE_KEY, JSON.stringify(form))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center bg-black/60 backdrop-blur-md p-4 sm:items-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 grid place-items-center">
              <UserIcon size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your Profile</h2>
              <p className="text-xs text-neutral-500 font-medium">Personalize your SafeStep experience</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-neutral-100 grid place-items-center text-neutral-500 hover:bg-neutral-200 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
            <input 
              type="text" required value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
              placeholder="e.g. Maria Silva"
              className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Email (Optional)</label>
            <input 
              type="email" value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
              placeholder="maria@example.com"
              className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Sex (Optional)</label>
            <select 
              value={form.sex} 
              onChange={e => setForm(s => ({ ...s, sex: e.target.value as any }))}
              className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 text-sm outline-none focus:ring-2 focus:ring-brand-500 appearance-none transition-all"
            >
              <option value="">Select option...</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
              <option value="self-describe">Self-describe</option>
            </select>
          </div>

          {form.sex === 'self-describe' && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Describe</label>
              <input 
                type="text" required value={form.sexCustom} onChange={e => setForm(s => ({ ...s, sexCustom: e.target.value }))}
                placeholder="How do you describe yourself?"
                className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
            </div>
          )}

          <p className="text-[10px] text-neutral-400 leading-relaxed italic border-t border-neutral-100 pt-4">
            Prototype note: your profile is saved locally on this device. In a future version, profiles may sync securely with your account.
          </p>

          <button 
            type="submit"
            className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition mt-2 flex items-center justify-center gap-2"
          >
            <Save size={18} /> Continue to app
          </button>
        </form>
      </div>
    </div>
  )
}
