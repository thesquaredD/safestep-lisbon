import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Map as MapIcon, Shield, Radio, BellRing, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

const steps = [
  { icon: MapIcon, title: 'Safe Routes', body: 'We analyze street lighting, foot traffic, open stores, and more to recommend the safest path home.' },
  { icon: Shield, title: 'Sanctuary Spaces', body: 'Find vetted safe places nearby — cafés, pharmacies, and bars with trained staff ready to help.' },
  { icon: Radio, title: 'Guardian Mesh', body: 'Connect anonymously with nearby SafeStep users via Bluetooth. Send emergency signals even without internet.' },
  { icon: BellRing, title: 'Enable Permissions', body: 'SafeStep needs a few permissions to keep you safe — location and notifications.' },
]

export function OnboardingPage() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const s = steps[step]
  const isLast = step === steps.length - 1
  const Icon = s.icon

  function complete() {
    localStorage.setItem('safestep:onboarded', '1')
    navigate('/map', { replace: true })
  }

  return (
    <div className="phone-frame flex flex-col h-svh bg-white px-8 pt-16 pb-10">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <span className="text-brand-600 font-bold tracking-tight text-xl mb-12">SAFESTEP</span>
        <div className="w-20 h-20 rounded-2xl bg-brand-100 grid place-items-center mb-8">
          <Icon size={36} className="text-brand-600" />
        </div>
        <h1 className="text-2xl font-bold mb-3">{s.title}</h1>
        <p className="text-neutral-600 max-w-xs leading-relaxed">{s.body}</p>
      </div>

      <div className="flex justify-center gap-1.5 mb-8" aria-hidden="true">
        {steps.map((_, i) => (
          <span key={i} className={cn(
            'h-1.5 rounded-full transition-all',
            i === step ? 'w-6 bg-brand-500' : 'w-1.5 bg-neutral-300',
          )} />
        ))}
      </div>

      <button
        onClick={() => isLast ? complete() : setStep(step + 1)}
        className="w-full py-4 rounded-full bg-brand-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30 active:scale-[.98] transition"
      >
        {isLast ? 'Get Started' : 'Continue'}
        <ChevronRight size={18} />
      </button>
      <button onClick={complete} className="mt-3 text-sm text-neutral-500">
        Skip
      </button>
    </div>
  )
}
