import { useState } from 'react'
import { User, SlidersHorizontal, Users } from 'lucide-react'

const FACTORS = [
  { key: 'lighting', emoji: '💡', label: 'Street Lighting', initial: 80 },
  { key: 'foot',     emoji: '👣', label: 'Foot Traffic',    initial: 70 },
  { key: 'stores',   emoji: '🏪', label: 'Open Stores',     initial: 60 },
  { key: 'walk',     emoji: '🛤️', label: 'Walk Path',       initial: 50 },
  { key: 'visibility', emoji: '👁️', label: 'Visibility',    initial: 75 },
  { key: 'time',     emoji: '🌙', label: 'Time of Day',     initial: 65 },
] as const

const CONTACTS = [
  { name: 'Mom', phone: '(555) 123-4567' },
  { name: 'Best Friend', phone: '(555) 987-6543' },
]

export function ProfilePage() {
  const [factors, setFactors] = useState(() =>
    Object.fromEntries(FACTORS.map(f => [f.key, f.initial])) as Record<string, number>,
  )

  return (
    <div className="p-4 flex flex-col gap-4">
      <Card>
        <div className="flex flex-col items-center text-center py-3">
          <div className="w-16 h-16 rounded-full bg-brand-500 grid place-items-center text-white">
            <User size={28} />
          </div>
          <h2 className="font-bold mt-2">Sarah Johnson</h2>
          <p className="text-xs text-neutral-500">SafeStep member since 2025</p>
        </div>
      </Card>

      <Card>
        <SectionHeader icon={SlidersHorizontal} title="Safety Factor Priorities" />
        <p className="text-sm text-neutral-500 mt-1">
          Adjust how important each factor is for your route scoring.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          {FACTORS.map(f => (
            <div key={f.key}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span>{f.emoji} {f.label}</span>
                <span className="text-neutral-500 tabular-nums">{factors[f.key]}%</span>
              </div>
              <input
                type="range" min={0} max={100}
                value={factors[f.key]}
                onChange={(e) => setFactors(s => ({ ...s, [f.key]: Number(e.target.value) }))}
                className="w-full accent-brand-500"
              />
            </div>
          ))}
        </div>
        <p className="text-xs italic text-neutral-400 mt-3">Based on safety studies</p>
      </Card>

      <Card>
        <SectionHeader icon={Users} title="Emergency Contacts" />
        <ul className="mt-3 flex flex-col gap-2.5">
          {CONTACTS.map(c => (
            <li key={c.name} className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-brand-50 grid place-items-center text-brand-600">
                <User size={14} />
              </span>
              <span className="text-sm">{c.name} — {c.phone}</span>
            </li>
          ))}
        </ul>
        <button className="mt-3 text-sm text-brand-600 font-medium">+ Add Contact</button>
      </Card>
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
