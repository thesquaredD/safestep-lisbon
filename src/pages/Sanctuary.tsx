import { useState } from 'react'
import { Coffee, Cross, Beer, Store, Search } from 'lucide-react'
import { cn } from '@/lib/cn'

type Sanctuary = {
  id: string; name: string; kind: 'cafe' | 'pharmacy' | 'bar' | 'store'
  address: string; distanceM: number; open: boolean; description: string
}

// Mock data sourced from the Lovable demo recon. Replace with Supabase fetch in step 4.
const MOCK: Sanctuary[] = [
  { id: '1', name: 'A Brasileira', kind: 'cafe', address: 'Rua Garrett 120, Chiado', distanceM: 120, open: true,
    description: 'Iconic late-night café. Staff trained in safety assistance. Open 24h.' },
  { id: '2', name: 'Farmácia Estácio', kind: 'pharmacy', address: 'Rua da Prata 35, Baixa', distanceM: 280, open: true,
    description: '24-hour pharmacy with safe waiting area and staff assistance.' },
  { id: '3', name: 'Bar Tejo', kind: 'bar', address: 'Rua dos Bacalhoeiros 12, Alfama', distanceM: 350, open: true,
    description: 'Bar with trained Ask for Angela staff. SafeStep program partner.' },
  { id: '4', name: 'Loja da Atalaia', kind: 'store', address: 'Rua da Atalaia 45, Bairro Alto', distanceM: 410, open: false,
    description: 'Female-owned boutique in Bairro Alto. SafeStep Sanctuary Network.' },
  { id: '5', name: 'Café Lisboa', kind: 'cafe', address: 'Praça do Comércio 4, Baixa', distanceM: 520, open: true,
    description: 'Open late at the heart of Lisbon. Trained staff and visible street.' },
]

const iconFor = (k: Sanctuary['kind']) => k === 'cafe' ? Coffee : k === 'pharmacy' ? Cross : k === 'bar' ? Beer : Store

export function SanctuaryPage() {
  const [filter, setFilter] = useState<'all' | 'open'>('all')
  const list = filter === 'all' ? MOCK : MOCK.filter(s => s.open)

  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">Sanctuary Network</h1>
        <p className="text-sm text-neutral-500">Vetted safe spaces near you</p>
      </div>

      <div className="flex items-center gap-2">
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>All</Chip>
        <Chip active={filter === 'open'} onClick={() => setFilter('open')}>Open Now</Chip>
      </div>

      <button className="flex items-center justify-center gap-2 rounded-full bg-brand-500 text-white py-3 font-semibold shadow-lg shadow-brand-500/30">
        <Search size={16} /> Find Nearest Sanctuary Space
      </button>

      <ul className="flex flex-col gap-3">
        {list.map((s) => {
          const Icon = iconFor(s.kind)
          return (
            <li key={s.id} className="flex gap-3 rounded-2xl border border-neutral-200 bg-white p-3">
              <span className="w-10 h-10 rounded-lg bg-brand-50 grid place-items-center text-brand-600 shrink-0">
                <Icon size={20} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{s.name}</h3>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    s.open ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500',
                  )}>{s.open ? 'Open' : 'Closed'}</span>
                </div>
                <p className="text-xs text-neutral-500">{s.address} · {s.distanceM}m</p>
                <p className="text-xs text-neutral-600 mt-1 line-clamp-2">{s.description}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm border',
        active ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-neutral-600 border-neutral-200',
      )}
    >
      {children}
    </button>
  )
}
