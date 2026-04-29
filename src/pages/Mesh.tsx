import { useState } from 'react'
import { Radio, Wifi, EyeOff, Shield, Eye, Send } from 'lucide-react'
import { cn } from '@/lib/cn'

export function MeshPage() {
  const [enabled, setEnabled] = useState(false)

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col items-center text-center pt-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-500 grid place-items-center text-white">
          <Radio size={28} />
        </div>
        <h1 className="text-xl font-bold mt-3">Guardian Mesh</h1>
        <p className="text-sm text-neutral-500">Peer-to-peer safety network via Bluetooth</p>
      </div>

      <Card>
        <h2 className="font-semibold mb-3">How it works</h2>
        <Bullet icon={Wifi}>Connects with nearby SafeStep users via Bluetooth</Bullet>
        <Bullet icon={EyeOff}>No identity or precise location is shared — fully anonymous</Bullet>
        <Bullet icon={Shield}>In emergencies, signals relay between phones even without internet</Bullet>
      </Card>

      <div className="rounded-2xl bg-brand-50 border border-brand-100 p-4 flex gap-3">
        <Eye size={20} className="text-brand-600 shrink-0 mt-0.5" />
        <p className="text-sm text-neutral-700">
          <span className="font-semibold text-brand-700">Anonymous, no identity sharing.</span>{' '}
          Your privacy is our top priority. Only anonymized proximity data is shared.
        </p>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Guardian Mesh</h3>
            <p className="text-xs text-neutral-500">Enable to join the safety network</p>
          </div>
          <Toggle enabled={enabled} onClick={() => setEnabled(v => !v)} />
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold">Emergency Signal</h3>
        <p className="text-xs text-neutral-500 mb-3">
          Send an emergency signal that bounces between phones in internet dead zones using mesh relay.
        </p>
        <button
          disabled={!enabled}
          className={cn(
            'w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold',
            enabled ? 'bg-risk text-white' : 'bg-neutral-100 text-neutral-400',
          )}
        >
          <Send size={16} /> Send Emergency Signal
        </button>
        {!enabled && <p className="text-xs text-neutral-400 mt-2">Enable Guardian Mesh to send signals</p>}
      </Card>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-neutral-200 bg-white p-4">{children}</div>
}

function Bullet({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <span className="w-7 h-7 rounded-lg bg-brand-50 grid place-items-center text-brand-600 shrink-0">
        <Icon size={14} />
      </span>
      <span className="text-sm text-neutral-700">{children}</span>
    </div>
  )
}

function Toggle({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-12 h-7 rounded-full p-0.5 transition',
        enabled ? 'bg-brand-500' : 'bg-neutral-300',
      )}
      aria-pressed={enabled}
    >
      <span className={cn('block w-6 h-6 rounded-full bg-white transition', enabled && 'translate-x-5')} />
    </button>
  )
}
