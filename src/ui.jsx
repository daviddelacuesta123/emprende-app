import { NavLink, useNavigate } from 'react-router'
import { ArrowLeft, CircleUser, FileText, House, Route, Sparkles } from 'lucide-react'

export const APP_NAME = 'EmprendiApp'

export function Logo({ size = 40, inverted = false, className = '' }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" className={inverted ? 'fill-white' : 'fill-pri'} />
      <path d="M16 7l2.3 6.7L25 16l-6.7 2.3L16 25l-2.3-6.7L7 16l6.7-2.3z" className={inverted ? 'fill-pri' : 'fill-white'} />
    </svg>
  )
}

export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '?'

export function Avatar({ name, size = 'size-10 text-[14px]', className = '' }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-pri font-semibold text-white ${size} ${className}`}>
      {initials(name)}
    </span>
  )
}

export function Screen({ children, className = '', bottom = 'tabs' }) {
  const pad = bottom === 'tabs' ? 'pb-28 md:pb-10' : bottom === 'cta' ? 'pb-32 md:pb-10' : 'pb-8'
  return (
    <div className={`flex min-h-dvh flex-col gap-5 px-5 pt-6 md:mx-auto md:max-w-2xl md:px-8 md:pt-8 ${pad} ${className}`}>
      {children}
    </div>
  )
}

export function BackHeader({ to, label, right }) {
  const nav = useNavigate()
  return (
    <div className="flex items-center justify-between">
      <button onClick={() => nav(to)} className="-ml-1 flex items-center gap-1.5 p-1 text-[15px] font-medium">
        <ArrowLeft size={20} strokeWidth={1.8} />
        {label}
      </button>
      {right && <span className="text-[13px] font-medium text-mut">{right}</span>}
    </div>
  )
}

export function Card({ children, className = '', as: As = 'div', ...rest }) {
  return (
    <As className={`rounded-xl border border-line bg-white ${className}`} {...rest}>
      {children}
    </As>
  )
}

export function Button({ children, variant = 'primary', className = '', ...rest }) {
  const styles = {
    primary: 'bg-pri text-white',
    secondary: 'border border-line bg-white text-ink',
    light: 'bg-acc text-ink',
    danger: 'bg-red-600 text-white',
    'danger-outline': 'border border-line bg-white text-red-600',
  }
  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-[10px] px-5 py-3.5 text-[15px] font-semibold transition active:scale-[0.98] disabled:opacity-40 ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export function BottomBar({ children }) {
  return (
    <div className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[430px] -translate-x-1/2 gap-2.5 border-t border-line bg-white px-5 pt-3 pb-[max(1.75rem,env(safe-area-inset-bottom))] md:relative md:bottom-auto md:left-auto md:mt-2 md:max-w-none md:translate-x-0 md:border-0 md:bg-transparent md:px-0 md:pb-4 md:pt-0">
      {children}
    </div>
  )
}

const TABS = [
  { to: '/', label: 'Inicio', Icon: House },
  { to: '/ruta', label: 'Ruta', Icon: Route },
  { to: '/asistente', label: 'Asistente', Icon: Sparkles, center: true },
  { to: '/plantillas', label: 'Plantillas', Icon: FileText },
  { to: '/cuenta', label: 'Cuenta', Icon: CircleUser },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-56 md:shrink-0 md:flex-col md:border-r md:border-line md:bg-white">
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-5">
        <Logo size={32} />
        <span className="text-[16px] font-bold tracking-tight">{APP_NAME}</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {TABS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14px] font-medium transition ${
                isActive ? 'bg-soft font-semibold text-ink' : 'text-mut hover:bg-soft hover:text-ink'
              }`
            }
          >
            <Icon size={20} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export function TabBar() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-5 border-t border-line bg-white px-2 pt-2.5 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:hidden">
      {TABS.map(({ to, label, Icon, center }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] ${isActive ? 'font-semibold text-pri' : 'font-medium text-mut'}`
          }
        >
          {({ isActive }) =>
            center ? (
              <>
                <span
                  className={`-mt-6 flex size-12 items-center justify-center rounded-full bg-pri text-white shadow-lg shadow-pri/25 ring-4 ring-white transition active:scale-95 ${isActive ? '' : 'opacity-95'}`}
                >
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                {label}
              </>
            ) : (
              <>
                <Icon size={22} strokeWidth={1.8} />
                {label}
              </>
            )
          }
        </NavLink>
      ))}
    </nav>
  )
}

export function ProgressBar({ value, className = '', track = 'bg-acc', bar = 'bg-pri' }) {
  return (
    <div className={`h-1.5 overflow-hidden rounded-full ${track} ${className}`}>
      <div className={`h-full rounded-full ${bar} transition-all`} style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  )
}

export function Sheet({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/30 md:items-center" onClick={onClose}>
      <div
        className="w-full max-w-[430px] rounded-t-2xl bg-white px-5 pt-3 pb-[max(1.75rem,env(safe-area-inset-bottom))] md:max-w-lg md:rounded-2xl md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-acc md:hidden" />
        {children}
      </div>
    </div>
  )
}
